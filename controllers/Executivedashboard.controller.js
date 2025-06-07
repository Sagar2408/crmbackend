const { Sequelize } = require("sequelize");

const getExecutiveStats = async (req, res) => {
  try {
    const { FreshLead, FollowUp, ConvertedClient, Lead, ClientLead } = req.db;
    const executiveName = req.user.username;

    if (!executiveName) {
      return res.status(400).json({
        success: false,
        message: "Executive name missing from token.",
      });
    }

    let freshLeadsCount = 0;
    let freshLeadsData = [];
    let followUpsCount = 0;
    let followUpsData = [];
    let convertedClientCount = 0;
    let convertedClientsData = [];

    // ✅ Fresh Leads
    try {
      const freshLeads = await FreshLead.findAll({
        include: [
          {
            model: Lead,
            as: "lead",
            required: true,
            include: [
              {
                model: ClientLead,
                as: "clientLead",
                where: {
                  assignedToExecutive: executiveName,
                  status: { [Sequelize.Op.in]: ["Assigned"] },
                },
                required: true,
              },
            ],
          },
        ],
      });
      freshLeadsData = freshLeads;
      freshLeadsCount = freshLeads.length;
    } catch (error) {
      console.error("Error fetching FreshLeads:", error);
    }

    // ✅ Follow Ups
    try {
      const followUps = await FollowUp.findAll({
        include: [
          {
            model: FreshLead,
            as: "freshLead",
            required: true,
            include: [
              {
                model: Lead,
                as: "lead",
                required: true,
                include: [
                  {
                    model: ClientLead,
                    as: "clientLead",
                    where: {
                      assignedToExecutive: executiveName,
                      status: "Follow-Up",
                    },
                    required: true,
                  },
                ],
              },
            ],
          },
        ],
      });
      followUpsData = followUps;
      followUpsCount = followUps.length;
    } catch (error) {
      console.error("Error fetching FollowUps:", error);
    }

    // ✅ Converted Clients
    try {
      const convertedClients = await ConvertedClient.findAll({
        include: [
          {
            model: FreshLead,
            as: "freshLead",
            required: true,
            include: [
              {
                model: Lead,
                as: "lead",
                required: true,
                include: [
                  {
                    model: ClientLead,
                    as: "clientLead",
                    where: {
                      assignedToExecutive: executiveName,
                      status: "Converted",
                    },
                    required: true,
                  },
                ],
              },
            ],
          },
        ],
      });
      convertedClientsData = convertedClients;
      convertedClientCount = convertedClients.length;
    } catch (error) {
      console.error("Error fetching ConvertedClients:", error);
    }

    res.status(200).json({
      success: true,
      data: {
        freshLeads: {
          count: freshLeadsCount,
          records: freshLeadsData,
        },
        followUps: {
          count: followUpsCount,
          records: followUpsData,
        },
        convertedClients: {
          count: convertedClientCount,
          records: convertedClientsData,
        },
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
