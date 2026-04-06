# Testing Strategy Document

## Secure Transparent Electronic Voting System

**Version:** 1.0  
**Date:** February 2026  
**Project Type:** Full-Stack Web Application (Monorepo)

---

## 1. Project Overview

The Secure Transparent Electronic Voting System is a monorepo consisting of the following components:

| # | Component | Type | Technology |
|---|-----------|------|------------|
| 1 | `backend-api` | REST API Server | Node.js, Express.js, PostgreSQL |
| 2 | `project-election-admin` | Frontend (Admin Panel) | React + Vite |
| 3 | `project-voter` | Frontend (Voter App) | React + Vite |
| 4 | `project-observer` | Frontend (Observer Dashboard) | React + Vite |
| 5 | `project-voter-registration` | Frontend (Registration Portal) | React + Vite |
| 6 | `project-sys-admin` | Frontend (System Admin Panel) | React + Vite |

---

## 2. Testing Tools, Platforms, Libraries & Frameworks

### 2.1 Unit & Integration Testing

| Tool/Library | Purpose | Used In |
|---|---|---|
| **Vitest** | Test runner and assertion library (Jest-compatible, Vite-native) | All components (backend + all frontends) |
| **Supertest** | HTTP assertion library for testing Express.js REST APIs without starting the server | `backend-api` |
| **React Testing Library (`@testing-library/react`)** | DOM-based testing utilities for React components | All frontend projects |
| **jest-dom (`@testing-library/jest-dom`)** | Custom DOM matchers (e.g., `toBeInTheDocument`, `toHaveTextContent`) | All frontend projects |
| **user-event (`@testing-library/user-event`)** | Simulates realistic user interactions (click, type, hover) | All frontend projects |
| **jsdom** | Simulated browser DOM environment for running tests in Node.js | All frontend projects |

### 2.2 API Testing (Manual / Exploratory)

| Tool | Purpose | Used In |
|---|---|---|
| **Postman** | Manual API testing, request building, and collection sharing | `backend-api` endpoints |

### 2.3 Platform & Runtime

| Platform | Version | Purpose |
|---|---|---|
| **Node.js** | v18+ | Runtime for backend and build tools |
| **PostgreSQL** | v14+ | Primary database |
| **Vite** | v5+ | Frontend build tool and dev server |
| **npm** | v9+ | Package management and script execution |

---

## 3. Types of Tests

The project employs the following categories of tests:

| Test Type | Description | Scope |
|---|---|---|
| **Unit Tests** | Test individual functions, utilities, and React components in isolation | All components |
| **Integration Tests** | Test API endpoints end-to-end with HTTP requests against the Express app | `backend-api` |
| **Component Tests** | Test React components with rendering, user interactions, and DOM assertions | All frontends |
| **Manual API Tests** | Use Postman collections to manually test API request/response cycles | `backend-api` |

---

## 4. Component-wise Testing Strategy

### 4.1 Backend API (`backend-api`)

The backend is the core of the system, handling authentication, voter management, election control, vote casting, blockchain integrity, and fraud detection.

#### 4.1.1 Unit Tests

| Module / File | Properties Tested |
|---|---|
| `utils/fraudEngine.js` | IP velocity detection, device velocity detection, face similarity comparison, risk score calculation logic |
| `utils/authService.js` | JWT token generation, session creation, session invalidation |
| `utils/BlindSignature.js` | Key generation, blind signing, signature verification |
| `utils/encryption_keys.js` | Key pair generation, public/private key retrieval |
| `utils/MempoolService.js` | Transaction addition to mempool, block broadcasting |
| `services/emailService.js` | OTP email formatting and sending (mocked SMTP) |
| `services/BlockchainService.js` | Integrity status validation |
| `middleware/authMiddleware.js` | Token extraction, token validation, request rejection for missing/invalid tokens |

#### 4.1.2 Integration Tests (Supertest)

