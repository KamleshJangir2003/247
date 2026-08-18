const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryReplSet } = require("mongodb-memory-server");
const app = require("../src/app");

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
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

// ─── Helpers ────────────────────────────────────────────────────────────────

const BASE = "/api/v1";

async function registerUser(overrides = {}) {
  const defaults = {
    firstName: "Test",
    username: `user_${Date.now()}_${Math.random().toString(36).slice(2)}`,
    email: `test_${Date.now()}_${Math.random().toString(36).slice(2)}@example.com`,
    password: "password123",
  };
  const body = { ...defaults, ...overrides };
  const res = await request(app).post(`${BASE}/auth/register`).send(body);
  return { res, body };
}

async function loginUser(username, password) {
  return request(app).post(`${BASE}/auth/login`).send({ username, password });
}

async function seedRole(role) {
  const User = mongoose.model("User");
  const Wallet = mongoose.model("Wallet");
  const { hash } = require("../src/utils/password");
  const username = `${role.toLowerCase()}_${Date.now()}`;
  const email = `${username}@example.com`;
  const passwordHash = await hash("password123");
  const user = await User.create({ firstName: role, username, email, passwordHash, role });
  await Wallet.create({ userId: user._id });
  return { user, username, password: "password123" };
}

// ─── Auth Tests ──────────────────────────────────────────────────────────────

describe("POST /auth/register", () => {
  it("registers a new user and returns 201", async () => {
    const { res } = await registerUser();
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.role).toBe("USER");
  });

  it("returns 409 when username/email already taken", async () => {
    const { body } = await registerUser();
    const res2 = await request(app).post(`${BASE}/auth/register`).send(body);
    expect(res2.status).toBe(409);
  });
});

describe("POST /auth/login", () => {
  it("logs in with valid credentials and returns tokens", async () => {
    const { body } = await registerUser();
    const res = await loginUser(body.username, body.password);
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty("accessToken");
    expect(res.body.data).toHaveProperty("refreshToken");
  });

  it("returns 401 for invalid password", async () => {
    const { body } = await registerUser();
    const res = await loginUser(body.username, "wrongpassword");
    expect(res.status).toBe(401);
  });

  it("returns 401 for non-existent user", async () => {
    const res = await loginUser("ghost_user_xyz", "password123");
    expect(res.status).toBe(401);
  });
});

describe("GET /auth/me — JWT guard", () => {
  it("returns 401 when no JWT is provided", async () => {
    const res = await request(app).get(`${BASE}/auth/me`);
    expect(res.status).toBe(401);
  });

  it("returns 401 for an invalid/malformed JWT", async () => {
    const res = await request(app)
      .get(`${BASE}/auth/me`)
      .set("Authorization", "Bearer this.is.not.valid");
    expect(res.status).toBe(401);
  });

  it("returns 200 with a valid JWT", async () => {
    const { body } = await registerUser();
    const loginRes = await loginUser(body.username, body.password);
    const { accessToken } = loginRes.body.data;
    const res = await request(app)
      .get(`${BASE}/auth/me`)
      .set("Authorization", `Bearer ${accessToken}`);
    expect(res.status).toBe(200);
    expect(res.body.data.user.username).toBe(body.username);
  });
});

// ─── Role Access Tests ───────────────────────────────────────────────────────

describe("Role-based access control", () => {
  it("ADMIN can access /admin/dashboard", async () => {
    const { username, password } = await seedRole("ADMIN");
    const { body: { data: { accessToken } } } = await loginUser(username, password);
    const res = await request(app)
      .get(`${BASE}/admin/dashboard`)
      .set("Authorization", `Bearer ${accessToken}`);
    expect(res.status).toBe(200);
  });

  it("MASTER can access /master/agents", async () => {
    const { username, password } = await seedRole("MASTER");
    const { body: { data: { accessToken } } } = await loginUser(username, password);
    const res = await request(app)
      .get(`${BASE}/master/agents`)
      .set("Authorization", `Bearer ${accessToken}`);
    expect(res.status).toBe(200);
  });

  it("AGENT can access /agent/users", async () => {
    const { username, password } = await seedRole("AGENT");
    const { body: { data: { accessToken } } } = await loginUser(username, password);
    const res = await request(app)
      .get(`${BASE}/agent/users`)
      .set("Authorization", `Bearer ${accessToken}`);
    expect(res.status).toBe(200);
  });

  it("USER can access /auth/me", async () => {
    const { body } = await registerUser();
    const { body: { data: { accessToken } } } = await loginUser(body.username, body.password);
    const res = await request(app)
      .get(`${BASE}/auth/me`)
      .set("Authorization", `Bearer ${accessToken}`);
    expect(res.status).toBe(200);
  });

  it("USER is forbidden from /admin/dashboard (403)", async () => {
    const { body } = await registerUser();
    const { body: { data: { accessToken } } } = await loginUser(body.username, body.password);
    const res = await request(app)
      .get(`${BASE}/admin/dashboard`)
      .set("Authorization", `Bearer ${accessToken}`);
    expect(res.status).toBe(403);
  });
});
