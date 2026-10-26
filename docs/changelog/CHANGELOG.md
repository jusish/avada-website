# Changelog

All notable changes to the Avada Website and CMS project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.18.0] - 2026-10-26

### Fixed
- **Legal Compliance Pages Modernization & Markdown Parser**: Overhauled the Terms of Service, Privacy Policy, and Cookie Policy pages (`LegalPolicyPage.tsx`). Replaced naive paragraph splitting with a line-by-line block and inline markdown parser that eliminates unparsed asterisk tokens (`*`, `**`), formats bullet lists cleanly with subtle emerald indicators, and bolds only key terms while keeping body copy at an unbolded, comfortable reading size (`text-xs sm:text-[13px] text-gray-600 font-normal`).
- **Elevated Document Layout & Spacing**: Eliminated the oversized, bloated dark hero section (`pt-32 pb-16`) and large bubbly `rounded-3xl` cards. Positioned the header close to the top (`pt-8 pb-10`) matching the rest of the site, expanded the content layout to a balanced `max-w-7xl` 2-column structure with sticky legal navigation, in-page numbered clause table of contents, and a professional document paper container (`rounded-xl border border-gray-200/80`) with dedicated "Print / Save PDF" and "Share Link" actions.
- **Production Database Dummy Inquiry Cleanup & Seed Sanitization**: Connected via SSH to the production VPS (`167.86.93.195`) and permanently deleted the mock contact inquiries ("Jean-Paul Habimana" and "Faith Mwangi") from PostgreSQL (`contact_inquiries`). Removed the mock inquiry generation block from `apps/api/prisma/seed.ts` so future seed executions will never introduce fake leads into the live CMS inbox.
- **Careers Deep-Linking & Browser URL Synchronization**: Fixed the career share link behavior where opening `https://.../careers#<id>` only displayed the general listings page without opening the shared role. Implemented comprehensive deep-linking across URL hash (`#<id>`), search parameters (`?job=<id>`), and direct routes (`/careers/:jobId`) in `CareersPage.tsx` and `App.tsx`. When a user visits a direct link, the position modal automatically fetches and displays the role. Opening or closing vacancies seamlessly updates the browser address bar and supports native browser Back/Forward navigation.
- **CMS Session Expiration & Zombie Auth State Resolution**: Fixed a critical UX flaw where users opening the CMS with an expired or invalidated JWT token remained visually "logged in" with broken data loaders and silent 401 backend failures.
- **Proactive JWT Expiration Validation**: Implemented client-side JWT token decoding and expiration verification (`apps/web/src/lib/jwt.ts`) that immediately purges expired tokens on application mount and prevents rendering protected admin screens with stale credentials.
- **Global HTTP 401 Interceptor**: Created `apps/web/src/lib/auth-interceptor.ts` monkey-patching `window.fetch` to intercept 401 Unauthorized responses across all administrative and API endpoints. Automatically clears local storage, invalidates React auth state, and triggers session expiration events without affecting public marketing forms or intentional login errors.
- **Startup Profile Verification (`GET /api/auth/me`)**: Upgraded `AuthContext.tsx` to verify unexpired tokens against the server on initial boot. Syncs updated user roles and permissions while gracefully clearing sessions and redirecting if accounts are suspended or keys invalidated.
- **Admin Login Expiration Notice & Return Navigation**: Enhanced `AdminLoginPage.tsx` with an alert banner notifying users when their session has expired for security. Preserves the user's intended target route (`from: location`) so logging back in returns them directly to their working page instead of dumping them on the dashboard.
- **Modal Header Layout Separation**: Resolved button collision between the close icon and "Share Role" button in `CareersPage.tsx` and `IntegrationLogModal.tsx` by styling a frosted circular close button anchored top-right with `pr-16` header clearance and moving the share action to a pill badge on the left alongside department tags, plus a secondary share button in the modal footer.

## [1.17.0] - 2026-10-26

