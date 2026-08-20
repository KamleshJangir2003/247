const router = require("express").Router();
const ctrl = require("../controllers/master.controller");
const { authenticate } = require("../middleware/auth.middleware");
const { authorize } = require("../middleware/role.middleware");
const { validate } = require("../middleware/validation.middleware");
const { transferRules } = require("../validators/wallet.validator");

router.use(authenticate);
router.use(authorize("MASTER"));

// Dashboard
router.get("/dashboard",        ctrl.dashboard);

// Admins
router.get("/admins",              ctrl.myAdmins);
router.post("/admins",             ctrl.createAdminUser);
router.patch("/admins/:id/status", ctrl.setAdminStatus);

// Agents
router.get("/agents",           ctrl.myAgents);
router.post("/agents",          ctrl.createAgent);
router.patch("/agents/:id/status", ctrl.setAgentStatus);

// Users (under master's agents)
router.get("/users",            ctrl.myUsers);

// Wallet / chips
router.post("/transfer-agent",  transferRules, validate, ctrl.transferToAgent);
router.post("/debit-agent",     transferRules, validate, ctrl.debitFromAgent);

// Financial views
router.get("/deposits",         ctrl.myDeposits);
router.get("/withdrawals",      ctrl.myWithdrawals);
router.get("/transactions",     ctrl.myTransactions);

// Commissions
router.get("/commissions",      ctrl.myCommissions);

// Summary report
router.get("/report",           ctrl.report);

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
