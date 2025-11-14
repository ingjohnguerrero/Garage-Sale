# Data Model: Item Details View

Date: 2025-11-11

This document captures the data entities and validation rules for the
Item Details View feature.

## Entities

### Item

- id: string (primary)
- name: string (required)
- price: number | null (nullable when not listed)
- condition: enum ["New","Like New","Good","Fair","Poor"]
- status: enum ["Available","Sold"]
- timeOfUse: string (human-friendly duration)
- deliveryTime: string (pickup/delivery instructions)
- description: string (optional, free text)
- images: string[] (ordered list of image URLs, may include optimized variants)
- hidden: boolean (exclude from public listings)

Validation rules:
- `id` MUST be unique per item.
- `name` MUST be non-empty when present.
- `price` MAY be null; UI must handle missing price gracefully.
- At least zero images allowed; UI should show a placeholder for zero images.

### Image (logical)

- url: string (public-relative URL)
- altText: string (optional; default derived from item name)
- variant: enum ["thumb","med","original"]
