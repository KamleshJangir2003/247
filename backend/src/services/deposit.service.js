const mongoose = require("mongoose");
const Deposit = require("../models/Deposit");
const walletService = require("./wallet.service");
const commissionService = require("./commission.service");
const AuditLog = require("../models/AuditLog");

const createDeposit = async (userId, amount, metadata = {}, idempotencyKey = null) => {
  // If caller supplies an idempotency key, return existing deposit instead of creating duplicate
  if (idempotencyKey) {
    const existing = await Deposit.findOne({ idempotencyKey });
    if (existing) return existing;
  }

  const deposit = await Deposit.create({
    userId,
    amount,
    metadata,
    idempotencyKey: idempotencyKey || undefined,
  });
  return deposit;
};

const listDeposits = async (actor, query) => {
  const { page = 1, limit = 20, status, userId } = query;
  const filter = {};
  // USER and AGENT always scoped to own deposits
  if (actor.role === "USER") filter.userId = actor._id;
  else if (userId) filter.userId = userId;
  if (status) filter.status = status;

  const skip = (Math.max(1, page) - 1) * Math.min(100, limit);
  const [deposits, total] = await Promise.all([
    Deposit.find(filter).populate("userId", "username email").skip(skip).limit(Math.min(100, limit)).sort({ createdAt: -1 }),
    Deposit.countDocuments(filter),
  ]);
  return { deposits, total, page: Number(page), limit: Number(limit) };
};

const getDeposit = async (actor, id) => {
  const filter = { _id: id };
  if (actor.role === "USER") filter.userId = actor._id;
  const deposit = await Deposit.findOne(filter).populate("userId", "username email");
  if (!deposit) throw Object.assign(new Error("Deposit not found"), { statusCode: 404 });
  return deposit;
};

const approveDeposit = async (actor, id) => {
  // Atomic status transition: only moves from PENDING → APPROVED once, prevents race condition
  const deposit = await Deposit.findOneAndUpdate(
    { _id: id, status: "PENDING" },
    { $set: { status: "APPROVED", approvedBy: actor._id, approvedAt: new Date() } },
    { new: true }
  );
  if (!deposit) throw Object.assign(new Error("Deposit not found or already processed"), { statusCode: 404 });

  // Credit wallet inside a DB transaction so wallet + audit are atomic
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { transaction } = await walletService.credit(
      deposit.userId,
      deposit.amount,
      "DEPOSIT",
      `Deposit approved #${deposit._id}`,
      actor._id,
      { depositId: deposit._id },
      session
    );

    await AuditLog.create(
      [{ actor: actor._id, action: "DEPOSIT_APPROVE", target: "Deposit", targetId: deposit._id }],
      { session }
    );

    await session.commitTransaction();

    // Trigger commission calculation outside the session (non-critical, best-effort)
    commissionService.recordCommission(deposit.userId, transaction._id, deposit.amount).catch(() => {});

    return deposit;
  } catch (err) {
    await session.abortTransaction();
    // Roll back the status change so it can be retried
    await Deposit.findByIdAndUpdate(id, { $set: { status: "PENDING", approvedBy: null, approvedAt: null } });
    throw err;
  } finally {
    session.endSession();
  }
};

const rejectDeposit = async (actor, id, reason = "") => {
  // Atomic status transition
  const deposit = await Deposit.findOneAndUpdate(
    { _id: id, status: "PENDING" },
    { $set: { status: "REJECTED", rejectedBy: actor._id, rejectedAt: new Date(), rejectionReason: reason } },
    { new: true }
  );
  if (!deposit) throw Object.assign(new Error("Deposit not found or already processed"), { statusCode: 404 });

  await AuditLog.create({ actor: actor._id, action: "DEPOSIT_REJECT", target: "Deposit", targetId: deposit._id });
  return deposit;
};

module.exports = { createDeposit, listDeposits, getDeposit, approveDeposit, rejectDeposit };
