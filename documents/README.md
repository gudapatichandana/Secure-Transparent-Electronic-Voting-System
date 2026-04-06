# Secure Transparent Electronic Voting System

[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![License](https://img.shields.io/badge/license-ISC-blue)](LICENSE)
[![PostgreSQL](https://img.shields.io/badge/database-PostgreSQL-336791)](https://www.postgresql.org/)

A **secure, web-based electronic voting platform** designed to ensure fair elections through cryptographic security, robust access control, and complete auditability. The system models real-world election workflows, enabling **Voters**, **Election Officials**, and **Auditors** to participate in a transparent process while guaranteeing **vote anonymity** and **result integrity**.

## Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
  - [Running All Services](#running-all-services)
  - [Running Individual Services](#running-individual-services)
- [Security](#security)
- [Contributing](#contributing)
- [License](#license)

## Features

*   **🔒 End-to-End Encryption**: Votes are encrypted from the client browser to the database using AES-256-GCM.
*   **👤 Multi-Role Access**: Dedicated portals for Voters, Election Officials, System Admins, and Observers.
*   **🛡️ Fraud Detection**: Real-time AI/ML monitoring for anomaly detection and suspicious patterns.
*   **📝 Immutable Audit Logs**: All actions are logged and cannot be tampered with.
*   **📱 Responsive Design**: Modern frontend interfaces built with React and Tailwind CSS.
*   **⚡ Real-time Updates**: Live turnout reports and election status tracking.

## Architecture

The system is composed of a central backend API and multiple frontend applications, each serving a specific user role.

| Component | Directory | Description | Port |
| :--- | :--- | :--- | :--- |
| **Backend API** | `backend-api` | Node.js/Express server handling logic and DB connections. | `5000` |
| **Election Admin** | `project-election-admin` | Portal for managing elections, candidates, and constituencies. | `5173` |
| **Voter Portal** | `project-voter` | Interface for voters to cast ballots securely. | `5174` |
| **Observer Portal** | `project-observer` | Read-only view for election monitoring and auditing. | `5175` |
| **System Admin** | `project-sys-admin` | Technical administration and system health monitoring. | `5176` |
| **Voter Registration**| `project-voter-registration`| Public portal for new voter registration. | `5177` |

## Prerequisites

Before installing, ensure you have the following software installed:

*   **[Node.js](https://nodejs.org/en/)** (v18.0.0 or higher)
*   **[PostgreSQL](https://www.postgresql.org/download/)** (v14 or higher)
*   **Git**

## Installation

To install the project and its dependencies, follow these steps:

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/Sandeep-Merugumala/Secure-Transparent-Electronic-Voting-System.git
    cd Secure-Transparent-Electronic-Voting-System
    ```

2.  **Install dependencies for all services:**
    We provide a convenience script to install dependencies for the root, backend, and all frontend projects.
    ```sh
    npm run install:all
    ```

3.  **Database Configuration:**
    *   Ensure PostgreSQL is running.
    *   Create a database named `SecureVote`.
    *   Navigate to `backend-api` and create a `.env` file based on your configuration (see `backend-api/.env.example` if available).

## Usage

### Running All Services

To start the entire ecosystem (Backend + All Frontends) concurrently:

```sh
npm run dev:all
```

This will launch all services in a single terminal window.

### Running Individual Services

To run specific parts of the system, use the following commands:

| Service | Command |
| :--- | :--- |
| **Backend API** | `npm run backend` |
| **Election Admin** | `npm run admin` |
| **Voter Portal** | `npm run voter` |
| **Observer Portal** | `npm run observer` |
| **System Admin** | `npm run sysadmin` |
| **Registration** | `npm run registration` |

## Security

This project takes security seriously. Key implementations include:

*   **AES-256-GCM** for sensitive data encryption.
*   **Helmet.js** for securing HTTP headers.
*   **Rate Limiting** to prevent brute-force attacks.
*   **JWT** for stateless authentication.
*   **Input Validation** on all API endpoints.

## Contributing

We welcome contributions! Please follow these steps:

1.  Fork the repository.
2.  Create a feature branch: `git checkout -b feature/my-feature`
3.  Commit your changes: `git commit -m 'Add some feature'`
4.  Push to the branch: `git push origin feature/my-feature`
5.  Submit a pull request.

## License

This project is licensed under the [ISC License](LICENSE).
