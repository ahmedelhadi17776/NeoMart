// Add By Mohamed 
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import products from "../data/products.json";
// import "./ProductDetails.css";
import "../App.css";

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [wishlist, setWishlist] = useState(() => {
    return JSON.parse(localStorage.getItem("wishlist")) || [];
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
    localStorage.setItem("wishlist", JSON.stringify(updated));
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
          <h1 className="mb-3">{product.title}</h1>
          <p className="text-muted">{product.category}</p>
          <p>{product.description}</p>
          <h3 className="custom-price">${product.price}</h3>
          <p>
            <strong>Stock:</strong> {product.stock}
          </p>

          {/* Buttons */}
          <div className="d-flex gap-3 mt-4">
            <button className="btn-custom success">Add to Cart 🛒</button>
            <button
              className={`btn-custom ${
                isInWishlist(product) ? "danger" : "outline-danger"
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
