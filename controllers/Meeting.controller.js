// 📌 Get all meetings with pagination
exports.getAllMeetings = async (req, res) => {
  const Meeting = req.db.Meeting;
  const { page = 1, limit = 20 } = req.query;
  const offset = (page - 1) * limit;

  try {
    const { count, rows: meetings } = await Meeting.findAndCountAll({
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [["startTime", "DESC"]],
    });

    const totalPages = Math.ceil(count / limit);

    res.status(200).json({
      meetings,
      pagination: {
        totalMeetings: count,
        currentPage: parseInt(page),
        totalPages,
        limit: parseInt(limit),
      },
    });
  } catch (error) {
    console.error("Error fetching meetings:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// 📌 Get meetings for logged-in executive
exports.getMeetingByExecutive = async (req, res) => {
  const { Meeting, Users, FreshLead, Lead, ClientLead } = req.db;
  const executiveUsername = req.user?.username;

  if (!executiveUsername) {
    return res.status(401).json({ error: "Unauthorized: Executive username missing in token" });
  }

  try {
    const executive = await Users.findOne({
      where: { username: executiveUsername },
      attributes: ["id"],
    });

    if (!executive) {
      return res.status(404).json({ error: "Executive not found" });
    }

    const meetings = await Meeting.findAll({
      where: { executiveId: executive.id },
      attributes: [
        "id",
        "clientName",
        "clientEmail",
        "clientPhone",
        "reasonForFollowup",
        "startTime",
        "endTime",
      ],
      include: [
        {
          model: FreshLead,
          as: "freshLead",
          attributes: ["id"],
          include: [
            {
              model: Lead,
              as: "lead",
              attributes: ["id"],
              include: [
                {
                  model: ClientLead,
                  as: "clientLead",
                  attributes: ["id", "status", "name", "email"],
                },
              ],
            },
          ],
        },
      ],
    });

    if (meetings.length === 0) {
      return res.status(404).json({ message: "No meetings found for this executive" });
    }

    const response = meetings.map((meeting) => {
      const freshLead = meeting.freshLead;
      const lead = freshLead?.lead;
      const clientLead = lead?.clientLead;

      return {
        ...meeting.toJSON(),
        clientLead: clientLead
          ? {
              id: clientLead.id,
              name: clientLead.name,
              email: clientLead.email,
              status: clientLead.status,
            }
          : null,
      };
    });

    return res.status(200).json({ data: response });
  } catch (error) {
    console.error("Error fetching meetings by executive:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// 📌 NEW: Get meetings by executiveName (for admin dashboard)
exports.getMeetingsByExecutiveName = async (req, res) => {
  const { Meeting, Users } = req.db;
  const { executiveName } = req.params;

  if (!executiveName) {
    return res.status(400).json({ message: "Executive name is required." });
  }

  try {
    const executive = await Users.findOne({
      where: { username: executiveName },
      attributes: ["id"],
    });

    if (!executive) {
      return res.status(404).json({ message: "Executive not found" });
    }

    const meetings = await Meeting.findAll({
      where: { executiveId: executive.id },
      order: [["startTime", "DESC"]],
    });

    return res.status(200).json({
      message: `Meetings for executive ${executiveName} fetched successfully.`,
      data: meetings,
    });
  } catch (error) {
    console.error("Error fetching meetings by executive name:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// 📌 Create a new meeting
exports.createMeeting = async (req, res) => {
  const { Meeting, FreshLead, Lead, ClientLead } = req.db;

  try {
    const {
      clientName,
      clientEmail,
      clientPhone,
      reasonForFollowup,
      startTime,
      endTime,
      fresh_lead_id,
    } = req.body;
    const executiveId = req.user.id;

    if (!clientName || !clientEmail || !clientPhone || !startTime || !fresh_lead_id) {
      return res.status(400).json({
        message:
          "clientName, clientEmail, clientPhone, startTime, and fresh_lead_id are required",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(clientEmail)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const startDate = new Date(startTime);
    if (isNaN(startDate.getTime()) || startDate < new Date()) {
      return res.status(400).json({ message: "Invalid or past startTime" });
    }

    if (endTime) {
      const endDate = new Date(endTime);
      if (isNaN(endDate.getTime()) || endDate <= startDate) {
        return res.status(400).json({ message: "endTime must be after startTime" });
      }
    }

    const freshLead = await FreshLead.findByPk(fresh_lead_id);
    if (!freshLead) return res.status(404).json({ message: "FreshLead not found" });

    const lead = await Lead.findByPk(freshLead.leadId);
    if (!lead) return res.status(404).json({ message: "Lead not found" });

    const clientLead = await ClientLead.findByPk(lead.clientLeadId);
    if (!clientLead) return res.status(404).json({ message: "ClientLead not found" });

    const transaction = await Meeting.sequelize.transaction();
    try {
      await clientLead.update({ status: "Meeting" }, { transaction });

      const meeting = await Meeting.create(
        {
          clientName,
          clientEmail,
          clientPhone,
          reasonForFollowup,
          startTime,
          endTime,
          executiveId,
          fresh_lead_id,
        },
        { transaction }
      );

      await transaction.commit();

      res.status(201).json({
        message: "Meeting created successfully",
        data: meeting,
      });
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.error("Error creating meeting:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// 📌 Update a meeting
exports.updateMeeting = async (req, res) => {
  const Meeting = req.db.Meeting;

  try {
    const { title, description, startTime, endTime } = req.body;

    const meeting = await Meeting.findByPk(req.params.id);
    if (!meeting) return res.status(404).json({ message: "Meeting not found" });

    await meeting.update({ title, description, startTime, endTime });

    res.status(200).json(meeting);
  } catch (error) {
    console.error("Error updating meeting:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// 📌 Delete a meeting
exports.deleteMeeting = async (req, res) => {
  const Meeting = req.db.Meeting;

  try {
    const meeting = await Meeting.findByPk(req.params.id);
    if (!meeting) return res.status(404).json({ message: "Meeting not found" });

    await meeting.destroy();
    res.status(200).json({ message: "Meeting deleted successfully" });
  } catch (error) {
    console.error("Error deleting meeting:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
