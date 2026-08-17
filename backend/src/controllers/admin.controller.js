const User = require("../models/User");
const Deposit = require("../models/Deposit");
const Withdrawal = require("../models/Withdrawal");
const WalletTransaction = require("../models/WalletTransaction");
const AuditLog = require("../models/AuditLog");
const { success } = require("../utils/response");

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

const auditLogs = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, action, actor } = req.query;
    const filter = {};
    if (action) filter.action = action;
    if (actor) filter.actor = actor;
    const skip = (Math.max(1, page) - 1) * Math.min(100, limit);
    const [logs, total] = await Promise.all([
      AuditLog.find(filter).populate("actor", "username role").skip(skip).limit(Math.min(100, limit)).sort({ createdAt: -1 }),
      AuditLog.countDocuments(filter),
    ]);
    return success(res, { logs, total, page: Number(page), limit: Number(limit) }, "Audit logs retrieved");
  } catch (err) { next(err); }
};

module.exports = { dashboard, auditLogs };
