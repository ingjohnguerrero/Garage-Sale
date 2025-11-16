# Development Guide

This guide covers development workflows, best practices, and common tasks for working on the Garage Sale project.

## Development Environment

### Prerequisites

Ensure you have the development environment set up as described in the [Setup Guide](./Setup.md).

**Required:**
- Node.js 18+
- npm or yarn
- Git
- Code editor (VS Code recommended)

**Recommended VS Code Extensions:**
- ESLint
- TypeScript and JavaScript Language Features
- Prettier
- GitLens

### First Time Setup

```bash
# Clone and setup
git clone https://github.com/ingjohnguerrero/Garage-Sale.git
cd Garage-Sale
npm install

# Verify setup
npm run build
npm test -- --run
```

## Development Workflow

### Standard Development Loop

```bash
# 1. Start dev server
npm run dev

# 2. Make changes in src/
#    - Hot module replacement (HMR) updates automatically
#    - TypeScript errors shown in terminal

# 3. Test changes
npm test

# 4. Build to verify production
npm run build

# 5. Commit changes
git add .
git commit -m "feat: add new feature"
git push
```

### Development Server

```bash
npm run dev
```

**Features:**
- ⚡️ Lightning-fast HMR (Hot Module Replacement)
- 🔧 Automatic TypeScript compilation
- 🎨 CSS hot reload
- 🐛 Source maps for debugging
- 📱 Network access (test on mobile devices)

**Output:**
```
  VITE v5.0.8  ready in 234 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: http://192.168.1.100:5173/
  ➜  press h to show help
```

**Dev Server Commands:**
- `r` - Restart server
- `u` - Show server URL
- `o` - Open in browser
- `c` - Clear console
- `q` - Quit server

### Hot Module Replacement (HMR)

Vite provides instant updates without full page reload:

**What triggers HMR:**
- ✅ Component changes
- ✅ CSS changes
- ✅ TypeScript changes
- ✅ Import changes

**What requires reload:**
- ❌ Config changes (vite.config.ts)
- ❌ Environment variable changes
- ❌ New dependencies (package.json)

## Code Organization

### File Structure

```
src/
├── components/           # React components
│   ├── ItemCard.tsx     # Individual item card
│   ├── ItemGrid.tsx     # Grid layout + modal management
│   ├── ItemDetail.tsx   # Modal detail view
│   ├── ImageCarousel.tsx # Image carousel
│   ├── FilterSort.tsx   # Filter/sort controls
│   └── InactiveNotice.tsx # Sale inactive notice
├── data/
│   ├── items.csv        # Source data (edit this)
│   ├── items.ts         # Generated (don't edit)
│   └── images/          # Source images
│       └── <folder>/    # Item image folders
├── App.tsx              # Root component
├── main.tsx             # Entry point
├── types.ts             # TypeScript interfaces
├── constants.ts         # Configuration constants
└── styles.css           # Global styles
```

### Naming Conventions

**Components:**
- PascalCase: `ItemCard.tsx`, `ImageCarousel.tsx`
- One component per file
- Export as default or named export

**Variables:**
- camelCase: `itemData`, `filteredItems`
- Constants: UPPER_SNAKE_CASE: `SALE_START`, `SALE_END`

**CSS Classes:**
- kebab-case: `item-card`, `modal-overlay`
- BEM-style: `item-card__title`, `item-card--sold`

**Types:**
- PascalCase: `Item`, `ImageDescriptor`, `FilterState`
- Props interfaces: `ComponentNameProps`

## Common Development Tasks

### Adding a New Item

**Method 1: Edit CSV (Recommended)**

1. Open `src/data/items.csv`
2. Add new row with item data
3. Place images in `src/data/images/<folder>/`
4. Run seeder:
   ```bash
   node scripts/seed-from-csv.mjs --with-sharp
   ```
5. Verify in dev server

**Method 2: Manual Edit**

1. Open `src/data/items.ts`
2. Add item object to `ITEMS` array
3. Ensure images in `public/images/items/`

**CSV Row Example:**
```csv
10,Blue Couch,couch1,furniture,80 x 35 x 32 in,250,Good,1 year,Pickup only,Available,false,Comfortable sectional sofa
```

### Adding a New Category

Categories are automatically extracted from items:

1. Add items with new category in CSV:
   ```csv
   11,Garden Tools,tools1,garden,,,Good,2 years,Pickup only,Available,false,Rake and shovel set
   ```

2. Run seeder:
   ```bash
   node scripts/seed-from-csv.mjs
   ```

3. Category automatically appears in filter

### Updating Sale Dates

Edit `src/constants.ts`:

```typescript
export const SALE_START = new Date("2025-11-15T00:00:00Z");
export const SALE_END   = new Date("2026-01-06T23:59:59Z");
```

**Important:**
- Use UTC timezone (Z suffix)
- ISO 8601 format
- Rebuild after changes: `npm run build`

### Adding a New Component

