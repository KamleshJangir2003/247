const logger = require("../utils/logger");
const env = require("../config/env");

const errorMiddleware = (err, req, res, next) => {
  logger.error(err.message, err.stack);
  const statusCode = err.statusCode || 500;
  const message = env.NODE_ENV === "production" && statusCode === 500
    ? "Internal server error"
    : err.message || "Internal server error";
  res.status(statusCode).json({ success: false, message, errors: [] });
};

module.exports = { errorMiddleware };
