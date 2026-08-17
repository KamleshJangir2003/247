const router = require("express").Router();
const ctrl = require("../controllers/withdrawal.controller");
const { authenticate } = require("../middleware/auth.middleware");
const { requirePermission } = require("../middleware/permission.middleware");
const { validate } = require("../middleware/validation.middleware");
const { withdrawalRules } = require("../validators/wallet.validator");

router.use(authenticate);

router.post("/",                withdrawalRules, validate, ctrl.create);
router.get("/",                 requirePermission("withdrawals.view"), ctrl.list);
router.get("/:id",              ctrl.getOne);
router.post("/:id/approve",     requirePermission("withdrawals.approve"), ctrl.approve);
router.post("/:id/reject",      requirePermission("withdrawals.reject"),  ctrl.reject);
router.post("/:id/complete",    requirePermission("withdrawals.approve"), ctrl.complete);
router.post("/:id/fail",        requirePermission("withdrawals.approve"), ctrl.fail);

module.exports = router;
