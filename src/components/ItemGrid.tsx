import { Item } from "../types";
import { ItemCard } from "./ItemCard";

interface ItemGridProps {
  items: Item[];
}

export function ItemGrid({ items }: ItemGridProps) {
  const visibleItems = items.filter((i) => !i.hidden);

  if (visibleItems.length === 0) {
    return (
      <div className="no-items">
        <p>No items match your current filters.</p>
      </div>
    );
  }

  return (
    <div className="item-grid">
      {visibleItems.map((item) => (
        <ItemCard key={item.id} item={item} />
      ))}
    </div>
  );
}
