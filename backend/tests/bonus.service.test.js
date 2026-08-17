/**
 * tests/bonus.service.test.js
 * Tests bonus apply/redeem: valid redemption, double-redeem prevention,
 * expired bonus, maxRedemptions cap, minDeposit validation.
 */

const mongoose = require("mongoose");
const { MongoMemoryReplSet } = require("mongodb-memory-server");
const Bonus = require("../src/models/Bonus");
const Wallet = require("../src/models/Wallet");
const WalletTransaction = require("../src/models/WalletTransaction");
const User = require("../src/models/User");
const AuditLog = require("../src/models/AuditLog");
const bonusService = require("../src/services/bonus.service");

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
  await Bonus.deleteMany({});
  await Wallet.deleteMany({});
  await WalletTransaction.deleteMany({});
  await User.deleteMany({});
  await AuditLog.deleteMany({});
});

const makeUser = () =>
  User.create({
    firstName: "Test",
    username: `u_${Date.now()}_${Math.random()}`,
    email: `t_${Date.now()}_${Math.random()}@test.com`,
    passwordHash: "hash",
    role: "USER",
  });

const makeBonus = (overrides = {}) =>
  Bonus.create({
    name: "Welcome Bonus",
    code: `CODE_${Date.now()}`,
    fixedAmount: 100,
    status: "active",
    ...overrides,
  });

describe("bonusService.applyBonus — valid redemption", () => {
  it("credits wallet with fixed bonus amount", async () => {
    const user = await makeUser();
    await Wallet.create({ userId: user._id, balance: 0 });
    const bonus = await makeBonus({ fixedAmount: 100 });

    const result = await bonusService.applyBonus(user._id, bonus.code, 0);

    expect(result.bonusAmount).toBe(100);
    const wallet = await Wallet.findOne({ userId: user._id });
    expect(wallet.balance).toBe(100);
  });

  it("credits wallet with percentage bonus", async () => {
    const user = await makeUser();
    await Wallet.create({ userId: user._id, balance: 0 });
    const bonus = await makeBonus({ fixedAmount: 0, percentage: 10 });

    const result = await bonusService.applyBonus(user._id, bonus.code, 500);
    expect(result.bonusAmount).toBe(50);
  });

  it("caps bonus at maxBonus", async () => {
    const user = await makeUser();
    await Wallet.create({ userId: user._id, balance: 0 });
    const bonus = await makeBonus({ fixedAmount: 0, percentage: 50, maxBonus: 200 });

    const result = await bonusService.applyBonus(user._id, bonus.code, 1000);
    expect(result.bonusAmount).toBe(200);
  });
});

describe("bonusService.applyBonus — double-redeem prevention", () => {
  it("throws 409 on second redemption by same user", async () => {
    const user = await makeUser();
    await Wallet.create({ userId: user._id, balance: 0 });
    const bonus = await makeBonus({ fixedAmount: 50 });

    await bonusService.applyBonus(user._id, bonus.code, 0);

    await expect(bonusService.applyBonus(user._id, bonus.code, 0))
      .rejects.toMatchObject({ message: "Bonus already redeemed" });
  });
});

describe("bonusService.applyBonus — expired bonus", () => {
  it("throws on expired bonus", async () => {
    const user = await makeUser();
    await Wallet.create({ userId: user._id, balance: 0 });
    const bonus = await makeBonus({
      fixedAmount: 50,
      endDate: new Date(Date.now() - 1000), // already expired
    });

    await expect(bonusService.applyBonus(user._id, bonus.code, 0))
      .rejects.toMatchObject({ message: "Bonus is expired or not yet valid" });
  });

  it("throws on bonus not yet started", async () => {
    const user = await makeUser();
    await Wallet.create({ userId: user._id, balance: 0 });
    const bonus = await makeBonus({
      fixedAmount: 50,
      startDate: new Date(Date.now() + 86400000), // tomorrow
    });

    await expect(bonusService.applyBonus(user._id, bonus.code, 0))
      .rejects.toMatchObject({ message: "Bonus is expired or not yet valid" });
  });
});

describe("bonusService.applyBonus — maxRedemptions", () => {
  it("throws when redemption limit reached", async () => {
    const user1 = await makeUser();
    const user2 = await makeUser();
    await Wallet.create({ userId: user1._id, balance: 0 });
    await Wallet.create({ userId: user2._id, balance: 0 });

    const bonus = await makeBonus({ fixedAmount: 50, maxRedemptions: 1 });

    await bonusService.applyBonus(user1._id, bonus.code, 0);

    await expect(bonusService.applyBonus(user2._id, bonus.code, 0))
      .rejects.toMatchObject({ message: "Bonus redemption limit reached" });
  });
});

describe("bonusService.applyBonus — minDeposit", () => {
  it("throws if deposit below minDeposit", async () => {
    const user = await makeUser();
    await Wallet.create({ userId: user._id, balance: 0 });
    const bonus = await makeBonus({ fixedAmount: 50, minDeposit: 500 });

    await expect(bonusService.applyBonus(user._id, bonus.code, 100))
      .rejects.toMatchObject({ message: /Minimum deposit/ });
  });
});

describe("bonusService.applyBonus — inactive bonus", () => {
  it("throws on inactive bonus", async () => {
    const user = await makeUser();
    await Wallet.create({ userId: user._id, balance: 0 });
    const bonus = await makeBonus({ fixedAmount: 50, status: "inactive" });

    await expect(bonusService.applyBonus(user._id, bonus.code, 0))
      .rejects.toMatchObject({ message: "Bonus is not active" });
  });
});
