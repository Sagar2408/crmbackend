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
          model: "users",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      activityDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
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
      tableName: "executiveactivities",
      freezeTableName: true,
      timestamps: true,
      uniqueKeys: {
        daily_activity_unique: {
          fields: ["ExecutiveId", "activityDate"],
        },
      },
    }
  );
};
