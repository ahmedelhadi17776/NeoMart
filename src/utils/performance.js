// Performance utilities for FLUX app

/**
 * Debounce function for performance optimization
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @param {boolean} immediate - Execute immediately on first call
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait, immediate = false) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func(...args);
  };
};

/**
 * Throttle function for performance optimization
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} Throttled function
 */
export const throttle = (func, limit) => {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

/**
 * Check if element is in viewport for lazy loading
 * @param {Element} element - DOM element to check
 * @param {number} threshold - Intersection threshold (0-1)
 * @returns {boolean} Whether element is in viewport
 */
export const isInViewport = (element, threshold = 0.1) => {
  const rect = element.getBoundingClientRect();
  const windowHeight = window.innerHeight || document.documentElement.clientHeight;
  const windowWidth = window.innerWidth || document.documentElement.clientWidth;
  
  return (
    rect.top <= windowHeight * (1 + threshold) &&
    rect.bottom >= -windowHeight * threshold &&
    rect.left <= windowWidth * (1 + threshold) &&
    rect.right >= -windowWidth * threshold
  );
};

/**
 * Performance monitoring for React components
 * @param {string} componentName - Name of the component
 * @param {Function} renderFunction - Component render function
 * @returns {Function} Wrapped render function with performance monitoring
 */
export const withPerformanceMonitoring = (componentName, renderFunction) => {
  return (...args) => {
    const start = performance.now();
    const result = renderFunction(...args);
    const end = performance.now();
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`${componentName} render time: ${end - start}ms`);
    }
    
    return result;
  };
};

/**
 * Memory usage monitoring
 * @returns {Object} Memory usage information
 */
export const getMemoryUsage = () => {
  if (performance.memory) {
    return {
      used: Math.round(performance.memory.usedJSHeapSize / 1048576 * 100) / 100,
      total: Math.round(performance.memory.totalJSHeapSize / 1048576 * 100) / 100,
      limit: Math.round(performance.memory.jsHeapSizeLimit / 1048576 * 100) / 100
    };
  }
  return null;
};

/**
 * Optimize localStorage operations
 * @param {string} key - Storage key
 * @param {*} value - Value to store
 * @param {number} delay - Debounce delay in ms
 */
export const optimizedLocalStorage = (() => {
  const cache = new Map();
  const timeouts = new Map();
  
  return {
    setItem: (key, value, delay = 100) => {
      cache.set(key, value);
      
      if (timeouts.has(key)) {
        clearTimeout(timeouts.get(key));
      }
      
      timeouts.set(key, setTimeout(() => {
        try {
          localStorage.setItem(key, JSON.stringify(value));
          timeouts.delete(key);
        } catch (error) {
          console.warn('localStorage setItem failed:', error);
        }
      }, delay));
    },
    
    getItem: (key) => {
      if (cache.has(key)) {
        return cache.get(key);
      }
      
      try {
        const value = localStorage.getItem(key);
        const parsed = value ? JSON.parse(value) : null;
        cache.set(key, parsed);
        return parsed;
      } catch (error) {
        console.warn('localStorage getItem failed:', error);
        return null;
      }
    },
    
    removeItem: (key) => {
      cache.delete(key);
      if (timeouts.has(key)) {
        clearTimeout(timeouts.get(key));
        timeouts.delete(key);
      }
      try {
        localStorage.removeItem(key);
      } catch (error) {
        console.warn('localStorage removeItem failed:', error);
      }
    }
  };
})();

/**
 * Batch DOM updates for better performance
 * @param {Function} callback - Function containing DOM updates
 */
export const batchDOMUpdates = (callback) => {
  requestAnimationFrame(() => {
    callback();
  });
};

/**
 * Preload critical resources
 * @param {string} href - Resource URL
 * @param {string} as - Resource type (image, script, style, etc.)
 */
export const preloadResource = (href, as = 'image') => {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = href;
  link.as = as;
  document.head.appendChild(link);
};
