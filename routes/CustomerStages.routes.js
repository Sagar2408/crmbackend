const express = require("express");
const router = express.Router();
const {
  createCustomerStages,
  getCustomerStages,
  updateCustomerStages,
  getCustomerStagesById
} = require("../controllers/CustomerStages.controller");

router.post("/stages", createCustomerStages);
router.get("/stages", getCustomerStages);
router.put("/stages", updateCustomerStages);
router.get("/customer-stages/:customerId", getCustomerStagesById);

module.exports = router;
