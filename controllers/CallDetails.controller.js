const saveCallDetails = async (req, res) => {
  try {
    const db = req.db; // 👈 Get tenant-specific DB instance
    const { CallDetails } = db;

    const {
      clientName,
      clientPhone,
      recordingPath: rawPath,
      callStartTime,
      callEndTime,
    } = req.body;

    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized: User ID missing from token" });
    }

    // Check for missing fields
    if (!clientName || !clientPhone || !rawPath || !callStartTime || !callEndTime) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Final full logical recording path
    const recordingPath = `Downloads/${rawPath}`;

    const newCall = await CallDetails.create({
      executiveId: userId,
      clientName,
      clientPhone,
      recordingPath,
      startTime: callStartTime,
      endTime: callEndTime,
      durationSeconds: Math.floor((new Date(callEndTime) - new Date(callStartTime)) / 1000),
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
