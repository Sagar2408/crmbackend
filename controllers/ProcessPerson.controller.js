const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// SIGNUP
const signupProcessPerson = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    const { ProcessPerson } = req.db;

    if (!fullName || !email || !password) {
      return res.status(400).json({
        message: "Full Name, Email, and Password are required.",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format." });
    }

    const existing = await ProcessPerson.findOne({ where: { email } });
    if (existing) {
      return res.status(409).json({ message: "Email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const person = await ProcessPerson.create({
      fullName,
      email,
      password: hashedPassword,
      isActive: true,
    });

    return res.status(201).json({
      message: "ProcessPerson registered successfully.",
      person: {
        id: person.id,
        fullName: person.fullName,
        email: person.email,
      },
    });
  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).json({ message: "Signup failed." });
  }
};

// LOGIN
const loginProcessPerson = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { ProcessPerson } = req.db;

    const person = await ProcessPerson.findOne({
      where: { email, isActive: true },
    });

    if (!person) {
      return res
        .status(404)
        .json({ message: "Account not found or inactive." });
    }

    const isMatch = await bcrypt.compare(password, person.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const token = jwt.sign(
      { id: person.id, email: person.email, fullName: person.fullName },
      process.env.JWT_SECRET,
      { expiresIn: "12h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
      maxAge: 12 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Login successful.",
      token,
      person: {
        id: person.id,
        fullName: person.fullName,
        email: person.email,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Login failed." });
  }
};

// LOGOUT
const logoutProcessPerson = async (req, res) => {
  try {
    const { ProcessPerson } = req.db;
    const personId = req.user?.id;

    if (!personId) {
      return res
        .status(401)
        .json({ message: "Unauthorized: Token missing or invalid." });
    }

    const person = await ProcessPerson.findByPk(personId);
    if (!person) {
      return res.status(404).json({ message: "ProcessPerson not found." });
    }

    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
    });

    return res.status(200).json({ message: "Logout successful." });
  } catch (err) {
    console.error("Logout error:", err);
    return res.status(500).json({ message: "Logout failed." });
  }
};

// GET SETTINGS
const getProcessSettings = async (req, res) => {
  try {
    const { ProcessPerson } = req.db;
    const personId = req.user?.id;

    if (!personId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const person = await ProcessPerson.findByPk(personId, {
      attributes: [
        "fullName",
        "email",
        "nationality",
        "dob",
        "phone",
        "passportNumber",
        "profession",
        "location",
      ],
    });

    if (!person) {
      return res.status(404).json({ message: "ProcessPerson not found" });
    }

    return res.status(200).json({ settings: person });
  } catch (err) {
    console.error("Settings fetch error:", err);
    return res.status(500).json({ message: "Failed to fetch settings." });
  }
};

// UPDATE SETTINGS
const updateProcessSettings = async (req, res) => {
  try {
    const { ProcessPerson } = req.db;
    const personId = req.user?.id;

    if (!personId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const allowedFields = [
      "fullName",
      "phone",
      "dob",
      "nationality",
      "passportNumber",
      "profession",
      "location",
    ];

    const updates = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    const [affectedRows] = await ProcessPerson.update(updates, {
      where: { id: personId },
    });

    if (affectedRows === 0) {
      return res.status(404).json({
        message: "No changes made or ProcessPerson not found.",
      });
    }

    return res.status(200).json({ message: "Settings updated successfully." });
  } catch (err) {
    console.error("Settings update error:", err);
    return res.status(500).json({ message: "Failed to update settings." });
  }
};

const getAllConvertedClients = async (req, res) => {
  try {
    // Debug: Log available models
    if (!req.db) {
      console.error("❌ req.db is undefined.");
      return res
        .status(500)
        .json({ message: "Database connection not available." });
    }

    console.log("📦 Models available:", Object.keys(req.db));

    const { ClientLead } = req.db;

    if (!ClientLead) {
      console.error("❌ ClientLead model not found in request DB.");
      return res.status(500).json({ message: "ClientLead model missing." });
    }

    console.log("✅ Fetching converted clients...");

    const convertedClients = await ClientLead.findAll({
      where: { status: "Converted" },
      order: [["updatedAt", "DESC"]],
    });

    if (!convertedClients.length) {
      console.warn("⚠️ No converted clients found.");
      return res.status(404).json({ message: "No converted clients found." });
    }

    console.log(`✅ Retrieved ${convertedClients.length} converted clients.`);
    return res.status(200).json({
      message: "Converted clients retrieved successfully.",
      count: convertedClients.length,
      clients: convertedClients,
    });
  } catch (error) {
    console.error("❌ Error in getAllConvertedClients:", error);
    return res.status(500).json({
      message: "Failed to fetch converted clients.",
      error: error.message,
    });
  }
};
const importConvertedClientsToCustomers = async (req, res) => {
  try {
    if (!req.db) {
      console.error("❌ req.db is undefined.");
      return res
        .status(500)
        .json({ message: "Database connection not available." });
    }

    const { ClientLead, Customer } = req.db;
    console.log("📦 Models available:", Object.keys(req.db));

    if (!ClientLead || !Customer) {
      console.error("❌ Required models missing: ClientLead or Customer.");
      return res
        .status(500)
        .json({ message: "Required models not found in request DB." });
    }

    const convertedLeads = await ClientLead.findAll({
      where: { status: "Converted" },
    });

    if (!convertedLeads.length) {
      console.warn("⚠️ No converted leads found.");
      return res.status(404).json({ message: "No converted leads to import." });
    }

    console.log(`🔄 Starting import for ${convertedLeads.length} leads...`);

    let importedCount = 0;
    let skippedCount = 0;
    const errors = [];

    for (const lead of convertedLeads) {
      console.log("📌 Processing lead:", lead.id, lead.email);

      if (!lead.email || !lead.phone) {
        console.warn(
          "⚠️ Skipping lead due to missing email or phone:",
          lead.id
        );
        skippedCount++;
        errors.push({
          name: lead.name || "Unknown",
          email: lead.email || "Missing",
          reason: "Missing email or phone",
        });
        continue;
      }

      const existing = await Customer.findOne({
        where: { email: lead.email },
      });

      if (existing) {
        console.warn(`⚠️ Skipping ${lead.email}: already exists.`);
        skippedCount++;
        errors.push({
          email: lead.email,
          reason: "Email already exists in Customer table",
        });
        continue;
      }

      try {
        const hashedPassword = await bcrypt.hash(lead.phone, 10);
        const customerPayload = {
          fullName: lead.name,
          email: lead.email,
          phone: lead.phone,
          country: lead.country, //importing country fie
          password: hashedPassword,
          status: "pending",
        };

        console.log("📝 Creating customer:", customerPayload);
        await Customer.create(customerPayload);
        importedCount++;
      } catch (createErr) {
        console.error(`❌ Failed to import ${lead.email}:`, createErr.message);
        errors.push({
          email: lead.email,
          reason: createErr.message,
        });
      }
    }

    console.log("✅ Import Summary:", {
      imported: importedCount,
      skipped: skippedCount,
      errorsCount: errors.length,
    });

    return res.status(200).json({
      message: "Import completed.",
      imported: importedCount,
      skipped: skippedCount,
      errors,
    });
  } catch (error) {
    console.error("❌ Error in importConvertedClientsToCustomers:", error);
    return res.status(500).json({
      message: "Failed to import converted clients.",
      error: error.message,
    });
  }
};

module.exports = {
  signupProcessPerson,
  loginProcessPerson,
  logoutProcessPerson,
  getProcessSettings,
  updateProcessSettings,
  importConvertedClientsToCustomers,
  getAllConvertedClients,
};