1. **Create component file:**
   ```typescript
   // src/components/NewComponent.tsx
   import { Item } from '../types';
   
   interface NewComponentProps {
     item: Item;
     onAction?: () => void;
   }
   
   export function NewComponent({ item, onAction }: NewComponentProps) {
     return (
       <div className="new-component">
         <h3>{item.name}</h3>
         <button onClick={onAction}>Action</button>
       </div>
     );
   }
   ```

2. **Add styles in styles.css:**
   ```css
   .new-component {
     padding: 1rem;
     border: 1px solid #ddd;
   }
   ```

3. **Import and use:**
   ```typescript
   import { NewComponent } from './components/NewComponent';
   ```

### Modifying Styles

Global styles in `src/styles.css`:

```css
/* Component-specific styles */
.item-card {
  /* Styles here */
}

/* Responsive styles */
@media (max-width: 768px) {
  .item-card {
    /* Mobile styles */
  }
}
```

**CSS Custom Properties:**
```css
:root {
  --primary-color: #2196f3;
  --text-color: #333;
  --border-radius: 8px;
}
```

### Adding Image Variants

The seeder with Sharp generates optimized images:

```bash
# Install Sharp (if not already)
npm install -D sharp

# Run seeder with optimization
node scripts/seed-from-csv.mjs --with-sharp
```

**Generated variants:**
- `-thumb.jpg` - Thumbnail (width: 300px, quality: 80%)
- `-med.webp` - Medium WebP (width: 800px, quality: 85%)

**Usage in code:**
```typescript
// List view (fast)
<img src={item.primarySizes?.thumb || item.imageUrl} />

// Detail view (quality)
<img src={item.primarySizes?.med || item.imageUrl} />
```

## Testing

### Running Tests

```bash
# Run all tests (watch mode)
npm test

# Run tests once
npm test -- --run

# Run specific test file
npm test -- ItemCard.spec.tsx

# Run with coverage
npm test -- --coverage

# Run accessibility tests only
npm test -- a11y
```

### Writing Tests

**Component Test Example:**

```typescript
// src/components/__tests__/ItemCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { ItemCard } from '../ItemCard';

const mockItem = {
  id: '1',
  name: 'Test Item',
  imageUrl: '/test.jpg',
  price: 50,
  condition: 'Good',
  status: 'Available'
};

describe('ItemCard', () => {
  it('renders item details', () => {
    render(<ItemCard item={mockItem} />);
    expect(screen.getByText('Test Item')).toBeInTheDocument();
    expect(screen.getByText('$50.00')).toBeInTheDocument();
  });
  
  it('calls onOpen when clicked', () => {
    const onOpen = jest.fn();
    render(<ItemCard item={mockItem} onOpen={onOpen} />);
    
    fireEvent.click(screen.getByRole('button'));
    expect(onOpen).toHaveBeenCalledWith(mockItem);
  });
});
```

**Accessibility Test Example:**

```typescript
// tests/a11y/item-card.a11y.test.tsx
import { render } from '@testing-library/react';
import { axe } from 'jest-axe';
import { ItemCard } from '../../src/components/ItemCard';

it('has no accessibility violations', async () => {
  const { container } = render(<ItemCard item={mockItem} />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

### Test Coverage

Aim for:
- **Statements:** 80%+
- **Branches:** 75%+
- **Functions:** 80%+
- **Lines:** 80%+

View coverage report:
```bash
npm test -- --coverage --run
open coverage/index.html
```

## TypeScript Development

### Type Definitions

All types in `src/types.ts`:

```typescript
export interface Item {
  id: string;
  name: string;
  price: number;
  // ... more fields
}
```

### Type Checking

```bash
# Check types without building
npx tsc --noEmit

# Watch mode
npx tsc --noEmit --watch
```

### Common Type Patterns

**Component Props:**
```typescript
interface ComponentProps {
  item: Item;
  onAction?: (item: Item) => void;
  className?: string;
}
```

**State Types:**
```typescript
const [items, setItems] = useState<Item[]>([]);
const [selected, setSelected] = useState<Item | null>(null);
```

**Event Handlers:**
```typescript
const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
  // Handle click
};

const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  // Handle change
};
```

## Debugging

### Browser DevTools

**React DevTools:**
1. Install extension: [React DevTools](https://react.dev/learn/react-developer-tools)
2. Open DevTools → Components tab
3. Inspect component tree, props, state

**Console Logging:**
```typescript
console.log('Current filters:', { statusFilter, conditionFilter });
console.table(filteredItems); // Nice table view
```

**Breakpoints:**
1. Open Sources tab
2. Find source file
3. Click line number to set breakpoint
4. Trigger action to pause execution

### VS Code Debugging

Create `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "chrome",
      "request": "launch",
      "name": "Launch Chrome",
      "url": "http://localhost:5173",
      "webRoot": "${workspaceFolder}/src"
    }
  ]
}
```

**Usage:**
1. Start dev server: `npm run dev`
2. Press F5 in VS Code
3. Set breakpoints in TypeScript files
4. Debug directly in VS Code

### Common Issues

**"Cannot find module" error:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

**TypeScript errors after pull:**
```bash
# Rebuild TypeScript definitions
npm run build
```

**Stale cache:**
```bash
# Clear Vite cache
rm -rf node_modules/.vite
```

## Performance Optimization

### Bundle Analysis

```bash
# Build with stats
npm run build -- --stats

