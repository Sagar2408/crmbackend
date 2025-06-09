const saveCallDetails = async (req, res) => {
  try {
    const {
      clientName,
      clientPhone,
      recordingPath,
      callStartTime,
      callEndTime,
      duration
    } = req.body;

    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized: No user ID in token" });
    }

    if (!clientName || !clientPhone || !recordingPath || !callStartTime || !callEndTime || !duration) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const db = req.db;
    if (!db) {
      return res.status(500).json({ error: "Tenant DB not available" });
    }

    // ✅ Parse date fields correctly
    const parsedStartTime = new Date(callStartTime);
    const parsedEndTime = new Date(callEndTime);
    const durationInSec = parseInt(duration, 10);

    // Final save
    const newCall = await db.CallDetails.create({
      executiveId: userId,
      clientName,
      clientPhone,
      recordingPath,
      startTime: parsedStartTime,
      endTime: parsedEndTime,
      durationSeconds: durationInSec
    });

    return res.status(201).json({
      message: "Call details saved successfully",
      data: newCall
    });
  } catch (error) {
    console.error("🔥 Error saving call details:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { saveCallDetails };
