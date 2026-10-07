# Changelog

All notable changes to the Avada Website and CMS project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.8.0] - 2026-10-07

### Added
- **Automated CI/CD SSH Deployment Workflow (`.github/workflows/ci.yml`)**: Added automated production deployment job using `appleboy/ssh-action` triggered on pushes to `main` and via `workflow_dispatch`. Authenticates with GHCR, pulls updated container images, provisions PostgreSQL database, executes Prisma database schema pushes and seeding, starts containers, and performs automated Docker image pruning.
- **Production Multi-Tenant Container Orchestration (`docker-compose.yml`)**: Configured production services connected to the shared `avadaops_default` network alongside the existing `nginxproxy/nginx-proxy` and `nginxproxy/acme-companion` stack. Configured `VIRTUAL_HOST` and `LETSENCRYPT_HOST` for `avadapay.rw` and `www.avadapay.rw`.

### Changed
- **Nginx API Reverse Proxy Routing (`docker/nginx.conf`)**: Corrected `/api` proxy rule to forward the full URI path to Express backend without stripping endpoint routes, ensuring all health and content endpoints (`/api/health`, `/api/content`, `/api/auth`) route properly.

---

## [1.7.0] - 2026-10-07

### Added
- **Kenya Country Page (`/countries/kenya`)**: Built to design screenshots (`KE-1.png` - `KE-7.png`). Features hero ("Payments bila stress for Kenyan businesses") with live CBK-compliant stream preview, Nairobi skyline banner (`/media/nairobi-skyline.jpg`), 6-pill payment badge grid (M-Pesa, Airtel Money, STK Push/Paybill/Till, card payments, payment links, APIs), dual feature cards with photography (batch payouts to agents/suppliers and bulk SMS communications), 6-industry accordion (Microfinance, E-commerce, Gaming, Schools, Services, Retail), 4 benefit cards, Nairobi office card with Westpark Towers map (`/media/nairobi-map.jpg`) and meeting scheduler, and unified CTA banner.
- **Rwanda Country Page (`/countries/rwanda`)**: Built to design screenshots (`RW-1.png` - `RW-8.png`). Features hero ("A smarter way to handle business payments in Rwanda") with live NBR/RURA stream preview, Kigali Convention Centre night banner (`/media/kigali-skyline.jpg`), alternating vertical timeline ("From payment to confirmation, without the guesswork") with concentric teal nodes, 6-pillar white card grid on `#3BBA93` teal background (Mobile money, Cards, POS, Bulk SMS, APIs, Payouts), system integration showcase, 4 "Why AvadaPay in Rwanda" cards, Kigali office hub card with meeting booking, and dedicated Rwanda CTA banner.
- **Tanzania Country Page (`/countries/tanzania`)**: Built to design screenshots (`TZ-1.png` - `TZ-7.png`). Features hero ("Malipo rahisi kwa biashara Tanzania") with BOT/TCRA live stream preview, coastal Dar es Salaam banner (`/media/tanzania-coast.jpg`), multi-telco logos strip (`/media/tz-telecom-logos.png`) across Airtel, Halopesa, Vodacom, and Tigo Money, 3 numbered feature cards (networks, batch payouts, SMS notifications), real-time visibility table container with live multi-telco transaction monitoring, 4 "Why Tanzanian businesses choose AvadaPay" cards, Dar es Salaam office hub card, and "Simplify payments across Tanzania" CTA.

### Changed
- **Home Page Hero Background**: Swapped out bright background for luxury dark moody ambiance asset (`apps/web/src/assets/hero-bg.jpg`) with soft bokeh and dark gradient overlays to ensure razor-sharp typography contrast.
- **Navbar Country Indicator**: Navbar country button now displays the active country name with its official vector flag when visiting country routes (`Kenya 🇰🇪`, `Rwanda 🇷🇼`, `Tanzania 🇹🇿`), falling back to dropdown chevron on generic routes.
- **Unified Dynamic Footer CTAs**: Added route-specific footer CTA entries in `Footer.tsx` for `/countries/kenya`, `/countries/rwanda`, and `/countries/tanzania`.

## [1.6.0] - 2026-10-07

