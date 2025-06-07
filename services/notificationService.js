const { Op } = require("sequelize");
const { Notification } = require("../config/sequelize");

const deleteOldNotifications = async () => {
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1); // 👈 1 month ago

  try {
    const deleted = await Notification.destroy({
      where: {
        createdAt: {
          [Op.lt]: oneMonthAgo,
        },
      },
    });

    console.log(`[CRON] Deleted ${deleted} old notification(s)`);
    return deleted;
  } catch (error) {
    console.error("[CRON] Error deleting old notifications:", error);
    throw error;
  }
};

module.exports = { deleteOldNotifications };
