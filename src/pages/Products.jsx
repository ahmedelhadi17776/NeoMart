import React, { useMemo, useState, useCallback, memo } from 'react';
import products from '../data/products.json';
import { Link } from 'react-router-dom';
import LazyImage from '../components/LazyImage';
import { useCart } from '../hooks/useCart';
import { useWishlist } from '../contexts/WishlistContext';

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

  const handleAddToCart = useCallback((product) => {
    addToCart(product, 1);
  }, [addToCart]);

  const handleToggleWishlist = useCallback((product) => {
    toggleWishlist(product);
  }, [toggleWishlist]);

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

      <div className="row g-4 products-grid">
        {filtered.map((product, index) => (
          <div key={product.id} className="col-xl-3 col-lg-4 col-md-6">
            <div className="card product-card h-100 card-entry" style={{ animationDelay: `${index * 0.05}s` }}>
              <div className="product-image-container position-relative">
                <LazyImage
                  src={product.image}
                  alt={product.title}
                  className="card-img-top product-grid-image"
                />
                {product.badge && (
                  <span className="badge product-badge bg-primary position-absolute top-0 end-0 m-2">
                    {product.badge}
                  </span>
                )}
                <button
                  className={`btn btn-sm wishlist-toggle position-absolute top-0 start-0 m-2 ${isInWishlist(product.id) ? 'btn-danger' : 'btn-outline-danger'}`}
                  onClick={() => handleToggleWishlist(product)}
                  title={isInWishlist(product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                  <i className={`bi ${isInWishlist(product.id) ? 'bi-heart-fill' : 'bi-heart'}`}></i>
                </button>
              </div>
              <div className="card-body d-flex flex-column">
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <span className="badge bg-secondary small">{product.category}</span>
                  <div className="rating">
                    {[...Array(5)].map((_, i) => (
                      <i key={i} className={`bi bi-star${i < Math.floor(product.rating || 0) ? '-fill' : ''}`} style={{ color: '#ffc107' }}></i>
                    ))}
                  </div>
                </div>
                <h5 className="card-title mb-1">{product.title}</h5>
                <p className="card-text text-muted mb-3" style={{ minHeight: 48 }}>{product.description.slice(0, 80)}{product.description.length > 80 ? '…' : ''}</p>
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <span className="gradient-text fw-bold fs-5">${product.price}</span>
                  <small className="text-muted">Stock: {product.stock}</small>
                </div>
                <div className="d-grid gap-2 mt-auto">
                  <button className="btn btn-primary" onClick={() => handleAddToCart(product)}>
                    <i className="bi bi-cart-plus me-2"></i>
                    Add to Cart
                  </button>
                  <Link to={`/product/${product.id}`} className="btn btn-outline-primary">
                    <i className="bi bi-eye me-2"></i>
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

Products.displayName = 'Products';

export default Products;


