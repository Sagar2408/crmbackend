const express = require('express');
const router = express.Router();
const { 
  updateUserLoginStatus, 
  getUserLoginStatus, 
} = require('../controllers/UserStatus.Controller');
const auth = require('../middleware/auth');

// Routes require authentication and appropriate privileges
router.put('/login-status', auth(['Admin']), updateUserLoginStatus);
router.get('/login-status/:userId', auth(['Admin', 'TL']), getUserLoginStatus);

module.exports = router;