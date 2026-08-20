const User = require("../models/User");
const Wallet = require("../models/Wallet");
const Deposit = require("../models/Deposit");
const Withdrawal = require("../models/Withdrawal");
const WalletTransaction = require("../models/WalletTransaction");
const AuditLog = require("../models/AuditLog");
const walletService = require("../services/wallet.service");
const commissionService = require("../services/commission.service");
const gameService = require("../services/game.service");
const providerService = require("../services/gameProvider.service");
const { success, error } = require("../utils/response");

const Category = (() => {
  const mongoose = require("mongoose");
  if (mongoose.models.Category) return mongoose.models.Category;
  const schema = new mongoose.Schema({
    name: { type: String, required: true, unique: true, trim: true },
    icon: { type: String, default: "" },
    sortOrder: { type: Number, default: 0 },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
  }, { timestamps: true });
  return mongoose.model("Category", schema);
})();

// ─── Helpers ─────────────────────────────────────────────────────────────────

const getAgentIds = (masterId) =>
  User.find({ parentId: masterId, role: "AGENT" }).distinct("_id");

const paginate = (page, limit) => ({
  skip: (Math.max(1, page) - 1) * Math.min(100, limit),
  lim: Math.min(100, limit),
});

// ─── Dashboard ────────────────────────────────────────────────────────────────

const dashboard = async (req, res, next) => {
  try {
    const masterId = req.user._id;
    const agentIds = await getAgentIds(masterId);
    const userFilter = { parentId: { $in: agentIds }, role: "USER" };

    const [
      totalAgents,
      totalUsers,
      pendingDeposits,
      pendingWithdrawals,
      recentAudit,
      masterWallet,
    ] = await Promise.all([
      User.countDocuments({ parentId: masterId, role: "AGENT" }),
      User.countDocuments(userFilter),
      Deposit.countDocuments({ userId: { $in: await User.find(userFilter).distinct("_id") }, status: "PENDING" }),
      Withdrawal.countDocuments({ userId: { $in: await User.find(userFilter).distinct("_id") }, status: "PENDING" }),
      AuditLog.find({}).sort({ createdAt: -1 }).limit(8).populate("actor", "username role"),
      Wallet.findOne({ userId: masterId }),
    ]);

    return success(res, {
      totalAgents,
      totalUsers,
      pendingDeposits,
      pendingWithdrawals,
      balance: masterWallet?.balance ?? 0,
      recentAudit,
    }, "Master dashboard");
  } catch (err) { next(err); }
};

// ─── Agents ───────────────────────────────────────────────────────────────────

const myAgents = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const { skip, lim } = paginate(page, limit);
    const filter = { parentId: req.user._id, role: "AGENT" };
    const [agents, total] = await Promise.all([
      User.find(filter).skip(skip).limit(lim).sort({ createdAt: -1 }),
      User.countDocuments(filter),
    ]);
    return success(res, { agents: agents.map((a) => a.toSafeObject()), total, page: Number(page), limit: Number(limit) }, "Agents retrieved");
  } catch (err) { next(err); }
};

const createAgent = async (req, res, next) => {
  try {
    const { firstName, lastName, username, email, phone, password } = req.body;
    if (!firstName || !username || !email || !password)
      return error(res, "firstName, username, email and password are required", 400);

    const exists = await User.findOne({ $or: [{ username }, { email }] });
    if (exists) return error(res, "Username or email already taken", 409);

    const { hash } = require("../utils/password");
    const passwordHash = await hash(password);
    const agent = await User.create({
      firstName, lastName: lastName || "", username, email, phone: phone || "",
      passwordHash, role: "AGENT", parentId: req.user._id,
    });
    await Wallet.create({ userId: agent._id });
    await AuditLog.create({ actor: req.user._id, action: "AGENT_CREATE", target: "User", targetId: agent._id });
    return success(res, { agent: agent.toSafeObject() }, "Agent created", 201);
  } catch (err) { next(err); }
};

const setAgentStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!["active", "blocked"].includes(status))
      return error(res, "status must be active or blocked", 400);

    const agent = await User.findOneAndUpdate(
      { _id: req.params.id, parentId: req.user._id, role: "AGENT" },
      { status, isActive: status === "active" },
      { new: true }
    );
    if (!agent) return error(res, "Agent not found in your hierarchy", 404);
    await AuditLog.create({ actor: req.user._id, action: "AGENT_STATUS_CHANGE", target: "User", targetId: agent._id, metadata: { status } });
    return success(res, { agent: agent.toSafeObject() }, "Agent status updated");
  } catch (err) { next(err); }
};

// ─── Users ────────────────────────────────────────────────────────────────────

const myUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const { skip, lim } = paginate(page, limit);
    const agentIds = await getAgentIds(req.user._id);
    const filter = { parentId: { $in: agentIds }, role: "USER" };
    const [users, total] = await Promise.all([
      User.find(filter).skip(skip).limit(lim).sort({ createdAt: -1 }),
      User.countDocuments(filter),
    ]);
    return success(res, { users: users.map((u) => u.toSafeObject()), total, page: Number(page), limit: Number(limit) }, "Users retrieved");
  } catch (err) { next(err); }
};

// ─── Wallet / Chips ───────────────────────────────────────────────────────────

const transferToAgent = async (req, res, next) => {
  try {
    const { agentId, amount } = req.body;
    const agent = await User.findOne({ _id: agentId, parentId: req.user._id, role: "AGENT" });
    if (!agent) return error(res, "Agent not found in your hierarchy", 404);
    const result = await walletService.transfer(req.user._id, agentId, Number(amount), req.user._id);
    await AuditLog.create({ actor: req.user._id, action: "CHIPS_TRANSFER", target: "User", targetId: agentId, metadata: { amount } });
    return success(res, result, "Transfer to agent successful");
  } catch (err) { next(err); }
};

const debitFromAgent = async (req, res, next) => {
  try {
    const { agentId, amount } = req.body;
    const agent = await User.findOne({ _id: agentId, parentId: req.user._id, role: "AGENT" });
    if (!agent) return error(res, "Agent not found in your hierarchy", 404);
    // Reverse: agent → master
    const result = await walletService.transfer(agentId, req.user._id, Number(amount), req.user._id);
    await AuditLog.create({ actor: req.user._id, action: "CHIPS_DEBIT", target: "User", targetId: agentId, metadata: { amount } });
    return success(res, result, "Debit from agent successful");
  } catch (err) { next(err); }
};

// ─── Deposits ─────────────────────────────────────────────────────────────────

const myDeposits = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const { skip, lim } = paginate(page, limit);
    const agentIds = await getAgentIds(req.user._id);
    const userIds = await User.find({ parentId: { $in: agentIds }, role: "USER" }).distinct("_id");
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
    const agentIds = await getAgentIds(req.user._id);
    const userIds = await User.find({ parentId: { $in: agentIds }, role: "USER" }).distinct("_id");
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
    const { page = 1, limit = 20, type } = req.query;
    const { skip, lim } = paginate(page, limit);
    const agentIds = await getAgentIds(req.user._id);
    const userIds = await User.find({ parentId: { $in: agentIds }, role: "USER" }).distinct("_id");
    // Include master's own transactions + all agents + all users
    const allIds = [req.user._id, ...agentIds, ...userIds];
    const filter = { userId: { $in: allIds } };
    if (type) filter.type = type.toUpperCase();
    const [transactions, total] = await Promise.all([
      WalletTransaction.find(filter).populate("userId", "username email").skip(skip).limit(lim).sort({ createdAt: -1 }),
      WalletTransaction.countDocuments(filter),
    ]);
    return success(res, { transactions, total, page: Number(page), limit: Number(limit) }, "Transactions retrieved");
  } catch (err) { next(err); }
};

