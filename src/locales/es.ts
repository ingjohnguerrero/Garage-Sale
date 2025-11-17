// Spanish (Spain) translations
export const es = {
  common: {
    close: 'Cerrar',
    loading: 'Cargando...',
    error: 'Ocurrió un error',
    noItems: 'No hay artículos que coincidan con sus filtros.',
    all: 'Todos'
  },
  filters: {
    category: {
      label: 'Categoría'
    },
    status: {
      label: 'Estado',
      all: 'Todos',
      available: 'Disponible',
      sold: 'Vendido'
    },
    condition: {
      label: 'Condición',
      all: 'Todos',
      new: 'Nuevo',
      likeNew: 'Como Nuevo',
      good: 'Bueno',
      fair: 'Aceptable',
      poor: 'Pobre'
    },
    sort: {
      label: 'Ordenar por',
      priceLowHigh: 'Precio: Bajo a Alto',
      priceHighLow: 'Precio: Alto a Bajo',
      nameAZ: 'Nombre: A-Z',
      nameZA: 'Nombre: Z-A'
    }
  },
  item: {
    price: 'Precio',
    condition: 'Condición',
    timeOfUse: 'Tiempo de Uso',
    deliveryTime: 'Tiempo de Entrega',
    description: 'Descripción',
    close: 'Cerrar',
    sold: 'VENDIDO',
    dimensions: 'Dimensiones'
  },
  inactive: {
    title: 'Venta de Garaje Actualmente Inactiva',
    message: '¡Gracias por visitarnos! Nuestra venta de garaje no está activa actualmente.',
    saleStarts: 'Inicio de la Venta',
    saleEnds: 'Fin de la Venta',
    checkBack: '¡Por favor, vuelva durante el período de venta para ver los artículos disponibles!'
  }
  ,
  site: {
    title: 'Venta de Garaje',
    subtitle: 'Explore nuestra colección de artículos usados de calidad'
  }
} as const;
