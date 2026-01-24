// Jõudluse optimeerimise utils
import { useMemo, useCallback } from 'react';

// Debounce funktsioon
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Throttle funktsioon
export const throttle = (func, limit) => {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Memoize hook
export const useMemoizedCallback = (callback, deps) => {
  return useCallback(callback, deps);
};

// Lazy load komponent
export const lazyLoadComponent = (importFunc) => {
  return React.lazy(importFunc);
};

// Image preloader
export const preloadImages = (urls) => {
  urls.forEach(url => {
    const img = new Image();
    img.src = url;
  });
};

// Check if device is mobile
export const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  ) || window.innerWidth < 768;
};

// Check if device has touch
export const hasTouch = () => {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

// Request animation frame wrapper
export const requestAnimationFrame = (callback) => {
  if (typeof window !== 'undefined' && window.requestAnimationFrame) {
    return window.requestAnimationFrame(callback);
  }
  return setTimeout(callback, 16);
};

// Cancel animation frame wrapper
export const cancelAnimationFrame = (id) => {
  if (typeof window !== 'undefined' && window.cancelAnimationFrame) {
    return window.cancelAnimationFrame(id);
  }
  clearTimeout(id);
};
