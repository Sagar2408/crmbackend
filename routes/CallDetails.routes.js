const express = require("express");
const router = express.Router();
const { saveCallDetails } = require("../controllers/CallDetails.controller");
const auth = require("../middleware/auth");
const multer = require("multer");
const upload = multer(); // ✅ To parse FormData

// ✅ Route to save only metadata (no file upload)
router.post("/", auth(), upload.any(), saveCallDetails);


module.exports = router;
