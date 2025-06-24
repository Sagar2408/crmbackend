const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const tenantResolver = require("../middleware/tenantResolver");
const controller = require("../controllers/SheetIntegration.controller");

// ✅ Save Sheet ID manually (if admin chooses)
router.post("/save-sheet-id", auth(), tenantResolver, controller.saveSheetId);

// ✅ Import leads from Google Sheet to DB
router.post("/import-leads", auth(), tenantResolver, controller.importClientLeads);

// ✅ OAuth callback after Google authorization
router.get("/oauth2callback", auth(), tenantResolver, controller.oauthCallback);

module.exports = router;
