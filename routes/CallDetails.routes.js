const express = require("express");
const router = express.Router();
const { saveCallDetails } = require("../controllers/CallDetails.controller");
const auth = require("../middleware/auth");
const multer = require("multer");

const upload = multer(); // ✅ Parses FormData without expecting files

// ✅ Route to save only call metadata (form fields, no audio upload)
router.post("/", auth(), upload.none(), saveCallDetails);

module.exports = router;
