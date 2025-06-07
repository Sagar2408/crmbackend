const createCustomerDetails = async (req, res) => {
  try {
    const CustomerDetails = req.db.CustomerDetails;

    const customerId = req.user?.id; // Extracted from JWT
    const { phone, dob, nationality, passportNumber } = req.body;

    if (!customerId) {
      return res
        .status(401)
        .json({ error: "Unauthorized: Customer ID missing" });
    }

    const existing = await CustomerDetails.findOne({ where: { customerId } });
    if (existing) {
      return res.status(400).json({ error: "Customer details already exist" });
    }

    const data = await CustomerDetails.create({
      customerId,
      phone,
      dob,
      nationality,
      passportNumber,
    });

    return res.status(201).json({
      message: "Customer details created successfully",
      data,
    });
  } catch (error) {
    console.error("Create error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const getCustomerDetails = async (req, res) => {
  try {
    const CustomerDetails = req.db.CustomerDetails;
    const customerId = req.user?.id; // Extract from JWT token

    if (!customerId) {
      return res
        .status(401)
        .json({ error: "Unauthorized: No customer ID found in token" });
    }

    const data = await CustomerDetails.findOne({ where: { customerId } });

    if (!data) {
      return res.status(404).json({ error: "Customer details not found" });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error("Fetch error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const updateCustomerDetails = async (req, res) => {
  try {
    const CustomerDetails = req.db.CustomerDetails;
    const customerId = req.user?.id; // Extract from JWT token

    if (!customerId) {
      return res
        .status(401)
        .json({ error: "Unauthorized: No customer ID found in token" });
    }

    const [updated] = await CustomerDetails.update(req.body, {
      where: { customerId },
    });

    if (updated === 0) {
      return res
        .status(404)
        .json({ error: "No customer details found to update" });
    }

    return res.status(200).json({
      message: "Customer details updated successfully",
    });
  } catch (error) {
    console.error("Update error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  createCustomerDetails,
  getCustomerDetails,
  updateCustomerDetails,
};
