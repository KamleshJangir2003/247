const { error } = require("../utils/response");

// SUPER_ADMIN bypasses all permission checks
const requirePermission = (...perms) => (req, res, next) => {
  if (!req.user) return error(res, "Authentication required", 401);
  if (req.user.role === "SUPER_ADMIN") return next();
  const userPerms = req.user.permissions || [];
  const hasAll = perms.every((p) => userPerms.includes(p));
  if (!hasAll) return error(res, "Permission denied", 403);
  next();
};

module.exports = { requirePermission };
