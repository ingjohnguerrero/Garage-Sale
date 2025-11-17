// English (US) translations - source of truth for translation structure
export const en = {
  common: {
    close: 'Close',
    loading: 'Loading...',
    error: 'An error occurred',
    noItems: 'No items match your filters.',
    all: 'All'
  },
  filters: {
    category: {
      label: 'Category'
    },
    status: {
      label: 'Status',
      all: 'All',
      available: 'Available',
      sold: 'Sold'
    },
    condition: {
      label: 'Condition',
      all: 'All',
      new: 'New',
      likeNew: 'Like New',
      good: 'Good',
      fair: 'Fair',
      poor: 'Poor'
    },
    sort: {
      label: 'Sort by',
      priceLowHigh: 'Price: Low to High',
      priceHighLow: 'Price: High to Low',
      nameAZ: 'Name: A-Z',
      nameZA: 'Name: Z-A'
    }
  },
  item: {
    price: 'Price',
    condition: 'Condition',
    timeOfUse: 'Time of Use',
    deliveryTime: 'Delivery Time',
    description: 'Description',
    close: 'Close',
    sold: 'SOLD',
    dimensions: 'Dimensions'
  },
  inactive: {
    title: 'Garage Sale Currently Inactive',
    message: 'Thank you for visiting! Our garage sale is not currently active.',
    saleStarts: 'Sale Start',
    saleEnds: 'Sale End',
    checkBack: 'Please check back during the sale window to view available items!'
  }
  ,
  site: {
    title: 'Garage Sale',
    subtitle: 'Browse our collection of quality pre-owned items'
  }
} as const;

export type TranslationKeys = typeof en;
