const express = require("express");
const router = express.Router();
const revenueChartController = require("../controllers/RevenueChart.controller");

// Route to fetch revenue and lead data
router.get("/revenue-data", revenueChartController.getRevenueData);

module.exports = router;