const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const ClientLead = sequelize.define(
    "ClientLead",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          isEmail: true,
        },
        unique: true
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "0",
      },
      education: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      experience: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      state: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      country: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      dob: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        defaultValue: "1970-01-01",
      },
      leadAssignDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        defaultValue: "2025-01-15",
      },
      countryPreference: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      assignedToExecutive: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: "Name of the executive assigned to the lead",
      },
      status: {
        type: DataTypes.ENUM(
          "New",
          "Assigned",
          "Converted",
          "Follow-Up",
          "Closed",
          "Rejected",
          "Meeting"
        ),
        defaultValue: "New",
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
      tableName: "clientleads", // ✅ Explicit lowercase table name
      freezeTableName: true, // ✅ Prevents Sequelize from pluralizing
      timestamps: true,
    }
  );

  return ClientLead;
};
