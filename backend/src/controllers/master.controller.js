const User = require("../models/User");
const walletService = require("../services/wallet.service");
const { success, error } = require("../utils/response");

// List all agents under this master (with pagination)
const myAgents = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (Math.max(1, page) - 1) * Math.min(100, limit);
    const filter = { parentId: req.user._id, role: "AGENT" };
    const [agents, total] = await Promise.all([
      User.find(filter).skip(skip).limit(Math.min(100, limit)).sort({ createdAt: -1 }),
      User.countDocuments(filter),
    ]);
    return success(res, { agents: agents.map((a) => a.toSafeObject()), total, page: Number(page), limit: Number(limit) }, "Agents retrieved");
  } catch (err) { next(err); }
};

// List all users under this master's agents (with pagination)
const myUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (Math.max(1, page) - 1) * Math.min(100, limit);
    const agentIds = await User.find({ parentId: req.user._id, role: "AGENT" }).distinct("_id");
    const filter = { parentId: { $in: agentIds }, role: "USER" };
    const [users, total] = await Promise.all([
      User.find(filter).skip(skip).limit(Math.min(100, limit)).sort({ createdAt: -1 }),
      User.countDocuments(filter),
    ]);
    return success(res, { users: users.map((u) => u.toSafeObject()), total, page: Number(page), limit: Number(limit) }, "Users retrieved");
  } catch (err) { next(err); }
};

// Master → Agent chip/credit transfer
const transferToAgent = async (req, res, next) => {
  try {
    const { agentId, amount } = req.body;
    const master = req.user;

    // Only MASTER role uses this endpoint (SUPER_ADMIN/ADMIN use generic /wallet/transfer)
    if (master.role !== "MASTER") return error(res, "Only MASTER can use this endpoint", 403);

    const agent = await User.findOne({ _id: agentId, parentId: master._id, role: "AGENT" });
    if (!agent) return error(res, "Agent not found in your hierarchy", 404);

    const result = await walletService.transfer(master._id, agentId, Number(amount), master._id);
    return success(res, result, "Transfer to agent successful");
  } catch (err) { next(err); }
};

module.exports = { myAgents, myUsers, transferToAgent };
