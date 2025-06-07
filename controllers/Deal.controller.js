// 📌 Get all deals
exports.getAllDeals = async (req, res) => {
  try {
    const { Deal, Lead } = req.db; // ✅ Dynamic DB models

    const deals = await Deal.findAll({
      include: [{ model: Lead, attributes: ["name", "email"] }],
    });

    res.status(200).json(deals);
  } catch (error) {
    console.error("Error fetching deals:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// 📌 Get deal by ID
exports.getDealById = async (req, res) => {
  try {
    const { Deal, Lead } = req.db; // ✅ Dynamic DB models

    const deal = await Deal.findByPk(req.params.id, {
      include: [{ model: Lead, attributes: ["name", "email"] }],
    });

    if (!deal) return res.status(404).json({ message: "Deal not found" });

    res.status(200).json(deal);
  } catch (error) {
    console.error("Error fetching deal:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// 📌 Create a new deal
exports.createDeal = async (req, res) => {
  try {
    const { Deal, Lead } = req.db; // ✅ Dynamic DB models

    const { leadId, revenue, profit, status } = req.body;

    const lead = await Lead.findByPk(leadId);
    if (!lead) return res.status(404).json({ message: "Lead not found" });

    const deal = await Deal.create({ leadId, revenue, profit, status });
    res.status(201).json(deal);
  } catch (error) {
    console.error("Error creating deal:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// 📌 Update a deal
exports.updateDeal = async (req, res) => {
  try {
    const { Deal } = req.db; // ✅ Dynamic DB model

    const { leadId, revenue, profit, status } = req.body;

    let deal = await Deal.findByPk(req.params.id);
    if (!deal) return res.status(404).json({ message: "Deal not found" });

    await deal.update({ leadId, revenue, profit, status });
    res.status(200).json(deal);
  } catch (error) {
    console.error("Error updating deal:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// 📌 Delete a deal
exports.deleteDeal = async (req, res) => {
  try {
    const { Deal } = req.db; // ✅ Dynamic DB model

    const deal = await Deal.findByPk(req.params.id);
    if (!deal) return res.status(404).json({ message: "Deal not found" });

    await deal.destroy();
    res.status(200).json({ message: "Deal deleted successfully" });
  } catch (error) {
    console.error("Error deleting deal:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
