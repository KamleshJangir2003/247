const { body } = require("express-validator");

const transferRules = [
  body("receiverId").optional(),   // master route uses agentId, agent route uses userId
  body("agentId").optional(),
  body("userId").optional(),
  body("amount").isFloat({ min: 0.01 }).withMessage("Amount must be > 0"),
];

const depositRules = [
  body("amount").isFloat({ min: 1 }).withMessage("Amount must be >= 1"),
  body("idempotencyKey").optional().isString().trim().isLength({ min: 1, max: 128 }).withMessage("idempotencyKey must be 1-128 chars"),
];

const withdrawalRules = [
  body("amount").isFloat({ min: 1 }).withMessage("Amount must be >= 1"),
];

module.exports = { transferRules, depositRules, withdrawalRules };
