// Sample data utilities for testing
import products from '../data/products.json';

export const addSampleCartItems = () => {
  // Add some sample items to cart for testing
  const sampleItems = [
    { product: products[0], quantity: 2 }, // React Pro T-Shirt
    { product: products[1], quantity: 1 }, // JavaScript Mug
    { product: products[6], quantity: 1 }, // TypeScript Keyboard
  ];

  const cartItems = sampleItems.map(({ product, quantity }) => ({
    id: product.id,
    title: product.title,
    price: product.price,
    image: product.image,
    quantity,
    stock: product.stock
  }));

  localStorage.setItem('flux-cart', JSON.stringify(cartItems));
  return cartItems;
};

export const addSampleWishlistItems = () => {
  // Add some sample items to wishlist for testing
  const sampleItems = [
    products[2], // CSS Ninja Sticker Pack
    products[4], // Python Developer Notebook
    products[11], // Next.js Wireless Headphones
    products[6], // TypeScript Keyboard
    products[9], // Webpack Backpack
  ];

  localStorage.setItem('flux-wishlist', JSON.stringify(sampleItems));
  return sampleItems;
};

export const clearAllData = () => {
  localStorage.removeItem('flux-cart');
  localStorage.removeItem('flux-wishlist');
  localStorage.removeItem('flux-theme');
};

// Add to window for easy testing in browser console
if (typeof window !== 'undefined') {
  window.addSampleCartItems = addSampleCartItems;
  window.addSampleWishlistItems = addSampleWishlistItems;
  window.clearAllData = clearAllData;
}
