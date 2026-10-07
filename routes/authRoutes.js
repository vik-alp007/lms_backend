const express = require('express');
const { 
  signup, 
  signin, 
  forgotPassword, 
  sendOTP, 
  verifyOTP 
} = require('../controllers/authController.js');

const router = express.Router();

router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);
router.post('/signup', signup);
router.post('/signin', signin);
router.post('/forgot-password', forgotPassword);

module.exports = router;
