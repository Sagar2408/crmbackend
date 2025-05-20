const { Opportunity } = require("../config/sequelize");

// 📌 Get all opportunities
const getAllOpportunities = async (req, res) => {
  try {
    const Opportunity = req.db.Opportunity; // ✅ Dynamic DB
    const opportunities = await Opportunity.findAll();
    res.status(200).json(opportunities);
  } catch (error) {
    console.error("Error fetching opportunities:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// 📌 Get opportunity by ID
const getOpportunityById = async (req, res) => {
  try {
    const Opportunity = req.db.Opportunity; // ✅ Dynamic DB
    const opportunity = await Opportunity.findByPk(req.params.id);

    if (!opportunity) {
      return res.status(404).json({ message: "Opportunity not found" });
    }

    res.status(200).json(opportunity);
  } catch (error) {
    console.error("Error fetching opportunity:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// 📌 Create a new opportunity
const createOpportunity = async (req, res) => {
  try {
    const Opportunity = req.db.Opportunity; // ✅ Dynamic DB
    const { leadId, stage } = req.body;

    const opportunity = await Opportunity.create({ leadId, stage });
    res.status(201).json(opportunity);
  } catch (error) {
    console.error("Error creating opportunity:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// 📌 Update an opportunity
const updateOpportunity = async (req, res) => {
  try {
    const Opportunity = req.db.Opportunity; // ✅ Dynamic DB
    const { leadId, stage } = req.body;

    const opportunity = await Opportunity.findByPk(req.params.id);
    if (!opportunity) {
      return res.status(404).json({ message: "Opportunity not found" });
    }

    await opportunity.update({ leadId, stage });
    res.status(200).json(opportunity);
  } catch (error) {
    console.error("Error updating opportunity:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// 📌 Delete an opportunity
const deleteOpportunity = async (req, res) => {
  try {
    const Opportunity = req.db.Opportunity; // ✅ Dynamic DB
    const opportunity = await Opportunity.findByPk(req.params.id);
    if (!opportunity) {
      return res.status(404).json({ message: "Opportunity not found" });
    }

    await opportunity.destroy();
    res.status(200).json({ message: "Opportunity deleted successfully" });
  } catch (error) {
    console.error("Error deleting opportunity:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
module.exports = {
  getAllOpportunities,
  getOpportunityById,
  createOpportunity,
  updateOpportunity,
  deleteOpportunity,
};
