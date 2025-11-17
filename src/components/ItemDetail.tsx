import { useEffect, useRef } from "react";
import { Item } from "../types";
import { ImageCarousel } from "./ImageCarousel";
import { useTranslation, useFormatters } from "../i18n";

interface ItemDetailProps {
  item: Item;
  onClose: () => void;
}

export function ItemDetail({ item, onClose }: ItemDetailProps) {
  const { t } = useTranslation();
  const { formatPrice, formatDate } = useFormatters();
  const overlayRef = useRef<HTMLDivElement | null>(null);

  // Prefer explicit image metadata produced by the seeder (imagesMeta / primarySizes).
  // Fallback to legacy `images` array or single `imageUrl`.
  const imagesForCarousel =
    (item.imagesMeta && item.imagesMeta.length && item.imagesMeta) ||
    (item.primarySizes ? [item.primarySizes] : (item.images && item.images.length ? item.images : [item.imageUrl]));

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // push history state for modal-first behavior, but avoid double-push if hash already set
    const desiredHash = `#item-${item.id}`;
    if (window.location.hash !== desiredHash) {
      const state = { modal: true, id: item.id };
      window.history.pushState(state, "", window.location.pathname + desiredHash);
    }

    function onPop() {
      onClose();
    }
    window.addEventListener("popstate", onPop);

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        window.history.back();
      }
    }
    window.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("popstate", onPop);
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = originalOverflow;
      // debug: log modal cleanup
      // eslint-disable-next-line no-console
      console.log('ItemDetail cleanup:', item.id);
      // do not call history.back() here — popstate navigation is handled by user actions
    };
  }, [item.id, onClose]);

  function fmtMaybeDate(value?: string) {
    if (!value) return '';
    const d = new Date(value);
    if (!isNaN(d.getTime())) return formatDate(d, { dateStyle: 'medium' });
    // fallback: return the raw string (e.g., "2 years")
    return value;
  }

  function formatDimensions(dim?: string | { width?: number; height?: number; depth?: number; unit?: string }) {
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
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby={`item-title-${item.id}`}
      ref={overlayRef}
      onMouseDown={(e) => {
        // close when clicking on the overlay background only
        if (e.target === overlayRef.current) {
          // eslint-disable-next-line no-console
          console.log('Overlay clicked, closing modal');
          window.history.back();
        }
      }}
    >
      <div className="modal-card" onMouseDown={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={() => window.history.back()} aria-label={t('item.close')}>×</button>
        <div className="modal-media">
          <ImageCarousel images={imagesForCarousel} altBase={item.name} />
        </div>
        <div className="modal-body">
          <h2 id={`item-title-${item.id}`} className="item-name">{item.name}</h2>
          {item.status !== "Sold" && (
            <p className="item-price" aria-label={item.price != null ? `${t('item.price')} ${formatPrice(item.price)}` : t('item.price') + ' not listed'}>
              {item.price != null ? formatPrice(item.price) : `${t('item.price')} not listed`}
            </p>
          )}
          {item.category && (
            <p className="item-category"><strong>{t('filters.category.label')}:</strong> {item.category}</p>
          )}
          {item.dimensions && (
            <p className="item-dimensions"><span className="dim-icon" aria-hidden>📐</span> <strong>{t('item.dimensions')}:</strong> {formatDimensions(item.dimensions)}</p>
          )}
          <div className="item-info">
            <p><strong>{t('item.condition')}:</strong> {item.condition}</p>
            <p><strong>{t('item.timeOfUse')}:</strong> {fmtMaybeDate(item.timeOfUse) || item.timeOfUse}</p>
            <p><strong>{t('item.deliveryTime')}:</strong> {fmtMaybeDate(item.deliveryTime) || item.deliveryTime}</p>
            <p className="item-status"><strong>{t('filters.status.label')}:</strong> <span className={item.status === "Sold" ? "status-sold" : "status-available"}>{item.status}</span></p>
          </div>
          {item.description && <p className="item-description">{item.description}</p>}
        </div>
      </div>
    </div>
  );
}

export default ItemDetail;
