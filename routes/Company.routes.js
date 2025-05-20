const express = require("express");
const router = express.Router();
const {
  createCompany,
  getCompaniesForMasterUser,
} = require("../controllers/Company.controller");
const authMaster = require("../middleware/authMaster");

// No auth or tenantResolver needed
router.post("/create-company", createCompany);
router.get("/master/companies", authMaster(), getCompaniesForMasterUser); // Token required

module.exports = router;
