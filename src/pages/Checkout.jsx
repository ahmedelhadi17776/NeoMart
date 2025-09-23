import React, { useState } from "react";
import { useCart } from "../contexts/CartContext";
import { useNavigate } from "react-router-dom";

function validCardNumber(num) {
  const digits = num.replace(/\s+/g, "");
  return /^\d{16}$/.test(digits);
}
function validCVV(cvv) {
  return /^\d{3}$/.test(cvv);
}
function validExpiry(mmYY) {
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
}

export default function Checkout() {
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

  const handleSubmit = e => {
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
  };

  return (
    <div className="container py-4">
      <h3>Checkout</h3>
      <form className="row g-3 mt-2" onSubmit={handleSubmit}>
        <div className="col-12">
          <label className="form-label">Full Name</label>
          <input
            className="form-control"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
          />
          {errors.name && <div className="text-danger">{errors.name}</div>}
        </div>

        <div className="col-12">
          <label className="form-label">Address</label>
          <textarea
            className="form-control"
            value={form.address}
            onChange={e => setForm({ ...form, address: e.target.value })}
          />
          {errors.address && <div className="text-danger">{errors.address}</div>}
        </div>

        <div className="col-md-6">
          <label className="form-label">Card Number (16 digits)</label>
          <input
            className="form-control"
            value={form.card}
            onChange={e => setForm({ ...form, card: e.target.value })}
            placeholder="1234123412341234"
          />
          {errors.card && <div className="text-danger">{errors.card}</div>}
        </div>

        <div className="col-md-3">
          <label className="form-label">CVV</label>
          <input
            className="form-control"
            value={form.cvv}
            onChange={e => setForm({ ...form, cvv: e.target.value })}
            placeholder="123"
          />
          {errors.cvv && <div className="text-danger">{errors.cvv}</div>}
        </div>

        <div className="col-md-3">
          <label className="form-label">Expiry (MM/YY)</label>
          <input
            className="form-control"
            value={form.expiry}
            onChange={e => setForm({ ...form, expiry: e.target.value })}
            placeholder="04/27"
          />
          {errors.expiry && <div className="text-danger">{errors.expiry}</div>}
        </div>

        <div className="col-12">
          <h5>Total Amount: ${cartTotal.toFixed(2)}</h5>
          <button className="btn btn-success" type="submit">
            Confirm Order
          </button>
        </div>
      </form>
    </div>
  );
}
