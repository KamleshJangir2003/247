/**
 * tests/financial.integration.test.js
 * Integration tests for Master/Agent financial endpoints and agent report.
 */

const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryReplSet } = require("mongodb-memory-server");
const app = require("../src/app");

let mongod;

beforeAll(async () => {
  mongod = await MongoMemoryReplSet.create({ replSet: { count: 1 } });
  await mongoose.connect(mongod.getUri());
  await new Promise((r) => setTimeout(r, 500));
}, 60000);

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

afterEach(async () => {
  const cols = mongoose.connection.collections;
  for (const key in cols) await cols[key].deleteMany({});
});

const BASE = "/api/v1";
const User   = () => mongoose.model("User");
const Wallet = () => mongoose.model("Wallet");

async function seedUser(role, parentId = null, balance = 0) {
  const { hash } = require("../src/utils/password");
  const ts = `${Date.now()}_${Math.random().toString(36).slice(2)}`;
  const username = `${role.toLowerCase()}_${ts}`;
  const email    = `${username}@test.com`;
  const passwordHash = await hash("pass123");
  const user = await User().create({ firstName: role, username, email, passwordHash, role, parentId });
  await Wallet().create({ userId: user._id, balance });
  return { user, username, password: "pass123" };
}

async function login(username, password) {
  const res = await request(app).post(`${BASE}/auth/login`).send({ username, password });
  return res.body.data?.accessToken;
}

async function token(role, parentId = null, balance = 0) {
  const { username, password } = await seedUser(role, parentId, balance);
  return login(username, password);
}

// ─── Agent report ─────────────────────────────────────────────────────────────

describe("GET /agent/report", () => {
  it("returns 200 with report stats for AGENT", async () => {
    const tk = await token("AGENT");
    const res = await request(app).get(`${BASE}/agent/report`).set("Authorization", `Bearer ${tk}`);
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty("totalUsers");
    expect(res.body.data).toHaveProperty("totalDeposits");
    expect(res.body.data).toHaveProperty("totalWithdrawals");
    expect(res.body.data).toHaveProperty("totalTransactions");
    expect(res.body.data).toHaveProperty("totalDepositAmount");
    expect(res.body.data).toHaveProperty("totalWithdrawalAmount");
  });

  it("returns 403 for USER", async () => {
    const { username, password } = await seedUser("USER");
    const tk = await login(username, password);
    const res = await request(app).get(`${BASE}/agent/report`).set("Authorization", `Bearer ${tk}`);
    expect(res.status).toBe(403);
  });
});

// ─── Agent create user ────────────────────────────────────────────────────────

describe("POST /agent/users — create user", () => {
  it("AGENT can create a user under themselves", async () => {
    const { user: agent } = await seedUser("AGENT");
    const agentTk = await login(agent.username, "pass123");
    const ts = Date.now();
    const res = await request(app)
      .post(`${BASE}/agent/users`)
      .set("Authorization", `Bearer ${agentTk}`)
      .send({ firstName: "U", username: `u_${ts}`, email: `u_${ts}@t.com`, password: "pass123" });
    expect(res.status).toBe(201);
    expect(res.body.data.user.role).toBe("USER");
    expect(res.body.data.user.parentId).toBe(agent._id.toString());
  });

  it("returns 409 on duplicate username", async () => {
    const { user: agent } = await seedUser("AGENT");
    const agentTk = await login(agent.username, "pass123");
    const ts = Date.now();
    const body = { firstName: "U", username: `u_dup_${ts}`, email: `u_dup_${ts}@t.com`, password: "pass123" };
    await request(app).post(`${BASE}/agent/users`).set("Authorization", `Bearer ${agentTk}`).send(body);
    const res2 = await request(app).post(`${BASE}/agent/users`).set("Authorization", `Bearer ${agentTk}`).send(body);
    expect(res2.status).toBe(409);
  });

  it("USER cannot create users via agent endpoint", async () => {
    const { username, password } = await seedUser("USER");
    const tk = await login(username, password);
    const ts = Date.now();
    const res = await request(app)
      .post(`${BASE}/agent/users`)
      .set("Authorization", `Bearer ${tk}`)
      .send({ firstName: "X", username: `x_${ts}`, email: `x_${ts}@t.com`, password: "pass123" });
    expect(res.status).toBe(403);
  });
});

// ─── Master financial endpoints with data ─────────────────────────────────────

