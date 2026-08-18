const router = require("express").Router();
const ctrl = require("../controllers/admin.controller");
const { authenticate } = require("../middleware/auth.middleware");
const { authorize } = require("../middleware/role.middleware");

router.use(authenticate);
router.use(authorize("SUPER_ADMIN", "ADMIN"));

router.get("/dashboard",  ctrl.dashboard);
router.get("/audit-logs", ctrl.auditLogs);

// User management (admin-level)
router.get("/users",              ctrl.listUsers);
router.patch("/users/:id/status", ctrl.setUserStatus);

// Games management
router.get("/games",              ctrl.listGames);
router.post("/games",             ctrl.createGame);
router.put("/games/:id",          ctrl.updateGame);
router.delete("/games/:id",       ctrl.deleteGame);
router.patch("/games/:id/status", ctrl.setGameStatus);

// Providers management
router.get("/providers",          ctrl.listProviders);
router.post("/providers",         ctrl.createProvider);
router.put("/providers/:id",      ctrl.updateProvider);
router.delete("/providers/:id",   ctrl.deleteProvider);

// Categories management
router.get("/categories",         ctrl.listCategories);
router.post("/categories",        ctrl.createCategory);
router.put("/categories/:id",     ctrl.updateCategory);
router.delete("/categories/:id",  ctrl.deleteCategory);

module.exports = router;
