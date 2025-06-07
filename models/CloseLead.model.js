const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const CloseLead = sequelize.define(
    "CloseLead",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      freshLeadId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true, // Each FreshLead can be closed only once
        references: {
          model: "freshleads", // ✅ matches actual table name
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
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
      tableName: "closeleads", // ✅ lowercase and consistent
      freezeTableName: true, // ✅ disables auto-pluralization
      timestamps: true,
    }
  );

  return CloseLead;
};