| API Endpoint | Method | Properties Tested |
|---|---|---|
| `/` | GET | Returns 200 status; response body contains welcome message |
| `/api/admin/login` | POST | Accepts valid credentials → returns admin object; rejects wrong password → 401; rejects mismatched role → 403 |
| `/api/admin/register` | POST | Creates new admin; rejects duplicate username → 400; rejects duplicate email → 400 |
| `/api/admin/logout` | POST | Logs event and returns success |
| `/api/admin/forgot-password/send-otp` | POST | Sends OTP for valid email; rejects unknown email → 404 |
| `/api/admin/forgot-password/verify-otp` | POST | Verifies correct OTP; rejects invalid/expired OTP → 400 |
| `/api/admin/forgot-password/reset-password` | POST | Resets password with valid OTP; rejects expired OTP → 400 |
| `/api/voter/login` | POST | Authenticates voter; returns JWT token; rejects invalid mobile/password → 401 |
| `/api/voter/register` | POST | Creates voter auth record; rejects duplicate mobile → 400; validates required fields → 400 |
| `/api/voter/logout` | POST | Invalidates session token |
| `/api/voter/signup` | POST | Creates voter account; rejects duplicate mobile → 409; rejects duplicate email → 409 |
| `/api/voter/forgot-password` | POST | Generates OTP; rejects unknown email → 404 |
| `/api/voter/verify-otp` | POST | Verifies OTP; rejects expired OTP → 400 |
| `/api/voter/reset-password` | POST | Updates password for valid email |
| `/api/voter/:id` | GET | Returns voter profile (auth required); rejects unauthorized access → 403 |
| `/api/voter/ballot/:voterId` | GET | Returns candidates for voter's constituency; rejects if election not LIVE → 403; rejects invalid voter → 404 |
| `/api/observer/login` | POST | Authenticates observer; rejects invalid credentials → 401; rejects role mismatch → 403 |
| `/api/observer/register` | POST | Creates observer account; rejects duplicate username → 400 |
| `/api/observer/forgot-password` | POST | Generates OTP for observer email; rejects unknown email → 404 |
| `/api/observer/verify-otp` | POST | Verifies OTP; rejects invalid/expired OTP → 400 |
| `/api/observer/reset-password` | POST | Resets observer password; requires valid OTP session |
| `/api/sys-admin/login` | POST | Authenticates sys admin; rejects invalid credentials → 401 |
| `/api/sys-admin/register` | POST | Creates sys admin; rejects duplicate username → 400 |
| `/api/registration/validate` | POST | Validates Aadhaar + phone against electoral roll; rejects unknown identity → 404; rejects already-registered → 400 |
| `/api/registration/submit` | POST | Saves voter application (fraud checks run); rejects duplicate Aadhaar → 409 |
| `/api/application/status/:refId` | GET | Returns application status; rejects unknown reference → 404 |
| `/api/verify-voter` | POST | Returns voter profile for valid ID; supports encrypted payload decryption; rejects missing ID → 401; rejects unknown ID → 404 |
| `/api/update-face` | POST | Updates voter face descriptor |
| `/api/blind-sign` | POST | Issues blind signature for eligible voter; rejects already-issued token → 403; rejects unknown voter → 404 |
| `/api/vote` | POST | Casts vote with valid blind signature; rejects if election not LIVE → 403; rejects invalid signature → 401; rejects duplicate vote → 403 |
| `/api/blind-signature/keys` | GET | Returns blind signature public key |
| `/api/election/status` | GET | Returns current election phase and kill switch status |
| `/api/election/public-key` | GET | Returns homomorphic encryption public key |
| `/api/election/update` | POST | Updates election phase; toggles kill switch |
| `/api/candidates` | GET | Returns candidates by constituency (only when LIVE) |
| `/api/candidates/search` | GET | Searches candidates by district/constituency metadata |
| `/api/candidate` | POST | Creates a new candidate; validates required fields → 400 |
| `/api/constituency` | POST | Creates a new constituency |
| `/api/constituencies` | GET | Returns all constituencies |
| `/api/admin/list` | GET | Returns all admin accounts |
| `/api/admin/:id` | PUT | Updates admin; rejects duplicate email → 400 |
| `/api/admin/:id` | DELETE | Deletes an admin account |
| `/api/admin/voters` | GET | Returns all registered voters |
| `/api/admin/pending-voters` | GET | Returns pending voter applications |
| `/api/admin/pending-voter/:id` | GET | Returns details of a pending application; rejects unknown ID → 404 |
| `/api/admin/approve-voter` | POST | Approves application and generates voter ID |
| `/api/admin/reject-voter` | POST | Rejects application with reason |
| `/api/admin/flagged-registrations` | GET | Returns fraud-flagged registrations |
| `/api/admin/votes` | GET | Returns all vote records (tallying authority) |
| `/api/admin/election/private-key` | GET | Returns election private key (tallying authority) |
| `/api/admin/voter/register-direct` | POST | Registers voter directly (admin bypass); rejects duplicate ID → 400 |
| `/api/admin/recovery/pending` | GET | Returns all pending recovery requests |
| `/api/admin/recovery/approve` | POST | Approves account recovery request |
| `/api/recovery/initiate` | POST | Initiates account recovery; rejects locked accounts → 403 |
| `/api/recovery/verify-nfc` | POST | Verifies NFC step in recovery flow |
| `/api/recovery/verify-face` | POST | Verifies facial biometric in recovery; locks account after 3 failures → 403 |
| `/api/audit/logs` | GET | Returns all audit log entries |
| `/api/audit/integrity-status` | GET | Returns blockchain integrity status |
| `/api/integrity-check` | GET | Performs and returns full blockchain chain verification |
| `/api/stats/turnout` | GET | Returns voter turnout statistics |
| `/api/public-ledger` | GET | Returns public vote ledger |
| `/api/verify-receipt` | POST | Verifies vote receipt hash; rejects invalid format → 400; returns not found if hash missing |
| `/api/fraud-check` | POST | Sends data to Python AI module and returns fraud analysis |
| `/api/p2p/block` | POST | Receives block from peer (simulation) |
| `/api/results/constituency/:id` | GET | Returns constituency-level election results |
| `/api/results/summary` | GET | Returns overall election summary with party-wise results |
| `/api/results/turnout` | GET | Returns detailed turnout by constituency |
| `/api/results/form20/:constituencyId` | GET | Generates official Form 20 result sheet |
| `/api/results/declare/:constituencyId` | POST | Declares results; restricted to POST_POLL admins → 403 |

