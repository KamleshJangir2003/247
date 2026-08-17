/**
 * seed.js — Development only seed script.
 * Run: npm run seed
 * Creates roles, permissions, and one user per role.
 * Credentials are read from .env (SEED_* variables).
 */

require("dotenv").config();
const mongoose = require("mongoose");
const env = require("./config/env");
const { hash } = require("./utils/password");
const logger = require("./utils/logger");

const User = require("./models/User");
const Role = require("./models/Role");
const Permission = require("./models/Permission");
const Wallet = require("./models/Wallet");

const PERMISSIONS = [
  { name: "users.view",            group: "users",        description: "View users" },
  { name: "users.create",          group: "users",        description: "Create users" },
  { name: "users.update",          group: "users",        description: "Update users" },
  { name: "users.block",           group: "users",        description: "Block/unblock users" },
  { name: "games.view",            group: "games",        description: "View games" },
  { name: "games.create",          group: "games",        description: "Create games" },
  { name: "games.update",          group: "games",        description: "Update games" },
  { name: "games.delete",          group: "games",        description: "Delete games" },
  { name: "deposits.view",         group: "deposits",     description: "View deposits" },
  { name: "deposits.approve",      group: "deposits",     description: "Approve deposits" },
  { name: "deposits.reject",       group: "deposits",     description: "Reject deposits" },
  { name: "withdrawals.view",      group: "withdrawals",  description: "View withdrawals" },
  { name: "withdrawals.approve",   group: "withdrawals",  description: "Approve withdrawals" },
  { name: "withdrawals.reject",    group: "withdrawals",  description: "Reject withdrawals" },
  { name: "transactions.view",     group: "transactions", description: "View transactions" },
  { name: "reports.view",          group: "reports",      description: "View reports" },
  { name: "masters.manage",        group: "hierarchy",    description: "Manage masters" },
  { name: "agents.manage",         group: "hierarchy",    description: "Manage agents" },
  { name: "settings.manage",       group: "settings",     description: "Manage settings" },
];

// Permissions assigned per role
const ROLE_PERMISSIONS = {
  SUPER_ADMIN: PERMISSIONS.map((p) => p.name), // all
  ADMIN: [
    "users.view", "users.create", "users.update", "users.block",
    "games.view", "games.create", "games.update", "games.delete",
    "deposits.view", "deposits.approve", "deposits.reject",
    "withdrawals.view", "withdrawals.approve", "withdrawals.reject",
    "transactions.view", "reports.view", "masters.manage", "agents.manage",
  ],
  MASTER: [
    "users.view", "users.create", "users.update", "users.block",
    "deposits.view", "withdrawals.view", "transactions.view",
    "reports.view", "agents.manage",
  ],
  AGENT: [
    "users.view", "users.create", "users.update", "users.block",
    "deposits.view", "withdrawals.view", "transactions.view", "reports.view",
  ],
  USER: ["transactions.view", "deposits.view", "withdrawals.view"],
};

const seedUsers = [
  {
    firstName: "Super",
    lastName: "Admin",
    username: process.env.SEED_SUPER_ADMIN_USERNAME || "superadmin",
    email: process.env.SEED_SUPER_ADMIN_EMAIL || "superadmin@777games.dev",
    password: process.env.SEED_SUPER_ADMIN_PASSWORD || "SuperAdmin@2024",
    role: "SUPER_ADMIN",
  },
  {
    firstName: "Admin",
    lastName: "User",
    username: process.env.SEED_ADMIN_USERNAME || "admin777",
    email: process.env.SEED_ADMIN_EMAIL || "admin@777games.dev",
    password: process.env.SEED_ADMIN_PASSWORD || "Admin@2024",
    role: "ADMIN",
  },
  {
    firstName: "Master",
    lastName: "User",
    username: process.env.SEED_MASTER_USERNAME || "master777",
    email: process.env.SEED_MASTER_EMAIL || "master@777games.dev",
    password: process.env.SEED_MASTER_PASSWORD || "Master@2024",
    role: "MASTER",
  },
  {
    firstName: "Agent",
    lastName: "User",
    username: process.env.SEED_AGENT_USERNAME || "agent777",
    email: process.env.SEED_AGENT_EMAIL || "agent@777games.dev",
    password: process.env.SEED_AGENT_PASSWORD || "Agent@2024",
    role: "AGENT",
  },
  {
    firstName: "Demo",
    lastName: "User",
    username: process.env.SEED_USER_USERNAME || "demo",
    email: process.env.SEED_USER_EMAIL || "demo@777games.dev",
    password: process.env.SEED_USER_PASSWORD || "Demo@2024",
    role: "USER",
  },
];

const seed = async () => {
  await mongoose.connect(env.MONGO_URI);
  logger.info("Connected to MongoDB");

  // Upsert permissions
  const permMap = {};
  for (const p of PERMISSIONS) {
    const perm = await Permission.findOneAndUpdate(
      { name: p.name },
      { $setOnInsert: p },
      { upsert: true, new: true }
    );
    permMap[p.name] = perm._id;
  }
  logger.info(`Seeded ${PERMISSIONS.length} permissions`);

  // Upsert roles with their permissions
  for (const [roleName, permNames] of Object.entries(ROLE_PERMISSIONS)) {
    const permIds = permNames.map((n) => permMap[n]).filter(Boolean);
    await Role.findOneAndUpdate(
      { name: roleName },
      { name: roleName, permissions: permIds },
      { upsert: true, new: true }
    );
  }
  logger.info("Seeded 5 roles");

  // Build parentId chain: ADMIN → SUPER_ADMIN, MASTER → ADMIN, AGENT → MASTER, USER → AGENT
  const createdUsers = {};

  for (const u of seedUsers) {
    const existing = await User.findOne({ $or: [{ username: u.username }, { email: u.email }] });
    if (existing) {
      logger.info(`User already exists: ${u.username} — skipping`);
      createdUsers[u.role] = existing;
      continue;
    }

    const passwordHash = await hash(u.password);
    const permNames = ROLE_PERMISSIONS[u.role] || [];

    // Assign parentId based on hierarchy
    let parentId = null;
    if (u.role === "ADMIN")  parentId = createdUsers["SUPER_ADMIN"]?._id || null;
    if (u.role === "MASTER") parentId = createdUsers["ADMIN"]?._id || null;
    if (u.role === "AGENT")  parentId = createdUsers["MASTER"]?._id || null;
    if (u.role === "USER")   parentId = createdUsers["AGENT"]?._id || null;

    const user = await User.create({
      firstName: u.firstName,
      lastName: u.lastName,
      username: u.username,
      email: u.email,
      passwordHash,
      role: u.role,
      parentId,
      permissions: permNames,
      status: "active",
      isActive: true,
    });

    await Wallet.findOneAndUpdate(
      { userId: user._id },
      { $setOnInsert: { userId: user._id } },
      { upsert: true, new: true }
    );

    createdUsers[u.role] = user;
    logger.info(`Created ${u.role}: ${u.username} (${u.email})`);
  }

  logger.info("Seed complete.");
  await mongoose.disconnect();
  process.exit(0);
};

seed().catch((err) => {
  logger.error("Seed failed:", err.message);
  process.exit(1);
});
