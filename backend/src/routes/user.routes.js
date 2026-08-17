const router = require("express").Router();
const ctrl = require("../controllers/user.controller");
const { authenticate } = require("../middleware/auth.middleware");
const { authorizeMinLevel } = require("../middleware/role.middleware");
const { requirePermission } = require("../middleware/permission.middleware");
const { validate } = require("../middleware/validation.middleware");
const { createUserRules, updateUserRules } = require("../validators/user.validator");

router.use(authenticate);

router.get("/",        requirePermission("users.view"),   ctrl.list);
router.get("/:id",     requirePermission("users.view"),   ctrl.getOne);
router.post("/",       requirePermission("users.create"), createUserRules, validate, ctrl.create);
router.put("/:id",     requirePermission("users.update"), updateUserRules, validate, ctrl.update);
router.patch("/:id/status", requirePermission("users.block"), ctrl.setStatus);
router.delete("/:id",  authorizeMinLevel("SUPER_ADMIN"),  ctrl.remove);

module.exports = router;
