const { Op } = require("sequelize");

// 📌 Create a new FollowUpHistory record
exports.createFollowUpHistory = async (req, res) => {
  try {
    const {
      follow_up_id,
      connect_via,
      follow_up_type,
      interaction_rating,
      reason_for_follow_up,
      follow_up_date,
      follow_up_time,
      fresh_lead_id,
    } = req.body;

    const { FollowUpHistory, FollowUp, FreshLead } = req.db; // ✅ Dynamic DB injection

    // Validate required fields
    if (
      !follow_up_id ||
      !connect_via ||
      !follow_up_type ||
      !interaction_rating ||
      !reason_for_follow_up ||
      !follow_up_date ||
      !follow_up_time ||
      !fresh_lead_id
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Validate FollowUp and FreshLead existence
    const followUp = await FollowUp.findByPk(follow_up_id);
    if (!followUp) {
      return res.status(404).json({ error: "FollowUp not found" });
    }

    const freshLead = await FreshLead.findByPk(fresh_lead_id);
    if (!freshLead) {
      return res.status(404).json({ error: "FreshLead not found" });
    }

    const followUpHistory = await FollowUpHistory.create({
      follow_up_id,
      connect_via,
      follow_up_type,
      interaction_rating,
      reason_for_follow_up,
      follow_up_date,
      follow_up_time,
      fresh_lead_id,
    });

    return res.status(201).json({
      message: "FollowUpHistory created successfully",
      followUpHistory,
    });
  } catch (error) {
    console.error("Error creating FollowUpHistory:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// 📌 Get all FollowUpHistory records for a specific executive
exports.getFollowUpHistoriesByExecutive = async (req, res) => {
  try {
    const { FollowUpHistory, FollowUp, FreshLead, Lead } = req.db; // ✅ Dynamic DB injection

    const username = req.user?.username;

    if (!username) {
      return res.status(400).json({ error: "Username not found in token" });
    }

    const followUpHistories = await FollowUpHistory.findAll({
      include: [
        {
          model: FollowUp,
          as: "followUp",
        },
        {
          model: FreshLead,
          as: "freshLead",
          include: [
            {
              model: Lead,
              as: "lead",
              where: {
                assignedToExecutive: username,
              },
            },
          ],
        },
      ],
    });

    if (!followUpHistories.length) {
      return res.status(404).json({
        error: "No follow-up history found for this executive",
      });
    }

    return res.status(200).json(followUpHistories);
  } catch (error) {
    console.error("Error fetching FollowUpHistories by executive:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
