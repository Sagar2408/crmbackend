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

exports.reassignLead = async (req, res) => {
  console.log('🚀 [API] /api/leads/reassign hit');

  try {
    const { clientLeadId, newExecutive } = req.body;
    console.log('🔧 Payload:', { clientLeadId, newExecutive });

    const {
      Lead,
      ClientLead,
      FollowUp,
      FollowUpHistory,
      Meeting,
      FreshLead,
    } = req.db;

    if (!clientLeadId || !newExecutive) {
      return res.status(400).json({ message: "clientLeadId and newExecutive are required" });
    }

    // 🔍 Find Lead using clientLeadId
    const lead = await Lead.findOne({ where: { clientLeadId } });
    if (!lead) {
      console.log(`❌ Lead not found for clientLeadId: ${clientLeadId}`);
      return res.status(404).json({ message: "Lead not found for provided clientLeadId" });
    }

    // 🚫 Prevent reassignment to same or previous executive
    if (
      lead.assignedToExecutive === newExecutive ||
      lead.previousAssignedTo === newExecutive
    ) {
      console.log(`⚠️ Lead (clientLeadId: ${clientLeadId}) is or was already assigned to ${newExecutive}`);
      return res.status(400).json({
        message: `This lead is or was already assigned to ${newExecutive}. Reassignment not allowed.`,
      });
    }

    // ✅ Reassign
    console.log(`✅ Reassigning Lead (clientLeadId: ${clientLeadId}) from ${lead.assignedToExecutive} to ${newExecutive}`);
    lead.previousAssignedTo = lead.assignedToExecutive;
    lead.assignedToExecutive = newExecutive;
    lead.assignmentDate = new Date();
    await lead.save();

    // 🔄 Update ClientLead
    const clientLead = await ClientLead.findByPk(clientLeadId);
    let clientLeadUpdate = null;
    if (clientLead) {
      clientLead.assignedToExecutive = newExecutive;
      clientLead.status = 'Assigned';
      await clientLead.save();
      clientLeadUpdate = clientLead.toJSON();
      console.log('📝 Updated clientLead:', clientLeadUpdate);
    }

    // 🗑 Cleanup followups, histories, and meetings via FreshLead
    const freshLeads = await FreshLead.findAll({ where: { leadId: lead.id } });
    const freshLeadIds = freshLeads.map(f => f.id);

    if (freshLeadIds.length > 0) {
      await Promise.all([
        FollowUp.destroy({ where: { fresh_lead_id: freshLeadIds } }),
        FollowUpHistory.destroy({ where: { fresh_lead_id: freshLeadIds } }),
        Meeting.destroy({ where: { fresh_lead_id: freshLeadIds } }),
      ]);
      console.log(`🗑 Deleted followups, histories, and meetings for FreshLeads linked to Lead ID ${lead.id}`);
    }

    // ✅ Final Response
    res.json({
      message: "Lead reassigned successfully",
      lead: lead.toJSON(),
      reassignment: {
        previousAssignedTo: lead.previousAssignedTo,
        newAssignedTo: newExecutive,
      },
      clientLeadUpdate,
    });

  } catch (error) {
    console.error("🔥 Error reassigning lead:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};


