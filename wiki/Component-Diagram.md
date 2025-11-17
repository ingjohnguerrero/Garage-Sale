# Component Diagram

This document provides a comprehensive overview of the React component architecture, including hierarchy, relationships, props flow, and responsibilities.

## Component Hierarchy

```mermaid
graph TD
    A[main.tsx<br/>Entry Point] --> B[App.tsx<br/>Root Component]
    
    B --> C[Header]
    B --> D[FilterSort]
    B --> E[ItemGrid]
    B --> F[InactiveNotice]
    B --> G[Footer]
    
    E --> H[ItemCard<br/>repeated]
    E --> I[ItemDetail<br/>modal]
    
    I --> J[ImageCarousel]
    
    D --> K[Category Checkboxes]
    D --> L[Status Select]
    D --> M[Condition Select]
    D --> N[Sort Select]
    
    style A fill:#646cff
    style B fill:#61dafb
    style I fill:#4caf50
    style J fill:#ffa500
```

## Component Tree with Props

```mermaid
graph TD
    A[App] -->|items, filters, handlers| B[FilterSort]
    A -->|filteredItems| C[ItemGrid]
    A -->|saleWindow| D[InactiveNotice]
    
    C -->|item, onOpen| E[ItemCard]
    C -->|item, onClose| F[ItemDetail]
    
    F -->|images, altBase| G[ImageCarousel]
    
    B -->|statusFilter| B1[Status]
    B -->|conditionFilter| B2[Condition]
    B -->|sortOption| B3[Sort]
    B -->|categoryFilter| B4[Categories]
    
    style A fill:#61dafb
    style F fill:#4caf50
    style G fill:#ffa500
```

## Detailed Component Specifications

### 1. App.tsx (Root Component)

**Responsibility**: Application orchestration, state management, routing logic

**State:**
```typescript
{
  statusFilter: string;        // "All" | "Available" | "Sold"
  conditionFilter: string;     // "All" | "New" | "Like New" | etc.
  sortOption: string;          // "price-low" | "price-high" | etc.
  categoryFilter: string[];    // ["All"] | ["furniture", "lighting"]
}
```

**Key Features:**
- Manages global filter/sort state
- Computes filtered and sorted items (useMemo)
- Syncs state with URL query parameters
- Determines sale window active/inactive state
- Handles category aggregation and counts

**Props Flow:**

```mermaid
graph LR
    A[URL Params] --> B[App State]
    C[User Input] --> B
    B --> D[FilterSort Props]
    B --> E[ItemGrid Props]
    B --> F[URL Update]
    
    style B fill:#61dafb
```

**Code Structure:**
```typescript
function App() {
  // State initialization from URL
  const [statusFilter, setStatusFilter] = useState(initial.status);
  const [conditionFilter, setConditionFilter] = useState(initial.condition);
  const [sortOption, setSortOption] = useState(initial.sort);
  const [categoryFilter, setCategoryFilter] = useState(initial.categories);
  
  // Derived data
  const categories = useMemo(() => extractCategories(ITEMS), []);
  const categoryCounts = useMemo(() => countByCategory(ITEMS), []);
  
  // Filtered and sorted items
  const filteredAndSortedItems = useMemo(() => {
    return filterAndSort(ITEMS, filters);
  }, [statusFilter, conditionFilter, sortOption, categoryFilter]);
  
  // Sync state to URL
  useEffect(() => {
    updateURL(filters);
  }, [statusFilter, conditionFilter, sortOption, categoryFilter]);
  
  // Sale window check
  const isSaleActive = checkSaleWindow();
  
  return isSaleActive ? <MainApp /> : <InactiveNotice />;
}
```

### 2. FilterSort.tsx

**Responsibility**: Render and manage filter/sort controls

**Props:**
```typescript
interface FilterSortProps {
  statusFilter: string;
  conditionFilter: string;
  sortOption: string;
  categoryFilter: string[];
  categories: string[];
  categoryCounts?: Record<string, number>;
  onStatusChange: (status: string) => void;
  onConditionChange: (condition: string) => void;
  onSortChange: (sort: string) => void;
  onCategoryChange: (categories: string[]) => void;
}
```

**Component Structure:**

```mermaid
graph TD
    A[FilterSort] --> B[Category Fieldset]
    A --> C[Status Select]
    A --> D[Condition Select]
    A --> E[Sort Select]
    
    B --> B1[All Checkbox]
    B --> B2[furniture Checkbox]
    B --> B3[lighting Checkbox]
    B --> B4[kitchen Checkbox]
    B --> B5[... more categories]
    
    style A fill:#2196f3
```

