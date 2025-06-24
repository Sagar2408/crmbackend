const express = require("express");
const router = express.Router();
const CloseLeadController = require("../controllers/CloseLead.controller");
const auth = require("../middleware/auth");

// ✅ Create a CloseLead using freshLeadId
router.post("/", CloseLeadController.createCloseLead);

// ✅ Get all CloseLeads
router.get("/", CloseLeadController.getAllCloseLeads);

// ✅ Get CloseLead by ID
router.get("/:id", CloseLeadController.getCloseLeadById);

// ✅ NEW: Get all CloseLeads for a specific executive (used in admin full report)
router.get(
  "/by-executive/:executiveName",
  auth(), // protect this route
  CloseLeadController.getCloseLeadsByExecutive
);

module.exports = router;
