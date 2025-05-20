const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return sequelize.define(
    "Deal",
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
          model: "leads", // ✅ lowercase to match the actual table name
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      revenue: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      profit: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("Pending", "Closed"),
        defaultValue: "Pending",
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
      tableName: "deals", // ✅ Consistent lowercase table name
      freezeTableName: true, // ✅ Prevent Sequelize from auto-pluralizing
      timestamps: true,
    }
  );
};
