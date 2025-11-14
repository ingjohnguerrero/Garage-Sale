# Garage Sale

A static Vite + React + TypeScript website for displaying garage sale items. The site operates within a configured date window and displays items with client-side filtering and sorting capabilities.

## Overview

This is a temporal garage sale website where:
- All content is hardcoded in the source code
- The site is only active within a configured date window
- Content updates require code changes and redeployment
- No backend, authentication, or runtime admin panel
- Client-side filtering and sorting are available

## Sale Window

The sale is active between these dates (configured in `src/constants.ts`):

- **Start:** November 15, 2025, 00:00:00 UTC
- **End:** January 6, 2026, 23:59:59 UTC

When the current date is outside this window, visitors will see an inactive notice with localized formatted start and end dates. Otherwise, the item listing is displayed.

## Features

- **Time-based activation:** Automatically shows/hides content based on current date
- **Item management:** All items are hardcoded in `src/data/items.ts`
- **Filtering:** Filter by status (All/Available/Sold) and condition (All/New/Like New/Good/Fair/Poor)
- **Sorting:** Sort by price (low to high, high to low) or name (A to Z, Z to A)
- **Responsive design:** Works on desktop, tablet, and mobile devices
- **Sold overlay:** Visual "SOLD" stamp on sold items
- **Accessibility:** Semantic HTML, ARIA attributes, and keyboard navigation support
- **Localized formatting:** Prices and dates formatted according to user's locale

### Item Details View

The project includes a modal-first Item Details View that opens when a listing item is tapped/clicked. The details view includes:

- An image carousel (swipe/tap/keyboard support) with thumbnails.
- Modal-first navigation using pushState/popstate so the browser Back button closes the modal.
- Progressive image loading with placeholder -> image transition and optional build-time image variants produced by `sharp` (developer opt-in).


## Tech Stack

- **Vite** - Build tool and dev server
- **React** - UI library (functional components)
- **TypeScript** - Type safety
- **CSS** - Styling with responsive grid layout

## Project Structure

```
├── public/              # Static assets
├── src/
│   ├── components/      # React components
│   │   ├── FilterSort.tsx
│   │   ├── InactiveNotice.tsx
│   │   ├── ItemCard.tsx
│   │   └── ItemGrid.tsx
│   ├── data/
│   │   └── items.ts     # Hardcoded items data
│   ├── App.tsx          # Main application component
│   ├── constants.ts     # Sale window constants
│   ├── main.tsx         # Application entry point
│   ├── styles.css       # Global styles
│   └── types.ts         # TypeScript type definitions
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/ingjohnguerrero/Garage-Sale.git
cd Garage-Sale
```

