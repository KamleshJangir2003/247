const router = require("express").Router();
const ctrl = require("../controllers/bonus.controller");
const { authenticate } = require("../middleware/auth.middleware");
const { authorizeMinLevel } = require("../middleware/role.middleware");
const { body } = require("express-validator");
const { validate } = require("../middleware/validation.middleware");

const applyRules = [
  body("code").trim().notEmpty().withMessage("Bonus code required"),
  body("depositAmount").optional().isFloat({ min: 0 }).withMessage("depositAmount must be >= 0"),
];

router.get("/",    ctrl.list);
router.get("/:id", ctrl.getOne);

router.post("/",      authenticate, authorizeMinLevel("ADMIN"), ctrl.create);
router.put("/:id",    authenticate, authorizeMinLevel("ADMIN"), ctrl.update);
router.delete("/:id", authenticate, authorizeMinLevel("ADMIN"), ctrl.remove);

// Any authenticated user can apply a bonus
router.post("/apply", authenticate, applyRules, validate, ctrl.apply);

module.exports = router;