### Added
- **PeopleForce Careers API Integration**: Connected AvadaPay directly to PeopleForce ATS (`v1`) using secure database-backed API keys (`X-API-KEY`). Synchronizes active vacancies across Dubai HQ, Kigali, Nairobi, Kinshasa, and Remote hubs with instant sub-10ms response caching in PostgreSQL.
- **Extensible Integrations Engine & CMS Hub**: Designed an enterprise-grade Integrations Management Hub under `/admin/integrations`. Features real-time connection health diagnostics ("Test Connection"), live latency monitoring (ms), manual and automatic vacancy syncing, credential management with reveal/hide masking, and placeholder slots for modular future integrations (Mailgun, Slack, HubSpot).
- **Dedicated Request/Response Integration Logging (`IntegrationLog`)**: Engineered a centralized logging engine tracking every outgoing HTTP request across external integrations. Automatically masks sensitive headers (API keys, Bearer tokens), measures duration in milliseconds, captures HTTP status codes, and stores formatted request/response payloads with an interactive inspection modal (`IntegrationLogModal`) in the CMS.
- **High-Converting Public Careers Portal (`/careers`)**: Developed a modern Pan-African careers page styled in AvadaPay's high-contrast fintech aesthetic (`#3BBA93`, `#2A292D`). Includes keyword search, country filter with vector country flags (Rwanda, Kenya, Tanzania, DRC, UAE, Remote), department filter, employment type filter, culture and benefits showcase, and rich position detail modals with direct links to `avadapay.peopleforce.io`.
- **Global Navigation & Footer Integration**: Added "Careers" with an active "Hiring" badge in the website footer under Useful Links. Pre-rendered static route shells for `/careers` and updated `sitemap.xml`.

## [1.16.0] - 2026-10-26

### Added
- **Google Analytics 4 Integration (gtag.js)**: Integrated official Google tag (`G-4LG1537EN5`) into `<head>` across all pages while preserving full internal Google Search Console site ownership verification (`<meta name="google-site-verification">`). Verified route shell propagation so live analytics tracking runs seamlessly across all public marketing and solution pages.

### Fixed
- **Pre-Rendered Route Shells & Canonical Collision Resolution**: Resolved the Google Search Console indexing exclusion ("Alternate page with proper canonical tag") where 8 primary solution, market, and compliance pages (`/payment-processing`, `/pos`, `/bulk-sms`, `/rwanda`, `/kenya`, `/tanzania`, `/contact`, `/terms`, `/privacy`, `/cookies`) were mistakenly excluded because SPA Nginx fallback served a root `index.html` hardcoded with `<link rel="canonical" href="https://avadapay.com/" />`. Created `apps/web/scripts/generate-route-shells.mjs` to automatically pre-render individual static HTML route shells (`<route>.html` and `<route>/index.html`) with accurate per-page canonical tags, titles, descriptions, and Open Graph metadata directly in the raw HTML response.
- **Nginx Static Route Prioritization**: Updated `docker/nginx.conf` `try_files` directive to `try_files $uri $uri.html $uri/index.html $uri/ /index.html;`, ensuring crawlers and visitors receive exact route-specific static HTML with HTTP 200 without triggering unwanted trailing-slash 301 redirects ("Page with redirect").
- **Automated Monorepo Build Pipeline**: Bound route shell pre-rendering directly to `pnpm build` in `apps/web/package.json`, ensuring continuous deployment builds always bundle fresh static route shells.

## [1.15.0] - 2026-10-23

### Changed
- **Sitelinks Search Architecture & Semantic Link Anchoring**: Updated `HomePage.tsx` to link product card headings (`<h3>`) directly to `/payment-processing`, `/pos`, and `/bulk-sms`, and replaced generic "Learn more" buttons with rich semantic anchor text ("Explore Payment Processing", "Explore POS Solutions", "Explore Bulk SMS"). This sends high-priority internal link graph signals to Googlebot to prioritize solution pillars in Google Sitelinks.
- **Sitemap Optimization for Core Solutions**: Streamlined `sitemap.xml` to focus purely on high-value public pages (`/`, `/payment-processing`, `/pos`, `/bulk-sms`, `/rwanda`, `/kenya`, `/tanzania`, and `/contact`), removing non-converting policy routes.
- **Legal Compliance Sitelink Exclusion**: Added `noindex={true}` (`<meta name="robots" content="noindex, follow">`) to `LegalPolicyPage.tsx` (`/cookies`, `/privacy`, `/terms`). This prevents utility legal pages (such as Cookie Policy) from occupying organic sitelink slots in Google Search snippets while preserving in-site user access and link equity.