// ─── Commissions ──────────────────────────────────────────────────────────────

const myCommissions = async (req, res, next) => {
  try {
    const result = await commissionService.listCommissions(req.user, req.query);
    return success(res, result, "Commissions retrieved");
  } catch (err) { next(err); }
};

// ─── Reports ──────────────────────────────────────────────────────────────────

const report = async (req, res, next) => {
  try {
    const agentIds = await getAgentIds(req.user._id);
    const userIds = await User.find({ parentId: { $in: agentIds }, role: "USER" }).distinct("_id");

    const [
      totalDeposits,
      totalWithdrawals,
      totalTx,
      depositSum,
      withdrawalSum,
    ] = await Promise.all([
      Deposit.countDocuments({ userId: { $in: userIds } }),
      Withdrawal.countDocuments({ userId: { $in: userIds } }),
      WalletTransaction.countDocuments({ userId: { $in: [...agentIds, ...userIds] } }),
      Deposit.aggregate([{ $match: { userId: { $in: userIds }, status: "APPROVED" } }, { $group: { _id: null, total: { $sum: "$amount" } } }]),
      Withdrawal.aggregate([{ $match: { userId: { $in: userIds }, status: { $in: ["APPROVED", "COMPLETED"] } } }, { $group: { _id: null, total: { $sum: "$amount" } } }]),
    ]);

    return success(res, {
      totalAgents: agentIds.length,
      totalUsers: userIds.length,
      totalDeposits,
      totalWithdrawals,
      totalTransactions: totalTx,
      totalDepositAmount: depositSum[0]?.total ?? 0,
      totalWithdrawalAmount: withdrawalSum[0]?.total ?? 0,
    }, "Master report");
  } catch (err) { next(err); }
};

// ─── Admins ───────────────────────────────────────────────────────────────────

const myAdmins = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const { skip, lim } = paginate(page, limit);
    const filter = { role: "ADMIN" };
    const [admins, total] = await Promise.all([
      User.find(filter).skip(skip).limit(lim).sort({ createdAt: -1 }),
      User.countDocuments(filter),
    ]);
    return success(res, { users: admins.map((a) => a.toSafeObject()), total, page: Number(page), limit: Number(limit) }, "Admins retrieved");
  } catch (err) { next(err); }
};

const createAdminUser = async (req, res, next) => {
  try {
    const { firstName, lastName, username, email, phone, password } = req.body;
    if (!firstName || !username || !email || !password)
      return error(res, "firstName, username, email and password are required", 400);
    const exists = await User.findOne({ $or: [{ username }, { email }] });
    if (exists) return error(res, "Username or email already taken", 409);
    const { hash } = require("../utils/password");
    const passwordHash = await hash(password);
    const admin = await User.create({
      firstName, lastName: lastName || "", username, email, phone: phone || "",
      passwordHash, role: "ADMIN",
    });
    await Wallet.create({ userId: admin._id });
    await AuditLog.create({ actor: req.user._id, action: "ADMIN_CREATE", target: "User", targetId: admin._id });
    return success(res, { user: admin.toSafeObject() }, "Admin created", 201);
  } catch (err) { next(err); }
};

const setAdminStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!["active", "blocked"].includes(status))
      return error(res, "status must be active or blocked", 400);
    const admin = await User.findOneAndUpdate(
      { _id: req.params.id, role: "ADMIN" },
      { status, isActive: status === "active" },
      { new: true }
    );
    if (!admin) return error(res, "Admin not found", 404);
    await AuditLog.create({ actor: req.user._id, action: "ADMIN_STATUS_CHANGE", target: "User", targetId: admin._id, metadata: { status } });
    return success(res, { user: admin.toSafeObject() }, "Admin status updated");
  } catch (err) { next(err); }
};

// ─── Games ────────────────────────────────────────────────────────────────────

