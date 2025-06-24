// models/SheetIntegration.model.js

module.exports = (sequelize, DataTypes) => {
  const SheetIntegration = sequelize.define("SheetIntegration", {
    adminId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    companyId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sheetId: {
      type: DataTypes.STRING,
      allowNull: true, // optional if you're listing & selecting later
    },
    accessToken: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    refreshToken: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tokenExpiry: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  });

  return SheetIntegration;
};
