import React from 'react';
import { Link } from 'react-router-dom';
import { Cart3, Person, Sun, Moon } from 'react-bootstrap-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useCart } from '../hooks/useCart';

const Navbar = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { cartCount } = useCart();

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
              <Link className="nav-link" to="/wishlist">
                Wishlist
              </Link>
            </li>
          </ul>

          {/* Right side - Theme toggle, Cart preview and Auth links */}
          <ul className="navbar-nav">
            {/* Theme Toggle */}
            <li className="nav-item">
              <button 
                className="nav-link btn btn-link theme-toggle" 
                onClick={toggleTheme}
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

            {/* Login/Signup */}
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
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
