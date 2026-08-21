const router = require("express").Router();
const ctrl = require("../controllers/master.controller");
const { authenticate } = require("../middleware/auth.middleware");
const { authorize } = require("../middleware/role.middleware");
const { validate } = require("../middleware/validation.middleware");
const { transferRules } = require("../validators/wallet.validator");

router.use(authenticate);
router.use(authorize("MASTER"));

// Dashboard
router.get("/dashboard", ctrl.dashboard);

// Agents — MASTER can only manage agents
router.get("/agents",              ctrl.myAgents);
router.post("/agents",             ctrl.createAgent);
router.patch("/agents/:id/status", ctrl.setAgentStatus);

// Users — read-only view of subtree users (via agents)
router.get("/users", ctrl.myUsers);

// Wallet / chips — MASTER ↔ AGENT only
router.post("/transfer-agent", transferRules, validate, ctrl.transferToAgent);
router.post("/debit-agent",    transferRules, validate, ctrl.debitFromAgent);

// Financial views
router.get("/deposits",     ctrl.myDeposits);
router.get("/withdrawals",  ctrl.myWithdrawals);
router.get("/transactions", ctrl.myTransactions);

// Commissions
router.get("/commissions", ctrl.myCommissions);

// Summary report
router.get("/report", ctrl.report);

module.exports = router;
