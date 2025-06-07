const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      profile_picture: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      resetPasswordToken: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      resetPasswordExpiry: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },
      role: {
        type: DataTypes.ENUM("Admin", "TL", "Executive"),
        allowNull: false,
        defaultValue: "Executive",
      },
      permission: {
        type: DataTypes.ENUM("approved", "not approved", "pending"),
        allowNull: false,
        defaultValue: "pending",
      },
      is_online: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      // Link to Team
      team_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "teams", // ✅ lowercase to match actual table
          key: "id",
        },
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
      },

      // Additional Profile Info
      firstname: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      lastname: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      country: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      city: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      state: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      postal_code: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      tax_id: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      can_login: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
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
      tableName: "users", // ✅ matches schema convention
      freezeTableName: true, // ✅ disables auto-pluralization
      timestamps: true, // ✅ enables Sequelize time tracking
    }
  );
};