/* eslint-disable no-undef */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const webRoot = path.resolve(__dirname, '..');
const distDir = path.resolve(webRoot, 'dist');
const indexHtmlPath = path.resolve(distDir, 'index.html');

/**
 * Route metadata specifications for pre-rendering static route shells.
 * Ensures Googlebot, Bingbot, LinkedIn, Twitter/X and crawlers receive
 * 100% accurate canonical tags, titles, and Open Graph metadata in the raw HTML.
 */
const PUBLIC_ROUTES = [
  {
    path: 'payment-processing',
    canonical: 'https://avadapay.com/payment-processing',
    title: 'Payment Processing & Mobile Money Gateway | Avadapay',
    description:
      'Accept payments across Africa with Avadapay. Omni-channel card processing, mobile money (M-Pesa, MTN MoMo, Airtel), QR codes, and multi-currency settlement.',
    ogTitle: 'Payment Processing & Mobile Money Gateway | Avadapay',
    ogDescription:
      'Accept payments across Africa with Avadapay. Omni-channel card processing, mobile money (M-Pesa, MTN MoMo, Airtel), QR codes, and multi-currency settlement.',
  },
  {
    path: 'pos',
    canonical: 'https://avadapay.com/pos',
    title: 'Smart POS Solutions & Android Terminals | Avadapay',
    description:
      'Turn any Android phone into a payment terminal with SoftPOS or deploy enterprise-grade handheld POS devices with Avadapay. Accept cards, mobile money, and contactless payments.',
    ogTitle: 'Smart POS Solutions & Android Terminals | Avadapay',
    ogDescription:
      'Turn any Android phone into a payment terminal with SoftPOS or deploy enterprise-grade handheld POS devices with Avadapay. Accept cards, mobile money, and contactless payments.',
  },
  {
    path: 'bulk-sms',
    canonical: 'https://avadapay.com/bulk-sms',
    title: 'High-Throughput Bulk SMS Platform & Carrier Gateway | Avadapay',
    description:
      'Deliver mission-critical OTPs, transactional alerts, and customer notifications across Africa with Avadapay. Direct telco carrier connections, sub-2s latency, and 99.9% delivery rate.',
    ogTitle: 'High-Throughput Bulk SMS Platform & Carrier Gateway | Avadapay',
    ogDescription:
      'Deliver mission-critical OTPs, transactional alerts, and customer notifications across Africa with Avadapay. Direct telco carrier connections, sub-2s latency, and 99.9% delivery rate.',
  },
  {
    path: 'rwanda',
    canonical: 'https://avadapay.com/rwanda',
    title: 'Avadapay Rwanda | National Payments & Mobile Money Gateway',
    description:
      'Accept MTN Mobile Money, Airtel Money, and Visa/Mastercard payments in Rwanda. Integrated smart POS terminals and carrier-grade bulk SMS in Kigali.',
    ogTitle: 'Avadapay Rwanda | National Payments & Mobile Money Gateway',
    ogDescription:
      'Accept MTN Mobile Money, Airtel Money, and Visa/Mastercard payments in Rwanda. Integrated smart POS terminals and carrier-grade bulk SMS in Kigali.',
  },
  {
    path: 'kenya',
    canonical: 'https://avadapay.com/kenya',
    title: 'Avadapay Kenya | M-Pesa STK Push, Card Processing & POS Terminals',
    description:
      'Enterprise payments infrastructure in Kenya. Instant M-Pesa STK push, C2B/B2C payouts, smart Android POS terminals, and high-throughput transactional SMS in Nairobi.',
    ogTitle: 'Avadapay Kenya | M-Pesa STK Push, Card Processing & POS Terminals',
    ogDescription:
      'Enterprise payments infrastructure in Kenya. Instant M-Pesa STK push, C2B/B2C payouts, smart Android POS terminals, and high-throughput transactional SMS in Nairobi.',
  },
  {
    path: 'tanzania',
    canonical: 'https://avadapay.com/tanzania',
    title: 'Avadapay Tanzania | M-Pesa, Tigo Pesa, Airtel Money & Halopesa',
    description:
      'Unified payment gateway for Tanzania. Connect M-Pesa, Tigo Pesa, Airtel Money, and HaloPesa with one integration. Smart POS terminals and carrier SMS in Dar es Salaam.',
    ogTitle: 'Avadapay Tanzania | M-Pesa, Tigo Pesa, Airtel Money & Halopesa',
    ogDescription:
      'Unified payment gateway for Tanzania. Connect M-Pesa, Tigo Pesa, Airtel Money, and HaloPesa with one integration. Smart POS terminals and carrier SMS in Dar es Salaam.',
  },
  {
    path: 'contact',
    canonical: 'https://avadapay.com/contact',
    title: 'Contact & Technical Inquiries | Avadapay',
    description:
      "Speak with Avadapay's financial infrastructure experts. Inquire about payment processing, POS terminals, bulk SMS rates, or custom API integrations.",
    ogTitle: 'Contact & Technical Inquiries | Avadapay',
    ogDescription:
      "Speak with Avadapay's financial infrastructure experts. Inquire about payment processing, POS terminals, bulk SMS rates, or custom API integrations.",
  },
  {
    path: 'careers',
    canonical: 'https://avadapay.com/careers',
    title: 'Careers & Job Openings across Africa & Middle East | Avadapay',
    description:
      'Join Avadapay. Discover open career opportunities in fintech, payments, engineering, sales, and executive leadership across Rwanda, Kenya, Tanzania, DRC, and Dubai.',
    ogTitle: 'Careers & Job Openings across Africa & Middle East | Avadapay',
    ogDescription:
      'Join Avadapay. Discover open career opportunities in fintech, payments, engineering, sales, and executive leadership across Rwanda, Kenya, Tanzania, DRC, and Dubai.',
  },
  {
    path: 'terms',
    canonical: 'https://avadapay.com/terms',
    title: 'Terms of Service | Avadapay',
    description:
      'Terms of Service for Avadapay financial infrastructure, payments, POS, and SMS services.',
    robots: 'noindex, follow',
  },
  {
    path: 'privacy',
    canonical: 'https://avadapay.com/privacy',
    title: 'Privacy Policy | Avadapay',
    description:
      'Privacy Policy for Avadapay financial infrastructure, payments, POS, and SMS services.',
    robots: 'noindex, follow',
  },
  {
    path: 'cookies',
    canonical: 'https://avadapay.com/cookies',
    title: 'Cookie Policy | Avadapay',
    description:
      'Cookie Policy for Avadapay financial infrastructure, payments, POS, and SMS services.',
    robots: 'noindex, follow',
  },
];

