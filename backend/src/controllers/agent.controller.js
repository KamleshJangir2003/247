const User = require("../models/User");
const Wallet = require("../models/Wallet");
const Deposit = require("../models/Deposit");
const Withdrawal = require("../models/Withdrawal");
const WalletTransaction = require("../models/WalletTransaction");
const AuditLog = require("../models/AuditLog");
const walletService = require("../services/wallet.service");
const txService = require("../services/transaction.service");
const commissionService = require("../services/commission.service");
const { success, error } = require("../utils/response");
const { hash } = require("../utils/password");

const paginate = (page, limit) => ({
  skip: (Math.max(1, page) - 1) * Math.min(100, limit),
  lim: Math.min(100, limit),
});

// ─── Dashboard ────────────────────────────────────────────────────────────────

const dashboard = async (req, res, next) => {
  try {
    const agentId = req.user._id;
    const userFilter = { parentId: agentId, role: "USER" };
    const userIds = await User.find(userFilter).distinct("_id");

    const [
      totalUsers,
      activeUsers,
      pendingDeposits,
      pendingWithdrawals,
      agentWallet,
    ] = await Promise.all([
      User.countDocuments(userFilter),
      User.countDocuments({ ...userFilter, status: "active" }),
      Deposit.countDocuments({ userId: { $in: userIds }, status: "PENDING" }),
      Withdrawal.countDocuments({ userId: { $in: userIds }, status: "PENDING" }),
      Wallet.findOne({ userId: agentId }),
    ]);

    return success(res, {
      totalUsers,
      activeUsers,
      blockedUsers: totalUsers - activeUsers,
      pendingDeposits,
      pendingWithdrawals,
      balance: agentWallet?.balance ?? 0,
    }, "Agent dashboard");
  } catch (err) { next(err); }
};

// ─── Users ────────────────────────────────────────────────────────────────────

const myUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const { skip, lim } = paginate(page, limit);
    const filter = { parentId: req.user._id, role: "USER" };
    const [users, total] = await Promise.all([
      User.find(filter).skip(skip).limit(lim).sort({ createdAt: -1 }),
      User.countDocuments(filter),
    ]);
    return success(res, { users: users.map((u) => u.toSafeObject()), total, page: Number(page), limit: Number(limit) }, "Users retrieved");
  } catch (err) { next(err); }
};

const setUserStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!["active", "blocked"].includes(status))
      return error(res, "status must be active or blocked", 400);

    const user = await User.findOneAndUpdate(
      { _id: req.params.id, parentId: req.user._id, role: "USER" },
      { status, isActive: status === "active" },
      { new: true }
    );
    if (!user) return error(res, "User not found in your hierarchy", 404);
    await AuditLog.create({ actor: req.user._id, action: "USER_STATUS_CHANGE", target: "User", targetId: user._id, metadata: { status } });
    return success(res, { user: user.toSafeObject() }, "User status updated");
  } catch (err) { next(err); }
};

// ─── Wallet / Chips ───────────────────────────────────────────────────────────

const transferToUser = async (req, res, next) => {
  try {
    const { userId, amount } = req.body;
    const user = await User.findOne({ _id: userId, parentId: req.user._id, role: "USER" });
    if (!user) return error(res, "User not found in your hierarchy", 404);
    const result = await walletService.transfer(req.user._id, userId, Number(amount), req.user._id);
    await AuditLog.create({ actor: req.user._id, action: "CHIPS_TRANSFER", target: "User", targetId: userId, metadata: { amount } });
    return success(res, result, "Transfer to user successful");
  } catch (err) { next(err); }
};

const debitFromUser = async (req, res, next) => {
  try {
    const { userId, amount } = req.body;
    const user = await User.findOne({ _id: userId, parentId: req.user._id, role: "USER" });
    if (!user) return error(res, "User not found in your hierarchy", 404);
    // Reverse: user → agent
    const result = await walletService.transfer(userId, req.user._id, Number(amount), req.user._id);
    await AuditLog.create({ actor: req.user._id, action: "CHIPS_DEBIT", target: "User", targetId: userId, metadata: { amount } });
    return success(res, result, "Debit from user successful");
  } catch (err) { next(err); }
};

// ─── Deposits ─────────────────────────────────────────────────────────────────

