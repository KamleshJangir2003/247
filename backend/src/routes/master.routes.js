const router = require("express").Router();
const ctrl = require("../controllers/master.controller");
const { authenticate } = require("../middleware/auth.middleware");
const { authorize } = require("../middleware/role.middleware");
const { validate } = require("../middleware/validation.middleware");
const { transferRules } = require("../validators/wallet.validator");

router.use(authenticate);
router.use(authorize("MASTER"));

router.get("/agents",          ctrl.myAgents);
router.get("/users",           ctrl.myUsers);
router.post("/transfer-agent", transferRules, validate, ctrl.transferToAgent);

module.exports = router;