### Added
- **POS Solutions Page (`/pos`)**: Built exactly to design screenshots (`POS-1.png` - `POS-9.png`). Features hero with live POS terminal graphic and payment methods strip (`Debit cards`, `Credit cards`, `QR Payments`, `Mobile money`, `Cash`), three payment modes (Soft POS, Smart POS, Enterprise Payment APIs), 6-industry accordion (Retail, Hospitality, Healthcare, Education, Transportation, Government & NGOs), centralized dashboard architecture schematic with connected monitoring/access/BI pillars, PCI-DSS security ticker banner, report reader photo banner, go-live timeline matrix (24-48h, 3-7d, project-based), and flexible pricing tiers.
- **Bulk SMS Platform Page (`/bulk-sms`)**: Built to design screenshots (`BS-1.png` - `BS-7.png`). Features SMS gateway live dispatch console, 6-card message categories grid (Transactional, OTPs & 2FA, Reminders, Marketing campaigns, Service notifications, Payments + SMS), 5 visual reason cards (Multi-network coverage, Volume pricing, Delivery reports, Tied to payments, Easy to integrate), 7-sector use cases accordion, and a fully interactive SMS pricing calculator with country selection (Kenya, DRC, Tanzania, Rwanda, Uganda), dynamic volume slider, tiered rate badges, and live monthly spend estimation.
- **Contact Page (`/contact`)**: Built to design screenshots (`Co-1.png` - `Co-3.png`). Features clean light layout matching brand specifications, headphone iconography, Radix UI Select dropdowns for inquiry type and African countries, auto-query parameter hydration (`?inquiry=...` & `?country=...`), interactive submission confirmation, and a dedicated Technical/API Integration support banner.

### Changed
- **Home Page Hero Blurred Bokeh**: Softened the hero background with deep bokeh blur (`blur-[9px]`, scale, and dark moody gradient overlay) matching the design mockups so foreground text stands out with high contrast.
- **Home Page Under-Hero 3-Item Marquee**: Replaced single text marquee with 3 discrete, branded moving items (`[Cloud] One platform.`, `[Paper Plane] Payments and`, `[Chat Bubble] SMS across Africa.`) strictly following `UnderH-1.png` through `UnderH-3.png`.
- **POS Security Ticker Marquee**: Replaced wrapping flex layout with seamless continuous horizontal marquee for security features (`PCI-compliant infrastructure`, `Device authentication`, `Role-based access controls`, `Fraud monitoring`, `Encrypted communications`), preventing unwanted line-wrapping on all screen sizes.
- **Home Page Fintech Sizing & Proportions**: Refactored typography, marquee scale, and spacing from oversized dimensions down to clean, professional modern fintech proportions. Scaled vector flags to realistic sizes (48-56px), streamlined hero text, and balanced card padding.
- **Dynamic Footer Call-to-Action**: Tailored footer CTA headlines and action buttons contextually across `/`, `/payment-processing`, `/pos`, `/bulk-sms`, and suppressed the redundant CTA on `/contact`.

## [1.5.0] - 2026-10-07

### Changed
- **Home page rebuilt pixel-close to design screenshots (`public/images/H-1..H-9.png`)**: hero with overlay navbar, scrolling "Payments and SMS platform." marquee, "Four ways" green section, "Why teams build" cards, industries accordion, circle-flag strip, Dubai map + country office rows, partner logo marquees.
- **Footer** now includes the dark CTA band, Useful links / Contact / legal columns and social icons (CMS Portal link kept, subtle).
- **Navbar** is transparent/absolute on `/`, solid sticky elsewhere. Typography switched to Mulish.

### Added
- `components/home/CircleFlags.tsx`, `components/home/PartnerLogos.tsx` (wordmark placeholders until official logos are supplied).

## [1.4.2] - 2026-09-21

### Fixed
- **Docker Multi-Stage Build & Prisma Generation**: Created `.dockerignore` to prevent host `node_modules` and build artifacts from leaking into Linux container layers. Upgraded base images to `node:22-alpine` with `openssl` and `libc6-compat`, replaced ephemeral `pnpm dlx prisma` with local `pnpm run prisma:generate`, and copied complete workspace manifests to ensure clean pnpm lockfile resolution for both API and Web Docker images.

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
