const { Op } = require("sequelize");

// ✅ Start Work Session
exports.startWork = async (req, res) => {
  try {
    const { ExecutiveId } = req.body;
    const { ExecutiveActivity } = req.db;

    if (!ExecutiveId)
      return res.status(400).json({ message: "ExecutiveId is required" });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let activity = await ExecutiveActivity.findOne({
      where: {
        ExecutiveId,
        updatedAt: { [Op.gte]: today },
      },
    });

    if (!activity) {
      activity = await ExecutiveActivity.create({
        ExecutiveId,
        workStartTime: new Date(),
        workTime: 0,
        breakTime: 0,
        dailyCallTime: 0,
        leadSectionVisits: 0,
      });
    } else if (!activity.workStartTime) {
      activity.workStartTime = new Date();
      await activity.save();
    }

    res.json({ message: "Work session started", activity });
  } catch (error) {
    res.status(500).json({ message: "Error starting work session", error });
  }
};

// ✅ Stop Work Session
exports.stopWork = async (req, res) => {
  try {
    const { ExecutiveId } = req.body;
    const { ExecutiveActivity } = req.db;

    if (!ExecutiveId)
      return res.status(400).json({ message: "ExecutiveId is required" });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let activity = await ExecutiveActivity.findOne({
      where: {
        ExecutiveId,
        updatedAt: { [Op.gte]: today },
      },
    });

    if (!activity || !activity.workStartTime) {
      return res.status(400).json({ message: "Work session not started" });
    }

    const workDuration = Math.floor(
      (new Date() - new Date(activity.workStartTime)) / 1000
    );

    activity.workTime += workDuration;
    activity.workStartTime = null;
    await activity.save();

    res.json({ message: "Work session stopped", workDuration, activity });
  } catch (error) {
    res.status(500).json({ message: "Error stopping work session", error });
  }
};

// ✅ Start Break
exports.startBreak = async (req, res) => {
  try {
    const { ExecutiveId } = req.body;
    const { ExecutiveActivity, Users } = req.db;

    if (!ExecutiveId)
      return res.status(400).json({ message: "ExecutiveId is required" });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let activity = await ExecutiveActivity.findOne({
      where: {
        ExecutiveId,
        updatedAt: { [Op.gte]: today },
      },
    });

    if (!activity)
      return res.status(400).json({ message: "No activity found for today" });

    activity.breakStartTime = new Date();
    await activity.save();

    await Users.update({ is_online: false }, { where: { id: ExecutiveId } });

    res.json({ message: "Break started", activity });
  } catch (error) {
    console.error("Error starting break:", error);
    res.status(500).json({ message: "Error starting break", error });
  }
};

// ✅ Stop Break
exports.stopBreak = async (req, res) => {
  try {
    const { ExecutiveId } = req.body;
    const { ExecutiveActivity, Users } = req.db;

    if (!ExecutiveId)
      return res.status(400).json({ message: "ExecutiveId is required" });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let activity = await ExecutiveActivity.findOne({
      where: {
        ExecutiveId,
        updatedAt: { [Op.gte]: today },
      },
    });

    if (!activity || !activity.breakStartTime) {
      return res.status(400).json({ message: "Break session not started" });
    }

    const breakDuration = Math.floor(
      (new Date() - new Date(activity.breakStartTime)) / 1000
    );

    activity.breakTime += breakDuration;
    activity.breakStartTime = null;
    await activity.save();

    await Users.update({ is_online: true }, { where: { id: ExecutiveId } });

    res.json({ message: "Break stopped", breakDuration, activity });
  } catch (error) {
    console.error("Error stopping break:", error);
    res.status(500).json({ message: "Error stopping break", error });
  }
};

// ✅ Update Call Time
exports.updateCallTime = async (req, res) => {
  try {
    const { ExecutiveId, callDuration } = req.body;
    const { ExecutiveActivity } = req.db;

    if (!ExecutiveId || isNaN(callDuration) || callDuration < 0) {
      return res
        .status(400)
        .json({ message: "Invalid callDuration or ExecutiveId" });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let activity = await ExecutiveActivity.findOne({
      where: {
        ExecutiveId,
        updatedAt: { [Op.gte]: today },
      },
    });

    if (!activity) {
      activity = await ExecutiveActivity.create({
        ExecutiveId,
        workTime: 0,
        breakTime: 0,
        dailyCallTime: callDuration * 60,
        leadSectionVisits: 0,
      });
    } else {
      activity.dailyCallTime += callDuration * 60;
      await activity.save();
    }

    res.json({ message: "Call time updated", activity });
  } catch (error) {
    res.status(500).json({ message: "Error updating call time", error });
  }
};

// ✅ Track Lead Visit
exports.trackLeadVisit = async (req, res) => {
  try {
    const { ExecutiveId } = req.body;
    const { ExecutiveActivity } = req.db;

    if (!ExecutiveId)
      return res.status(400).json({ message: "ExecutiveId is required" });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let activity = await ExecutiveActivity.findOne({
      where: {
        ExecutiveId,
        updatedAt: { [Op.gte]: today },
      },
    });

    if (!activity) {
      activity = await ExecutiveActivity.create({
        ExecutiveId,
        workTime: 0,
        breakTime: 0,
        dailyCallTime: 0,
        leadSectionVisits: 1,
      });
    } else {
      activity.leadSectionVisits += 1;
      await activity.save();
    }

    res.json({ message: "Lead visit tracked", activity });
  } catch (error) {
    res.status(500).json({ message: "Error tracking lead visit", error });
  }
};

// ✅ Get Admin Dashboard
exports.getAdminDashboard = async (req, res) => {
  try {
    const { ExecutiveActivity } = req.db;
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const executives = await ExecutiveActivity.findAll({
      where: { updatedAt: { [Op.gte]: todayStart } },
      order: [["updatedAt", "DESC"]],
    });

    res.json({ executives });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching admin dashboard data", error });
  }
};
