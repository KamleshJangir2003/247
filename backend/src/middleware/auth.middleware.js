const { verifyAccess } = require("../utils/jwt");
const User = require("../models/User");
const { error } = require("../utils/response");

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return error(res, "Authentication required", 401);
    }
    const token = authHeader.split(" ")[1];
    const decoded = verifyAccess(token);
    const user = await User.findById(decoded.userId).select("-passwordHash -refreshToken");
    if (!user || !user.isActive || user.status === "blocked") {
      return error(res, "Account not accessible", 401);
    }
    req.user = user;
    next();
  } catch (err) {
    return error(res, "Invalid or expired token", 401);
  }
};

module.exports = { authenticate };
