import React, { memo, useCallback, useMemo } from "react";
import { useCart } from "../hooks/useCart";
import CartItem from "../components/CartItem";
import { Link, useNavigate } from "react-router-dom";

const CartPage = memo(() => {
  const { cartItems, cartTotal, cartCount, clearCart } = useCart();
  const navigate = useNavigate();

  const handleClearCart = useCallback(() => {
    clearCart();
  }, [clearCart]);

  const handleCheckout = useCallback(() => {
    navigate("/checkout");
  }, [navigate]);

  const itemCountText = useMemo(() => 
    `${cartCount} ${cartCount === 1 ? 'item' : 'items'}`, 
    [cartCount]
  );

  if (cartItems.length === 0) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-6">
            <div className="card glass-card p-5 card-entry text-center">
              <div className="mb-4">
                <div className="empty-cart-icon mb-3">
                  🛒
                </div>
                <h2 className="gradient-text mb-3">Your cart is empty</h2>
                <p className="text-muted mb-4 fs-5">
                  Looks like you haven't added any items to your cart yet. 
                  <br />
                  Discover amazing products and start shopping!
                </p>
              </div>
              <div className="d-flex gap-3 justify-content-center">
                <Link to="/" className="btn btn-primary btn-lg">
                  <i className="bi bi-house me-2"></i>
                  Start Shopping
                </Link>
                <Link to="/wishlist" className="btn btn-outline-primary btn-lg">
                  <i className="bi bi-heart me-2"></i>
                  View Wishlist
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="gradient-text mb-0">Shopping Cart</h2>
        <div className="d-flex align-items-center gap-3">
          <span className="badge bg-primary fs-6 px-3 py-2">
            {itemCountText}
          </span>
          <button
            className="btn btn-outline-danger btn-sm"
            onClick={handleClearCart}
          >
            <i className="bi bi-trash me-1"></i>
            Clear All
          </button>
        </div>
      </div>
      
      <div className="row g-4">
        <div className="col-lg-8">
          <div className="cart-items-container">
            {cartItems.map((item, index) => (
              <div key={item.id} className="cart-item-wrapper" style={{ animationDelay: `${index * 0.1}s` }}>
                <CartItem item={item} />
              </div>
            ))}
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card glass-card p-4 card-entry sticky-top checkout-summary" style={{ top: "100px" }}>
            <div className="d-flex align-items-center mb-3">
              <i className="bi bi-receipt me-2" style={{ color: "var(--accent)" }}></i>
              <h5 className="gradient-text mb-0">Order Summary</h5>
            </div>
            
            <div className="summary-line">
              <span style={{ color: "var(--text-primary)" }}>Subtotal ({cartCount} items):</span>
              <span className="gradient-text">${cartTotal.toFixed(2)}</span>
            </div>
            <div className="summary-line">
              <span style={{ color: "var(--text-primary)" }}>Shipping:</span>
              <span className="text-success">Free</span>
            </div>
            <div className="summary-line">
              <span style={{ color: "var(--text-primary)" }}>Tax:</span>
              <span className="text-muted">$0.00</span>
            </div>
            
            <hr style={{ borderColor: "var(--border-color)", margin: "1.5rem 0" }} />
            
            <div className="summary-line total-line">
              <strong style={{ color: "var(--text-primary)" }}>Total:</strong>
              <strong className="gradient-text fs-5">${cartTotal.toFixed(2)}</strong>
            </div>
            
            <div className="d-grid gap-2 mt-4">
              <button
                className="btn btn-primary btn-lg"
                onClick={handleCheckout}
              >
                <i className="bi bi-credit-card me-2"></i>
                Proceed to Checkout
              </button>
              <Link to="/" className="btn btn-outline-primary">
                <i className="bi bi-arrow-left me-2"></i>
                Continue Shopping
              </Link>
            </div>
            
            <div className="mt-3 text-center">
              <small className="text-muted">
                <i className="bi bi-shield-check me-1"></i>
                Secure checkout guaranteed
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

CartPage.displayName = 'CartPage';

export default CartPage;
