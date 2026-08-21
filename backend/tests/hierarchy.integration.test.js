/**
 * tests/hierarchy.integration.test.js
 * Integration tests for Master/Agent hierarchy flows, wallet ops, and RBAC.
 */

const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryReplSet } = require("mongodb-memory-server");
const app = require("../src/app");

let mongod;

beforeAll(async () => {
  mongod = await MongoMemoryReplSet.create({ replSet: { count: 1 } });
  await mongoose.connect(mongod.getUri());
  // Wait for replica set to stabilise
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

// ─── Helpers ─────────────────────────────────────────────────────────────────

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

// ─── Master Dashboard ─────────────────────────────────────────────────────────

describe("GET /master/dashboard", () => {
  it("returns 200 with stats for MASTER", async () => {
    const tk = await token("MASTER");
    const res = await request(app).get(`${BASE}/master/dashboard`).set("Authorization", `Bearer ${tk}`);
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty("totalAgents");
    expect(res.body.data).toHaveProperty("totalUsers");
    expect(res.body.data).toHaveProperty("balance");
  });

  it("returns 403 for AGENT", async () => {
    const tk = await token("AGENT");
    const res = await request(app).get(`${BASE}/master/dashboard`).set("Authorization", `Bearer ${tk}`);
    expect(res.status).toBe(403);
  });

  it("returns 403 for USER", async () => {
    const { username, password } = await seedUser("USER");
    const tk = await login(username, password);
    const res = await request(app).get(`${BASE}/master/dashboard`).set("Authorization", `Bearer ${tk}`);
    expect(res.status).toBe(403);
  });
});

// ─── Master → Agent creation ──────────────────────────────────────────────────

describe("POST /master/agents — create agent", () => {
  it("MASTER can create an agent under themselves", async () => {
    const masterTk = await token("MASTER");
    const ts = Date.now();
    const res = await request(app)
      .post(`${BASE}/master/agents`)
      .set("Authorization", `Bearer ${masterTk}`)
      .send({ firstName: "Ag", username: `ag_${ts}`, email: `ag_${ts}@t.com`, password: "pass123" });
    expect(res.status).toBe(201);
    expect(res.body.data.agent.role).toBe("AGENT");
  });

  it("returns 409 on duplicate username", async () => {
    const masterTk = await token("MASTER");
    const ts = Date.now();
    const body = { firstName: "Ag", username: `ag_dup_${ts}`, email: `ag_dup_${ts}@t.com`, password: "pass123" };
    await request(app).post(`${BASE}/master/agents`).set("Authorization", `Bearer ${masterTk}`).send(body);
    const res2 = await request(app).post(`${BASE}/master/agents`).set("Authorization", `Bearer ${masterTk}`).send(body);
    expect(res2.status).toBe(409);
  });

  it("AGENT cannot create agents", async () => {
    const agentTk = await token("AGENT");
    const ts = Date.now();
    const res = await request(app)
      .post(`${BASE}/master/agents`)
      .set("Authorization", `Bearer ${agentTk}`)
      .send({ firstName: "X", username: `x_${ts}`, email: `x_${ts}@t.com`, password: "pass123" });
    expect(res.status).toBe(403);
  });
});

// ─── Master → Agent status toggle ────────────────────────────────────────────

describe("PATCH /master/agents/:id/status", () => {
  it("MASTER can block/unblock their own agent", async () => {
    const { user: master } = await seedUser("MASTER");
    const masterTk = await login(master.username, "pass123");
    const { user: agent } = await seedUser("AGENT", master._id);

    const res = await request(app)
      .patch(`${BASE}/master/agents/${agent._id}/status`)
      .set("Authorization", `Bearer ${masterTk}`)
      .send({ status: "blocked" });
    expect(res.status).toBe(200);
    expect(res.body.data.agent.status).toBe("blocked");
  });

  it("MASTER cannot toggle an agent that belongs to another master", async () => {
    const { user: master1 } = await seedUser("MASTER");
    const { user: master2 } = await seedUser("MASTER");
    const master1Tk = await login(master1.username, "pass123");
    const { user: agent } = await seedUser("AGENT", master2._id);

    const res = await request(app)
      .patch(`${BASE}/master/agents/${agent._id}/status`)
      .set("Authorization", `Bearer ${master1Tk}`)
      .send({ status: "blocked" });
    expect(res.status).toBe(404);
  });
});

// ─── Master wallet transfer to agent ─────────────────────────────────────────

describe("POST /master/transfer-agent", () => {
  it("transfers chips from master to their agent atomically", async () => {
    const { user: master } = await seedUser("MASTER", null, 1000);
    const masterTk = await login(master.username, "pass123");
    const { user: agent } = await seedUser("AGENT", master._id, 0);

    const res = await request(app)
      .post(`${BASE}/master/transfer-agent`)
      .set("Authorization", `Bearer ${masterTk}`)
      .send({ agentId: agent._id, amount: 300 });
    expect(res.status).toBe(200);

    const masterWallet = await Wallet().findOne({ userId: master._id });
    const agentWallet  = await Wallet().findOne({ userId: agent._id });
    expect(masterWallet.balance).toBe(700);
    expect(agentWallet.balance).toBe(300);
  });

  it("fails if master has insufficient balance", async () => {
    const { user: master } = await seedUser("MASTER", null, 50);
    const masterTk = await login(master.username, "pass123");
    const { user: agent } = await seedUser("AGENT", master._id, 0);

    const res = await request(app)
      .post(`${BASE}/master/transfer-agent`)
      .set("Authorization", `Bearer ${masterTk}`)
      .send({ agentId: agent._id, amount: 500 });
    expect(res.status).toBe(400);
  });

  it("MASTER cannot transfer to an agent outside their hierarchy", async () => {
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
});

// ─── Master debit from agent ──────────────────────────────────────────────────

describe("POST /master/debit-agent", () => {
  it("debits chips from agent back to master", async () => {
    const { user: master } = await seedUser("MASTER", null, 0);
    const masterTk = await login(master.username, "pass123");
    const { user: agent } = await seedUser("AGENT", master._id, 500);

    const res = await request(app)
      .post(`${BASE}/master/debit-agent`)
      .set("Authorization", `Bearer ${masterTk}`)
      .send({ agentId: agent._id, amount: 200 });
    expect(res.status).toBe(200);

    const masterWallet = await Wallet().findOne({ userId: master._id });
    const agentWallet  = await Wallet().findOne({ userId: agent._id });
    expect(masterWallet.balance).toBe(200);
    expect(agentWallet.balance).toBe(300);
  });

  it("fails if agent has insufficient balance", async () => {
    const { user: master } = await seedUser("MASTER", null, 0);
    const masterTk = await login(master.username, "pass123");
    const { user: agent } = await seedUser("AGENT", master._id, 10);

    const res = await request(app)
      .post(`${BASE}/master/debit-agent`)
      .set("Authorization", `Bearer ${masterTk}`)
      .send({ agentId: agent._id, amount: 500 });
    expect(res.status).toBe(400);
  });
});

// ─── Agent Dashboard ──────────────────────────────────────────────────────────

describe("GET /agent/dashboard", () => {
  it("returns 200 with stats for AGENT", async () => {
    const tk = await token("AGENT");
    const res = await request(app).get(`${BASE}/agent/dashboard`).set("Authorization", `Bearer ${tk}`);
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty("totalUsers");
    expect(res.body.data).toHaveProperty("balance");
  });

  it("returns 403 for USER", async () => {
    const { username, password } = await seedUser("USER");
    const tk = await login(username, password);
    const res = await request(app).get(`${BASE}/agent/dashboard`).set("Authorization", `Bearer ${tk}`);
    expect(res.status).toBe(403);
  });
});

// ─── Agent → User status toggle ───────────────────────────────────────────────

describe("PATCH /agent/users/:id/status", () => {
  it("AGENT can block their own user", async () => {
    const { user: agent } = await seedUser("AGENT");
    const agentTk = await login(agent.username, "pass123");
    const { user: usr } = await seedUser("USER", agent._id);

    const res = await request(app)
      .patch(`${BASE}/agent/users/${usr._id}/status`)
      .set("Authorization", `Bearer ${agentTk}`)
      .send({ status: "blocked" });
    expect(res.status).toBe(200);
    expect(res.body.data.user.status).toBe("blocked");
  });

  it("AGENT cannot toggle a user belonging to another agent", async () => {
    const { user: agent1 } = await seedUser("AGENT");
    const { user: agent2 } = await seedUser("AGENT");
    const agent1Tk = await login(agent1.username, "pass123");
    const { user: usr } = await seedUser("USER", agent2._id);

    const res = await request(app)
      .patch(`${BASE}/agent/users/${usr._id}/status`)
      .set("Authorization", `Bearer ${agent1Tk}`)
      .send({ status: "blocked" });
    expect(res.status).toBe(404);
  });
});

// ─── Agent → User chip transfer ───────────────────────────────────────────────

describe("POST /agent/transfer-user", () => {
  it("transfers chips from agent to their user atomically", async () => {
    const { user: agent } = await seedUser("AGENT", null, 500);
    const agentTk = await login(agent.username, "pass123");
    const { user: usr } = await seedUser("USER", agent._id, 0);

    const res = await request(app)
      .post(`${BASE}/agent/transfer-user`)
      .set("Authorization", `Bearer ${agentTk}`)
      .send({ userId: usr._id, amount: 150 });
    expect(res.status).toBe(200);

    const agentWallet = await Wallet().findOne({ userId: agent._id });
    const userWallet  = await Wallet().findOne({ userId: usr._id });
    expect(agentWallet.balance).toBe(350);
    expect(userWallet.balance).toBe(150);
  });

  it("AGENT cannot transfer to a user outside their hierarchy", async () => {
    const { user: agent1 } = await seedUser("AGENT", null, 500);
    const { user: agent2 } = await seedUser("AGENT");
    const agent1Tk = await login(agent1.username, "pass123");
    const { user: usr } = await seedUser("USER", agent2._id, 0);

    const res = await request(app)
      .post(`${BASE}/agent/transfer-user`)
      .set("Authorization", `Bearer ${agent1Tk}`)
      .send({ userId: usr._id, amount: 100 });
    expect(res.status).toBe(404);
  });
});

// ─── Agent debit from user ────────────────────────────────────────────────────

describe("POST /agent/debit-user", () => {
  it("debits chips from user back to agent", async () => {
    const { user: agent } = await seedUser("AGENT", null, 0);
    const agentTk = await login(agent.username, "pass123");
    const { user: usr } = await seedUser("USER", agent._id, 400);

    const res = await request(app)
      .post(`${BASE}/agent/debit-user`)
      .set("Authorization", `Bearer ${agentTk}`)
      .send({ userId: usr._id, amount: 100 });
    expect(res.status).toBe(200);

    const agentWallet = await Wallet().findOne({ userId: agent._id });
    const userWallet  = await Wallet().findOne({ userId: usr._id });
    expect(agentWallet.balance).toBe(100);
    expect(userWallet.balance).toBe(300);
  });
});

// ─── WalletTransaction + AuditLog creation ───────────────────────────────────

describe("Wallet transaction and audit log creation on transfer", () => {
  it("creates TRANSFER_OUT and TRANSFER_IN wallet transactions", async () => {
    const WalletTransaction = mongoose.model("WalletTransaction");
    const { user: agent } = await seedUser("AGENT", null, 1000);
    const agentTk = await login(agent.username, "pass123");
    const { user: usr } = await seedUser("USER", agent._id, 0);

    await request(app)
      .post(`${BASE}/agent/transfer-user`)
      .set("Authorization", `Bearer ${agentTk}`)
      .send({ userId: usr._id, amount: 200 });

    const outTx = await WalletTransaction.findOne({ userId: agent._id, type: "TRANSFER_OUT" });
    const inTx  = await WalletTransaction.findOne({ userId: usr._id,   type: "TRANSFER_IN" });
    expect(outTx).toBeTruthy();
    expect(inTx).toBeTruthy();
    expect(outTx.amount).toBe(200);
    expect(inTx.amount).toBe(200);
  });

  it("creates AuditLog on agent→user transfer", async () => {
    const AuditLog = mongoose.model("AuditLog");
    const { user: agent } = await seedUser("AGENT", null, 500);
    const agentTk = await login(agent.username, "pass123");
    const { user: usr } = await seedUser("USER", agent._id, 0);

    await request(app)
      .post(`${BASE}/agent/transfer-user`)
      .set("Authorization", `Bearer ${agentTk}`)
      .send({ userId: usr._id, amount: 50 });

    const log = await AuditLog.findOne({ actor: agent._id, action: "CHIPS_TRANSFER" });
    expect(log).toBeTruthy();
    expect(log.metadata.amount).toBe(50);
  });
});

// ─── Role hierarchy enforcement (ALLOWED_CREATE) ────────────────────────────

describe("Role hierarchy — ALLOWED_CREATE enforcement", () => {
  it("MASTER cannot directly create a USER (must go via AGENT)", async () => {
    const masterTk = await token("MASTER");
    const ts = Date.now();
    const res = await request(app)
      .post(`${BASE}/users`)
      .set("Authorization", `Bearer ${masterTk}`)
      .send({ firstName: "U", username: `u_${ts}`, email: `u_${ts}@t.com`, password: "pass123", role: "USER" });
    expect(res.status).toBe(403);
  });

  it("MASTER cannot create another MASTER", async () => {
    const masterTk = await token("MASTER");
    const ts = Date.now();
    const res = await request(app)
      .post(`${BASE}/users`)
      .set("Authorization", `Bearer ${masterTk}`)
      .send({ firstName: "M", username: `m_${ts}`, email: `m_${ts}@t.com`, password: "pass123", role: "MASTER" });
    expect(res.status).toBe(403);
  });

  it("AGENT cannot create a MASTER", async () => {
    const agentTk = await token("AGENT");
    const ts = Date.now();
    const res = await request(app)
      .post(`${BASE}/users`)
      .set("Authorization", `Bearer ${agentTk}`)
      .send({ firstName: "M", username: `m_${ts}`, email: `m_${ts}@t.com`, password: "pass123", role: "MASTER" });
    expect(res.status).toBe(403);
  });

  it("AGENT cannot create another AGENT", async () => {
    const agentTk = await token("AGENT");
    const ts = Date.now();
    const res = await request(app)
      .post(`${BASE}/users`)
      .set("Authorization", `Bearer ${agentTk}`)
      .send({ firstName: "A", username: `a_${ts}`, email: `a_${ts}@t.com`, password: "pass123", role: "AGENT" });
    expect(res.status).toBe(403);
  });

  it("AGENT can create a USER", async () => {
    const agentTk = await token("AGENT");
    const ts = Date.now();
    const res = await request(app)
      .post(`${BASE}/users`)
      .set("Authorization", `Bearer ${agentTk}`)
      .send({ firstName: "U", username: `u_${ts}`, email: `u_${ts}@t.com`, password: "pass123", role: "USER" });
    expect(res.status).toBe(201);
  });

  it("MASTER can create an AGENT via /users", async () => {
    const masterTk = await token("MASTER");
    const ts = Date.now();
    const res = await request(app)
      .post(`${BASE}/users`)
      .set("Authorization", `Bearer ${masterTk}`)
      .send({ firstName: "A", username: `a_${ts}`, email: `a_${ts}@t.com`, password: "pass123", role: "AGENT" });
    expect(res.status).toBe(201);
  });
});

// ─── Public registration security ────────────────────────────────────────────

describe("Public registration — role escalation prevention", () => {
  it("always registers as USER regardless of role in body", async () => {
    const ts = Date.now();
    const res = await request(app)
      .post(`${BASE}/auth/register`)
      .send({ firstName: "X", username: `x_${ts}`, email: `x_${ts}@t.com`, password: "pass123", role: "SUPER_ADMIN" });
    expect(res.status).toBe(201);
    expect(res.body.data.user.role).toBe("USER");
  });

  it("cannot register as MASTER via public endpoint", async () => {
    const ts = Date.now();
    const res = await request(app)
      .post(`${BASE}/auth/register`)
      .send({ firstName: "X", username: `x2_${ts}`, email: `x2_${ts}@t.com`, password: "pass123", role: "MASTER" });
    expect(res.status).toBe(201);
    expect(res.body.data.user.role).toBe("USER");
  });

  it("cannot register as AGENT via public endpoint", async () => {
    const ts = Date.now();
    const res = await request(app)
      .post(`${BASE}/auth/register`)
      .send({ firstName: "X", username: `x3_${ts}`, email: `x3_${ts}@t.com`, password: "pass123", role: "AGENT" });
    expect(res.status).toBe(201);
    expect(res.body.data.user.role).toBe("USER");
  });
});

// ─── Cross-role RBAC ──────────────────────────────────────────────────────────

describe("Cross-role RBAC enforcement", () => {
  it("USER cannot access /master/agents", async () => {
    const { username, password } = await seedUser("USER");
    const tk = await login(username, password);
    const res = await request(app).get(`${BASE}/master/agents`).set("Authorization", `Bearer ${tk}`);
    expect(res.status).toBe(403);
  });

  it("USER cannot access /agent/users", async () => {
    const { username, password } = await seedUser("USER");
    const tk = await login(username, password);
    const res = await request(app).get(`${BASE}/agent/users`).set("Authorization", `Bearer ${tk}`);
    expect(res.status).toBe(403);
  });

  it("AGENT cannot access /master/dashboard", async () => {
    const tk = await token("AGENT");
    const res = await request(app).get(`${BASE}/master/dashboard`).set("Authorization", `Bearer ${tk}`);
    expect(res.status).toBe(403);
  });

  it("MASTER cannot access /admin/dashboard", async () => {
    const tk = await token("MASTER");
    const res = await request(app).get(`${BASE}/admin/dashboard`).set("Authorization", `Bearer ${tk}`);
    expect(res.status).toBe(403);
  });

  it("unauthenticated request returns 401", async () => {
    const res = await request(app).get(`${BASE}/master/dashboard`);
    expect(res.status).toBe(401);
  });
});

// ─── Master financial views ───────────────────────────────────────────────────

describe("Master financial endpoints", () => {
  it("GET /master/deposits returns 200", async () => {
    const tk = await token("MASTER");
    const res = await request(app).get(`${BASE}/master/deposits`).set("Authorization", `Bearer ${tk}`);
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty("deposits");
  });

  it("GET /master/withdrawals returns 200", async () => {
    const tk = await token("MASTER");
    const res = await request(app).get(`${BASE}/master/withdrawals`).set("Authorization", `Bearer ${tk}`);
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty("withdrawals");
  });

  it("GET /master/transactions returns 200", async () => {
    const tk = await token("MASTER");
    const res = await request(app).get(`${BASE}/master/transactions`).set("Authorization", `Bearer ${tk}`);
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty("transactions");
  });

  it("GET /master/commissions returns 200", async () => {
    const tk = await token("MASTER");
    const res = await request(app).get(`${BASE}/master/commissions`).set("Authorization", `Bearer ${tk}`);
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty("commissions");
  });

  it("GET /master/report returns 200", async () => {
    const tk = await token("MASTER");
    const res = await request(app).get(`${BASE}/master/report`).set("Authorization", `Bearer ${tk}`);
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty("totalAgents");
  });
});

// ─── Agent financial views ────────────────────────────────────────────────────

describe("Agent financial endpoints", () => {
  it("GET /agent/deposits returns 200", async () => {
    const tk = await token("AGENT");
    const res = await request(app).get(`${BASE}/agent/deposits`).set("Authorization", `Bearer ${tk}`);
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty("deposits");
  });

  it("GET /agent/withdrawals returns 200", async () => {
    const tk = await token("AGENT");
    const res = await request(app).get(`${BASE}/agent/withdrawals`).set("Authorization", `Bearer ${tk}`);
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty("withdrawals");
  });

  it("GET /agent/transactions returns 200", async () => {
    const tk = await token("AGENT");
    const res = await request(app).get(`${BASE}/agent/transactions`).set("Authorization", `Bearer ${tk}`);
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty("transactions");
  });

  it("GET /agent/commissions returns 200", async () => {
    const tk = await token("AGENT");
    const res = await request(app).get(`${BASE}/agent/commissions`).set("Authorization", `Bearer ${tk}`);
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty("commissions");
  });
});
