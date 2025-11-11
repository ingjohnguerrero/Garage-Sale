export interface Item {
  id: string;
  name: string;
  imageUrl: string;
  // Optional additional images (URLs relative to `public/`), first image also set in `imageUrl`.
  images?: string[];
  // If true the item will be hidden from normal listings and searches.
  hidden?: boolean;
  price: number;
  condition: "New" | "Like New" | "Good" | "Fair" | "Poor";
  timeOfUse: string;
  deliveryTime: string;
  status: "Available" | "Sold";
  description?: string;
}
