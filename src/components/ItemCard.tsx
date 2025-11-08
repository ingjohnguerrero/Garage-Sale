import { Item } from "../types";

interface ItemCardProps {
  item: Item;
}

export function ItemCard({ item }: ItemCardProps) {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  return (
    <div className={`item-card ${item.status === "Sold" ? "sold" : ""}`}>
      <div className="item-image-container">
        <img src={item.imageUrl} alt={item.name} className="item-image" />
        {item.status === "Sold" && (
          <div className="sold-overlay">SOLD</div>
        )}
      </div>
      <div className="item-details">
        <h3 className="item-name">{item.name}</h3>
        <p className="item-price">{formatter.format(item.price)}</p>
        <div className="item-info">
          <p><strong>Condition:</strong> {item.condition}</p>
          <p><strong>Time of Use:</strong> {item.timeOfUse}</p>
          <p><strong>Delivery:</strong> {item.deliveryTime}</p>
          <p className="item-status">
            <strong>Status:</strong> 
            <span className={item.status === "Sold" ? "status-sold" : "status-available"}>
              {item.status}
            </span>
          </p>
        </div>
        {item.description && (
          <p className="item-description">{item.description}</p>
        )}
      </div>
    </div>
  );
}
