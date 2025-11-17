import { useState } from "react";
import { Item } from "../types";
import { ItemCard } from "./ItemCard";
import { ItemDetail } from "./ItemDetail";
import { useTranslation } from "../i18n";

interface ItemGridProps {
  items: Item[];
}

export function ItemGrid({ items }: ItemGridProps) {
  const { t } = useTranslation();
  const visibleItems = items.filter((i) => !i.hidden);
  const [selected, setSelected] = useState<Item | null>(null);

  if (visibleItems.length === 0) {
    return (
      <div className="no-items">
        <p>{t('common.noItems')}</p>
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
            setSelected(null);
          }}
        />
      )}
    </>
  );
}
