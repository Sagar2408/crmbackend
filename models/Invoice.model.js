const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return sequelize.define(
    "Invoice",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      invoiceNo: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      branch: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      modeOfPayment: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      officeRef: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      consultantName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      clientName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      clientAddress: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      clientContactNo: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      clientEmail: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      locationProposed: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      particulars: {
        type: DataTypes.JSON,
        allowNull: false,
      },
      taxRate: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      taxAmount: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      totalAmount: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      bankAccountName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      bankAccountNumber: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      bankIFSC: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      bankName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      bankSwiftCode: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      bankBranch: {
        type: DataTypes.STRING,
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
      tableName: "invoices", // ✅ consistent lowercase name
      freezeTableName: true, // ✅ prevents Sequelize from changing it to 'Invoices'
      timestamps: true, // ✅ enables auto `createdAt` / `updatedAt`
    }
  );
};
