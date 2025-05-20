// 📌 Create a fresh lead
const createFreshLead = async (req, res) => {
  try {
    const { FreshLead, Lead, ClientLead } = req.db; // ✅ Dynamic DB
    const { leadId } = req.body;

    const lead = await Lead.findByPk(leadId);
    if (!lead) {
      return res.status(404).json({ error: "Lead not found" });
    }

    const clientLead = await ClientLead.findByPk(lead.clientLeadId);
    if (!clientLead) {
      return res.status(404).json({ error: "Client lead not found" });
    }

    const newFreshLead = await FreshLead.create({
      leadId: lead.id,
      name: clientLead.name,
      email: clientLead.email,
      phone: clientLead.phone,
      status: lead.status,
    });

    return res
      .status(201)
      .json({ message: "Fresh lead created", data: newFreshLead });
  } catch (error) {
    console.error("Error creating fresh lead:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// 📌 Update follow-up info on a fresh lead
const updateFollowUp = async (req, res) => {
  const { id } = req.params;
  const { followUpDate, followUpStatus } = req.body;

  try {
    const FreshLead = req.db.FreshLead; // ✅ Dynamic DB

    const lead = await FreshLead.findByPk(id);
    if (!lead) {
      return res.status(404).json({ error: "FreshLead not found" });
    }

    if (followUpDate !== undefined) lead.followUpDate = followUpDate;
    if (followUpStatus !== undefined) lead.followUpStatus = followUpStatus;

    await lead.save();

    return res.json({ message: "Follow-up updated successfully", data: lead });
  } catch (error) {
    console.error("Error updating follow-up:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// 📌 Get all fresh leads assigned to the logged-in executive
const getFreshLeadsByExecutive = async (req, res) => {
  const executiveUsername = req.user?.username;

  if (!executiveUsername) {
    return res
      .status(401)
      .json({ error: "Unauthorized: Executive username missing in token" });
  }

  try {
    const { FreshLead, Lead, ClientLead } = req.db; // ✅ Dynamic DB

    const freshLeads = await FreshLead.findAll({
      include: [
        {
          model: Lead,
          as: "lead",
          where: { assignedToExecutive: executiveUsername },
          attributes: ["id", "assignedToExecutive", "assignmentDate"],
          include: [
            {
              model: ClientLead,
              as: "clientLead",
              attributes: ["id", "status", "name", "email"],
            },
          ],
        },
      ],
    });

    if (freshLeads.length === 0) {
      return res
        .status(404)
        .json({ message: "No fresh leads found for this executive" });
    }

    const response = freshLeads.map((freshLead) => {
      const lead = freshLead.lead;
      const clientLead = lead?.clientLead;

      return {
        ...freshLead.toJSON(),
        clientLead: clientLead
          ? {
              id: clientLead.id,
              name: clientLead.name,
              email: clientLead.email,
              status: clientLead.status,
            }
          : null,
      };
    });

    return res.status(200).json({ data: response });
  } catch (error) {
    console.error("Error fetching fresh leads by executive:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  createFreshLead,
  updateFollowUp,
  getFreshLeadsByExecutive,
};
