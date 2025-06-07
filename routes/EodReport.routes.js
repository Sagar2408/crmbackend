const express = require("express");
const router = express.Router();
const { getEodReport } = require("../controllers/EodReport.controller"); // Adjust the path based on your project structure

// POST /api/eod-report
router.post("/", getEodReport);

module.exports = router;
