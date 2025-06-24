const express = require("express");
const router = express.Router();
const CloseLeadController = require("../controllers/CloseLead.controller");

// Create a CloseLead using freshLeadId
router.post("/", CloseLeadController.createCloseLead);

// Get all CloseLeads
router.get("/", CloseLeadController.getAllCloseLeads);

// Get single CloseLead by ID
router.get("/:id", CloseLeadController.getCloseLeadById);

// ✅ NEW: Get all CloseLeads for a specific executive (used in admin full report)
router.get(
  "/exec/:executiveName",
  CloseLeadController.getCloseLeadsByExecutive
);

module.exports = router;
