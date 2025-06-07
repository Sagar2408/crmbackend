const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Manager = sequelize.define(
    "Manager",
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
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "Manager",
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
      tableName: "managers", // ✅ consistent lowercase table name
      freezeTableName: true, // ✅ avoids auto-pluralization
      timestamps: true, // ✅ manages createdAt & updatedAt
    }
  );

  return Manager;
};
