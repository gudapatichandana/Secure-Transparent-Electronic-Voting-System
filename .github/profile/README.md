<div align="center">

<h1>🗳️ Secure & Transparent Electronic Voting System</h1>

<p><strong>A production-grade, cryptographically secure, fully auditable electronic voting platform built for real-world elections.</strong></p>

[![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-336791?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Vitest](https://img.shields.io/badge/Tested%20with-Vitest-6E9F18?style=for-the-badge&logo=vitest&logoColor=white)](https://vitest.dev/)
[![CI/CD](https://img.shields.io/badge/CI%2FCD-GitHub%20Actions-2088FF?style=for-the-badge&logo=github-actions&logoColor=white)](https://github.com/features/actions)
[![License](https://img.shields.io/badge/License-ISC-blue?style=for-the-badge)](LICENSE)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [System Architecture](#-system-architecture)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Getting Started](#-getting-started)
- [Running the System](#-running-the-system)
- [Running Tests](#-running-tests)
- [CI/CD Pipeline](#-cicd-pipeline)
- [Security Model](#-security-model)
- [Project Structure](#-project-structure)
- [Contributing](#-contributing)

---

## 🌐 Overview

The **Secure & Transparent Electronic Voting System** is a full-stack, multi-application platform that models real-world national elections end-to-end. It is designed around the principles of **vote anonymity**, **result integrity**, and **public auditability** — enforced at the cryptographic and architectural level, not just by policy.

The system serves five distinct user roles, each with a dedicated application:

| Role | Portal | Description |
|---|---|---|
| 🗳️ **Voter** | `project-voter` | Cast an encrypted ballot securely from any browser |
| 🏛️ **Election Admin** | `project-election-admin` | Manage elections, candidates, and constituencies |
| 👁️ **Observer / Auditor** | `project-observer` | Monitor the live public bulletin board and blockchain ledger |
| 🔧 **System Admin** | `project-sys-admin` | Manage platform health, users, and security settings |
| 📋 **Voter Registration** | `project-voter-registration` | Public portal for registering new voters |
| 📱 **Observer Mobile App** | `project-reg-obs-app` | Cross-platform Expo app for observer registration |

---

## ✨ Key Features

### 🔐 Cryptographic Security
- **Paillier Homomorphic Encryption** — Votes are tallied without ever decrypting individual ballots
- **AES-256-GCM** — End-to-end encryption of sensitive voter data
- **Shamir's Secret Sharing** — Decryption keys split across multiple trustees; no single party can decrypt alone
- **JWT Authentication** — Stateless, role-based access tokens with short expiry windows

### 🧾 Blockchain & Integrity
- **Immutable Vote Ledger** — Every vote is recorded as a block with a cryptographic hash chain
- **Genesis Block** — Election metadata is hardcoded at chain start; no block can precede it
- **Smart Contract Validation** — Code-enforced rules: candidate validity, timestamp checks, duplicate prevention
- **Public Bulletin Board** — Read-only blockchain view accessible to all observers in real time

### 🤖 AI-Powered Fraud Detection
- **TensorFlow.js Integration** — Real-time anomaly detection on voting patterns
- **Risk Flagging Engine** — Flags suspicious sessions, duplicate submissions, and timing anomalies
- **Face Verification** — `face-api.js` biometric check during voter authentication

### 🏗️ Architecture & Reliability
- **Consensus Mechanism** — Multi-node agreement before finalising vote records
- **Distributed Peer Discovery** — Backend nodes announce and verify each other
- **Off-Chain External Storage** — Heavy cryptographic artifacts (public keys, digital signatures) stored off-chain; only references stored on-ledger
- **Session Security** — Device fingerprinting, IP binding, token rotation

### 🌍 Accessibility
- **Multi-language Support** — i18next integration with browser locale detection
- **Responsive UI** — Fully responsive React interfaces; mobile-first design
- **Cross-platform Mobile App** — Expo/React Native for iOS, Android, and web

---

## 🏛️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        GitHub Actions CI/CD                     │
│          Lint → Test → Build → Deploy (Vercel + Render)        │
└─────────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┼───────────────┐
              │               │               │
    ┌─────────▼──────┐  ┌────▼──────┐  ┌────▼──────────────────┐
    │  project-voter  │  │  project- │  │  project-observer      │
    │  (React/Vite)   │  │  election │  │  (React/Vite)          │
    │  Voter Portal   │  │  -admin   │  │  Public Audit View     │
    └────────┬────────┘  │ (React)   │  └────────────────────────┘
             │           └─────┬─────┘
             │                 │           ┌─────────────────────┐
             │                 │           │  project-sys-admin   │
             │                 │           │  (React/Vite)        │
             │                 │           │  System Management   │
             │                 │           └─────────────────────┘
             │                 │
             │    ┌────────────▼────────────────────────────────┐
             │    │              backend-api                      │
             └───►│           Node.js / Express                  │
                  │                                              │
                  │  ┌───────────┐  ┌──────────┐  ┌─────────┐  │
                  │  │Blockchain │  │  Smart   │  │  Fraud  │  │
                  │  │  Ledger   │  │Contracts │  │ Engine  │  │
                  │  └───────────┘  └──────────┘  └─────────┘  │
                  │                                              │
                  │  ┌───────────┐  ┌──────────┐  ┌─────────┐  │
                  │  │Paillier   │  │ Shamir's │  │  JWT    │  │
                  │  │Encryption │  │  Secret  │  │  Auth   │  │
                  │  └───────────┘  └──────────┘  └─────────┘  │
                  └──────────────────┬──────────────────────────┘
                                     │
                          ┌──────────▼──────────┐
                          │     PostgreSQL 15     │
                          │  Voters, Votes,       │
                          │  Blockchain, Sessions │
                          └─────────────────────┘
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Backend** | Node.js 20, Express.js |
| **Frontend** | React 19, Vite 7, React Router |
| **Mobile** | Expo SDK 54, React Native 0.81 |
| **Database** | PostgreSQL 15 |
| **Encryption** | Paillier Homomorphic, AES-256-GCM, crypto-js |
| **Secret Sharing** | Shamir's Secret Sharing (secrets.js-grempe) |
| **AI/ML** | TensorFlow.js, face-api.js |
| **Authentication** | JSON Web Tokens (JWT) |
| **Testing** | Vitest, Supertest, Testing Library, Happy DOM |
| **Styling** | Tailwind CSS, NativeWind |
| **i18n** | i18next |
| **CI/CD** | GitHub Actions |
| **Frontend Hosting** | Vercel |
| **Backend Hosting** | Render |

---

## 📦 Prerequisites

Ensure the following are installed before running locally:

- **[Node.js 20+](https://nodejs.org/)** — `node --version` should show `v20.x` or higher
- **[PostgreSQL 15+](https://www.postgresql.org/download/)** — Must be running locally
- **[Git](https://git-scm.com/)**
- *(Optional for mobile)* **[Expo CLI](https://expo.dev/)** — `npm install -g expo-cli`

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Sandeep-Merugumala/Secure-Transparent-Electronic-Voting-System.git
cd Secure-Transparent-Electronic-Voting-System/orchestration
```

### 2. Install All Dependencies

```bash
npm run install:all
```

> This installs packages for the orchestration root, `backend-api`, and all 5 frontend projects in one command.

### 3. Configure the Backend Environment

Create a `.env` file inside `backend-api/`:

```env
# Database
DB_USER=postgres
DB_HOST=localhost
DB_PASSWORD=your_postgres_password
DB_NAME=voting_db
DB_PORT=5432

# Authentication
JWT_SECRET=your_super_secret_jwt_key_min_32_chars

# Email (optional — for OTP notifications)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# SMS (optional — for OTP via Twilio)
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890
```

### 4. Initialise the Database

```bash
cd backend-api
node scripts/init_db_for_ci.js
cd ..
```

> This creates all tables, sessions, and seeds an initial admin user.

---

## ▶️ Running the System

### Run Everything (Recommended)

From the `orchestration` directory:

```bash
npm run dev:all
```

All services start concurrently in one terminal:

| Service | URL |
|---|---|
| 🔌 Backend API | `http://localhost:5000` |
| 🏛️ Election Admin | `http://localhost:5173` |
| 🗳️ Voter Portal | `http://localhost:5174` |
| 👁️ Observer Portal | `http://localhost:5175` |
| 🔧 System Admin | `http://localhost:5176` |
| 📋 Voter Registration | `http://localhost:5177` |

### Run Backend + Admin Only (Development)

```bash
npm run dev:admin
```

### Run Individual Services

```bash
npm run backend       # Backend API only
npm run admin         # Election Admin frontend only
npm run voter         # Voter portal only
npm run observer      # Observer portal only
npm run sysadmin      # System Admin only
npm run registration  # Voter Registration only
npm run reg-obs       # Expo/React Native app (web mode)
```

---

## 🧪 Running Tests

### All Tests (Backend + Frontend)

```bash
# From orchestration/
npm run test:all
```

### Backend Tests Only

```bash
cd backend-api
npm test
```

Covers: `auth`, `jwt`, `smart_contract`, `consensus`, `fraudEngine`, `sysadmin_features`, `peer_discovery`, `off_chain`, `election_history`, `auditor`, and more.

### Interactive Test UI

```bash
npm run test:ui
```

### Build All Frontends (Verification)

```bash
npm run build:all
```

---

## ⚙️ CI/CD Pipeline

Every push to `main` triggers an automated GitHub Actions pipeline:

```
Push to main
     │
     ▼
┌─────────┐     fail → ❌ Pipeline Blocked
│  LINT   │──────────────────────────────────►
└────┬────┘
     │ pass
     ▼
┌─────────┐     fail → ❌ Pipeline Blocked
│  TEST   │  PostgreSQL container + DB init + Vitest
└────┬────┘
     │ pass
     ▼
┌─────────┐     fail → ❌ Pipeline Blocked
│  BUILD  │  Vite build × 5 frontends + Expo export
└────┬────┘
     │ pass
     ▼
┌─────────┐
│ DEPLOY  │  → Vercel (6 frontends) + Render (backend)
└─────────┘
```

**Security guarantees:**
- All credentials stored as **GitHub Encrypted Secrets** — never exposed in logs
- No hardcoded passwords — flagged by static analysis
- No code reaches production without passing all gates
- Pull requests can only merge after CI passes

---

## 🔒 Security Model

| Concern | Mechanism |
|---|---|
| **Vote Privacy** | Paillier homomorphic encryption — results tallied without decrypting individual votes |
| **Vote Integrity** | SHA-256 hash chain blockchain — tampering any vote breaks all subsequent hashes |
| **Authentication** | JWT with short expiry + device fingerprint binding |
| **Key Management** | Shamir's Secret Sharing — decryption requires `k-of-n` trustees |
| **Fraud Detection** | TensorFlow.js anomaly detection + rule-based risk flagging engine |
| **Identity Verification** | face-api.js biometric check at login |
| **API Security** | Rate limiting, CORS, Helmet HTTP headers, input validation |
| **Session Security** | Token hashing, IP binding, automatic expiry, invalidation on logout |
| **Secrets** | Environment variables only — `.env` files excluded from version control |

---

## 📁 Project Structure

```
📦 Secure-Transparent-Electronic-Voting-System/
├── 📂 orchestration/              ← Monorepo root, CI/CD workflows, test runner
│   ├── .github/workflows/ci.yml  ← Master CI/CD pipeline
│   └── package.json              ← Scripts to run/test all services
│
├── 📂 backend-api/                ← Node.js/Express REST API
│   ├── app.js                    ← Main application (routes, middleware)
│   ├── index.js                  ← Server entry point
│   ├── models/                   ← PostgreSQL table definitions
│   ├── services/                 ← Blockchain, encryption, fraud detection
│   ├── middleware/               ← Auth, rate limiting, validation
│   ├── scripts/                  ← DB init, bootstrap, dev utilities
│   ├── tests/                    ← Vitest test suite (18 test files)
│   └── ai_modules/               ← TensorFlow.js fraud models
│
├── 📂 project-voter/              ← Voter ballot casting portal (React/Vite)
├── 📂 project-election-admin/     ← Election management portal (React/Vite)
├── 📂 project-observer/           ← Public audit & blockchain viewer (React/Vite)
├── 📂 project-sys-admin/          ← System administration portal (React/Vite)
├── 📂 project-voter-registration/ ← New voter registration portal (React/Vite)
└── 📂 project-reg-obs-app/        ← Observer mobile app (Expo/React Native)
```

---

## 🤝 Contributing

Contributions are welcome. Please follow the project's code standards:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/your-feature-name`
3. **Commit** with a clear message: `git commit -m "feat: add your feature"`
4. **Push** to your fork: `git push origin feature/your-feature-name`
5. **Open a Pull Request** — CI must pass before review

> ⚠️ All PRs are blocked from merging until the full CI pipeline (lint → test → build) passes.

---

<div align="center">

**Built with ❤️ for secure, transparent, and trustworthy elections.**

</div>
