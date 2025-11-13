export interface ImageDescriptor {
  src: string;      // URL to the source image (may be med.webp when available)
  thumb?: string;   // URL to a small thumbnail variant (jpg)
  med?: string;     // URL to a medium webp variant for detail view
  alt?: string;     // accessible alt text produced by the seeder when available
}

export interface SizeVariants {
  src: string;
  thumb?: string;
  med?: string;
  alt?: string;
}

export interface Dimensions {
  width?: number;
  height?: number;
  depth?: number;
  unit?: string;
}

export interface Item {
  id: string;
  name: string;
  imageUrl: string;
  // Optional additional images. Each image is an ImageDescriptor produced by the seeder
  images?: ImageDescriptor[];
  // Primary image descriptor for easier runtime selection of variants
  primaryImage?: ImageDescriptor;
  // imagesMeta is an explicit array of descriptors produced by the seeder
  imagesMeta?: ImageDescriptor[];
  // primarySizes is a convenience alias for the first image's variants
  primarySizes?: SizeVariants;
  // If true the item will be hidden from normal listings and searches.
  hidden?: boolean;
  // Raw string as provided in the CSV
  dimensionsRaw?: string;
  // Parsed numeric dimensions (width, height, depth) and unit when parsable.
  dimensions?: Dimensions | string;
  // Optional category/type for the item (e.g. 'furniture', 'kitchen', 'tools', 'office').
  category?: string;
  price: number;
  condition?: "New" | "Like New" | "Good" | "Fair" | "Poor";
  timeOfUse?: string;
  deliveryTime?: string;
  status?: "Available" | "Sold" | string;
  description?: string;
}
