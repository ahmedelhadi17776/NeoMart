import { useState, useCallback, useRef } from 'react';

// Custom hook for swipe gestures
export const useSwipeGesture = (onSwipeLeft, onSwipeRight, options = {}) => {
  const {
    threshold = 50,
    preventDefaultTouchmoveEvent = true,
    trackMouse = false
  } = options;

  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [isSwiping, setIsSwiping] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState(null);
  const elementRef = useRef(null);

  const minSwipeDistance = threshold;

  const onTouchStart = useCallback((e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
    setIsSwiping(true);
  }, []);

  const onTouchMove = useCallback((e) => {
    if (preventDefaultTouchmoveEvent) {
      e.preventDefault();
    }
    setTouchEnd(e.targetTouches[0].clientX);
  }, [preventDefaultTouchmoveEvent]);

  const onTouchEnd = useCallback(() => {
    if (!touchStart || !touchEnd) {
      setIsSwiping(false);
      return;
    }

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      setSwipeDirection('left');
      onSwipeLeft?.();
    } else if (isRightSwipe) {
      setSwipeDirection('right');
      onSwipeRight?.();
    }

    setIsSwiping(false);
    setTouchStart(null);
    setTouchEnd(null);
    
    // Reset direction after animation
    setTimeout(() => setSwipeDirection(null), 300);
  }, [touchStart, touchEnd, minSwipeDistance, onSwipeLeft, onSwipeRight]);

  // Mouse events for desktop testing
  const onMouseDown = useCallback((e) => {
    if (!trackMouse) return;
    setTouchEnd(null);
    setTouchStart(e.clientX);
    setIsSwiping(true);
  }, [trackMouse]);

  const onMouseMove = useCallback((e) => {
    if (!trackMouse || !isSwiping) return;
    setTouchEnd(e.clientX);
  }, [trackMouse, isSwiping]);

  const onMouseUp = useCallback(() => {
    if (!trackMouse) return;
    onTouchEnd();
  }, [trackMouse, onTouchEnd]);

  return {
    touchHandlers: {
      onTouchStart,
      onTouchMove,
      onTouchEnd
    },
    mouseHandlers: trackMouse ? {
      onMouseDown,
      onMouseMove,
      onMouseUp
    } : {},
    isSwiping,
    swipeDirection,
    elementRef
  };
};

// Hook specifically for swipe-to-delete functionality
export const useSwipeToDelete = (onDelete, options = {}) => {
  const {
    threshold = 50,
    deleteThreshold = 100,
    animationDuration = 300
  } = options;

  const elementRef = useRef(null);
  const startX = useRef(0);
  const currentX = useRef(0);
  const isDragging = useRef(false);
  
  const [swipeProgress, setSwipeProgress] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState(null);

  const handleTouchStart = useCallback((e) => {
    startX.current = e.touches[0].clientX;
    currentX.current = e.touches[0].clientX;
    isDragging.current = true;
    setIsSwiping(true);
    setSwipeDirection(null);
  }, []);

  const handleTouchMove = useCallback((e) => {
    if (!isDragging.current) return;
    
    currentX.current = e.touches[0].clientX;
    const deltaX = startX.current - currentX.current;
    
    if (deltaX > 0) {
      setSwipeDirection('left');
      const progress = Math.min(deltaX, deleteThreshold + 50);
      setSwipeProgress(progress);
      setShowDelete(progress >= threshold);
      
      // Prevent scrolling when swiping
      if (deltaX > 10) {
        e.preventDefault();
      }
    } else {
      setSwipeDirection('right');
      setSwipeProgress(0);
      setShowDelete(false);
    }
  }, [threshold, deleteThreshold]);

  const handleTouchEnd = useCallback(() => {
    if (!isDragging.current) return;
    
    isDragging.current = false;
    setIsSwiping(false);
    
    const deltaX = startX.current - currentX.current;
    
    if (deltaX >= deleteThreshold) {
      // Trigger delete
      setIsDeleting(true);
      setTimeout(() => {
        onDelete();
      }, animationDuration);
    } else if (deltaX >= threshold) {
      // Show delete button but don't delete
      setShowDelete(true);
    } else {
      // Reset
      setSwipeProgress(0);
      setShowDelete(false);
      setSwipeDirection(null);
    }
  }, [threshold, deleteThreshold, animationDuration, onDelete]);

  const handleMouseDown = useCallback((e) => {
    startX.current = e.clientX;
    currentX.current = e.clientX;
    isDragging.current = true;
    setIsSwiping(true);
    setSwipeDirection(null);
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging.current) return;
    
    currentX.current = e.clientX;
    const deltaX = startX.current - currentX.current;
    
    if (deltaX > 0) {
      setSwipeDirection('left');
      const progress = Math.min(deltaX, deleteThreshold + 50);
      setSwipeProgress(progress);
      setShowDelete(progress >= threshold);
    } else {
      setSwipeDirection('right');
      setSwipeProgress(0);
      setShowDelete(false);
    }
  }, [threshold, deleteThreshold]);

  const handleMouseUp = useCallback(() => {
    if (!isDragging.current) return;
    
    isDragging.current = false;
    setIsSwiping(false);
    
    const deltaX = startX.current - currentX.current;
    
    if (deltaX >= deleteThreshold) {
      setIsDeleting(true);
      setTimeout(() => {
        onDelete();
      }, animationDuration);
    } else if (deltaX >= threshold) {
      setShowDelete(true);
    } else {
      setSwipeProgress(0);
      setShowDelete(false);
      setSwipeDirection(null);
    }
  }, [threshold, deleteThreshold, animationDuration, onDelete]);

  const handleMouseLeave = useCallback(() => {
    if (isDragging.current) {
      handleMouseUp();
    }
  }, [handleMouseUp]);

  const handleDeleteClick = useCallback(() => {
    setIsDeleting(true);
    setTimeout(() => {
      onDelete();
    }, animationDuration);
  }, [onDelete, animationDuration]);

  const resetState = useCallback(() => {
    setSwipeProgress(0);
    setShowDelete(false);
    setIsDeleting(false);
    setSwipeDirection(null);
    setIsSwiping(false);
  }, []);

  return {
    touchHandlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd
    },
    mouseHandlers: {
      onMouseDown: handleMouseDown,
      onMouseMove: handleMouseMove,
      onMouseUp: handleMouseUp,
      onMouseLeave: handleMouseLeave
    },
    isSwiping,
    swipeProgress,
    showDelete,
    isDeleting,
    swipeDirection,
    elementRef,
    handleDeleteClick,
    resetState
  };
};

