import React, { memo, useCallback } from "react";
import { useCart } from "../hooks/useCart";

const CartItem = memo(({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  const handleDecreaseQuantity = useCallback(() => {
    updateQuantity(item.id, item.quantity - 1);
  }, [updateQuantity, item.id, item.quantity]);

  const handleIncreaseQuantity = useCallback(() => {
    updateQuantity(item.id, item.quantity + 1);
  }, [updateQuantity, item.id, item.quantity]);

  const handleRemove = useCallback(() => {
    removeFromCart(item.id);
  }, [removeFromCart, item.id]);

  return (
    <div className="cart-item-card mb-3 card-entry">
      <div className="card-body d-flex align-items-center p-4">
        <div className="product-image-container me-3">
          <img
            src={item.image}
            alt={item.title}
            className="product-image"
          />
        </div>
        
        <div className="flex-grow-1">
          <h6 className="mb-1 fw-bold" style={{ color: "var(--text-primary)" }}>
            {item.title}
          </h6>
          <div className="d-flex align-items-center gap-3 mb-2">
            <span className="gradient-text fw-bold fs-5">${item.price.toFixed(2)}</span>
            <span className="text-muted small">each</span>
          </div>
          <div className="d-flex align-items-center gap-2">
            <span className="badge bg-secondary small">Stock: {item.stock ?? "∞"}</span>
            <span className="text-muted small">
              Subtotal: <strong className="gradient-text">${(item.price * item.quantity).toFixed(2)}</strong>
            </span>
          </div>
        </div>

        <div className="cart-controls d-flex flex-column align-items-center gap-3">
          <div className="quantity-controls">
            <div className="btn-group" role="group">
              <button
                className="btn btn-outline-secondary btn-sm"
                onClick={handleDecreaseQuantity}
                disabled={item.quantity <= 1}
              >
                <i className="bi bi-dash"></i>
              </button>
              <span 
                className="btn btn-light btn-sm px-3" 
                style={{ 
                  background: "var(--bg-secondary)", 
                  color: "var(--text-primary)",
                  border: "1px solid var(--border-color)",
                  minWidth: "50px"
                }}
              >
                {item.quantity}
              </span>
              <button
                className="btn btn-outline-secondary btn-sm"
                onClick={handleIncreaseQuantity}
                disabled={item.quantity >= (item.stock || Infinity)}
              >
                <i className="bi bi-plus"></i>
              </button>
            </div>
          </div>
          
          <button
            className="btn btn-outline-danger btn-sm"
            onClick={handleRemove}
            title="Remove from cart"
          >
            <i className="bi bi-trash me-1"></i>
            Remove
          </button>
        </div>
      </div>
    </div>
  );
});

CartItem.displayName = 'CartItem';

export default CartItem;
