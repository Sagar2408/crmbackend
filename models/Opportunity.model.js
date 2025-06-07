const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return sequelize.define(
    "Opportunity",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      leadId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "leads", // ✅ lowercase to match the actual table
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      stage: {
        type: DataTypes.ENUM(
          "Leads",
          "Proposals",
          "Negotiation",
          "Contracts Sent",
          "Won",
          "Lost"
        ),
        allowNull: false,
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
      tableName: "opportunities", // ✅ consistent lowercase name
      freezeTableName: true, // ✅ disables auto-pluralization
      timestamps: true, // ✅ manages createdAt and updatedAt
    }
  );
};
