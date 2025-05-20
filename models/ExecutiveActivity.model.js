const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return sequelize.define(
    "ExecutiveActivity",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      ExecutiveId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users", // ✅ should match actual table name ('users')
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      workTime: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      breakTime: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      breakStartTime: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      dailyCallTime: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      leadSectionVisits: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      workStartTime: {
        type: DataTypes.DATE,
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
      tableName: "executiveactivities", // ✅ consistent with schema
      freezeTableName: true, // ✅ disables auto-pluralization
      timestamps: true, // ✅ enables automatic time tracking
    }
  );
};
