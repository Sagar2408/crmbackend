const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const ProcessPerson = sequelize.define(
    "ProcessPerson",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      fullName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
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
      tableName: "process_persons", // ✅ lower_case and consistent
      freezeTableName: true, // ✅ disables Sequelize renaming
      timestamps: true, // ✅ enables automatic timestamps
    }
  );

  return ProcessPerson;
};
