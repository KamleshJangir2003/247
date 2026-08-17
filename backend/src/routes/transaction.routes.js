const router = require("express").Router();
const ctrl = require("../controllers/transaction.controller");
const { authenticate } = require("../middleware/auth.middleware");
const { requirePermission } = require("../middleware/permission.middleware");

router.use(authenticate);

router.get("/",    requirePermission("transactions.view"), ctrl.list);
router.get("/:id", requirePermission("transactions.view"), ctrl.getOne);

module.exports = router;
