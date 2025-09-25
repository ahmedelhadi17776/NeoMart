import productsFallback from '../data/products.json';

const STORAGE_KEY = 'flux-products';

export const getProducts = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return productsFallback;
};

export const saveProducts = (list) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    // ignore
  }
  return list;
};

export const addProduct = (product) => {
  const list = getProducts();
  const nextId = list.length > 0 ? Math.max(...list.map(p => p.id)) + 1 : 1;
  const newProduct = { id: nextId, reviews: 0, rating: 0, badge: '', ...product };
  const updated = [...list, newProduct];
  return saveProducts(updated);
};

export const updateProduct = (id, updates) => {
  const list = getProducts();
  const updated = list.map(p => p.id === id ? { ...p, ...updates, id } : p);
  return saveProducts(updated);
};

export const deleteProduct = (id) => {
  const list = getProducts();
  const updated = list.filter(p => p.id !== id);
  return saveProducts(updated);
};

export const getProductById = (id) => {
  const list = getProducts();
  return list.find(p => p.id === id) || null;
};


