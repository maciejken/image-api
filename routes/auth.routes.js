const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');

const authController = require('../controllers/auth.controller');

const authLimiter = rateLimit({
  windowMs: process.env.RATE_LIMIT_WINDOW_MS * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX)
});

router.get(`/login`, authController.renderLoginForm);
router.post(`/login`, authLimiter, authController.login);
router.get('/logout', authController.logout);

module.exports = router;
