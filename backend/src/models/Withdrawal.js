const mongoose = require("mongoose");

const STATUSES = ["PENDING", "APPROVED", "REJECTED", "CANCELLED", "PROCESSING", "COMPLETED", "FAILED"];

const withdrawalSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    amount: { type: Number, required: true, min: 1 },
    status: { type: String, enum: STATUSES, default: "PENDING", index: true },
    bankDetails: { type: mongoose.Schema.Types.Mixed, default: {} },
    payoutReference: { type: String, default: "" },
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

module.exports = mongoose.model("Withdrawal", withdrawalSchema);
