const { Op } = require("sequelize");

exports.getEodReport = async (req, res) => {
  try {
    const { ExecutiveId } = req.body;
    const { ExecutiveActivity, Meeting } = req.db;

    if (!ExecutiveId)
      return res.status(400).json({ message: "ExecutiveId is required" });

    // Define today's date range
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    // Fetch Executive Activity
    const activity = await ExecutiveActivity.findOne({
      where: {
        ExecutiveId,
        createdAt: {
          [Op.between]: [todayStart, todayEnd],
        },
      },
    });

    // Fetch Meetings for the executive
    const meetings = await Meeting.findAll({
      where: {
        executiveId: ExecutiveId,
        startTime: {
          [Op.between]: [todayStart, todayEnd],
        },
      },
    });

    const meetingDetails = meetings.map((meeting) => ({
      clientName: meeting.clientName,
      clientEmail: meeting.clientEmail,
      clientPhone: meeting.clientPhone,
      startTime: meeting.startTime,
      endTime: meeting.endTime,
      reasonForFollowup: meeting.reasonForFollowup,
    }));

    const report = {
      ExecutiveId,
      workTime: activity?.workTime ?? 0,
      breakTime: activity?.breakTime ?? 0,
      dailyCallTime: activity?.dailyCallTime ?? 0,
      leadSectionVisits: activity?.leadSectionVisits ?? 0,
      meetingCount: meetings.length,
      meetings: meetingDetails,
    };

    return res.status(200).json({ message: "EOD Report generated", report });
  } catch (error) {
    console.error("EOD report generation failed:", error);
    return res
      .status(500)
      .json({ message: "Failed to generate EOD report", error });
  }
};
