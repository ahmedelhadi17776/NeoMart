import React, { createContext, useEffect, useState, useCallback, useMemo } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const raw = localStorage.getItem("flux-cart");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  // Auto-save to localStorage with debouncing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      try {
        localStorage.setItem("flux-cart", JSON.stringify(cartItems));
      } catch {
        // Silently fail if localStorage is not available
      }
    }, 100); // Debounce localStorage writes

    return () => clearTimeout(timeoutId);
  }, [cartItems]);

  // Core functions with memoization
  const addToCart = useCallback((product, quantity = 1) => {
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
  }, []);

  const removeFromCart = useCallback(id => {
    setCartItems(prev => prev.filter(i => i.id !== id));
  }, []);

  const updateQuantity = useCallback((id, quantity) => {
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
  }, []);

  const clearCart = useCallback(() => setCartItems([]), []);

  const cartCount = useMemo(() => 
    cartItems.reduce((s, i) => s + i.quantity, 0), 
    [cartItems]
  );

  const cartTotal = useMemo(() => 
    cartItems.reduce((s, i) => s + i.price * i.quantity, 0), 
    [cartItems]
  );

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

// Export the context for use in the hook
export { CartContext };
