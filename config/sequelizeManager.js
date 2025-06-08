const { Sequelize } = require("sequelize");
const initializeModels = require('../config/sequelize'); // dynamic model loader
const { Company } = require("./masterSequelize");

const tenantConnections = {}; // Cache

async function getTenantDB(companyId) {
  // Return cached connection
  if (tenantConnections[companyId]) return tenantConnections[companyId];

  // Get company record from MasterDB
  const company = await Company.findByPk(companyId);
  if (!company) throw new Error("❌ Company not found");

  // Create tenant-specific Sequelize instance
  const sequelize = new Sequelize(
    company.db_name,
    company.db_user,
    company.db_password,
    {
      host: company.db_host,
      port: company.db_port || 3306,
      dialect: "mysql",
      logging: false,
    }
  );

  // Load all CRM models and associations into this instance
  const db = initModels(sequelize);

  // Authenticate and return
  await sequelize.authenticate();
  console.log(`✅ Connected to Tenant DB: ${company.name}`);
  tenantConnections[companyId] = db;

  return db;
}

module.exports = { getTenantDB };
