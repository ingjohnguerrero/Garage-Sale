# Setup Guide

This guide will help you set up the Garage Sale project on your local development environment.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher recommended)
  - Download from: https://nodejs.org/
  - Verify installation: `node --version`
- **npm** (comes with Node.js) or **yarn**
  - Verify installation: `npm --version`
- **Git** (for version control)
  - Download from: https://git-scm.com/
  - Verify installation: `git --version`

## Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/ingjohnguerrero/Garage-Sale.git
cd Garage-Sale
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required dependencies including:
- React 18 and React DOM
- TypeScript
- Vite
- Embla Carousel
- Testing libraries (Vitest, React Testing Library, jest-axe)
- Sharp (optional, for image optimization)

### 3. Verify Installation

Check that the installation was successful:

```bash
npm run build
```

This should compile TypeScript and build the production bundle without errors.

## Configuration

### Sale Window Configuration

The sale dates are configured in `src/constants.ts`:

```typescript
export const SALE_START = new Date("2025-10-15T00:00:00Z");
export const SALE_END   = new Date("2026-01-06T23:59:59Z");
```

**To change the sale window:**
1. Open `src/constants.ts`
2. Update `SALE_START` and `SALE_END` with your desired dates
3. Use ISO 8601 format in UTC timezone
4. Rebuild the application: `npm run build`

### Firebase Hosting Configuration

If you plan to deploy to Firebase Hosting:

1. **Install Firebase CLI** (if not already installed):
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase**:
   ```bash
   firebase login
   ```

3. **Update Project ID** in `.firebaserc`:
   ```json
   {
     "projects": {
       "default": "your-firebase-project-id"
     }
   }
   ```

4. **Initialize Firebase** (if needed):
   ```bash
   firebase init hosting
   ```
   - Set public directory to: `dist`
   - Configure as single-page app: **Yes**
   - Set up automatic builds with GitHub: **Optional**

### Vite Configuration

The Vite configuration is minimal by default (`vite.config.ts`):

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
```

**Optional customizations:**
- Add base URL for subdirectory deployment
- Configure proxy for API calls (if needed in future)
- Add environment variables

## Development Setup

### 1. Start Development Server

```bash
npm run dev
```

The application will be available at:
- **Local**: http://localhost:5173
- **Network**: http://[your-ip]:5173

The dev server supports:
- ⚡️ Hot Module Replacement (HMR)
- 🔧 Automatic TypeScript compilation
- 🎨 CSS hot reload
- 🐛 Source maps for debugging

### 2. Verify the Application

Open your browser and navigate to `http://localhost:5173`. You should see:
- The Garage Sale header
- Filter and sort controls
- Grid of items (if within sale window)
- Or inactive notice (if outside sale window)

### 3. Test the Application

Run the test suite:

```bash
npm test
```

This will execute:
- Unit tests for components
- Accessibility tests (a11y)
- Integration tests
- Tests run in watch mode by default

## Data Configuration

### Managing Items

Items are stored in `src/data/items.csv` and auto-generated to `src/data/items.ts`.

#### CSV Format

```csv
id,name,folder,category,dimensions,price,condition,timeOfUse,deliveryTime,status,hidden,description
1,Vintage Table,table1,furniture,30 x 20 x 30 in,75,Good,3 years,Pickup only,Available,false,Small mid-century side table
```

**CSV Columns:**
- `id` - Unique identifier (required)
- `name` - Item name (required)
- `folder` - Subfolder in `src/data/images/` containing item images
- `category` - Category (e.g., furniture, lighting, kitchen)
- `dimensions` - Size string (e.g., "30 x 20 x 30 in")
- `price` - Price in dollars (required)
- `condition` - New | Like New | Good | Fair | Poor
- `timeOfUse` - Usage duration (e.g., "3 years")
- `deliveryTime` - Delivery/pickup info
- `status` - Available | Sold
- `hidden` - true/false (hide from listings)
- `description` - Optional description text

#### Regenerating Items Data

After editing `src/data/items.csv`:

```bash
# Basic regeneration (copy images only)
node scripts/seed-from-csv.mjs

# With Sharp image optimization (creates thumbnails and WebP variants)
node scripts/seed-from-csv.mjs --with-sharp
```

**Image Organization:**
- Place images in: `src/data/images/<folder>/`
- Supported formats: JPG, PNG, WebP
- Images copied to: `public/images/items/<folder>/`

#### Optional Sharp Installation

For image optimization during seeding:

```bash
npm install -D sharp
```

Then run seeder with optimization:

```bash
node scripts/seed-from-csv.mjs --with-sharp
```

This generates:
- `-thumb.jpg` - Small thumbnails for list view
- `-med.webp` - Medium WebP variants for detail view

## Environment Variables

Currently, the project doesn't require environment variables. All configuration is in source files:

- Sale dates: `src/constants.ts`
- Items data: `src/data/items.ts` (generated from CSV)
- Styles: `src/styles.css`

## Troubleshooting

### Port Already in Use

If port 5173 is already in use:

```bash
# Vite will automatically try the next available port
# Or specify a custom port:
npm run dev -- --port 3000
```

### Build Errors

**TypeScript errors:**
```bash
# Check TypeScript configuration
npx tsc --noEmit
```

**Dependency issues:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Image Loading Issues

- Verify images exist in `public/images/items/`
- Check console for 404 errors
- Verify imageUrl paths in `src/data/items.ts`
- Run seeder script to regenerate image paths

### Test Failures

```bash
# Run tests in non-watch mode
npm test -- --run

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test -- item-detail.spec.tsx
```

## Next Steps

- ✅ **[Development Guide](./Development-Guide.md)** - Learn development workflows
- ✅ **[Deployment](./Deployment.md)** - Deploy to production
- ✅ **[Architecture](./Architecture.md)** - Understand the system architecture

---

**Last Updated**: November 2025
