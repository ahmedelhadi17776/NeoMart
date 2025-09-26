import { getProducts } from './productsStore';

// Sample data for development/testing
export const addSampleCartItems = () => {
  const products = getProducts();
  const sampleItems = products.slice(0, 3).map(product => ({
    id: product.id,
    title: product.title,
    price: product.price,
    image: product.image,
    quantity: Math.floor(Math.random() * 3) + 1,
    stock: product.stock ?? null
  }));

  // Match app storage key
  localStorage.setItem('flux-cart', JSON.stringify(sampleItems));
};

export const addSampleWishlistItems = () => {
  const products = getProducts();
  const sampleWishlist = products.slice(3, 6);

  // Match app storage key
  localStorage.setItem('flux-wishlist', JSON.stringify(sampleWishlist));
};

export const clearAllData = () => {
  localStorage.removeItem('flux-cart');
  localStorage.removeItem('flux-wishlist');
  localStorage.removeItem('flux-theme');
  localStorage.removeItem('flux-user');
};