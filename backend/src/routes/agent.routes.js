const router = require("express").Router();
const ctrl = require("../controllers/agent.controller");
const { authenticate } = require("../middleware/auth.middleware");
const { authorize } = require("../middleware/role.middleware");
const { validate } = require("../middleware/validation.middleware");
const { transferRules } = require("../validators/wallet.validator");

router.use(authenticate);
router.use(authorize("AGENT"));

router.get("/users",          ctrl.myUsers);
router.post("/transfer-user", transferRules, validate, ctrl.transferToUser);
router.get("/transactions",   ctrl.myTransactions);

module.exports = router;
