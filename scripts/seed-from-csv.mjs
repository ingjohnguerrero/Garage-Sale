#!/usr/bin/env node
// scripts/seed-from-csv.mjs
// Read `src/data/items.csv` and generate `src/data/items.ts`

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const csvPath = path.join(repoRoot, 'src', 'data', 'items.csv');
const outPath = path.join(repoRoot, 'src', 'data', 'items.ts');
const publicImages = path.join(repoRoot, 'public', 'images', 'items');

function parseCSV(raw) {
  const lines = raw.split(/\r?\n/).map(l => l.trim()).filter(l => l && !l.startsWith('#'));
  if (lines.length === 0) return [];
  const header = lines.shift().split(',').map(h => h.trim());
  return lines.map(line => {
    // naive CSV split - this template expects no commas inside fields
    const cols = line.split(',').map(c => c.trim());
    const obj = {};
    for (let i = 0; i < header.length; i++) {
      obj[header[i]] = cols[i] ?? '';
    }
    return obj;
  });
}

async function gatherImages(folder) {
  if (!folder) return [];
  const srcImagesFolder = path.join(repoRoot, 'src', 'data', 'images', folder);
  const publicFolderPath = path.join(publicImages, folder);

  // Prefer images kept in src/data/images/<folder> (user-provided attachment).
  // If found there, copy them into public/images/items/<folder> so they are
  // available at runtime under `/images/items/<folder>/...`.
  try {
    const files = await fs.readdir(srcImagesFolder);
    const images = files.filter(f => /\.(jpe?g|png|webp|gif)$/i.test(f)).sort();
    if (images.length > 0) {
      await fs.mkdir(publicFolderPath, { recursive: true });
      for (const f of images) {
        const srcFile = path.join(srcImagesFolder, f);
        const destFile = path.join(publicFolderPath, f);
        try {
          await fs.copyFile(srcFile, destFile);
        } catch (e) {
          // ignore copy errors for individual files
        }
      }
      return images.map(f => `/images/items/${folder}/${f}`);
    }
  } catch (err) {
    // fall through to check public folder
  }

  // Fallback: check if images already exist in public/images/items/<folder>
  try {
    const files = await fs.readdir(publicFolderPath);
    const images = files.filter(f => /\.(jpe?g|png|webp|gif)$/i.test(f)).sort();
    return images.map(f => `/images/items/${folder}/${f}`);
  } catch (err) {
    return [];
  }
}

async function main() {
  try {
    const raw = await fs.readFile(csvPath, 'utf8');
    const rows = parseCSV(raw);
    const items = [];
    for (const r of rows) {
      const images = await gatherImages(r.folder || '');
  // Use placehold.co as the default placeholder image when no images found
  const placeholder = 'https://placehold.co/600x400?text=No+Image&bg=efefef&color=555';
  const imageUrl = images[0] || placeholder;
      const item = {
        id: String(r.id || ''),
        name: r.name || '',
        imageUrl,
        images,
        price: Number(r.price) || 0,
        condition: (r.condition || 'Good'),
        hidden: String((r.hidden || '')).toLowerCase() === 'true',
        timeOfUse: r.timeOfUse || '',
        deliveryTime: r.deliveryTime || '',
        status: r.status || 'Available',
        description: r.description || ''
      };
      items.push(item);
    }

    const ts = `// AUTO-GENERATED from src/data/items.csv — run scripts/seed-from-csv.mjs to regenerate\n` +
`import type { Item } from '../types';\n\nexport const ITEMS: Item[] = ${JSON.stringify(items, null, 2)} as unknown as Item[];\n`;

    // backup existing file
    try { await fs.copyFile(outPath, outPath + '.bak'); } catch (e) { /* ignore */ }
    await fs.writeFile(outPath, ts, 'utf8');
    console.log(`Wrote ${outPath} (${items.length} items)`);
  } catch (err) {
    console.error('Error:', err.message || err);
    process.exit(1);
  }
}

main();
