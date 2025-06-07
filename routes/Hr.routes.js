const express = require("express");
const router = express.Router();
const { signupHr, loginHr } = require("../controllers/Hr.controller");

router.post("/signup", signupHr);
router.post("/login", loginHr);

module.exports = router;
