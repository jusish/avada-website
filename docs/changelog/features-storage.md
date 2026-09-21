# Features Storage: Comprehensive Catalog

This document is the **single source of truth** for every feature implemented in the Avada platform. For each feature, it records the rationale, architecture, files involved, endpoints, and exact implementation details.

---

## 📑 Feature Index

1. [FEAT-001: Monorepo & Tooling Foundation](#feat-001-monorepo--tooling-foundation)
2. [FEAT-002: Backend API & Prisma ORM Engine](#feat-002-backend-api--prisma-orm-engine)
3. [FEAT-003: CMS Authentication & Content Endpoints](#feat-003-cms-authentication--content-endpoints)
4. [FEAT-004: Frontend Application & shadcn/ui Component System](#feat-004-frontend-application--shadcnui-component-system)
5. [FEAT-005: Marketing Website & CMS Admin Dashboard](#feat-005-marketing-website--cms-admin-dashboard)
6. [FEAT-006: Docker Containerization Ecosystem](#feat-006-docker-containerization-ecosystem)
7. [FEAT-007: AI Agent Standard & Documentation Architecture](#feat-007-ai-agent-standard--documentation-architecture)
8. [FEAT-008: AvadaPay Brand Alignment, Adobe XD Hero, Solution Pages & shadcn Select](#feat-008-avadapay-brand-alignment-adobe-xd-hero-solution-pages--shadcn-select)
9. [FEAT-009: Navbar Polish, Consistent #2A292D Backgrounds, Hero 23% Opacity Sub-banner & Solutions Alignment](#feat-009-navbar-polish-consistent-2a292d-backgrounds-hero-23-opacity-sub-banner--solutions-alignment)
10. [FEAT-010: Home Hero Background Image Visibility & Positive Z-Index Layering](#feat-010-home-hero-background-image-visibility--positive-z-index-layering)
11. [FEAT-011: Cross-Platform Vector Country Flags Component](#feat-011-cross-platform-vector-country-flags-component)
12. [FEAT-012: SPA Route Navigation Scroll Restoration (ScrollToTop)](#feat-012-spa-route-navigation-scroll-restoration-scrolltotop)
13. [FEAT-013: Production README, Zero-Warning ESLint & GitHub Actions CI/CD Pipeline](#feat-013-production-readme-zero-warning-eslint--github-actions-cicd-pipeline)
14. [FEAT-014: Monorepo Type-Check Resolution for Shared Package in CI](#feat-014-monorepo-type-check-resolution-for-shared-package-in-ci)
15. [FEAT-015: Docker Multi-Stage Build Fix & .dockerignore Implementation](#feat-015-docker-multi-stage-build-fix--dockerignore-implementation)

---

## FEAT-001: Monorepo & Tooling Foundation
- **ID**: `FEAT-001`
- **Status**: Completed
- **Created**: 2026-09-21
- **Description**: Configured an enterprise-grade `pnpm` monorepo structure separating frontend (`apps/web`), backend (`apps/api`), and shared libraries (`packages/shared`).
- **Files Involved**:
  - [`pnpm-workspace.yaml`](../../pnpm-workspace.yaml)
  - [`package.json`](../../package.json)
  - [`.gitignore`](../../.gitignore)
  - [`.env.example`](../../.env.example) & [`.env`](../../.env)
- **Implementation Details**:
  - Unified script commands at the root: `pnpm dev`, `pnpm build`, `pnpm db:push`, `pnpm db:seed`, `pnpm docker:up`.
  - Strict separation of concerns while allowing zero-overhead local package linking (`@avada/shared`).

---

## FEAT-002: Backend API & Prisma ORM Engine
- **ID**: `FEAT-002`
- **Status**: Completed
- **Created**: 2026-09-21
- **Description**: Node.js + TypeScript Express server with Prisma ORM connected to PostgreSQL database.
- **Files Involved**:
  - [`apps/api/package.json`](../../apps/api/package.json)
  - [`apps/api/tsconfig.json`](../../apps/api/tsconfig.json)
  - [`apps/api/prisma/schema.prisma`](../../apps/api/prisma/schema.prisma)
  - [`apps/api/prisma/seed.ts`](../../apps/api/prisma/seed.ts)
  - [`apps/api/src/server.ts`](../../apps/api/src/server.ts)
  - [`apps/api/src/prisma.ts`](../../apps/api/src/prisma.ts)
- **Implementation Details**:
  - Server listens on port `5005` (configured via `.env`).
  - Prisma client manages PostgreSQL tables: `User` and `ContentItem`.
  - Database seeder initializes initial administrator account (`admin@avada.com` / `admin123`) and initial CMS showcase content.

---

## FEAT-003: CMS Authentication & Content Endpoints
- **ID**: `FEAT-003`
- **Status**: Completed
- **Created**: 2026-09-21
- **Description**: Secure authentication endpoints and CMS content management APIs.
- **Files Involved**:
  - [`apps/api/src/middleware/auth.ts`](../../apps/api/src/middleware/auth.ts)
  - [`apps/api/src/routes/auth.routes.ts`](../../apps/api/src/routes/auth.routes.ts)
  - [`apps/api/src/routes/content.routes.ts`](../../apps/api/src/routes/content.routes.ts)
- **Endpoints**:
  - `GET /api/health` - Health check status
  - `POST /api/auth/login` - Admin credentials verification and JWT token generator
  - `GET /api/auth/me` - Validates JWT and retrieves authenticated admin profile
  - `GET /api/content` - Publicly retrieves published content items (or all items for admin)
  - `POST /api/content` - Authenticated creation of content items
  - `PUT /api/content/:id` - Authenticated update of content items
  - `DELETE /api/content/:id` - Authenticated removal of content items

---

## FEAT-004: Frontend Application & shadcn/ui Component System
- **ID**: `FEAT-004`
- **Status**: Completed
- **Created**: 2026-09-21
- **Description**: Vite + React 19 + TypeScript application with Tailwind CSS and `shadcn/ui` design system primitives.
- **Files Involved**:
  - [`apps/web/vite.config.ts`](../../apps/web/vite.config.ts)
  - [`apps/web/tailwind.config.js`](../../apps/web/tailwind.config.js)
  - [`apps/web/src/index.css`](../../apps/web/src/index.css)
  - [`apps/web/src/lib/utils.ts`](../../apps/web/src/lib/utils.ts)
  - [`apps/web/src/components/ui/*`](../../apps/web/src/components/ui/)
- **Implementation Details**:
  - Tailwind configured with Avada design tokens (border radius, primary, secondary, card, popover, accent, muted colors).
  - Reusable components built with `cva` and Radix primitives: `Button`, `Card`, `Input`, `Label`, `Badge`, `Table`.
  - Absolute path alias `@/` mapped to `src/`.

---

## FEAT-005: Marketing Website & CMS Admin Dashboard
- **ID**: `FEAT-005`
- **Status**: Completed
- **Created**: 2026-09-21
- **Description**: Full React Router v6 navigation structure hosting both the company marketing website and the CMS admin dashboard.
- **Files Involved**:
  - [`apps/web/src/App.tsx`](../../apps/web/src/App.tsx)
  - [`apps/web/src/context/AuthContext.tsx`](../../apps/web/src/context/AuthContext.tsx)
  - [`apps/web/src/components/Navbar.tsx`](../../apps/web/src/components/Navbar.tsx)
  - [`apps/web/src/components/Footer.tsx`](../../apps/web/src/components/Footer.tsx)
  - [`apps/web/src/pages/public/HomePage.tsx`](../../apps/web/src/pages/public/HomePage.tsx)
  - [`apps/web/src/pages/public/AboutPage.tsx`](../../apps/web/src/pages/public/AboutPage.tsx)
  - [`apps/web/src/pages/public/ServicesPage.tsx`](../../apps/web/src/pages/public/ServicesPage.tsx)
  - [`apps/web/src/pages/public/ContactPage.tsx`](../../apps/web/src/pages/public/ContactPage.tsx)
  - [`apps/web/src/pages/admin/AdminLoginPage.tsx`](../../apps/web/src/pages/admin/AdminLoginPage.tsx)
  - [`apps/web/src/pages/admin/AdminDashboardPage.tsx`](../../apps/web/src/pages/admin/AdminDashboardPage.tsx)
  - [`apps/web/src/pages/admin/AdminContentPage.tsx`](../../apps/web/src/pages/admin/AdminContentPage.tsx)
- **Implementation Details**:
  - Public marketing site features responsive Navbar, Hero section, Feature grids, Metrics counter, and dynamic CTA.
  - CMS dashboard features secure login, JWT storage in localStorage, statistics cards, and full Content Management data table.

---

## FEAT-006: Docker Containerization Ecosystem
- **ID**: `FEAT-006`
- **Status**: Completed
- **Created**: 2026-09-21
- **Description**: Complete multi-container Docker compose environment for PostgreSQL, Express API, and Vite SPA via Nginx.
- **Files Involved**:
  - [`docker-compose.yml`](../../docker-compose.yml)
  - [`docker/Dockerfile.api`](../../docker/Dockerfile.api)
  - [`docker/Dockerfile.web`](../../docker/Dockerfile.web)
  - [`docker/nginx.conf`](../../docker/nginx.conf)
- **Implementation Details**:
  - PostgreSQL container configured on host port `5435` with volume persistence.
  - Multi-stage Dockerfiles caching dependencies and generating lightweight production runtimes.

---

## FEAT-007: AI Agent Standard & Documentation Architecture
- **ID**: `FEAT-007`
- **Status**: Completed
- **Created**: 2026-09-21
- **Description**: AI guidance system enforcing rules, documentation updates, and styling constraints across all developer interactions.
- **Files Involved**:
  - [`AGENT.md`](../../AGENT.md)
  - [`docs/README.md`](../../docs/README.md)
  - [`docs/rules/frontend-styling-rules.md`](../rules/frontend-styling-rules.md)
  - [`docs/rules/backend-rules.md`](../rules/backend-rules.md)
  - [`docs/changelog/features-storage.md`](./features-storage.md)
  - [`docs/changelog/CHANGELOG.md`](./CHANGELOG.md)

---

## FEAT-008: AvadaPay Brand Alignment, Adobe XD Hero, Solution Pages & shadcn Select
- **ID**: `FEAT-008`
- **Status**: Completed
- **Created**: 2026-09-21
- **Description**: Rebranded website to authentic AvadaPay identity matching `avadapay.com` and Adobe XD design specs. Extracted official vector logos, implemented primary `#3BBA93`, built ambient card payment hero with metrics and sub-banner, added dedicated solution pages (`Payment Processing`, `POS`, `Bulk SMS`, `Country Hubs`), relocated CMS link to footer, and migrated native CMS selects to shadcn Select component.
- **Files Involved**:
  - [`apps/web/public/logo.svg`](../../apps/web/public/logo.svg)
  - [`apps/web/public/favicon.svg`](../../apps/web/public/favicon.svg)
  - [`apps/web/src/assets/hero-bg.jpg`](../../apps/web/src/assets/hero-bg.jpg)
  - [`apps/web/src/components/ui/select.tsx`](../../apps/web/src/components/ui/select.tsx)
  - [`apps/web/src/components/Navbar.tsx`](../../apps/web/src/components/Navbar.tsx)
  - [`apps/web/src/components/Footer.tsx`](../../apps/web/src/components/Footer.tsx)
  - [`apps/web/src/pages/public/HomePage.tsx`](../../apps/web/src/pages/public/HomePage.tsx)
  - [`apps/web/src/pages/public/PaymentProcessingPage.tsx`](../../apps/web/src/pages/public/PaymentProcessingPage.tsx)
  - [`apps/web/src/pages/public/PosPage.tsx`](../../apps/web/src/pages/public/PosPage.tsx)
  - [`apps/web/src/pages/public/BulkSmsPage.tsx`](../../apps/web/src/pages/public/BulkSmsPage.tsx)
  - [`apps/web/src/pages/public/CountryPage.tsx`](../../apps/web/src/pages/public/CountryPage.tsx)
  - [`apps/web/src/pages/admin/AdminContentPage.tsx`](../../apps/web/src/pages/admin/AdminContentPage.tsx)
  - [`apps/web/src/App.tsx`](../../apps/web/src/App.tsx)
  - [`apps/web/tailwind.config.js`](../../apps/web/tailwind.config.js)
  - [`apps/web/src/index.css`](../../apps/web/src/index.css)
- **Implementation Details**:
  - Hero section mirrors Adobe XD specifications: card-swipe ambient photography, headline highlighting "built for African markets", 3 key metrics (`99.9% uptime`, `17+ African markets`, `Mobile money + card + POS`), and translucent bottom description strip.
  - Header features turquoise `#3BBA93` capsule navbar and dedicated Country Selector dropdown routing to individual country pages for Kenya 🇰🇪, Rwanda 🇷🇼, and Tanzania 🇹🇿.
  - Native HTML `<select>` elements in CMS Admin replaced with full Radix-backed shadcn `Select` components.

---

## FEAT-009: Navbar Polish, Consistent #2A292D Backgrounds, Hero 23% Opacity Sub-banner & Solutions Alignment
- **ID**: `FEAT-009`
- **Status**: Completed
- **Created**: 2026-09-21
- **Description**: Refined the global navbar to a compact height (`h-16`), eliminated white navbar backgrounds on non-home pages by applying the authentic `#2A292D` background across all heroes and the sticky header, ensuring full visibility of the country selector across all views. Updated the home page hero sub-banner to exactly 23% opacity (`bg-black/[0.23]`). Aligned the layout, typography, and sections of `HomePage`, `PaymentProcessingPage`, `PosPage`, and `BulkSmsPage` directly with the user's full Adobe XD screenshots.
- **Files Involved**:
  - [`apps/web/src/components/Navbar.tsx`](../../apps/web/src/components/Navbar.tsx)
  - [`apps/web/src/pages/public/HomePage.tsx`](../../apps/web/src/pages/public/HomePage.tsx)
  - [`apps/web/src/pages/public/PaymentProcessingPage.tsx`](../../apps/web/src/pages/public/PaymentProcessingPage.tsx)
  - [`apps/web/src/pages/public/PosPage.tsx`](../../apps/web/src/pages/public/PosPage.tsx)
  - [`apps/web/src/pages/public/BulkSmsPage.tsx`](../../apps/web/src/pages/public/BulkSmsPage.tsx)
  - [`apps/web/src/pages/public/CountryPage.tsx`](../../apps/web/src/pages/public/CountryPage.tsx)
  - [`apps/web/src/pages/public/ContactPage.tsx`](../../apps/web/src/pages/public/ContactPage.tsx)
- **Implementation Details**:
  - Navbar uses `#2A292D` sticky background, keeping the country selector text and flag dropdown permanently clear and legible.
  - Home hero sub-banner formatted as `bg-black/[0.23] backdrop-blur-sm border-t border-white/10`.
  - Payment Processing, POS, and Bulk SMS pages updated with exact copy, 2-column layouts, green banners, and product breakdown grids from the user's screenshots.

---

## FEAT-010: Home Hero Background Image Visibility & Positive Z-Index Layering
- **ID**: `FEAT-010`
- **Status**: Completed
- **Created**: 2026-09-21
- **Description**: Resolved an issue where negative z-indexes (`-z-20`, `-z-10`) in `HomePage.tsx` caused the hero ambient card payment photography background to render underneath the body stacking context (`bg-background`). Transitioned background image rendering to direct ESM import (`heroBg`), positive z-indexing (`z-0` image and overlay, `z-10` content and sub-banner), and added `vite-env.d.ts` for Vite client image declarations.
- **Files Involved**:
  - [`apps/web/src/pages/public/HomePage.tsx`](../../apps/web/src/pages/public/HomePage.tsx)
  - [`apps/web/src/vite-env.d.ts`](../../apps/web/src/vite-env.d.ts)
- **Implementation Details**:
  - Direct import `import heroBg from '@/assets/hero-bg.jpg'` guarantees asset hashing and bundling by Vite.
  - Image placed inside an `absolute inset-0 z-0` wrapper with balanced `from-black/60 via-black/35 to-black/70` gradient overlay.
  - All interactive and textual content wrapped inside `relative z-10`.
  - Verified clean compilation with `pnpm --filter @avada/web build`.

---

## FEAT-011: Cross-Platform Vector Country Flags Component
- **ID**: `FEAT-011`
- **Status**: Completed
- **Created**: 2026-09-21
- **Description**: Replaced all Unicode country emoji flags (which fail to render as flags on Windows browsers and instead display as raw regional indicators "KE", "RW", "TZ" or broken glyphs) with a dedicated, lightweight, zero-dependency SVG vector flag component suite (`CountryFlag`, `FlagKenya`, `FlagRwanda`, `FlagTanzania`).
- **Files Involved**:
  - [`apps/web/src/components/CountryFlag.tsx`](../../apps/web/src/components/CountryFlag.tsx)
  - [`apps/web/src/components/Navbar.tsx`](../../apps/web/src/components/Navbar.tsx)
  - [`apps/web/src/components/Footer.tsx`](../../apps/web/src/components/Footer.tsx)
  - [`apps/web/src/pages/public/CountryPage.tsx`](../../apps/web/src/pages/public/CountryPage.tsx)
  - [`apps/web/src/pages/public/HomePage.tsx`](../../apps/web/src/pages/public/HomePage.tsx)
  - [`apps/web/src/pages/public/ContactPage.tsx`](../../apps/web/src/pages/public/ContactPage.tsx)
- **Implementation Details**:
  - Handcrafted authentic, compliant 3:2 SVG vector renderings for Kenya (black/white/red/white/green with Maasai shield & crossed spears), Rwanda (sky blue with 24-ray sun, yellow, green), and Tanzania (green/blue fields with diagonal yellow-bordered black band).
  - Integrated into Navbar dropdown trigger, desktop dropdown items, mobile navigation drawer, Footer market links, Home page Country Hub cards, Country market detail hero & office cards, and Contact page regional office directory.
  - Rendered with `rounded-[2px]`, subtle borders, and shadows to prevent white flag components from blending into light backgrounds.

---

## FEAT-012: SPA Route Navigation Scroll Restoration (ScrollToTop)
- **ID**: `FEAT-012`
- **Status**: Completed
- **Created**: 2026-09-21
- **Description**: Fixed the Single Page Application (React Router) issue where clicking links in the navbar or elsewhere from a scrolled page opened the destination page scrolled down at the exact same scroll position as the originating page. Implemented `ScrollToTop` component listening to location changes and instantly resetting window, documentElement, and body scroll coordinates to `(0, 0)`.
- **Files Involved**:
  - [`apps/web/src/components/ScrollToTop.tsx`](../../apps/web/src/components/ScrollToTop.tsx)
  - [`apps/web/src/App.tsx`](../../apps/web/src/App.tsx)
- **Implementation Details**:
  - Subscribes to `useLocation` (`pathname`, `search`, `hash`).
  - If a hash anchor is provided (e.g. `#section-id`), gracefully scrolls smoothly to the target element.
  - Embedded inside `AuthProvider` at the top level of `App.tsx` ensuring universal coverage across public and admin routes.

---

## FEAT-013: Production README, Zero-Warning ESLint & GitHub Actions CI/CD Pipeline
- **ID**: `FEAT-013`
- **Status**: Completed
- **Created**: 2026-09-21
- **Description**: Authored a production-grade repository `README.md` with badges, architecture blueprints, getting started guide, script table, and CI/CD workflow explanation. Configured ESLint 10 with TypeScript-ESLint, clean ESM flat config, and zero-warning codebase compliance. Implemented `.github/workflows/ci.yml` running lint, type-check, and build on all PRs and pushes to main, with automated multi-stage Docker image builds pushed to GitHub Container Registry (`ghcr.io`) strictly on direct pushes to `main`.
- **Files Involved**:
  - [`README.md`](../../README.md)
  - [`.github/workflows/ci.yml`](../../.github/workflows/ci.yml)
  - [`eslint.config.js`](../../eslint.config.js)
  - [`package.json`](../../package.json)
  - [`packages/shared/package.json`](../../packages/shared/package.json)
  - [`apps/api/package.json`](../../apps/api/package.json)
  - [`apps/web/package.json`](../../apps/web/package.json)
  - [`apps/web/vite.config.js`](../../apps/web/vite.config.js)
  - [`apps/web/src/components/ui/input.tsx`](../../apps/web/src/components/ui/input.tsx)
  - [`packages/shared/src/index.ts`](../../packages/shared/src/index.ts)
  - [`apps/api/src/middleware/auth.ts`](../../apps/api/src/middleware/auth.ts)
  - [`apps/api/src/routes/content.routes.ts`](../../apps/api/src/routes/content.routes.ts)
  - [`apps/web/src/pages/admin/AdminContentPage.tsx`](../../apps/web/src/pages/admin/AdminContentPage.tsx)
  - [`apps/web/src/pages/admin/AdminLoginPage.tsx`](../../apps/web/src/pages/admin/AdminLoginPage.tsx)
- **Implementation Details**:
  - Root `package.json` specifies `"type": "module"` and defines top-level scripts `pnpm lint`, `pnpm type-check`, and `pnpm build`.
  - All workspaces feature dedicated `type-check` scripts (`tsc --noEmit` and `tsc -b`).
  - GitHub Actions workflow runs `checks` job on `pull_request` and `push` to `main`, and `docker-build-push` job targeting `ghcr.io/jusish/avada-website/api` and `ghcr.io/jusish/avada-website/web` guarded by `if: github.event_name == 'push' && github.ref == 'refs/heads/main'`.

---

## FEAT-014: Monorepo Type-Check Resolution for Shared Package in CI
- **ID**: `FEAT-014`
- **Status**: Completed
- **Created**: 2026-09-21
- **Description**: Resolved an issue where running `pnpm type-check` on a fresh CI clone failed because `@avada/shared` had not yet produced `./dist/index.d.ts`. Configured direct source path mapping in `apps/web/tsconfig.json` and Vite alias in `apps/web/vite.config.js`, added package.json `exports` definitions, ensured `type-check` script builds `@avada/shared` before running workspace checks, and added a dedicated `Build Shared Package` step in `.github/workflows/ci.yml`.
- **Files Involved**:
  - [`apps/web/tsconfig.json`](../../apps/web/tsconfig.json)
  - [`apps/web/vite.config.js`](../../apps/web/vite.config.js)
  - [`packages/shared/package.json`](../../packages/shared/package.json)
  - [`package.json`](../../package.json)
  - [`.github/workflows/ci.yml`](../../.github/workflows/ci.yml)
- **Implementation Details**:
  - `apps/web/tsconfig.json` maps `"@avada/shared": ["../../packages/shared/src/index.ts"]`.
  - `package.json` updates `"type-check"` to `"pnpm --filter @avada/shared build && pnpm --recursive --filter \"@avada/*\" type-check"`.
  - `.github/workflows/ci.yml` introduces `run: pnpm --filter @avada/shared build` directly following `pnpm install`.

---

## FEAT-015: Docker Multi-Stage Build Fix & .dockerignore Implementation
- **ID**: `FEAT-015`
- **Status**: Completed
- **Created**: 2026-09-21
- **Description**: Fixed Docker build failure caused by missing `.dockerignore` (which allowed host `node_modules` and symlinks to overwrite container Linux packages) and ephemeral `pnpm dlx prisma generate` (which fetched incompatible Node 22 CLI versions instead of using installed devDependencies). Added `.dockerignore`, upgraded Dockerfiles to `node:22-alpine` with `openssl` and `libc6-compat`, and executed `pnpm run prisma:generate` with full workspace manifests.
- **Files Involved**:
  - [`.dockerignore`](../../.dockerignore)
  - [`docker/Dockerfile.api`](../../docker/Dockerfile.api)
  - [`docker/Dockerfile.web`](../../docker/Dockerfile.web)
- **Implementation Details**:
  - Created `.dockerignore` ignoring `node_modules`, `**/node_modules`, `dist`, `build`, and logs.
  - Upgraded base image in `Dockerfile.api` and `Dockerfile.web` to `node:22-alpine` with `openssl` and `libc6-compat`.
  - Replaced `pnpm dlx prisma generate` with `pnpm run prisma:generate`.
  - Tested and verified clean local builds for both `Dockerfile.api` and `Dockerfile.web` with exit code 0.








