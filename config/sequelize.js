const { Sequelize } = require("sequelize");

module.exports = function initializeModels(sequelize) {
  const db = {};
  db.Sequelize = Sequelize;
  db.sequelize = sequelize;

  // Load models – no third argument, models handle their own table names
  db.CallDetails = require("../models/CallDetails.model")(sequelize, Sequelize);
  db.Users = require("../models/User.model")(sequelize, Sequelize);
  db.Deal = require("../models/Deal.model")(sequelize, Sequelize);
  db.Lead = require("../models/Lead.model")(sequelize, Sequelize);
  db.Meeting = require("../models/Meeting.model")(sequelize, Sequelize);
  db.Opportunity = require("../models/Opportunity.model")(sequelize, Sequelize);
  db.ClientLead = require("../models/ClientLead.model")(sequelize, Sequelize);
  db.Invoice = require("../models/Invoice.model")(sequelize, Sequelize);
  db.ExecutiveActivity = require("../models/ExecutiveActivity.model")(
    sequelize,
    Sequelize
  );
  db.FollowUp = require("../models/Followup.model")(sequelize, Sequelize);
  db.FollowUpHistory = require("../models/FollowUpHistory.model")(
    sequelize,
    Sequelize
  );
  db.FreshLead = require("../models/FreshLead.model")(sequelize, Sequelize);
  db.ConvertedClient = require("../models/ConvertedClient.model")(
    sequelize,
    Sequelize
  );
  db.CloseLead = require("../models/CloseLead.model")(sequelize, Sequelize);
  db.Notification = require("../models/Notification.model")(
    sequelize,
    Sequelize
  );
  db.Customer = require("../models/Customer.model")(sequelize, Sequelize);
  db.CustomerDetails = require("../models/CustomerDetails.model")(
    sequelize,
    Sequelize
  );
  db.ProcessPerson = require("../models/ProcessPerson.model")(
    sequelize,
    Sequelize
  );
  db.CustomerStages = require("../models/CustomerStages.model")(
    sequelize,
    Sequelize
  );
  db.RevenueChart = require("../models/RevenueChart.model")(
    sequelize,
    Sequelize
  );
  db.Team = require("../models/Team.model")(sequelize, Sequelize);
  db.Manager = require("../models/Manager.model")(sequelize, Sequelize);
  db.Hr = require("../models/Hr.model")(sequelize, Sequelize);

  db.RolePermission = require("../models/RolePermission.model")(
    sequelize,
    Sequelize
  );
  // ------------------------
  // Define Associations
  // ------------------------

  db.Users.hasMany(db.ExecutiveActivity, {
    foreignKey: "ExecutiveId",
    onDelete: "CASCADE",
  });
  db.ExecutiveActivity.belongsTo(db.Users, { foreignKey: "ExecutiveId" });

  db.ClientLead.hasMany(db.Lead, {
    foreignKey: "clientLeadId",
    onDelete: "CASCADE",
  });
  db.Lead.belongsTo(db.ClientLead, {
    foreignKey: "clientLeadId",
    as: "clientLead",
  });

  db.Lead.hasOne(db.FreshLead, { foreignKey: "leadId", onDelete: "CASCADE" });
  db.FreshLead.belongsTo(db.Lead, { foreignKey: "leadId", as: "lead" });

  db.Lead.hasMany(db.FollowUp, { foreignKey: "leadId", onDelete: "CASCADE" });
  db.FollowUp.belongsTo(db.Lead, { foreignKey: "leadId", as: "lead" });

  db.Lead.hasOne(db.ConvertedClient, {
    foreignKey: "leadId",
    onDelete: "CASCADE",
  });
  db.ConvertedClient.belongsTo(db.Lead, { foreignKey: "leadId", as: "lead" });

  db.Lead.hasMany(db.Deal, { foreignKey: "leadId", onDelete: "CASCADE" });
  db.Deal.belongsTo(db.Lead, { foreignKey: "leadId" });

  db.FreshLead.hasMany(db.FollowUp, {
    foreignKey: "fresh_lead_id",
    onDelete: "CASCADE",
    as: "followUps",
  });
  db.FollowUp.belongsTo(db.FreshLead, {
    foreignKey: "fresh_lead_id",
    as: "freshLead",
  });

  db.FreshLead.hasMany(db.FollowUpHistory, {
    foreignKey: "fresh_lead_id",
    onDelete: "CASCADE",
    as: "followUpHistories",
  });
  db.FollowUpHistory.belongsTo(db.FreshLead, {
    foreignKey: "fresh_lead_id",
    as: "freshLead",
  });

  db.FollowUp.hasMany(db.FollowUpHistory, {
    foreignKey: "follow_up_id",
    onDelete: "CASCADE",
    as: "followUpHistories",
  });
  db.FollowUpHistory.belongsTo(db.FollowUp, {
    foreignKey: "follow_up_id",
    as: "followUp",
  });

  db.FreshLead.hasOne(db.ConvertedClient, {
    foreignKey: "fresh_lead_id",
    onDelete: "CASCADE",
    as: "convertedClient",
  });
  db.ConvertedClient.belongsTo(db.FreshLead, {
    foreignKey: "fresh_lead_id",
    as: "freshLead",
  });

  db.FreshLead.hasOne(db.CloseLead, {
    foreignKey: "freshLeadId",
    onDelete: "CASCADE",
    as: "closeLead",
  });
  db.CloseLead.belongsTo(db.FreshLead, {
    foreignKey: "freshLeadId",
    as: "freshLead",
  });

  db.Users.hasMany(db.Notification, {
    foreignKey: "userId",
    onDelete: "CASCADE",
  });
  db.Notification.belongsTo(db.Users, { foreignKey: "userId" });

  db.Meeting.belongsTo(db.FreshLead, {
    foreignKey: "fresh_lead_id",
    as: "freshLead",
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  });
  db.Meeting.belongsTo(db.Users, {
    foreignKey: "executiveId",
    as: "executive",
    onUpdate: "CASCADE",
    onDelete: "SET NULL",
  });
  db.Users.hasMany(db.Meeting, {
    foreignKey: "executiveId",
    onDelete: "SET NULL",
  });

  db.Customer.hasOne(db.CustomerDetails, {
    foreignKey: "customerId",
    onDelete: "CASCADE",
  });
  db.CustomerDetails.belongsTo(db.Customer, {
    foreignKey: "customerId",
  });

  db.Customer.hasOne(db.CustomerStages, {
    foreignKey: "customerId",
    onDelete: "CASCADE",
  });
  db.CustomerStages.belongsTo(db.Customer, {
    foreignKey: "customerId",
  });

  db.Team.hasMany(db.Users, {
    foreignKey: "team_id",
    onDelete: "SET NULL",
    as: "executives",
  });
  db.Users.belongsTo(db.Team, {
    foreignKey: "team_id",
    as: "team",
  });

  db.Manager.hasMany(db.Team, {
    foreignKey: "manager_id",
    onDelete: "SET NULL",
    as: "teams",
  });
  db.Team.belongsTo(db.Manager, {
    foreignKey: "manager_id",
    as: "manager",
  });

  db.Manager.hasMany(db.RolePermission, {
    foreignKey: "manager_id",
    onDelete: "CASCADE",
  });
  db.RolePermission.belongsTo(db.Manager, {
    foreignKey: "manager_id",
  });

  db.Users.hasMany(db.RolePermission, {
    foreignKey: "user_id",
    onDelete: "CASCADE",
  });
  db.RolePermission.belongsTo(db.Users, {
    foreignKey: "user_id",
  });

  // ------------------------
  // Sync Models
  // ------------------------
  sequelize
    .sync({ alter: true }) // only once for full rebuild
    .then(() => console.log("✅ Tenant DB tables synced"))
    .catch((err) => console.error("❌ Error syncing tenant DB:", err));

  return db;
};
