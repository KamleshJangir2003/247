const withdrawalService = require("../services/withdrawal.service");
const { success } = require("../utils/response");

const create = async (req, res, next) => {
  try {
    const withdrawal = await withdrawalService.createWithdrawal(req.user._id, req.body.amount, req.body.bankDetails || {});
    return success(res, { withdrawal }, "Withdrawal request created", 201);
  } catch (err) { next(err); }
};

const list = async (req, res, next) => {
  try {
    const result = await withdrawalService.listWithdrawals(req.user, req.query);
    return success(res, result, "Withdrawals retrieved");
  } catch (err) { next(err); }
};

const getOne = async (req, res, next) => {
  try {
    const withdrawal = await withdrawalService.getWithdrawal(req.user, req.params.id);
    return success(res, { withdrawal }, "Withdrawal retrieved");
  } catch (err) { next(err); }
};

const approve = async (req, res, next) => {
  try {
    const withdrawal = await withdrawalService.approveWithdrawal(req.user, req.params.id);
    return success(res, { withdrawal }, "Withdrawal approved");
  } catch (err) { next(err); }
};

const reject = async (req, res, next) => {
  try {
    const withdrawal = await withdrawalService.rejectWithdrawal(req.user, req.params.id, req.body.reason || "");
    return success(res, { withdrawal }, "Withdrawal rejected");
  } catch (err) { next(err); }
};

// Mark as COMPLETED after actual payout is confirmed
const complete = async (req, res, next) => {
  try {
    const withdrawal = await withdrawalService.completeWithdrawal(req.user, req.params.id, req.body.payoutReference || "");
    return success(res, { withdrawal }, "Withdrawal marked as completed");
  } catch (err) { next(err); }
};

// Mark as FAILED and refund the reserved amount
const fail = async (req, res, next) => {
  try {
    const withdrawal = await withdrawalService.failWithdrawal(req.user, req.params.id, req.body.reason || "");
    return success(res, { withdrawal }, "Withdrawal marked as failed and refunded");
  } catch (err) { next(err); }
};

module.exports = { create, list, getOne, approve, reject, complete, fail };
