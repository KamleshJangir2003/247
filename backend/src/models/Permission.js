const mongoose = require("mongoose");

const permissionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    description: { type: String, default: "" },
    group: { type: String, default: "general" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Permission", permissionSchema);
