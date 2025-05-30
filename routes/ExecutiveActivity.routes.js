const express = require("express");
const router = express.Router();
const executiveActivityController = require("../controllers/ExecutiveActivity.controller");

// ✅ Main executive activity routes
router.post("/startWork", executiveActivityController.startWork);
router.post("/stopWork", executiveActivityController.stopWork);
router.post("/startBreak", executiveActivityController.startBreak);
router.post("/stopBreak", executiveActivityController.stopBreak);
router.post("/updateCallTime", executiveActivityController.updateCallTime);
router.post("/trackLeadVisit", executiveActivityController.trackLeadVisit);

// ✅ GET admin view
router.get("/adminDashboard", executiveActivityController.getAdminDashboard);
router.get("/attendance", executiveActivityController.getWeeklyAttendance);

// ✅ ✅ NEW: Calendar-based activity fetch by date
// Example: /api/executiveActivity/activity-by-date?ExecutiveId=2&date=2025-05-30
router.get("/activity-by-date", executiveActivityController.getExecutiveActivityByDate);

module.exports = router;
