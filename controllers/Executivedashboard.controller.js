const getExecutiveStats = async (req, res) => {
  try {
    const { FreshLead, FollowUp, ConvertedClient, Lead } = req.db;
    const executiveName = req.user.username;

    if (!executiveName) {
      return res.status(400).json({
        success: false,
        message: "Executive name missing from token.",
      });
    }

    let freshLeadsCount = 0;
    let followUpsCount = 0;
    let convertedClientCount = 0;

    // Fresh Leads Count (linked Lead must be assigned to this executive)
    try {
      freshLeadsCount = await FreshLead.count({
        include: [
          {
            model: Lead,
            as: "lead",
            where: { assignedToExecutive: executiveName },
            required: true, // ✅ ensures filtering works
          },
        ],
      });
    } catch (error) {
      console.error(`Error counting FreshLeads:`, error);
    }

    // Follow Ups Count (linked FreshLead -> Lead must match executive)
    try {
      followUpsCount = await FollowUp.count({
        include: [
          {
            model: FreshLead,
            as: "freshLead",
            required: true,
            include: [
              {
                model: Lead,
                as: "lead",
                where: { assignedToExecutive: executiveName },
                required: true, // ✅ nested required
              },
            ],
          },
        ],
      });
    } catch (error) {
      console.error(`Error counting FollowUps:`, error);
    }

    // Converted Clients Count (linked FreshLead -> Lead must match executive)
    try {
      convertedClientCount = await ConvertedClient.count({
        include: [
          {
            model: FreshLead,
            as: "freshLead",
            required: true,
            include: [
              {
                model: Lead,
                as: "lead",
                where: { assignedToExecutive: executiveName },
                required: true, // ✅ nested required
              },
            ],
          },
        ],
      });
    } catch (error) {
      console.error(`Error counting ConvertedClients:`, error);
    }

    res.status(200).json({
      success: true,
      data: {
        freshLeads: freshLeadsCount,
        followUps: followUpsCount,
        convertedClients: convertedClientCount,
      },
    });
  } catch (error) {
    console.error("Executive stats error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

module.exports = {
  getExecutiveStats,
};
