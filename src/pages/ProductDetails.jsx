import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import products from "../data/products.json";
import { useCart } from "../hooks/useCart";
import "../App.css";

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const [wishlist, setWishlist] = useState(() => {
    return JSON.parse(localStorage.getItem("flux-wishlist")) || [];
  });

  useEffect(() => {
    const selectedProduct = products.find((p) => p.id === parseInt(id));
    setProduct(selectedProduct);
  }, [id]);

  const toggleWishlist = (product) => {
    let updated;
    if (wishlist.some((item) => item.id === product.id)) {
      // remove
      updated = wishlist.filter((item) => item.id !== product.id);
    } else {
      // add
      updated = [...wishlist, product];
    }
    setWishlist(updated);
    localStorage.setItem("flux-wishlist", JSON.stringify(updated));
  };

  const isInWishlist = (product) => {
    return wishlist.some((item) => item.id === product.id);
  };

  if (!product) return <h2 className="text-center mt-5">Product not found</h2>;

  return (
    <div className="container py-5">
      <div className="row align-items-center">
        {/* Product Image */}
        <div className="col-md-6">
          <img
            src={product.image}
            alt={product.title}
            className="img-fluid rounded shadow"
          />
        </div>

        {/* Product Details */}
        <div className="col-md-6">
          <div className="mb-3">
            <span className="badge bg-secondary mb-2">{product.category}</span>
            {product.badge && (
              <span className="badge bg-primary ms-2">{product.badge}</span>
            )}
          </div>
          
          <h1 className="mb-3">{product.title}</h1>
          
          <div className="mb-3">
            <div className="d-flex align-items-center gap-2 mb-2">
              <div className="rating">
                {[...Array(5)].map((_, i) => (
                  <i
                    key={i}
                    className={`bi bi-star${i < Math.floor(product.rating || 0) ? '-fill' : ''}`}
                    style={{ color: '#ffc107' }}
                  ></i>
                ))}
              </div>
              <span className="text-muted">({product.reviews} reviews)</span>
            </div>
          </div>
          
          <p className="mb-4">{product.description}</p>
          
          <div className="mb-4">
            <h2 className="gradient-text mb-2">${product.price}</h2>
            <p className="text-muted">
              <strong>Stock:</strong> {product.stock} available
            </p>
          </div>

          {/* Quantity Selector */}
          <div className="mb-3">
            <label className="form-label">Quantity:</label>
            <div className="btn-group" role="group">
              <button
                className="btn btn-outline-secondary"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                −
              </button>
              <span className="btn btn-light">{quantity}</span>
              <button
                className="btn btn-outline-secondary"
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
              >
                +
              </button>
            </div>
          </div>

          {/* Buttons */}
          <div className="d-flex gap-3 mt-4">
            <button 
              className="btn btn-primary"
              onClick={() => addToCart(product, quantity)}
            >
              Add to Cart
            </button>
            <button
              className={`btn ${
                isInWishlist(product) ? "btn-danger" : "btn-outline-danger"
              }`}
              onClick={() => toggleWishlist(product)}
            >
              {isInWishlist(product)
                ? "♥ Remove from Wishlist"
                : "♡ Add to Wishlist"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