#### 4.1.3 Manual API Tests (Postman)

A Postman collection (`backend_api_postman_collection.json`) is provided with pre-configured requests organized into folders:

- **System & Public** — Health check, election status, encryption keys
- **Authentication** — Login flows for Admin, Voter, Observer, SysAdmin
- **Voter Operations** — Registration, voting, ballots
- **Admin Operations** — Voter management, election control
- **Results & Observer** — Turnout, ledger, receipt verification

Each request includes sample **success** and **failure** request bodies.

---

### 4.2 Frontend: Election Admin (`project-election-admin`)

| Test Area | Properties Tested | Test Type |
|---|---|---|
| Login Page | Renders form fields; validates empty submission; calls API on submit; handles error responses; shows loading state | Component |
| Dashboard | Renders stats cards; fetches election status on mount | Component |
| Voter Management | Renders voter table; approve/reject buttons trigger API calls | Component |
| Candidate Registration | Form validation (required fields); successful submission | Component |
| Election Phase Control | Phase selector renders current phase; update triggers API | Component |
| Audit Log Viewer | Renders log entries; pagination works | Component |
| Routing / Auth Guard | Unauthenticated user redirected to login; authenticated user accesses dashboard | Component |

---

### 4.3 Frontend: Voter App (`project-voter`)