const myDeposits = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const { skip, lim } = paginate(page, limit);
    const userIds = await User.find({ parentId: req.user._id, role: "USER" }).distinct("_id");
    const filter = { userId: { $in: userIds } };
    if (status) filter.status = status.toUpperCase();
    const [deposits, total] = await Promise.all([
      Deposit.find(filter).populate("userId", "username email").skip(skip).limit(lim).sort({ createdAt: -1 }),
      Deposit.countDocuments(filter),
    ]);
    return success(res, { deposits, total, page: Number(page), limit: Number(limit) }, "Deposits retrieved");
  } catch (err) { next(err); }
};

// ─── Withdrawals ──────────────────────────────────────────────────────────────

const myWithdrawals = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const { skip, lim } = paginate(page, limit);
    const userIds = await User.find({ parentId: req.user._id, role: "USER" }).distinct("_id");
    const filter = { userId: { $in: userIds } };
    if (status) filter.status = status.toUpperCase();
    const [withdrawals, total] = await Promise.all([
      Withdrawal.find(filter).populate("userId", "username email").skip(skip).limit(lim).sort({ createdAt: -1 }),
      Withdrawal.countDocuments(filter),
    ]);
    return success(res, { withdrawals, total, page: Number(page), limit: Number(limit) }, "Withdrawals retrieved");
  } catch (err) { next(err); }
};

// ─── Transactions ─────────────────────────────────────────────────────────────

const myTransactions = async (req, res, next) => {
  try {
    const result = await txService.listTransactions(req.user, req.query);
    return success(res, result, "Transactions retrieved");
  } catch (err) { next(err); }
};

// ─── Commissions ──────────────────────────────────────────────────────────────

const myCommissions = async (req, res, next) => {
  try {
    const result = await commissionService.listCommissions(req.user, req.query);
    return success(res, result, "Commissions retrieved");
  } catch (err) { next(err); }
};

// ─── Create User ─────────────────────────────────────────────────────────────

const createUser = async (req, res, next) => {
  try {
    const { firstName, lastName, username, email, phone, password } = req.body;
    if (!firstName || !username || !email || !password)
      return error(res, "firstName, username, email and password are required", 400);

    const exists = await User.findOne({ $or: [{ username }, { email }] });
    if (exists) return error(res, "Username or email already taken", 409);

    const passwordHash = await hash(password);
    const user = await User.create({
      firstName, lastName: lastName || "", username, email, phone: phone || "",
      passwordHash, role: "USER", parentId: req.user._id,
    });
    await Wallet.create({ userId: user._id });
    await AuditLog.create({ actor: req.user._id, action: "USER_CREATE", target: "User", targetId: user._id });
    return success(res, { user: user.toSafeObject() }, "User created", 201);
  } catch (err) { next(err); }
};

// ─── Report ───────────────────────────────────────────────────────────────────

const report = async (req, res, next) => {
  try {
    const agentId = req.user._id;
    const userIds = await User.find({ parentId: agentId, role: "USER" }).distinct("_id");

    const [
      totalDeposits,
      totalWithdrawals,
      totalTx,
      depositSum,
      withdrawalSum,
    ] = await Promise.all([
      Deposit.countDocuments({ userId: { $in: userIds } }),
      Withdrawal.countDocuments({ userId: { $in: userIds } }),
      WalletTransaction.countDocuments({ userId: { $in: [agentId, ...userIds] } }),
      Deposit.aggregate([{ $match: { userId: { $in: userIds }, status: "APPROVED" } }, { $group: { _id: null, total: { $sum: "$amount" } } }]),
      Withdrawal.aggregate([{ $match: { userId: { $in: userIds }, status: { $in: ["APPROVED", "COMPLETED"] } } }, { $group: { _id: null, total: { $sum: "$amount" } } }]),
    ]);

    return success(res, {
      totalUsers: userIds.length,
      totalDeposits,
      totalWithdrawals,
      totalTransactions: totalTx,
      totalDepositAmount: depositSum[0]?.total ?? 0,
      totalWithdrawalAmount: withdrawalSum[0]?.total ?? 0,
    }, "Agent report");
  } catch (err) { next(err); }
};

module.exports = {
  dashboard,
  myUsers, setUserStatus, createUser,
  transferToUser, debitFromUser,
  myDeposits, myWithdrawals, myTransactions,
  myCommissions,
  report,
};
