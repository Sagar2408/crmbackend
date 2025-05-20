const { Lead, Deal } = require("../config/sequelize");

// 📌 Get all leads
exports.getAllLeads = async (req, res) => {
  try {
    const Lead = req.db.Lead;
    const Deal = req.db.Deal;

    const leads = await Lead.findAll({
      include: [{ model: Deal, attributes: ["revenue", "profit", "status"] }],
    });

    res.status(200).json(leads);
  } catch (error) {
    console.error("Error fetching leads:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// 📌 Get lead by ID
exports.getLeadById = async (req, res) => {
  try {
    const Lead = req.db.Lead;
    const { leadId } = req.params;

    const lead = await Lead.findByPk(leadId);

    if (!lead) {
      return res
        .status(404)
        .json({ message: `Lead with ID ${leadId} not found` });
    }

    res.json(lead);
  } catch (error) {
    console.error("Error fetching lead:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// 📌 Create a new lead
exports.createLead = async (req, res) => {
  try {
    const Lead = req.db.Lead;
    const { email, assignedToExecutive, clientLeadId } = req.body;

    if (!clientLeadId || !assignedToExecutive) {
      return res.status(400).json({
        message: "clientLeadId and assignedToExecutive are required.",
      });
    }

    const existingLead = await Lead.findOne({
      where: {
        clientLeadId,
        assignedToExecutive,
      },
    });

    if (existingLead) {
      return res.status(409).json({
        message:
          "Lead with this clientLeadId is already assigned to this executive.",
      });
    }

    const lead = await Lead.create({
      email,
      status: "Assigned",
      assignedToExecutive,
      clientLeadId,
    });

    res.status(201).json(lead);
  } catch (error) {
    console.error("Error creating lead:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// 📌 Update a lead
exports.updateLead = async (req, res) => {
  try {
    const Lead = req.db.Lead;
    const { name, email, phone, status } = req.body;

    const lead = await Lead.findByPk(req.params.id);
    if (!lead) return res.status(404).json({ message: "Lead not found" });

    await lead.update({ name, email, phone, status });

    res.status(200).json(lead);
  } catch (error) {
    console.error("Error updating lead:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// 📌 Delete a lead
exports.deleteLead = async (req, res) => {
  try {
    const Lead = req.db.Lead;

    const lead = await Lead.findByPk(req.params.id);
    if (!lead) return res.status(404).json({ message: "Lead not found" });

    await lead.destroy();

    res.status(200).json({ message: "Lead deleted successfully" });
  } catch (error) {
    console.error("Error deleting lead:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// 📌 Reassign a lead
exports.reassignLead = async (req, res) => {
  try {
    const Lead = req.db.Lead;
    const { leadId, newExecutive } = req.body;

    const lead = await Lead.findByPk(leadId);
    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    const previousAssignedTo = lead.assignedToExecutive;

    lead.assignedToExecutive = newExecutive;
    await lead.save();

    res.json({
      message: "Lead reassigned successfully",
      lead: {
        ...lead.toJSON(),
        previousAssignedTo,
      },
    });
  } catch (error) {
    console.error("Error reassigning lead:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
