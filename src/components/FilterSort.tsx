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

export function FilterSort({
  statusFilter,
  conditionFilter,
  sortOption,
  categoryFilter,
  categories,
  categoryCounts = {},
  onStatusChange,
  onConditionChange,
  onSortChange,
  onCategoryChange,
}: FilterSortProps) {
  return (
    <div className="filter-sort-container">
      <div className="filter-group">
        <fieldset aria-labelledby="category-filter-legend">
          <legend id="category-filter-legend">Category</legend>
          <div className="category-checkboxes">
            {categories.map((c) => {
              const count = categoryCounts[c] ?? 0;
              const checked = categoryFilter.includes(c);
              return (
                <label key={c} className="category-option">
                  <input
                    type="checkbox"
                    value={c}
                    checked={checked}
                    onChange={(e) => {
                      const next = new Set(categoryFilter);
                      if (e.target.checked) {
                        // If All was selected, clear it
                        next.delete('All');
                        next.add(c);
                      } else {
                        next.delete(c);
                      }
                      // If nothing selected, ensure 'All' is selected
                      if (next.size === 0) next.add('All');
                      onCategoryChange(Array.from(next));
                    }}
                  />
                  <span className="category-label">{c}</span>
                  <span className="category-count">({count})</span>
                </label>
              );
            })}
          </div>
        </fieldset>
      </div>
      <div className="filter-group">
        <label htmlFor="status-filter">
          Status:
          <select
            id="status-filter"
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
            aria-label="Filter by status"
          >
            <option value="All">All</option>
            <option value="Available">Available</option>
            <option value="Sold">Sold</option>
          </select>
        </label>
      </div>

      <div className="filter-group">
        <label htmlFor="condition-filter">
          Condition:
          <select
            id="condition-filter"
            value={conditionFilter}
            onChange={(e) => onConditionChange(e.target.value)}
            aria-label="Filter by condition"
          >
            <option value="All">All</option>
            <option value="New">New</option>
            <option value="Like New">Like New</option>
            <option value="Good">Good</option>
            <option value="Fair">Fair</option>
            <option value="Poor">Poor</option>
          </select>
        </label>
      </div>

      <div className="filter-group">
        <label htmlFor="sort-option">
          Sort by:
          <select
            id="sort-option"
            value={sortOption}
            onChange={(e) => onSortChange(e.target.value)}
            aria-label="Sort items"
          >
            <option value="price-low">Price: Low → High</option>
            <option value="price-high">Price: High → Low</option>
            <option value="name-asc">Name: A → Z</option>
            <option value="name-desc">Name: Z → A</option>
          </select>
        </label>
      </div>
    </div>
  );
}
