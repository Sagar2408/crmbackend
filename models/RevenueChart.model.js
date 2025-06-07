const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return sequelize.define(
    "RevenueChart",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      date: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      revenue: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      lead: {
        type: DataTypes.INTEGER,
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
      tableName: "revenue_chart", // ✅ matches naming convention
      freezeTableName: true, // ✅ avoids Sequelize renaming
      timestamps: true, // ✅ enables createdAt/updatedAt tracking
    }
  );
};
