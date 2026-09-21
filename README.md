# avada-website

Official company website and integrated Content Management System (CMS) for Avada.

## Architecture

This project is organized as a high-performance **pnpm monorepo**:

- **`apps/web`**: Modern Vite + React 19 + TypeScript frontend with Tailwind CSS and `shadcn/ui` components. Includes both the public marketing website and the secure CMS admin dashboard.
- **`apps/api`**: Robust Node.js + Express + TypeScript backend running on port `5005`, backed by PostgreSQL and Prisma ORM.
- **`packages/shared`**: Common TypeScript models, DTOs, and interface contracts shared across frontend and backend.
- **`docs/`**: Centralized, AI-first documentation including styling guidelines, backend rules, feature storage, and changelog.
- **`docker-compose.yml`**: Containerized orchestration for the database, backend, and frontend.

## Getting Started

### Prerequisites

- Node.js 20+ (Node 24 recommended)
- pnpm 10+
- Docker & Docker Compose

### Environment Setup

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Install all dependencies:
   ```bash
   pnpm install
   ```

3. Start PostgreSQL using Docker:
   ```bash
   pnpm docker:up
   ```

4. Push the Prisma database schema and seed the initial admin:
   ```bash
   pnpm db:push
   pnpm db:seed
   ```

5. Run development servers (both frontend & backend):
   ```bash
   pnpm dev
   ```

- Public Website: `http://localhost:5173`
- CMS Admin: `http://localhost:5173/admin`
- Backend API: `http://localhost:5005`
- Default Admin Credentials:
  - **Email:** `admin@avada.com`
  - **Password:** `admin123`

## Documentation & AI Guidelines

Please see:
- [`AGENT.md`](./AGENT.md) - Critical instructions for AI agents working on this project.
- [`docs/README.md`](./docs/README.md) - Master documentation index.
- [`docs/rules/frontend-styling-rules.md`](./docs/rules/frontend-styling-rules.md) - Frontend design & component rules.
- [`docs/rules/backend-rules.md`](./docs/rules/backend-rules.md) - Backend architectural standards.
- [`docs/changelog/features-storage.md`](./docs/changelog/features-storage.md) - Record of all implemented features.
- [`docs/changelog/CHANGELOG.md`](./docs/changelog/CHANGELOG.md) - Chronological release log.
