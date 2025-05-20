const express = require("express");
const router = express.Router();
const followUpHistoryController = require("../controllers/FollowUpHistory.controller");
const auth = require("../middleware/auth");

// Create follow-up history
router.post("/create", followUpHistoryController.createFollowUpHistory);

// Update follow-up history

// Get all follow-up histories
router.get(
  "/",
  auth(),
  followUpHistoryController.getFollowUpHistoriesByExecutive
);

module.exports = router;
