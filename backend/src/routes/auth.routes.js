const express = require('express');
const router = express.Router();
const { register, login, getCurrentUser, updateProfile, updateSettings } = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.post('/register', register);
router.post('/login', login);
router.get('/me', authMiddleware, getCurrentUser);
router.put('/profile', authMiddleware, updateProfile);
router.put('/settings', authMiddleware, updateSettings);

module.exports = router;
