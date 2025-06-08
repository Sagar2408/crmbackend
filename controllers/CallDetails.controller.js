const saveCallDetails = async (req, res) => {
  try {
    // 🧠 Log the incoming request body
    console.log("📥 Incoming Call Details:", req.body);

    // ✅ Extract from request
    const { clientName, clientPhone, recordingPath, callStartTime, callEndTime } = req.body;
    const userId = req.user?.id;

    // 🔐 Check user auth
    if (!userId) {
      console.warn("⛔ Unauthorized: No user ID in token");
      return res.status(401).json({ error: "Unauthorized: User ID missing from token" });
    }

    // ❗ Validate inputs
    if (!clientName || !clientPhone || !recordingPath || !callStartTime || !callEndTime) {
      console.warn("❗ Missing fields in call details");
      return res.status(400).json({ error: "All fields are required" });
    }

    // 🧠 Get tenant DB instance
    const db = req.db;
    if (!db) {
      console.error("❌ Tenant DB not found in request");
      return res.status(500).json({ error: "Tenant DB not available" });
    }

    // 📦 Log before save
    console.log("💾 Saving call details to tenant DB:", {
      executiveId: userId,
      clientName,
      clientPhone,
      recordingPath: `Downloads/${recordingPath}`,
      callStartTime,
      callEndTime,
    });

    // 💾 Save the entry
    const newCall = await db.CallDetails.create({
      executiveId: userId,
      clientName,
      clientPhone,
      recordingPath: `Downloads/${recordingPath}`,
      callStartTime,
      callEndTime,
    });

    // ✅ Success
    console.log("✅ Call recording details saved:", newCall.id);
    return res.status(201).json({
      message: "Call recording details saved successfully",
      data: newCall,
    });
  } catch (error) {
    console.error("🔥 Error saving call details:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { saveCallDetails };
