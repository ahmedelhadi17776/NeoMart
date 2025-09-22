import { useNavigate } from "react-router-dom";
import products from "../data/products.json"; 
import { useState } from "react";

export default function Home() {
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState([]);

  const toggleWishlist = (id) => {
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };


return (
    <div className="container py-5">
      <h2 className="mb-4 text-center">🔥 Featured Products</h2>
      <div className="row">
        {products.slice(0, 4).map((product) => (
          <div className="col-md-3 mb-4" key={product.id}>
            <div className="card h-100 shadow-sm">
              <img
                src={product.image}
                alt={product.title}
                className="card-img-top"
                style={{ height: "200px", objectFit: "cover" }}
              />
              <div className="card-body text-center">
                <h5 className="card-title">{product.title}</h5>
                <p className="text-muted">${product.price}</p>
                <button
                  className="btn btn-primary w-100 mb-2"
                  onClick={() => navigate(`/product/${product.id}`)}
                >
                  View Details
                </button>
                <button
                  className={`btn w-100 ${
                    wishlist.includes(product.id)
                      ? "btn-danger"
                      : "btn-outline-danger"
                  }`}
                  onClick={() => toggleWishlist(product.id)}
                >
                  {wishlist.includes(product.id)
                    ? "❤️ Remove from Wishlist"
                    : "🤍 Add to Wishlist"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

