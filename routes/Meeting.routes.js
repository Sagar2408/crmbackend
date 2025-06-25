const express = require("express");
const router = express.Router();
const meetingController = require("../controllers/Meeting.controller");
const auth = require("../middleware/auth");

// Define routes
router.get("/", meetingController.getAllMeetings);
router.get("/admin/:executiveName", auth(), meetingController.getMeetingsByExecutiveName); // ✅ Fixed here
router.get("/exec", auth(), meetingController.getMeetingByExecutive);
router.post("/", auth(), meetingController.createMeeting);
router.put("/:id", meetingController.updateMeeting);
router.delete("/:id", meetingController.deleteMeeting);

module.exports = router;
