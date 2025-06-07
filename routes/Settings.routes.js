const express = require("express");
const router = express.Router();
const settingsController = require("../controllers/Settings.controller");
const auth = require("../middleware/auth"); // Example auth middleware

router.put("/", auth(), settingsController.updateUserSettings);
router.get("/", auth(), settingsController.getUserDetails);

module.exports = router;
