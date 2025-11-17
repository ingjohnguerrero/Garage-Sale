import { Item } from "../types";
import { useTranslation, useFormatters } from "../i18n";

interface ItemCardProps {
  item: Item;
  onOpen?: (item: Item) => void;
}

export function ItemCard({ item, onOpen }: ItemCardProps) {
  const { t } = useTranslation();
  const { formatPrice } = useFormatters();

  function formatDimensions(dim: string | { width?: number; height?: number; depth?: number; unit?: string } | undefined) {
    if (!dim) return null;
    if (typeof dim === 'string') return dim;
    const { width, height, depth, unit } = dim;
    const parts: string[] = [];
    if (width != null) parts.push(String(width));
    if (height != null) parts.push(String(height));
    if (depth != null) parts.push(String(depth));
    if (parts.length === 0) return '';
    return parts.join(' x ') + (unit ? ` ${unit}` : '');
  }

  return (
    <button
      className={`item-card ${item.status === "Sold" ? "sold" : ""}`}
      onClick={() => onOpen && onOpen(item)}
      aria-label={`Open details for ${item.name}`}
    >
      <div className="item-image-container">
        {/* Prefer a small thumb variant when available to reduce list payload */}
        <img
          src={
            item.primarySizes?.thumb || item.primarySizes?.med || item.imageUrl
          }
          alt={item.name}
          className="item-image"
        />
        {item.status === "Sold" && (
          <div className="sold-overlay">{t('item.sold')}</div>
        )}
      </div>
      <div className="item-details">
        <h3 className="item-name">{item.name}</h3>
        {item.category && (
          <p className="item-category" aria-hidden>{item.category}</p>
        )}
        {item.status !== "Sold" && (
          <p className="item-price">{formatPrice(item.price)}</p>
        )}
        <div className="item-info">
          <p><strong>{t('item.condition')}:</strong> {item.condition}</p>
          {item.dimensions && (
            <p className="item-dimensions"><span className="dim-icon" aria-hidden>📐</span> <strong>{t('item.dimensions')}:</strong> {formatDimensions(item.dimensions)}</p>
          )}
          <p><strong>{t('item.timeOfUse')}:</strong> {item.timeOfUse}</p>
          <p><strong>{t('item.deliveryTime')}:</strong> {item.deliveryTime}</p>
          <p className="item-status">
            <strong>{t('filters.status.label')}:</strong> 
            <span className={item.status === "Sold" ? "status-sold" : "status-available"}>
              {item.status}
            </span>
          </p>
        </div>
        {item.description && (
          <p className="item-description">{item.description}</p>
        )}
      </div>
    </button>
  );
}
