/* eslint-disable no-undef */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const webRoot = path.resolve(__dirname, '..');
const publicDir = path.resolve(webRoot, 'public');

const faviconSvgPath = path.resolve(publicDir, 'favicon.svg');
const logoSvgPath = path.resolve(publicDir, 'logo.svg');

/**
 * Creates a valid multi-image ICO binary buffer from an array of PNG buffers
 */
function createIco(pngEntries) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // Reserved
  header.writeUInt16LE(1, 2); // 1 = ICO type
  header.writeUInt16LE(pngEntries.length, 4); // Number of images

  let offset = 6 + pngEntries.length * 16;
  const directoryEntries = [];
  for (const { buffer, width, height } of pngEntries) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(width >= 256 ? 0 : width, 0);
    entry.writeUInt8(height >= 256 ? 0 : height, 1);
    entry.writeUInt8(0, 2); // Color palette
    entry.writeUInt8(0, 3); // Reserved
    entry.writeUInt16LE(1, 4); // Color planes
    entry.writeUInt16LE(32, 6); // Bits per pixel
    entry.writeUInt32LE(buffer.length, 8); // Size of image data
    entry.writeUInt32LE(offset, 12); // Offset of image data
    directoryEntries.push(entry);
    offset += buffer.length;
  }
  return Buffer.concat([header, ...directoryEntries, ...pngEntries.map((e) => e.buffer)]);
}

