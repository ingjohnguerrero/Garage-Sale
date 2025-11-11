import { useState, useMemo } from "react";
import { SALE_START, SALE_END } from "./constants";
import { ITEMS } from "./data/items";
import { FilterSort } from "./components/FilterSort";
import { ItemGrid } from "./components/ItemGrid";
import { InactiveNotice } from "./components/InactiveNotice";
import "./styles.css";

function App() {
  const [statusFilter, setStatusFilter] = useState("All");
  const [conditionFilter, setConditionFilter] = useState("All");
  const [sortOption, setSortOption] = useState("price-low");

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
  }, [statusFilter, conditionFilter, sortOption]);

  if (!isSaleActive) {
    return <InactiveNotice />;
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Garage Sale</h1>
        <p>Browse our collection of quality pre-owned items</p>
      </header>

      <main className="app-main">
        <FilterSort
          statusFilter={statusFilter}
          conditionFilter={conditionFilter}
          sortOption={sortOption}
          onStatusChange={setStatusFilter}
          onConditionChange={setConditionFilter}
          onSortChange={setSortOption}
        />

        <ItemGrid items={filteredAndSortedItems} />
      </main>

      <footer className="app-footer">
        <p>&copy; {new Date().getFullYear()} Garage Sale. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
