const User = require("../models/User");
const Wallet = require("../models/Wallet");
const AuditLog = require("../models/AuditLog");
const { hash } = require("../utils/password");

const ROLE_LEVEL = { SUPER_ADMIN: 4, MASTER: 3, AGENT: 2, USER: 1 };

// Build hierarchy filter so each role only sees its own subtree
const buildHierarchyFilter = async (actor) => {
  if (actor.role === "SUPER_ADMIN") return {};
  if (actor.role === "MASTER") {
    // Find all agents under this master
    const agents = await User.find({ parentId: actor._id, role: "AGENT" }).select("_id");
    const agentIds = agents.map((a) => a._id);
    return { $or: [{ parentId: actor._id }, { parentId: { $in: agentIds } }] };
  }
  if (actor.role === "AGENT") return { parentId: actor._id };
  return { _id: actor._id };
};

const listUsers = async (actor, query) => {
  const { page = 1, limit = 20, search, status, role } = query;
  const filter = await buildHierarchyFilter(actor);

  if (search) {
    filter.$or = [
      { username: new RegExp(search, "i") },
      { email: new RegExp(search, "i") },
      { firstName: new RegExp(search, "i") },
    ];
  }
  if (status) filter.status = status;
  if (role) filter.role = role;

  const skip = (Math.max(1, page) - 1) * Math.min(100, limit);
  const [users, total] = await Promise.all([
    User.find(filter).skip(skip).limit(Math.min(100, limit)).sort({ createdAt: -1 }),
    User.countDocuments(filter),
  ]);

  return { users: users.map((u) => u.toSafeObject()), total, page: Number(page), limit: Number(limit) };
};

const getUser = async (actor, targetId) => {
  const filter = await buildHierarchyFilter(actor);
  filter._id = targetId;
  const user = await User.findOne(filter);
  if (!user) throw Object.assign(new Error("User not found"), { statusCode: 404 });
  return user.toSafeObject();
};

// Allowed creation map: who can create which role
const ALLOWED_CREATE = {
  SUPER_ADMIN: ["MASTER", "AGENT", "USER"],
  MASTER:      ["AGENT"],
  AGENT:       ["USER"],
  USER:        [],
};

const createUser = async (actor, data) => {
  const { firstName, lastName, username, email, phone, password, role, parentId } = data;

  const allowed = ALLOWED_CREATE[actor.role] || [];
  if (!allowed.includes(role)) {
    throw Object.assign(
      new Error(`${actor.role} cannot create role ${role}`),
      { statusCode: 403 }
    );
  }

  const exists = await User.findOne({ $or: [{ username }, { email }] });
  if (exists) throw Object.assign(new Error("Username or email already taken"), { statusCode: 409 });

  const passwordHash = await hash(password);
  const user = await User.create({ firstName, lastName, username, email, phone, passwordHash, role, parentId: parentId || actor._id });
  await Wallet.create({ userId: user._id });

  await AuditLog.create({ actor: actor._id, action: "USER_CREATE", target: "User", targetId: user._id });
  return user.toSafeObject();
};

const updateUser = async (actor, targetId, data) => {
  const filter = await buildHierarchyFilter(actor);
  filter._id = targetId;
  const user = await User.findOneAndUpdate(filter, { $set: data }, { new: true });
  if (!user) throw Object.assign(new Error("User not found"), { statusCode: 404 });
  await AuditLog.create({ actor: actor._id, action: "USER_UPDATE", target: "User", targetId: user._id, metadata: data });
  return user.toSafeObject();
};

const setStatus = async (actor, targetId, status) => {
  const filter = await buildHierarchyFilter(actor);
  filter._id = targetId;
  const user = await User.findOneAndUpdate(filter, { status, isActive: status === "active" }, { new: true });
  if (!user) throw Object.assign(new Error("User not found"), { statusCode: 404 });
  await AuditLog.create({ actor: actor._id, action: "USER_STATUS_CHANGE", target: "User", targetId: user._id, metadata: { status } });
  return user.toSafeObject();
};

const deleteUser = async (actor, targetId) => {
  if (actor.role !== "SUPER_ADMIN") throw Object.assign(new Error("Only SUPER_ADMIN can delete users"), { statusCode: 403 });
  const user = await User.findByIdAndDelete(targetId);
  if (!user) throw Object.assign(new Error("User not found"), { statusCode: 404 });
  await AuditLog.create({ actor: actor._id, action: "USER_DELETE", target: "User", targetId });
};

module.exports = { listUsers, getUser, createUser, updateUser, setStatus, deleteUser };
