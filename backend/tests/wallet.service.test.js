/**
 * tests/wallet.service.test.js
 * Unit tests for wallet credit/debit/transfer logic.
 * Uses an in-memory MongoDB via mongodb-memory-server.
 *
 * Install: npm install --save-dev mongodb-memory-server
 * These tests run against a real Mongoose schema — no mocks for DB operations.
 */

const mongoose = require("mongoose");
const { MongoMemoryReplSet } = require("mongodb-memory-server");
const Wallet = require("../src/models/Wallet");
const WalletTransaction = require("../src/models/WalletTransaction");
const walletService = require("../src/services/wallet.service");

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
  await Wallet.deleteMany({});
  await WalletTransaction.deleteMany({});
});

const uid = () => new mongoose.Types.ObjectId();

describe("walletService.credit", () => {
  it("creates wallet and credits balance", async () => {
    const userId = uid();
    await Wallet.create({ userId, balance: 100 });

    const { wallet, transaction } = await walletService.credit(userId, 50, "DEPOSIT", "test", null);

    expect(wallet.balance).toBe(150);
    expect(transaction.balanceBefore).toBe(100);
    expect(transaction.balanceAfter).toBe(150);
    expect(transaction.type).toBe("DEPOSIT");
    expect(transaction.reference).toBeTruthy();
  });

  it("throws if wallet is frozen", async () => {
    const userId = uid();
    await Wallet.create({ userId, balance: 100, status: "frozen" });

    await expect(walletService.credit(userId, 50, "DEPOSIT", "test", null))
      .rejects.toMatchObject({ message: "Wallet not found or frozen" });
  });
});

describe("walletService.debit", () => {
  it("debits balance correctly", async () => {
    const userId = uid();
    await Wallet.create({ userId, balance: 200 });

    const { wallet, transaction } = await walletService.debit(userId, 80, "WITHDRAWAL", "test", null);

    expect(wallet.balance).toBe(120);
    expect(transaction.balanceBefore).toBe(200);
    expect(transaction.balanceAfter).toBe(120);
  });

  it("prevents negative balance", async () => {
    const userId = uid();
    await Wallet.create({ userId, balance: 50 });

    await expect(walletService.debit(userId, 100, "WITHDRAWAL", "test", null))
      .rejects.toMatchObject({ message: "Insufficient balance or wallet unavailable" });
  });

  it("prevents debit on frozen wallet", async () => {
    const userId = uid();
    await Wallet.create({ userId, balance: 500, status: "frozen" });

    await expect(walletService.debit(userId, 100, "WITHDRAWAL", "test", null))
      .rejects.toMatchObject({ message: "Insufficient balance or wallet unavailable" });
  });
});

describe("walletService.transfer", () => {
  it("transfers atomically between two wallets", async () => {
    const senderId = uid();
    const receiverId = uid();
    await Wallet.create({ userId: senderId, balance: 500 });
    await Wallet.create({ userId: receiverId, balance: 100 });

    const { outTx, inTx } = await walletService.transfer(senderId, receiverId, 200, senderId);

    const sender = await Wallet.findOne({ userId: senderId });
    const receiver = await Wallet.findOne({ userId: receiverId });

    expect(sender.balance).toBe(300);
    expect(receiver.balance).toBe(300);
    expect(outTx.type).toBe("TRANSFER_OUT");
    expect(inTx.type).toBe("TRANSFER_IN");
  });

  it("rejects transfer with amount <= 0", async () => {
    const senderId = uid();
    const receiverId = uid();
    await expect(walletService.transfer(senderId, receiverId, 0, senderId))
      .rejects.toMatchObject({ message: "Amount must be greater than 0" });
  });

  it("rolls back if sender has insufficient balance", async () => {
    const senderId = uid();
    const receiverId = uid();
    await Wallet.create({ userId: senderId, balance: 50 });
    await Wallet.create({ userId: receiverId, balance: 0 });

    await expect(walletService.transfer(senderId, receiverId, 200, senderId))
      .rejects.toBeTruthy();

    // Sender balance must be unchanged
    const sender = await Wallet.findOne({ userId: senderId });
    expect(sender.balance).toBe(50);
  });
});
