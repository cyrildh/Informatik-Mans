const express = require('express');
const userController = require('../controllers/userController');
const { authenticateJWT } = require('../services/tokenService');

const router = express.Router();

// Serve Register Page
router.get('/register', userController.serveRegisterPage);

// Serve Login Page
router.get('/login', userController.serveLoginPage);

// User Registration Route
router.post('/register', userController.registerUser);

// User Login Route
router.post('/login', userController.loginUser);

module.exports = router;
