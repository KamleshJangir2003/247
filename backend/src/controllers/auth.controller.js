const authService = require("../services/auth.service");
const { success, error } = require("../utils/response");

const register = async (req, res, next) => {
  try {
    const user = await authService.register(req.body);
    return success(res, { user }, "Registration successful", 201);
  } catch (err) { next(err); }
};

const login = async (req, res, next) => {
  try {
    const ip = req.ip;
    const userAgent = req.headers["user-agent"] || "";
    const result = await authService.login({ ...req.body, ip, userAgent });
    return success(res, result, "Login successful");
  } catch (err) { next(err); }
};

const logout = async (req, res, next) => {
  try {
    await authService.logout(req.user._id, req.ip, req.headers["user-agent"] || "");
    return success(res, {}, "Logged out successfully");
  } catch (err) { next(err); }
};

const refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return error(res, "Refresh token required", 400);
    const tokens = await authService.refresh(refreshToken);
    return success(res, tokens, "Token refreshed");
  } catch (err) { next(err); }
};

const me = async (req, res) => {
  return success(res, { user: req.user }, "User profile");
};

const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    await authService.changePassword(req.user._id, currentPassword, newPassword);
    return success(res, {}, "Password changed successfully");
  } catch (err) { next(err); }
};

module.exports = { register, login, logout, refresh, me, changePassword };
