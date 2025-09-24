import React from "react";
import { useLocation, Link } from "react-router-dom";

export default function ThankYou() {
  const { state } = useLocation();
  const id = state?.orderId;
  const total = state?.total ?? 0;
  
  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-6">
          <div className="card glass-card p-5 card-entry text-center">
            <div className="mb-4">
              <i className="bi bi-check-circle-fill display-1 text-success mb-3"></i>
              <h2 className="gradient-text mb-3">Thank you! Your order has been received 🎉</h2>
              {id && <p className="text-muted mb-2">Order Number: <strong className="gradient-text">{id}</strong></p>}
              <p className="text-muted mb-4">Amount Paid: <strong className="gradient-text">${total.toFixed(2)}</strong></p>
            </div>
            <Link to="/" className="btn btn-primary btn-lg">
              <i className="bi bi-house me-2"></i>
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
