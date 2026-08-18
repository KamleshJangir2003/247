const rateLimit = require("express-rate-limit");
const env = require("../config/env");

// Disable rate limiting in test environment to prevent test interference
const skip = () => env.NODE_ENV === "test";

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  skip,
  message: { success: false, message: "Too many requests, please try again later.", errors: [] },
  standardHeaders: true,
  legacyHeaders: false,
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  skip,
  message: { success: false, message: "Too many requests, please try again later.", errors: [] },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { authLimiter, apiLimiter };
