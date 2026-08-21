const mongoose = require("mongoose");

const ROLES = ["SUPER_ADMIN", "MASTER", "AGENT", "USER"];

const roleSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, enum: ROLES },
    permissions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Permission" }],
    description: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Role", roleSchema);
module.exports.ROLES = ROLES;
