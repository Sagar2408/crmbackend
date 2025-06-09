const saveCallDetails = async (req, res) => {
  try {
    const {
      executiveId,
      clientName,
      clientPhone,
      recordingPath,
      callStartTime,
      callEndTime,
      duration
    } = req.body;

    console.log("📥 Received Call Metadata:", {
      executiveId,
      clientName,
      clientPhone,
      recordingPath,
      callStartTime,
      callEndTime,
      duration
    });

    if (!executiveId || !clientName || !clientPhone || !recordingPath || !callStartTime || !callEndTime || !duration) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const db = req.db;
    if (!db || !db.CallDetails) {
      return res.status(500).json({ error: "CallDetails model not available in tenant DB" });
    }

    const newCall = await db.CallDetails.create({
      executiveId,
      clientName,
      clientPhone,
      recordingPath,
      startTime: callStartTime,
      endTime: callEndTime,
      durationSeconds: parseInt(duration, 10)
    });

    return res.status(201).json({
      message: "✅ Call details saved",
      data: newCall
    });
  } catch (error) {
    console.error("🔥 Error saving call details:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { saveCallDetails };
