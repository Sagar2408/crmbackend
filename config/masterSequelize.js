const { Sequelize } = require("sequelize");
const initializeModels = require('../config/sequelize');

const tenantDBCache = {}; // ✅ cache to reuse connections

async function getTenantDB(companyId) {
  // If already initialized, reuse it
  if (tenantDBCache[companyId]) return tenantDBCache[companyId];

  try {
    // Fetch company config from MasterDB
    const masterDb = require("../config/masterDb");
    const company = await masterDb.Company.findOne({ where: { id: companyId } });

    if (!company) {
      throw new Error(`❌ Company with ID ${companyId} not found`);
    }

    const { db_name, db_user, db_password, db_host } = company;

    // Create Sequelize instance with keepAlive
    const sequelize = new Sequelize(db_name, db_user, db_password, {
      host: db_host,
      dialect: "mysql",
      logging: false,
      dialectOptions: {
        keepAlive: true,
        connectTimeout: 20000
      },
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },
    });

    // Test connection
    await sequelize.authenticate();
    console.log(`✅ Connected to Tenant DB: ${company.name}`);

    // Initialize models and associations
    const models = initializeModels(sequelize);

    // Save to cache
    tenantDBCache[companyId] = models;

    return models;
  } catch (err) {
    console.error(`❌ [TENANT] Error resolving tenant:`, err.message);
    throw err;
  }
}

module.exports = { getTenantDB };
