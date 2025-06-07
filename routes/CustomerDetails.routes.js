// routes/customerDetailsRoutes.js
const express = require("express");
const router = express.Router();
const {
  createCustomerDetails,
  getCustomerDetails,
  updateCustomerDetails,
} = require("../controllers/CustomerDetails.controller");

router.post("/", createCustomerDetails);
router.get("/", getCustomerDetails);
router.put("/", updateCustomerDetails);

module.exports = router;
