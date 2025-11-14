# Quickstart: Item Details View (developer)

Date: 2025-11-11

Steps to develop and preview the Item Details View locally:

1. Install dependencies (from repo root):

```bash
npm install
```

2. (Optional) Install `sharp` for image optimization during seeding:

```bash
npm install --save-dev sharp
```

3. Prepare images under `src/data/images/<folder>/` matching the CSV `folder` column
   or place them under `public/images/items/<folder>/`.

4. Edit `src/data/items.csv` to add or update items, then run the seed script:

```bash
node scripts/seed-from-csv.mjs
```

5. Start the dev server and open the site:

```bash
npm run dev
```

6. Open a listing item and verify the details view opens and the carousel
   navigates images. Use a mobile viewport to validate responsiveness.

---

Notes on thumbnails and optimized variants

If you want the seeder to produce thumbnail and medium-sized variants, install `sharp` as a developer dependency first:

```bash
npm install --save-dev sharp
```

When `sharp` is present the seeder will create `<filename>-thumb.jpg` (300x200) and `<filename>-med.webp` (medium webp) in the same public image folder. The generated `src/data/items.ts` will still reference the main image; the variants are produced for runtime optimization use where appropriate.

Optional: explicit opt-in for variant generation

The seeder will not run `sharp` processing unless you opt in. Two ways to opt-in:

- Pass the `--with-sharp` CLI flag when running the seeder:

```bash
node scripts/seed-from-csv.mjs --with-sharp
```

- Or set the environment variable for CI: `SEED_WITH_SHARP=1 node scripts/seed-from-csv.mjs`.

If `--with-sharp` is provided but `sharp` is not installed the seeder will print a warning and continue without producing variants.
