const express = require("express");
const router = express.Router();
const leadController = require("../controllers/Lead.controller");

// Define routes
router.get("/", leadController.getAllLeads);
router.get("/:id", leadController.getLeadById);
router.post("/", leadController.createLead);
router.delete("/:id", leadController.deleteLead);
router.put("/reassign", leadController.reassignLead);

module.exports = router;
