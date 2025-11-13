import { useState } from "react";
import { Item } from "../types";
import { ItemCard } from "./ItemCard";
import { ItemDetail } from "./ItemDetail";

interface ItemGridProps {
  items: Item[];
}

export function ItemGrid({ items }: ItemGridProps) {
  const visibleItems = items.filter((i) => !i.hidden);
  const [selected, setSelected] = useState<Item | null>(null);

  if (visibleItems.length === 0) {
    return (
      <div className="no-items">
        <p>No items match your current filters.</p>
      </div>
    );
  }

  return (
    <>
      <div className="item-grid">
        {visibleItems.map((item) => (
          <ItemCard key={item.id} item={item} onOpen={(it) => setSelected(it)} />
        ))}
      </div>
      {selected && (
        <ItemDetail
          item={selected}
          onClose={() => {
            // eslint-disable-next-line no-console
            console.log('ItemDetail closed');
            setSelected(null);
          }}
        />
      )}
    </>
  );
}
