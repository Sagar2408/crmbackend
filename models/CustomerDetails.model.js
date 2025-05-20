const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const CustomerDetails = sequelize.define(
    "CustomerDetails",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      customerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "customers", // ✅ must match table name of Customer model
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      dob: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      nationality: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      passportNumber: {
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
      tableName: "customer_details", // ✅ matches your naming convention
      freezeTableName: true, // ✅ avoids auto-pluralization
      timestamps: true,
    }
  );

  return CustomerDetails;
};
