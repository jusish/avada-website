# Backend Architectural & API Rules

This document outlines backend standards for the Avada API service (`apps/api`).

---

## 🏗️ Architecture & Stack

- **Runtime**: Node.js (v20+ / v24) with TypeScript.
- **Framework**: Express.js with JSON body parsing, CORS, and Helmet security headers.
- **ORM**: Prisma ORM with PostgreSQL.
- **Port**: Default configured to `5005` in `.env` (`PORT=5005`).
- **Database Connection**: Configured via `DATABASE_URL`. Docker runs PostgreSQL on port `5435` locally to prevent conflicts.

---

## 🔒 Security & Authentication

1. **Password Hashing**:
   - Always hash passwords using `bcryptjs` (salt rounds: 10 or 12).
   - Never store plain-text passwords or return password hashes in any API response.

2. **JWT Authentication**:
   - Issue signed JSON Web Tokens upon successful `/api/auth/login`.
   - Protect all CMS write operations (`POST`, `PUT`, `DELETE` on `/api/content`) with the `requireAuth` middleware.
   - Authorization headers must use the Bearer scheme: `Authorization: Bearer <token>`.

3. **Input Validation**:
   - All incoming payloads must be validated using Zod schemas before hitting business logic or database queries.

---

## 📦 Database & Prisma ORM

1. **Schema Definition**:
   - Keep models clean with timestamps (`createdAt`, `updatedAt`).
   - Use Enums for statuses (e.g. `ContentStatus`: `DRAFT`, `PUBLISHED`, `ARCHIVED`).
   - Use Foreign Key relations for authorship (`User` <-> `ContentItem`).

2. **Database Migrations & Synchronization**:
   - In development: use `pnpm db:push` for rapid schema updates.
   - In production: use Prisma migrate deploy.
   - Always provide seed data (`prisma/seed.ts`) to ensure any fresh clone can immediately run with an active admin account.

---

## 📡 API Response Formatting

Standardized JSON envelopes:

### Success Response:
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional descriptive message"
}
```

### Error Response:
```json
{
  "success": false,
  "error": "Error description",
  "details": [ ... ]
}
```
