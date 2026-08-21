const mongoose = require("mongoose");

const STATUSES = ["active", "inactive", "blocked", "suspended"];

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, default: "", trim: true },
    username: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    phone: { type: String, default: "", trim: true },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, required: true, enum: ["SUPER_ADMIN", "MASTER", "AGENT", "USER"], index: true },
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null, index: true },
    status: { type: String, enum: STATUSES, default: "active", index: true },
    isActive: { type: Boolean, default: true },
    permissions: [{ type: String }],
    refreshToken: { type: String, select: false },
    lastLoginAt: { type: Date },
    lastLoginIp: { type: String },
  },
  { timestamps: true }
);

userSchema.index({ role: 1, parentId: 1 });

userSchema.methods.toSafeObject = function () {
  const obj = this.toObject();
  delete obj.passwordHash;
  delete obj.refreshToken;
  return obj;
};

module.exports = mongoose.model("User", userSchema);
