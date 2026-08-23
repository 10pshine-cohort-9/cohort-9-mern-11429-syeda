
const express = require("express");

const {
  signup,
  login,
  getMe,
} = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");

const authRateLimiter = require("../middleware/rateLimitMiddleware");

const router = express.Router();

// Public signup route with rate limiting
router.post(
  "/signup",
  authRateLimiter,
  signup
);

// Public login route with rate limiting
router.post(
  "/login",
  authRateLimiter,
  login
);

// Protected current-user route
router.get(
  "/me",
  authMiddleware,
  getMe
);

module.exports = router;