## [1.14.0] - 2026-10-20

### Fixed
- **Google Search Console POS Page Rich Snippet Schema Resolution**: Diagnosed and resolved the critical URL inspection error on `https://avadapay.com/pos` ("Either 'price' or 'priceSpecification.price' should be specified in offers"). Reclassified Avadapay Smart POS Solutions from consumer retail `@type: "Product"` to enterprise B2B `@type: "Service"` with `serviceType: "Point of Sale (POS) Solutions & SoftPOS"`. This accurately reflects Avadapay's quote-based and transaction-volume pricing model while eliminating all Product snippet warnings and errors in Google Search Console.
- **Google Search Favicon 1:1 Aspect Ratio & Multi-Resolution ICO Compliance**: Resolved the root cause preventing Google Search results from displaying the Avadapay favicon (where a default fallback grey globe was shown). Normalized `apps/web/public/favicon.svg` from non-square 119x111 to a strict 1:1 square `128x128` vector (`viewBox="0 0 128 128"`), satisfying Google Search Central's mandatory 1:1 aspect ratio requirement. Reordered `<head>` icon declarations in `index.html` to prioritize standard 48px raster multiples (`favicon-48x48.png`, `favicon-96x96.png`, `favicon-192x192.png`), linked standard `<link rel="shortcut icon" href="/favicon.ico" />`, and updated `generate-seo-assets.mjs` to produce a true multi-resolution binary `favicon.ico` containing 48x48, 32x32, and 16x16 bitmaps alongside an opaque `#0B132B` Apple touch icon.
- **Proxy Server Asset Synchronization & Live Validation**: Connected via SSH to the intermediate proxy server (`62.109.1.17`) and synchronized all refreshed assets (`favicon-48x48.png`, `favicon-96x96.png`, `favicon-192x192.png`, `favicon-512x512.png`, `favicon.ico`, `favicon.svg`, `apple-touch-icon.png`, `logo-512.png`, `logo-horizontal.png`, `manifest.json`, `robots.txt`, `sitemap.xml`, and production `index.html`) directly into `/var/www/avadapay/data/www/avadapay.com/`. Verified live HTTP 200 responses and matching asset byte sizes across `https://avadapay.com`.

## [1.13.0] - 2026-10-19

### Fixed
- **Google Search Console Sitemap Fetch Unblocking**: Diagnosed and resolved the "General HTTP error / Sitemap could not be read" issue in Google Search Console. Discovered that the legacy proxy server (`62.109.1.17`), which receives DNS traffic for `avadapay.com`, was serving a stale static `robots.txt` from February 2026 containing `Disallow: /` with a 1-year cache header (`Cache-Control: max-age=31536000`). This directive blocked Googlebot from crawling `/sitemap.xml` and internal site routes. Updated `robots.txt` directly on `62.109.1.17` to permit indexing (`Allow: /`) and reference `https://avadapay.com/sitemap.xml`.
- **Legacy Proxy Asset Synchronization**: Synchronized all newly generated multi-resolution branded icons (`favicon-48x48.png`, `favicon-96x96.png`, `favicon-192x192.png`, `favicon-512x512.png`, `favicon.ico`, `apple-touch-icon.png`, `logo-512.png`, `manifest.json`, `sitemap.xml`, `robots.txt`) to the FastPanel web root (`/var/www/avadapay/data/www/avadapay.com/`) on `62.109.1.17`, replacing outdated June 2025 WordPress assets.
- **Legacy Crawler Favicon.ico Compatibility**: Generated a multi-size embedded ICO (`favicon.ico`) with fallback linkage in `index.html` to guarantee instant brand logo indexing across legacy search crawlers and browser address bars.

## [1.12.0] - 2026-10-19

