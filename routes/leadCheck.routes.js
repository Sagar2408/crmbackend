const express = require('express');
const router = express.Router();

const { getLeadName } = require('../controllers/leadCheck.controller');

router.get('/get-name', getLeadName);

module.exports = router;
