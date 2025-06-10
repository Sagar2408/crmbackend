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

    // 🪵 Log raw incoming data
    console.log("📥 Incoming Call Metadata:", {
      executiveId,
      clientName,
      clientPhone,
      recordingPath,
      callStartTime,
      callEndTime,
      duration
    });

    // 🛡️ Field-level validation
    const missingFields = [];
    if (!executiveId) missingFields.push("executiveId");
    if (!clientName) missingFields.push("clientName");
    if (!clientPhone) missingFields.push("clientPhone");
    if (!recordingPath) missingFields.push("recordingPath");
    if (!callStartTime) missingFields.push("callStartTime");
    if (!callEndTime) missingFields.push("callEndTime");
    if (!duration) missingFields.push("duration");

    if (missingFields.length > 0) {
      return res.status(400).json({
        error: "Missing required fields",
        missingFields
      });
    }

    // 🔍 Check tenant DB and model
    const db = req.db;
    if (!db || !db.CallDetails) {
      console.error("❌ CallDetails model not found in req.db");
      return res.status(500).json({
        error: "CallDetails model not available in tenant DB"
      });
    }

    console.log("✅ CallDetails model available. Saving to DB...");

    // 💾 Save to DB
    const newCall = await db.CallDetails.create({
      executiveId,
      clientName,
      clientPhone,
      recordingPath,
      startTime: callStartTime,
      endTime: callEndTime,
      durationSeconds: parseInt(duration, 10)
    });

    console.log("✅ Saved call to DB:", newCall?.id || "No ID returned");

    return res.status(201).json({
      message: "✅ Call details saved successfully",
      data: newCall
    });
  } catch (error) {
    console.error("🔥 Error in saveCallDetails:", error.message);
    console.error("🧠 Stack trace:", error.stack);
    return res.status(500).json({
      error: "Internal Server Error",
      details: error.message
    });
  }
};

module.exports = { saveCallDetails };
