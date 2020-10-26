const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');

const authController = require('../controllers/auth.controller');

const authLimiter = rateLimit({
  windowMs: process.env.RATE_LIMIT_WINDOW_MS * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX)
});

router.get(`/`, authLimiter, authController.getIdToken);
router.get(`/verify-token`, authController.verifyIdToken);

module.exports = router;
