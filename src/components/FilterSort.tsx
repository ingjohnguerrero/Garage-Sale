import { useTranslation } from "../i18n";

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
  const { t } = useTranslation();

  return (
    <div className="filter-sort-container">
      <div className="filter-group">
        <fieldset aria-labelledby="category-filter-legend">
          <legend id="category-filter-legend">{t('filters.category.label')}</legend>
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
          {t('filters.status.label')}:
          <select
            id="status-filter"
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
            aria-label={t('filters.status.label')}
          >
            <option value="All">{t('filters.status.all')}</option>
            <option value="Available">{t('filters.status.available')}</option>
            <option value="Sold">{t('filters.status.sold')}</option>
          </select>
        </label>
      </div>

      <div className="filter-group">
        <label htmlFor="condition-filter">
          {t('filters.condition.label')}:
          <select
            id="condition-filter"
            value={conditionFilter}
            onChange={(e) => onConditionChange(e.target.value)}
            aria-label={t('filters.condition.label')}
          >
            <option value="All">{t('filters.condition.all')}</option>
            <option value="New">{t('filters.condition.new')}</option>
            <option value="Like New">{t('filters.condition.likeNew')}</option>
            <option value="Good">{t('filters.condition.good')}</option>
            <option value="Fair">{t('filters.condition.fair')}</option>
            <option value="Poor">{t('filters.condition.poor')}</option>
          </select>
        </label>
      </div>

      <div className="filter-group">
        <label htmlFor="sort-option">
          {t('filters.sort.label')}:
          <select
            id="sort-option"
            value={sortOption}
            onChange={(e) => onSortChange(e.target.value)}
            aria-label={t('filters.sort.label')}
          >
            <option value="price-low">{t('filters.sort.priceLowHigh')}</option>
            <option value="price-high">{t('filters.sort.priceHighLow')}</option>
            <option value="name-asc">{t('filters.sort.nameAZ')}</option>
            <option value="name-desc">{t('filters.sort.nameZA')}</option>
          </select>
        </label>
      </div>
    </div>
  );
}
