const mongoose = require("mongoose");
const env = require("./env");
const logger = require("../utils/logger");

const connect = async () => {
  await mongoose.connect(env.MONGO_URI);
  logger.info("MongoDB connected");
};

mongoose.connection.on("disconnected", () => logger.warn("MongoDB disconnected"));
mongoose.connection.on("error", (err) => logger.error("MongoDB error:", err.message));

module.exports = { connect };