| Test Area | Properties Tested | Test Type |
|---|---|---|
| Login (Face + NFC) | Renders voter ID input; handles face verification flow; displays errors | Component |
| Ballot Screen | Renders candidate list; highlights selected candidate; shows confirmation modal | Component |
| Vote Confirmation Modal | Displays selected candidate name; confirm button triggers vote API; cancel returns to ballot | Component |
| Vote Receipt | Displays transaction hash; copy-to-clipboard functionality | Component |
| Session Timeout | Inactivity timer activates after 2 minutes; redirect to home; clears session data | Unit |
| Recovery Flow | Multi-step recovery renders correctly; NFC/Face steps transition | Component |

---

### 4.4 Frontend: Observer Dashboard (`project-observer`)

| Test Area | Properties Tested | Test Type |
|---|---|---|
| Login | Renders form; validates credentials; handles API errors | Component |
| Live Dashboard | Fetches and renders turnout statistics; auto-refresh | Component |
| Public Ledger | Renders vote records table; pagination | Component |
| Integrity Status | Displays blockchain health indicator (HEALTHY/FAILURE) | Component |

---

### 4.5 Frontend: Voter Registration (`project-voter-registration`)

| Test Area | Properties Tested | Test Type |
|---|---|---|
| Signup / Login | Form validation; duplicate detection; session management | Component |
| Identity Validation | Aadhaar + Phone input; API call; error handling | Component |
| Multi-step Form | Step navigation (forward/back); form context persists data across steps; field validation per step | Component |
| Face Enrollment | Camera access prompt; capture flow; descriptor extraction | Component |
| Application Status | Reference ID input; displays PENDING/APPROVED/REJECTED status | Component |

---

### 4.6 Frontend: System Admin (`project-sys-admin`)

| Test Area | Properties Tested | Test Type |
|---|---|---|
| Login | Renders form; authenticates sys admin credentials | Component |
| Admin Management | CRUD operations on admin accounts; role assignment | Component |
| System Configuration | Displays system settings; update triggers | Component |

---

## 5. Test Execution

### 5.1 Running Tests

All projects use a unified `npm test` command:

```bash
# Backend
cd backend-api && npm test

# Frontend (any project)
cd project-election-admin && npm test
cd project-voter && npm test
cd project-observer && npm test
cd project-voter-registration && npm test
cd project-sys-admin && npm test
```

### 5.2 Test Configuration Summary

| Component | Config File | Environment | Runner |
|---|---|---|---|
| `backend-api` | `vitest.config.mjs` | `node` | `vitest run` |
| `project-election-admin` | `vite.config.js` (test block) | `jsdom` | `vitest run` |
| `project-voter` | `vite.config.js` (test block) | `jsdom` | `vitest run` |
| `project-observer` | `vite.config.js` (test block) | `jsdom` | `vitest run` |
| `project-voter-registration` | `vite.config.js` (test block) | `jsdom` | `vitest run` |
| `project-sys-admin` | `vite.config.js` (test block) | `jsdom` | `vitest run` |

---

## 6. Test Data & Environments

| Aspect | Strategy |
|---|---|
| **Database** | Tests use the development PostgreSQL instance configured via `.env` |
| **API Mocking** | Frontend tests mock API calls to isolate UI logic from backend |
| **Environment Variables** | `.env` file provides DB credentials, JWT secrets, and email config |
| **Postman Variables** | `baseUrl` (`http://localhost:5000`) and `voterToken` are configurable per environment |

---

## 7. Summary Matrix

| Component | Unit | Integration | Component | Manual (Postman) |
|---|---|---|---|---|
| `backend-api` | ✅ | ✅ | — | ✅ |
| `project-election-admin` | ✅ | — | ✅ | — |
| `project-voter` | ✅ | — | ✅ | — |
| `project-observer` | ✅ | — | ✅ | — |
| `project-voter-registration` | ✅ | — | ✅ | — |
| `project-sys-admin` | ✅ | — | ✅ | — |
