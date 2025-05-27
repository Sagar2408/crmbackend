const express = require("express");
const router = express.Router();
const { generateResponse } = require("../controllers/Chatbot.controller");

router.post("/", generateResponse); // ✅ only "/"

module.exports = router;
