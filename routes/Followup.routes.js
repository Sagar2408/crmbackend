const express = require("express");
const router = express.Router();
const followUpController = require("../controllers/Followup.controller");
const auth = require("../middleware/auth");

// 📌 Create a follow-up
router.post("/create", followUpController.createFollowUp);

// 📌 Update a follow-up by ID
router.put("/:id", followUpController.updateFollowUp);

// 📌 Get follow-ups for logged-in executive
router.get("/", auth(), followUpController.getFollowUps);

// ✅ NEW: Get follow-ups by executive name (admin use)
router.get("/by-executive/:executiveName", auth(), followUpController.getFollowUpsByExecutive);

module.exports = router;
