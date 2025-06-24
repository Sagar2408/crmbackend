const express = require("express");
const router = express.Router();
const ConvertedClientController = require("../controllers/ConvertedClient.controller");
const auth = require("../middleware/auth");

// Create a ConvertedClient using fresh_lead_id
router.post("/", ConvertedClientController.createConvertedClient);

// Get all ConvertedClients (for superadmin etc.)
router.get("/", ConvertedClientController.getAllConvertedClients);

// Get converted clients for currently logged-in executive
router.get(
  "/exec",
  auth(),
  ConvertedClientController.getConvertedClientByExecutive
);

// ✅ NEW: Get converted clients by executive name (for admin panel full report)
router.get(
  "/admin/:executiveName",
  ConvertedClientController.getConvertedClientsByExecutiveNameForAdmin
);

module.exports = router;
