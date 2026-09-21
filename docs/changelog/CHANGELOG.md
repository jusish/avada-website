# Changelog

All notable changes to the Avada Website and CMS project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.4.1] - 2026-09-21

### Fixed
- **Monorepo Type-Check Resolution in CI**: Resolved GitHub Actions failure where `pnpm type-check` ran on fresh clones before `@avada/shared` had built its declaration files. Added path mapping in `apps/web/tsconfig.json`, configured `packages/shared` package.json `exports`, updated root `type-check` script to build `@avada/shared` first, and added `Build Shared Package` step in `ci.yml`.

## [1.4.0] - 2026-09-21

### Added
- **Production-Grade README**: Comprehensive documentation with architecture diagrams, badges, getting started guides, script reference, and Docker workflows.
- **ESLint 10 & Code Quality**: Configured monorepo-wide ESLint flat configuration (`eslint.config.js`) with TypeScript-ESLint, fixing all warnings for zero-warning code quality.
- **GitHub Actions CI/CD Pipeline (`ci.yml`)**:
  - Direct PR & Push Quality Checks: Automated `lint`, `type-check`, and `build`.
  - GHCR Docker Container Build: Exclusively builds and pushes multi-stage production Docker images to GitHub Container Registry (`ghcr.io/jusish/avada-website/api` and `ghcr.io/jusish/avada-website/web`) on direct push to `main`.

## [1.3.1] - 2026-09-21

### Fixed
- **Navigation Scroll Restoration**: Fixed React Router SPA issue where switching pages from a scrolled position caused destination pages to open pre-scrolled. Implemented `ScrollToTop` component to instantly reset window and document scroll coordinates to the top upon route changes.

## [1.3.0] - 2026-09-21

### Added & Fixed
- **Vector Country Flags Component (`CountryFlag`)**: Replaced non-rendering Unicode country emojis with dedicated, high-resolution SVG vector flags for Kenya 🇰🇪, Rwanda 🇷🇼, and Tanzania 🇹🇿.
- **Cross-Platform Flag Consistency**: Solved Windows / Chromium platform font limitation where flag emojis were rendered as regional letters ("KE", "RW", "TZ") or missing glyphs.
- **Integrated Flag Placements**: Embedded `<CountryFlag>` across the sticky Navbar dropdown, mobile drawer, Footer market links, Home page Country Hubs, dedicated Country overview pages, and Contact page regional office directory.

## [1.2.1] - 2026-09-21

### Fixed
- **Home Hero Background Visibility**: Fixed background image rendering by removing negative z-indexes (`-z-20`, `-z-10`) that hid the image behind `bg-background`. Switched to direct image import with positive z-index layering (`z-0` background, `z-10` text/sub-banner) and added `vite-env.d.ts` for Vite client asset typing.

## [1.2.0] - 2026-09-21

### Changed & Refined
- **Compact & Consistent Navbar**: Reduced navbar height to `h-16`, unified sticky background to `#2A292D`, and fixed country selector visibility across all public routes.
- **Hero Sub-Banner Opacity**: Tuned the home hero bottom strip to exactly 23% opacity (`bg-black/[0.23]`) per the design specifications.
- **Full Solution Pages Alignment**: Reconstructed `PaymentProcessingPage`, `PosPage`, and `BulkSmsPage` with `#2A292D` headers, custom feature cards, solid green sections, and exact copy from the Adobe XD screenshots.
- **Unified Hero Backgrounds**: Standardized top hero sections on all pages (`Payment Processing`, `POS`, `Bulk SMS`, `Country Hubs`, `Contact`) with `#2A292D` background color.

## [1.1.0] - 2026-09-21

### Added
- **AvadaPay Brand Identity**: Extracted official SVG vector logo and favicon from `avadapay.com`. Configured primary theme color `#3BBA93`.
- **Adobe XD Hero Redesign**: Rebuilt the hero section matching the design screenshot with ambient card-swipe photography, prominent white & `#3BBA93` headline typography, key uptime & market metrics strip, and bottom descriptor sub-banner.
- **Dedicated Solution Pages**:
  - `Payment Processing` (`/payment-processing`)
  - `POS Terminals & Hardware` (`/pos`)
  - `Bulk SMS & OTP Aggregator` (`/bulk-sms`)
- **Country Portal Pages**:
  - Integrated header country select with flags (🇰🇪 Kenya, 🇷🇼 Rwanda, 🇹🇿 Tanzania), each linking to dedicated regional market overview pages (`/countries/:countrySlug`).
- **shadcn Select Component**: Built `apps/web/src/components/ui/select.tsx` using `@radix-ui/react-select` and completely replaced native `<select>` tags in the CMS.
- **Navigation & Footer Updates**: Relocated CMS portal access link to the footer and added primary `Contact Us` button to header.

## [1.0.0] - 2026-09-21

### Added
- **Monorepo Architecture**: Setup `pnpm` workspaces for `apps/web`, `apps/api`, and `packages/shared`.
- **Frontend Core**: Configured Vite + React 19 + TypeScript with Tailwind CSS and `shadcn/ui` component library.
- **Frontend Pages & Routing**:
  - React Router v6 navigation.
  - Public marketing website (`/`, `/about`, `/services`, `/contact`).
  - CMS Admin dashboard (`/admin/login`, `/admin/dashboard`, `/admin/content`).
- **Backend Core**: Configured Node.js + Express + TypeScript with port `5005`.
- **Database & ORM**: Configured Prisma ORM with PostgreSQL database schema (`User`, `ContentItem`) and seed script.
- **CMS Authentication**: Implemented JWT authentication, password hashing with bcrypt, and route guards.
- **Containerization**: Configured `docker-compose.yml` and multi-stage Dockerfiles for API and Web with custom Nginx proxy.
- **AI Documentation Ecosystem**: Established `AGENT.md`, `docs/rules/`, `docs/changelog/features-storage.md`, and master documentation index.
- **Git Repository**: Initialized Git repository with `main` branch and origin remote.
