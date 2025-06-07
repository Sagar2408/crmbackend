const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return sequelize.define(
    "RolePermission",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      // Only one of these should be filled per row
      manager_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "managers",
          key: "id",
        },
        onDelete: "CASCADE",
      },

      user_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "CASCADE",
      },

      role: {
        type: DataTypes.ENUM("Manager", "TL", "HR"),
        allowNull: false,
      },

      // Permission fields (booleans)
      overview: { type: DataTypes.BOOLEAN, defaultValue: false },
      assign_task: { type: DataTypes.BOOLEAN, defaultValue: false },
      task_management: { type: DataTypes.BOOLEAN, defaultValue: false },
      monitoring: { type: DataTypes.BOOLEAN, defaultValue: false },
      executive_details: { type: DataTypes.BOOLEAN, defaultValue: false },
      invoice: { type: DataTypes.BOOLEAN, defaultValue: false },
      dashboard: { type: DataTypes.BOOLEAN, defaultValue: false },
      user_management: { type: DataTypes.BOOLEAN, defaultValue: false },
      reporting: { type: DataTypes.BOOLEAN, defaultValue: false },
      settings: { type: DataTypes.BOOLEAN, defaultValue: false },
      billing: { type: DataTypes.BOOLEAN, defaultValue: false },
      weekly_summary: { type: DataTypes.BOOLEAN, defaultValue: false },
      account_updates: { type: DataTypes.BOOLEAN, defaultValue: false },
      marketing_emails: { type: DataTypes.BOOLEAN, defaultValue: false },
      push_notifications: { type: DataTypes.BOOLEAN, defaultValue: false },
      sms_notifications: { type: DataTypes.BOOLEAN, defaultValue: false },
      email_notifications: { type: DataTypes.BOOLEAN, defaultValue: false },
    },
    {
      tableName: "RolePermissions",
      freezeTableName: true,
      timestamps: true,
    }
  );
};
