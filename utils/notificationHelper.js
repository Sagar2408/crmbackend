const { getTenantDB } = require("../config/sequelizeManager");

let ioInstance;
let connectedUsersMap;

const initializeNotificationHelper = (io, connectedUsers) => {
  ioInstance = io;
  connectedUsersMap = connectedUsers;
};

const sendNotificationToUser = async (userId, companyId, notificationData) => {
  try {
    const socketId = connectedUsersMap[userId];
    const tenantDB = await getTenantDB(companyId);

    const notification = await tenantDB.Notification.create(notificationData);

    if (socketId && ioInstance) {
      ioInstance.to(socketId).emit("new_notification", notification);
      console.log(`📨 Sent notification to user ${userId}`);
    } else {
      console.log(`⚠️ User ${userId} not connected`);
    }
  } catch (err) {
    console.error("❌ Error sending notification:", err);
  }
};

module.exports = {
  initializeNotificationHelper,
  sendNotificationToUser,
};
