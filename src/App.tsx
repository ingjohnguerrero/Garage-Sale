import { useState, useMemo, useEffect } from "react";
import { SALE_START, SALE_END } from "./constants";
import { ITEMS } from "./data/items";
import { FilterSort } from "./components/FilterSort";
import { ItemGrid } from "./components/ItemGrid";
import { InactiveNotice } from "./components/InactiveNotice";
import { useTranslation } from './i18n';
import "./styles.css";

function App() {
  // Initialize filters from query params when present so links can share state
  const categories = useMemo(() => {
    // Build a list of categories for the filter control and counts
    const cats = ITEMS.map((i) => i.category).filter((c): c is string => Boolean(c));
    const set = new Set<string>(cats);
    return ["All", ...Array.from(set).sort()];
  }, []);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const it of ITEMS) {
      const c = it.category || 'Uncategorized';
      counts[c] = (counts[c] || 0) + 1;
    }
    counts['All'] = ITEMS.length;
    return counts;
  }, []);

  const getInitialFromQuery = () => {
    if (typeof window === 'undefined') return {
      status: 'All', condition: 'All', sort: 'price-low', categories: ['All']
    };
    const params = new URLSearchParams(window.location.search);
    const status = params.get('status') || 'All';
    const condition = params.get('condition') || 'All';
    const sort = params.get('sort') || 'price-low';
    const catsRaw = params.get('categories');
    const cats = catsRaw ? catsRaw.split(',').map(decodeURIComponent).filter(Boolean) : ['All'];
    return { status, condition, sort, categories: cats };
  };

  const initial = getInitialFromQuery();

  const [statusFilter, setStatusFilter] = useState(initial.status);
  const [conditionFilter, setConditionFilter] = useState(initial.condition);
  const [sortOption, setSortOption] = useState(initial.sort);
  const [categoryFilter, setCategoryFilter] = useState(initial.categories);

  const { t } = useTranslation();

  // Check if sale is active
  const now = new Date();
  const isSaleActive = now >= SALE_START && now <= SALE_END;

  // Filter and sort items
  const filteredAndSortedItems = useMemo(() => {
    let result = [...ITEMS];

    // Apply status filter
    if (statusFilter !== "All") {
      result = result.filter((item) => item.status === statusFilter);
    }

    // Apply condition filter
    if (conditionFilter !== "All") {
      result = result.filter((item) => item.condition === conditionFilter);
    }

    // Apply category filter (multi-select). If includes 'All' or is empty, skip filtering.
    if (categoryFilter && !(categoryFilter.length === 0 || categoryFilter.includes('All'))) {
      result = result.filter((item) => item.category && categoryFilter.includes(item.category));
    }

    // Apply sorting
    switch (sortOption) {
      case "price-low":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        result.sort((a, b) => b.price - a.price);
        break;
      case "name-asc":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
    }

    return result;
  }, [statusFilter, conditionFilter, sortOption, categoryFilter]);

  // Persist filter state to query params so links can share current filters
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams();
    if (statusFilter && statusFilter !== 'All') params.set('status', statusFilter);
    if (conditionFilter && conditionFilter !== 'All') params.set('condition', conditionFilter);
    if (sortOption && sortOption !== 'price-low') params.set('sort', sortOption);
    if (categoryFilter && !(categoryFilter.length === 0 || (categoryFilter.length ===1 && categoryFilter[0] === 'All'))) {
      params.set('categories', categoryFilter.map(encodeURIComponent).join(','));
    }
    const qs = params.toString();
    const newUrl = qs ? `?${qs}` : window.location.pathname;
    window.history.replaceState({}, '', newUrl);
  }, [statusFilter, conditionFilter, sortOption, categoryFilter]);

  if (!isSaleActive) {
    return <InactiveNotice />;
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>{t('site.title')}</h1>
        <p>{t('site.subtitle')}</p>
      </header>

      <main className="app-main">
        <FilterSort
          statusFilter={statusFilter}
          conditionFilter={conditionFilter}
          sortOption={sortOption}
          categoryFilter={categoryFilter}
          categories={categories}
          categoryCounts={categoryCounts}
          onStatusChange={setStatusFilter}
          onConditionChange={setConditionFilter}
          onSortChange={setSortOption}
          onCategoryChange={setCategoryFilter}
        />

        <ItemGrid items={filteredAndSortedItems} />
      </main>

      <footer className="app-footer">
        <p>&copy; {new Date().getFullYear()} {t('site.title')}. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
