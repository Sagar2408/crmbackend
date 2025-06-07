const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const ConvertedClient = sequelize.define(
    "ConvertedClient",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      fresh_lead_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true, // Each FreshLead can be converted only once
        references: {
          model: "freshleads", // ✅ must match actual table name in DB
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      phone: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      country: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      last_contacted: {
        type: DataTypes.DATEONLY,
        allowNull: true,
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
      tableName: "convertedclients", // ✅ lowercased consistent name
      freezeTableName: true, // ✅ disables Sequelize pluralization
      timestamps: true,
    }
  );

  return ConvertedClient;
};
