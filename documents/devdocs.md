# Developer Documentation — TrustBallot (Secure & Transparent Electronic Voting System)

> **Stack:** Node.js 20 · Express · PostgreSQL 15 · React 19 / Vite · Vitest · GitHub Actions

---

## Table of Contents

1. [Project Structure](#1-project-structure)
2. [Environment Setup](#2-environment-setup)
3. [Running the System](#3-running-the-system)
4. [Database Schema](#4-database-schema)
5. [Backend API Reference](#5-backend-api-reference)
   - [Health & Public](#51-health--public)
   - [Authentication — Admin](#52-authentication--admin)
   - [Authentication — Voter](#53-authentication--voter)
   - [Election Management](#54-election-management)
   - [Candidate Management](#55-candidate-management)
   - [Constituency Management](#56-constituency-management)
   - [Voter Registration Management](#57-voter-registration-management)
   - [Voting & Ledger](#58-voting--ledger)
   - [Audit & Blockchain Integrity](#59-audit--blockchain-integrity)
   - [Observer / Auditor](#510-observer--auditor)
   - [Fraud Detection](#511-fraud-detection)
   - [System Admin](#512-system-admin)
   - [Support Tickets](#513-support-tickets)
   - [P2P / Node Discovery](#514-p2p--node-discovery)
   - [AI / Face Detection](#515-ai--face-detection)
   - [Testing / Demo Endpoints](#516-testingdemo-endpoints)
6. [Services](#6-services)
7. [Middleware](#7-middleware)
8. [Test Suite](#8-test-suite)
9. [CI/CD Pipeline](#9-cicd-pipeline)
10. [Security Model](#10-security-model)

---

## 1. Project Structure

```
SWE/
├── orchestration/                  ← Mono-root: scripts, CI workflow
│   ├── .github/workflows/ci.yml   ← Master GitHub Actions pipeline
│   └── package.json               ← npm run dev:all / test:all / build:all
│
├── backend-api/                    ← Node.js / Express REST API (port 5000)
│   ├── index.js                   ← Entry point, DB init, session tables
│   ├── app.js                     ← All routes & middleware (~3000 lines)
│   ├── config/db.js               ← PostgreSQL pool + checkDbConnection()
│   ├── models/                    ← Table definitions (one file per entity)
│   ├── services/                  ← BlockchainService, SmartContract, etc.
│   ├── middleware/authMiddleware.js
│   ├── utils/                     ← fraudEngine, encryption_keys, authService, faceService
│   ├── scripts/                   ← seed_production.js, init_db_for_ci.js
│   ├── ai_modules/                ← TensorFlow.js fraud detection models
│   └── tests/                     ← Vitest test suite (18 files)
│
├── project-election-admin/         ← React/Vite  → localhost:5173
├── project-voter/                  ← React/Vite  → localhost:5174
├── project-observer/               ← React/Vite  → localhost:5175
├── project-sys-admin/              ← React/Vite  → localhost:5176
├── project-voter-registration/     ← React/Vite  → localhost:5177
└── project-reg-obs-app/            ← Expo / React Native (mobile)
```

---

## 2. Environment Setup

### Prerequisites

| Tool | Version |
|---|---|
| Node.js | 20+ |
| PostgreSQL | 15+ |
| Git | any |
| Expo CLI *(optional, mobile only)* | latest |

### `backend-api/.env`

```env
# --- Database ---
DB_USER=postgres
DB_HOST=localhost
DB_NAME=trustballot
DB_PASSWORD=your_password
DB_PORT=5432

# --- Auth ---
JWT_SECRET=your_super_secret_jwt_key_min_32_chars

# --- Email OTP (optional) ---
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# --- SMS OTP via Twilio (optional) ---
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890

# --- Auditor Export ---
AUDITOR_EXPORT_KEY=eci_secure_export_key_2026
```

> **Never commit `.env`** — it is git-ignored by default.

### Install & Initialise

```bash
# 1. Install all workspace dependencies
cd orchestration
npm run install:all

# 2. Initialise the database (creates all tables + seeds admin)
cd ../backend-api
node scripts/init_db_for_ci.js
```

---

## 3. Running the System

From the `orchestration/` directory:

```bash
# Start everything concurrently
npm run dev:all

# Backend + Election Admin only
npm run dev:admin

# Individual services
npm run backend       # :5000
npm run admin         # :5173
npm run voter         # :5174
npm run observer      # :5175
npm run sysadmin      # :5176
npm run registration  # :5177
npm run reg-obs       # Expo web
```

| Service | URL |
|---|---|
| Backend API | http://localhost:5000 |
| Election Admin | http://localhost:5173 |
| Voter Portal | http://localhost:5174 |
| Observer Portal | http://localhost:5175 |
| System Admin | http://localhost:5176 |
| Voter Registration | http://localhost:5177 |

---

## 4. Database Schema

Tables auto-created on server start via `index.js`.

| Table | Key Columns | Notes |
|---|---|---|
| `voters` | `id`, `mobile` (UNIQUE), `name`, `face_descriptor`, `is_voted`, `is_token_issued`, `nfc_tag_id` | Core voter identity |
| `voter_registration_auth` | `id`, `mobile`, `email`, `password_hash` | Voter portal login credentials |
| `voter_sessions` | `session_id` UUID, `voter_id → voters(mobile)`, `token_hash`, `device_hash`, `ip_address`, `expires_at` | JWT session tracking |
| `admins` | `id`, `username`, `email`, `password`, `role`, `otp`, `otp_expires_at` | Election / SysAdmin staff |
| `admin_sessions` | Same shape as `voter_sessions`, refs `admins(id)` | |
| `sys_admins` | `id`, `username`, `password_hash`, `role=SYSADMIN` | |
| `sysadmin_sessions` | Same shape, refs `sys_admins(id)` | |
| `observers` | `id`, `mobile_number`, `password`, `name` | Seeded at startup |
| `observer_sessions` | Same shape, refs `observers(id)` | |
| `votes` | `id`, `voter_id`, `candidate_id` (Paillier-encrypted), `constituency`, `transaction_hash`, `prev_hash` | Blockchain ledger |
| `candidates` | `id`, `name`, `party`, `constituency`, `symbol` | |
| `constituencies` | `id`, `name`, `state` | |
| `elections` | `id`, `phase`, `is_kill_switch_active` | Single-row state machine |
| `election_history` | `id`, `results_json`, `total_votes`, `archived_at` | Archived results |
| `electoral_roll` | `id`, `name`, `aadhaar`, `constituency`, `dob` | National citizen DB |
| `voter_registrations` | `id`, `aadhaar`, `status` (pending/approved/rejected), `reason` | Applications |
| `recovery_requests` | `id`, `voter_id`, `status` | Account recovery |
| `support_tickets` | `id`, `subject`, `message`, `status` | Help desk |
| `logs` | `id`, `event`, `user_id`, `details` JSONB, `ip_address`, `created_at` | Audit log |
| `blockchain` | (managed by `BlockchainService`) | Internal chain state |
| `off_chain_storage` | `id`, `reference_hash`, `payload` | Heavy crypto artifacts |
| `mempool` | (managed by `MempoolService`) | Pending vote queue |

---

## 5. Backend API Reference

**Base URL:** `http://localhost:5000`

**Auth headers:**
- `Authorization: Bearer <JWT>` — required on protected routes
- `x-device-hash: <fingerprint>` — used for session binding

---

### 5.1 Health & Public

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/` | None | Health ping → `{ message: "SecureVote Backend API is running" }` |
| `GET` | `/api/health` | None | API gateway status → `{ status: "OK" }` |
| `GET` | `/api/election/public-key` | None | Returns Paillier public key `{ n, g }` |
| `GET` | `/api/election/status` | None | Current election phase + kill-switch state |
| `GET` | `/api/election/history` | None | All archived election results |

---

### 5.2 Authentication — Admin

| Method | Endpoint | Auth | Body | Description |
|---|---|---|---|---|
| `POST` | `/api/admin/login` | None | `{ username, password, role }` | Login; returns JWT + admin object |
| `POST` | `/api/admin/logout` | None | `{ username, role }` | Writes audit log |
| `POST` | `/api/admin/register` | JWT | `{ fullName, email, username, password, role }` | Create admin (authenticated) |
| `POST` | `/api/admin/forgot-password/send-otp` | None | `{ email }` | Generates + emails 6-digit OTP |
| `POST` | `/api/admin/forgot-password/verify-otp` | None | `{ email, otp }` | Validates OTP |
| `POST` | `/api/admin/forgot-password/reset-password` | None | `{ email, otp, newPassword }` | Resets password after OTP |
| `GET` | `/api/admin/list` | JWT | — | All admin accounts |
| `PUT` | `/api/admin/:id` | SysAdmin JWT | `{ fullName, email, role, password }` | Update admin record |
| `DELETE` | `/api/admin/:id` | JWT | — | Delete admin |

**Roles:** `ELECTION_ADMIN`, `SYSADMIN`

---

### 5.3 Authentication — Voter

| Method | Endpoint | Auth | Body | Description |
|---|---|---|---|---|
| `POST` | `/api/voter/signup` | None | `{ name, mobile, email, password }` | Create voter portal account |
| `POST` | `/api/voter/login` | None | `{ mobile, password }` | Login; password verified via SHA-256 |
| `POST` | `/api/voter/authenticate` | None | `{ mobile, otp, faceDescriptor?, deviceHash? }` | Multi-factor voter auth; returns signed JWT |
| `POST` | `/api/voter/logout` | JWT | — | Invalidates session |

---

### 5.4 Election Management

| Method | Endpoint | Auth | Body | Description |
|---|---|---|---|---|
| `POST` | `/api/election/update` | SysAdmin JWT | `{ phase?, isKillSwitch? }` | Change election phase / toggle kill-switch |
| `POST` | `/api/admin/election/archive` | JWT | `{ resultsJson, totalVotes }` | Archive election results |

**Election phases:** `REGISTRATION` → `VOTING` → `COUNTING` → `RESULTS`

---

### 5.5 Candidate Management

| Method | Endpoint | Auth | Body / Query | Description |
|---|---|---|---|---|
| `GET` | `/api/candidates` | None | `?constituency=` | Get candidates (optionally filtered) |
| `GET` | `/api/candidates/all` | JWT | — | All candidates |
| `POST` | `/api/candidates` | JWT | `{ name, party, constituency, symbol }` | Add candidate |
| `PUT` | `/api/candidates/:id` | JWT | `{ name, party, constituency, symbol }` | Update |
| `DELETE` | `/api/candidates/:id` | JWT | — | Delete |

---

### 5.6 Constituency Management

| Method | Endpoint | Auth | Body | Description |
|---|---|---|---|---|
| `GET` | `/api/constituencies` | None | — | All constituencies |
| `POST` | `/api/constituencies` | JWT | `{ name, state }` | Add constituency |
| `DELETE` | `/api/constituencies/:id` | JWT | — | Delete |

---

### 5.7 Voter Registration Management

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/admin/voters` | JWT | All registered voters |
| `GET` | `/api/admin/pending-voters` | None | Pending registration applications |
| `GET` | `/api/admin/approved-voters` | None | Approved applications |
| `GET` | `/api/admin/rejected-voters` | None | Rejected applications |
| `GET` | `/api/admin/pending-voter/:id` | None | Specific application details |
| `POST` | `/api/admin/approve-voter` | None | Body: `{ applicationId }` — approve + generate voter ID |
| `POST` | `/api/admin/reject-voter` | None | Body: `{ applicationId, reason }` — reject with reason |
| `GET` | `/api/voter/status/:aadhaar` | None | Application status for self-check |
| `POST` | `/api/voter/register` | None | Submit new voter registration (with face photo) |
| `GET` | `/api/voter/flagged` | JWT | Registrations flagged for review |
| `POST` | `/api/electoral-roll/import` | JWT | Bulk import citizens from CSV/JSON |
| `GET` | `/api/electoral-roll` | JWT | Get full electoral roll |
| `POST` | `/api/electoral-roll/check` | None | `{ aadhaar }` — verify citizen eligibility |

---

### 5.8 Voting & Ledger

| Method | Endpoint | Auth | Body | Description |
|---|---|---|---|---|
| `POST` | `/api/vote` | JWT | `{ encryptedCandidateId, constituency, blindToken }` | Cast encrypted vote (smart contract validated) |
| `GET` | `/api/vote/turnout` | None | — | Turnout stats by constituency |
| `GET` | `/api/vote/ledger` | None | — | Public blockchain ledger (all blocks) |
| `GET` | `/api/observer/export-ledger` | None | — | Download signed ZIP: `ledger.json` + `signature.sha256` |
| `POST` | `/api/blind-signature/issue-token` | JWT | `{ blindedMessage }` | Issue Chaum blind-signature voting token |
| `POST` | `/api/blind-signature/verify` | None | `{ message, signature }` | Verify token signature |
| `GET` | `/api/tally` | None | — | Homomorphic tally (Paillier decryption), with tie-break |

---

### 5.9 Audit & Blockchain Integrity

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/audit/logs` | JWT | All system audit logs |
| `GET` | `/api/audit/integrity-status` | JWT | Live blockchain integrity status from `BlockchainService` |
| `GET` | `/api/integrity-check` | None | Full chain `prev_hash` traversal check |
| `GET` | `/api/blockchain/blocks` | None | Raw blockchain blocks |
| `GET` | `/api/off-chain/:hash` | JWT | Retrieve off-chain stored artifact by reference hash |

---

### 5.10 Observer / Auditor

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/observer/login` | None | Body: `{ mobile_number, password }` — returns JWT |
| `GET` | `/api/observer/bulletin-board` | JWT | Live public bulletin board (real-time vote metadata) |
| `GET` | `/api/observer/export-ledger` | None | Signed ledger ZIP download |

---

### 5.11 Fraud Detection

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/fraud/risk-signals` | JWT | All logged risk signals |
| `GET` | `/api/fraud/alerts` | JWT | Active fraud alerts |
| `GET` | `/api/fraud/watchdog` | JWT | Math-mismatch watchdog status (votes vs issued tokens) |
| `POST` | `/api/fraud/flag` | JWT | Manually flag a suspicious event |

---

### 5.12 System Admin

| Method | Endpoint | Auth | Body | Description |
|---|---|---|---|---|
| `POST` | `/api/sysadmin/login` | None | `{ username, password }` | SysAdmin login |
| `GET` | `/api/sysadmin/dashboard` | SysAdmin JWT | — | Platform health stats |
| `GET` | `/api/sysadmin/sessions` | SysAdmin JWT | — | All active sessions |
| `DELETE` | `/api/sysadmin/sessions/:id` | SysAdmin JWT | — | Force-invalidate session |
| `GET` | `/api/sysadmin/observers` | SysAdmin JWT | — | All observer accounts |
| `POST` | `/api/sysadmin/observers` | SysAdmin JWT | `{ mobile_number, password, name }` | Create observer |
| `POST` | `/api/recovery/request` | None | `{ mobile }` | Submit account recovery request |
| `GET` | `/api/recovery/all` | SysAdmin JWT | — | All recovery requests |
| `POST` | `/api/recovery/approve` | SysAdmin JWT | `{ requestId }` | Approve recovery |

---

### 5.13 Support Tickets

| Method | Endpoint | Auth | Body | Description |
|---|---|---|---|---|
| `POST` | `/api/tickets` | None | `{ subject, message }` | Submit ticket |
| `GET` | `/api/tickets` | JWT | — | All tickets |
| `GET` | `/api/tickets/:id` | JWT | — | Single ticket |
| `PUT` | `/api/tickets/:id/status` | JWT | `{ status }` | Update ticket status |

---

### 5.14 P2P / Node Discovery

| Method | Endpoint | Auth | Body | Description |
|---|---|---|---|---|
| `POST` | `/api/p2p/block` | None | `{ block }` | Receive a new block from a peer |
| `POST` | `/api/p2p/announce` | None | `{ nodeUrl }` | Node announces itself to the cluster |
| `GET` | `/api/p2p/peers` | None | — | List known peer nodes |

---

### 5.15 AI / Face Detection

| Method | Endpoint | Auth | Body | Description |
|---|---|---|---|---|
| `POST` | `/api/face/detect` | None | `{ image: "<base64>" }` | Detects face in photo; returns descriptor vector |

Used by the mobile observer registration app to verify a real face exists before the photo is saved.

---

### 5.16 Testing/Demo Endpoints

> ⚠️ **These endpoints exist for demonstration only and bypass security checks.**

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/admin/inject-fake-vote` | Inserts a bypassed vote directly into DB to trigger fraud watchdog |
| `POST` | `/api/admin/inject-tie-votes` | Inserts 2+2 Paillier-encrypted votes into a dummy constituency |
| `POST` | `/api/admin/clear-fake-votes` | Removes all test data and clears `MATH_MISMATCH` fraud alerts |

---

## 6. Services

| File | Responsibility |
|---|---|
| `services/BlockchainService.js` | In-memory + DB-backed blockchain; `initialize()`, `addBlock()`, `getIntegrityStatus()` |
| `services/SmartContract.js` | `invokeVote()` — validates candidate ID, election phase, duplicate prevention |
| `services/MempoolService.js` | Transaction mempool before block confirmation |
| `services/OffChainStorage.js` | Store/retrieve heavy artifacts (public keys, digital signatures) by SHA-256 reference hash |
| `services/emailService.js` | `sendOtpEmail()` via Nodemailer |
| `services/smsService.js` | `sendOtpSms()` via Twilio |
| `utils/fraudEngine.js` | `checkIpVelocity()`, `checkDeviceVelocity()`, `checkFaceSimilarity()`, `calculateRiskScore()`, `logFraudSignal()` |
| `utils/authService.js` | `generateToken()`, `createSession()`, `invalidateSession()` |
| `utils/encryption_keys.js` | `loadOrGenerateKeys()`, `getPublicKey()`, `getPrivateKey()` — Paillier key management |
| `utils/faceService.js` | `getDescriptorFromBase64()` — face-api.js detection wrapper |
| `utils/BlindSignature.js` | Chaum blind-signature token issuance and verification |
| `utils/MempoolService.js` | Alternative mempool util (also present in `utils/`) |

---

## 7. Middleware

### `authMiddleware.js`

Validates JWT from `Authorization: Bearer <token>`. Attaches decoded payload to `req.user`. Returns `401` if missing/invalid, `403` if expired.

### `verifySysAdmin` (inline in `app.js`)

Additional role check — decoded JWT must have `role === "SYSADMIN"`. Used on sensitive admin-management and election-phase routes.

### CORS

All origins allowed in development (`callback(null, true)`). Allowed methods: `GET POST PUT DELETE OPTIONS`. Custom header: `x-device-hash`.

### Body Limit

JSON body limit set to `50mb` to support base64 face images.

---

## 8. Test Suite

Located in `backend-api/tests/`. Run with `npm test` (Vitest).

| File | What it covers |
|---|---|
| `auth.test.js` | Voter & admin login flows |
| `jwt.test.js` | Token generation, expiry, role validation |
| `smart_contract.test.js` | `invokeVote()` rules: candidate validity, phase, duplicates |
| `consensus.test.js` | Multi-node block agreement logic |
| `fraudEngine.test.js` | Risk scoring, IP/device velocity |
| `fraud_supertest.test.js` | HTTP-level fraud endpoint tests |
| `peer_discovery.test.js` | P2P node announce/list |
| `off_chain.test.js` | Off-chain artifact store/retrieve |
| `election_history.test.js` | Archive and retrieve election results |
| `auditor.test.js` | Ledger export and signature verification |
| `sysadmin_features.test.js` | SysAdmin dashboard, session management |
| `health.test.js` | `/api/health` smoke test |
| `test_dup.js` | Duplicate vote prevention |
| `test_session_security.js` | Device hash binding, IP binding, token rotation |
| `test_registration.js` | Voter registration + approval flow |
| `test_risk_flagging.js` | Risk signal logging |
| `test_voice_supertest.js` | Voice assistant endpoint |
| `test_auditor.py` | Python-based auditor verification |

```bash
# Run all backend tests
cd backend-api && npm test

# Interactive UI
npm run test:ui

# All frontends build check
cd orchestration && npm run build:all
```

---

## 9. CI/CD Pipeline

Defined in `orchestration/.github/workflows/ci.yml`. Triggers on every push to `main`.

```
Push to main
     │
     ▼
  [LINT]  ──fail──► ❌ blocked
     │ pass
     ▼
  [TEST]  ──fail──► ❌ blocked
  (PostgreSQL container + DB init + Vitest)
     │ pass
     ▼
  [BUILD] ──fail──► ❌ blocked
  (Vite × 5 frontends + Expo export)
     │ pass
     ▼
  [DEPLOY]
  Vercel (6 frontends) + Render (backend)
```

- All credentials stored as **GitHub Encrypted Secrets**
- No code reaches production without passing all gates
- PRs blocked from merging until CI passes

---

## 10. Security Model

| Concern | Mechanism |
|---|---|
| **Vote Privacy** | Paillier homomorphic encryption — tallied without decrypting individual ballots |
| **Vote Integrity** | SHA-256 `prev_hash` chain — tampering any block breaks all subsequent hashes |
| **Authentication** | JWT (short expiry) + device fingerprint binding via `x-device-hash` |
| **Key Management** | Shamir's Secret Sharing — decryption requires `k-of-n` trustees |
| **Token Anonymity** | Chaum blind-signature voting tokens prevent linking voter to ballot |
| **Fraud Detection** | TensorFlow.js anomaly detection + rule-based risk flagging |
| **Identity** | face-api.js biometric check at voter authentication |
| **API Security** | CORS, 50mb body ceiling, input validation on all write routes |
| **Session Security** | Token hashing in DB, IP binding, auto-expiry, invalidation on logout |
| **Off-Chain Storage** | Heavy crypto artifacts (public keys, digital signatures) stored off-ledger; only SHA-256 reference on chain |
| **Secrets** | `.env` file only — excluded from version control |

---

*Generated from source: `backend-api/` — March 2026*
