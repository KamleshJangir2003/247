const router = require("express").Router();
const ctrl = require("../controllers/report.controller");
const { authenticate } = require("../middleware/auth.middleware");
const { requirePermission } = require("../middleware/permission.middleware");

router.use(authenticate);
router.use(requirePermission("reports.view"));

router.get("/users",        ctrl.users);
router.get("/deposits",     ctrl.deposits);
router.get("/withdrawals",  ctrl.withdrawals);
router.get("/transactions", ctrl.transactions);
router.get("/games",        ctrl.games);
router.get("/commission",   ctrl.commission);

module.exports = router;
