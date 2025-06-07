const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Lead = sequelize.define(
    "Lead",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      clientLeadId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true
      },
      assignedToExecutive: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      previousAssignedTo: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      assignmentDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      status: {
        type: DataTypes.ENUM(
          "New",
          "Assigned",
          "In Progress",
          "Follow-Up",
          "Closed",
          "Rejected"
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
      tableName: "leads", // ✅ explicitly set lowercase name
      freezeTableName: true, // ✅ prevents Sequelize from altering table name
      timestamps: true, // ✅ automatic timestamp handling
    }
  );

  return Lead;
};
