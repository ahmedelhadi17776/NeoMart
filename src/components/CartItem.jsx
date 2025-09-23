import React from "react";
import { useCart } from "../hooks/useCart";

export default function CartItem({ item }) {
  const { updateQuantity, removeFromCart } = useCart();

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
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
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
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                disabled={item.quantity >= (item.stock || Infinity)}
              >
                <i className="bi bi-plus"></i>
              </button>
            </div>
          </div>
          
          <button
            className="btn btn-outline-danger btn-sm"
            onClick={() => removeFromCart(item.id)}
            title="Remove from cart"
          >
            <i className="bi bi-trash me-1"></i>
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}
