const { masterDB } = require("../config/masterDB"); // assuming masterDB is exported
const { getTenantDB } = require("../config/sequelizeManager");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const createCompany = async (req, res) => {
  const { name, db_name, db_host, db_user, db_password, db_port } = req.body;

  if (!name || !db_name || !db_host || !db_user || !db_password || !db_port) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const Company = masterDB.models.Company;

    // Check for existing company
    const existing = await Company.findOne({
      where: { name },
    });

    if (existing) {
      return res.status(409).json({ message: "Company already exists" });
    }

    // Create new company
    const company = await Company.create({
      name,
      db_name,
      db_host,
      db_user,
      db_password,
      db_port,
    });

    // (Optional) Immediately initialize tenant DB
    await getTenantDB(company.id);

    return res.status(201).json({ message: "Company created", company });
  } catch (err) {
    console.error("Error creating company:", err);
    return res.status(500).json({ message: "Failed to create company" });
  }
};

const getCompaniesForMasterUser = async (req, res) => {
  try {
    const Company = masterDB.models.Company;
    const companies = await Company.findAll();

    return res.status(200).json({
      message: "Companies retrieved successfully",
      companies,
    });
  } catch (error) {
    console.error("❌ Error fetching companies for master user:", error);
    return res
      .status(500)
      .json({ message: "Server error while fetching companies" });
  }
};

module.exports = {
  createCompany,
  getCompaniesForMasterUser,
};