2. Install dependencies:
```bash
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or another port if 5173 is in use).

### Building for Production

Build the application for production:

```bash
npm run build
```

The built files will be in the `dist/` directory.

### Preview Production Build

Preview the production build locally:

```bash
npm run preview
```

## Deployment

This is a static website that can be deployed to any static hosting service:

### Manual Deployment Steps

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Upload the `dist/` folder** to your hosting service of choice:
   - **Netlify:** Drag and drop the `dist` folder to Netlify's web interface
   - **Vercel:** Use the Vercel CLI or connect your Git repository
   - **GitHub Pages:** Copy contents of `dist/` to your gh-pages branch
   - **AWS S3:** Upload `dist/` contents to an S3 bucket configured for static hosting
   - **Cloudflare Pages:** Connect your repository or upload the `dist` folder

3. **Configure your hosting** (if needed):
   - Ensure the hosting service serves `index.html` for all routes
   - Set up a custom domain if desired

### Popular Static Hosting Services

- [Netlify](https://www.netlify.com/)
- [Vercel](https://vercel.com/)
- [GitHub Pages](https://pages.github.com/)
- [Cloudflare Pages](https://pages.cloudflare.com/)
- [AWS S3 + CloudFront](https://aws.amazon.com/s3/)
- [Firebase Hosting](https://firebase.google.com/docs/hosting)

### Firebase Hosting (recommended for this project)

This project is a static single-page app built with Vite. The production build output goes to the `dist/` directory which works well with Firebase Hosting.

1. Install the Firebase CLI (globally) or use `npx` for one-off commands:

```bash
npm install -g firebase-tools
# or use npx for one-off usage
```

2. Login and initialize hosting (one-time):

```bash
npx firebase login
npx firebase init hosting
# When prompted, select or create a project and set the public directory to `dist`.
# Answer "Yes" when asked to configure as a single-page app so that all routes
# are rewritten to `index.html`.
```

3. Build and deploy:

```bash
npm run build
npx firebase deploy --only hosting
```

You can also use the convenience npm script added to `package.json`:

```bash
npm run deploy
```

Notes:
- The repository includes `firebase.json` (hosting config) and a `.firebaserc` file with a placeholder project id. Replace the placeholder in `.firebaserc` or run `npx firebase init` to select a project.
- If you prefer not to install the CLI globally, `npx firebase` works without a global install.

## Customization

### Updating Sale Dates

Edit `src/constants.ts`:

```typescript
export const SALE_START = new Date("2025-11-15T00:00:00Z");
export const SALE_END   = new Date("2026-01-06T23:59:59Z");
```

### Adding/Modifying Items

Edit `src/data/items.ts` to add, remove, or modify items:

```typescript
export const ITEMS: Item[] = [
  {
    id: "1",
    name: "Item Name",
    imageUrl: "https://via.placeholder.com/600x400",
    price: 50.00,
    condition: "Good",
    timeOfUse: "2 years",
    deliveryTime: "Available for pickup",
    status: "Available",
    description: "Optional description"
  },
  // Add more items...
];
```

### CSV / Seeder: dimensions column

The seeder reads `src/data/items.csv` when generating `src/data/items.ts`. A new optional `dimensions` column is supported. Put a human-friendly size string in this column, for example:

- "12 x 8 x 2 in"
- "30×20×5 cm"
- "100 x 50 cm" (width x height, depth optional)

The seeder will try to parse numeric width/height/depth and unit into structured fields (`dimensionsRaw` and `dimensions` parsed object) so the UI can display and the data can be used for filtering/sorting in future.

If you edit `src/data/items.csv`, run:

```bash
node scripts/seed-from-csv.mjs
```

to regenerate `src/data/items.ts`.

### CSV: category column

You can provide an optional `category` column in `src/data/items.csv` to classify items (examples: `furniture`, `lighting`, `kitchen`, `tools`, `office`, `books`, `toys`). When present the seeder will include this as `category` on each generated item so the UI can display it and it can be used for filtering later.

Example CSV header including category:

```
id,name,folder,category,dimensions,price,condition,timeOfUse,deliveryTime,status,hidden,description
```

After editing the CSV, run the seeder to regenerate `src/data/items.ts`:

```bash
node scripts/seed-from-csv.mjs
```

### Changing Styles

Edit `src/styles.css` to customize colors, fonts, layout, and more.

## Item Data Structure

Each item has the following properties:

```typescript
interface Item {
  id: string;                                           // Unique identifier
  name: string;                                         // Item name
  imageUrl: string;                                     // Image URL
  price: number;                                        // Price in dollars
  condition: "New" | "Like New" | "Good" | "Fair" | "Poor"; // Item condition
  timeOfUse: string;                                    // How long item was used
  deliveryTime: string;                                 // Delivery/pickup information
  status: "Available" | "Sold";                         // Availability status
  description?: string;                                 // Optional description
}
```

## Accessibility

This application follows web accessibility best practices:

- Semantic HTML elements (`<header>`, `<main>`, `<footer>`)
- ARIA labels for form controls
- Keyboard-focusable interactive elements
- Alt text for all images
- Color contrast meeting WCAG guidelines
- Support for prefers-reduced-motion

## Browser Support

This application works in all modern browsers:

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## License

This project is provided as-is for personal or educational use.

## Contributing

This is a personal garage sale project. If you'd like to suggest improvements, please open an issue.

## Developer: Image seeding (sharp opt-in)

The project provides a small seeder script (`scripts/seed-from-csv.mjs`) that copies images from `src/data/images/<folder>/` into `public/images/items/<folder>/` and generates `src/data/items.ts` from `src/data/items.csv`.

- By default the seeder copies files only. To generate optimized thumbnail and medium webp variants opt in with `--with-sharp`:

```bash
node scripts/seed-from-csv.mjs --with-sharp
```

Or set `SEED_WITH_SHARP=1` in the environment. If `--with-sharp` is passed but the `sharp` package is not installed the seeder will warn and continue without producing variants. To produce variants locally install `sharp` as a dev dependency:

```bash
npm install -D sharp
```

When `-med.webp` variants are produced the seeder removes the copied original image for that file to save hosting space; the `-med.webp` variant is preferred for the detail view.
