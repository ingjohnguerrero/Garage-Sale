// German (Germany) translations
export const de = {
  common: {
    close: 'Schließen',
    loading: 'Wird geladen...',
    error: 'Ein Fehler ist aufgetreten',
    noItems: 'Keine Artikel entsprechen Ihren Filtern.',
    all: 'Alle'
  },
  filters: {
    category: {
      label: 'Kategorie'
    },
    status: {
      label: 'Status',
      all: 'Alle',
      available: 'Verfügbar',
      sold: 'Verkauft'
    },
    condition: {
      label: 'Zustand',
      all: 'Alle',
      new: 'Neu',
      likeNew: 'Wie Neu',
      good: 'Gut',
      fair: 'Akzeptabel',
      poor: 'Schlecht'
    },
    sort: {
      label: 'Sortieren nach',
      priceLowHigh: 'Preis: Niedrig bis Hoch',
      priceHighLow: 'Preis: Hoch bis Niedrig',
      nameAZ: 'Name: A-Z',
      nameZA: 'Name: Z-A'
    }
  },
  item: {
    price: 'Preis',
    condition: 'Zustand',
    timeOfUse: 'Nutzungsdauer',
    deliveryTime: 'Lieferzeit',
    description: 'Beschreibung',
    close: 'Schließen',
    sold: 'VERKAUFT',
    dimensions: 'Abmessungen'
  },
  inactive: {
    title: 'Flohmarkt Derzeit Inaktiv',
    message: 'Vielen Dank für Ihren Besuch! Unser Flohmarkt ist derzeit nicht aktiv.',
    saleStarts: 'Verkaufsbeginn',
    saleEnds: 'Verkaufsende',
    checkBack: 'Bitte schauen Sie während des Verkaufszeitraums vorbei, um verfügbare Artikel zu sehen!'
  },
  site: {
    title: 'Flohmarkt',
    subtitle: 'Durchsuchen Sie unsere Auswahl an hochwertigen gebrauchten Artikeln'
  }
} as const;
