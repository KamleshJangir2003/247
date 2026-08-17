const mongoose = require("mongoose");

const CATEGORIES = ["Lottery", "Sports", "Exchange", "Live Casino", "Slot", "Fantasy", "Crash"];

const gameSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    image: { type: String, default: "" },
    category: { type: String, required: true, enum: CATEGORIES, index: true },
    subCategory: { type: String, default: "", index: true },
    provider: { type: String, default: "Demo", index: true },
    badge: { type: String, enum: ["HOT", "NEW", "LIVE", ""], default: "" },
    tags: [{ type: String }],
    isNew: { type: Boolean, default: false, index: true },
    isFeatured: { type: Boolean, default: false, index: true },
    isPopular: { type: Boolean, default: false, index: true },
    description: { type: String, default: "" },
    gameUrl: { type: String, default: null },
    status: { type: String, enum: ["active", "inactive"], default: "active", index: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true, suppressReservedKeysWarning: true }
);

gameSchema.index({ category: 1, status: 1 });

module.exports = mongoose.model("Game", gameSchema);
module.exports.CATEGORIES = CATEGORIES;
