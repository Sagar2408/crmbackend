/**
 * controllers/clientLeadController.js
 * ------------------------------------------------------------
 *  Upload, parse & CRUD for ClientLead.
 *  Updated: 26-Jun-2025 (robust phone parsing)
 * ------------------------------------------------------------
 */
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const xlsx = require("xlsx");
const csv  = require("csv-parser");

// 🆕 super-robust phone sanitizer
const { sanitisePhone } = require("../utils/phone");

// -----------------------------------------------------------------------------
// Allowed field mappings
// -----------------------------------------------------------------------------
const nameFields  = ["name", "username", "full name", "contact name", "lead name", "firstname"];
const phoneFields = ["phone", "phoneno", "ph.no", "contact number", "mobile", "telephone"];
const emailFields = ["email", "email address", "e-mail", "mail"];

// -----------------------------------------------------------------------------
// Multer setup (tmp uploads)
// -----------------------------------------------------------------------------
const upload = multer({ dest: "uploads/" });

// -----------------------------------------------------------------------------
// Map header → canonical field
// -----------------------------------------------------------------------------
const mapFieldName = (header) => {
  const h = header.toLowerCase().trim();
  if (nameFields.includes(h))  return "name";
  if (phoneFields.includes(h)) return "phone";
  if (emailFields.includes(h)) return "email";
  return h;
};

// -----------------------------------------------------------------------------
// CSV parser
// -----------------------------------------------------------------------------
const processCSV = (filePath) =>
  new Promise((resolve, reject) => {
    const rows = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => {
        const out = {};
        for (const k in row) {
          const fld = mapFieldName(k);
          let v = row[k];
          if (fld === "phone") v = sanitisePhone(v);
          else if (typeof v === "string") v = v.trim();
          out[fld] = v;
        }
        rows.push(out);
      })
      .on("end", () => resolve(rows))
      .on("error", reject);
  });

// -----------------------------------------------------------------------------
// Excel parser (raw:true preserves numeric/scientific values)
// -----------------------------------------------------------------------------
const processExcel = (filePath) => {
  const wb = xlsx.readFile(filePath, { cellNF:false, cellDates:false, cellText:false });
  const sheet = wb.Sheets[wb.SheetNames[0]];
  const rows = xlsx.utils.sheet_to_json(sheet, { raw:true, defval:"" });

  return rows.map((rec) => {
    const out = {};
    for (const k in rec) {
      const fld = mapFieldName(k);
      let v = rec[k];
      if (fld === "phone") v = sanitisePhone(v);
      else if (typeof v === "string") v = v.trim();
      out[fld] = v;
    }
    return out;
  });
};

// -----------------------------------------------------------------------------
// Upload handler
// -----------------------------------------------------------------------------
const uploadFile = async (req, res) => {
  try {
    const { ClientLead } = req.db;
    const file = req.file;
    if (!file) return res.status(400).json({ message: "No file uploaded" });

    // choose parser by ext
    const ext = path.extname(file.originalname).toLowerCase();
    let data = [];
    if (ext === ".xlsx" || ext === ".xls") data = processExcel(file.path);
    else if (ext === ".csv")               data = await processCSV(file.path);
    else return res.status(400).json({ message: "Unsupported file type" });

    // whitelist fields
    const allowed = ["name","email","phone","education","experience","state","country","dob",
                     "leadAssignDate","countryPreference","assignedToExecutive","status"];

    let ok = 0;
    for (const row of data) {
      const obj = {};
      for (const f of allowed) if (row[f]) obj[f] = row[f];

      if (!obj.name) { console.warn("⛔ Skipping row (no name):", row); continue; }

      try { await ClientLead.create(obj); ok++; }
      catch (e) { console.error("❌ DB error:", e.message, obj); }
    }

    fs.unlink(file.path, () => {});             // delete tmp file
    res.status(200).json({ message:`${ok} leads imported successfully` });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ message:"Failed to save data", error:err.message });
  }
};

