# Contracts for Item Details View

This feature is client-only and does not introduce new server-side
endpoints. The item data is provided via compiled `src/data/items.ts` (and
optionally `public/data/items.json` if runtime fetch is desired).

If the project later exposes a backend API for items, the contract should
include an endpoint like `GET /items/:id` returning the item payload:

```json
{
  "id": "string",
  "name": "string",
  "price": 123.45,
  "condition": "Good",
  "status": "Available",
  "timeOfUse": "2 years",
  "deliveryTime": "Pickup only",
  "description": "string",
  "images": ["/images/items/..." ]
}
```

For now, no runtime contracts are required.
