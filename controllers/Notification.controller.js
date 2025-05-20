const { Op } = require("sequelize");

// Get all notifications for a user (admin or executive) with pagination
const getAllNotificationsByUser = async (req, res) => {
  const Notification = req.db.Notification; // 👈 dynamically get model
  const { userRole } = req.body;
  const userId = req.user?.id;
  const { page = 1 } = req.query;

  const limit = 20;
  const offset = (page - 1) * limit;

  try {
    let whereClause = {};

    if (userRole?.toLowerCase() === "admin") {
      whereClause = { targetRole: "admin" };
    } else if (userRole?.toLowerCase() === "executive") {
      if (!userId) {
        return res
          .status(401)
          .json({ message: "Unauthorized: Missing user ID" });
      }
      whereClause = { userId, targetRole: "executive" };
    } else {
      return res.status(400).json({ message: "Invalid user role" });
    }

    const { count, rows: notifications } = await Notification.findAndCountAll({
      where: whereClause,
      order: [["createdAt", "DESC"]],
      limit,
      offset,
    });

    const totalPages = Math.ceil(count / limit);

    return res.status(200).json({
      notifications,
      pagination: {
        totalNotifications: count,
        currentPage: parseInt(page),
        totalPages,
        limit,
      },
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Other functions remain unchanged
const markAsRead = async (req, res) => {
  const Notification = req.db.Notification; // ✅ Dynamic DB
  const { id } = req.params;

  try {
    const notification = await Notification.findByPk(id);

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    notification.is_read = true;
    await notification.save();

    return res
      .status(200)
      .json({ message: "Notification marked as read", notification });
  } catch (error) {
    console.error("Error updating notification:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const deleteNotification = async (req, res) => {
  const Notification = req.db.Notification; // ✅ Dynamic DB
  const { id } = req.params;

  try {
    const deleted = await Notification.destroy({ where: { id } });

    if (deleted === 0) {
      return res.status(404).json({ message: "Notification not found" });
    }

    return res.status(200).json({ message: "Notification deleted" });
  } catch (error) {
    console.error("Error deleting notification:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
const deleteOldNotifications = async (req, res) => {
  const Notification = req.db.Notification; // ✅ Dynamic DB
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

  try {
    const deleted = await Notification.destroy({
      where: {
        createdAt: {
          [Op.lt]: threeMonthsAgo,
        },
      },
    });

    return res.status(200).json({
      message: `${deleted} old notification(s) deleted`,
    });
  } catch (error) {
    console.error("Error deleting old notifications:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
const copyTextNotification = async (req, res) => {
  const notification = req.db.Notification;
  const { userId, userRole, message } = req.body;

  if (!userId || !message) {
    return res.status(400).json({
      message: "userId and message are required",
    });
  }

  try {
    const notification = await Notification.create({
      userId,
      message,
      targetRole: "admin",
    });
    return res
      .status(201)
      .json({ message: "Notification created", notification });
  } catch (error) {
    console.error("Error creating copy event notification:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  markAsRead,
  deleteNotification,
  deleteOldNotifications,
  getAllNotificationsByUser,
  copyTextNotification,
};
