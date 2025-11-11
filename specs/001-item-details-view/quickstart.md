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
