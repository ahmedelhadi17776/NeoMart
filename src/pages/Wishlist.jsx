// Add By Mohamed
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
// import "./Wishlist.css"; 
import "../App.css";
export default function Wishlist() {
    const [wishlist, setWishlist] = useState([]);

    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem("flux-wishlist")) || [];
        setWishlist(saved);
    }, []);

    const removeFromWishlist = (id) => {
        const updated = wishlist.filter((item) => item.id !== id);
        setWishlist(updated);
        localStorage.setItem("flux-wishlist", JSON.stringify(updated));
    };

    if (wishlist.length === 0) {
        return (
        <h2 className="text-center mt-5" style={{ color: "var(--text-primary)" }}>
            No items in your wishlist ❤️
        </h2>
        );
    }

    return (
        <div className="container py-5">
        <h1 className="mb-4" style={{ color: "var(--text-primary)" }}>
            My Wishlist
        </h1>
        <div className="row">
            {wishlist.map((product) => (
            <div key={product.id} className="col-md-4 mb-4">
                <div className="card h-100 shadow" style={{ background: "var(--card-bg)", color: "var(--text-primary)" }}>
                <img
                    src={product.image}
                    alt={product.title}
                    className="card-img-top"
                    style={{ height: "200px", objectFit: "cover" }}
                />
                <div className="card-body text-center">
                    <h5 className="card-title">{product.title}</h5>
                    <p className="custom-price">${product.price}</p>
                    <div className="d-flex justify-content-between">
                    <Link to={`/product/${product.id}`} className="btn btn-primary">
                        View Details
                    </Link>
                    <button
                        className="btn btn-primary"
                        onClick={() => removeFromWishlist(product.id)}
                    >
                        Remove ❌
                    </button>
                    </div>
                </div>
                </div>
            </div>
            ))}
        </div>
        </div>
    );
}