**Features:**
- Multi-select category filter with counts
- Single-select dropdowns for status/condition
- Sort options dropdown
- Accessible with ARIA labels
- Real-time filter application

**Interaction Logic:**
```typescript
// Category multi-select logic
onChange={(e) => {
  const next = new Set(categoryFilter);
  if (e.target.checked) {
    next.delete('All');  // Remove "All" when selecting specific
    next.add(category);
  } else {
    next.delete(category);
  }
  if (next.size === 0) next.add('All');  // Default to "All" if empty
  onCategoryChange(Array.from(next));
}}
```

### 3. ItemGrid.tsx

**Responsibility**: Display grid of item cards and manage detail modal

**Props:**
```typescript
interface ItemGridProps {
  items: Item[];  // Filtered and sorted items
}
```

**State:**
```typescript
{
  selected: Item | null;  // Currently selected item for detail view
}
```

**Layout:**

```mermaid
graph TD
    A[ItemGrid Container] --> B[CSS Grid Layout]
    B --> C[ItemCard 1]
    B --> D[ItemCard 2]
    B --> E[ItemCard 3]
    B --> F[ItemCard ...]
    
    A --> G[ItemDetail Modal]
    G -.->|overlays| B
    
    style A fill:#2196f3
    style G fill:#4caf50
```

**Responsive Grid:**
```css
.item-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}
```

**Empty State:**
```typescript
if (visibleItems.length === 0) {
  return (
    <div className="no-items">
      <p>No items match your current filters.</p>
    </div>
  );
}
```

### 4. ItemCard.tsx

**Responsibility**: Display individual item in grid

**Props:**
```typescript
interface ItemCardProps {
  item: Item;
  onOpen?: (item: Item) => void;
}
```

**Component Structure:**

```mermaid
graph TD
    A[ItemCard Button] --> B[Image Container]
    A --> C[Details Container]
    
    B --> B1[Thumbnail Image]
    B --> B2[SOLD Overlay]
    
    C --> C1[Name]
    C --> C2[Category]
    C --> C3[Price]
    C --> C4[Condition]
    C --> C5[Dimensions]
    C --> C6[Time of Use]
    C --> C7[Delivery]
    C --> C8[Status]
    C --> C9[Description]
    
    style A fill:#2196f3
    style B2 fill:#f44336
```

**Visual States:**
- **Available**: Normal appearance, price visible
- **Sold**: Greyed out, "SOLD" overlay, price hidden
- **Hover**: Subtle scale/shadow effect (CSS)
- **Focus**: Clear focus indicator (accessibility)

**Image Strategy:**
```typescript
// Prefer thumbnail for fast loading in grid
<img 
  src={item.primarySizes?.thumb || item.primarySizes?.med || item.imageUrl}
  alt={item.name}
  className="item-image"
/>
```

**Click Behavior:**
```typescript
onClick={() => onOpen && onOpen(item)}
// Triggers modal open in ItemGrid parent
```

### 5. ItemDetail.tsx

**Responsibility**: Display item details in modal overlay

**Props:**
```typescript
interface ItemDetailProps {
  item: Item;
  onClose: () => void;
}
```

**Component Structure:**

```mermaid
graph TD
    A[Modal Overlay] --> B[Modal Card]
    B --> C[Close Button]
    B --> D[ImageCarousel]
    B --> E[Item Details]
    
    E --> E1[Title]
    E --> E2[Price]
    E --> E3[Category]
    E --> E4[Dimensions]
    E --> E5[Info Section]
    E --> E6[Description]
    
    style A fill:#00000080
    style B fill:#ffffff
    style D fill:#ffa500
```

**Modal Behavior:**

```mermaid
sequenceDiagram
    participant User
    participant ItemCard
    participant ItemDetail
    participant History
    
    User->>ItemCard: Click
    ItemCard->>ItemDetail: Open
    ItemDetail->>History: pushState(#item-123)
    ItemDetail->>ItemDetail: Show modal
    
    User->>User: Press Back
    History->>ItemDetail: popstate event
    ItemDetail->>ItemDetail: Close modal
    History->>History: Go back
```

**Features:**
- Modal overlay with backdrop click to close
- Browser back button closes modal
- Escape key closes modal
- Prevents body scroll when open
- Accessible with ARIA attributes
- History API integration

