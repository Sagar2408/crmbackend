const express = require("express");
const router = express.Router();
const {
  signupMasterUser,
  loginMasterUser,
  logoutMasterUser, // Import the logout function
} = require("../controllers/MasterUser.controller");
const authMaster = require("../middleware/authMaster");

// Public routes for MasterUser
router.post("/signup", signupMasterUser);
router.post("/login", loginMasterUser);

// Adding the logout route
router.post("/logout", authMaster(), logoutMasterUser); // Logout route

module.exports = router;
