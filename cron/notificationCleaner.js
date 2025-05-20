const cron = require("node-cron");
const { deleteOldNotifications } = require("../services/notificationService");

// Runs every day at midnight
cron.schedule("0 0 * * *", async () => {
  console.log("[CRON] Running old notifications cleaner...");
  await deleteOldNotifications();
});
