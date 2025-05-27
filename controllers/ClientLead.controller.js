const fs = require("fs");
const path = require("path");
const multer = require("multer");
const xlsx = require("xlsx");
const csv = require("csv-parser");

// Dynamic field mapping
const nameFields = [
  "name",
  "username",
  "full name",
  "contact name",
  "lead name",
];
const phoneFields = ["phone", "ph.no", "contact number", "mobile", "telephone"];

// Multer config
const upload = multer({ dest: "uploads/" });

// Map incoming field name to standardized field
const mapFieldName = (fieldName) => {
  if (nameFields.includes(fieldName.toLowerCase())) return "name";
  if (phoneFields.includes(fieldName.toLowerCase())) return "phone";
  return fieldName;
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
          mappedRow[mapFieldName(key)] = row[key];
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
  const data = xlsx.utils.sheet_to_json(sheet);
  return data.map((record) => {
    const mapped = {};
    for (const key in record) {
      mapped[mapFieldName(key)] = record[key];
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

    try {
      for (const record of data) {
        await ClientLead.create(record);
      }
      res.status(200).json({ message: "File uploaded and data saved" });
    } catch (err) {
      console.error("Save error:", err);
      res.status(500).json({ message: "Failed to save data" });
    } finally {
      fs.unlink(file.path, () => {});
    }
  } catch (err) {
    res.status(500).json({ message: "Error uploading file" });
  }
};

// Get leads with pagination
const getClientLeads = async (req, res) => {
  try {
    const { ClientLead } = req.db;
    const limit = parseInt(req.query.limit) === 20 ? 20 : 10;
    const offset = parseInt(req.query.offset) || 0;
    if (offset < 0)
      return res.status(400).json({ message: "Invalid offset value" });

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

// Assign executive to lead
const assignExecutive = async (req, res) => {
  try {
    if (!req.db) {
      return res
        .status(500)
        .json({ message: "Database connection not found in request" });
    }

    const { ClientLead, Users, Notification } = req.db;
    const { executiveName, id } = req.body;

    if (!executiveName || !id) {
      return res
        .status(400)
        .json({ message: "Executive name and lead ID are required" });
    }

    const lead = await ClientLead.findByPk(id);
    if (!lead) {
      console.log("Lead not found for ID:", id);
      return res.status(404).json({ message: "Client lead not found" });
    }

    lead.assignedToExecutive = executiveName;
    lead.status = "Assigned";
    await lead.save();

    const executive = await Users.findOne({
      where: { username: executiveName, role: "Executive" },
    });

    if (!executive) {
      console.log("Executive not found:", executiveName);
      return res.status(404).json({ message: "Executive not found" });
    }

    const message = `You have been assigned a new lead: ${
      lead.name || "Unnamed Client"
    } (Lead ID: ${lead.id})`;

    await Notification.create({
      userId: executive.id,
      message,
    });

    res
      .status(200)
      .json({ message: "Executive assigned and notified successfully", lead });
  } catch (err) {
    console.error("Error assigning executive:", err);
    res
      .status(500)
      .json({ message: "Failed to assign executive", error: err.message });
  }
};

// Get leads assigned to an executive
const getLeadsByExecutive = async (req, res) => {
  try {
    const { ClientLead } = req.db;
    const { executiveName } = req.query;

    if (!executiveName)
      return res.status(400).json({ message: "Executive name is required" });

    const leads = await ClientLead.findAll({
      where: { assignedToExecutive: executiveName },
    });

    if (!leads.length) {
      return res.status(404).json({
        message: `No leads found for executive: ${executiveName}`,
      });
    }

    res.status(200).json({ message: "Leads retrieved successfully", leads });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch leads by executive" });
  }
};

// Get deal funnel stats
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
    };

    leads.forEach((lead) => {
      if (statusCounts.hasOwnProperty(lead.status)) {
        statusCounts[lead.status]++;
      }
    });

    res.status(200).json({
      message: "Deal funnel data retrieved successfu  lly",
      data: { totalLeads, statusCounts },
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch deal funnel data" });
  }
};

module.exports = {
  upload,
  uploadFile,
  getClientLeads,
  assignExecutive,
  getLeadsByExecutive,
  getDealFunnel,
};
