const depositService = require("../services/deposit.service");
const { success } = require("../utils/response");

const create = async (req, res, next) => {
  try {
    const deposit = await depositService.createDeposit(
      req.user._id,
      req.body.amount,
      req.body.metadata || {},
      req.body.idempotencyKey || null
    );
    return success(res, { deposit }, "Deposit request created", 201);
  } catch (err) { next(err); }
};

const list = async (req, res, next) => {
  try {
    const result = await depositService.listDeposits(req.user, req.query);
    return success(res, result, "Deposits retrieved");
  } catch (err) { next(err); }
};

const getOne = async (req, res, next) => {
  try {
    const deposit = await depositService.getDeposit(req.user, req.params.id);
    return success(res, { deposit }, "Deposit retrieved");
  } catch (err) { next(err); }
};

const approve = async (req, res, next) => {
  try {
    const deposit = await depositService.approveDeposit(req.user, req.params.id);
    return success(res, { deposit }, "Deposit approved");
  } catch (err) { next(err); }
};

const reject = async (req, res, next) => {
  try {
    const deposit = await depositService.rejectDeposit(req.user, req.params.id, req.body.reason || "");
    return success(res, { deposit }, "Deposit rejected");
  } catch (err) { next(err); }
};

module.exports = { create, list, getOne, approve, reject };
