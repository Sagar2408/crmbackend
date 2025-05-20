const express = require("express");
const router = express.Router();
const {
  createCustomerStages,
  getCustomerStages,
  updateCustomerStages,
} = require("../controllers/CustomerStages.controller");

router.post("/stages", createCustomerStages);
router.get("/stages", getCustomerStages);
router.put("/stages", updateCustomerStages);

module.exports = router;
