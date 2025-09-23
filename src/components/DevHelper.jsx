import React, { useState } from 'react';
import { addSampleCartItems, addSampleWishlistItems, clearAllData } from '../utils/sampleData';

const DevHelper = () => {
  const [isOpen, setIsOpen] = useState(false);

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
        onClick={() => setIsOpen(!isOpen)}
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
                onClick={() => {
                  addSampleCartItems();
                  window.location.reload();
                }}
              >
                Add Sample Cart Items
              </button>
              <button
                className="btn btn-outline-primary btn-sm"
                onClick={() => {
                  addSampleWishlistItems();
                  window.location.reload();
                }}
              >
                Add Sample Wishlist
              </button>
              <button
                className="btn btn-outline-danger btn-sm"
                onClick={() => {
                  clearAllData();
                  window.location.reload();
                }}
              >
                Clear All Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DevHelper;