describe("Master financial endpoints — scoped to hierarchy", () => {
  it("master sees only deposits from their agents' users", async () => {
    const { user: master } = await seedUser("MASTER");
    const masterTk = await login(master.username, "pass123");
    const { user: agent } = await seedUser("AGENT", master._id);
    const { user: usr } = await seedUser("USER", agent._id);

    // Create a deposit for the user
    const Deposit = mongoose.model("Deposit");
    await Deposit.create({ userId: usr._id, amount: 500, status: "PENDING" });

    const res = await request(app)
      .get(`${BASE}/master/deposits`)
      .set("Authorization", `Bearer ${masterTk}`);
    expect(res.status).toBe(200);
    expect(res.body.data.deposits.length).toBe(1);
    expect(res.body.data.deposits[0].amount).toBe(500);
  });

  it("master does NOT see deposits from another master's users", async () => {
    const { user: master1 } = await seedUser("MASTER");
    const { user: master2 } = await seedUser("MASTER");
    const master1Tk = await login(master1.username, "pass123");
    const { user: agent2 } = await seedUser("AGENT", master2._id);
    const { user: usr2 } = await seedUser("USER", agent2._id);

    const Deposit = mongoose.model("Deposit");
    await Deposit.create({ userId: usr2._id, amount: 999, status: "PENDING" });

    const res = await request(app)
      .get(`${BASE}/master/deposits`)
      .set("Authorization", `Bearer ${master1Tk}`);
    expect(res.status).toBe(200);
    expect(res.body.data.deposits.length).toBe(0);
  });
});

// ─── Agent financial endpoints with data ──────────────────────────────────────

describe("Agent financial endpoints — scoped to own users", () => {
  it("agent sees only deposits from their own users", async () => {
    const { user: agent } = await seedUser("AGENT");
    const agentTk = await login(agent.username, "pass123");
    const { user: usr } = await seedUser("USER", agent._id);

    const Deposit = mongoose.model("Deposit");
    await Deposit.create({ userId: usr._id, amount: 200, status: "PENDING" });

    const res = await request(app)
      .get(`${BASE}/agent/deposits`)
      .set("Authorization", `Bearer ${agentTk}`);
    expect(res.status).toBe(200);
    expect(res.body.data.deposits.length).toBe(1);
    expect(res.body.data.deposits[0].amount).toBe(200);
  });

  it("agent does NOT see deposits from another agent's users", async () => {
    const { user: agent1 } = await seedUser("AGENT");
    const { user: agent2 } = await seedUser("AGENT");
    const agent1Tk = await login(agent1.username, "pass123");
    const { user: usr2 } = await seedUser("USER", agent2._id);

    const Deposit = mongoose.model("Deposit");
    await Deposit.create({ userId: usr2._id, amount: 777, status: "PENDING" });

    const res = await request(app)
      .get(`${BASE}/agent/deposits`)
      .set("Authorization", `Bearer ${agent1Tk}`);
    expect(res.status).toBe(200);
    expect(res.body.data.deposits.length).toBe(0);
  });

  it("agent sees their own + users' transactions", async () => {
    const { user: agent } = await seedUser("AGENT", null, 500);
    const agentTk = await login(agent.username, "pass123");
    const { user: usr } = await seedUser("USER", agent._id, 0);

    // Transfer creates TRANSFER_OUT (agent) + TRANSFER_IN (user)
    await request(app)
      .post(`${BASE}/agent/transfer-user`)
      .set("Authorization", `Bearer ${agentTk}`)
      .send({ userId: usr._id, amount: 100 });

    const res = await request(app)
      .get(`${BASE}/agent/transactions`)
      .set("Authorization", `Bearer ${agentTk}`);
    expect(res.status).toBe(200);
    expect(res.body.data.transactions.length).toBeGreaterThanOrEqual(2);
  });
});

// ─── Wallet operations atomicity ──────────────────────────────────────────────

