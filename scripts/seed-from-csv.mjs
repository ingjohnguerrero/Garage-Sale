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

// CLI flags / env
const argv = process.argv.slice(2);
const WITH_SHARP = argv.includes('--with-sharp') || process.env.SEED_WITH_SHARP === '1';

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

async function gatherImages(folder, opts = {}) {
  if (!folder) return [];
  const { altBase = '', description = '' } = opts;
  const srcImagesFolder = path.join(repoRoot, 'src', 'data', 'images', folder);
  const publicFolderPath = path.join(publicImages, folder);

  // First, prefer images kept in src/data/images/<folder> (user-provided attachments).
  try {
    const files = await fs.readdir(srcImagesFolder);
    const images = files.filter(f => /\.(jpe?g|png|gif)$/i.test(f)).sort();
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

      // Optionally generate thumb/med variants when the developer opts in with --with-sharp
      if (WITH_SHARP) {
        try {
          const sharpMod = await import('sharp');
          const sharp = sharpMod.default || sharpMod;
          console.log(`Generating image variants with sharp for folder: ${folder}`);
          for (const f of images) {
            const destFile = path.join(publicFolderPath, f);
            const ext = path.extname(f).toLowerCase();
            const base = path.basename(f, ext);
            const thumbName = `${base}-thumb.jpg`;
            const medName = `${base}-med.webp`;
            const thumbPath = path.join(publicFolderPath, thumbName);
            const medPath = path.join(publicFolderPath, medName);
            try {
              // 300x200 jpg thumb
              await sharp(destFile).resize(300, 200, { fit: 'cover' }).jpeg({ quality: 75 }).toFile(thumbPath);
              // medium sized webp
              await sharp(destFile).resize(1200, 800, { fit: 'inside' }).webp({ quality: 80 }).toFile(medPath);
            } catch (e) {
              // continue on processing errors
              console.warn(`sharp failed processing ${destFile}: ${e.message || e}`);
            }
          }
        } catch (e) {
          // sharp not installed — warn and skip processing
          console.warn('`--with-sharp` requested but `sharp` could not be imported. Install it with `npm i -D sharp` or omit the flag to skip image generation.');
        }
      }

      const result = [];
      for (let idx = 0; idx < images.length; idx++) {
        const f = images[idx];
        const ext = path.extname(f).toLowerCase();
        const base = path.basename(f, ext);
        const thumbName = `${base}-thumb.jpg`;
        const medName = `${base}-med.webp`;
        const thumbPath = path.join(publicFolderPath, thumbName);
        const medPath = path.join(publicFolderPath, medName);
        const origPath = path.join(publicFolderPath, f);
        const origUrl = `/images/items/${folder}/${f}`;
        const thumbUrl = (await existsSafe(thumbPath)) ? `/images/items/${folder}/${thumbName}` : undefined;
        const medUrl = (await existsSafe(medPath)) ? `/images/items/${folder}/${medName}` : undefined;
        const src = medUrl || origUrl;
        // If we produced a webp med variant and the original is not webp, remove the original
        // from the public folder to save hosting space (only delete the copied public file).
        if (medUrl && ext !== '.webp') {
          try { await fs.unlink(origPath); } catch (e) { /* ignore */ }
        }
        // Build alt text from altBase + short description snippet when available
  const descSnippet = description ? String(description).trim().replace(/\s+/g, ' ').slice(0, 120) : '';
  const alt = `${altBase || ''}${descSnippet ? ' — ' + descSnippet : ''} — Image ${idx + 1}`.trim();
        result.push({ src, thumb: thumbUrl, med: medUrl, alt });
      }
      return result;
    }
  } catch (err) {
    // fallthrough to checking public folder
  }

  // Fallback: check if images already exist in public/images/items/<folder>
  try {
    const files = await fs.readdir(publicFolderPath);
    const images = files.filter(f => /\.(jpe?g|png|webp|gif)$/i.test(f)).sort();
    const result = [];
    for (let idx = 0; idx < images.length; idx++) {
      const f = images[idx];
      const ext = path.extname(f).toLowerCase();
      const base = path.basename(f, ext);
      const thumbName = `${base}-thumb.jpg`;
      const medName = `${base}-med.webp`;
      const thumbPath = path.join(publicFolderPath, thumbName);
      const medPath = path.join(publicFolderPath, medName);
      const origPath = path.join(publicFolderPath, f);
      const origUrl = `/images/items/${folder}/${f}`;
      const thumbUrl = (await existsSafe(thumbPath)) ? `/images/items/${folder}/${thumbName}` : undefined;
      const medUrl = (await existsSafe(medPath)) ? `/images/items/${folder}/${medName}` : undefined;
      const src = medUrl || origUrl;
      if (medUrl && ext !== '.webp') {
        try { await fs.unlink(origPath); } catch (e) { /* ignore */ }
      }
      const descSnippet = '';
      const alt = `${altBase || ''}${descSnippet ? ' — ' + descSnippet : ''} — Image ${idx + 1}`.trim();
      result.push({ src, thumb: thumbUrl, med: medUrl, alt });
    }
    return result;
  } catch (err) {
    return [];
  }
}