### Added
- **Enterprise SEO & Brand Standardization**: Updated the site title to `Avadapay | Global Financial Infrastructure & Technology` and injected Google Search Console domain verification `<meta name="google-site-verification" content="Srp7mYBgNAKzIapbFT_FhIJ35vGpdhCHxNRiHbymPwA" />`.
- **Search Engine Sitelinks & Structured Data Suite**: Built and embedded comprehensive Schema.org JSON-LD definitions for `Organization` (brand logo, contact points, multilingual support, physical offices in Dubai, Kigali, Nairobi, Dar es Salaam), `WebSite`, and `ItemList` (`SiteNavigationElement` declaring sitelinks for Payment Processing, POS Solutions, Bulk SMS, Rwanda, Kenya, Tanzania, and Contact).
- **High-Resolution App & Search Icons Pipeline (`generate-seo-assets.mjs`)**: Generated multi-resolution icons adhering strictly to Google Search guidelines (`favicon-48x48.png`, `favicon-96x96.png`, `favicon-192x192.png`, `favicon-512x512.png`, `apple-touch-icon.png` 180x180, `logo-512.png`, `logo-horizontal.png` 800px width, and a branded 1200x630 `og-image.png`).
- **Web App Manifest (`apps/web/public/manifest.json`)**: Configured standalone PWA manifest with theme colors (`#0B132B`), masks, and icons.
- **Search Engine Indexing Essentials**: Created `robots.txt` disallowing private administrative/API paths while linking to `sitemap.xml`, and authored a comprehensive XML sitemap covering all public marketing, solution, country, and legal routes on `https://avadapay.com`.
- **Dynamic Per-Route `<SEO>` Component (`apps/web/src/components/seo/SEO.tsx`)**: Automated route-level head updates across all pages (`HomePage`, `PaymentProcessingPage`, `PosPage`, `BulkSmsPage`, `RwandaPage`, `KenyaPage`, `TanzaniaPage`, `ContactPage`, `LegalPolicyPage`, and dynamic `CountryPage`), providing tailored titles, descriptions, canonical URLs, and specialized schema markup (`FinancialProduct`, `Product`, `Service`, `LocalBusiness`, `ContactPage`).
- **Payment Processing Hero Visual Component (`PaymentProcessingHeroVisual`)**: Created a high-fidelity pan-African payment terminal preview for the previously empty right-hand hero frame on `/payment-processing`, featuring live simulated multi-rail payment transactions (M-Pesa STK push, 3DS card checkout, MTN MoMo collection, and instant payment links), live latency badges, currency settlement tags (USD, KES, RWF, TZS, CDF), and 256-bit TLS encryption indicator.

### Changed
- **Production Multi-Tenant Deployment Scoping**: Removed `avadapay.rw` and `www.avadapay.rw` from `VIRTUAL_HOST` and `LETSENCRYPT_HOST` in `docker-compose.yml`, focusing all live routing, SSL certificates, and SEO indexing exclusively on `avadapay.com` and `www.avadapay.com`.

### Fixed
- **OptimizedImage Full-Height Stretched Rendering**: Resolved height collapse on the 6 payment method cards in `PaymentProcessingPage.tsx` and all product card grids by enforcing `w-full h-full` on the container `div` and `w-full h-full block` on the inner `<picture>` element in `OptimizedImage.tsx`, eliminating the exposed bottom grey background (`bg-gray-100`) and ensuring images seamlessly cover 100% of their aspect-ratio containers.

---

## [1.11.0] - 2026-10-19

### Added
- **Global Image Optimization Pipeline**: Converted all images across `apps/web/public/media/` and `apps/web/src/assets/` to high-performance WebP using `sharp`, reducing total image payload from 10.97 MB down to 1.36 MB (**-88% bandwidth reduction**).
- **Reusable `OptimizedImage` Component (`apps/web/src/components/ui/OptimizedImage.tsx`)**: Automated `<picture>` WebP source resolution, priority loading (`fetchpriority="high"`, `decoding="async"`), and buttery-smooth zero-layout-shift blur/fade-in transitions.
- **Critical Hero Background Preloading**: Inlined `<link rel="preload" as="image" href="/hero-bg.webp" type="image/webp" fetchpriority="high">` in `index.html` with a matched `#0B132B` backdrop, eliminating hero pop-in delays and white flashes on first paint.
- **Fluid Scroll & Micro-Interaction Motion Suite (`apps/web/src/components/motion/Motion.tsx`)**: Integrated `framer-motion` across the landing page and all solution pages (`/payment-processing`, `/pos`, `/bulk-sms`, `/kenya`, `/rwanda`, `/tanzania`), featuring scroll-triggered reveals (`FadeIn`), choreographed grid cascades (`StaggerContainer` + `StaggerItem`), interactive card hover elevations (`HoverScale`), and polished hero entrances.

