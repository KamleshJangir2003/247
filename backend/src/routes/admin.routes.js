const router = require("express").Router();
const ctrl = require("../controllers/admin.controller");
const { authenticate } = require("../middleware/auth.middleware");
const { authorize } = require("../middleware/role.middleware");

router.use(authenticate);
router.use(authorize("SUPER_ADMIN", "ADMIN"));

router.get("/dashboard", ctrl.dashboard);
router.get("/audit-logs", ctrl.auditLogs);

module.exports = router;
