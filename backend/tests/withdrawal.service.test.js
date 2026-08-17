/**
 * tests/withdrawal.service.test.js
 * Tests withdrawal lifecycle: create (debit reserve), approve, reject (refund),
 * complete (APPROVED→COMPLETED), fail (APPROVED→FAILED + refund).
 */

const mongoose = require("mongoose");
const { MongoMemoryReplSet } = require("mongodb-memory-server");
const Withdrawal = require("../src/models/Withdrawal");
const Wallet = require("../src/models/Wallet");
const WalletTransaction = require("../src/models/WalletTransaction");
const User = require("../src/models/User");
const withdrawalService = require("../src/services/withdrawal.service");

let mongod;

beforeAll(async () => {
  mongod = await MongoMemoryReplSet.create({ replSet: { count: 1 } });
  await mongoose.connect(mongod.getUri());
  // Pre-create all collections and wait for replica set to stabilise
  await Promise.all([
    Withdrawal.createCollection(),
    Wallet.createCollection(),
    WalletTransaction.createCollection(),
    User.createCollection(),
  ]);
  await new Promise((r) => setTimeout(r, 500));
}, 60000);

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

afterEach(async () => {
  // Retry once on transient catalog-change errors from replica set index rebuilds
  for (let i = 0; i < 2; i++) {
    try {
      await Withdrawal.deleteMany({});
      await Wallet.deleteMany({});
      await WalletTransaction.deleteMany({});
      await User.deleteMany({});
      break;
    } catch (e) {
      if (i === 1) throw e;
      await new Promise((r) => setTimeout(r, 200));
    }
  }
});

const makeUser = () =>
  User.create({
    firstName: "Test",
    username: `u_${Date.now()}_${Math.random()}`,
    email: `t_${Date.now()}_${Math.random()}@test.com`,
    passwordHash: "hash",
    role: "USER",
  });

const actor = { _id: new mongoose.Types.ObjectId(), role: "ADMIN" };

describe("withdrawalService.createWithdrawal", () => {
  it("debits wallet and creates PENDING withdrawal", async () => {
    const user = await makeUser();
    await Wallet.create({ userId: user._id, balance: 500 });

    const w = await withdrawalService.createWithdrawal(user._id, 200, {});

    expect(w.status).toBe("PENDING");
    expect(w.amount).toBe(200);

    const wallet = await Wallet.findOne({ userId: user._id });
    expect(wallet.balance).toBe(300);
  });

  it("throws if insufficient balance", async () => {
    const user = await makeUser();
    await Wallet.create({ userId: user._id, balance: 50 });

    await expect(withdrawalService.createWithdrawal(user._id, 200, {}))
      .rejects.toMatchObject({ message: "Insufficient balance or wallet unavailable" });
  });
});

describe("withdrawalService.approveWithdrawal", () => {
  it("moves status PENDING → APPROVED", async () => {
    const user = await makeUser();
    await Wallet.create({ userId: user._id, balance: 300 });
    const w = await withdrawalService.createWithdrawal(user._id, 100, {});

    const approved = await withdrawalService.approveWithdrawal(actor, w._id);
    expect(approved.status).toBe("APPROVED");
  });

  it("prevents double-approval", async () => {
    const user = await makeUser();
    await Wallet.create({ userId: user._id, balance: 300 });
    const w = await withdrawalService.createWithdrawal(user._id, 100, {});

    await withdrawalService.approveWithdrawal(actor, w._id);
    await expect(withdrawalService.approveWithdrawal(actor, w._id))
      .rejects.toMatchObject({ message: "Withdrawal not found or already processed" });
  });
});

describe("withdrawalService.rejectWithdrawal", () => {
  it("refunds wallet on rejection", async () => {
    const user = await makeUser();
    await Wallet.create({ userId: user._id, balance: 300 });
    const w = await withdrawalService.createWithdrawal(user._id, 100, {});

    await withdrawalService.rejectWithdrawal(actor, w._id, "Fake");

    const wallet = await Wallet.findOne({ userId: user._id });
    expect(wallet.balance).toBe(300); // refunded
    const rejected = await Withdrawal.findById(w._id);
    expect(rejected.status).toBe("REJECTED");
    expect(rejected.rejectionReason).toBe("Fake");
  });
});

describe("withdrawalService.completeWithdrawal", () => {
  it("moves APPROVED → COMPLETED", async () => {
    const user = await makeUser();
    await Wallet.create({ userId: user._id, balance: 300 });
    const w = await withdrawalService.createWithdrawal(user._id, 100, {});
    await withdrawalService.approveWithdrawal(actor, w._id);

    const completed = await withdrawalService.completeWithdrawal(actor, w._id, "REF-001");
    expect(completed.status).toBe("COMPLETED");
    expect(completed.payoutReference).toBe("REF-001");
  });

  it("cannot complete a PENDING withdrawal", async () => {
    const user = await makeUser();
    await Wallet.create({ userId: user._id, balance: 300 });
    const w = await withdrawalService.createWithdrawal(user._id, 100, {});

    await expect(withdrawalService.completeWithdrawal(actor, w._id, ""))
      .rejects.toMatchObject({ message: "Withdrawal not found or not in APPROVED state" });
  });
});

describe("withdrawalService.failWithdrawal", () => {
  it("moves APPROVED → FAILED and refunds wallet", async () => {
    const user = await makeUser();
    await Wallet.create({ userId: user._id, balance: 300 });
    const w = await withdrawalService.createWithdrawal(user._id, 100, {});
    await withdrawalService.approveWithdrawal(actor, w._id);

    await withdrawalService.failWithdrawal(actor, w._id, "Gateway error");

    const wallet = await Wallet.findOne({ userId: user._id });
    expect(wallet.balance).toBe(300); // refunded back

    const failed = await Withdrawal.findById(w._id);
    expect(failed.status).toBe("FAILED");
    expect(failed.rejectionReason).toBe("Gateway error");
  });

  it("cannot fail a PENDING withdrawal", async () => {
    const user = await makeUser();
    await Wallet.create({ userId: user._id, balance: 300 });
    const w = await withdrawalService.createWithdrawal(user._id, 100, {});

    await expect(withdrawalService.failWithdrawal(actor, w._id, ""))
      .rejects.toMatchObject({ message: "Withdrawal not found or not in APPROVED state" });
  });
});
