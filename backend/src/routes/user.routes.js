const router = require("express").Router();
const ctrl = require("../controllers/user.controller");
const { authenticate } = require("../middleware/auth.middleware");
const { authorizeMinLevel } = require("../middleware/role.middleware");
const { validate } = require("../middleware/validation.middleware");
const { createUserRules, updateUserRules } = require("../validators/user.validator");

router.use(authenticate);
router.use(authorizeMinLevel("AGENT"));

router.get("/",        ctrl.list);
router.get("/:id",     ctrl.getOne);
router.post("/",       createUserRules, validate, ctrl.create);
router.put("/:id",     updateUserRules, validate, ctrl.update);
router.patch("/:id/status", ctrl.setStatus);
router.delete("/:id",  authorizeMinLevel("SUPER_ADMIN"), ctrl.remove);

module.exports = router;
