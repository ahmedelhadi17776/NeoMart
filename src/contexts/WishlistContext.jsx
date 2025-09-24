import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";

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

  // Auto-save to localStorage with debouncing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      try {
        localStorage.setItem("flux-wishlist", JSON.stringify(wishlist));
      } catch {
        // Silently fail if localStorage is not available
      }
    }, 100); // Debounce localStorage writes

    return () => clearTimeout(timeoutId);
  }, [wishlist]);

  const toggleWishlist = useCallback((product) => {
    setWishlist((prev) => {
      const exists = prev.find((item) => item.id === product.id);
      if (exists) {
        return prev.filter((item) => item.id !== product.id);
      } else {
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

  const isInWishlist = useCallback((id) => {
    return wishlist.some((item) => item.id === id);
  }, [wishlist]);

  const wishlistCount = useMemo(() => wishlist.length, [wishlist]);

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
