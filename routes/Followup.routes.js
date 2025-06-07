const express = require("express");
const router = express.Router();
const followUpController = require("../controllers/Followup.controller");
const auth = require("../middleware/auth");
// Create follow-up
router.post("/create", followUpController.createFollowUp); //for follow up
router.put("/:id", followUpController.updateFollowUp);
router.get("/", auth(), followUpController.getFollowUps); // get follow ups

module.exports = router;
