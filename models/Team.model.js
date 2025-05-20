const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Team = sequelize.define(
    "Team",
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
      manager_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "managers", // ✅ lowercase to match actual table name
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
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
      tableName: "teams", // ✅ consistent lowercase naming
      freezeTableName: true, // ✅ prevents Sequelize renaming
      timestamps: true, // ✅ enables Sequelize time tracking
    }
  );

  return Team;
};
