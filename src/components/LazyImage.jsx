import React, { useState, useEffect, memo, useRef, useCallback } from 'react';

const LazyImage = memo(({ 
  src, 
  alt, 
  className = '', 
  placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PC9zdmc+',
  lowResSrc,
  ...props 
}) => {
  const [currentSrc, setCurrentSrc] = useState(lowResSrc || placeholder);
  const [imageRef, setImageRef] = useState();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const observerRef = useRef();

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (imageRef && !isInView) {
      observerRef.current = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              setIsInView(true);
              observerRef.current?.unobserve(imageRef);
            }
          });
        },
        {
          rootMargin: '50px', // Start loading 50px before the image comes into view
          threshold: 0.1
        }
      );
      observerRef.current.observe(imageRef);
    }
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [imageRef, isInView]);

  // Progressive loading with blur-up effect
  useEffect(() => {
    if (isInView && !isLoaded) {
      setIsLoading(true);
      setHasError(false);
      
      const img = new Image();
      
      img.onload = () => {
        setCurrentSrc(src);
        setIsLoaded(true);
        setIsLoading(false);
      };
      
      img.onerror = () => {
        setHasError(true);
        setIsLoading(false);
        // Keep the placeholder on error
        setCurrentSrc(placeholder);
      };
      
      img.src = src;
    }
  }, [isInView, src, placeholder]);

  // Handle retry on error
  const handleRetry = useCallback(() => {
    if (hasError) {
      setHasError(false);
      setIsInView(false);
      // Reset observer
      if (imageRef) {
        setIsInView(true);
      }
    }
  }, [hasError, imageRef]);

  return (
    <div className="lazy-image-container" style={{ position: 'relative', overflow: 'hidden' }}>
      <img
        ref={setImageRef}
        src={currentSrc}
        alt={alt}
        className={`${className} ${isLoading ? 'loading-image' : 'loaded-image'} ${hasError ? 'error-image' : ''}`}
        style={{
          transition: 'all 0.3s ease-in-out',
          filter: isLoading ? 'blur(5px)' : 'blur(0px)',
          transform: isLoading ? 'scale(1.05)' : 'scale(1)',
          opacity: isLoading ? 0.7 : 1
        }}
        {...props}
      />
      
      {/* Skeleton loader */}
      {isLoading && (
        <div 
          className="skeleton-loader"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(90deg, var(--bg-secondary) 25%, var(--border-color) 37%, var(--bg-secondary) 63%)',
            backgroundSize: '400% 100%',
            animation: 'shimmer 1.6s ease-in-out infinite',
            borderRadius: 'inherit'
          }}
        />
      )}
      
      {/* Error state */}
      {hasError && (
        <div 
          className="error-overlay"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'var(--bg-secondary)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-muted)',
            fontSize: '0.875rem',
            borderRadius: 'inherit'
          }}
        >
          <i className="bi bi-image" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}></i>
          <span>Failed to load</span>
          <button 
            onClick={handleRetry}
            className="btn btn-sm btn-outline-primary mt-2"
            style={{ fontSize: '0.75rem' }}
          >
            Retry
          </button>
        </div>
      )}
    </div>
  );
});

LazyImage.displayName = 'LazyImage';

export default LazyImage;
