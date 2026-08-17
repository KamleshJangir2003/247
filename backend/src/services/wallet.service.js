const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");  // uuid v11 — named export unchanged
const Wallet = require("../models/Wallet");
const WalletTransaction = require("../models/WalletTransaction");

const getOrCreate = async (userId) => {
  let wallet = await Wallet.findOne({ userId });
  if (!wallet) wallet = await Wallet.create({ userId });
  return wallet;
};

const credit = async (userId, amount, type, description, createdBy, metadata = {}, session = null) => {
  const opts = session ? { session } : {};
  const wallet = await Wallet.findOneAndUpdate(
    { userId, status: "active" },
    { $inc: { balance: amount } },
    { new: true, ...opts }
  );
  if (!wallet) throw Object.assign(new Error("Wallet not found or frozen"), { statusCode: 400 });

  const tx = await WalletTransaction.create([{
    userId,
    type,
    amount,
    balanceBefore: wallet.balance - amount,
    balanceAfter: wallet.balance,
    reference: uuidv4(),
    description,
    status: "COMPLETED",
    createdBy: createdBy || null,
    metadata,
  }], opts);

  return { wallet, transaction: tx[0] };
};

const debit = async (userId, amount, type, description, createdBy, metadata = {}, session = null) => {
  const opts = session ? { session } : {};
  const wallet = await Wallet.findOneAndUpdate(
    { userId, status: "active", balance: { $gte: amount } },
    { $inc: { balance: -amount } },
    { new: true, ...opts }
  );
  if (!wallet) throw Object.assign(new Error("Insufficient balance or wallet unavailable"), { statusCode: 400 });

  const tx = await WalletTransaction.create([{
    userId,
    type,
    amount,
    balanceBefore: wallet.balance + amount,
    balanceAfter: wallet.balance,
    reference: uuidv4(),
    description,
    status: "COMPLETED",
    createdBy: createdBy || null,
    metadata,
  }], opts);

  return { wallet, transaction: tx[0] };
};

const transfer = async (senderId, receiverId, amount, createdBy) => {
  if (amount <= 0) throw Object.assign(new Error("Amount must be greater than 0"), { statusCode: 400 });

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { transaction: outTx } = await debit(senderId, amount, "TRANSFER_OUT", `Transfer to ${receiverId}`, createdBy, { receiverId }, session);
    const { transaction: inTx } = await credit(receiverId, amount, "TRANSFER_IN", `Transfer from ${senderId}`, createdBy, { senderId, outRef: outTx.reference }, session);
    await session.commitTransaction();
    return { outTx, inTx };
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
};

const getBalance = async (userId) => {
  const wallet = await Wallet.findOne({ userId });
  if (!wallet) throw Object.assign(new Error("Wallet not found"), { statusCode: 404 });
  return wallet;
};

module.exports = { getOrCreate, credit, debit, transfer, getBalance };
