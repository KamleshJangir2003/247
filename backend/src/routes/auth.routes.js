const router = require("express").Router();
const ctrl = require("../controllers/auth.controller");
const { authenticate } = require("../middleware/auth.middleware");
const { validate } = require("../middleware/validation.middleware");
const { authLimiter } = require("../middleware/rateLimit.middleware");
const { registerRules, loginRules, changePasswordRules } = require("../validators/auth.validator");

router.post("/register", authLimiter, registerRules, validate, ctrl.register);
router.post("/login",    authLimiter, loginRules,    validate, ctrl.login);
router.post("/logout",   authenticate, ctrl.logout);
router.post("/refresh",  ctrl.refresh);
router.get("/me",        authenticate, ctrl.me);
router.post("/change-password", authenticate, changePasswordRules, validate, ctrl.changePassword);

module.exports = router;
