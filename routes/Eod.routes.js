

const express = require('express');
const router = express.Router();
const { sendEodEmail } = require('../controllers/Eod.controller');

router.post('/report', sendEodEmail);

module.exports = router;