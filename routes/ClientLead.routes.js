const express = require("express");
const router = express.Router();
const {
  upload,
  uploadFile,
  getClientLeads,
  assignExecutive,
  getLeadsByExecutive,
  getDealFunnel,
} = require("../controllers/ClientLead.controller");

router.post("/upload", upload.single("file"), uploadFile);
router.get("/getClients", getClientLeads);
router.put("/assign-executive", assignExecutive);
router.get("/executive", getLeadsByExecutive);
router.get("/dealfunnel", getDealFunnel);

module.exports = router;
