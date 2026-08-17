const mongoose = require("mongoose");

const TX_TYPES = [
  "DEPOSIT", "WITHDRAWAL", "GAME_DEBIT", "GAME_WIN",
  "BONUS", "COMMISSION", "TRANSFER_IN", "TRANSFER_OUT",
  "REFUND", "ADJUSTMENT",
];

const TX_STATUSES = ["PENDING", "COMPLETED", "FAILED", "REVERSED"];

const walletTransactionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    type: { type: String, required: true, enum: TX_TYPES, index: true },
    amount: { type: Number, required: true, min: 0.01 },
    balanceBefore: { type: Number, required: true },
    balanceAfter: { type: Number, required: true },
    reference: { type: String, required: true, unique: true, index: true },
    description: { type: String, default: "" },
    status: { type: String, enum: TX_STATUSES, default: "COMPLETED", index: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

walletTransactionSchema.index({ userId: 1, createdAt: -1 });
walletTransactionSchema.index({ type: 1, status: 1 });

module.exports = mongoose.model("WalletTransaction", walletTransactionSchema);
module.exports.TX_TYPES = TX_TYPES;
