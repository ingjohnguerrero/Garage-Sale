export interface Item {
  id: string;
  name: string;
  imageUrl: string;
  price: number;
  condition: "New" | "Like New" | "Good" | "Fair" | "Poor";
  timeOfUse: string;
  deliveryTime: string;
  status: "Available" | "Sold";
  description?: string;
}
