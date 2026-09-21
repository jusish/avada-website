# AvadaPay — Official Website & Headless CMS

<p align="center">
  <img src="apps/web/public/logo.svg" alt="AvadaPay Logo" width="220" />
</p>

<p align="center">
  <strong>High-performance monorepo powering AvadaPay's pan-African payment gateway, customer communication platform, and content management engine.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-22.x-339933?style=flat-square&logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/pnpm-10.x-F69220?style=flat-square&logo=pnpm&logoColor=white" alt="pnpm" />
  <img src="https://img.shields.io/badge/React-18.3-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/Vite-6.x-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Prisma-6.x-2D3748?style=flat-square&logo=prisma&logoColor=white" alt="Prisma" />
  <img src="https://img.shields.io/badge/PostgreSQL-16-4169E1?style=flat-square&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Docker-Ready-2496ED?style=flat-square&logo=docker&logoColor=white" alt="Docker" />
  <img src="https://img.shields.io/badge/GHCR-Automated_Build-2088FF?style=flat-square&logo=github&logoColor=white" alt="GHCR" />
</p>

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Monorepo Architecture](#-monorepo-architecture)
- [Core Features](#-core-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Environment Configuration](#environment-configuration)
  - [Database Initialization](#database-initialization)
  - [Running the Development Stack](#running-the-development-stack)
- [Available Scripts](#-available-scripts)
- [CI/CD & Container Registry](#-cicd--container-registry)
- [AI Guidelines & Documentation](#-ai-guidelines--documentation)

---

## 🌟 Overview

AvadaPay is built to orchestrate money and customer communication across 17+ African markets. This repository houses the unified codebase for:
1. **Public Marketing Portal**: Brand-aligned, responsive web experience featuring dedicated solution hubs (Payment Processing, Smart POS, Bulk SMS) and regional country portals (Kenya, Rwanda, Tanzania).
2. **Integrated CMS**: Administrative portal for publishing news, updates, and managing product showcase content.
3. **Backend API Service**: High-throughput Node.js + Express REST API backed by Prisma ORM and PostgreSQL.

---

## 🏗️ Monorepo Architecture

The repository is organized as a high-performance **pnpm monorepo**:

```
avada-website/
├── apps/
│   ├── web/                     # Vite + React 18/19 + Tailwind CSS + shadcn/ui
│   │   ├── src/
│   │   │   ├── components/      # UI component library, Navbar, Footer, SVG CountryFlag
│   │   │   ├── pages/           # Public pages & Admin CMS dashboard
│   │   │   ├── context/         # AuthContext & state management
│   │   │   └── lib/             # Shared styling utilities
│   │   └── public/              # Brand SVG logo, favicon, and bundled photography
│   │
│   └── api/                     # Node.js + Express + Prisma ORM REST API
│       ├── prisma/              # Prisma schema, migrations, and seeder
│       └── src/
│           ├── routes/          # Auth and Content management API endpoints
│           ├── middleware/      # JWT auth guard, error handling, rate limiting
│           └── server.ts        # Express app initialization (Port 5005)
│
├── packages/
│   └── shared/                  # Shared TypeScript interfaces, DTOs, & contracts
│
├── docker/                      # Multi-stage production Dockerfiles & Nginx configs
│   ├── Dockerfile.api           # Backend Node.js production runner
│   ├── Dockerfile.web           # Frontend static build served via Nginx Alpine
│   └── nginx.conf               # High-performance SPA reverse proxy
│
├── docs/                        # AI-first project rules, catalog, and changelog
│   ├── rules/                   # Frontend styling rules & backend standards
│   └── changelog/               # Features catalog (features-storage.md) & CHANGELOG.md
│
├── .github/
│   └── workflows/
│       └── ci.yml               # Automated PR checks & GHCR container builds
│
├── docker-compose.yml           # Local multi-container development environment
├── pnpm-workspace.yaml          # pnpm workspace package definitions
└── package.json                 # Monorepo root scripts & tooling
```

---

## 🚀 Core Features

### 🎨 Brand Identity & Public Portal
- **Brand Palette**: Custom `#3BBA93` emerald brand identity with `#2A292D` header backdrops and authentic vector SVG branding extracted from `avadapay.com`.
- **Hero Stacking & Photography**: Layered ambient card-swipe photography background with a balanced contrast overlay and a 23% opacity translucent sub-banner strip (`bg-black/[0.23]`).
- **Cross-Platform Vector Country Flags**: Zero-dependency SVG flags for Kenya 🇰🇪, Rwanda 🇷🇼, and Tanzania 🇹🇿 that render crisply across all operating systems, bypassing Windows emoji font rendering limitations.
- **Dedicated Solution Pages**:
  - **Payment Processing (`/payment-processing`)**: High-converting breakdown of mobile money gateways, local cards, and disbursement rails.
  - **Smart POS Hardware (`/pos`)**: Retail point-of-sale specs, debit/credit cards, and USSD QR integrations.
  - **Bulk SMS & OTP (`/bulk-sms`)**: Sub-3-second transactional SMS aggregator and campaign dispatcher.
- **Dedicated Regional Hubs (`/countries/:countrySlug`)**: Localized landing pages for Kenya, Rwanda, and Tanzania detailing in-country office addresses, central bank regulations, and local telco integrations.
- **Scroll Restoration (`ScrollToTop`)**: Automatically resets scroll coordinates to `(0, 0)` upon route changes, eliminating SPA scroll-persistence bugs.

### 🛡️ Headless Content Management System (CMS)
- **Protected Admin Panel**: Secure portal accessible via the footer link (`/admin`) with JWT authentication and bcrypt password hashing.
- **Radix UI `shadcn/ui` Components**: 100% styled Radix `Select`, `Dialog`, `Input`, and `Badge` components with zero unstyled plain HTML elements.
- **Real-Time Article Management**: Create, view, filter by category/status, and delete news articles, announcements, and product updates.

---

## 🛠️ Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18.3, Vite 6, TypeScript 5.9, Tailwind CSS 3.4, `shadcn/ui`, Lucide Icons |
| **Backend** | Node.js 22, Express 4, TypeScript 5.9, Prisma ORM 6, Zod, Helmet, CORS |
| **Database** | PostgreSQL 16 (containerized or external) |
| **Monorepo** | pnpm 10 workspaces, shared TypeScript contracts (`@avada/shared`) |
| **Quality** | ESLint 10 (flat config), TypeScript strict checks (`tsc --noEmit`) |
| **DevOps** | Docker, Docker Compose, Nginx Alpine, GitHub Actions, GitHub Container Registry (GHCR) |

---

## 💻 Getting Started

### Prerequisites
- **Node.js**: `v20.x` or `v22.x` (recommended)
- **pnpm**: `v10.x` (`npm install -g pnpm@10.30.3`)
- **Docker & Docker Compose**: For local PostgreSQL and containerization

### Environment Configuration
Copy the environment template file:
```bash
cp .env.example .env
```

Review the defaults in `.env`:
```env
PORT=5005
NODE_ENV=development
DATABASE_URL="postgresql://postgres:postgres@localhost:5435/avada_db?schema=public"
JWT_SECRET="avada_super_secure_jwt_secret_change_in_production"
VITE_API_URL="http://localhost:5005"
```

### Database Initialization
Start the local PostgreSQL container and initialize the database schema:
```bash
# 1. Start the PostgreSQL Docker container on port 5435
pnpm docker:up

# 2. Push the Prisma schema to the database
pnpm db:push

# 3. Seed the default admin user and initial content
pnpm db:seed
```

> **Default Administrator Credentials:**
> - **Email:** `admin@avada.com`
> - **Password:** `admin123`

### Running the Development Stack
Launch both the frontend client and backend API concurrently:
```bash
pnpm dev
```

The services will be live at:
- **Public Website:** [http://localhost:5173](http://localhost:5173)
- **CMS Admin Login:** [http://localhost:5173/admin](http://localhost:5173/admin)
- **Backend API:** [http://localhost:5005/api](http://localhost:5005/api)

---

## 📜 Available Scripts

Run these scripts from the repository root:

| Command | Description |
| :--- | :--- |
| `pnpm dev` | Starts frontend (`apps/web`) and backend (`apps/api`) concurrently |
| `pnpm build` | Builds `@avada/shared`, `@avada/api`, and `@avada/web` for production |
| `pnpm lint` | Runs ESLint across all TypeScript source files with zero warnings |
| `pnpm type-check` | Executes strict TypeScript compilation checks across all workspaces |
| `pnpm dev:web` | Starts only the Vite frontend dev server |
| `pnpm dev:api` | Starts only the Express backend dev server |
| `pnpm db:push` | Synchronizes Prisma schema with the PostgreSQL database |
| `pnpm db:seed` | Seeds the database with default administrator and sample CMS data |
| `pnpm db:studio` | Launches Prisma Studio GUI for database inspection |
| `pnpm docker:up` | Boots the containerized PostgreSQL service |
| `pnpm docker:down`| Tears down the local Docker containers |

---

## 🔄 CI/CD & Container Registry

This repository utilizes an enterprise-grade GitHub Actions pipeline configured in [`.github/workflows/ci.yml`](.github/workflows/ci.yml):

```mermaid
flowchart LR
    A[Git Event] -->|Pull Request| B[Quality Checks Job]
    A -->|Push to main| B
    B --> C[ESLint Check]
    B --> D[TypeScript Type Check]
    B --> E[Production Build]
    E -->|Only on Push to main| F[Docker Build & Push Job]
    F --> G[ghcr.io/jusish/avada-website/api]
    F --> H[ghcr.io/jusish/avada-website/web]
```

### 1. Automated Quality Gate (PRs & Pushes)
On every Pull Request and direct push to `main`, the workflow executes:
- **Lint Check:** `pnpm lint`
- **Type Check:** `pnpm type-check`
- **Build Check:** `pnpm build`

### 2. GHCR Container Build (Pushes to `main` Only)
Strictly upon direct push to `main` after checks pass, Docker Buildx builds and tags the multi-stage images and publishes them to **GitHub Container Registry (GHCR)**:
- `ghcr.io/jusish/avada-website/api:latest` and `:sha`
- `ghcr.io/jusish/avada-website/web:latest` and `:sha`

---

## 🤖 AI Guidelines & Documentation

For AI agents and human contributors collaborating on this codebase:
- [`AGENT.md`](./AGENT.md) — Fundamental developer and agent instructions.
- [`docs/README.md`](./docs/README.md) — Documentation ecosystem sitemap.
- [`docs/rules/frontend-styling-rules.md`](./docs/rules/frontend-styling-rules.md) — Frontend layout, color, and component guidelines.
- [`docs/rules/backend-rules.md`](./docs/rules/backend-rules.md) — API standards, Prisma practices, and security requirements.
- [`docs/changelog/features-storage.md`](./docs/changelog/features-storage.md) — Comprehensive, single-source-of-truth feature catalog.
- [`docs/changelog/CHANGELOG.md`](./docs/changelog/CHANGELOG.md) — Semantic version release logs.
