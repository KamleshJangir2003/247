const User = require("../models/User");
const Deposit = require("../models/Deposit");
const Withdrawal = require("../models/Withdrawal");
const WalletTransaction = require("../models/WalletTransaction");
const AuditLog = require("../models/AuditLog");
const Game = require("../models/Game");
const Provider = require("../models/Provider");
const gameService = require("../services/game.service");
const providerService = require("../services/gameProvider.service");
const { success, error } = require("../utils/response");

const paginate = (page, limit) => ({
  skip: (Math.max(1, page) - 1) * Math.min(100, limit),
  lim: Math.min(100, limit),
});

// ─── Dashboard ────────────────────────────────────────────────────────────────

const dashboard = async (req, res, next) => {
  try {
    const [totalUsers, pendingDeposits, pendingWithdrawals, recentAudit] = await Promise.all([
      User.countDocuments({ role: "USER" }),
      Deposit.countDocuments({ status: "PENDING" }),
      Withdrawal.countDocuments({ status: "PENDING" }),
      AuditLog.find().sort({ createdAt: -1 }).limit(10).populate("actor", "username role"),
    ]);
    return success(res, { totalUsers, pendingDeposits, pendingWithdrawals, recentAudit }, "Admin dashboard");
  } catch (err) { next(err); }
};

// ─── Audit Logs ───────────────────────────────────────────────────────────────

const auditLogs = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, action, actor } = req.query;
    const filter = {};
    if (action) filter.action = action;
    if (actor) filter.actor = actor;
    const { skip, lim } = paginate(page, limit);
    const [logs, total] = await Promise.all([
      AuditLog.find(filter).populate("actor", "username role").skip(skip).limit(lim).sort({ createdAt: -1 }),
      AuditLog.countDocuments(filter),
    ]);
    return success(res, { logs, total, page: Number(page), limit: Number(limit) }, "Audit logs retrieved");
  } catch (err) { next(err); }
};

// ─── User Management ──────────────────────────────────────────────────────────

const listUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, role, status, search } = req.query;
    const { skip, lim } = paginate(page, limit);
    const filter = {};
    if (role) filter.role = role.toUpperCase();
    if (status) filter.status = status.toLowerCase();
    if (search) filter.$or = [
      { username: new RegExp(search, "i") },
      { email: new RegExp(search, "i") },
      { firstName: new RegExp(search, "i") },
    ];
    const [users, total] = await Promise.all([
      User.find(filter).skip(skip).limit(lim).sort({ createdAt: -1 }),
      User.countDocuments(filter),
    ]);
    return success(res, { users: users.map(u => u.toSafeObject()), total, page: Number(page), limit: Number(limit) }, "Users retrieved");
  } catch (err) { next(err); }
};

const setUserStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const normalised = (status || "").toLowerCase();
    if (!["active", "blocked"].includes(normalised))
      return error(res, "status must be active or blocked", 400);
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status: normalised, isActive: normalised === "active" },
      { new: true }
    );
    if (!user) return error(res, "User not found", 404);
    await AuditLog.create({ actor: req.user._id, action: "USER_STATUS_CHANGE", target: "User", targetId: user._id, metadata: { status: normalised } });
    return success(res, { user: user.toSafeObject() }, "User status updated");
  } catch (err) { next(err); }
};

// ─── Games Management ─────────────────────────────────────────────────────────

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
    const { status } = req.body;
    if (!["active", "inactive"].includes(status))
      return error(res, "status must be active or inactive", 400);
    const game = await gameService.setGameStatus(req.user, req.params.id, status);
    return success(res, { game }, "Game status updated");
  } catch (err) { next(err); }
};

// ─── Providers Management ─────────────────────────────────────────────────────

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

// ─── Categories (stored as Game categories — virtual from Game model) ─────────
// We store categories as a simple collection in Provider model with type="category"
// For simplicity, categories are managed as a separate lightweight collection

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
  dashboard, auditLogs,
  listUsers, setUserStatus,
  listGames, createGame, updateGame, deleteGame, setGameStatus,
  listProviders, createProvider, updateProvider, deleteProvider,
  listCategories, createCategory, updateCategory, deleteCategory,
};
