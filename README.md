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
