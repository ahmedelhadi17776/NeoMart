import React, { memo, useCallback } from "react";
import { useCart } from "../hooks/useCart";
import LazyImage from "./LazyImage";
import { useSwipeToDelete } from "../hooks/useTouchGestures";

const CartItem = memo(({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  const handleDecreaseQuantity = useCallback(() => {
    updateQuantity(item.id, item.quantity - 1);
  }, [updateQuantity, item.id, item.quantity]);

  const handleIncreaseQuantity = useCallback(() => {
    updateQuantity(item.id, item.quantity + 1);
  }, [updateQuantity, item.id, item.quantity]);

  const handleRemove = useCallback(() => {
    removeFromCart(item.id);
  }, [removeFromCart, item.id]);

  // Swipe-to-delete functionality
  const {
    touchHandlers,
    mouseHandlers,
    isSwiping,
    swipeProgress,
    showDelete,
    isDeleting,
    swipeDirection,
    elementRef,
    handleDeleteClick
  } = useSwipeToDelete(handleRemove, {
    threshold: 80,
    deleteThreshold: 120,
    showDeleteButton: true
  });

  return (
    <div 
      ref={elementRef}
      className={`cart-item-card mb-3 card-entry ${isSwiping ? 'swiping' : ''} ${isDeleting ? 'deleting' : ''}`}
      style={{
        transform: swipeDirection === 'left' ? `translateX(-${swipeProgress}px)` : 'translateX(0)',
        transition: isSwiping ? 'none' : 'transform 0.3s ease-out',
        position: 'relative',
        overflow: 'hidden'
      }}
      {...touchHandlers}
      {...mouseHandlers}
    >
      {/* Delete button overlay */}
      {showDelete && (
        <div 
          className="delete-overlay"
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            width: '100px',
            background: 'linear-gradient(90deg, transparent 0%, var(--error) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2,
            opacity: Math.min(swipeProgress / 100, 1)
          }}
        >
          <button
            className="btn btn-danger btn-sm"
            onClick={handleDeleteClick}
            style={{
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <i className="bi bi-trash"></i>
          </button>
        </div>
      )}

      {/* Swipe indicator */}
      {isSwiping && swipeDirection === 'left' && (
        <div 
          className="swipe-indicator"
          style={{
            position: 'absolute',
            top: '50%',
            right: '20px',
            transform: 'translateY(-50%)',
            color: 'var(--error)',
            fontSize: '1.5rem',
            opacity: Math.min(swipeProgress / 80, 1),
            zIndex: 3
          }}
        >
          <i className="bi bi-arrow-left"></i>
        </div>
      )}

      <div className="card-body d-flex align-items-center p-4">
        <div className="product-image-container me-3">
          <LazyImage
            src={item.image}
            alt={item.title}
            className="product-image"
          />
        </div>
        
        <div className="flex-grow-1">
          <h6 className="mb-1 fw-bold" style={{ color: "var(--text-primary)" }}>
            {item.title}
          </h6>
          <div className="d-flex align-items-center gap-3 mb-2">
            <span className="gradient-text fw-bold fs-5">${item.price.toFixed(2)}</span>
            <span className="text-muted small">each</span>
          </div>
          <div className="d-flex align-items-center gap-2">
            <span className="badge bg-secondary small">Stock: {item.stock ?? "∞"}</span>
            <span className="text-muted small">
              Subtotal: <strong className="gradient-text">${(item.price * item.quantity).toFixed(2)}</strong>
            </span>
          </div>
        </div>

        <div className="cart-controls d-flex flex-column align-items-center gap-3">
          <div className="quantity-controls">
            <div className="btn-group" role="group">
              <button
                className="btn btn-outline-secondary btn-sm"
                onClick={handleDecreaseQuantity}
                disabled={item.quantity <= 1}
              >
                <i className="bi bi-dash"></i>
              </button>
              <span 
                className="btn btn-light btn-sm px-3" 
                style={{ 
                  background: "var(--bg-secondary)", 
                  color: "var(--text-primary)",
                  border: "1px solid var(--border-color)",
                  minWidth: "50px"
                }}
              >
                {item.quantity}
              </span>
              <button
                className="btn btn-outline-secondary btn-sm"
                onClick={handleIncreaseQuantity}
                disabled={item.quantity >= (item.stock || Infinity)}
              >
                <i className="bi bi-plus"></i>
              </button>
            </div>
          </div>
          
          <button
            className="btn btn-outline-danger btn-sm"
            onClick={handleRemove}
            title="Remove from cart"
          >
            <i className="bi bi-trash me-1"></i>
            Remove
          </button>
        </div>
      </div>
    </div>
  );
});

CartItem.displayName = 'CartItem';

export default CartItem;
