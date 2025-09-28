import React, { useState, useEffect, useCallback, memo, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useWishlist } from '../contexts/WishlistContext';
import products from '../data/products.json';
import LazyImage from '../components/LazyImage';

const Home = memo(() => {
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const [currentFeature, setCurrentFeature] = useState(0);
  const intervalRef = useRef(null);

  // Auto-rotate features with proper cleanup
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCurrentFeature(prev => (prev + 1) % 3);
    }, 4000);
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  const handleFeatureClick = useCallback((index) => {
    setCurrentFeature(index);
  }, []);

  const features = [
    {
      icon: '🚀',
      title: 'Lightning Fast',
      description: 'Experience blazing-fast performance with our optimized platform'
    },
    {
      icon: '🎨',
      title: 'Modern Design',
      description: 'Beautiful, intuitive interface designed for the future'
    },
    {
      icon: '🔒',
      title: 'Secure & Safe',
      description: 'Your data and transactions are protected with enterprise-grade security'
    }
  ];

  const stats = [
    { number: '10K+', label: 'Happy Customers' },
    { number: '99.9%', label: 'Uptime' },
    { number: '24/7', label: 'Support' },
    { number: '5★', label: 'Rating' }
  ];
  // Featured products (top rated)
  const featuredProducts = useMemo(() => {
    return [...products]
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 4);
  }, []);
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="row align-items-center min-vh-100">
            <div className="col-lg-6">
              <div className="hero-content">
                <div className="hero-badge mb-4">
                  <span className="badge bg-primary-gradient px-3 py-2">
                    <i className="bi bi-star-fill me-2"></i>
                    #1 Developer Marketplace
                  </span>
                </div>
                
                <h1 className="hero-title mb-4">
                  Welcome to <span className="gradient-text">FLUX</span>
                </h1>
                
                <p className="hero-subtitle mb-4">
                  Experience the future of modern shopping with our cutting-edge platform. 
                  Built by developers, for developers.
                </p>
                
                <div className="hero-actions mb-5">
                  <Link to="/cart" className="btn btn-primary btn-lg me-3">
                    <i className="bi bi-cart-plus me-2"></i>
                    Start Shopping
                  </Link>
                  <Link to="/wishlist" className="btn btn-outline-primary btn-lg">
                    <i className="bi bi-heart me-2"></i>
                    View Wishlist
                  </Link>
                </div>

                {/* Quick Stats */}
                <div className="hero-stats">
                  <div className="row g-3">
                    {stats.map((stat, index) => (
                      <div key={index} className="col-3">
                        <div className="stat-item text-center">
                          <div className="stat-number gradient-text fw-bold">{stat.number}</div>
                          <div className="stat-label text-muted small">{stat.label}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col-lg-6">
              <div className="hero-visual">
                {/* Floating Particles */}
                <div className="hero-particles">
                  <div className="particle particle-1"></div>
                  <div className="particle particle-2"></div>
                  <div className="particle particle-3"></div>
                  <div className="particle particle-4"></div>
                  <div className="particle particle-5"></div>
                </div>
                
                <div className="floating-elements">
                  <div className="floating-card card-1">
                    <i className="bi bi-lightning-charge"></i>
                  </div>
                  <div className="floating-card card-2">
                    <i className="bi bi-shield-check"></i>
                  </div>
                  <div className="floating-card card-3">
                    <i className="bi bi-heart-fill"></i>
                  </div>
                  <div className="floating-card card-4">
                    <i className="bi bi-cart-fill"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-5">
        <div className="container">
          <div className="d-flex align-items-end justify-content-between mb-4">
            <div>
              <h2 className="section-title gradient-text mb-1">Featured Products</h2>
              <p className="section-subtitle text-muted mb-0">Handpicked bestsellers loved by developers</p>
            </div>
            <Link to="/products" className="btn btn-outline-primary">
              View All
            </Link>
          </div>
          <div className="products-grid">
            {featuredProducts.map((product) => (
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
                    <div className="d-flex align-items-center justify-content-between">
                      <span className="gradient-text fw-bold fs-5">${product.price}</span>
                      <Link to={`/product/${product.id}`} className="btn btn-primary btn-sm">
                        <i className="bi bi-eye me-1"></i>
                        View
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section py-5">
        <div className="container">
          <div className="row justify-content-center mb-5">
            <div className="col-lg-8 text-center">
              <h2 className="section-title gradient-text mb-3">Why Choose FLUX?</h2>
              <p className="section-subtitle text-muted">
                Discover the features that make FLUX the perfect choice for modern developers
              </p>
            </div>
          </div>

          <div className="row g-4">
            {features.map((feature, index) => (
              <div key={index} className="col-lg-4 col-md-6">
                <div 
                  className={`feature-card card glass-card p-4 h-100 text-center ${
                    currentFeature === index ? 'active' : ''
                  }`}
                  onClick={() => handleFeatureClick(index)}
                >
                  <div className="feature-icon mb-3">
                    <span className="display-1">{feature.icon}</span>
                  </div>
                  <h5 className="feature-title mb-3">{feature.title}</h5>
                  <p className="feature-description text-muted">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section className="demo-section py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <div className="demo-content">
                <h2 className="section-title gradient-text mb-4">Interactive Experience</h2>
                <p className="section-subtitle text-muted mb-4">
                  Try our interactive features and see how FLUX makes shopping effortless
                </p>
                
                <div className="demo-features">
                  <div className="demo-feature mb-3">
                    <i className="bi bi-check-circle-fill text-success me-3"></i>
                    <span>Real-time cart updates</span>
                  </div>
                  <div className="demo-feature mb-3">
                    <i className="bi bi-check-circle-fill text-success me-3"></i>
                    <span>Instant wishlist management</span>
                  </div>
                  <div className="demo-feature mb-3">
                    <i className="bi bi-check-circle-fill text-success me-3"></i>
                    <span>Seamless checkout process</span>
                  </div>
                  <div className="demo-feature mb-3">
                    <i className="bi bi-check-circle-fill text-success me-3"></i>
                    <span>Dark/Light mode toggle</span>
                  </div>
                </div>

                <div className="demo-actions mt-4">
                  <Link to="/cart" className="btn btn-primary me-3">
                    <i className="bi bi-cart me-2"></i>
                    Try Cart ({cartCount} items)
                  </Link>
                  <Link to="/wishlist" className="btn btn-outline-primary">
                    <i className="bi bi-heart me-2"></i>
                    Try Wishlist ({wishlistCount} items)
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="col-lg-6">
              <div className="demo-visual">
                <div className="demo-cards">
                  <div className="demo-card card-1">
                    <div className="card-header">
                      <i className="bi bi-cart-fill"></i>
                      <span>Cart</span>
                    </div>
                    <div className="card-body">
                      <div className="demo-item">
                        <div className="item-dot"></div>
                        <span>React Pro T-Shirt</span>
                      </div>
                      <div className="demo-item">
                        <div className="item-dot"></div>
                        <span>JavaScript Mug</span>
                      </div>
                      <div className="demo-item">
                        <div className="item-dot"></div>
                        <span>TypeScript Keyboard</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="demo-card card-2">
                    <div className="card-header">
                      <i className="bi bi-heart-fill"></i>
                      <span>Wishlist</span>
                    </div>
                    <div className="card-body">
                      <div className="demo-item">
                        <div className="item-dot"></div>
                        <span>CSS Ninja Stickers</span>
                      </div>
                      <div className="demo-item">
                        <div className="item-dot"></div>
                        <span>Python Notebook</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Coming Soon Section */}
      <section className="coming-soon-section py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8 text-center">
              <div className="coming-soon-card card glass-card p-5">
                <div className="coming-soon-icon mb-4">
                  <i className="bi bi-rocket-takeoff display-1 gradient-text"></i>
                </div>
                
                <h2 className="coming-soon-title gradient-text mb-3">
                  Products Coming Soon
                </h2>
                
                <p className="coming-soon-description text-muted mb-4">
                  We're working hard to bring you an amazing collection of developer-focused products. 
                  Stay tuned for the launch!
                </p>
                
                <div className="coming-soon-features mb-4">
                  <div className="row g-3">
                    <div className="col-md-4">
                      <div className="feature-preview">
                        <i className="bi bi-search display-6 text-primary mb-2"></i>
                        <h6>Smart Search</h6>
                        <small className="text-muted">Find exactly what you need</small>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="feature-preview">
                        <i className="bi bi-funnel display-6 text-success mb-2"></i>
                        <h6>Advanced Filters</h6>
                        <small className="text-muted">Narrow down your choices</small>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="feature-preview">
                        <i className="bi bi-star-fill display-6 text-warning mb-2"></i>
                        <h6>Reviews & Ratings</h6>
                        <small className="text-muted">Make informed decisions</small>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="coming-soon-actions">
                  <Link to="/wishlist" className="btn btn-primary btn-lg me-3">
                    <i className="bi bi-heart me-2"></i>
                    Get Notified
                  </Link>
                  <Link to="/cart" className="btn btn-outline-primary btn-lg">
                    <i className="bi bi-cart me-2"></i>
                    Explore Cart
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="newsletter-section py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-6 text-center">
              <div className="newsletter-card card glass-card p-4">
                <h3 className="newsletter-title gradient-text mb-3">
                  Stay Updated
                </h3>
                <p className="newsletter-description text-muted mb-4">
                  Get notified when we launch new products and features
                </p>
                
                <div className="newsletter-form">
                  <div className="input-group">
                    <input 
                      type="email" 
                      className="form-control" 
                      placeholder="Enter your email"
                      style={{ 
                        background: "var(--bg-secondary)", 
                        border: "1px solid var(--border-color)",
                        color: "var(--text-primary)"
                      }}
                    />
                    <button className="btn btn-primary" type="button">
                      Subscribe
                    </button>
                  </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </section>
    </div>
  );
});

Home.displayName = 'Home';

export default Home;
