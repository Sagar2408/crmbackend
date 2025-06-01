const fs = require("fs");
const path = require("path");
const multer = require("multer");
const xlsx = require("xlsx");
const csv = require("csv-parser");

// Allowed dynamic field mapping
const nameFields = ["name", "username", "full name", "contact name", "lead name"];
const phoneFields = ["phone", "ph.no", "contact number", "mobile", "telephone"];
const emailFields = ["email", "email address", "e-mail", "mail"];

// Multer config
const upload = multer({ dest: "uploads/" });

// Map incoming field name to standardized field
const mapFieldName = (fieldName) => {
  const lower = fieldName.toLowerCase().trim();
  if (nameFields.includes(lower)) return "name";
  if (phoneFields.includes(lower)) return "phone";
  if (emailFields.includes(lower)) return "email";
  return lower;
};

// CSV parsing logic
const processCSV = (filePath) => {
  return new Promise((resolve, reject) => {
    const fileData = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => {
        const mappedRow = {};
        for (const key in row) {
          const mappedKey = mapFieldName(key);
          mappedRow[mappedKey] = row[key];
        }
        fileData.push(mappedRow);
      })
      .on("end", () => resolve(fileData))
      .on("error", (err) => reject(err));
  });
};

// Excel parsing logic
const processExcel = (filePath) => {
  const workbook = xlsx.readFile(filePath);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = xlsx.utils.sheet_to_json(sheet, { raw: true });

  return data.map((record) => {
    const mapped = {};
    for (const key in record) {
      const mappedKey = mapFieldName(key);
      let value = record[key];

      // Normalize phone numbers
      if (mappedKey === "phone") {
        // If numeric and in scientific notation or float, handle properly
        if (typeof value === "number") {
          value = value.toFixed(0);
        }

        // Final cleanup: remove non-digit characters
        value = String(value).replace(/[^\d]/g, "").slice(0, 15);
      }

      mapped[mappedKey] = typeof value === "string" ? value.trim() : value;
    }
    return mapped;
  });
};

// Upload handler
const uploadFile = async (req, res) => {
  try {
    const { ClientLead } = req.db;
    const file = req.file;

    if (!file) return res.status(400).json({ message: "No file uploaded" });

    const ext = path.extname(file.originalname).toLowerCase();
    let data = [];

    if (ext === ".xlsx" || ext === ".xls") {
      data = processExcel(file.path);
    } else if (ext === ".csv") {
      try {
        data = await processCSV(file.path);
      } catch {
        return res.status(500).json({ message: "Failed to process CSV file" });
      }
    } else {
      return res.status(400).json({ message: "Unsupported file format" });
    }

    const allowedFields = [
      "name", "email", "phone", "education", "experience", "state", "country",
      "dob", "leadAssignDate", "countryPreference", "assignedToExecutive", "status"
    ];

    let successCount = 0;
    for (const record of data) {
      const cleaned = {};
      for (const key of allowedFields) {
        if (record[key]) cleaned[key] = record[key];
      }

      if (!cleaned.name) {
        console.warn("Skipping row with no name:", record);
        continue;
      }

      try {
        await ClientLead.create(cleaned);
        successCount++;
      } catch (err) {
        console.error("Error saving record:", cleaned);
        console.error("Sequelize Error:", err.message);
      }
    }

    fs.unlink(file.path, () => {});
    res.status(200).json({ message: `${successCount} leads imported successfully` });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ message: "Failed to save data", error: err.message });
  }
};

// Other API routes remain unchanged

const getClientLeads = async (req, res) => {
  try {
    const { ClientLead } = req.db;
    const limit = parseInt(req.query.limit) === 20 ? 20 : 10;
    const offset = parseInt(req.query.offset) || 0;
    if (offset < 0) return res.status(400).json({ message: "Invalid offset value" });

    const { count, rows } = await ClientLead.findAndCountAll({ limit, offset });

    res.status(200).json({
      message: "Client leads retrieved successfully",
      leads: rows,
      pagination: {
        total: count,
        limit,
        offset,
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch client leads" });
  }
};

const assignExecutive = async (req, res) => {
  try {
    if (!req.db) return res.status(500).json({ message: "Database connection not found" });

    const { ClientLead, Users, Notification } = req.db;
    const { executiveName, id } = req.body;

    if (!executiveName || !id) {
      return res.status(400).json({ message: "Executive name and lead ID are required" });
    }

    const lead = await ClientLead.findByPk(id);
    if (!lead) return res.status(404).json({ message: "Client lead not found" });

    lead.assignedToExecutive = executiveName;
    lead.status = "Assigned";
    await lead.save();

    const executive = await Users.findOne({
      where: { username: executiveName, role: "Executive" },
    });

    if (!executive) return res.status(404).json({ message: "Executive not found" });

    const message = `You have been assigned a new lead: ${lead.name || "Unnamed Client"} (Lead ID: ${lead.id})`;
    await Notification.create({ userId: executive.id, message });

    res.status(200).json({ message: "Executive assigned and notified successfully", lead });
  } catch (err) {
    console.error("Error assigning executive:", err);
    res.status(500).json({ message: "Failed to assign executive", error: err.message });
  }
};

const getLeadsByExecutive = async (req, res) => {
  try {
    const { ClientLead } = req.db;
    const { executiveName } = req.query;

    if (!executiveName) return res.status(400).json({ message: "Executive name is required" });

    const leads = await ClientLead.findAll({ where: { assignedToExecutive: executiveName } });

    if (!leads.length) {
      return res.status(404).json({ message: `No leads found for executive: ${executiveName}` });
    }

    res.status(200).json({ message: "Leads retrieved successfully", leads });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch leads by executive" });
  }
};

const getDealFunnel = async (req, res) => {
  try {
    const { ClientLead } = req.db;
    const leads = await ClientLead.findAll();

    const totalLeads = leads.length;
    const statusCounts = {
      New: 0,
      Assigned: 0,
      Converted: 0,
      "Follow-Up": 0,
      Closed: 0,
      Rejected: 0,
      Meeting: 0,
    };

    leads.forEach((lead) => {
      if (statusCounts.hasOwnProperty(lead.status)) {
        statusCounts[lead.status]++;
      }
    });

    res.status(200).json({
      message: "Deal funnel data retrieved successfully",
      data: { totalLeads, statusCounts },
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch deal funnel data" });
  }
};

// Export all functions
module.exports = {
  upload,
  uploadFile,
  getClientLeads,
  assignExecutive,
  getLeadsByExecutive,
  getDealFunnel,
};
