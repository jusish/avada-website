# AGENT.md - AI Operating System & Project Rules

Welcome, Agent. This file contains **mandatory guidelines and protocols** for all AI models (Antigravity, Copilot, Cursor, etc.) working on the **Avada Website** project.

---

## 🚨 MANDATORY DIRECTIVES (Read Before Doing Anything)

1. **Update Documentation On EVERY Task**:
   Whenever you implement a feature, refactor code, add an endpoint, or change configuration, you **MUST update the documentation** before finishing your response:
   - Record the feature details in [`docs/changelog/features-storage.md`](./docs/changelog/features-storage.md).
   - Log the release/update in [`docs/changelog/CHANGELOG.md`](./docs/changelog/CHANGELOG.md).
   - If styling patterns or architectural rules change, update [`docs/rules/`](./docs/rules/).

2. **Zero Tolerance for Unstyled Plain HTML**:
   The project owner **strictly hates unstyled plain HTML**.
   - NEVER output raw `<button>`, `<input>`, `<table>`, or `<div>` without polished, responsive Tailwind CSS styling or `shadcn/ui` components.
   - Always use the design system components located in `apps/web/src/components/ui/` or styled with Tailwind utility classes matching the Avada design tokens.

3. **Monorepo Architecture Integrity**:
   - `apps/web`: Frontend Vite + React + TypeScript + Tailwind + shadcn/ui.
   - `apps/api`: Backend Express + TypeScript + Prisma + PostgreSQL (Port 5005).
   - `packages/shared`: Shared TypeScript types, DTOs, and constants. Do not duplicate types between apps; put them in `@avada/shared`.

4. **Database & Migrations**:
   - PostgreSQL runs on Docker port `5435` locally (to avoid conflicts with other local databases).
   - Always keep Prisma schema in sync: run `pnpm db:push` or migration commands when modifying `schema.prisma`.
   - Never use raw SQL string concatenation; always use Prisma ORM queries.

5. **Package Management**:
   - Use `pnpm` exclusively. Never run `npm install` or `yarn install` directly in app folders to prevent breaking workspace links.

---

## 📚 Documentation Index

All agents must familiarize themselves with the documentation tree:

| Document | Location | Purpose |
| :--- | :--- | :--- |
| **Docs Index** | [`docs/README.md`](./docs/README.md) | Central hub and index of all project docs |
| **Frontend Rules** | [`docs/rules/frontend-styling-rules.md`](./docs/rules/frontend-styling-rules.md) | Styling conventions, likes/dislikes, component rules |
| **Backend Rules** | [`docs/rules/backend-rules.md`](./docs/rules/backend-rules.md) | Express, Prisma, API conventions, and security rules |
| **Features Storage** | [`docs/changelog/features-storage.md`](./docs/changelog/features-storage.md) | Single source of truth for all features and their implementations |
| **Changelog** | [`docs/changelog/CHANGELOG.md`](./docs/changelog/CHANGELOG.md) | Chronological log of versions and commits |

---

## 🛠️ Common Commands

- Run full dev stack: `pnpm dev`
- Run frontend only: `pnpm dev:web`
- Run backend only: `pnpm dev:api`
- Run DB migrations: `pnpm db:push`
- Seed database: `pnpm db:seed`
- Open Prisma Studio: `pnpm db:studio`
- Start Docker stack: `pnpm docker:up`
