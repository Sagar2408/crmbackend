const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/Notification.controller");

router.put("/mark-read/:id", notificationController.markAsRead);
router.post("/mark-multiple-read", notificationController.markMultipleAsRead);
router.delete("/:id", notificationController.deleteNotification);
router.delete("/delete/old", notificationController.deleteOldNotifications);
router.post("/user", notificationController.getAllNotificationsByUser);
router.post("/copy-event", notificationController.copyTextNotification);

module.exports = router;
