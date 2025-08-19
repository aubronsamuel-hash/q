// Authentication routes
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// POST /auth/register -> create a new user
router.post('/register', authController.register);

// POST /auth/login -> login and receive JWT token
router.post('/login', authController.login);

module.exports = router;
