const { CallDetails } = require("../db");

const saveCallDetails = async (req, res) => {
  try {
    const { clientName, clientPhone, recordingPath, callStartTime, callEndTime } = req.body;

    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized: User ID missing from token" });
    }

    if (!clientName || !clientPhone || !recordingPath || !callStartTime || !callEndTime) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newCall = await CallDetails.create({
      executiveId: userId,
      clientName,
      clientPhone,
      recordingPath,
      callStartTime,
      callEndTime,
    });

    return res.status(201).json({
      message: "Call recording details saved successfully",
      data: newCall,
    });
  } catch (error) {
    console.error("❌ Error saving call details:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { saveCallDetails };