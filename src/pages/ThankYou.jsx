import React from "react";
import { useLocation, Link } from "react-router-dom";

export default function ThankYou() {
  const { state } = useLocation();
  const id = state?.orderId;
  const total = state?.total ?? 0;
  return (
    <div className="container py-5 text-center">
      <h2>Thank you! Your order has been received 🎉</h2>
      {id && <p>Order Number: <strong>{id}</strong></p>}
      <p>Amount Paid: ${total.toFixed(2)}</p>
      <Link to="/">Back to Home</Link>
    </div>
  );
}
