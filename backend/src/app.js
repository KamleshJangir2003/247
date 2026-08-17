const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const mongoSanitize = require("express-mongo-sanitize");
const hpp = require("hpp");
const env = require("./config/env");
const { apiLimiter } = require("./middleware/rateLimit.middleware");
const { errorMiddleware } = require("./middleware/error.middleware");
const logger = require("./utils/logger");

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: env.CLIENT_URL,
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// Body parsing
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// NoSQL injection protection — strips $ and . from req.body/params/query
app.use(mongoSanitize());

// HTTP Parameter Pollution protection
app.use(hpp());

// Global rate limiter
app.use("/api/", apiLimiter);

// Request logger (dev only)
if (env.NODE_ENV === "development") {
  app.use((req, _res, next) => {
    logger.debug(`${req.method} ${req.originalUrl}`);
    next();
  });
}

// Health check
app.get("/api/v1/health", (_req, res) => {
  res.json({ success: true, message: "API is running" });
});

// Routes
app.use("/api/v1/auth",         require("./routes/auth.routes"));
app.use("/api/v1/users",        require("./routes/user.routes"));
app.use("/api/v1/games",        require("./routes/game.routes"));
app.use("/api/v1/providers",    require("./routes/provider.routes"));
app.use("/api/v1/wallet",       require("./routes/wallet.routes"));
app.use("/api/v1/deposits",     require("./routes/deposit.routes"));
app.use("/api/v1/withdrawals",  require("./routes/withdrawal.routes"));
app.use("/api/v1/transactions", require("./routes/transaction.routes"));
app.use("/api/v1/bonuses",      require("./routes/bonus.routes"));
app.use("/api/v1/admin",        require("./routes/admin.routes"));
app.use("/api/v1/master",       require("./routes/master.routes"));
app.use("/api/v1/agent",        require("./routes/agent.routes"));
app.use("/api/v1/reports",      require("./routes/report.routes"));

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ success: false, message: "Route not found", errors: [] });
});

// Centralized error handler
app.use(errorMiddleware);

module.exports = app;
