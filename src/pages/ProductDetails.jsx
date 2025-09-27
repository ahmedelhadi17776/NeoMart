import React, { useState, useEffect, useCallback, memo, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { getProductById } from "../utils/productsStore";
import { useCart } from "../hooks/useCart";
import { useWishlist } from "../contexts/WishlistContext";
import LazyImage from "../components/LazyImage";

const ProductDetails = memo(() => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const abortControllerRef = useRef(null);

  useEffect(() => {
    // Cleanup previous request if component unmounts
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    abortControllerRef.current = new AbortController();
    
    // Simulate async product loading with cleanup
    const loadProduct = async () => {
      try {
        // Small delay to show loading state
        await new Promise(resolve => setTimeout(resolve, 100));
        
        if (abortControllerRef.current?.signal.aborted) return;
        
        const selectedProduct = getProductById(parseInt(id));
        if (selectedProduct) {
          setProduct(selectedProduct);
          setIsLoading(false);
        }
      } catch (error) {
        if (!abortControllerRef.current?.signal.aborted) {
          console.error('Error loading product:', error);
        }
      }
    };
    
    loadProduct();
    
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [id]);

  const handleQuantityChange = useCallback((newQuantity) => {
    if (product) {
      setQuantity(Math.max(1, Math.min(newQuantity, product.stock)));
    }
  }, [product]);

  const handleAddToCart = useCallback(() => {
    if (product) {
      addToCart(product, quantity);
    }
  }, [product, quantity, addToCart]);

  const handleWishlistToggle = useCallback(() => {
    if (product) {
      toggleWishlist(product);
    }
  }, [product, toggleWishlist]);

  if (isLoading) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card glass-card p-5 text-center">
              <div className="loading mb-3"></div>
              <h3 className="gradient-text">Loading product details...</h3>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card glass-card p-5 text-center">
              <i className="bi bi-exclamation-triangle display-1 text-muted mb-3"></i>
              <h2 className="gradient-text mb-3">Product Not Found</h2>
              <p className="text-muted mb-4">
                The product you're looking for doesn't exist or has been removed.
              </p>
              <Link to="/" className="btn btn-primary">
                <i className="bi bi-house me-2"></i>
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      {/* Breadcrumb */}
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/" className="text-decoration-none">Home</Link>
          </li>
          <li className="breadcrumb-item">
            <Link to="/" className="text-decoration-none">{product.category}</Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            {product.title}
          </li>
        </ol>
      </nav>

      <div className="row g-5">
        {/* Product Images */}
        <div className="col-lg-6">
          <div className="product-image-gallery">
            <div className="main-image-container mb-3">
              <LazyImage
                src={product.image}
                alt={product.title}
                className="img-fluid rounded-3 shadow-lg product-main-image"
              />
              {product.badge && (
                <span className="badge product-badge bg-primary position-absolute top-0 end-0 m-3">
                  {product.badge}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Product Details */}
        <div className="col-lg-6">
          <div className="product-details">
            {/* Category and Badge */}
            <div className="mb-3">
              <span className="badge bg-secondary me-2">{product.category}</span>
              {product.badge && (
                <span className="badge bg-primary">{product.badge}</span>
              )}
            </div>
            
            {/* Title */}
            <h1 className="product-title mb-3">{product.title}</h1>
            
            {/* Rating */}
            <div className="mb-4">
              <div className="d-flex align-items-center gap-2 mb-2">
                <div className="rating">
                  {[...Array(5)].map((_, i) => (
                    <i
                      key={i}
                      className={`bi bi-star${i < Math.floor(product.rating || 0) ? '-fill' : ''}`}
                    ></i>
                  ))}
                </div>
                <span className="text-muted">({product.reviews} reviews)</span>
                <span className="badge bg-success ms-2">
                  {product.rating}/5
                </span>
              </div>
            </div>
            
            {/* Description */}
            <div className="product-description mb-4">
              <p className="text-muted">{product.description}</p>
            </div>
            
            {/* Price */}
            <div className="product-price mb-4">
              <h2 className="gradient-text mb-2">${product.price}</h2>
              <div className="d-flex align-items-center gap-3">
                <span className="badge bg-success">
                  <i className="bi bi-check-circle me-1"></i>
                  In Stock
                </span>
                <span className="text-muted">
                  <strong>{product.stock}</strong> available
                </span>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="quantity-selector mb-4">
              <label className="form-label fw-bold">Quantity:</label>
              <div className="btn-group quantity-controls" role="group">
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                >
                  <i className="bi bi-dash"></i>
                </button>
                <span className="btn btn-light quantity-display">
                  {quantity}
                </span>
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= product.stock}
                >
                  <i className="bi bi-plus"></i>
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="action-buttons mb-4">
              <div className="d-grid gap-3">
                <button 
                  className="btn btn-primary btn-lg"
                  onClick={handleAddToCart}
                >
                  <i className="bi bi-cart-plus me-2"></i>
                  Add to Cart - ${(product.price * quantity).toFixed(2)}
                </button>
                <button
                  className={`btn btn-lg ${
                    isInWishlist(product.id) ? "btn-danger" : "btn-outline-danger"
                  }`}
                  onClick={handleWishlistToggle}
                >
                  <i className={`bi ${isInWishlist(product.id) ? 'bi-heart-fill' : 'bi-heart'} me-2`}></i>
                  {isInWishlist(product.id)
                    ? "Remove from Wishlist"
                    : "Add to Wishlist"}
                </button>
              </div>
            </div>

            {/* Product Features */}
            <div className="product-features">
              <div className="row g-3">
                <div className="col-6">
                  <div className="feature-item text-center p-3 rounded">
                    <i className="bi bi-truck display-6 text-primary mb-2"></i>
                    <h6>Free Shipping</h6>
                    <small className="text-muted">On orders over $50</small>
                  </div>
                </div>
                <div className="col-6">
                  <div className="feature-item text-center p-3 rounded">
                    <i className="bi bi-arrow-clockwise display-6 text-success mb-2"></i>
                    <h6>Easy Returns</h6>
                    <small className="text-muted">30-day return policy</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

ProductDetails.displayName = 'ProductDetails';

export default ProductDetails;
