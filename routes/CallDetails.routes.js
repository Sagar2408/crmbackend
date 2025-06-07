const express = require("express");
const router = express.Router();
const { saveCallDetails } = require("../controllers/CallDetails.controller");
const auth = require("../middleware/auth"); // 👈 Your existing middleware

// POST route to save call details
router.post("/", auth(), saveCallDetails); // 👈 No roles restriction for now

module.exports = router;