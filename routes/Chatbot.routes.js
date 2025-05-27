const express = require("express");
const router = express.Router();
const { generateResponse } = require("../controllers/Chatbot.controller");

// ✅ Use "/" so full path becomes /api/chatbot (not /api/chatbot/chatbot)
router.post("/", generateResponse);

module.exports = router;
