const mongoose = require("mongoose");

const STATUSES = ["PENDING", "APPROVED", "REJECTED", "CANCELLED"];

const depositSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    amount: { type: Number, required: true, min: 1 },
    status: { type: String, enum: STATUSES, default: "PENDING", index: true },
    // idempotencyKey: caller-supplied unique key to prevent duplicate submissions
    idempotencyKey: { type: String, default: undefined },
    paymentReference: { type: String, default: "" },
    gateway: { type: String, default: "manual" },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    approvedAt: { type: Date, default: null },
    rejectedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    rejectedAt: { type: Date, default: null },
    rejectionReason: { type: String, default: "" },
  },
  { timestamps: true }
);

// Unique sparse index: two deposits with the same idempotencyKey are rejected at DB level
depositSchema.index({ idempotencyKey: 1 }, { unique: true, sparse: true });

module.exports = mongoose.model("Deposit", depositSchema);
