/* eslint-disable no-undef */
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const dirsToScan = [
  'apps/web/public/media',
  'apps/web/public',
  'apps/web/src/assets'
];

async function optimize() {
  console.log('--- Starting Image Optimization ---');
  let totalBefore = 0;
  let totalAfter = 0;

  for (const dir of dirsToScan) {
    if (!fs.existsSync(dir)) continue;
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const ext = path.extname(file).toLowerCase();
      if (!['.jpg', '.jpeg', '.png'].includes(ext)) continue;

      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      const baseName = path.basename(file, ext);
      const webpPath = path.join(dir, `${baseName}.webp`);

      totalBefore += stat.size;

      const image = sharp(filePath);
      const metadata = await image.metadata();

      let pipeline = image.rotate(); // auto-orient
      if (metadata.width && metadata.width > 1920) {
        pipeline = pipeline.resize({ width: 1920, withoutEnlargement: true });
      }

      // Generate WebP
      await pipeline
        .webp({ quality: 82, effort: 6 })
        .toFile(webpPath);

      const webpStat = fs.statSync(webpPath);
      totalAfter += webpStat.size;

      const reduction = Math.round((1 - webpStat.size / stat.size) * 100);
      console.log(`Optimized: ${filePath} (${Math.round(stat.size / 1024)}KB) -> ${baseName}.webp (${Math.round(webpStat.size / 1024)}KB, -${reduction}%)`);
    }
  }

  console.log(`\nTotal Original: ${Math.round(totalBefore / 1024)} KB`);
  console.log(`Total WebP: ${Math.round(totalAfter / 1024)} KB`);
  console.log(`Total Bandwidth Saved: ${Math.round((totalBefore - totalAfter) / 1024)} KB (-${Math.round((1 - totalAfter / totalBefore) * 100)}%)`);
}

optimize().catch(err => {
  console.error('Error optimizing images:', err);
  process.exit(1);
});
