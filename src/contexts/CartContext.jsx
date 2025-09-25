import React, { createContext, useEffect, useReducer, useCallback, useMemo, useRef } from "react";

const CartContext = createContext(null);

// Cart reducer for better state management
const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { product, quantity = 1 } = action.payload;
      const existingIndex = state.items.findIndex(i => i.id === product.id);
      const maxStock = product.stock ?? Infinity;
      
      if (existingIndex !== -1) {
        // Update existing item
        const newItems = [...state.items];
        newItems[existingIndex] = {
          ...newItems[existingIndex],
          quantity: Math.min(newItems[existingIndex].quantity + quantity, maxStock)
        };
        return {
          ...state,
          items: newItems,
          count: newItems.reduce((s, i) => s + i.quantity, 0),
          total: newItems.reduce((s, i) => s + i.price * i.quantity, 0)
        };
      } else {
        // Add new item
        const newItem = {
          id: product.id,
          title: product.title,
          price: product.price,
          image: product.image,
          quantity: Math.min(quantity, maxStock),
          stock: product.stock ?? null
        };
        const newItems = [...state.items, newItem];
        return {
          ...state,
          items: newItems,
          count: state.count + newItem.quantity,
          total: state.total + (newItem.price * newItem.quantity)
        };
      }
    }
    
    case 'REMOVE_ITEM': {
      const itemToRemove = state.items.find(i => i.id === action.payload);
      if (!itemToRemove) return state;
      
      const newItems = state.items.filter(i => i.id !== action.payload);
      return {
        ...state,
        items: newItems,
        count: state.count - itemToRemove.quantity,
        total: state.total - (itemToRemove.price * itemToRemove.quantity)
      };
    }
    
    case 'UPDATE_QUANTITY': {
      const { id, quantity } = action.payload;
      const itemIndex = state.items.findIndex(i => i.id === id);
      if (itemIndex === -1) return state;
      
      const item = state.items[itemIndex];
      const newQuantity = Math.max(1, Math.min(quantity, item.stock ?? Infinity));
      const quantityDiff = newQuantity - item.quantity;
      
      const newItems = [...state.items];
      newItems[itemIndex] = { ...item, quantity: newQuantity };
      
      return {
        ...state,
        items: newItems,
        count: state.count + quantityDiff,
        total: state.total + (item.price * quantityDiff)
      };
    }
    
    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
        count: 0,
        total: 0
      };
    
    case 'LOAD_CART':
      const items = action.payload || [];
      return {
        ...state,
        items,
        count: items.reduce((s, i) => s + i.quantity, 0),
        total: items.reduce((s, i) => s + i.price * i.quantity, 0)
      };
    
    default:
      return state;
  }
};

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    count: 0,
    total: 0
  });

  const timeoutRef = useRef(null);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem("flux-cart");
      const savedItems = raw ? JSON.parse(raw) : [];
      dispatch({ type: 'LOAD_CART', payload: savedItems });
    } catch {
      // Silently fail if localStorage is not available
    }
  }, []);

  // Optimized localStorage saving with debouncing
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      try {
        localStorage.setItem("flux-cart", JSON.stringify(state.items));
      } catch {
        // Silently fail if localStorage is not available
      }
    }, 150);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [state.items]);

  // Optimized action creators
  const addToCart = useCallback((product, quantity = 1) => {
    dispatch({ type: 'ADD_ITEM', payload: { product, quantity } });
  }, []);

  const removeFromCart = useCallback(id => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  }, []);

  const updateQuantity = useCallback((id, quantity) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR_CART' });
  }, []);

  // Memoize the entire context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    cartItems: state.items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartCount: state.count,
    cartTotal: state.total
  }), [state.items, state.count, state.total, addToCart, removeFromCart, updateQuantity, clearCart]);

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
}

// Export the context for use in the hook
export { CartContext };
