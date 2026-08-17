const router = require("express").Router();
const ctrl = require("../controllers/deposit.controller");
const { authenticate } = require("../middleware/auth.middleware");
const { requirePermission } = require("../middleware/permission.middleware");
const { authorize } = require("../middleware/role.middleware");
const { validate } = require("../middleware/validation.middleware");
const { depositRules } = require("../validators/wallet.validator");

router.use(authenticate);

router.post("/",            depositRules, validate, ctrl.create);
// USER sees own deposits; staff with deposits.view see all
router.get("/",             ctrl.list);
router.get("/:id",          ctrl.getOne);
router.post("/:id/approve", requirePermission("deposits.approve"), ctrl.approve);
router.post("/:id/reject",  requirePermission("deposits.reject"),  ctrl.reject);

module.exports = router;
