import React from "react";
import { useCart } from "../contexts/CartContext";
import CartItem from "../components/CartItem";
import { Link, useNavigate } from "react-router-dom";

export default function CartPage() {
  const { cartItems, cartTotal, cartCount, clearCart } = useCart();
  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <div className="container py-5">
        <h3>Your cart is empty 😕</h3>
        <Link to="/">Back to shopping</Link>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h3>Shopping Cart ({cartCount})</h3>
      <div className="row mt-3">
        <div className="col-md-8">
          {cartItems.map(item => (
            <CartItem key={item.id} item={item} />
          ))}
        </div>

        <div className="col-md-4">
          <div className="card p-3">
            <h5>Order Summary</h5>
            <p>Total: ${cartTotal.toFixed(2)}</p>
            <button
              className="btn btn-primary w-100"
              onClick={() => navigate("/checkout")}
            >
              Proceed to Checkout
            </button>
            <button
              className="btn btn-outline-danger w-100 mt-2"
              onClick={() => clearCart()}
            >
              Clear Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
