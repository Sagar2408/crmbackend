const express = require("express");
const router = express.Router();
const freshLeadController = require("../controllers/FreshLead.controller");
const auth = require("../middleware/auth");

// POST - Create a new fresh lead
router.post("/", freshLeadController.createFreshLead);
router.put("/update-followup/:id", freshLeadController.updateFollowUp);
router.get("/", auth(), freshLeadController.getFreshLeadsByExecutive);
router.get("/getClientlead", freshLeadController.getClientLeadByFreshLead)
router.put("/update-clientlead", freshLeadController.updateFullClientLeadByFreshLead)

module.exports = router;
