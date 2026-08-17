const txService = require("../services/transaction.service");
const { success } = require("../utils/response");

const list = async (req, res, next) => {
  try {
    const result = await txService.listTransactions(req.user, req.query);
    return success(res, result, "Transactions retrieved");
  } catch (err) { next(err); }
};

const getOne = async (req, res, next) => {
  try {
    const transaction = await txService.getTransaction(req.user, req.params.id);
    return success(res, { transaction }, "Transaction retrieved");
  } catch (err) { next(err); }
};

module.exports = { list, getOne };
