const express = require('express');
const router = express.Router();
const { register, login, saveAttempt } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// POST /api/auth/register
router.post('/register', register);

// POST /api/auth/login
router.post('/login', login);

// POST /api/auth/attempts (protected)
router.post('/attempts', protect, saveAttempt);

module.exports = router;
