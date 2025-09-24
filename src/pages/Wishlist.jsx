import React, { memo, useCallback } from "react";
import { Link } from "react-router-dom";
import { useWishlist } from "../contexts/WishlistContext";
import { useCart } from "../hooks/useCart";
import LazyImage from "../components/LazyImage";

const Wishlist = memo(() => {
    const { wishlist, removeFromWishlist, clearWishlist, wishlistCount } = useWishlist();
    const { addToCart } = useCart();

    const handleRemoveFromWishlist = useCallback((id) => {
        removeFromWishlist(id);
    }, [removeFromWishlist]);

    const handleClearWishlist = useCallback(() => {
        clearWishlist();
    }, [clearWishlist]);

    const handleAddToCart = useCallback((product) => {
        addToCart(product);
    }, [addToCart]);

    if (wishlist.length === 0) {
        return (
            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-lg-6">
                        <div className="card glass-card p-5 card-entry text-center">
                            <div className="mb-4">
                                <div className="empty-wishlist-icon mb-3">
                                    ❤️
                                </div>
                                <h2 className="gradient-text mb-3">Your wishlist is empty</h2>
                                <p className="text-muted mb-4 fs-5">
                                    Save items you love to your wishlist and they'll appear here.
                                    <br />
                                    Start exploring our amazing products!
                                </p>
                            </div>
                            <div className="d-flex gap-3 justify-content-center">
                                <Link to="/" className="btn btn-primary btn-lg">
                                    <i className="bi bi-house me-2"></i>
                                    Start Shopping
                                </Link>
                                <Link to="/cart" className="btn btn-outline-primary btn-lg">
                                    <i className="bi bi-cart me-2"></i>
                                    View Cart
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h1 className="gradient-text mb-0">My Wishlist</h1>
                    <p className="text-muted mb-0">
                        {wishlistCount} {wishlistCount === 1 ? 'item' : 'items'} saved
                    </p>
                </div>
                <div className="d-flex align-items-center gap-3">
                    <span className="badge bg-primary fs-6 px-3 py-2">
                        {wishlistCount} {wishlistCount === 1 ? 'item' : 'items'}
                    </span>
                    <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={handleClearWishlist}
                    >
                        <i className="bi bi-trash me-1"></i>
                        Clear All
                    </button>
                </div>
            </div>

            <div className="row g-4">
                {wishlist.map((product, index) => (
                    <div key={product.id} className="col-lg-4 col-md-6">
                        <div className="card wishlist-card h-100 card-entry" style={{ animationDelay: `${index * 0.1}s` }}>
                            <div className="wishlist-image-container position-relative">
                                <LazyImage
                                    src={product.image}
                                    alt={product.title}
                                    className="card-img-top wishlist-image"
                                />
                                {product.badge && (
                                    <span className="badge product-badge bg-primary position-absolute top-0 end-0 m-2">
                                        {product.badge}
                                    </span>
                                )}
                                <button
                                    className="btn btn-sm wishlist-remove-btn position-absolute top-0 start-0 m-2"
                                    onClick={() => handleRemoveFromWishlist(product.id)}
                                    title="Remove from wishlist"
                                >
                                    <i className="bi bi-heart-fill"></i>
                                </button>
                            </div>
                            
                            <div className="card-body d-flex flex-column">
                                <div className="mb-2">
                                    <span className="badge bg-secondary small">{product.category}</span>
                                </div>
                                
                                <h5 className="card-title mb-2">{product.title}</h5>
                                
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
                                        <small className="text-muted">({product.reviews})</small>
                                    </div>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <span className="gradient-text fw-bold fs-5">${product.price}</span>
                                        <small className="text-muted">Stock: {product.stock}</small>
                                    </div>
                                </div>
                                
                                <div className="d-grid gap-2 mt-auto">
                                    <button
                                        className="btn btn-primary"
                                        onClick={() => handleAddToCart(product)}
                                    >
                                        <i className="bi bi-cart-plus me-2"></i>
                                        Add to Cart
                                    </button>
                                    <Link
                                        to={`/product/${product.id}`}
                                        className="btn btn-outline-primary"
                                    >
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

Wishlist.displayName = 'Wishlist';

export default Wishlist;
