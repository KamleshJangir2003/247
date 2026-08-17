const { body } = require("express-validator");

const createUserRules = [
  body("firstName").trim().notEmpty().withMessage("First name required"),
  body("username").trim().notEmpty().isLength({ min: 3 }).withMessage("Username min 3 chars"),
  body("email").trim().isEmail().withMessage("Valid email required"),
  body("password").isLength({ min: 6 }).withMessage("Password min 6 chars"),
  body("role").isIn(["SUPER_ADMIN", "ADMIN", "MASTER", "AGENT", "USER"]).withMessage("Invalid role"),
];

const updateUserRules = [
  body("firstName").optional().trim().notEmpty().withMessage("First name cannot be empty"),
  body("email").optional().trim().isEmail().withMessage("Valid email required"),
  body("phone").optional().trim(),
];

module.exports = { createUserRules, updateUserRules };