**Lifecycle:**
```typescript
useEffect(() => {
  // Push history state
  window.history.pushState({modal: true, id: item.id}, "", `#item-${item.id}`);
  
  // Prevent body scroll
  document.body.style.overflow = "hidden";
  
  // Listen for back button
  window.addEventListener("popstate", onClose);
  window.addEventListener("keydown", onEscapeKey);
  
  return () => {
    // Cleanup
    window.removeEventListener("popstate", onClose);
    window.removeEventListener("keydown", onEscapeKey);
    document.body.style.overflow = "";
  };
}, [item.id, onClose]);
```

### 6. ImageCarousel.tsx

**Responsibility**: Display swipeable image carousel

**Props:**
```typescript
interface ImageCarouselProps {
  images: (string | ImageDescriptor)[];
  altBase: string;  // Base text for alt attributes
}
```

**Component Structure:**

```mermaid
graph TD
    A[Carousel Container] --> B[Embla Viewport]
    B --> C[Embla Container]
    
    C --> D[Slide 1]
    C --> E[Slide 2]
    C --> F[Slide 3]
    
    A --> G[Thumbnails]
    G --> H[Thumb 1]
    G --> I[Thumb 2]
    G --> J[Thumb 3]
    
    A --> K[Prev Button]
    A --> L[Next Button]
    
    style A fill:#ffa500
    style B fill:#ffeb3b
```

**Features:**
- Touch/swipe gestures on mobile
- Click/tap navigation with buttons
- Keyboard arrow key navigation
- Thumbnail preview strip
- Smooth animations
- Lazy loading images
- Accessible controls

**Embla Carousel Integration:**
```typescript
const [emblaRef, emblaApi] = useEmblaCarousel({
  loop: false,
  align: 'start'
});

// Navigation handlers
const scrollPrev = () => emblaApi?.scrollPrev();
const scrollNext = () => emblaApi?.scrollNext();
const scrollTo = (index: number) => emblaApi?.scrollTo(index);
```

### 7. InactiveNotice.tsx

**Responsibility**: Display notice when sale is not active

**Props:** None (reads constants directly)

**Component Structure:**

```mermaid
graph TD
    A[InactiveNotice] --> B[Message Container]
    B --> C[Heading]
    B --> D[Sale Period Info]
    B --> E[Contact Info]
    
    style A fill:#ff9800
```

**Features:**
- Shows formatted start/end dates
- Localized date formatting
- Clear messaging about when sale will be active
- Responsive design

**Date Formatting:**
```typescript
const dateFormatter = new Intl.DateTimeFormat(locale, {
  dateStyle: 'full',
  timeZone: 'UTC'
});

const startFormatted = dateFormatter.format(SALE_START);
const endFormatted = dateFormatter.format(SALE_END);
```

## Data Flow

### Props Flow Diagram

```mermaid
graph TD
    A[URL Query Params] -->|parse| B[App State]
    C[ITEMS constant] -->|import| B
    
    B -->|filters, handlers| D[FilterSort]
    B -->|filtered items| E[ItemGrid]
    
    D -->|user interaction| B
    
    E -->|item, onOpen| F[ItemCard]
    E -->|selected item, onClose| G[ItemDetail]
    
    G -->|images, altBase| H[ImageCarousel]
    
    B -->|state change| I[URL Update]
    
    style B fill:#61dafb
    style D fill:#2196f3
    style G fill:#4caf50
```

### Event Flow

```mermaid
sequenceDiagram
    participant User
    participant FilterSort
    participant App
    participant ItemGrid
    participant ItemCard
    participant ItemDetail
    
    User->>FilterSort: Change filter
    FilterSort->>App: onFilterChange()
    App->>App: Update state
    App->>App: useMemo recalculate
    App->>ItemGrid: Pass filtered items
    ItemGrid->>ItemCard: Render updated cards
    
    User->>ItemCard: Click
    ItemCard->>ItemGrid: onOpen(item)
    ItemGrid->>ItemGrid: setState(selected)
    ItemGrid->>ItemDetail: Render with item
    ItemDetail->>ItemDetail: Show modal
```

## Component Communication

### Parent-Child Communication

**Downward (Props):**
```typescript
// Parent passes data and callbacks down
<ItemCard item={item} onOpen={handleOpen} />
```

**Upward (Callbacks):**
```typescript
// Child calls parent callback
<button onClick={() => onOpen(item)}>Open</button>
```

### Sibling Communication

Siblings communicate through shared parent state:

```mermaid
graph TD
    A[App State] --> B[FilterSort]
    A --> C[ItemGrid]
    
    B -.->|via App| C
    C -.->|via App| B
    
    style A fill:#61dafb