// -----------------------------------------------------------------------------
// Pagination
// -----------------------------------------------------------------------------
const getClientLeads = async (req, res) => {
  try {
    const { ClientLead } = req.db;
    const limit  = parseInt(req.query.limit) === 20 ? 20 : 10;
    const offset = parseInt(req.query.offset) || 0;
    if (offset < 0) return res.status(400).json({ message:"Invalid offset" });

    const { count, rows } = await ClientLead.findAndCountAll({ limit, offset });
    res.status(200).json({
      message:"Client leads retrieved successfully",
      leads: rows,
      pagination:{ total:count, limit, offset, totalPages:Math.ceil(count/limit) }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message:"Failed to fetch client leads" });
  }
};

// -----------------------------------------------------------------------------
// Get all leads (no pagination) – use carefully
// -----------------------------------------------------------------------------
const getAllClientLeads = async (req, res) => {
  try {
    const { ClientLead } = req.db;
    const leads = await ClientLead.findAll();
    res.status(200).json({ message:"All leads fetched", total:leads.length, leads });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message:"Failed to fetch all leads", error:err.message });
  }
};

// -----------------------------------------------------------------------------
// Assign executive + notification
// -----------------------------------------------------------------------------
const assignExecutive = async (req, res) => {
  try {
    const { ClientLead, Users, Notification } = req.db;
    const { executiveName, id } = req.body;
    if (!executiveName || !id) {
      return res.status(400).json({ message:"Executive name and lead ID required" });
    }

    const lead = await ClientLead.findByPk(id);
    if (!lead) return res.status(404).json({ message:"Lead not found" });

    lead.assignedToExecutive = executiveName;
    lead.status = "Assigned";
    await lead.save();

    const exec = await Users.findOne({ where:{ username:executiveName, role:"Executive" }});
    if (!exec) return res.status(404).json({ message:"Executive not found" });

    await Notification.create({
      userId: exec.id,
      message: `You have been assigned a new lead: ${lead.name || "Unnamed"} (#${lead.id})`
    });

    res.status(200).json({ message:"Executive assigned & notified", lead });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message:"Failed to assign executive", error:err.message });
  }
};

// -----------------------------------------------------------------------------
// Leads by executive
// -----------------------------------------------------------------------------
const getLeadsByExecutive = async (req, res) => {
  try {
    const { ClientLead } = req.db;
    const { executiveName } = req.query;
    if (!executiveName) return res.status(400).json({ message:"Executive name required" });

    const leads = await ClientLead.findAll({ where:{ assignedToExecutive:executiveName }});
    if (!leads.length) {
      return res.status(404).json({ message:`No leads for ${executiveName}` });
    }
    res.status(200).json({ message:"Leads fetched", leads });
  } catch (err) {
    res.status(500).json({ message:"Failed to fetch leads by executive" });
  }
};

// -----------------------------------------------------------------------------
// Deal-funnel stats
// -----------------------------------------------------------------------------
const getDealFunnel = async (req, res) => {
  try {
    const { ClientLead } = req.db;
    const leads = await ClientLead.findAll();

    const statusCounts = {
      New:0, Assigned:0, Converted:0, "Follow-Up":0, Closed:0, Rejected:0, Meeting:0
    };
    leads.forEach(l => { if (statusCounts[l.status] !== undefined) statusCounts[l.status]++; });

    res.status(200).json({ message:"Funnel data", data:{ totalLeads:leads.length, statusCounts }});
  } catch (err) {
    res.status(500).json({ message:"Failed to fetch funnel data" });
  }
};

// -----------------------------------------------------------------------------
// Leads in Follow-Up status
// -----------------------------------------------------------------------------
const getFollowUpClientLeads = async (req, res) => {
  try {
    const { ClientLead } = req.db;
    const leads = await ClientLead.findAll({ where:{ status:"Follow-Up" }});
    if (!leads.length) return res.status(404).json({ message:"No Follow-Up leads" });
    res.status(200).json({ message:"Follow-Up leads fetched", leads });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message:"Failed to fetch Follow-Up leads", error:err.message });
  }
};

// -----------------------------------------------------------------------------
// Exports
// -----------------------------------------------------------------------------
module.exports = {
  upload,
  uploadFile,
  getClientLeads,
  getAllClientLeads,
  assignExecutive,
  getLeadsByExecutive,
  getDealFunnel,
  getFollowUpClientLeads,
  sanitisePhone        // exported for potential unit-tests
};
