const express = require("express");
const router = express.Router();
const CloseLeadController = require("../controllers/CloseLead.controller");

// Create a CloseLead using freshLeadId
router.post("/", CloseLeadController.createCloseLead);
router.get("/", CloseLeadController.getAllCloseLeads);
router.get("/:id", CloseLeadController.getCloseLeadById);

module.exports = router;
