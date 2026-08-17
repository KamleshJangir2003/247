const { body } = require("express-validator");

const registerRules = [
  body("firstName").trim().notEmpty().withMessage("First name is required"),
  body("username").trim().notEmpty().isLength({ min: 3 }).withMessage("Username min 3 chars"),
  body("email").trim().isEmail().withMessage("Valid email required"),
  body("password").isLength({ min: 6 }).withMessage("Password min 6 chars"),
];

const loginRules = [
  body("username").trim().notEmpty().withMessage("Username or email required"),
  body("password").notEmpty().withMessage("Password required"),
];

const changePasswordRules = [
  body("currentPassword").notEmpty().withMessage("Current password required"),
  body("newPassword").isLength({ min: 6 }).withMessage("New password min 6 chars"),
];

module.exports = { registerRules, loginRules, changePasswordRules };
