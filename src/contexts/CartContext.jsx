import React, { createContext, useEffect, useState, useCallback, useMemo, useRef } from "react";

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

  // Use ref to track if we're in the middle of a batch update
  const isUpdatingRef = useRef(false);
  const timeoutRef = useRef(null);

  // Optimized localStorage saving with better debouncing
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      try {
        localStorage.setItem("flux-cart", JSON.stringify(cartItems));
        isUpdatingRef.current = false;
      } catch {
        // Silently fail if localStorage is not available
      }
    }, 150); // Increased debounce for better performance

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [cartItems]);

  // Optimized core functions with better memoization
  const addToCart = useCallback((product, quantity = 1) => {
    isUpdatingRef.current = true;
    setCartItems(prev => {
      const existingIndex = prev.findIndex(i => i.id === product.id);
      const maxStock = product.stock ?? Infinity;
      
      if (existingIndex !== -1) {
        // Update existing item
        const newItems = [...prev];
        newItems[existingIndex] = {
          ...newItems[existingIndex],
          quantity: Math.min(newItems[existingIndex].quantity + quantity, maxStock)
        };
        return newItems;
      } else {
        // Add new item
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
    isUpdatingRef.current = true;
    setCartItems(prev => prev.filter(i => i.id !== id));
  }, []);

  const updateQuantity = useCallback((id, quantity) => {
    isUpdatingRef.current = true;
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

  const clearCart = useCallback(() => {
    isUpdatingRef.current = true;
    setCartItems([]);
  }, []);

  // Optimized calculations with early returns
  const cartCount = useMemo(() => {
    if (cartItems.length === 0) return 0;
    return cartItems.reduce((s, i) => s + i.quantity, 0);
  }, [cartItems]);

  const cartTotal = useMemo(() => {
    if (cartItems.length === 0) return 0;
    return cartItems.reduce((s, i) => s + i.price * i.quantity, 0);
  }, [cartItems]);

  // Memoize the entire context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartCount,
    cartTotal
  }), [cartItems, addToCart, removeFromCart, updateQuantity, clearCart, cartCount, cartTotal]);

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
}

// Export the context for use in the hook
export { CartContext };
