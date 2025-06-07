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
    pool: {
    max: 10,        // Maximum number of connection in pool
    min: 0,         // Minimum number of connection in pool
    acquire: 30000, // Maximum time, in ms, that pool will try to get connection before throwing error
    idle: 10000     // Maximum time, in ms, that a connection can be idle before being released
  }
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
