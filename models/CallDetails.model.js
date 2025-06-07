module.exports = (sequelize, DataTypes) => {
  const CallDetails = sequelize.define("CallDetails", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    executiveId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    clientName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    clientPhone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    recordingPath: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "Local system path where the recording is stored",
    },
    startTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    durationSeconds: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "Call duration in seconds",
    },
  }, {
    tableName: "call_details",
    timestamps: true, // adds createdAt and updatedAt
  });

  return CallDetails;
};


// model ko sequlize dot js mai import karwana hai 

//auth.js 
module.exports = (sequelize, DataTypes) => {
  const CallDetails = sequelize.define("CallDetails", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    executiveId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    clientName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    clientPhone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    recordingPath: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "Local system path where the recording is stored",
    },
    startTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    durationSeconds: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "Call duration in seconds",
    },
  }, {
    tableName: "call_details",
    timestamps: true, // adds createdAt and updatedAt
  });

  return CallDetails;
};