const createCustomerStages = async (req, res) => {
  try {
    const { Customer, CustomerStages } = req.db; // ✅ Correct model name
    const { customerId, ...rest } = req.body;

    // ✅ 1. Authorization check
    if (!customerId) {
      return res
        .status(400)
        .json({ error: "Customer ID is required in the request body" });
    }

    // ✅ 2. DEBUG: Log customerId to verify
    console.log("Creating stage for customerId:", customerId);

    // ✅ 3. Check if the customer actually exists
    const customer = await Customer.findByPk(customerId);
    if (!customer) {
      console.log("Customer not found in database.");
      return res.status(400).json({ error: "Customer does not exist" });
    }

    // ✅ 4. Prevent duplicate customer stage record
    const existing = await CustomerStages.findOne({ where: { customerId } });
    if (existing) {
      return res.status(400).json({ error: "Customer stages already exist" });
    }

    // Create a new record
    const data = await CustomerStages.create({ customerId, ...rest });

    return res.status(201).json({
      message: "Customer stages created successfully",
      data,
    });
  } catch (error) {
    console.error("Create error:", {
      message: error.message,
      stack: error.stack,
      sql: error?.sql,
    });
    return res.status(500).json({ error: "Internal server error" });
  }
};

const getCustomerStages = async (req, res) => {
  try {
    const { Customer, CustomerStages } = req.db;
    const customerId = req.user?.id;

    if (!customerId) {
      return res
        .status(401)
        .json({ error: "Unauthorized: Customer ID missing" });
    }

    // Optional: Check if customer exists (good for extra safety)
    const customer = await Customer.findByPk(customerId);
    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    const data = await CustomerStages.findOne({ where: { customerId } });

    if (!data) {
      return res.status(404).json({ error: "Customer stages not found" });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error("Fetch error:", {
      message: error.message,
      stack: error.stack,
      sql: error?.sql,
    });
    return res.status(500).json({ error: "Internal server error" });
  }
};
const updateCustomerStages = async (req, res) => {
  try {
    const { Customer, CustomerStages } = req.db;
    const { customerId, ...rest } = req.body;

    if (!customerId) {
      return res
        .status(400)
        .json({ error: "Customer ID is required in the request body" });
    }

    // Check if the customer actually exists
    const customer = await Customer.findByPk(customerId);
    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    const [updated] = await CustomerStages.update(rest, {
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
    console.error("Update error:", {
      message: error.message,
      stack: error.stack,
      sql: error?.sql,
    });
    return res.status(500).json({ error: "Internal server error" });
  }
};

const getCustomerStagesById = async (req, res) => {
  try {
    const { Customer, CustomerStages } = req.db;

    // Accept customerId from query or params
    const customerId = req.query.customerId || req.params.customerId;

    if (!customerId) {
      return res
        .status(400)
        .json({ error: "Customer ID is required in query or params" });
    }

    // Optional: Validate that customer exists
    const customer = await Customer.findByPk(customerId);
    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    const data = await CustomerStages.findOne({
      where: { customerId },
    });

    if (!data) {
      return res.status(404).json({ error: "Customer stages not found" });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error("Fetch error:", {
      message: error.message,
      stack: error.stack,
      sql: error?.sql,
    });
    return res.status(500).json({ error: "Internal server error" });
  }
};


module.exports = {
  createCustomerStages,
  getCustomerStages,
  updateCustomerStages,
  getCustomerStagesById
};
