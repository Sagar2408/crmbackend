const express = require("express");
const router = express.Router();
const opportunityController = require("../controllers/Opportunity.controller");

// Define routes
router.get("/", opportunityController.getAllOpportunities);
router.get("/:id", opportunityController.getOpportunityById);
router.post("/", opportunityController.createOpportunity);
router.put("/:id", opportunityController.updateOpportunity);
router.delete("/:id", opportunityController.deleteOpportunity);

module.exports = router;
