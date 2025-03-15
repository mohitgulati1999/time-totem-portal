
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Auth routes - removed requireSignin middleware for testing
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/user/:userId', authController.getUserById);

module.exports = router;