### Changed
- **Solution Page Visuals**: Replaced raw `<img>` tags across `PaymentProcessingPage`, `PosPage`, `BulkSmsPage`, `KenyaPage`, `RwandaPage`, and `TanzaniaPage` with `<OptimizedImage>` and Framer Motion scroll wrappers.

---

## [1.10.0] - 2026-10-16

### Changed
- **Direct Country Permalinks**: Migrated country URLs from `/countries/:countrySlug` to clean top-level permalinks (e.g. `https://avadapay.com/kenya`, `https://avadapay.com/rwanda`, `https://avadapay.com/tanzania`). Added an automated React Router `CountryRedirect` fallback to route legacy `/countries/*` URLs seamlessly without broken links.
- **Rwanda Corporate Office Address Update**: Updated Rwanda office location to `BHC Building, KG 7 Ave Kacyiru, Gasabo, Kigali, Rwanda` on the Home page office list, the dedicated Rwanda country page office card, and updated the interactive Google Maps embed.
- **Scaped Footer Contact Information**: Removed the global contact details (Dubai HQ, global phone) from generic solution pages (`/payment-processing`, `/pos`, `/bulk-sms`), contact page, and legal policy pages. Localized country pages (`/kenya`, `/rwanda`, `/tanzania`, or dynamic CMS markets) display localized office contact details, while the Home page retains the global headquarters contact information.

---

## [1.9.0] - 2026-10-08

### Added
- **Visual Permission Manager & RBAC (`/admin/roles`)**: Complete role and permission management allowing custom role creation with granular per-module access (`view` and `edit`) across 10 system modules (`roles`, `users`, `countries`, `inquiry_types`, `inquiries`, `articles`, `policies`, `settings`, `insights`, `audit_logs`). Enforced by backend middleware `requirePermission` and frontend `AdminPermissionGuard`.
- **Dynamic Country & Head Office Management (`/admin/countries`)**: Allows administrators to add, edit, or disable country availability on the live site, complete with office location coordinates, map views, phone numbers, and address details.
- **Inquiries CRM Pipeline (`/admin/inquiries`, `/admin/inquiry-types`)**: Full customer inquiry management with dynamic inquiry types, unread counters on the dashboard and sidebar, status tracking (`UNREAD`, `READ`, `CONTACTED`, `RESOLVED`), and internal staff notes.
- **Legal Policies Engine (`/admin/policies`)**: In-browser Markdown editing of legal agreements (Terms of Service, Privacy Policy, Cookie Policy) with version tracking, effective dates, and public legal route rendering (`/legal/:slug`).
- **Site Settings & Footer Configuration (`/admin/settings`)**: Centralized management of general contacts, office addresses, copyright text, and social links (Twitter/X, LinkedIn, Facebook, Instagram, YouTube) with new tab/window target toggling.
- **Availability, Performance & Threat Diagnostics (`/admin/security`)**: Real-time infrastructure diagnostics at `/api/admin/analytics/security` and `/api/admin/security/diagnostic` monitoring live database response times, telemetry request rates, threat feeds, and TLS 1.3 certificate status.

### Changed
- **Design System Polish & shadcn/ui Migration**: Replaced all native `<select>` dropdowns and ad-hoc modals across all 9 admin pages with Radix UI `Select` and `Dialog` primitives from `@/components/ui`.
- **Border Radius & Typography Standardization**: Normalized cards to `rounded-xl` and inputs to `rounded-lg`. Eliminated all excessive `uppercase` Tailwind classes across tables, cards, and buttons for a clean, natural title-cased fintech aesthetic.
- **Sidebar & Login Page UX Improvements**: Added the official AvadaPay logo to the CMS sidebar with a direct home link (`/`), gated demo login credentials behind `import.meta.env.DEV`, and added automatic redirect to dashboard for already-authenticated users.

### Fixed
- **Security Diagnostic 404 Resolution**: Fixed missing route mapping for security diagnostics in `analytics.routes.ts` and mounted `/api/admin/security` in `server.ts`.
- **Type Safety & Strict Lint Standards**: Eliminated all remaining `@typescript-eslint/no-explicit-any` ESLint warnings and TypeScript type mismatches, achieving 0 errors and 0 warnings across monorepo builds.

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
