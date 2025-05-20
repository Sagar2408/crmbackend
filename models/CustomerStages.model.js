const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const CustomerStages = sequelize.define(
    "CustomerStages",
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
          model: "customers", // ✅ Must match Customer table name
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },

      // Stage 1
      stage1_data: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: "Custom data for October 2023",
      },
      stage1_completed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      stage1_timestamp: {
        type: DataTypes.DATE,
        allowNull: true,
      },

      // Stage 2
      stage2_data: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: "Custom data for October 2024",
      },
      stage2_completed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      stage2_timestamp: {
        type: DataTypes.DATE,
        allowNull: true,
      },

      // Stage 3
      stage3_data: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: "Custom data for October 2025",
      },
      stage3_completed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      stage3_timestamp: {
        type: DataTypes.DATE,
        allowNull: true,
      },

      // Stage 4
      stage4_data: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: "Custom data for first October 2026",
      },
      stage4_completed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      stage4_timestamp: {
        type: DataTypes.DATE,
        allowNull: true,
      },

      // Stage 5
      stage5_data: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: "Custom data for second October 2026",
      },
      stage5_completed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      stage5_timestamp: {
        type: DataTypes.DATE,
        allowNull: true,
      },

      // Stage 6
      stage6_data: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: "Custom data for final October 2025",
      },
      stage6_completed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      stage6_timestamp: {
        type: DataTypes.DATE,
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
      tableName: "customer_stages", // ✅ Explicit table name
      freezeTableName: true, // ✅ Prevents Sequelize from changing the name
      timestamps: true, // ✅ Ensures automatic createdAt/updatedAt
    }
  );

  return CustomerStages;
};
