import React, { memo } from 'react';

const Skeleton = memo(({ 
  width = '100%', 
  height = '1rem', 
  className = '', 
  variant = 'text',
  animation = 'shimmer',
  ...props 
}) => {
  const getSkeletonStyle = () => {
    const baseStyle = {
      background: 'linear-gradient(90deg, var(--bg-secondary) 25%, var(--border-color) 37%, var(--bg-secondary) 63%)',
      backgroundSize: '400% 100%',
      animation: `${animation} 1.6s ease-in-out infinite`,
      borderRadius: '0.25rem',
      width,
      height,
      display: 'inline-block'
    };

    switch (variant) {
      case 'circular':
        return {
          ...baseStyle,
          borderRadius: '50%',
          width: height,
          height: height
        };
      case 'rectangular':
        return {
          ...baseStyle,
          borderRadius: '0.5rem'
        };
      case 'text':
      default:
        return baseStyle;
    }
  };

  return (
    <div
      className={`skeleton skeleton-${variant} ${className}`}
      style={getSkeletonStyle()}
      {...props}
    />
  );
});

// Pre-built skeleton components
export const SkeletonText = memo(({ lines = 1, className = '', ...props }) => (
  <div className={`skeleton-text ${className}`} {...props}>
    {Array.from({ length: lines }, (_, i) => (
      <Skeleton
        key={i}
        height="1rem"
        width={i === lines - 1 ? '75%' : '100%'}
        className="mb-2"
      />
    ))}
  </div>
));

export const SkeletonCard = memo(({ className = '', ...props }) => (
  <div className={`skeleton-card ${className}`} {...props}>
    <Skeleton variant="rectangular" height="200px" className="mb-3" />
    <div className="d-flex justify-content-between mb-2">
      <Skeleton width="30%" height="1rem" />
      <Skeleton width="20%" height="1rem" />
    </div>
    <Skeleton height="1.25rem" className="mb-2" />
    <SkeletonText lines={2} className="mb-3" />
    <div className="d-flex justify-content-between align-items-center">
      <Skeleton width="25%" height="1.5rem" />
      <Skeleton width="30%" height="2rem" />
    </div>
  </div>
));

export const SkeletonProductCard = memo(({ className = '', ...props }) => (
  <div className={`card skeleton-product-card h-100 ${className}`} {...props}>
    <Skeleton variant="rectangular" height="250px" className="card-img-top" />
    <div className="card-body d-flex flex-column">
      <div className="d-flex align-items-center justify-content-between mb-2">
        <Skeleton width="30%" height="1rem" />
        <div className="d-flex gap-1">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} width="12px" height="12px" variant="circular" />
          ))}
        </div>
      </div>
      <Skeleton height="1.25rem" className="mb-1" />
      <SkeletonText lines={2} className="mb-3" />
      <div className="d-flex align-items-center justify-content-between mb-3">
        <Skeleton width="25%" height="1.5rem" />
        <Skeleton width="20%" height="1rem" />
      </div>
      <div className="d-grid gap-2 mt-auto">
        <Skeleton height="2.5rem" />
        <Skeleton height="2.5rem" />
      </div>
    </div>
  </div>
));

export const SkeletonNavbar = memo(({ className = '', ...props }) => (
  <nav className={`navbar navbar-expand-lg skeleton-navbar ${className}`} {...props}>
    <div className="container">
      <Skeleton width="80px" height="2rem" className="me-4" />
      <div className="d-flex gap-3">
        <Skeleton width="60px" height="1.5rem" />
        <Skeleton width="60px" height="1.5rem" />
        <Skeleton width="60px" height="1.5rem" />
      </div>
      <div className="ms-auto d-flex gap-2">
        <Skeleton width="40px" height="40px" variant="circular" />
        <Skeleton width="40px" height="40px" variant="circular" />
      </div>
    </div>
  </nav>
));

export const SkeletonTable = memo(({ rows = 5, columns = 4, className = '', ...props }) => (
  <div className={`skeleton-table ${className}`} {...props}>
    <div className="table-responsive">
      <table className="table">
        <thead>
          <tr>
            {Array.from({ length: columns }, (_, i) => (
              <th key={i}>
                <Skeleton height="1.5rem" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }, (_, rowIndex) => (
            <tr key={rowIndex}>
              {Array.from({ length: columns }, (_, colIndex) => (
                <td key={colIndex}>
                  <Skeleton height="1rem" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
));

Skeleton.displayName = 'Skeleton';
SkeletonText.displayName = 'SkeletonText';
SkeletonCard.displayName = 'SkeletonCard';
SkeletonProductCard.displayName = 'SkeletonProductCard';
SkeletonNavbar.displayName = 'SkeletonNavbar';
SkeletonTable.displayName = 'SkeletonTable';

export default Skeleton;
