import React, { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const raw = localStorage.getItem("cart");
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  });

  // حفظ تلقائي في localStorage
  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(cartItems));
    } catch (e) {}
  }, [cartItems]);

  // دوال أساسية
  const addToCart = (product, quantity = 1) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.id === product.id);
      const maxStock = product.stock ?? Infinity;
      if (existing) {
        return prev.map(i =>
          i.id === product.id
            ? { ...i, quantity: Math.min(i.quantity + quantity, maxStock) }
            : i
        );
      } else {
        return [
          ...prev,
          {
            id: product.id,
            title: product.title,
            price: product.price,
            image: product.image,
            quantity: Math.min(quantity, maxStock),
            stock: product.stock ?? null
          }
        ];
      }
    });
  };

  const removeFromCart = id => {
    setCartItems(prev => prev.filter(i => i.id !== id));
  };

  const updateQuantity = (id, quantity) => {
    setCartItems(prev =>
      prev.map(i =>
        i.id === id
          ? {
              ...i,
              quantity: Math.max(1, Math.min(quantity, i.stock ?? Infinity))
            }
          : i
      )
    );
  };

  const clearCart = () => setCartItems([]);

  const cartCount = cartItems.reduce((s, i) => s + i.quantity, 0);

  const cartTotal = cartItems.reduce((s, i) => s + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
};
