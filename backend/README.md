# 777Games Backend API

Production-ready REST API for the 777Games platform built with Node.js, Express, MongoDB, and JWT.

---

## 1. Architecture

```
backend/
├── src/
│   ├── config/         # DB connection, env validation
│   ├── controllers/    # Thin request handlers
│   ├── middleware/     # Auth, RBAC, validation, rate-limit, error
│   ├── models/         # Mongoose schemas
│   ├── routes/         # Express routers
│   ├── services/       # All business logic
│   ├── utils/          # JWT, password, response, logger
│   ├── validators/     # express-validator rule sets
│   ├── app.js          # Express app setup
│   ├── server.js       # Entry point
│   └── seed.js         # Dev seed script
```

---

## 2. Installation

```bash
cd backend
npm install
```

---

## 3. Environment Setup

Copy `.env.example` to `.env` and fill in all values:

```bash
cp .env.example .env
```

| Variable | Description |
|---|---|
| PORT | Server port (default 5000) |
| MONGO_URI | MongoDB connection string |
| JWT_ACCESS_SECRET | Secret for access tokens |
| JWT_REFRESH_SECRET | Secret for refresh tokens |
| JWT_ACCESS_EXPIRES | Access token TTL (e.g. 15m) |
| JWT_REFRESH_EXPIRES | Refresh token TTL (e.g. 7d) |
| CLIENT_URL | Frontend origin for CORS |
| NODE_ENV | development / production |
| BCRYPT_ROUNDS | bcrypt cost factor (default 12) |

---

## 4. MongoDB Setup

- Install MongoDB locally or use MongoDB Atlas.
- Set `MONGO_URI` in `.env`.
- The app creates collections automatically via Mongoose.

---

## 5. Development Commands

```bash
npm run dev    # Start with nodemon (auto-reload)
npm start      # Start without nodemon
npm run seed   # Seed dev users, roles, permissions
```

---

## 6. API Structure

All endpoints are prefixed with `/api/v1/`.

| Prefix | Description |
|---|---|
| /auth | Authentication |
| /users | User management |
| /games | Game catalog |
| /providers | Game providers |
| /wallet | Wallet & transfers |
| /deposits | Deposit requests |
| /withdrawals | Withdrawal requests |
| /transactions | Wallet transaction ledger |
| /bonuses | Bonus management |
| /admin | Admin dashboard & audit logs |
| /master | Master hierarchy views |
| /agent | Agent hierarchy views |
| /reports | Reporting endpoints |
| /health | Health check |

---

## 7. Authentication

- POST `/api/v1/auth/register` — Register new user
- POST `/api/v1/auth/login` — Login, returns accessToken + refreshToken
- POST `/api/v1/auth/logout` — Invalidate refresh token
- POST `/api/v1/auth/refresh` — Get new access token using refresh token
- GET  `/api/v1/auth/me` — Get current user profile
- POST `/api/v1/auth/change-password` — Change password

Access tokens expire per `JWT_ACCESS_EXPIRES`. Send as `Authorization: Bearer <token>`.

---

## 8. Roles

| Role | Level |
|---|---|
| SUPER_ADMIN | 5 |
| ADMIN | 4 |
| MASTER | 3 |
| AGENT | 2 |
| USER | 1 |

---

## 9. Permissions

```
users.view / users.create / users.update / users.block
games.view / games.create / games.update / games.delete
deposits.view / deposits.approve / deposits.reject
withdrawals.view / withdrawals.approve / withdrawals.reject
transactions.view
reports.view
masters.manage / agents.manage
settings.manage
```

SUPER_ADMIN bypasses all permission checks.

---

## 10. User Hierarchy

```
SUPER_ADMIN
    └── ADMIN
          └── MASTER
                └── AGENT
                      └── USER
```

- `parentId` on each User document tracks the hierarchy.
- MASTER can only access its own Agents and their Users.
- AGENT can only access its own Users.
- Cross-hierarchy access is blocked at the service layer.

---

## 11. Wallet Architecture

- Every user gets a Wallet document on creation.
- Balance is never modified directly from controllers.
- All changes go through `wallet.service.js` (credit / debit).
- Atomic MongoDB `$inc` with balance floor check prevents overdraft.
- MongoDB sessions/transactions used for transfers.

---

## 12. Transaction Ledger

Every balance change creates a `WalletTransaction` record with:
- `balanceBefore` and `balanceAfter`
- Unique `reference` (UUID)
- `type`: DEPOSIT, WITHDRAWAL, GAME_DEBIT, GAME_WIN, BONUS, COMMISSION, TRANSFER_IN, TRANSFER_OUT, REFUND, ADJUSTMENT

Transfers create two records: TRANSFER_OUT (sender) + TRANSFER_IN (receiver).

---

## 13. Game Architecture

- `Game` model supports all frontend categories: Lottery, Sports, Exchange, Live Casino, Slot, Fantasy, Crash.
- `Provider` model tracks game providers.
- `gameProvider.service.js` contains placeholder interfaces for future real provider SDK integration.
- Games and providers are publicly readable; management requires authentication + permissions.

---

## 14. Future Payment Integration

`deposit.service.js` and `withdrawal.service.js` contain placeholder gateway hooks.
To integrate a real payment gateway:
1. Add gateway credentials to `.env`.
2. Implement the gateway call in the service before creating the DB record.
3. Handle gateway callbacks via a new `/api/v1/payments/callback` route.

---

## 15. Future Game-Provider Integration

`gameProvider.service.js` exposes three placeholder functions:
- `launchGame(gameSlug, userId, providerSlug)` — returns a launch URL
- `fetchProviderGames(providerSlug)` — syncs game catalog from provider API
- `handleProviderCallback(payload)` — processes win/loss results and updates wallet

Replace the placeholder bodies with real provider SDK calls (e.g. Evolution, Pragmatic Play, JILI).
