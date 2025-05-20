const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const FollowUpHistory = sequelize.define(
    "FollowUpHistory",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      follow_up_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "followups", // ✅ must match FollowUp's actual table name
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      connect_via: {
        type: DataTypes.ENUM("Call", "Email", "Call/Email"),
        allowNull: false,
      },
      follow_up_type: {
        type: DataTypes.ENUM(
          "interested",
          "appointment",
          "no response",
          "converted",
          "not interested",
          "close"
        ),
        allowNull: false,
      },
      interaction_rating: {
        type: DataTypes.ENUM("Hot", "Warm", "Cold"),
        allowNull: false,
      },
      reason_for_follow_up: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      follow_up_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      follow_up_time: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      fresh_lead_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "freshleads", // ✅ must match FreshLead table name
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "followuphistories", // ✅ consistent with table naming convention
      freezeTableName: true,
      timestamps: true,
    }
  );

  return FollowUpHistory;
};
