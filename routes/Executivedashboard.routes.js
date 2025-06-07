const express = require("express");
const router = express.Router();

const {
  getExecutiveStats,
} = require("../controllers/Executivedashboard.controller");

const auth = require("../middleware/auth");

// Protected route for executive dashboard (requires valid JWT & executive role)
router.get("/", auth(), getExecutiveStats);

module.exports = router;
