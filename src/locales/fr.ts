// French (France) translations
export const fr = {
  common: {
    close: 'Fermer',
    loading: 'Chargement...',
    error: 'Une erreur s\'est produite',
    noItems: 'Aucun article ne correspond à vos filtres.',
    all: 'Tous'
  },
  filters: {
    category: {
      label: 'Catégorie'
    },
    status: {
      label: 'Statut',
      all: 'Tous',
      available: 'Disponible',
      sold: 'Vendu'
    },
    condition: {
      label: 'Condition',
      all: 'Tous',
      new: 'Neuf',
      likeNew: 'Comme Neuf',
      good: 'Bon',
      fair: 'Acceptable',
      poor: 'Pauvre'
    },
    sort: {
      label: 'Trier par',
      priceLowHigh: 'Prix : Bas à Élevé',
      priceHighLow: 'Prix : Élevé à Bas',
      nameAZ: 'Nom : A-Z',
      nameZA: 'Nom : Z-A'
    }
  },
  item: {
    price: 'Prix',
    condition: 'Condition',
    timeOfUse: 'Temps d\'Utilisation',
    deliveryTime: 'Délai de Livraison',
    description: 'Description',
    close: 'Fermer',
    sold: 'VENDU',
    dimensions: 'Dimensions'
  },
  inactive: {
    title: 'Vente de Garage Actuellement Inactive',
    message: 'Merci de votre visite ! Notre vente de garage n\'est pas active actuellement.',
    saleStarts: 'Début de la Vente',
    saleEnds: 'Fin de la Vente',
    checkBack: 'Veuillez revenir pendant la période de vente pour voir les articles disponibles !'
  }
  ,
  site: {
    title: 'Vente de Garage',
    subtitle: 'Parcourez notre collection d\'articles d\'occasion de qualité'
  }
} as const;
