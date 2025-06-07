const express = require("express");
const router = express.Router();
const { getCalendar } = require("../controllers/Calendar.controller");

router.get("/holidays", getCalendar);

module.exports = router;
