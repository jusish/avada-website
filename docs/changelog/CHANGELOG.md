# Changelog

All notable changes to the Avada Website and CMS project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

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
