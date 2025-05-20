const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return sequelize.define(
    "Meeting",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      clientName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      clientEmail: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isEmail: true,
        },
      },
      clientPhone: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      reasonForFollowup: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      startTime: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      endTime: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      executiveId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "users", // ✅ lowercase to match actual table name
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      fresh_lead_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "freshleads", // ✅ lowercase to match table name
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
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
      tableName: "meetings", // ✅ standardized lowercase name
      freezeTableName: true, // ✅ disables Sequelize renaming
      timestamps: true, // ✅ enables automatic time tracking
    }
  );
};
