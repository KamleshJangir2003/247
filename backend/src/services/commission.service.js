const mongoose = require("mongoose");
const Commission = require("../models/Commission");
const User = require("../models/User");
const walletService = require("./wallet.service");

const DEFAULT_AGENT_RATE = 0.02; // 2%
const DEFAULT_MASTER_RATE = 0.01; // 1%

// Called after deposit approval — creates PENDING commission records for agent + master
const recordCommission = async (sourceUserId, transactionId, amount) => {
  const sourceUser = await User.findById(sourceUserId);
  if (!sourceUser || !sourceUser.parentId) return;

  const agent = await User.findById(sourceUser.parentId);
  if (!agent || agent.role !== "AGENT") return;

  await Commission.create({
    sourceUser: sourceUserId,
    agent: agent._id,
    master: agent.parentId || null,
    amount: amount * DEFAULT_AGENT_RATE,
    percentage: DEFAULT_AGENT_RATE * 100,
    sourceTransaction: transactionId,
    status: "PENDING",
  });

  if (agent.parentId) {
    const master = await User.findById(agent.parentId);
    if (master && master.role === "MASTER") {
      await Commission.create({
        sourceUser: sourceUserId,
        agent: agent._id,
        master: master._id,
        amount: amount * DEFAULT_MASTER_RATE,
        percentage: DEFAULT_MASTER_RATE * 100,
        sourceTransaction: transactionId,
        status: "PENDING",
      });
    }
  }
};

// Pays all PENDING commissions for a given agent or master — credits their wallets
const payCommissions = async (actor, recipientId) => {
  const recipient = await User.findById(recipientId);
  if (!recipient) throw Object.assign(new Error("Recipient not found"), { statusCode: 404 });
  if (!["AGENT", "MASTER"].includes(recipient.role)) {
    throw Object.assign(new Error("Commissions can only be paid to AGENT or MASTER"), { statusCode: 400 });
  }

  const filter = recipient.role === "AGENT"
    ? { agent: recipientId, status: "PENDING" }
    : { master: recipientId, status: "PENDING" };

  const pending = await Commission.find(filter);
  if (!pending.length) throw Object.assign(new Error("No pending commissions"), { statusCode: 404 });

  const total = pending.reduce((sum, c) => sum + c.amount, 0);
  const ids = pending.map((c) => c._id);

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    await walletService.credit(
      recipientId,
      total,
      "COMMISSION",
      `Commission payout — ${ids.length} records`,
      actor._id,
      { commissionIds: ids },
      session
    );

    await Commission.updateMany(
      { _id: { $in: ids } },
      { $set: { status: "PAID" } },
      { session }
    );

    await session.commitTransaction();
    return { paid: ids.length, total };
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
};

const listCommissions = async (actor, query) => {
  const { page = 1, limit = 20 } = query;
  const filter = {};
  if (actor.role === "AGENT") filter.agent = actor._id;
  else if (actor.role === "MASTER") filter.master = actor._id;

  const skip = (Math.max(1, page) - 1) * Math.min(100, limit);
  const [commissions, total] = await Promise.all([
    Commission.find(filter).populate("sourceUser agent master", "username email").skip(skip).limit(Math.min(100, limit)).sort({ createdAt: -1 }),
    Commission.countDocuments(filter),
  ]);
  return { commissions, total, page: Number(page), limit: Number(limit) };
};

module.exports = { recordCommission, payCommissions, listCommissions };
