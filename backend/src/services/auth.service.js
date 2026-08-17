const User = require("../models/User");
const Wallet = require("../models/Wallet");
const AuditLog = require("../models/AuditLog");
const { hash, compare } = require("../utils/password");
const { signAccess, signRefresh, verifyRefresh } = require("../utils/jwt");

const register = async ({ firstName, lastName, username, email, phone, password, role, parentId }) => {
  const exists = await User.findOne({ $or: [{ username }, { email }] });
  if (exists) throw Object.assign(new Error("Username or email already taken"), { statusCode: 409 });

  const passwordHash = await hash(password);
  const user = await User.create({ firstName, lastName, username, email, phone, passwordHash, role: role || "USER", parentId: parentId || null });

  // Create wallet for all users
  await Wallet.create({ userId: user._id });

  return user.toSafeObject();
};

const login = async ({ username, password, ip, userAgent }) => {
  const user = await User.findOne({
    $or: [{ username: username.toLowerCase() }, { email: username.toLowerCase() }],
  }).select("+passwordHash");

  if (!user) throw Object.assign(new Error("Invalid credentials"), { statusCode: 401 });
  if (!user.isActive || user.status === "blocked") throw Object.assign(new Error("Account is not accessible"), { statusCode: 403 });

  const valid = await compare(password, user.passwordHash);
  if (!valid) throw Object.assign(new Error("Invalid credentials"), { statusCode: 401 });

  const payload = { userId: user._id, role: user.role };
  const accessToken = signAccess(payload);
  const refreshToken = signRefresh(payload);

  user.refreshToken = refreshToken;
  user.lastLoginAt = new Date();
  user.lastLoginIp = ip || "";
  await user.save();

  await AuditLog.create({ actor: user._id, action: "LOGIN", target: "User", targetId: user._id, ip, userAgent });

  return { accessToken, refreshToken, user: user.toSafeObject() };
};

const refresh = async (token) => {
  let decoded;
  try { decoded = verifyRefresh(token); } catch { throw Object.assign(new Error("Invalid refresh token"), { statusCode: 401 }); }

  const user = await User.findById(decoded.userId).select("+refreshToken");
  if (!user || user.refreshToken !== token) throw Object.assign(new Error("Invalid refresh token"), { statusCode: 401 });

  const payload = { userId: user._id, role: user.role };
  const accessToken = signAccess(payload);
  const newRefresh = signRefresh(payload);
  user.refreshToken = newRefresh;
  await user.save();

  return { accessToken, refreshToken: newRefresh };
};

const logout = async (userId, ip, userAgent) => {
  await User.findByIdAndUpdate(userId, { refreshToken: null });
  await AuditLog.create({ actor: userId, action: "LOGOUT", target: "User", targetId: userId, ip, userAgent });
};

const changePassword = async (userId, currentPassword, newPassword) => {
  const user = await User.findById(userId).select("+passwordHash");
  if (!user) throw Object.assign(new Error("User not found"), { statusCode: 404 });
  const valid = await compare(currentPassword, user.passwordHash);
  if (!valid) throw Object.assign(new Error("Current password is incorrect"), { statusCode: 400 });
  user.passwordHash = await hash(newPassword);
  await user.save();
};

module.exports = { register, login, refresh, logout, changePassword };
