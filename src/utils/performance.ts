/**
 * Performance optimization utilities
 */

type AnyFunction = (...args: unknown[]) => unknown;

/**
 * Debounce function - delays execution until after wait time has elapsed
 * @param func - Function to debounce
 * @param wait - Wait time in milliseconds
 * @returns Debounced function
 */
export const debounce = <T extends AnyFunction>(func: T, wait: number): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout> | undefined;
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Throttle function - limits execution to once per limit time
 * @param func - Function to throttle
 * @param limit - Limit time in milliseconds
 * @returns Throttled function
 */
export const throttle = <T extends AnyFunction>(func: T, limit: number): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return function(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

/**
 * Preload images
 * @param urls - Array of image URLs to preload
 */
export const preloadImages = (urls: string[]): void => {
  urls.forEach(url => {
    const img = new Image();
    img.src = url;
  });
};

/**
 * Check if device is mobile
 * @returns True if device is mobile
 */
export const isMobile = (): boolean => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  ) || window.innerWidth < 768;
};

/**
 * Check if device has touch support
 * @returns True if device has touch
 */
export const hasTouch = (): boolean => {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

/**
 * Request animation frame wrapper with fallback
 * @param callback - Animation callback
 * @returns Animation frame ID
 */
export const requestAnimFrame = (callback: FrameRequestCallback): number => {
  if (typeof window !== 'undefined' && window.requestAnimationFrame) {
    return window.requestAnimationFrame(callback);
  }
  // In environments without requestAnimationFrame, use setTimeout
  return window.setTimeout(callback, 16);
};

/**
 * Cancel animation frame wrapper with fallback
 * @param id - Animation frame ID
 */
export const cancelAnimFrame = (id: number): void => {
  if (typeof window !== 'undefined' && window.cancelAnimationFrame) {
    return window.cancelAnimationFrame(id);
  }
  clearTimeout(id);
};