# Analyze bundle
npx vite-bundle-visualizer
```

### Code Splitting

```typescript
// Lazy load components (future enhancement)
const ItemDetail = React.lazy(() => import('./components/ItemDetail'));

// Usage with Suspense
<Suspense fallback={<div>Loading...</div>}>
  <ItemDetail item={item} />
</Suspense>
```

### Image Optimization

**Use Sharp variants:**
```typescript
// Prefer optimized variants
const src = item.primarySizes?.med || item.imageUrl;
```

**Lazy loading:**
```typescript
<img loading="lazy" src={src} alt={alt} />
```

### Memoization

**useMemo for expensive computations:**
```typescript
const filteredItems = useMemo(() => {
  return items.filter(/* expensive filter */);
}, [items, filterDeps]);
```

**useCallback for stable callbacks:**
```typescript
const handleClick = useCallback((id: string) => {
  // Handle click
}, []);
```

**React.memo for components:**
```typescript
export const ItemCard = React.memo(({ item }) => {
  return <div>{item.name}</div>;
});
```

## Git Workflow

### Branching Strategy

```bash
# Create feature branch
git checkout -b feature/add-search

# Make changes and commit
git add .
git commit -m "feat: add search functionality"

# Push to remote
git push origin feature/add-search

# Create pull request on GitHub
```

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```bash
# Feature
git commit -m "feat: add image zoom functionality"

# Bug fix
git commit -m "fix: resolve filter reset issue"

# Documentation
git commit -m "docs: update setup instructions"

# Refactor
git commit -m "refactor: simplify filter logic"

# Test
git commit -m "test: add ItemCard tests"

# Chore
git commit -m "chore: update dependencies"
```

### Pre-Commit Checks

Consider adding pre-commit hooks:

**Install husky:**
```bash
npm install -D husky
npx husky install
```

**Add pre-commit hook:**
```bash
npx husky add .husky/pre-commit "npm test -- --run && npm run build"
```

## Code Quality

### Linting

**TypeScript strict mode** (tsconfig.json):
```json
{
  "compilerOptions": {
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

### Code Review Checklist

Before submitting PR:

- [ ] All tests passing
- [ ] No TypeScript errors
- [ ] No console errors in browser
- [ ] Tested in multiple browsers
- [ ] Tested mobile responsive
- [ ] Accessible (keyboard navigation works)
- [ ] Images optimized
- [ ] Code documented (if complex)
- [ ] Git history clean
- [ ] PR description clear

## Documentation

### Inline Documentation

```typescript
/**
 * Filters items based on status, condition, and category.
 * 
 * @param items - Array of items to filter
 * @param filters - Filter criteria
 * @returns Filtered array of items
 */
function filterItems(items: Item[], filters: FilterState): Item[] {
  // Implementation
}
```

### Component Documentation

```typescript
/**
 * ItemCard displays a single garage sale item.
 * 
 * Features:
 * - Thumbnail image with fallback
 * - Sold overlay for sold items
 * - Formatted price display
 * - Click to open detail modal
 * 
 * @example
 * <ItemCard item={item} onOpen={handleOpen} />
 */
export function ItemCard({ item, onOpen }: ItemCardProps) {
  // Implementation
}
```

### Updating Wiki

When making significant changes:

1. Update relevant wiki page in `wiki/`
2. Update architecture diagrams if needed
3. Add new pages for new features
4. Keep examples up to date

## Useful Commands Reference

```bash
# Development
npm run dev              # Start dev server
npm run build            # Production build
npm run preview          # Preview production build

# Testing
npm test                 # Run tests (watch mode)
npm test -- --run        # Run tests once
npm test -- --coverage   # With coverage

# Data Management
node scripts/seed-from-csv.mjs            # Regenerate items
node scripts/seed-from-csv.mjs --with-sharp  # With image optimization

# Deployment
npm run deploy           # Build and deploy to Firebase

# Utilities
npx tsc --noEmit         # Type check only
npx vite --host          # Expose on network
```

## Getting Help

### Resources

- **Project Wiki**: See other pages in `wiki/`
- **React Docs**: https://react.dev/
- **TypeScript Docs**: https://www.typescriptlang.org/docs/
- **Vite Docs**: https://vitejs.dev/guide/
- **Embla Carousel**: https://www.embla-carousel.com/

### Common Questions

**Q: How do I add a new filter option?**
A: Update `FilterSort.tsx` and add filter logic in `App.tsx` useMemo.

**Q: How do I change the grid layout?**
A: Modify `.item-grid` CSS in `styles.css`.

**Q: How do I add a new field to items?**
A: Update `Item` interface in `types.ts`, add column to CSV, update seeder script.

**Q: How do I optimize images?**
A: Install Sharp and run `node scripts/seed-from-csv.mjs --with-sharp`.

---

**Last Updated**: November 2025
