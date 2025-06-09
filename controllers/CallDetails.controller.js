const saveCallDetails = async (req, res) => {
  try {
    console.log("📥 [SAVE CALL DETAILS]");

    console.log("👉 req.body:", req.body);
    console.log("👉 req.user:", req.user);
    console.log("👉 req.db.CallDetails:", !!req.db?.CallDetails);

    const {
      clientName,
      clientPhone,
      recordingPath,
      callStartTime,
      callEndTime,
      duration,
    } = req.body;

    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "❌ Unauthorized: No user ID in token" });
    }

    if (!clientName || !clientPhone || !recordingPath || !callStartTime || !callEndTime || !duration) {
      return res.status(400).json({ error: "❌ All fields are required" });
    }

    const db = req.db;
    if (!db) {
      return res.status(500).json({ error: "❌ Tenant DB not available" });
    }

    const newCall = await db.CallDetails.create({
      executiveId: userId,
      clientName,
      clientPhone,
      recordingPath,
      startTime: callStartTime,
      endTime: callEndTime,
      durationSeconds: parseInt(duration, 10),
    });

    console.log("✅ Saved call to DB:", newCall.toJSON());

    return res.status(201).json({
      message: "✅ Call details saved successfully",
      data: newCall,
    });
  } catch (error) {
    console.error("🔥 Error saving call details:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { saveCallDetails };
