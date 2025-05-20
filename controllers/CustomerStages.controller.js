const createCustomerStages = async (req, res) => {
  try {
    const CustomerStages = req.db.CustomerStages;
    const customerId = req.user?.id;

    if (!customerId) {
      return res
        .status(401)
        .json({ error: "Unauthorized: Customer ID missing" });
    }

    // Check if a record already exists
    const existing = await CustomerStages.findOne({ where: { customerId } });
    if (existing) {
      return res.status(400).json({ error: "Customer stages already exist" });
    }

    // Create a new record
    const data = await CustomerStages.create({
      customerId,
      ...req.body,
    });

    return res.status(201).json({
      message: "Customer stages created successfully",
      data,
    });
  } catch (error) {
    console.error("Create error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const getCustomerStages = async (req, res) => {
  try {
    const CustomerStages = req.db.CustomerStages;
    const customerId = req.user?.id;

    if (!customerId) {
      return res
        .status(401)
        .json({ error: "Unauthorized: Customer ID missing" });
    }

    const data = await CustomerStages.findOne({ where: { customerId } });

    if (!data) {
      return res.status(404).json({ error: "Customer stages not found" });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error("Fetch error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const updateCustomerStages = async (req, res) => {
  try {
    const CustomerStages = req.db.CustomerStages;
    const customerId = req.user?.id;

    if (!customerId) {
      return res
        .status(401)
        .json({ error: "Unauthorized: Customer ID missing" });
    }

    const [updated] = await CustomerStages.update(req.body, {
      where: { customerId },
    });

    if (updated === 0) {
      return res
        .status(404)
        .json({ error: "No customer stages found to update" });
    }

    return res.status(200).json({
      message: "Customer stages updated successfully",
    });
  } catch (error) {
    console.error("Update error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  createCustomerStages,
  getCustomerStages,
  updateCustomerStages,
};
