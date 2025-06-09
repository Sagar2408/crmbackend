require("dotenv").config();
const { Sequelize, DataTypes } = require("sequelize");

// Create a connection to MasterDB
const sequelize = new Sequelize(
  process.env.MASTER_DB_NAME,
  process.env.MASTER_DB_USER,
  process.env.MASTER_DB_PASSWORD,
  {
    host: process.env.MASTER_DB_HOST,
    port: process.env.MASTER_DB_PORT || 3306,
    dialect: "mysql",
    logging: false,
    pool: {
      max: 10, // Maximum number of connection in pool
      min: 0, // Minimum number of connection in pool
      acquire: 30000, // Maximum time, in ms, that pool will try to get connection before throwing error
      idle: 10000, // Maximum time, in ms, that a connection can be idle before being released
    },
  }
);

// Test MasterDB connection
sequelize
  .authenticate()
  .then(() => console.log("✅ Connected to MasterDB"))
  .catch((err) => console.error("❌ Unable to connect to MasterDB:", err));

// Initialize Company model
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.Company = require("../models/Company.model")(sequelize, DataTypes);
db.MasterUser = require("../models/MasterUser.model")(sequelize, DataTypes);

// Sync schema (optional, safe for dev)
sequelize
  .sync({ alter: true })
  .then(() => console.log("✅ MasterDB tables synced"))
  .catch((err) => console.error("❌ Error syncing MasterDB tables:", err));

module.exports = db;