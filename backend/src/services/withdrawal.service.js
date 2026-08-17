const mongoose = require("mongoose");
const Withdrawal = require("../models/Withdrawal");
const walletService = require("./wallet.service");
const AuditLog = require("../models/AuditLog");

const createWithdrawal = async (userId, amount, bankDetails = {}) => {
  // Debit + create withdrawal record in a single DB transaction
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    // debit reserves funds atomically; throws if balance insufficient
    await walletService.debit(
      userId,
      amount,
      "WITHDRAWAL",
      "Withdrawal request reserved",
      userId,
      {},
      session
    );

    const [withdrawal] = await Withdrawal.create(
      [{ userId, amount, bankDetails, status: "PENDING" }],
      { session }
    );

    await session.commitTransaction();
    return withdrawal;
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
};

const listWithdrawals = async (actor, query) => {
  const { page = 1, limit = 20, status, userId } = query;
  const filter = {};
  if (actor.role === "USER" || actor.role === "AGENT") filter.userId = actor._id;
  else if (userId) filter.userId = userId;
  if (status) filter.status = status;

  const skip = (Math.max(1, page) - 1) * Math.min(100, limit);
  const [withdrawals, total] = await Promise.all([
    Withdrawal.find(filter).populate("userId", "username email").skip(skip).limit(Math.min(100, limit)).sort({ createdAt: -1 }),
    Withdrawal.countDocuments(filter),
  ]);
  return { withdrawals, total, page: Number(page), limit: Number(limit) };
};

const getWithdrawal = async (actor, id) => {
  const filter = { _id: id };
  if (actor.role === "USER") filter.userId = actor._id;
  const w = await Withdrawal.findOne(filter).populate("userId", "username email");
  if (!w) throw Object.assign(new Error("Withdrawal not found"), { statusCode: 404 });
  return w;
};

const approveWithdrawal = async (actor, id) => {
  // Atomic: PENDING → APPROVED (funds already reserved at creation)
  const w = await Withdrawal.findOneAndUpdate(
    { _id: id, status: "PENDING" },
    { $set: { status: "APPROVED", approvedBy: actor._id, approvedAt: new Date() } },
    { new: true }
  );
  if (!w) throw Object.assign(new Error("Withdrawal not found or already processed"), { statusCode: 404 });

  await AuditLog.create({ actor: actor._id, action: "WITHDRAWAL_APPROVE", target: "Withdrawal", targetId: w._id });
  return w;
};

const rejectWithdrawal = async (actor, id, reason = "") => {
  // Atomic: PENDING → REJECTED, then refund inside a DB transaction
  const w = await Withdrawal.findOneAndUpdate(
    { _id: id, status: "PENDING" },
    { $set: { status: "REJECTED", rejectedBy: actor._id, rejectedAt: new Date(), rejectionReason: reason } },
    { new: true }
  );
  if (!w) throw Object.assign(new Error("Withdrawal not found or already processed"), { statusCode: 404 });

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    await walletService.credit(
      w.userId,
      w.amount,
      "REFUND",
      `Withdrawal rejected #${w._id}`,
      actor._id,
      { withdrawalId: w._id },
      session
    );
    await AuditLog.create(
      [{ actor: actor._id, action: "WITHDRAWAL_REJECT", target: "Withdrawal", targetId: w._id }],
      { session }
    );
    await session.commitTransaction();
    return w;
  } catch (err) {
    await session.abortTransaction();
    // Roll back status so it can be retried
    await Withdrawal.findByIdAndUpdate(id, {
      $set: { status: "PENDING", rejectedBy: null, rejectedAt: null, rejectionReason: "" },
    });
    throw err;
  } finally {
    session.endSession();
  }
};

// Called by payment gateway / admin after actual payout is confirmed
const completeWithdrawal = async (actor, id, payoutReference = "") => {
  const w = await Withdrawal.findOneAndUpdate(
    { _id: id, status: "APPROVED" },
    { $set: { status: "COMPLETED", payoutReference } },
    { new: true }
  );
  if (!w) throw Object.assign(new Error("Withdrawal not found or not in APPROVED state"), { statusCode: 404 });

  await AuditLog.create({ actor: actor._id, action: "WITHDRAWAL_COMPLETE", target: "Withdrawal", targetId: w._id });
  return w;
};

// Called when payout fails after approval — refunds the reserved amount
const failWithdrawal = async (actor, id, reason = "") => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const w = await Withdrawal.findOneAndUpdate(
      { _id: id, status: "APPROVED" },
      { $set: { status: "FAILED", rejectionReason: reason } },
      { new: true, session }
    );
    if (!w) throw Object.assign(new Error("Withdrawal not found or not in APPROVED state"), { statusCode: 404 });

    await walletService.credit(
      w.userId,
      w.amount,
      "REFUND",
      `Withdrawal payout failed #${w._id}`,
      actor._id,
      { withdrawalId: w._id },
      session
    );
    await AuditLog.create(
      [{ actor: actor._id, action: "WITHDRAWAL_FAIL", target: "Withdrawal", targetId: w._id }],
      { session }
    );
    await session.commitTransaction();
    return w;
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
};

module.exports = {
  createWithdrawal,
  listWithdrawals,
  getWithdrawal,
  approveWithdrawal,
  rejectWithdrawal,
  completeWithdrawal,
  failWithdrawal,
};
