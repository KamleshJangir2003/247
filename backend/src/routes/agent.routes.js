const router = require("express").Router();
const ctrl = require("../controllers/agent.controller");
const { authenticate } = require("../middleware/auth.middleware");
const { authorize } = require("../middleware/role.middleware");
const { validate } = require("../middleware/validation.middleware");
const { transferRules } = require("../validators/wallet.validator");

router.use(authenticate);
router.use(authorize("AGENT"));

// Dashboard
router.get("/dashboard",           ctrl.dashboard);

// Users
router.get("/users",               ctrl.myUsers);
router.patch("/users/:id/status",  ctrl.setUserStatus);

// Wallet / chips
router.post("/transfer-user",      transferRules, validate, ctrl.transferToUser);
router.post("/debit-user",         transferRules, validate, ctrl.debitFromUser);

// Financial views
router.get("/deposits",            ctrl.myDeposits);
router.get("/withdrawals",         ctrl.myWithdrawals);
router.get("/transactions",        ctrl.myTransactions);

// Commissions
router.get("/commissions",         ctrl.myCommissions);

// Create user under agent
router.post("/users",              ctrl.createUser);

// Summary report
router.get("/report",              ctrl.report);

module.exports = router;
