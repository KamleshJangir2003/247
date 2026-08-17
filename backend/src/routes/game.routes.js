const router = require("express").Router();
const ctrl = require("../controllers/game.controller");
const { authenticate } = require("../middleware/auth.middleware");
const { requirePermission } = require("../middleware/permission.middleware");
const { validate } = require("../middleware/validation.middleware");
const { createGameRules, updateGameRules } = require("../validators/game.validator");
const { body } = require("express-validator");

// Public: list and get games
router.get("/",    ctrl.list);
router.get("/:id", ctrl.getOne);

// Protected: manage games
router.post("/",           authenticate, requirePermission("games.create"), createGameRules, validate, ctrl.create);
router.put("/:id",         authenticate, requirePermission("games.update"), updateGameRules, validate, ctrl.update);
router.delete("/:id",      authenticate, requirePermission("games.delete"), ctrl.remove);
router.patch("/:id/status",
  authenticate,
  requirePermission("games.update"),
  [body("status").isIn(["active", "inactive"]).withMessage("status must be active or inactive")],
  validate,
  ctrl.setStatus
);

module.exports = router;
