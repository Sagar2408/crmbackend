const { Sequelize, DataTypes } = require("sequelize");
require("dotenv").config();

// Create Sequelize instance
const masterDB = new Sequelize(
  process.env.MASTER_DB_NAME,
  process.env.MASTER_DB_USER,
  process.env.MASTER_DB_PASSWORD,
  {
    host: process.env.MASTER_DB_HOST,
    port: process.env.MASTER_DB_PORT,
    dialect: "mysql",
    logging: false,
  }
);

// ✅ Import and initialize the Company model
const CompanyModel = require("../models/Company.model");
const Company = CompanyModel(masterDB, DataTypes);

// ✅ Attach to models for easy access
masterDB.models = {
  Company,
};

module.exports = {
  masterDB,
};
