import React, { useState, useCallback, memo } from "react";
import { useCart } from "../hooks/useCart";
import { useNavigate } from "react-router-dom";

// Validation functions moved outside component for better performance
const validCardNumber = (num) => {
  const digits = num.replace(/\s+/g, "");
  return /^\d{16}$/.test(digits);
};

const validCVV = (cvv) => {
  return /^\d{3}$/.test(cvv);
};

const validExpiry = (mmYY) => {
  const parts = mmYY.split("/");
  if (parts.length !== 2) return false;
  const month = parseInt(parts[0], 10);
  let year = parseInt(parts[1], 10);
  if (isNaN(month) || isNaN(year)) return false;
  if (year < 100) year += 2000;
  if (month < 1 || month > 12) return false;
  // Expiry is the beginning of the next month
  const exp = new Date(year, month, 1);
  const now = new Date();
  return exp > now;
};

const Checkout = memo(() => {
  const { cartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    address: "",
    card: "",
    cvv: "",
    expiry: ""
  });
  const [errors, setErrors] = useState({});

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    const eObj = {};
    if (!form.name.trim()) eObj.name = "Please enter your name";
    if (!form.address.trim() || form.address.length < 6)
      eObj.address = "Please enter a valid address";
    if (!validCardNumber(form.card)) eObj.card = "Card number must be 16 digits";
    if (!validCVV(form.cvv)) eObj.cvv = "CVV must be 3 digits";
    if (!validExpiry(form.expiry)) eObj.expiry = "Invalid expiry date (MM/YY)";

    setErrors(eObj);
    if (Object.keys(eObj).length === 0) {
      // Simulate order submission
      const orderId = Date.now();
      clearCart();
      navigate("/thankyou", { state: { orderId, total: cartTotal } });
    }
  }, [form, clearCart, navigate, cartTotal]);

  return (
    <div className="container py-4">
      <h2 className="gradient-text mb-4">Checkout</h2>
      <div className="row g-4">
        <div className="col-lg-8">
          <div className="card glass-card p-4 card-entry">
            <h5 className="gradient-text mb-4">Shipping Information</h5>
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-12">
                  <label className="form-label" style={{ color: "var(--text-primary)" }}>Full Name</label>
                  <input
                    className="form-control"
                    style={{ 
                      background: "var(--bg-secondary)", 
                      border: "1px solid var(--border-color)",
                      color: "var(--text-primary)"
                    }}
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                  />
                  {errors.name && <div className="text-danger mt-1">{errors.name}</div>}
                </div>

                <div className="col-12">
                  <label className="form-label" style={{ color: "var(--text-primary)" }}>Address</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    style={{ 
                      background: "var(--bg-secondary)", 
                      border: "1px solid var(--border-color)",
                      color: "var(--text-primary)"
                    }}
                    value={form.address}
                    onChange={e => setForm({ ...form, address: e.target.value })}
                  />
                  {errors.address && <div className="text-danger mt-1">{errors.address}</div>}
                </div>

                <div className="col-md-6">
                  <label className="form-label" style={{ color: "var(--text-primary)" }}>Card Number (16 digits)</label>
                  <input
                    className="form-control"
                    style={{ 
                      background: "var(--bg-secondary)", 
                      border: "1px solid var(--border-color)",
                      color: "var(--text-primary)"
                    }}
                    value={form.card}
                    onChange={e => setForm({ ...form, card: e.target.value })}
                    placeholder="1234123412341234"
                  />
                  {errors.card && <div className="text-danger mt-1">{errors.card}</div>}
                </div>

                <div className="col-md-3">
                  <label className="form-label" style={{ color: "var(--text-primary)" }}>CVV</label>
                  <input
                    className="form-control"
                    style={{ 
                      background: "var(--bg-secondary)", 
                      border: "1px solid var(--border-color)",
                      color: "var(--text-primary)"
                    }}
                    value={form.cvv}
                    onChange={e => setForm({ ...form, cvv: e.target.value })}
                    placeholder="123"
                  />
                  {errors.cvv && <div className="text-danger mt-1">{errors.cvv}</div>}
                </div>

                <div className="col-md-3">
                  <label className="form-label" style={{ color: "var(--text-primary)" }}>Expiry (MM/YY)</label>
                  <input
                    className="form-control"
                    style={{ 
                      background: "var(--bg-secondary)", 
                      border: "1px solid var(--border-color)",
                      color: "var(--text-primary)"
                    }}
                    value={form.expiry}
                    onChange={e => setForm({ ...form, expiry: e.target.value })}
                    placeholder="04/27"
                  />
                  {errors.expiry && <div className="text-danger mt-1">{errors.expiry}</div>}
                </div>
              </div>
            </form>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card glass-card p-4 card-entry sticky-top" style={{ top: "100px" }}>
            <h5 className="gradient-text mb-3">Order Summary</h5>
            <div className="d-flex justify-content-between mb-2">
              <span style={{ color: "var(--text-primary)" }}>Subtotal:</span>
              <span className="gradient-text">${cartTotal.toFixed(2)}</span>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <span style={{ color: "var(--text-primary)" }}>Shipping:</span>
              <span className="text-muted">Free</span>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <span style={{ color: "var(--text-primary)" }}>Tax:</span>
              <span className="text-muted">$0.00</span>
            </div>
            <hr style={{ borderColor: "var(--border-color)" }} />
            <div className="d-flex justify-content-between mb-4">
              <strong style={{ color: "var(--text-primary)" }}>Total:</strong>
              <strong className="gradient-text">${cartTotal.toFixed(2)}</strong>
            </div>
            <button 
              className="btn btn-primary w-100" 
              type="submit"
              onClick={handleSubmit}
            >
              Confirm Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

Checkout.displayName = 'Checkout';

export default Checkout;