const listGames = async (req, res, next) => {
  try {
    const result = await gameService.listGames(req.query);
    return success(res, result, "Games retrieved");
  } catch (err) { next(err); }
};

const createGame = async (req, res, next) => {
  try {
    const game = await gameService.createGame(req.user, req.body);
    return success(res, { game }, "Game created", 201);
  } catch (err) { next(err); }
};

const updateGame = async (req, res, next) => {
  try {
    const game = await gameService.updateGame(req.user, req.params.id, req.body);
    return success(res, { game }, "Game updated");
  } catch (err) { next(err); }
};

const deleteGame = async (req, res, next) => {
  try {
    await gameService.deleteGame(req.user, req.params.id);
    return success(res, {}, "Game deleted");
  } catch (err) { next(err); }
};

const setGameStatus = async (req, res, next) => {
  try {
    const game = await gameService.setGameStatus(req.user, req.params.id, req.body.status);
    return success(res, { game }, "Game status updated");
  } catch (err) { next(err); }
};

// ─── Providers ────────────────────────────────────────────────────────────────

const listProviders = async (req, res, next) => {
  try {
    const result = await providerService.listProviders(req.query);
    return success(res, result, "Providers retrieved");
  } catch (err) { next(err); }
};

const createProvider = async (req, res, next) => {
  try {
    const provider = await providerService.createProvider(req.user, req.body);
    return success(res, { provider }, "Provider created", 201);
  } catch (err) { next(err); }
};

const updateProvider = async (req, res, next) => {
  try {
    const provider = await providerService.updateProvider(req.user, req.params.id, req.body);
    return success(res, { provider }, "Provider updated");
  } catch (err) { next(err); }
};

const deleteProvider = async (req, res, next) => {
  try {
    await providerService.deleteProvider(req.user, req.params.id);
    return success(res, {}, "Provider deleted");
  } catch (err) { next(err); }
};

// ─── Categories ───────────────────────────────────────────────────────────────

const listCategories = async (req, res, next) => {
  try {
    const cats = await Category.find().sort({ sortOrder: 1, name: 1 });
    return success(res, { categories: cats, total: cats.length }, "Categories retrieved");
  } catch (err) { next(err); }
};

const createCategory = async (req, res, next) => {
  try {
    const { name, icon, sortOrder } = req.body;
    if (!name) return error(res, "name is required", 400);
    const cat = await Category.create({ name, icon: icon || "", sortOrder: sortOrder || 0 });
    await AuditLog.create({ actor: req.user._id, action: "CATEGORY_CREATE", target: "Category", targetId: cat._id });
    return success(res, { category: cat }, "Category created", 201);
  } catch (err) {
    if (err.code === 11000) return error(res, "Category name already exists", 409);
    next(err);
  }
};

const updateCategory = async (req, res, next) => {
  try {
    const cat = await Category.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
    if (!cat) return error(res, "Category not found", 404);
    await AuditLog.create({ actor: req.user._id, action: "CATEGORY_UPDATE", target: "Category", targetId: cat._id });
    return success(res, { category: cat }, "Category updated");
  } catch (err) { next(err); }
};

const deleteCategory = async (req, res, next) => {
  try {
    const cat = await Category.findByIdAndDelete(req.params.id);
    if (!cat) return error(res, "Category not found", 404);
    await AuditLog.create({ actor: req.user._id, action: "CATEGORY_DELETE", target: "Category", targetId: req.params.id });
    return success(res, {}, "Category deleted");
  } catch (err) { next(err); }
};

module.exports = {
  dashboard,
  myAdmins, createAdminUser, setAdminStatus,
  myAgents, createAgent, setAgentStatus,
  myUsers,
  transferToAgent, debitFromAgent,
  myDeposits, myWithdrawals, myTransactions,
  myCommissions,
  report,
  listGames, createGame, updateGame, deleteGame, setGameStatus,
  listProviders, createProvider, updateProvider, deleteProvider,
  listCategories, createCategory, updateCategory, deleteCategory,
};