async function generateSeoAssets() {
  console.log('--- Generating High-Resolution SEO Assets for Avadapay ---');

  if (!fs.existsSync(faviconSvgPath)) {
    throw new Error(`favicon.svg not found at ${faviconSvgPath}`);
  }
  if (!fs.existsSync(logoSvgPath)) {
    throw new Error(`logo.svg not found at ${logoSvgPath}`);
  }

  const faviconSvg = fs.readFileSync(faviconSvgPath);
  const logoSvg = fs.readFileSync(logoSvgPath);

  // 1. Generate Favicon PNGs (48x48, 96x96, 192x192, 512x512)
  const iconSizes = [
    { name: 'favicon-48x48.png', size: 48, padding: 3 },
    { name: 'favicon-96x96.png', size: 96, padding: 6 },
    { name: 'favicon-192x192.png', size: 192, padding: 12 },
    { name: 'favicon-512x512.png', size: 512, padding: 32 },
  ];

  for (const { name, size, padding } of iconSizes) {
    const innerSize = size - padding * 2;
    const innerBuffer = await sharp(faviconSvg)
      .resize(innerSize, innerSize, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .toBuffer();

    await sharp({
      create: {
        width: size,
        height: size,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      },
    })
      .composite([{ input: innerBuffer, gravity: 'center' }])
      .png()
      .toFile(path.resolve(publicDir, name));

    console.log(`✓ Created ${name} (${size}x${size})`);
  }

  // 2. Generate Apple Touch Icon (180x180, opaque background #0B132B as per iOS specifications)
  const appleTouchSize = 180;
  const appleInnerSize = 130;
  const appleInnerBuffer = await sharp(faviconSvg)
    .resize(appleInnerSize, appleInnerSize, { fit: 'contain' })
    .toBuffer();

  await sharp({
    create: {
      width: appleTouchSize,
      height: appleTouchSize,
      channels: 4,
      background: { r: 11, g: 19, b: 43, alpha: 1 }, // #0B132B
    },
  })
    .composite([{ input: appleInnerBuffer, gravity: 'center' }])
    .png()
    .toFile(path.resolve(publicDir, 'apple-touch-icon.png'));
  console.log('✓ Created apple-touch-icon.png (180x180, opaque #0B132B)');

  // 3. Generate Multi-Resolution favicon.ico (48x48, 32x32, 16x16)
  const icoSizes = [48, 32, 16];
  const icoPngEntries = [];
  for (const s of icoSizes) {
    const p = Math.max(1, Math.round(s * 0.06));
    const innerS = s - p * 2;
    const inner = await sharp(faviconSvg)
      .resize(innerS, innerS, { fit: 'contain' })
      .toBuffer();

    const pngBuffer = await sharp({
      create: {
        width: s,
        height: s,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      },
    })
      .composite([{ input: inner, gravity: 'center' }])
      .png()
      .toBuffer();

    icoPngEntries.push({ buffer: pngBuffer, width: s, height: s });
  }

  const icoBuffer = createIco(icoPngEntries);
  fs.writeFileSync(path.resolve(publicDir, 'favicon.ico'), icoBuffer);
  console.log('✓ Created multi-resolution favicon.ico (48x48, 32x32, 16x16)');

  // 4. Generate Organization Logo (Square 512x512 with dark rounded brand backdrop)
  const logoSquareSvg = `
    <svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="512" height="512" rx="104" fill="#0B132B"/>
      <circle cx="256" cy="256" r="180" fill="#3BBA93" fill-opacity="0.12"/>
      <g transform="translate(146, 150) scale(1.85)">
        <path d="M0.358685 108.689C-0.139981 107.789 -0.119987 106.765 0.424013 105.884L23.3227 68.852C23.8414 68.016 24.6907 67.544 25.6747 67.544C33.6067 67.5307 69.2507 67.4853 81.1413 67.492C82.0347 67.492 82.8 67.1093 83.344 66.4026C83.8814 65.6973 84.0507 64.8547 83.8173 63.9987L73.404 25.6133H72.7827L62.3307 43.5813C61.8187 44.4559 60.9507 44.956 59.9334 44.956H43.0667C42.036 44.956 41.1547 44.4373 40.6493 43.5359C40.1507 42.6359 40.1707 41.6119 40.7147 40.7373L65.0974 1.31467C65.616 0.47334 66.464 -2.36265e-05 67.4494 -2.36265e-05H84.012C85.2427 -2.36265e-05 86.292 0.777283 86.6547 1.95595L118.697 106.532C118.963 107.4 118.813 108.256 118.276 108.988C117.732 109.713 116.955 110.108 116.047 110.108H98.1507C96.8933 110.108 95.824 109.305 95.4867 108.087L89.8947 88.1813C89.5587 86.9693 88.4894 86.16 87.232 86.1666L39.0173 86.2053C38.012 86.2053 37.1507 86.6973 36.6387 87.5587L24.0747 108.755C23.5627 109.616 22.7014 110.108 21.6907 110.108H2.77601C1.74535 110.108 0.864019 109.591 0.358685 108.689Z" fill="#3BBA93"/>
      </g>
    </svg>
  `;
  await sharp(Buffer.from(logoSquareSvg)).png().toFile(path.resolve(publicDir, 'logo-512.png'));
  console.log('✓ Created logo-512.png (512x512)');

  // 5. Generate Horizontal High-Res Wordmark Logo (apps/web/public/logo-horizontal.png)
  await sharp(logoSvg)
    .resize(800, null, { fit: 'inside' })
    .png()
    .toFile(path.resolve(publicDir, 'logo-horizontal.png'));
  console.log('✓ Created logo-horizontal.png (800px width)');

  // 6. Generate Open Graph / Twitter Card Image (1200x630)
  const ogSvg = `
    <svg width="1200" height="630" viewBox="0 0 1200 630" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="grad1" cx="80%" cy="20%" r="65%" fx="80%" fy="20%">
          <stop offset="0%" stop-color="#3BBA93" stop-opacity="0.32" />
          <stop offset="100%" stop-color="#0B132B" stop-opacity="0" />
        </radialGradient>
        <radialGradient id="grad2" cx="15%" cy="85%" r="55%" fx="15%" fy="85%">
          <stop offset="0%" stop-color="#1E293B" stop-opacity="0.6" />
          <stop offset="100%" stop-color="#0B132B" stop-opacity="0" />
        </radialGradient>
        <linearGradient id="brandGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#3BBA93" />
          <stop offset="100%" stop-color="#2DD4BF" />
        </linearGradient>
      </defs>

      <!-- Background Canvas -->
      <rect width="1200" height="630" fill="#0B132B"/>
      <rect width="1200" height="630" fill="url(#grad1)"/>
      <rect width="1200" height="630" fill="url(#grad2)"/>

      <!-- Ambient Geometric Glow Lines -->
      <line x1="80" y1="530" x2="1120" y2="530" stroke="#3BBA93" stroke-opacity="0.2" stroke-width="1" />
      <line x1="80" y1="120" x2="1120" y2="120" stroke="#FFFFFF" stroke-opacity="0.08" stroke-width="1" />

      <!-- Top Badge -->
      <rect x="80" y="60" width="230" height="38" rx="19" fill="#3BBA93" fill-opacity="0.15" stroke="#3BBA93" stroke-opacity="0.3"/>
      <circle cx="98" cy="79" r="5" fill="#3BBA93" />
      <text x="114" y="84" font-family="'Inter', -apple-system, sans-serif" font-size="14" font-weight="600" fill="#3BBA93" letter-spacing="0.5">FINANCIAL INFRASTRUCTURE</text>

      <!-- Domain Indicator -->
      <text x="1120" y="84" font-family="'Inter', -apple-system, sans-serif" font-size="16" font-weight="600" fill="#94A3B8" text-anchor="end">avadapay.com</text>

      <!-- Main Headline & Subtitle -->
      <text x="80" y="210" font-family="'Mulish', 'Inter', -apple-system, sans-serif" font-size="56" font-weight="900" fill="#FFFFFF" letter-spacing="-1">
        Avadapay
      </text>
      <text x="80" y="275" font-family="'Mulish', 'Inter', -apple-system, sans-serif" font-size="34" font-weight="700" fill="#3BBA93">
        Global Financial Infrastructure &amp; Technology
      </text>
      <text x="80" y="335" font-family="'Inter', -apple-system, sans-serif" font-size="20" font-weight="400" fill="#CBD5E1">
        Next-generation payment gateway, omni-channel point-of-sale systems,
      </text>
      <text x="80" y="370" font-family="'Inter', -apple-system, sans-serif" font-size="20" font-weight="400" fill="#CBD5E1">
        and high-throughput carrier messaging for modern enterprises across Africa.
      </text>

      <!-- Value Proposition Pills -->
      <g transform="translate(80, 430)">
        <!-- Pill 1 -->
        <rect x="0" y="0" width="200" height="48" rx="12" fill="#1E293B" stroke="#3BBA93" stroke-opacity="0.35"/>
        <text x="100" y="30" font-family="'Inter', -apple-system, sans-serif" font-size="15" font-weight="600" fill="#FFFFFF" text-anchor="middle">Payment Processing</text>

        <!-- Pill 2 -->
        <rect x="215" y="0" width="165" height="48" rx="12" fill="#1E293B" stroke="#3BBA93" stroke-opacity="0.35"/>
        <text x="297" y="30" font-family="'Inter', -apple-system, sans-serif" font-size="15" font-weight="600" fill="#FFFFFF" text-anchor="middle">Smart POS Terminals</text>

        <!-- Pill 3 -->
        <rect x="395" y="0" width="160" height="48" rx="12" fill="#1E293B" stroke="#3BBA93" stroke-opacity="0.35"/>
        <text x="475" y="30" font-family="'Inter', -apple-system, sans-serif" font-size="15" font-weight="600" fill="#FFFFFF" text-anchor="middle">Bulk SMS Platform</text>

        <!-- Pill 4 -->
        <rect x="570" y="0" width="165" height="48" rx="12" fill="#1E293B" stroke="#3BBA93" stroke-opacity="0.35"/>
        <text x="652" y="30" font-family="'Inter', -apple-system, sans-serif" font-size="15" font-weight="600" fill="#FFFFFF" text-anchor="middle">Mobile Money Rails</text>
      </g>

      <!-- Footer Regional Coverage -->
      <text x="80" y="575" font-family="'Inter', -apple-system, sans-serif" font-size="16" font-weight="600" fill="#94A3B8">
        Regional Presence: <tspan fill="#FFFFFF">Rwanda</tspan> • <tspan fill="#FFFFFF">Kenya</tspan> • <tspan fill="#FFFFFF">Tanzania</tspan> • <tspan fill="#FFFFFF">UAE (HQ)</tspan>
      </text>

      <text x="1120" y="575" font-family="'Inter', -apple-system, sans-serif" font-size="15" font-weight="600" fill="#3BBA93" text-anchor="end">
        Bank-Grade Security • 99.99% SLA
      </text>
    </svg>
  `;

  await sharp(Buffer.from(ogSvg))
    .png({ quality: 90 })
    .toFile(path.resolve(publicDir, 'og-image.png'));
  console.log('✓ Created og-image.png (1200x630)');

  console.log('--- All High-Resolution SEO Assets Successfully Generated! ---');
}

generateSeoAssets().catch((err) => {
  console.error('Error generating SEO assets:', err);
  process.exit(1);
});
