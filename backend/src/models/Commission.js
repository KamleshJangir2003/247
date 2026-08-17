const mongoose = require("mongoose");

const commissionSchema = new mongoose.Schema(
  {
    sourceUser: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    agent: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null, index: true },
    master: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null, index: true },
    amount: { type: Number, required: true, min: 0 },
    percentage: { type: Number, default: 0 },
    sourceTransaction: { type: mongoose.Schema.Types.ObjectId, ref: "WalletTransaction", default: null },
    status: { type: String, enum: ["PENDING", "PAID", "CANCELLED"], default: "PENDING", index: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Commission", commissionSchema);
