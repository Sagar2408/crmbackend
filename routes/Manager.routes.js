const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  signupManager,
  loginManager,
  logoutManager,
  createTeam,
  getManagerTeams,
  addExecutiveToTeam
} = require("../controllers/Manager.controller");

router.post("/signup", signupManager);
router.post("/login", loginManager);
router.post("/logout", auth(), logoutManager);
router.post("/teams", auth(), createTeam);
router.get("/teams", auth(), getManagerTeams);
router.post("/addExecutive", auth(),addExecutiveToTeam)

module.exports = router;
