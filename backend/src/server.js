const env = require("./config/env");
const { connect } = require("./config/db");
const app = require("./app");
const logger = require("./utils/logger");

const start = async () => {
  try {
    await connect();
    app.listen(env.PORT, () => {
      logger.info(`Server running on port ${env.PORT} [${env.NODE_ENV}]`);
      logger.info(`Health: http://localhost:${env.PORT}/api/v1/health`);
    });
  } catch (err) {
    logger.error("Failed to start server:", err.message);
    process.exit(1);
  }
};

process.on("unhandledRejection", (err) => {
  logger.error("Unhandled rejection:", err.message);
  process.exit(1);
});

process.on("uncaughtException", (err) => {
  logger.error("Uncaught exception:", err.message);
  process.exit(1);
});

start();
