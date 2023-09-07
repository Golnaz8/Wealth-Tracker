const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Define registration route
router.post('/register', authController.register);

// Define login route
router.post('/login', authController.login);

// Define logout route
router.get('/logout', authController.logout);

// Define password reset route
router.post('/reset-password', authController.resetPassword);

module.exports = router;
