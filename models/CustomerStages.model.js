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
      // Stage 7
      stage7_data: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: "Custom data for final October 2025",
      },
      stage7_completed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      stage7_timestamp: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      // Stage 8
      stage8_data: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: "Custom data for final October 2025",
      },
      stage8_completed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      stage8_timestamp: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      // Stage 9
      stage9_data: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: "Custom data for final October 2025",
      },
      stage9_completed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      stage9_timestamp: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      // Stage 10
      stage10_data: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: "Custom data for final October 2025",
      },
      stage10_completed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      stage10_timestamp: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      // Stage 11
      stage11_data: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: "Custom data for final October 2025",
      },
      stage11_completed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      stage11_timestamp: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      // Stage 12
      stage12_data: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: "Custom data for final October 2025",
      },
      stage12_completed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      stage12_timestamp: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      // Stage 13
      stage13_data: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: "Custom data for final October 2025",
      },
      stage13_completed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      stage13_timestamp: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      // Stage 14
      stage14_data: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: "Custom data for final October 2025",
      },
      stage14_completed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      stage14_timestamp: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      // Stage 15
      stage15_data: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: "Custom data for final October 2025",
      },
      stage15_completed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      stage15_timestamp: {
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
