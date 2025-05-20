const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Company = sequelize.define(
    "Company",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      db_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      db_host: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      db_user: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      db_password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      db_port: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "3306",
      },
    },
    {
      tableName: "Companies",
      timestamps: true, // ✅ Enable Sequelize to auto-manage createdAt & updatedAt
    }
  );

  return Company;
};
