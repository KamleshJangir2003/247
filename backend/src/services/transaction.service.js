const WalletTransaction = require("../models/WalletTransaction");
const User = require("../models/User");

const listTransactions = async (actor, query) => {
  const { page = 1, limit = 20, userId, type, status, dateFrom, dateTo, reference } = query;
  const filter = {};

  if (actor.role === "USER") {
    // Users see only their own transactions
    filter.userId = actor._id;
  } else if (actor.role === "AGENT") {
    // Agents see their own + all their users' transactions
    const userIds = await User.find({ parentId: actor._id, role: "USER" }).distinct("_id");
    filter.userId = { $in: [actor._id, ...userIds] };
  } else if (userId) {
    filter.userId = userId;
  }

  if (type) filter.type = type;
  if (status) filter.status = status;
  if (reference) filter.reference = reference;
  if (dateFrom || dateTo) {
    filter.createdAt = {};
    if (dateFrom) filter.createdAt.$gte = new Date(dateFrom);
    if (dateTo) filter.createdAt.$lte = new Date(dateTo);
  }

  const skip = (Math.max(1, page) - 1) * Math.min(100, limit);
  const [transactions, total] = await Promise.all([
    WalletTransaction.find(filter).populate("userId", "username email").skip(skip).limit(Math.min(100, limit)).sort({ createdAt: -1 }),
    WalletTransaction.countDocuments(filter),
  ]);
  return { transactions, total, page: Number(page), limit: Number(limit) };
};

const getTransaction = async (actor, id) => {
  const filter = { _id: id };
  if (actor.role === "USER") filter.userId = actor._id;
  const tx = await WalletTransaction.findOne(filter).populate("userId", "username email");
  if (!tx) throw Object.assign(new Error("Transaction not found"), { statusCode: 404 });
  return tx;
};

module.exports = { listTransactions, getTransaction };