```

### URL-Based Communication

State persisted to URL for shareability:

```typescript
// Write: App → URL
useEffect(() => {
  const params = new URLSearchParams();
  if (status !== 'All') params.set('status', status);
  window.history.replaceState({}, '', `?${params}`);
}, [status, condition, sort, categories]);

// Read: URL → App
const getInitialFromQuery = () => {
  const params = new URLSearchParams(window.location.search);
  return {
    status: params.get('status') || 'All',
    condition: params.get('condition') || 'All',
    // ...
  };
};
```

## Component Responsibilities Matrix

| Component | UI Rendering | State Management | Business Logic | Side Effects |
|-----------|--------------|------------------|----------------|--------------|
| **App** | ✅ Layout | ✅ Global filters | ✅ Filter/sort logic | ✅ URL sync |
| **FilterSort** | ✅ Controls | ❌ None | ❌ None | ❌ None |
| **ItemGrid** | ✅ Grid layout | ✅ Selected item | ❌ None | ❌ None |
| **ItemCard** | ✅ Card display | ❌ None | ✅ Format data | ❌ None |
| **ItemDetail** | ✅ Modal | ❌ None | ✅ Format data | ✅ History, scroll lock |
| **ImageCarousel** | ✅ Carousel | ✅ Current slide | ❌ None | ✅ Embla init |
| **InactiveNotice** | ✅ Notice | ❌ None | ✅ Date format | ❌ None |

## Performance Optimizations

### Memoization

```typescript
// Expensive computations memoized
const filteredAndSortedItems = useMemo(() => {
  return filterAndSort(ITEMS, filters);
}, [statusFilter, conditionFilter, sortOption, categoryFilter]);

const categories = useMemo(() => {
  return extractCategories(ITEMS);
}, []); // Static data, empty deps
```

### Component Memoization

```typescript
// Future optimization: memo for ItemCard
export const ItemCard = React.memo(({ item, onOpen }: ItemCardProps) => {
  // Component implementation
}, (prevProps, nextProps) => {
  // Custom comparison
  return prevProps.item.id === nextProps.item.id;
});
```

### Image Loading Strategy

```typescript
// List view: thumbnails for fast load
<img src={item.primarySizes?.thumb || item.imageUrl} />

// Detail view: medium quality
<img src={item.primarySizes?.med || item.imageUrl} />

// Future: lazy loading with Intersection Observer
```

## Accessibility Features

### Semantic HTML

- `<header>`, `<main>`, `<footer>` landmarks
- `<button>` for all interactive elements
- `<fieldset>` and `<legend>` for grouped controls
- `<label>` for all form inputs

### ARIA Attributes

```typescript
// Modal
<div role="dialog" aria-modal="true" aria-labelledby="item-title-123">

// Buttons
<button aria-label="Open details for Vintage Table">

// Select controls
<select aria-label="Filter by status">
```

### Keyboard Navigation

- Tab order is logical
- All interactive elements focusable
- Escape key closes modal
- Arrow keys in carousel
- Enter activates buttons

See [Sequence Diagrams](./Sequence-Diagrams.md) for detailed interaction flows.

## Testing Strategy

### Component Tests

```typescript
// ItemCard.test.tsx
describe('ItemCard', () => {
  it('renders item details', () => {
    render(<ItemCard item={mockItem} />);
    expect(screen.getByText('Vintage Table')).toBeInTheDocument();
  });
  
  it('calls onOpen when clicked', () => {
    const onOpen = jest.fn();
    render(<ItemCard item={mockItem} onOpen={onOpen} />);
    fireEvent.click(screen.getByRole('button'));
    expect(onOpen).toHaveBeenCalledWith(mockItem);
  });
});
```

### Accessibility Tests

```typescript
// ItemDetail.a11y.test.tsx
it('has no accessibility violations', async () => {
  const { container } = render(<ItemDetail item={mockItem} onClose={jest.fn()} />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

## Future Enhancements

Potential component improvements:

1. **Search Component** - Client-side fuzzy search
2. **Pagination Component** - For large item counts
3. **Lightbox Component** - Full-screen image zoom
4. **ShareButton Component** - Social media sharing
5. **Breadcrumbs Component** - Navigation context
6. **Toast Component** - User feedback notifications

---

**Last Updated**: November 2025
