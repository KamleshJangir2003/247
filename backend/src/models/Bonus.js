const mongoose = require("mongoose");

const bonusSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, unique: true, uppercase: true, trim: true, index: true },
    description: { type: String, default: "" },
    percentage: { type: Number, default: 0, min: 0, max: 100 },
    fixedAmount: { type: Number, default: 0, min: 0 },
    minDeposit: { type: Number, default: 0, min: 0 },
    maxBonus: { type: Number, default: 0, min: 0 },
    // maxRedemptions: 0 means unlimited
    maxRedemptions: { type: Number, default: 0, min: 0 },
    status: { type: String, enum: ["active", "inactive"], default: "active", index: true },
    startDate: { type: Date, default: null },
    endDate: { type: Date, default: null },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    // tracks which users have redeemed this bonus (prevents double-redemption)
    redeemedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Bonus", bonusSchema);
