import React, { useState, useCallback, memo } from 'react';
import { addSampleCartItems, addSampleWishlistItems, clearAllData } from '../utils/sampleData';

const DevHelper = memo(() => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  const handleAddSampleCart = useCallback(() => {
    addSampleCartItems();
    window.location.reload();
  }, []);

  const handleAddSampleWishlist = useCallback(() => {
    addSampleWishlistItems();
    window.location.reload();
  }, []);

  const handleClearData = useCallback(() => {
    clearAllData();
    window.location.reload();
  }, []);

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="dev-helper">
      <button
        className="btn btn-outline-secondary btn-sm position-fixed"
        style={{
          bottom: '20px',
          right: '20px',
          zIndex: 1000,
          borderRadius: '50%',
          width: '50px',
          height: '50px',
          fontSize: '1.2rem'
        }}
        onClick={handleToggle}
        title="Development Helper"
      >
        🛠️
      </button>

      {isOpen && (
        <div
          className="card position-fixed"
          style={{
            bottom: '80px',
            right: '20px',
            width: '250px',
            zIndex: 1000,
            background: 'var(--card-bg)',
            border: '1px solid var(--border-color)'
          }}
        >
          <div className="card-body p-3">
            <h6 className="card-title mb-3">Dev Helper</h6>
            <div className="d-grid gap-2">
              <button
                className="btn btn-primary btn-sm"
                onClick={handleAddSampleCart}
              >
                Add Sample Cart Items
              </button>
              <button
                className="btn btn-outline-primary btn-sm"
                onClick={handleAddSampleWishlist}
              >
                Add Sample Wishlist
              </button>
              <button
                className="btn btn-outline-danger btn-sm"
                onClick={handleClearData}
              >
                Clear All Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

DevHelper.displayName = 'DevHelper';

export default DevHelper;
