const User = require("../models/User");
const Deposit = require("../models/Deposit");
const Withdrawal = require("../models/Withdrawal");
const WalletTransaction = require("../models/WalletTransaction");
const Game = require("../models/Game");
const Commission = require("../models/Commission");
const { success } = require("../utils/response");

const buildDateFilter = (dateFrom, dateTo) => {
  const f = {};
  if (dateFrom) f.$gte = new Date(dateFrom);
  if (dateTo) f.$lte = new Date(dateTo);
  return Object.keys(f).length ? f : null;
};

const paginate = (page, limit) => ({
  skip: (Math.max(1, page) - 1) * Math.min(100, limit),
  lim: Math.min(100, limit),
});

const users = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, dateFrom, dateTo, role, status } = req.query;
    const filter = {};
    if (role) filter.role = role;
    if (status) filter.status = status;
    const df = buildDateFilter(dateFrom, dateTo);
    if (df) filter.createdAt = df;
    const { skip, lim } = paginate(page, limit);
    const [data, total] = await Promise.all([
      User.find(filter).skip(skip).limit(lim).sort({ createdAt: -1 }),
      User.countDocuments(filter),
    ]);
    return success(res, { data: data.map((u) => u.toSafeObject()), total, page: Number(page), limit: Number(limit) }, "User report");
  } catch (err) { next(err); }
};

const deposits = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, dateFrom, dateTo, status } = req.query;
    const filter = {};
    if (status) filter.status = status;
    const df = buildDateFilter(dateFrom, dateTo);
    if (df) filter.createdAt = df;
    const { skip, lim } = paginate(page, limit);
    const [data, total] = await Promise.all([
      Deposit.find(filter).populate("userId", "username email").skip(skip).limit(lim).sort({ createdAt: -1 }),
      Deposit.countDocuments(filter),
    ]);
    return success(res, { data, total, page: Number(page), limit: Number(limit) }, "Deposit report");
  } catch (err) { next(err); }
};

const withdrawals = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, dateFrom, dateTo, status } = req.query;
    const filter = {};
    if (status) filter.status = status;
    const df = buildDateFilter(dateFrom, dateTo);
    if (df) filter.createdAt = df;
    const { skip, lim } = paginate(page, limit);
    const [data, total] = await Promise.all([
      Withdrawal.find(filter).populate("userId", "username email").skip(skip).limit(lim).sort({ createdAt: -1 }),
      Withdrawal.countDocuments(filter),
    ]);
    return success(res, { data, total, page: Number(page), limit: Number(limit) }, "Withdrawal report");
  } catch (err) { next(err); }
};

const transactions = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, dateFrom, dateTo, type, status } = req.query;
    const filter = {};
    if (type) filter.type = type;
    if (status) filter.status = status;
    const df = buildDateFilter(dateFrom, dateTo);
    if (df) filter.createdAt = df;
    const { skip, lim } = paginate(page, limit);
    const [data, total] = await Promise.all([
      WalletTransaction.find(filter).populate("userId", "username email").skip(skip).limit(lim).sort({ createdAt: -1 }),
      WalletTransaction.countDocuments(filter),
    ]);
    return success(res, { data, total, page: Number(page), limit: Number(limit) }, "Transaction report");
  } catch (err) { next(err); }
};

const games = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, category, status } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (status) filter.status = status;
    const { skip, lim } = paginate(page, limit);
    const [data, total] = await Promise.all([
      Game.find(filter).skip(skip).limit(lim).sort({ createdAt: -1 }),
      Game.countDocuments(filter),
    ]);
    return success(res, { data, total, page: Number(page), limit: Number(limit) }, "Game report");
  } catch (err) { next(err); }
};

const commission = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, dateFrom, dateTo, status } = req.query;
    const filter = {};
    if (status) filter.status = status;
    const df = buildDateFilter(dateFrom, dateTo);
    if (df) filter.createdAt = df;
    const { skip, lim } = paginate(page, limit);
    const [data, total] = await Promise.all([
      Commission.find(filter).populate("sourceUser agent master", "username email").skip(skip).limit(lim).sort({ createdAt: -1 }),
      Commission.countDocuments(filter),
    ]);
    return success(res, { data, total, page: Number(page), limit: Number(limit) }, "Commission report");
  } catch (err) { next(err); }
};

module.exports = { users, deposits, withdrawals, transactions, games, commission };
