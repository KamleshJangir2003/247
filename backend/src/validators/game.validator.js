const { body } = require("express-validator");

const CATEGORIES = ["Lottery", "Sports", "Exchange", "Live Casino", "Slot", "Fantasy", "Crash"];

const createGameRules = [
  body("name").trim().notEmpty().withMessage("Game name required"),
  body("category").isIn(CATEGORIES).withMessage("Invalid category"),
];

const updateGameRules = [
  body("name").optional().trim().notEmpty(),
  body("category").optional().isIn(CATEGORIES).withMessage("Invalid category"),
  body("status").optional().isIn(["active", "inactive"]),
];

module.exports = { createGameRules, updateGameRules };
