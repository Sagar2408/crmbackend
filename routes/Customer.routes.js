const express = require("express");
const router = express.Router();
const {
  loginCustomer,
  signupCustomer,
  logoutCustomer,
} = require("../controllers/Customer.controller");
const auth = require("../middleware/auth");

// Login Route
router.post("/login", loginCustomer);

// Signup Route
router.post("/signup", signupCustomer);

// Logout Route
router.post("/logout", auth(), logoutCustomer);
module.exports = router;
