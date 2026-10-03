const express = require('express');
const { getProfile } = require('../controllers/userController.js');
const { protect } = require('../middleware/authMiddleware.js');

const router = express.Router();

// Protected route
router.get('/me', protect, getProfile);

module.exports = router;
