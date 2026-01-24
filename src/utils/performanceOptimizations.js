// Performance optimizations - parem jõudlus ja kiirus
import { useMemo, useCallback, useState, useEffect } from 'react';

/**
 * Memoize expensive calculations
 */
export const useMemoizedValue = (computeFn, deps) => {
  return useMemo(computeFn, deps);
};

/**
 * Debounce function calls
 */
export const useDebounce = (callback, delay) => {
  const timeoutRef = useMemo(() => ({ current: null }), []);
  
  return useCallback((...args) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  }, [callback, delay, timeoutRef]);
};

/**
 * Throttle function calls
 */
export const useThrottle = (callback, delay) => {
  const lastRunRef = useMemo(() => ({ current: Date.now() }), []);
  
  return useCallback((...args) => {
    if (Date.now() - lastRunRef.current >= delay) {
      callback(...args);
      lastRunRef.current = Date.now();
    }
  }, [callback, delay, lastRunRef]);
};

/**
 * Lazy load images
 */
export const useLazyImage = (src) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  
  useEffect(() => {
    const img = new Image();
    img.onload = () => setLoaded(true);
    img.onerror = () => setError(true);
    img.src = src;
  }, [src]);
  
  return { loaded, error };
};

/**
 * Intersection Observer for lazy loading
 */
export const useIntersectionObserver = (ref, options = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  
  useEffect(() => {
    if (!ref.current) return;
    
    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, options);
    
    observer.observe(ref.current);
    
    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [ref, options]);
  
  return isIntersecting;
};
