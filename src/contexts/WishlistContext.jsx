import React, { createContext, useContext, useEffect, useState, useCallback, useMemo, useRef } from "react";

const WishlistContext = createContext();

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem("flux-wishlist");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Use ref for timeout management
  const timeoutRef = useRef(null);

  // Optimized localStorage saving with better debouncing
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      try {
        localStorage.setItem("flux-wishlist", JSON.stringify(wishlist));
      } catch {
        // Silently fail if localStorage is not available
      }
    }, 150); // Increased debounce for better performance

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [wishlist]);

  const toggleWishlist = useCallback((product) => {
    setWishlist((prev) => {
      const existingIndex = prev.findIndex((item) => item.id === product.id);
      if (existingIndex !== -1) {
        // Remove item
        return prev.filter((item) => item.id !== product.id);
      } else {
        // Add item
        return [...prev, product];
      }
    });
  }, []);

  const removeFromWishlist = useCallback((id) => {
    setWishlist((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const clearWishlist = useCallback(() => {
    setWishlist([]);
  }, []);

  // Optimized isInWishlist with early return
  const isInWishlist = useCallback((id) => {
    if (wishlist.length === 0) return false;
    return wishlist.some((item) => item.id === id);
  }, [wishlist]);

  // Optimized wishlistCount with early return
  const wishlistCount = useMemo(() => {
    return wishlist.length;
  }, [wishlist]);

  // Memoize the entire context value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    wishlist,
    toggleWishlist,
    removeFromWishlist,
    clearWishlist,
    isInWishlist,
    wishlistCount
  }), [wishlist, toggleWishlist, removeFromWishlist, clearWishlist, isInWishlist, wishlistCount]);

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};
