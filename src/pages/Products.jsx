import React, { useMemo, useState, useCallback, memo, useRef } from 'react';
import products from '../data/products.json';
import { Link } from 'react-router-dom';
import LazyImage from '../components/LazyImage';
import { useCart } from '../hooks/useCart';
import { useWishlist } from '../contexts/WishlistContext';
import { useMicroInteractions, useWishlistAnimation, useButtonLoading } from '../hooks/useMicroInteractions';

const categoryList = Array.from(new Set(products.map(p => p.category)));

const sortOptions = [
  { key: 'featured', label: 'Featured' },
  { key: 'price-asc', label: 'Price: Low to High' },
  { key: 'price-desc', label: 'Price: High to Low' },
  { key: 'rating-desc', label: 'Rating: High to Low' },
];

const Products = memo(() => {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [sortBy, setSortBy] = useState('featured');
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  
  // Micro-interaction hooks
  const { createFlyToCartAnimation } = useMicroInteractions();
  const { triggerHeartAnimation, isHeartActive } = useWishlistAnimation();
  const { setButtonLoading, isButtonLoading } = useButtonLoading();
  
  // Refs for cart animation target
  const cartIconRef = useRef(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = products.filter(p => (
      (category === 'All' || p.category === category) &&
      (!q || p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q))
    ));
    switch (sortBy) {
      case 'price-asc':
        list = [...list].sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        list = [...list].sort((a, b) => b.price - a.price);
        break;
      case 'rating-desc':
        list = [...list].sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      default:
        break;
    }
    return list;
  }, [query, category, sortBy]);

  const handleAddToCart = useCallback(async (product, event) => {
    const buttonId = `add-to-cart-${product.id}`;
    const buttonElement = event.currentTarget;
    
    try {
      setButtonLoading(buttonId, true);
      
      // Add to cart
      addToCart(product, 1);
      
      // Trigger button animation
      buttonElement.classList.add('adding');
      
      // Create fly to cart animation
      if (cartIconRef.current) {
        createFlyToCartAnimation(buttonElement, cartIconRef.current);
      }
      
      // Reset button animation
      setTimeout(() => {
        buttonElement.classList.remove('adding');
        setButtonLoading(buttonId, false);
      }, 600);
      
    } catch (error) {
      console.error('Error adding to cart:', error);
      setButtonLoading(buttonId, false);
    }
  }, [addToCart, createFlyToCartAnimation, setButtonLoading]);

  const handleToggleWishlist = useCallback((product, event) => {
    const heartElement = event.currentTarget.querySelector('i');
    
    // Trigger heart animation
    triggerHeartAnimation(product.id);
    
    // Add active class for animation
    if (heartElement) {
      heartElement.classList.add('active');
      setTimeout(() => {
        heartElement.classList.remove('active');
      }, 800);
    }
    
    // Toggle wishlist
    toggleWishlist(product);
  }, [toggleWishlist, triggerHeartAnimation]);

  return (
    <div className="container py-4">
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
        <div>
          <h1 className="gradient-text mb-1">All Products</h1>
          <small className="text-muted">Browse our curated developer gear</small>
        </div>
        <div className="d-flex flex-wrap gap-2 filters-bar">
          <div className="input-group" style={{ maxWidth: 280 }}>
            <span className="input-group-text" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}>
              <i className="bi bi-search"></i>
            </span>
            <input
              className="form-control"
              placeholder="Search products..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
            />
          </div>
          <select
            className="form-select"
            value={category}
            onChange={e => setCategory(e.target.value)}
            style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
          >
            <option value="All">All Categories</option>
            {categoryList.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <select
            className="form-select"
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
          >
            {sortOptions.map(o => (
              <option key={o.key} value={o.key}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="products-grid">
        {filtered.map((product, index) => (
          <div key={product.id} className="product-card-wrapper">
            <div className="product-card card-entry" style={{ animationDelay: `${index * 0.05}s` }}>
              <div className="product-image-container">
                <LazyImage
                  src={product.image}
                  alt={product.title}
                  className="product-grid-image"
                />
                {product.badge && (
                  <span className="product-badge">
                    {product.badge}
                  </span>
                )}
                <button
                  className={`wishlist-toggle ${
                    isInWishlist(product.id) ? 'btn-danger' : 'btn-outline-danger'
                  } ${isHeartActive(product.id) ? 'wishlist-heart active' : ''}`}
                  onClick={(e) => handleToggleWishlist(product, e)}
                  title={isInWishlist(product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
                  aria-label={isInWishlist(product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                  <i className={`bi ${isInWishlist(product.id) ? 'bi-heart-fill' : 'bi-heart'}`}></i>
                </button>
              </div>
              <div className="card-body">
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <span className="badge bg-secondary">{product.category}</span>
                  <div className="rating">
                    {[...Array(5)].map((_, i) => (
                      <i key={i} className={`bi bi-star${i < Math.floor(product.rating || 0) ? '-fill' : ''}`}></i>
                    ))}
                  </div>
                </div>
                <h5 className="card-title">{product.title}</h5>
                <p className="card-text">{product.description.slice(0, 80)}{product.description.length > 80 ? '…' : ''}</p>
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <span className="gradient-text">${product.price}</span>
                  <small className="text-muted">Stock: {product.stock}</small>
                </div>
                <div className="d-grid">
                  <button 
                    className={`btn-add-to-cart ${isButtonLoading(`add-to-cart-${product.id}`) ? 'adding' : ''}`}
                    onClick={(e) => handleAddToCart(product, e)}
                    disabled={isButtonLoading(`add-to-cart-${product.id}`)}
                  >
                    {isButtonLoading(`add-to-cart-${product.id}`) ? (
                      <>
                        <div className="loading-spinner me-2"></div>
                        Adding...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-cart-plus me-2"></i>
                        Add to Cart
                      </>
                    )}
                  </button>
                  <Link to={`/product/${product.id}`} className="btn-outline-primary">
                    <i className="bi bi-eye me-2"></i>
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Hidden cart icon for animation target */}
      <div ref={cartIconRef} style={{ position: 'fixed', top: '20px', right: '20px', opacity: 0, pointerEvents: 'none' }}>
        <i className="bi bi-cart3" style={{ fontSize: '1.5rem' }}></i>
      </div>
    </div>
  );
});

Products.displayName = 'Products';

export default Products;


