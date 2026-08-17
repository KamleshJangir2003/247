const User = require("../models/User");
const walletService = require("../services/wallet.service");
const txService = require("../services/transaction.service");
const { success, error } = require("../utils/response");

// List all users under this agent (with pagination)
const myUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (Math.max(1, page) - 1) * Math.min(100, limit);
    const filter = { parentId: req.user._id, role: "USER" };
    const [users, total] = await Promise.all([
      User.find(filter).skip(skip).limit(Math.min(100, limit)).sort({ createdAt: -1 }),
      User.countDocuments(filter),
    ]);
    return success(res, { users: users.map((u) => u.toSafeObject()), total, page: Number(page), limit: Number(limit) }, "Users retrieved");
  } catch (err) { next(err); }
};

// Agent → User chip/credit transfer
const transferToUser = async (req, res, next) => {
  try {
    const { userId, amount } = req.body;
    const agent = req.user;

    if (agent.role !== "AGENT") return error(res, "Only AGENT can use this endpoint", 403);

    const user = await User.findOne({ _id: userId, parentId: agent._id, role: "USER" });
    if (!user) return error(res, "User not found in your hierarchy", 404);

    const result = await walletService.transfer(agent._id, userId, Number(amount), agent._id);
    return success(res, result, "Transfer to user successful");
  } catch (err) { next(err); }
};

// Agent views transactions for themselves + all their users
const myTransactions = async (req, res, next) => {
  try {
    const result = await txService.listTransactions(req.user, req.query);
    return success(res, result, "Transactions retrieved");
  } catch (err) { next(err); }
};

module.exports = { myUsers, transferToUser, myTransactions };
