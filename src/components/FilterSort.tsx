interface FilterSortProps {
  statusFilter: string;
  conditionFilter: string;
  sortOption: string;
  onStatusChange: (status: string) => void;
  onConditionChange: (condition: string) => void;
  onSortChange: (sort: string) => void;
}

export function FilterSort({
  statusFilter,
  conditionFilter,
  sortOption,
  onStatusChange,
  onConditionChange,
  onSortChange,
}: FilterSortProps) {
  return (
    <div className="filter-sort-container">
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