describe("Wallet atomicity and audit trail", () => {
  it("master→agent transfer creates WalletTransaction records", async () => {
    const WalletTransaction = mongoose.model("WalletTransaction");
    const { user: master } = await seedUser("MASTER", null, 1000);
    const masterTk = await login(master.username, "pass123");
    const { user: agent } = await seedUser("AGENT", master._id, 0);

    await request(app)
      .post(`${BASE}/master/transfer-agent`)
      .set("Authorization", `Bearer ${masterTk}`)
      .send({ agentId: agent._id, amount: 400 });

    const outTx = await WalletTransaction.findOne({ userId: master._id, type: "TRANSFER_OUT" });
    const inTx  = await WalletTransaction.findOne({ userId: agent._id,  type: "TRANSFER_IN" });
    expect(outTx).toBeTruthy();
    expect(inTx).toBeTruthy();
    expect(outTx.amount).toBe(400);
    expect(inTx.amount).toBe(400);
  });

  it("master→agent transfer creates AuditLog", async () => {
    const AuditLog = mongoose.model("AuditLog");
    const { user: master } = await seedUser("MASTER", null, 500);
    const masterTk = await login(master.username, "pass123");
    const { user: agent } = await seedUser("AGENT", master._id, 0);

    await request(app)
      .post(`${BASE}/master/transfer-agent`)
      .set("Authorization", `Bearer ${masterTk}`)
      .send({ agentId: agent._id, amount: 100 });

    const log = await AuditLog.findOne({ actor: master._id, action: "CHIPS_TRANSFER" });
    expect(log).toBeTruthy();
    expect(log.metadata.amount).toBe(100);
  });

  it("prevents negative balance on master→agent transfer", async () => {
    const { user: master } = await seedUser("MASTER", null, 10);
    const masterTk = await login(master.username, "pass123");
    const { user: agent } = await seedUser("AGENT", master._id, 0);

    const res = await request(app)
      .post(`${BASE}/master/transfer-agent`)
      .set("Authorization", `Bearer ${masterTk}`)
      .send({ agentId: agent._id, amount: 999 });
    expect(res.status).toBe(400);

    // Balance must be unchanged
    const masterWallet = await Wallet().findOne({ userId: master._id });
    expect(masterWallet.balance).toBe(10);
  });

  it("prevents cross-hierarchy master→agent transfer", async () => {
    const { user: master1 } = await seedUser("MASTER", null, 1000);
    const { user: master2 } = await seedUser("MASTER");
    const master1Tk = await login(master1.username, "pass123");
    const { user: agent } = await seedUser("AGENT", master2._id, 0);

    const res = await request(app)
      .post(`${BASE}/master/transfer-agent`)
      .set("Authorization", `Bearer ${master1Tk}`)
      .send({ agentId: agent._id, amount: 100 });
    expect(res.status).toBe(404);
  });

  it("agent→user debit creates WalletTransaction records", async () => {
    const WalletTransaction = mongoose.model("WalletTransaction");
    const { user: agent } = await seedUser("AGENT", null, 0);
    const agentTk = await login(agent.username, "pass123");
    const { user: usr } = await seedUser("USER", agent._id, 300);

    await request(app)
      .post(`${BASE}/agent/debit-user`)
      .set("Authorization", `Bearer ${agentTk}`)
      .send({ userId: usr._id, amount: 150 });

    const outTx = await WalletTransaction.findOne({ userId: usr._id,   type: "TRANSFER_OUT" });
    const inTx  = await WalletTransaction.findOne({ userId: agent._id, type: "TRANSFER_IN" });
    expect(outTx).toBeTruthy();
    expect(inTx).toBeTruthy();
    expect(outTx.amount).toBe(150);
  });
});

// ─── Unauthorized cross-role access ───────────────────────────────────────────

describe("Unauthorized cross-role access", () => {
  it("USER cannot access /master/deposits", async () => {
    const { username, password } = await seedUser("USER");
    const tk = await login(username, password);
    const res = await request(app).get(`${BASE}/master/deposits`).set("Authorization", `Bearer ${tk}`);
    expect(res.status).toBe(403);
  });

  it("USER cannot access /agent/deposits", async () => {
    const { username, password } = await seedUser("USER");
    const tk = await login(username, password);
    const res = await request(app).get(`${BASE}/agent/deposits`).set("Authorization", `Bearer ${tk}`);
    expect(res.status).toBe(403);
  });

  it("AGENT cannot access /master/transactions", async () => {
    const tk = await token("AGENT");
    const res = await request(app).get(`${BASE}/master/transactions`).set("Authorization", `Bearer ${tk}`);
    expect(res.status).toBe(403);
  });

  it("MASTER cannot access /agent/commissions", async () => {
    const tk = await token("MASTER");
    const res = await request(app).get(`${BASE}/agent/commissions`).set("Authorization", `Bearer ${tk}`);
    expect(res.status).toBe(403);
  });

  it("USER cannot transfer chips via agent endpoint", async () => {
    const { user: agent } = await seedUser("AGENT", null, 500);
    const { user: usr } = await seedUser("USER", agent._id);
    const usrTk = await login(usr.username, "pass123");
    const res = await request(app)
      .post(`${BASE}/agent/transfer-user`)
      .set("Authorization", `Bearer ${usrTk}`)
      .send({ userId: usr._id, amount: 100 });
    expect(res.status).toBe(403);
  });
});
