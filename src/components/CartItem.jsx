import React from "react";
import { useCart } from "../contexts/CartContext";

export default function CartItem({ item }) {
  const { updateQuantity, removeFromCart } = useCart();

  return (
    <div className="d-flex align-items-center mb-3 border-bottom pb-2">
      <img
        src={item.image}
        alt={item.title}
        style={{ width: 90, height: 90, objectFit: "cover" }}
      />
      <div className="ms-3 flex-grow-1">
        <h6 className="mb-1">{item.title}</h6>
        <div>Price: ${item.price.toFixed(2)}</div>
        <small>Max Stock: {item.stock ?? "Unknown"}</small>
      </div>

      <div className="me-3 text-center">
        <div className="btn-group" role="group">
          <button
            className="btn btn-outline-secondary"
            onClick={() => updateQuantity(item.id, item.quantity - 1)}
          >
            −
          </button>
          <span className="btn btn-light">{item.quantity}</span>
          <button
            className="btn btn-outline-secondary"
            onClick={() => updateQuantity(item.id, item.quantity + 1)}
          >
            +
          </button>
        </div>
        <div className="mt-2">
          <button
            className="btn btn-sm btn-danger"
            onClick={() => removeFromCart(item.id)}
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}
