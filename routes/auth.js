const express = require('express');
const { register, login, getProfile } = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');
const { validate, registerSchema, loginSchema } = require('../middleware/validation');

const router = express.Router();

// Публичные маршруты
router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);

// Защищенные маршруты
router.get('/profile', authenticateToken, getProfile);

module.exports = router;
