const fs = require("fs");
const path = require("path");
const multer = require("multer");
const xlsx = require("xlsx");
const csv = require("csv-parser");

// Dynamic field mapping
const nameFields = ["name", "username", "full name", "contact name", "lead name"];
const phoneFields = ["phone", "ph.no", "contact number", "mobile", "telephone"];
const emailFields = ["email", "email address", "e-mail", "mail"];

// Multer config
const upload = multer({ dest: "uploads/" });

// Map incoming field name to standardized field
const mapFieldName = (fieldName) => {
  const lower = fieldName.toLowerCase();
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
  const data = xlsx.utils.sheet_to_json(sheet, { raw: false });

  return data.map((record) => {
    const mapped = {};
    for (const key in record) {
      const mappedKey = mapFieldName(key);
      let value = record[key];

      // Convert phone number to string if it's numeric
      if (mappedKey === "phone" && typeof value === "number") {
        value = value.toString().split(".")[0];
      }

      mapped[mappedKey] = value;
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
    console.error("Upload error:", err);
    res.status(500).json({ message: "Error uploading file" });
  }
};

// Export
module.exports = {
  upload,
  uploadFile,
};
