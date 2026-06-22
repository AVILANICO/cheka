// High-quality free images from Pexels for automatic product fallback
// These URLs are stable Pexels CDN links

export const DEFAULT_HERO =
  'https://images.pexels.com/photos/2074130/pexels-photo-2074130.jpeg?auto=compress&cs=tinysrgb&w=1200';

export const DEFAULT_LOGO = '/logo-cheka.png';

export const PRODUCT_IMAGES: Record<string, string> = {
  // Cafés
  espresso:
    'https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?auto=compress&cs=tinysrgb&w=600',
  latte:
    'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=600',
  capuccino:
    'https://images.pexels.com/photos/683039/pexels-photo-683039.jpeg?auto=compress&cs=tinysrgb&w=600',
  cappuccino:
    'https://images.pexels.com/photos/683039/pexels-photo-683039.jpeg?auto=compress&cs=tinysrgb&w=600',
  americano:
    'https://images.pexels.com/photos/1496127/pexels-photo-1496127.jpeg?auto=compress&cs=tinysrgb&w=600',
  cortado:
    'https://images.pexels.com/photos/982138/pexels-photo-982138.jpeg?auto=compress&cs=tinysrgb&w=600',
  macchiato:
    'https://images.pexels.com/photos/1749303/pexels-photo-1749303.jpeg?auto=compress&cs=tinysrgb&w=600',
  mocha:
    'https://images.pexels.com/photos/1627933/pexels-photo-1627933.jpeg?auto=compress&cs=tinysrgb&w=600',
  'iced coffee':
    'https://images.pexels.com/photos/1469005/pexels-photo-1469005.jpeg?auto=compress&cs=tinysrgb&w=600',
  'café frío':
    'https://images.pexels.com/photos/1469005/pexels-photo-1469005.jpeg?auto=compress&cs=tinysrgb&w=600',

  // Panificados
  medialuna:
    'https://images.pexels.com/photos/2135/food-france-morning-breakfast.jpg?auto=compress&cs=tinysrgb&w=600',
  criollo:
    'https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg?auto=compress&cs=tinysrgb&w=600',
  croissant:
    'https://images.pexels.com/photos/2135/food-france-morning-breakfast.jpg?auto=compress&cs=tinysrgb&w=600',
  'pan de campo':
    'https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg?auto=compress&cs=tinysrgb&w=600',
  bagel:
    'https://images.pexels.com/photos/4122564/pexels-photo-4122564.jpeg?auto=compress&cs=tinysrgb&w=600',
  tostada:
    'https://images.pexels.com/photos/704569/pexels-photo-704569.jpeg?auto=compress&cs=tinysrgb&w=600',

  // Sandwiches
  sandwich:
    'https://images.pexels.com/photos/1647163/pexels-photo-1647163.jpeg?auto=compress&cs=tinysrgb&w=600',
  'jamón y queso':
    'https://images.pexels.com/photos/1647163/pexels-photo-1647163.jpeg?auto=compress&cs=tinysrgb&w=600',
  pollo:
    'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=600',
  'sandwich de pollo':
    'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=600',
  wrap:
    'https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg?auto=compress&cs=tinysrgb&w=600',

  // Tortas y postres
  cheesecake:
    'https://images.pexels.com/photos/1126359/pexels-photo-1126359.jpeg?auto=compress&cs=tinysrgb&w=600',
  oreo:
    'https://images.pexels.com/photos/15422558/pexels-photo-15422558.jpeg?auto=compress&cs=tinysrgb&w=600',
  'torta oreo':
    'https://images.pexels.com/photos/15422558/pexels-photo-15422558.jpeg?auto=compress&cs=tinysrgb&w=600',
  brownie:
    'https://images.pexels.com/photos/45202/brownie-dessert-cake-sweet-45202.jpeg?auto=compress&cs=tinysrgb&w=600',
  'tarta de manzana':
    'https://images.pexels.com/photos/1407346/pexels-photo-1407346.jpeg?auto=compress&cs=tinysrgb&w=600',
  'lemon pie':
    'https://images.pexels.com/photos/128388/pexels-photo-128388.jpeg?auto=compress&cs=tinysrgb&w=600',
  muffin:
    'https://images.pexels.com/photos/1657414/pexels-photo-1657414.jpeg?auto=compress&cs=tinysrgb&w=600',
  'chocolate cake':
    'https://images.pexels.com/photos/132694/pexels-photo-132694.jpeg?auto=compress&cs=tinysrgb&w=600',
  torta:
    'https://images.pexels.com/photos/132694/pexels-photo-132694.jpeg?auto=compress&cs=tinysrgb&w=600',
  pastel:
    'https://images.pexels.com/photos/132694/pexels-photo-132694.jpeg?auto=compress&cs=tinysrgb&w=600',

  // Bebidas frías
  limonada:
    'https://images.pexels.com/photos/1187766/pexels-photo-1187766.jpeg?auto=compress&cs=tinysrgb&w=600',
  jugo:
    'https://images.pexels.com/photos/96974/pexels-photo-96974.jpeg?auto=compress&cs=tinysrgb&w=600',
  smoothie:
    'https://images.pexels.com/photos/161440/smoothie-fruit-vegetables-salad-health-161440.jpeg?auto=compress&cs=tinysrgb&w=600',
  'té helado':
    'https://images.pexels.com/photos/1629780/pexels-photo-1629780.jpeg?auto=compress&cs=tinysrgb&w=600',
  milkshake:
    'https://images.pexels.com/photos/3727250/pexels-photo-3727250.jpeg?auto=compress&cs=tinysrgb&w=600',
  'agua saborizada':
    'https://images.pexels.com/photos/1187766/pexels-photo-1187766.jpeg?auto=compress&cs=tinysrgb&w=600',

  // Generic fallbacks by category
  cafe:
    'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=600',
  panificados:
    'https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg?auto=compress&cs=tinysrgb&w=600',
  sandwiches:
    'https://images.pexels.com/photos/1647163/pexels-photo-1647163.jpeg?auto=compress&cs=tinysrgb&w=600',
  tortas:
    'https://images.pexels.com/photos/1126359/pexels-photo-1126359.jpeg?auto=compress&cs=tinysrgb&w=600',
  postres:
    'https://images.pexels.com/photos/132694/pexels-photo-132694.jpeg?auto=compress&cs=tinysrgb&w=600',
  bebidas:
    'https://images.pexels.com/photos/1187766/pexels-photo-1187766.jpeg?auto=compress&cs=tinysrgb&w=600',
};

export const GENERIC_FOOD =
  'https://images.pexels.com/photos/2074130/pexels-photo-2074130.jpeg?auto=compress&cs=tinysrgb&w=600';

export function getProductImage(producto: { nombre: string; descripcion?: string | null; imagen?: string | null; categorias?: { nombre?: string } | null }): string {
  // Priority 1: admin uploaded image
  if (producto.imagen) return producto.imagen;

  const nombre = producto.nombre.toLowerCase();
  const desc = (producto.descripcion || '').toLowerCase();
  const cat = (producto.categorias?.nombre || '').toLowerCase();

  // Priority 2: match by product name
  for (const key of Object.keys(PRODUCT_IMAGES)) {
    if (nombre.includes(key)) return PRODUCT_IMAGES[key];
  }

  // Priority 3: match by description
  for (const key of Object.keys(PRODUCT_IMAGES)) {
    if (desc.includes(key)) return PRODUCT_IMAGES[key];
  }

  // Priority 4: match by category
  for (const key of ['cafe', 'panificados', 'sandwiches', 'tortas', 'postres', 'bebidas']) {
    if (cat.includes(key)) return PRODUCT_IMAGES[key];
  }

  // Fallback
  return GENERIC_FOOD;
}
