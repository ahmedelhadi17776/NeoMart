import { useState, useCallback, useRef } from 'react';

// Custom hook for micro-interactions
export const useMicroInteractions = () => {
  const [isAnimating, setIsAnimating] = useState(false);
  const animationTimeoutRef = useRef(null);

  const triggerAnimation = useCallback((duration = 600) => {
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
    }
    
    setIsAnimating(true);
    animationTimeoutRef.current = setTimeout(() => {
      setIsAnimating(false);
    }, duration);
  }, []);

  const createFlyToCartAnimation = useCallback((element, targetElement) => {
    if (!element || !targetElement) return;

    const elementRect = element.getBoundingClientRect();
    const targetRect = targetElement.getBoundingClientRect();
    
    const flyX = targetRect.left - elementRect.left;
    const flyY = targetRect.top - elementRect.top;

    // Create flying element
    const flyingElement = element.cloneNode(true);
    flyingElement.style.position = 'fixed';
    flyingElement.style.left = elementRect.left + 'px';
    flyingElement.style.top = elementRect.top + 'px';
    flyingElement.style.width = elementRect.width + 'px';
    flyingElement.style.height = elementRect.height + 'px';
    flyingElement.style.zIndex = '9999';
    flyingElement.style.pointerEvents = 'none';
    flyingElement.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    flyingElement.classList.add('fly-to-cart');

    document.body.appendChild(flyingElement);

    // Trigger animation
    requestAnimationFrame(() => {
      flyingElement.style.setProperty('--fly-x', flyX + 'px');
      flyingElement.style.setProperty('--fly-y', flyY + 'px');
      flyingElement.style.transform = `translate(${flyX}px, ${flyY}px) scale(0.3)`;
      flyingElement.style.opacity = '0';
    });

    // Clean up
    setTimeout(() => {
      if (flyingElement.parentNode) {
        flyingElement.parentNode.removeChild(flyingElement);
      }
    }, 800);
  }, []);

  return {
    isAnimating,
    triggerAnimation,
    createFlyToCartAnimation
  };
};

// Hook for wishlist heart animation
export const useWishlistAnimation = () => {
  const [activeHearts, setActiveHearts] = useState(new Set());

  const triggerHeartAnimation = useCallback((productId) => {
    setActiveHearts(prev => new Set([...prev, productId]));
    
    setTimeout(() => {
      setActiveHearts(prev => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }, 800);
  }, []);

  const isHeartActive = useCallback((productId) => {
    return activeHearts.has(productId);
  }, [activeHearts]);

  return {
    triggerHeartAnimation,
    isHeartActive
  };
};

// Hook for button loading states
export const useButtonLoading = () => {
  const [loadingButtons, setLoadingButtons] = useState(new Set());

  const setButtonLoading = useCallback((buttonId, isLoading) => {
    setLoadingButtons(prev => {
      const newSet = new Set(prev);
      if (isLoading) {
        newSet.add(buttonId);
      } else {
        newSet.delete(buttonId);
      }
      return newSet;
    });
  }, []);

  const isButtonLoading = useCallback((buttonId) => {
    return loadingButtons.has(buttonId);
  }, [loadingButtons]);

  return {
    setButtonLoading,
    isButtonLoading
  };
};
