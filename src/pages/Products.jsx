import React, { useMemo, useState, useCallback, memo, useRef, useEffect } from 'react';
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
  const [showFilters, setShowFilters] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  
  // Micro-interaction hooks
  const { createFlyToCartAnimation } = useMicroInteractions();
  const { triggerHeartAnimation, isHeartActive } = useWishlistAnimation();
  const { setButtonLoading, isButtonLoading } = useButtonLoading();
  
  // Refs for cart animation target
  const cartIconRef = useRef(null);
  const searchInputRef = useRef(null);

  // Generate search suggestions
  useEffect(() => {
    if (query.trim().length > 1) {
      const suggestions = products
        .filter(p => 
          p.title.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 5)
        .map(p => ({
          id: p.id,
          title: p.title,
          category: p.category,
          type: p.title.toLowerCase().includes(query.toLowerCase()) ? 'title' : 'category'
        }));
      setSearchSuggestions(suggestions);
    } else {
      setSearchSuggestions([]);
    }
  }, [query]);

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

  // Search and filter handlers
  const handleSearchChange = useCallback((e) => {
    setQuery(e.target.value);
  }, []);

  const handleSuggestionClick = useCallback((suggestion) => {
    setQuery(suggestion.title);
    setSearchSuggestions([]);
    setIsSearchFocused(false);
  }, []);

  const handleClearSearch = useCallback(() => {
    setQuery('');
    setSearchSuggestions([]);
    searchInputRef.current?.focus();
  }, []);

  const handleClearFilters = useCallback(() => {
    setQuery('');
    setCategory('All');
    setSortBy('featured');
    setSearchSuggestions([]);
  }, []);

  const handleSearchFocus = useCallback(() => {
    setIsSearchFocused(true);
  }, []);

  const handleSearchBlur = useCallback(() => {
    // Delay hiding suggestions to allow clicks
    setTimeout(() => {
      setIsSearchFocused(false);
      setSearchSuggestions([]);
    }, 200);
  }, []);

  return (
    <div className="container py-4">
      {/* Enhanced Header Section */}
      <div className="products-header mb-5">
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
          <div>
            <h1 className="gradient-text mb-1">All Products</h1>
            <small className="text-muted">Browse our curated developer gear</small>
          </div>
          
          {/* Results Counter */}
          <div className="d-flex align-items-center gap-3">
            <div className="results-counter">
              <span className="badge bg-primary-gradient px-3 py-2">
                <i className="bi bi-grid-3x3-gap me-2"></i>
                {filtered.length} {filtered.length === 1 ? 'product' : 'products'}
              </span>
            </div>
            
            {/* Mobile Filter Toggle */}
            <button 
              className="btn btn-outline-primary d-lg-none"
              onClick={() => setShowFilters(!showFilters)}
            >
              <i className="bi bi-funnel me-2"></i>
              Filters
            </button>
          </div>
        </div>

        {/* Modern Search and Filter Bar */}
        <div className={`enhanced-filters-bar ${showFilters ? 'show' : ''}`}>
          <div className="search-filter-container">
            {/* Search Section */}
            <div className="search-container">
              <label className="search-label">
                <i className="bi bi-search"></i>
                Search
              </label>
              <div className="search-input-group">
                <input
                  ref={searchInputRef}
                  className="search-input"
                  placeholder="Search products..."
                  value={query}
                  onChange={handleSearchChange}
                  onFocus={handleSearchFocus}
                  onBlur={handleSearchBlur}
                />
                {query && (
                  <button 
                    className="clear-search-btn"
                    onClick={handleClearSearch}
                    type="button"
                    title="Clear search"
                  >
                    <i className="bi bi-x"></i>
                  </button>
                )}
              </div>
              
              {/* Search Suggestions Dropdown */}
              {searchSuggestions.length > 0 && isSearchFocused && (
                <div className="search-suggestions">
                  {searchSuggestions.map((suggestion) => (
                    <div 
                      key={suggestion.id}
                      className="suggestion-item"
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      <div className="d-flex align-items-center">
                        <i className={`bi bi-${suggestion.type === 'title' ? 'tag' : 'folder'} me-2`}></i>
                        <div>
                          <div className="suggestion-title">{suggestion.title}</div>
                          <small className="text-muted">{suggestion.category}</small>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Category Filter */}
            <div className="filter-group">
              <label className="filter-label">
                <i className="bi bi-grid"></i>
                Category
              </label>
              <select
                className="filter-select"
                value={category}
                onChange={e => setCategory(e.target.value)}
              >
                <option value="All">All Categories</option>
                {categoryList.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Sort Filter */}
            <div className="filter-group">
              <label className="filter-label">
                <i className="bi bi-sort-down"></i>
                Sort By
              </label>
              <select
                className="filter-select"
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
              >
                {sortOptions.map(o => (
                  <option key={o.key} value={o.key}>{o.label}</option>
                ))}
              </select>
            </div>

            {/* Clear Filters */}
            <div className="filter-group">
              <label className="filter-label">&nbsp;</label>
              <button 
                className="clear-filters-btn"
                onClick={handleClearFilters}
              >
                <i className="bi bi-arrow-clockwise"></i>
                Clear
              </button>
            </div>
          </div>

          {/* Active Filters Display */}
          {(query || category !== 'All' || sortBy !== 'featured') && (
            <div className="active-filters mt-3">
              <div className="d-flex align-items-center gap-2 flex-wrap">
                <span className="text-muted small">Active filters:</span>
                {query && (
                  <span className="badge bg-primary">
                    Search: "{query}"
                    <button 
                      className="btn-close btn-close-white ms-2"
                      onClick={() => setQuery('')}
                    ></button>
                  </span>
                )}
                {category !== 'All' && (
                  <span className="badge bg-secondary">
                    Category: {category}
                    <button 
                      className="btn-close btn-close-white ms-2"
                      onClick={() => setCategory('All')}
                    ></button>
                  </span>
                )}
                {sortBy !== 'featured' && (
                  <span className="badge bg-info">
                    Sort: {sortOptions.find(o => o.key === sortBy)?.label}
                    <button 
                      className="btn-close btn-close-white ms-2"
                      onClick={() => setSortBy('featured')}
                    ></button>
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Products Grid */}
      {filtered.length > 0 ? (
        <div className="products-grid">
          {filtered.map((product) => (
            <div key={product.id} className="product-card-wrapper">
              <div className="product-card card-entry">
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
                    <span className="gradient-text fw-bold fs-5">${product.price}</span>
                    <small className="text-muted">Stock: {product.stock}</small>
                  </div>
                  <div className="d-grid gap-2">
                    <button
                      className={`btn btn-primary btn-add-to-cart ${isButtonLoading(`add-to-cart-${product.id}`) ? 'adding' : ''}`}
                      onClick={(e) => handleAddToCart(product, e)}
                      disabled={isButtonLoading(`add-to-cart-${product.id}`)}
                    >
                      {isButtonLoading(`add-to-cart-${product.id}`) ? (
                        <>
                          <span className="loading-spinner me-2"></span>
                          Adding...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-cart-plus me-2"></i>
                          Add to Cart
                        </>
                      )}
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
      ) : (
        /* No Results State */
        <div className="no-results-container">
          <div className="row justify-content-center">
            <div className="col-lg-6">
              <div className="card glass-card p-5 text-center">
                <div className="no-results-icon mb-4">
                  <i className="bi bi-search display-1 text-muted"></i>
                </div>
                <h3 className="gradient-text mb-3">No products found</h3>
                <p className="text-muted mb-4 fs-5">
                  We couldn't find any products matching your search criteria. 
                  Try adjusting your filters or search terms.
                </p>
                <div className="d-flex gap-3 justify-content-center flex-wrap">
                  <button 
                    className="btn btn-primary"
                    onClick={handleClearFilters}
                  >
                    <i className="bi bi-arrow-clockwise me-2"></i>
                    Clear All Filters
                  </button>
                  <Link to="/" className="btn btn-outline-primary">
                    <i className="bi bi-house me-2"></i>
                    Browse All Products
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Hidden cart icon for animation target */}
      <div ref={cartIconRef} className="cart-animation-target">
        <i className="bi bi-cart3"></i>
      </div>
    </div>
  );
});

Products.displayName = 'Products';

export default Products;


