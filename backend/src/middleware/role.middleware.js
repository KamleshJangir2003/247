const { error } = require("../utils/response");

// Role hierarchy levels
const ROLE_LEVEL = { SUPER_ADMIN: 5, ADMIN: 4, MASTER: 3, AGENT: 2, USER: 1 };

const authorize = (...roles) => (req, res, next) => {
  if (!req.user) return error(res, "Authentication required", 401);
  if (!roles.includes(req.user.role)) return error(res, "Insufficient role", 403);
  next();
};

const authorizeMinLevel = (minRole) => (req, res, next) => {
  if (!req.user) return error(res, "Authentication required", 401);
  if ((ROLE_LEVEL[req.user.role] || 0) < (ROLE_LEVEL[minRole] || 0)) {
    return error(res, "Insufficient privileges", 403);
  }
  next();
};

module.exports = { authorize, authorizeMinLevel, ROLE_LEVEL };