async function existsSafe(p) {
  try {
    await fs.access(p);
    return true;
  } catch (e) {
    return false;
  }
}

function parseDimensions(raw) {
  if (!raw || !String(raw).trim()) return undefined;
  const s = String(raw).trim();
  // Find unit if present
  const unitMatch = s.match(/(cm|mm|inches|inch|in|ft|feet|m)\b/i);
  const unit = unitMatch ? unitMatch[1].toLowerCase() : undefined;
  // Find numeric tokens (supports decimals)
  const nums = Array.from(s.matchAll(/([0-9]+(?:\.[0-9]+)?)/g)).map(m => parseFloat(m[1]));
  if (nums.length === 0) return s; // fallback to raw string
  const [width, height, depth] = nums;
  const parsed = {};
  if (!isNaN(width)) parsed.width = width;
  if (!isNaN(height)) parsed.height = height;
  if (!isNaN(depth)) parsed.depth = depth;
  if (unit) parsed.unit = unit;
  return parsed;
}

function toTitleCase(s) {
  if (!s || !String(s).trim()) return undefined;
  return String(s)
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function normalizeCategory(raw) {
  if (!raw || !String(raw).trim()) return undefined;
  // Trim whitespace and punctuation, collapse internal whitespace
  let s = String(raw).trim().replace(/[\.,;:\!\?]+$/g, '').replace(/\s+/g, ' ');
  const low = s.toLowerCase();

  // Synonyms map (lowercase -> canonical Title Case)
  const map = new Map([
    ['furniture', 'furniture'], ['furn', 'furniture'], ['sofa', 'furniture'], ['couch', 'furniture'], ['couches', 'furniture'],
    ['lighting', 'lighting'], ['lamp', 'lighting'], ['lamps', 'lighting'],
    ['books', 'books'], ['book', 'books'],
    ['toys', 'toys'], ['toy', 'toys'],
    ['tools', 'tools'], ['tool', 'tools'],
    ['kitchen', 'kitchen'], ['appliances', 'kitchen']
  ]);

  // Direct map match
  if (map.has(low)) return map.get(low);

  // Try singular/plural reductions
  const stripped = low.replace(/s$/i, '');
  if (map.has(stripped)) return map.get(stripped);

  // Fallback to lowercased trimmed string
  return toTitleCase(s).toLowerCase();
}

async function main() {
  try {
    const raw = await fs.readFile(csvPath, 'utf8');
    const rows = parseCSV(raw);
    const items = [];
    for (const r of rows) {
    const images = await gatherImages(r.folder || '', { altBase: r.name || '', description: r.description || '' });
  // Use placehold.co as the default placeholder image when no images found
  const placeholder = 'https://placehold.co/600x400?text=No+Image&bg=efefef&color=555';
  // images is now an array of descriptor objects { src, thumb?, med? }
  const imageUrl = (images && images[0]) ? (images[0].med || images[0].src) : placeholder;
      // primarySizes (explicit) — prefer med, expose thumb when present for list views
  const primarySizes = images && images[0] ? { src: images[0].src, thumb: images[0].thumb, med: images[0].med, alt: images[0].alt } : undefined;

      const item = {
        id: String(r.id || ''),
        name: r.name || '',
        // imageUrl now prefers the medium variant when available for better quality in details
  imageUrl: imageUrl,
  // imagesMeta: explicit array of descriptors { src, thumb?, med? }
  imagesMeta: images,
      // primarySizes: convenience alias for the first image's variants
      primarySizes,
  // Dimensions: keep raw string and parsed numeric object when possible
  dimensionsRaw: r.dimensions || r.size || '',
  dimensions: parseDimensions(r.dimensions || r.size || ''),
  // Category / type: normalize (trim punctuation, merge common synonyms) to avoid duplicates
  category: normalizeCategory(r.category || r.type || '') || undefined,
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
