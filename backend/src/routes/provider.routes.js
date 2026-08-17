const router = require("express").Router();
const ctrl = require("../controllers/provider.controller");
const { authenticate } = require("../middleware/auth.middleware");
const { requirePermission } = require("../middleware/permission.middleware");

router.get("/",    ctrl.list);
router.get("/:id", ctrl.getOne);

router.post("/",      authenticate, requirePermission("games.create"), ctrl.create);
router.put("/:id",    authenticate, requirePermission("games.update"), ctrl.update);
router.delete("/:id", authenticate, requirePermission("games.delete"), ctrl.remove);

module.exports = router;