// Hook for pull-to-refresh functionality
export const usePullToRefresh = (onRefresh, options = {}) => {
  const {
    threshold = 80,
    resistance = 2.5,
    disabled = false
  } = options;

  const [isPulling, setIsPulling] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const startY = useRef(0);
  const currentY = useRef(0);

  const handleTouchStart = useCallback((e) => {
    if (disabled || window.scrollY > 0) return;
    startY.current = e.touches[0].clientY;
    setIsPulling(true);
  }, [disabled]);

  const handleTouchMove = useCallback((e) => {
    if (!isPulling || disabled) return;
    
    currentY.current = e.touches[0].clientY;
    const distance = Math.max(0, currentY.current - startY.current);
    const resistanceDistance = distance / resistance;
    
    setPullDistance(resistanceDistance);
    
    if (distance > threshold) {
      e.preventDefault();
    }
  }, [isPulling, disabled, threshold, resistance]);

  const handleTouchEnd = useCallback(async () => {
    if (!isPulling || disabled) return;
    
    setIsPulling(false);
    
    if (pullDistance > threshold && !isRefreshing) {
      setIsRefreshing(true);
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
      }
    }
    
    setPullDistance(0);
  }, [isPulling, disabled, pullDistance, threshold, isRefreshing, onRefresh]);

  return {
    touchHandlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd
    },
    isPulling,
    pullDistance,
    isRefreshing,
    canRefresh: pullDistance > threshold
  };
};

// Hook for pinch-to-zoom functionality
export const usePinchZoom = (options = {}) => {
  const {
    minScale = 0.5,
    maxScale = 3,
    initialScale = 1
  } = options;

  const [scale, setScale] = useState(initialScale);
  const [isZooming, setIsZooming] = useState(false);
  const lastDistance = useRef(0);
  const lastScale = useRef(initialScale);

  const getDistance = useCallback((touches) => {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }, []);

  const handleTouchStart = useCallback((e) => {
    if (e.touches.length === 2) {
      lastDistance.current = getDistance(e.touches);
      lastScale.current = scale;
      setIsZooming(true);
    }
  }, [scale, getDistance]);

  const handleTouchMove = useCallback((e) => {
    if (e.touches.length === 2 && isZooming) {
      e.preventDefault();
      const currentDistance = getDistance(e.touches);
      const scaleChange = currentDistance / lastDistance.current;
      const newScale = Math.max(minScale, Math.min(maxScale, lastScale.current * scaleChange));
      setScale(newScale);
    }
  }, [isZooming, getDistance, minScale, maxScale]);

  const handleTouchEnd = useCallback(() => {
    setIsZooming(false);
  }, []);

  const resetZoom = useCallback(() => {
    setScale(initialScale);
  }, [initialScale]);

  return {
    touchHandlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd
    },
    scale,
    isZooming,
    resetZoom
  };
};
