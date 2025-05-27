const express = require("express");
const router = express.Router();
const { generateResponse } = require("../controllers/Chatbot.controller");

// ✅ This matches /api/chatbot correctly
router.post("/", generateResponse);

module.exports = router;
