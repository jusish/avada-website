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
16. [FEAT-016: Modern Fintech Sizing & Proportions for Home Page](#feat-016-modern-fintech-sizing--proportions-for-home-page)
17. [FEAT-017: Comprehensive Pan-African POS Solutions Page (PosPage)](#feat-017-comprehensive-pan-african-pos-solutions-page-pospage)
18. [FEAT-018: High-Throughput Bulk SMS Platform Page with Interactive Cost Calculator (BulkSmsPage)](#feat-018-high-throughput-bulk-sms-platform-page-with-interactive-cost-calculator-bulksmspage)
19. [FEAT-019: Dedicated Contact & Technical Inquiry Page (ContactPage)](#feat-019-dedicated-contact--technical-inquiry-page-contactpage)
20. [FEAT-020: Pixel-Perfect Dedicated Country Pages (Kenya, Rwanda, and Tanzania)](#feat-020-pixel-perfect-dedicated-country-pages-kenya-rwanda-and-tanzania)
21. [FEAT-021: Enterprise CMS Platform, Visual RBAC Matrix, Real-Time Security Telemetry & Shadcn UI Standardization](#feat-021-enterprise-cms-platform-visual-rbac-matrix-real-time-security-telemetry--shadcn-ui-standardization)
22. [FEAT-022: Direct Country Permalinks, Rwanda BHC Office Location & Country-Specific Footer Scoping](#feat-022-direct-country-permalinks-rwanda-bhc-office-location--country-specific-footer-scoping)
23. [FEAT-023: Global WebP Image Optimization Pipeline, Critical Hero Preloading & Framer Motion Scroll Suite](#feat-023-global-webp-image-optimization-pipeline-critical-hero-preloading--framer-motion-scroll-suite)
24. [FEAT-024: Enterprise SEO Infrastructure, Sitelinks Schema, Multi-Res App Icons & Domain Scoping](#feat-024-enterprise-seo-infrastructure-sitelinks-schema-multi-res-app-icons--domain-scoping)
25. [FEAT-025: Intermediate Proxy Robots.txt Resolution & Legacy Asset Synchronization](#feat-025-intermediate-proxy-robotstxt-resolution--legacy-asset-synchronization)

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









---

## FEAT-016: Modern Fintech Sizing & Proportions for Home Page
- **ID**: `FEAT-016`
- **Status**: Completed
- **Created**: 2026-10-07
- **Description**: Refactored the Home page typography and spacing to realistic, sleek fintech proportions. Reduced oversized marquee typography (from 112px down to 36-44px), scaled vector flags (from 90px to 48-56px), streamlined hero text, and balanced padding across all sections.
- **Files Involved**:
  - [`apps/web/src/pages/public/HomePage.tsx`](../../apps/web/src/pages/public/HomePage.tsx)
  - [`apps/web/src/components/home/CircleFlags.tsx`](../../apps/web/src/components/home/CircleFlags.tsx)
- **Implementation Details**:
  - Scaled paper plane icon and marquee text for smooth responsive display across mobile and desktop.
  - Normalized card paddings (`p-6 sm:p-7`) and button heights (`h-9` to `h-11`).
  - Preserved all screenshot layout elements (Hero, Marquee, Four Ways, Why Teams Build, Industries Accordion, Flags, Dubai HQ Map + Country offices, Partner marquees).

---

## FEAT-017: Comprehensive Pan-African POS Solutions Page (PosPage)
- **ID**: `FEAT-017`
- **Status**: Completed
- **Created**: 2026-10-07
- **Description**: Engineered the complete AvadaPay POS platform page strictly adhering to design screenshots `POS-1.png` through `POS-9.png`.
- **Files Involved**:
  - [`apps/web/src/pages/public/PosPage.tsx`](../../apps/web/src/pages/public/PosPage.tsx)
  - [`apps/web/src/components/Footer.tsx`](../../apps/web/src/components/Footer.tsx)
- **Implementation Details**:
  - **Hero & Payment Rails Sub-Strip**: High-converting hero with live POS terminal graphic, 4G dual-SIM status, KES amount preview, and horizontal divided strip for `Debit cards`, `Credit cards`, `QR Payments`, `Mobile money`, and `In person (cash) payments`.
  - **Three Payment Modes**: Photo cards for Soft POS (NFC phone app), Smart POS (dedicated Android terminal with thermal printer), and Enterprise Payment APIs (ERP/cash register integration).
  - **Industries Accordion**: 6 African industry use cases (Retail, Hospitality, Healthcare, Education, Transportation, Government & NGOs).
  - **Dashboard Ecosystem Schematic**: Visual architecture diagram demonstrating central AvadaPay engine routing between gross sales analytics, ERP checkout triggers, PCI-DSS encryption, and API responses.
  - **Connected Pillars**: Real-time monitoring, User & access management, and Business intelligence connected by dotted line indicators.
  - **Security Ticker Banner**: Full-width mint-green banner highlighting PCI-DSS compliance, device authentication, RBAC, fraud monitoring, and encrypted communications.
  - **Photo Banner**: Merchant reviewing financial report (`/media/report_reader.jpg`).
  - **Go-Live Timeline & Pricing Matrix**: 3-column structured comparisons for SoftPOS (24-48h), Smart POS (3-7 days), and Enterprise (project-based), with inquiry action triggers.

---

## FEAT-018: High-Throughput Bulk SMS Platform Page with Interactive Cost Calculator (BulkSmsPage)
- **ID**: `FEAT-018`
- **Status**: Completed
- **Created**: 2026-10-07
- **Description**: Developed the AvadaPay Bulk SMS platform page matching design screenshots `BS-1.png` through `BS-7.png`, featuring a live SMS gateway simulator and an interactive SMS cost calculator.
- **Files Involved**:
  - [`apps/web/src/pages/public/BulkSmsPage.tsx`](../../apps/web/src/pages/public/BulkSmsPage.tsx)
  - [`apps/web/src/components/Footer.tsx`](../../apps/web/src/components/Footer.tsx)
- **Implementation Details**:
  - **Hero**: Sub-2s latency SMS gateway terminal simulation showing delivered OTP and payment notification receipts.
  - **Message Types Grid**: 6 categories divided into clean border cells (Transactional SMS, OTPs & 2FA with mint highlight, Reminders, Marketing campaigns, Service notifications, Payments + SMS).
  - **Why Teams Use AvadaPay SMS**: 5 photo cards with real imagery (`bs_network.jpg`, `bs_volume.jpg`, `bs_reports.jpg`, `nfc_payment.jpg`, `bs_integrate.jpg`).
  - **Industry Use Cases Accordion**: 7 sectors (Banking & fintech, Lending & SACCOs, E-commerce, Education, Healthcare, Retail, Government & NGOs).
  - **Interactive Pricing Calculator**: Dynamic country switcher with vector flags (Kenya, DRC, Tanzania, Rwanda, Uganda), volume presets and range slider (10k to 2M+), live per-message rate calculation with enterprise volume discounts, estimated monthly spend breakdown, and direct checkout link.

---

## FEAT-019: Dedicated Contact & Technical Inquiry Page (ContactPage)
- **ID**: `FEAT-019`
- **Status**: Completed
- **Created**: 2026-10-07
- **Description**: Rebuilt the Contact page strictly following design screenshots `Co-1.png` through `Co-3.png`.
- **Files Involved**:
  - [`apps/web/src/pages/public/ContactPage.tsx`](../../apps/web/src/pages/public/ContactPage.tsx)
  - [`apps/web/src/components/Navbar.tsx`](../../apps/web/src/components/Navbar.tsx)
  - [`apps/web/src/components/Footer.tsx`](../../apps/web/src/components/Footer.tsx)
- **Implementation Details**:
  - Clean light background matching the official design specs, with a green headphone icon header.
  - Polished contact form featuring green focus borders (`border-[#3BBA93]`), full name, company, role, country dropdown, inquiry type dropdown, message textarea, and submission feedback state.
  - Accessible Radix UI `Select` components replacing native selects per styling guidelines.
  - Automatic query param parsing (`?inquiry=...` and `?country=...`) allowing seamless deep-linking from product buttons.
  - Dedicated "Need API or Integration Support?" section with a technical inquiry action trigger.
  - Seamless navigation and footer integration with light navbar styling and contextual CTA suppression.

---

## FEAT-020: Pixel-Perfect Dedicated Country Pages (Kenya, Rwanda, and Tanzania)
- **ID**: `FEAT-020`
- **Status**: Completed
- **Created**: 2026-10-07
- **Description**: Implemented individual, highly authentic country landing pages for Kenya, Rwanda, and Tanzania matching the exact user design screenshots (`KE-1.png` - `KE-7.png`, `RW-1.png` - `RW-8.png`, and `TZ-1.png` - `TZ-7.png`).
- **Files Involved**:
  - [`apps/web/src/pages/public/CountryPage.tsx`](../../apps/web/src/pages/public/CountryPage.tsx)
  - [`apps/web/src/pages/public/KenyaPage.tsx`](../../apps/web/src/pages/public/KenyaPage.tsx)
  - [`apps/web/src/pages/public/RwandaPage.tsx`](../../apps/web/src/pages/public/RwandaPage.tsx)
  - [`apps/web/src/pages/public/TanzaniaPage.tsx`](../../apps/web/src/pages/public/TanzaniaPage.tsx)
  - [`apps/web/src/components/Navbar.tsx`](../../apps/web/src/components/Navbar.tsx)
  - [`apps/web/src/components/Footer.tsx`](../../apps/web/src/components/Footer.tsx)
- **Implementation Details**:
  - **Dynamic Routing**: Re-architected `CountryPage.tsx` to route dynamically between dedicated components (`KenyaPage`, `RwandaPage`, `TanzaniaPage`), preserving deep-link URLs (`/countries/kenya`, `/countries/rwanda`, `/countries/tanzania`).
  - **Kenya Page (`KE-1` - `KE-7`)**:
    - Hero with CBK-compliant real-time payment feed and framed panel.
    - "Built for how Kenya actually pays" section with high-res Nairobi city skyline aerial photography (`/media/nairobi-skyline.jpg`).
    - 6-pill payment badge grid for M-Pesa & Airtel Money, STK Push/Paybill/Till numbers, cards, links, APIs, and real-time confirmation.
    - Dual feature cards with photography: batch payouts (`/media/kenya-pay-agents.jpg`) and bulk SMS communications (`/media/kenya-sms-comm.jpg`).
    - 6-industry interactive accordion (Microfinance, E-commerce, Gaming & betting, Schools, Services, Retail).
    - 4 benefit cards (Instant confirmation, Local team/office, Volume pricing, Fast onboarding).
    - Nairobi office card with Westpark Towers, Westlands map (`/media/nairobi-map.jpg`) and meeting booking trigger.
  - **Rwanda Page (`RW-1` - `RW-8`)**:
    - Hero with NBR/RURA-compliant live payment feed and framed panel.
    - "Built for Rwanda's cashless push" section with illuminated Kigali Convention Centre night aerial photography (`/media/kigali-skyline.jpg`).
    - Alternating vertical timeline ("From payment to confirmation, without the guesswork") featuring concentric circular teal nodes.
    - 6-pillar white card grid on `#3BBA93` teal background (Mobile money, Cards, POS, Bulk SMS, APIs, Payouts).
    - System integration section and 4 "Why AvadaPay in Rwanda" cards.
    - Kigali regional hub office card with meeting booking trigger.
  - **Tanzania Page (`TZ-1` - `TZ-7`)**:
    - Hero with BOT/TCRA live stream preview and framed panel.
    - "One Platform for all your payment needs" section with turquoise coastal Dar es Salaam aerial banner (`/media/tanzania-coast.jpg`).
    - Multi-telco logos row featuring Airtel, Halopesa, Vodacom, and Tigo Money (`/media/tz-telecom-logos.png`).
    - 3 numbered feature cards for network coverage, batch payouts, and customer SMS updates.
    - Real-time visibility table container with live multi-telco transaction stream across Vodacom M-Pesa, Tigo Pesa, Airtel Money, and HaloPesa.
    - 4 "Why Tanzanian businesses choose AvadaPay" cards.
    - Dar es Salaam office hub card with meeting booking trigger.
  - **Navbar Flag Indicators**: Added active country flag display in the top navigation bar when viewing country routes.
  - **Footer Contextual CTAs**: Registered tailored headline and button CTAs for each country in `Footer.tsx`.

---

## FEAT-021: Enterprise CMS Platform, Visual RBAC Matrix, Real-Time Security Telemetry & Shadcn UI Standardization
- **ID**: `FEAT-021`
- **Status**: Completed
- **Created**: 2026-10-08
- **Description**: Full-scale Enterprise CMS platform featuring visual Role-Based Access Control (RBAC), dynamic country and office location management, customer inquiry CRM with unread tracking, legal policy engine, live telemetry diagnostics, site footer and social media settings, and complete UI standardization using shadcn/ui primitives.
- **Files Involved**:
  - [`packages/shared/src/types/index.ts`](../../packages/shared/src/types/index.ts)
  - [`apps/api/prisma/schema.prisma`](../../apps/api/prisma/schema.prisma)
  - [`apps/api/src/server.ts`](../../apps/api/src/server.ts)
  - [`apps/api/src/routes/roles.routes.ts`](../../apps/api/src/routes/roles.routes.ts)
  - [`apps/api/src/routes/countries.routes.ts`](../../apps/api/src/routes/countries.routes.ts)
  - [`apps/api/src/routes/inquiry-types.routes.ts`](../../apps/api/src/routes/inquiry-types.routes.ts)
  - [`apps/api/src/routes/inquiries.routes.ts`](../../apps/api/src/routes/inquiries.routes.ts)
  - [`apps/api/src/routes/policies.routes.ts`](../../apps/api/src/routes/policies.routes.ts)
  - [`apps/api/src/routes/settings.routes.ts`](../../apps/api/src/routes/settings.routes.ts)
  - [`apps/api/src/routes/analytics.routes.ts`](../../apps/api/src/routes/analytics.routes.ts)
  - [`apps/api/src/routes/audit-logs.routes.ts`](../../apps/api/src/routes/audit-logs.routes.ts)
  - [`apps/api/src/routes/users.routes.ts`](../../apps/api/src/routes/users.routes.ts)
  - [`apps/web/src/components/AdminSidebar.tsx`](../../apps/web/src/components/AdminSidebar.tsx)
  - [`apps/web/src/components/AdminPermissionGuard.tsx`](../../apps/web/src/components/AdminPermissionGuard.tsx)
  - [`apps/web/src/components/ui/dialog.tsx`](../../apps/web/src/components/ui/dialog.tsx)
  - [`apps/web/src/pages/admin/AdminDashboardPage.tsx`](../../apps/web/src/pages/admin/AdminDashboardPage.tsx)
  - [`apps/web/src/pages/admin/AdminRolesPage.tsx`](../../apps/web/src/pages/admin/AdminRolesPage.tsx)
  - [`apps/web/src/pages/admin/AdminCountriesPage.tsx`](../../apps/web/src/pages/admin/AdminCountriesPage.tsx)
  - [`apps/web/src/pages/admin/AdminInquiriesPage.tsx`](../../apps/web/src/pages/admin/AdminInquiriesPage.tsx)
  - [`apps/web/src/pages/admin/AdminInquiryTypesPage.tsx`](../../apps/web/src/pages/admin/AdminInquiryTypesPage.tsx)
  - [`apps/web/src/pages/admin/AdminPoliciesPage.tsx`](../../apps/web/src/pages/admin/AdminPoliciesPage.tsx)
  - [`apps/web/src/pages/admin/AdminSecurityPage.tsx`](../../apps/web/src/pages/admin/AdminSecurityPage.tsx)
  - [`apps/web/src/pages/admin/AdminSettingsPage.tsx`](../../apps/web/src/pages/admin/AdminSettingsPage.tsx)
  - [`apps/web/src/pages/admin/AdminUsersPage.tsx`](../../apps/web/src/pages/admin/AdminUsersPage.tsx)
- **Implementation Details**:
  - **Visual Permission Manager (RBAC)**: Visual permission editor covering 10 modules (`roles`, `users`, `countries`, `inquiry_types`, `inquiries`, `articles`, `policies`, `settings`, `insights`, `audit_logs`). Each module provides independent `view` and `edit` capabilities enforced by `requirePermission` backend middleware and frontend `AdminPermissionGuard`.
  - **Dynamic Country & Office Management**: Allows creating, editing, and disabling countries, updating office addresses, phone numbers, emails, and head office coordinates for rendering live interactive maps.
  - **Inquiry Types & Customer Inquiries CRM**: Categorization of incoming inquiries, unread badge counters, status workflow (`UNREAD`, `READ`, `CONTACTED`, `RESOLVED`), and internal handler notes.
  - **Legal Policies Engine**: In-browser Markdown editing of legal documents (Terms of Service, Privacy Policy, Cookie Policy) with version history tracking, effective dates, and public legal route rendering (`/legal/:slug`).
  - **Footer & Social Links Configuration**: Centralized editing of footer contact information and social media links with customizable link target behaviors (`_blank` vs `_self`).
  - **Availability & Threat Diagnostics**: Diagnostic endpoint at `/api/admin/analytics/security` and `/api/admin/security/diagnostic` reporting real PostgreSQL query latency, telemetry counts, threat feeds, memory usage, and TLS 1.3 status.
  - **Design System Polish (shadcn/ui)**: Replaced all native `<select>` tags and custom modal overlays with Radix `Select` and `Dialog`. Standardized card corners to `rounded-xl` and removed unnecessary `uppercase` Tailwind styles.

---

## FEAT-022: Direct Country Permalinks, Rwanda BHC Office Location & Country-Specific Footer Scoping
- **ID**: `FEAT-022`
- **Status**: Completed
- **Created**: 2026-10-16
- **Description**: Migrated national landing page URLs from nested `/countries/:countrySlug` paths to top-level clean permalinks (`/kenya`, `/rwanda`, `/tanzania`), configured automatic backward-compatible redirects from legacy `/countries/*` URLs, updated Rwanda's official corporate headquarters location to BHC Building in Kacyiru, Gasabo, Kigali across all public pages and seeds, and refined the global footer so generic solutions and legal pages omit Dubai contact details while localized country pages display each market's respective office contact credentials.
- **Files Involved**:
  - [`apps/web/src/App.tsx`](../../apps/web/src/App.tsx)
  - [`apps/web/src/components/Navbar.tsx`](../../apps/web/src/components/Navbar.tsx)
  - [`apps/web/src/components/Footer.tsx`](../../apps/web/src/components/Footer.tsx)
  - [`apps/web/src/pages/public/HomePage.tsx`](../../apps/web/src/pages/public/HomePage.tsx)
  - [`apps/web/src/pages/public/RwandaPage.tsx`](../../apps/web/src/pages/public/RwandaPage.tsx)
  - [`apps/web/src/pages/admin/AdminCountriesPage.tsx`](../../apps/web/src/pages/admin/AdminCountriesPage.tsx)
  - [`apps/api/prisma/seed.ts`](../../apps/api/prisma/seed.ts)
  - [`apps/api/src/routes/analytics.routes.ts`](../../apps/api/src/routes/analytics.routes.ts)
  - [`README.md`](../../README.md)
  - [`docs/rules/frontend-styling-rules.md`](../../docs/rules/frontend-styling-rules.md)
- **Implementation Details**:
  - **Rwanda Office Location Modernization**: Updated Rwanda office location to `BHC Building, KG 7 Ave Kacyiru, Gasabo, Kigali, Rwanda` on `HomePage.tsx` (Regional Presence office directory) and `RwandaPage.tsx` (dedicated office section and Google Maps embed `src`). Synchronized Prisma database seeder (`apps/api/prisma/seed.ts`) with updated location coordinates and map embed links.
  - **Clean Country Permalinks (`/kenya`, `/rwanda`, `/tanzania`)**: Replaced all `/countries/:countrySlug` routes with clean top-level permalinks (`/:countrySlug`) in React Router v6. Added an automatic `CountryRedirect` component that seamlessly navigates legacy `/countries/:countrySlug` deep links to the new permalinks without 404 errors. Updated Navbar country dropdown links, HomePage office action buttons, and Admin CMS public preview links.
  - **Context-Aware Footer Scoping**: Reconfigured `Footer.tsx` so global contact information (Dubai HQ address, global phone) appears exclusively on the Home page (`/`). Country pages (`/kenya`, `/rwanda`, `/tanzania`, or dynamic CMS markets) dynamically render that country's dedicated office credentials. Generic solution pages (`/payment-processing`, `/pos`, `/bulk-sms`), contact, and legal policy pages omit the global contact column and smoothly format into a clean two-column layout (`Useful links` and `Legal & Compliance`).

---

## FEAT-023: Global WebP Image Optimization Pipeline, Critical Hero Preloading & Framer Motion Scroll Suite
- **ID**: `FEAT-023`
- **Status**: Completed
- **Created**: 2026-10-19
- **Description**: Implemented an automated WebP image conversion and optimization pipeline reducing total media payload by 88% (from 10.97 MB to 1.36 MB, with hero background slashed from 595 KB to 35.7 KB), added critical hero image preloading with background fallback in index.html, introduced reusable `<OptimizedImage>` with smooth fade-in and WebP fallbacks, and engineered a complete Framer Motion suite (`FadeIn`, `StaggerContainer`, `StaggerItem`, `HoverScale`) across all marketing and country landing pages to eliminate boring static scrolling and deliver fluid, responsive micro-interactions.
- **Files Involved**:
  - [`apps/web/scripts/optimize-images.mjs`](../../apps/web/scripts/optimize-images.mjs)
  - [`apps/web/package.json`](../../apps/web/package.json)
  - [`apps/web/index.html`](../../apps/web/index.html)
  - [`apps/web/src/components/ui/OptimizedImage.tsx`](../../apps/web/src/components/ui/OptimizedImage.tsx)
  - [`apps/web/src/components/motion/Motion.tsx`](../../apps/web/src/components/motion/Motion.tsx)
  - [`apps/web/src/pages/public/HomePage.tsx`](../../apps/web/src/pages/public/HomePage.tsx)
  - [`apps/web/src/components/product/shared.tsx`](../../apps/web/src/components/product/shared.tsx)
  - [`apps/web/src/pages/public/PaymentProcessingPage.tsx`](../../apps/web/src/pages/public/PaymentProcessingPage.tsx)
  - [`apps/web/src/pages/public/PosPage.tsx`](../../apps/web/src/pages/public/PosPage.tsx)
  - [`apps/web/src/pages/public/BulkSmsPage.tsx`](../../apps/web/src/pages/public/BulkSmsPage.tsx)
  - [`apps/web/src/pages/public/KenyaPage.tsx`](../../apps/web/src/pages/public/KenyaPage.tsx)
  - [`apps/web/src/pages/public/RwandaPage.tsx`](../../apps/web/src/pages/public/RwandaPage.tsx)
  - [`apps/web/src/pages/public/TanzaniaPage.tsx`](../../apps/web/src/pages/public/TanzaniaPage.tsx)
  - [`docs/changelog/CHANGELOG.md`](../../docs/changelog/CHANGELOG.md)
  - [`docs/changelog/features-storage.md`](../../docs/changelog/features-storage.md)
- **Implementation Details**:
  - **Automated WebP Conversion Pipeline (`optimize-images.mjs`)**: Script utilizing `sharp` to traverse all raster imagery in `public/media/`, `public/`, and `src/assets/`, generating high-quality modern WebP equivalents (`effort: 6`, `quality: 80-82`). Slashed public media payload from 10.97 MB down to 1.36 MB (-88%), while reducing the hero background image from 595 KB down to 35.7 KB (-94%).
  - **Zero-Latency Hero Rendering & Preload**: Configured `<link rel="preload" as="image" href="/hero-bg.webp" type="image/webp" fetchpriority="high" />` in `index.html` and pinned `#0B132B` background fallback to eliminate any white flash or delayed image rendering on page load.
  - **Reusable `<OptimizedImage>` Component**: Encapsulates `<picture>` with WebP sources, standard fallback `src`, `loading="lazy"` / `loading="eager"`, `fetchpriority="high"`, and smooth opacity transition upon load to prevent layout shifts.
  - **Framer Motion Integration Suite (`Motion.tsx`)**: Built modular animation primitives:
    - `FadeIn`: Scroll-triggered directional reveals (up, down, left, right) utilizing standard custom cubic-bezier easing (`easeOutQuint: [0.22, 1, 0.36, 1]`) and `viewport={{ once: true, margin: '-60px' }}`.
    - `StaggerContainer` & `StaggerItem`: Orchestrated staggered entrance animations for grids, card lists, badges, and pillars.
    - `HoverScale`: Interactive elevation micro-interactions on interactive cards and containers.
  - **Public Page Transitions & Scroll Polish**:
    - `HomePage.tsx`: Added entrance choreography for the headline, sub-banner, metrics, staggered 4-pillars grid, reasons cards, FAQ accordion items, and regional offices.
    - `ProductHero` (`shared.tsx`): Integrated scroll reveal across all product hero sections (`PaymentProcessingPage`, `PosPage`, `BulkSmsPage`).
    - `PaymentProcessingPage.tsx`: Animated payment method cards, integration workflow steps, and value proposition cards.
    - `PosPage.tsx`: Staggered POS hardware modes, interactive reader preview with WebP asset, and timeline deployment cards.
    - `BulkSmsPage.tsx`: Motion-enhanced SMS feature highlights, SMS cost calculator card, and telecommunications network badges.
    - `KenyaPage.tsx`, `RwandaPage.tsx`, `TanzaniaPage.tsx`: Priority-loaded skyline graphics, staggered national payment rails, strategic pillars, and localized contact offices.

---

## FEAT-024: Enterprise SEO Infrastructure, Sitelinks Schema, Multi-Res App Icons & Domain Scoping
- **ID**: `FEAT-024`
- **Status**: Completed
- **Created**: 2026-10-19
- **Description**: Implemented end-to-end enterprise search engine optimization (SEO) architecture for `https://avadapay.com`. Standardized the brand title to "Avadapay", added Google Search Console domain verification `<meta>`, created a high-resolution automated app icon generation pipeline generating Google-compliant 48px multiple favicons and 1200x630 Open Graph banners, authored `robots.txt`, `sitemap.xml`, and web app manifest, built a dynamic per-route `<SEO>` component managing titles, canonical URLs, and specialized Schema.org structured data, embedded site-wide Organization, WebSite, and Sitelinks JSON-LD schemas, and scoped production container orchestration in `docker-compose.yml` to focus exclusively on `avadapay.com`.
- **Files Involved**:
  - [`apps/web/index.html`](../../apps/web/index.html)
  - [`apps/web/scripts/generate-seo-assets.mjs`](../../apps/web/scripts/generate-seo-assets.mjs)
  - [`apps/web/public/manifest.json`](../../apps/web/public/manifest.json)
  - [`apps/web/public/robots.txt`](../../apps/web/public/robots.txt)
  - [`apps/web/public/sitemap.xml`](../../apps/web/public/sitemap.xml)
  - [`apps/web/public/favicon-48x48.png`](../../apps/web/public/favicon-48x48.png)
  - [`apps/web/public/favicon-96x96.png`](../../apps/web/public/favicon-96x96.png)
  - [`apps/web/public/favicon-192x192.png`](../../apps/web/public/favicon-192x192.png)
  - [`apps/web/public/favicon-512x512.png`](../../apps/web/public/favicon-512x512.png)
  - [`apps/web/public/apple-touch-icon.png`](../../apps/web/public/apple-touch-icon.png)
  - [`apps/web/public/logo-512.png`](../../apps/web/public/logo-512.png)
  - [`apps/web/public/logo-horizontal.png`](../../apps/web/public/logo-horizontal.png)
  - [`apps/web/public/og-image.png`](../../apps/web/public/og-image.png)
  - [`apps/web/src/components/seo/SEO.tsx`](../../apps/web/src/components/seo/SEO.tsx)
  - [`apps/web/src/pages/public/HomePage.tsx`](../../apps/web/src/pages/public/HomePage.tsx)
  - [`apps/web/src/pages/public/PaymentProcessingPage.tsx`](../../apps/web/src/pages/public/PaymentProcessingPage.tsx)
  - [`apps/web/src/pages/public/PosPage.tsx`](../../apps/web/src/pages/public/PosPage.tsx)
  - [`apps/web/src/pages/public/BulkSmsPage.tsx`](../../apps/web/src/pages/public/BulkSmsPage.tsx)
  - [`apps/web/src/pages/public/RwandaPage.tsx`](../../apps/web/src/pages/public/RwandaPage.tsx)
  - [`apps/web/src/pages/public/KenyaPage.tsx`](../../apps/web/src/pages/public/KenyaPage.tsx)
  - [`apps/web/src/pages/public/TanzaniaPage.tsx`](../../apps/web/src/pages/public/TanzaniaPage.tsx)
  - [`apps/web/src/pages/public/ContactPage.tsx`](../../apps/web/src/pages/public/ContactPage.tsx)
  - [`apps/web/src/pages/public/LegalPolicyPage.tsx`](../../apps/web/src/pages/public/LegalPolicyPage.tsx)
  - [`apps/web/src/pages/public/CountryPage.tsx`](../../apps/web/src/pages/public/CountryPage.tsx)
  - [`docker-compose.yml`](../../docker-compose.yml)
  - [`docs/changelog/CHANGELOG.md`](../../docs/changelog/CHANGELOG.md)
  - [`docs/changelog/features-storage.md`](../../docs/changelog/features-storage.md)
- **Implementation Details**:
  - **Brand & Google Search Console Verification**: Updated the root `<title>` to `Avadapay | Global Financial Infrastructure & Technology` and added the domain verification token `<meta name="google-site-verification" content="Srp7mYBgNAKzIapbFT_FhIJ35vGpdhCHxNRiHbymPwA" />`.
  - **Automated High-Resolution Asset Generation (`generate-seo-assets.mjs`)**: Leveraged `sharp` to compile vector SVG source files into raster PNG icons satisfying Google Search guidelines (including 48px multiples for Google search mobile/desktop snippets), Apple touch icons, square logo for Schema.org organization cards, and a branded 1200x630 Open Graph card with dark navy `#0B132B` backdrop and emerald `#3BBA93` accenting.
  - **Search Engine Discovery Protocols**:
    - Created `robots.txt` declaring open access to all public content while preventing indexing of administrative CRM and API endpoints, establishing `Host: https://avadapay.com` and referencing the sitemap.
    - Created `sitemap.xml` listing all canonical public landing, solution, country, and legal compliance pages with accurate change frequencies and priorities.
    - Created `manifest.json` defining progressive web application metadata with `#0B132B` theme and background colors.
  - **Sitelinks & Rich Schema.org JSON-LD Suite**: Added complete structured data in `index.html` featuring:
    - `Organization`: Canonical brand name, logo, horizontal wordmark, customer support endpoints, multilingual availability (English, French, Swahili, Kinyarwanda), and headquarters/offices in Dubai, Kigali, Nairobi, and Dar es Salaam.
    - `WebSite`: Canonical URL and publisher relationship.
    - `ItemList` (`SiteNavigationElement`): Sitelinks directly pointing Google Search bots to Payment Processing, POS Solutions, Bulk SMS, Rwanda, Kenya, Tanzania, and Contact.
  - **Dynamic Route-Level `<SEO>` Component**: Engineered a reactive React component that synchronizes `document.title`, description, canonical link, Open Graph tags, Twitter card tags, and custom page schemas (`FinancialProduct`, `Product`, `Service`, `LocalBusiness`, `ContactPage`) during in-app navigation and for search engine web rendering crawlers.
  - **Production Deployment Domain Scoping**: Removed `avadapay.rw` from `VIRTUAL_HOST` and `LETSENCRYPT_HOST` in `docker-compose.yml` to focus all production deployment and SSL provisioning purely on `avadapay.com` and `www.avadapay.com`.
  - **OptimizedImage Full-Height Stretched Rendering Fix**: Enforced `w-full h-full` on the container `div` and `w-full h-full block` on the `<picture>` wrapper in `OptimizedImage.tsx`, preventing vertical collapse inside aspect-ratio cards and ensuring image fills 100% of the container without exposing underlying card placeholder backgrounds.
  - **Payment Processing Hero Visual Component**: Implemented `PaymentProcessingHeroVisual` in `PaymentProcessingPage.tsx` to fill the previously blank right-hand hero frame with a live simulated multi-rail payment terminal showing real-time M-Pesa STK push, 3DS card checkout, MTN MoMo collections, and remote payment links alongside settlement currencies (USD, KES, RWF, TZS, CDF) and 256-bit TLS encryption indicators.

---

## FEAT-025: Intermediate Proxy Robots.txt Resolution & Legacy Asset Synchronization
- **ID**: `FEAT-025`
- **Status**: Completed
- **Created**: 2026-10-19
- **Description**: Resolved Google Search Console sitemap indexing failure ("General HTTP error / Sitemap could not be read") caused by stale crawler policies on the intermediate proxy server (`62.109.1.17`), and synchronized the latest high-resolution branding assets.
- **Files Involved**:
  - `apps/web/public/favicon.ico`
  - `apps/web/index.html`
  - `/var/www/avadapay/data/www/avadapay.com/robots.txt` (on `62.109.1.17`)
  - `/var/www/avadapay/data/www/avadapay.com/*` (synced on `62.109.1.17`)
- **Rationale**:
  - `avadapay.com` DNS records resolve to legacy host `62.109.1.17`, which proxies web requests to the Contabo production VPS (`167.86.93.195`).
  - FastPanel on `62.109.1.17` serves static `.txt`, `.png`, and `.ico` files directly from disk before proxying.
  - A legacy `robots.txt` from February 2026 had `Disallow: /` and an aggressive 1-year cache directive (`Cache-Control: max-age=31536000`), instructing Googlebot to abort crawling all paths except `/`.
- **Implementation Details**:
  - **Direct SSH Remediation**: Connected to `62.109.1.17` via SSH as user `avadapay`, backed up the legacy file to `robots.txt.bak`, and replaced it with an open policy allowing public crawling while advertising `Sitemap: https://avadapay.com/sitemap.xml`.
  - **Asset Synchronization**: Uploaded current multi-resolution icons (`favicon-48x48.png`, `favicon-96x96.png`, `favicon-192x192.png`, `favicon-512x512.png`, `apple-touch-icon.png`, `logo-512.png`, `manifest.json`, and `sitemap.xml`) to the proxy server root.
  - **Legacy Favicon Creation & Head Linkage**: Generated an embedded ICO (`apps/web/public/favicon.ico`) and linked `<link rel="alternate icon" href="/favicon.ico" />` in `index.html` to guarantee logo recognition on legacy bots and browsers.
  - **Live Verification**: Verified via proxy access logs that Google-InspectionTool and Googlebot re-fetched `/robots.txt` with HTTP 200 (189 bytes) and proceeded to inspect WebP images, JS bundles, and stylesheets.







