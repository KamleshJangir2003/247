const router = require("express").Router();
const ctrl = require("../controllers/wallet.controller");
const { authenticate } = require("../middleware/auth.middleware");
const { authorizeMinLevel } = require("../middleware/role.middleware");
const { validate } = require("../middleware/validation.middleware");
const { transferRules } = require("../validators/wallet.validator");

router.use(authenticate);

router.get("/balance",          ctrl.getBalance);
router.get("/balance/:userId",  authorizeMinLevel("AGENT"), ctrl.getBalance);
router.post("/transfer",        authorizeMinLevel("AGENT"), transferRules, validate, ctrl.transfer);

module.exports = router;
