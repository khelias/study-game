/**
 * React performance optimization hooks
 */
import { useCallback, useState, useEffect, useRef } from 'react';

type AnyFunction = (...args: unknown[]) => unknown;

/**
 * Debounce function calls in React components
 * @param callback - Callback function to debounce
 * @param delay - Delay in milliseconds
 * @returns Debounced callback
 */
export const useDebounce = <T extends AnyFunction>(
  callback: T,
  delay: number,
): ((...args: Parameters<T>) => void) => {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  return useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay],
  );
};

/**
 * Throttle function calls in React components
 * @param callback - Callback function to throttle
 * @param delay - Minimum delay between calls in milliseconds
 * @returns Throttled callback
 */
export const useThrottle = <T extends AnyFunction>(
  callback: T,
  delay: number,
): ((...args: Parameters<T>) => void) => {
  const lastRunRef = useRef<number>(0);

  return useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();
      if (now - lastRunRef.current >= delay) {
        callback(...args);
        lastRunRef.current = now;
      }
    },
    [callback, delay],
  );
};

/**
 * Lazy load images
 * @param src - Image source URL
 * @returns Object with loaded and error states
 */
export const useLazyImage = (src: string): { loaded: boolean; error: boolean } => {
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
 * @param ref - React ref to observe
 * @param options - IntersectionObserver options
 * @returns True if element is intersecting
 */
export const useIntersectionObserver = (
  ref: React.RefObject<Element>,
  options: IntersectionObserverInit = {},
): boolean => {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry?.isIntersecting ?? false);
    }, options);

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [ref, options]);

  return isIntersecting;
};
