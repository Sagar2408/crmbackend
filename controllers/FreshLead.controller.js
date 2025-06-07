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
// 📌 Get ClientLead by FreshLead's leadId (from req.body)
const getClientLeadByFreshLead = async (req, res) => {
  try {
    const { FreshLead, Lead, ClientLead } = req.db; // ✅ Dynamic DB
    const { leadId } = req.body;

    if (!leadId) {
      return res.status(400).json({ error: "leadId is required in request body" });
    }

    // Find the FreshLead using leadId
    const freshLead = await FreshLead.findOne({ where: { leadId } });
    if (!freshLead) {
      return res.status(404).json({ error: "FreshLead not found for given leadId" });
    }

    // Find the Lead
    const lead = await Lead.findByPk(leadId);
    if (!lead) {
      return res.status(404).json({ error: "Lead not found" });
    }

    // Find the ClientLead
    const clientLead = await ClientLead.findByPk(lead.clientLeadId);
    if (!clientLead) {
      return res.status(404).json({ error: "ClientLead not found for this lead" });
    }

    return res.status(200).json({ data: clientLead });
  } catch (error) {
    console.error("Error fetching ClientLead by FreshLead leadId:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// 📌 Full update of ClientLead using leadId from FreshLead table
const updateFullClientLeadByFreshLead = async (req, res) => {
  try {
    const { FreshLead, Lead, ClientLead } = req.db; // ✅ Dynamic DB
    const {
      leadId,
      name,
      email,
      phone,
      education,
      experience,
      state,
      country,
      dob,
      leadAssignDate,
      countryPreference,
      assignedToExecutive,
      status,
    } = req.body;

    if (!leadId) {
      return res.status(400).json({ error: "leadId is required in request body" });
    }

    // Step 1: Check FreshLead
    const freshLead = await FreshLead.findOne({ where: { leadId } });
    if (!freshLead) {
      return res.status(404).json({ error: "FreshLead not found for the given leadId" });
    }

    // Step 2: Find Lead
    const lead = await Lead.findByPk(leadId);
    if (!lead) {
      return res.status(404).json({ error: "Lead not found" });
    }

    // Step 3: Find ClientLead
    const clientLead = await ClientLead.findByPk(lead.clientLeadId);
    if (!clientLead) {
      return res.status(404).json({ error: "ClientLead not found for this lead" });
    }

    // Step 4: Update all fields if provided
    if (name !== undefined) clientLead.name = name;
    if (email !== undefined) clientLead.email = email;
    if (phone !== undefined) clientLead.phone = phone;
    if (education !== undefined) clientLead.education = education;
    if (experience !== undefined) clientLead.experience = experience;
    if (state !== undefined) clientLead.state = state;
    if (country !== undefined) clientLead.country = country;
    if (dob !== undefined) clientLead.dob = dob;
    if (leadAssignDate !== undefined) clientLead.leadAssignDate = leadAssignDate;
    if (countryPreference !== undefined) clientLead.countryPreference = countryPreference;
    if (assignedToExecutive !== undefined) clientLead.assignedToExecutive = assignedToExecutive;
    if (status !== undefined) clientLead.status = status;

    await clientLead.save();

    return res
      .status(200)
      .json({ message: "ClientLead updated successfully", data: clientLead });
  } catch (error) {
    console.error("Error updating ClientLead by FreshLead leadId:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  createFreshLead,
  updateFollowUp,
  getFreshLeadsByExecutive,
  getClientLeadByFreshLead,
  updateFullClientLeadByFreshLead
};
