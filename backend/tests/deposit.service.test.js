/**
 * tests/deposit.service.test.js
 * Tests deposit creation idempotency, atomic approval, and race-condition protection.
 */

const mongoose = require("mongoose");
const { MongoMemoryReplSet } = require("mongodb-memory-server");
const Deposit = require("../src/models/Deposit");
const Wallet = require("../src/models/Wallet");
const WalletTransaction = require("../src/models/WalletTransaction");
const User = require("../src/models/User");
const depositService = require("../src/services/deposit.service");

let mongod;

beforeAll(async () => {
  mongod = await MongoMemoryReplSet.create({ replSet: { count: 1 } });
  await mongoose.connect(mongod.getUri());
}, 60000);

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

afterEach(async () => {
  await Deposit.deleteMany({});
  await Wallet.deleteMany({});
  await WalletTransaction.deleteMany({});
  await User.deleteMany({});
});

const makeUser = async (role = "USER") => {
  return User.create({
    firstName: "Test",
    username: `u_${Date.now()}_${Math.random()}`,
    email: `t_${Date.now()}_${Math.random()}@test.com`,
    passwordHash: "hash",
    role,
  });
};

describe("depositService.createDeposit — idempotency", () => {
  it("returns existing deposit for same idempotencyKey", async () => {
    const user = await makeUser();
    const key = "idem-key-001";

    const d1 = await depositService.createDeposit(user._id, 100, {}, key);
    const d2 = await depositService.createDeposit(user._id, 100, {}, key);

    expect(d1._id.toString()).toBe(d2._id.toString());
    const count = await Deposit.countDocuments({ idempotencyKey: key });
    expect(count).toBe(1);
  });

  it("creates separate deposits without idempotency key", async () => {
    const user = await makeUser();
    await depositService.createDeposit(user._id, 100);
    await depositService.createDeposit(user._id, 100);
    const count = await Deposit.countDocuments({ userId: user._id });
    expect(count).toBe(2);
  });
});

describe("depositService.approveDeposit — atomic + race condition", () => {
  it("credits wallet on approval", async () => {
    const user = await makeUser();
    await Wallet.create({ userId: user._id, balance: 0 });
    const deposit = await depositService.createDeposit(user._id, 250);

    const actor = { _id: new mongoose.Types.ObjectId(), role: "ADMIN" };
    await depositService.approveDeposit(actor, deposit._id);

    const wallet = await Wallet.findOne({ userId: user._id });
    expect(wallet.balance).toBe(250);

    const approved = await Deposit.findById(deposit._id);
    expect(approved.status).toBe("APPROVED");
  });

  it("prevents double-approval (race condition protection)", async () => {
    const user = await makeUser();
    await Wallet.create({ userId: user._id, balance: 0 });
    const deposit = await depositService.createDeposit(user._id, 100);
    const actor = { _id: new mongoose.Types.ObjectId(), role: "ADMIN" };

    // First approval succeeds
    await depositService.approveDeposit(actor, deposit._id);

    // Second approval must fail
    await expect(depositService.approveDeposit(actor, deposit._id))
      .rejects.toMatchObject({ message: "Deposit not found or already processed" });

    // Wallet must only be credited once
    const wallet = await Wallet.findOne({ userId: user._id });
    expect(wallet.balance).toBe(100);
  });
});

describe("depositService.rejectDeposit", () => {
  it("sets status to REJECTED atomically", async () => {
    const user = await makeUser();
    const deposit = await depositService.createDeposit(user._id, 50);
    const actor = { _id: new mongoose.Types.ObjectId(), role: "ADMIN" };

    await depositService.rejectDeposit(actor, deposit._id, "Fake payment");

    const rejected = await Deposit.findById(deposit._id);
    expect(rejected.status).toBe("REJECTED");
    expect(rejected.rejectionReason).toBe("Fake payment");
  });

  it("cannot reject an already-approved deposit", async () => {
    const user = await makeUser();
    await Wallet.create({ userId: user._id, balance: 0 });
    const deposit = await depositService.createDeposit(user._id, 50);
    const actor = { _id: new mongoose.Types.ObjectId(), role: "ADMIN" };

    await depositService.approveDeposit(actor, deposit._id);

    await expect(depositService.rejectDeposit(actor, deposit._id, "late"))
      .rejects.toMatchObject({ message: "Deposit not found or already processed" });
  });
});
