import React, { memo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Cart3, Person, Sun, Moon, Heart } from 'react-bootstrap-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useCart } from '../hooks/useCart';
import { useWishlist } from '../contexts/WishlistContext';
import { useAuth } from '../contexts/AuthContext';

const Navbar = memo(() => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const { user, isAdmin, isAuthenticated, logout } = useAuth();

  const handleThemeToggle = useCallback(() => {
    toggleTheme();
  }, [toggleTheme]);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark flux-navbar sticky-top">
      <div className="container">
        {/* Logo */}
        <Link className="navbar-brand fw-bold flux-logo" to="/">
          FLUX
        </Link>

        {/* Mobile toggle button */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navigation links */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/cart">
                Cart
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link position-relative" to="/wishlist">
                <Heart size={20} />
                {wishlistCount > 0 && (
                  <span 
                    className="position-absolute top-0 start-100 translate-middle badge rounded-pill pulse" 
                    style={{
                      background: 'var(--secondary)',
                      color: 'white',
                      fontSize: '0.75rem',
                      fontWeight: '700',
                      padding: '0.125rem 0.375rem'
                    }}
                  >
                    {wishlistCount}
                  </span>
                )}
              </Link>
            </li>
          </ul>

          {/* Right side - Theme toggle, Cart preview and Auth links */}
          <ul className="navbar-nav">
            {/* Theme Toggle */}
            <li className="nav-item">
              <button 
                className="nav-link btn btn-link theme-toggle" 
                onClick={handleThemeToggle}
                aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
                style={{
                  border: 'none',
                  background: 'transparent',
                  color: 'var(--navbar-text)',
                  padding: '0.5rem',
                  borderRadius: '50%',
                  transition: 'all 0.3s ease'
                }}
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </li>

            {/* Cart Preview */}
            <li className="nav-item">
              <Link className="nav-link position-relative" to="/cart">
                <Cart3 size={20} />
                {cartCount > 0 && ( // ✅ يظهر البادج فقط لو في عناصر
                  <span 
                    className="position-absolute top-0 start-100 translate-middle badge rounded-pill pulse" 
                    style={{
                      background: 'var(--secondary)',
                      color: 'white',
                      fontSize: '0.75rem',
                      fontWeight: '700',
                      padding: '0.125rem 0.375rem'
                    }}
                  >
                    {cartCount}
                  </span>
                )}
              </Link>
            </li>
            {/* User / Auth */}
            {isAuthenticated ? (
              <>
                {isAdmin && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/admin">Admin</Link>
                  </li>
                )}
                <li className="nav-item dropdown">
                  <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false" style={{ color: 'var(--navbar-text)' }}>
                    <Person size={20} className="me-1" />{user?.name || 'Account'}
                  </a>
                  <ul className="dropdown-menu dropdown-menu-end">
                    <li><span className="dropdown-item-text text-muted">{user?.email}</span></li>
                    <li><hr className="dropdown-divider" /></li>
                    <li>
                      <button className="dropdown-item" onClick={logout}>Logout</button>
                    </li>
                  </ul>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    <Person size={20} className="me-1" />
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link btn btn-primary text-white ms-2" to="/signup">
                    Sign Up
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
});

Navbar.displayName = 'Navbar';

export default Navbar;