async function generateRouteShells() {
  if (!fs.existsSync(indexHtmlPath)) {
    throw new Error(`dist/index.html not found at ${indexHtmlPath}. Run vite build first.`);
  }

  const baseHtml = fs.readFileSync(indexHtmlPath, 'utf8');
  console.log(`--- Generating Pre-Rendered Route Shells for ${PUBLIC_ROUTES.length} Routes ---`);

  for (const route of PUBLIC_ROUTES) {
    let routeHtml = baseHtml;

    // 1. Update Title
    routeHtml = routeHtml.replace(
      /<title>.*?<\/title>/i,
      `<title>${route.title}</title>`
    );

    // 2. Update Canonical Link
    routeHtml = routeHtml.replace(
      /<link rel="canonical" href=".*?" \/>/i,
      `<link rel="canonical" href="${route.canonical}" />`
    );

    // 3. Update Meta Description
    routeHtml = routeHtml.replace(
      /<meta name="description" content=".*?" \/>/i,
      `<meta name="description" content="${route.description}" />`
    );

    // 4. Update Open Graph Meta
    routeHtml = routeHtml.replace(
      /<meta property="og:title" content=".*?" \/>/i,
      `<meta property="og:title" content="${route.ogTitle || route.title}" />`
    );
    routeHtml = routeHtml.replace(
      /<meta property="og:description" content=".*?" \/>/i,
      `<meta property="og:description" content="${route.ogDescription || route.description}" />`
    );
    routeHtml = routeHtml.replace(
      /<meta property="og:url" content=".*?" \/>/i,
      `<meta property="og:url" content="${route.canonical}" />`
    );

    // 5. Update Twitter Meta
    routeHtml = routeHtml.replace(
      /<meta name="twitter:title" content=".*?" \/>/i,
      `<meta name="twitter:title" content="${route.ogTitle || route.title}" />`
    );
    routeHtml = routeHtml.replace(
      /<meta name="twitter:description" content=".*?" \/>/i,
      `<meta name="twitter:description" content="${route.ogDescription || route.description}" />`
    );

    // 6. Handle Robots (e.g. noindex for legal policies)
    if (route.robots) {
      routeHtml = routeHtml.replace(
        /<meta name="robots" content=".*?" \/>/i,
        `<meta name="robots" content="${route.robots}" />`
      );
    }

    // Write both dist/<path>.html and dist/<path>/index.html
    // This allows Nginx try_files to serve both with or without trailing slash seamlessly without 301 redirects
    const singleHtmlPath = path.resolve(distDir, `${route.path}.html`);
    const routeDir = path.resolve(distDir, route.path);
    const nestedHtmlPath = path.resolve(routeDir, 'index.html');

    if (!fs.existsSync(routeDir)) {
      fs.mkdirSync(routeDir, { recursive: true });
    }

    fs.writeFileSync(singleHtmlPath, routeHtml, 'utf8');
    fs.writeFileSync(nestedHtmlPath, routeHtml, 'utf8');

    console.log(`✓ Created route shell: /${route.path} -> ${route.canonical}`);
  }

  console.log('--- All Route Shells Successfully Generated! ---');
}

generateRouteShells().catch((err) => {
  console.error('Error generating route shells:', err);
  process.exit(1);
});
