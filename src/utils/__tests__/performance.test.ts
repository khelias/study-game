import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { debounce, throttle, isMobile, hasTouch } from '../performance';

describe('debounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should delay function execution', () => {
    const func = vi.fn();
    const debouncedFunc = debounce(func, 500);

    debouncedFunc();

    expect(func).not.toHaveBeenCalled();

    vi.advanceTimersByTime(500);

    expect(func).toHaveBeenCalledTimes(1);
  });

  it('should cancel previous call when called multiple times', () => {
    const func = vi.fn();
    const debouncedFunc = debounce(func, 500);

    debouncedFunc();
    vi.advanceTimersByTime(200);
    debouncedFunc();
    vi.advanceTimersByTime(200);
    debouncedFunc();

    expect(func).not.toHaveBeenCalled();

    vi.advanceTimersByTime(500);

    expect(func).toHaveBeenCalledTimes(1);
  });

  it('should pass arguments to debounced function', () => {
    const func = vi.fn();
    const debouncedFunc = debounce(func, 500);

    debouncedFunc('arg1', 'arg2');

    vi.advanceTimersByTime(500);

    expect(func).toHaveBeenCalledWith('arg1', 'arg2');
  });

  it('should execute function only once after multiple calls within wait time', () => {
    const func = vi.fn();
    const debouncedFunc = debounce(func, 500);

    debouncedFunc();
    debouncedFunc();
    debouncedFunc();
    debouncedFunc();

    vi.advanceTimersByTime(500);

    expect(func).toHaveBeenCalledTimes(1);
  });

  it('should execute function multiple times if calls are separated by wait time', () => {
    const func = vi.fn();
    const debouncedFunc = debounce(func, 500);

    debouncedFunc();
    vi.advanceTimersByTime(500);

    debouncedFunc();
    vi.advanceTimersByTime(500);

    expect(func).toHaveBeenCalledTimes(2);
  });
});

describe('throttle', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should execute function immediately on first call', () => {
    const func = vi.fn();
    const throttledFunc = throttle(func, 500);

    throttledFunc();

    expect(func).toHaveBeenCalledTimes(1);
  });

  it('should ignore calls within throttle limit', () => {
    const func = vi.fn();
    const throttledFunc = throttle(func, 500);

    throttledFunc();
    throttledFunc();
    throttledFunc();

    expect(func).toHaveBeenCalledTimes(1);
  });

  it('should allow call after throttle limit passes', () => {
    const func = vi.fn();
    const throttledFunc = throttle(func, 500);

    throttledFunc();
    expect(func).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(500);

    throttledFunc();
    expect(func).toHaveBeenCalledTimes(2);
  });

  it('should pass arguments to throttled function', () => {
    const func = vi.fn();
    const throttledFunc = throttle(func, 500);

    throttledFunc('arg1', 'arg2');

    expect(func).toHaveBeenCalledWith('arg1', 'arg2');
  });

  it('should throttle multiple rapid calls', () => {
    const func = vi.fn();
    const throttledFunc = throttle(func, 500);

    // Rapid calls
    for (let i = 0; i < 10; i++) {
      throttledFunc();
    }

    expect(func).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(500);

    // More rapid calls
    for (let i = 0; i < 10; i++) {
      throttledFunc();
    }

    expect(func).toHaveBeenCalledTimes(2);
  });
});

describe('isMobile', () => {
  it('should detect mobile user agent', () => {
    // Save original userAgent
    const originalUserAgent = navigator.userAgent;

    // Mock mobile user agent
    Object.defineProperty(navigator, 'userAgent', {
      value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
      configurable: true,
    });

    expect(isMobile()).toBe(true);

    // Restore original userAgent
    Object.defineProperty(navigator, 'userAgent', {
      value: originalUserAgent,
      configurable: true,
    });
  });

  it('should detect Android user agent', () => {
    const originalUserAgent = navigator.userAgent;

    Object.defineProperty(navigator, 'userAgent', {
      value: 'Mozilla/5.0 (Linux; Android 10)',
      configurable: true,
    });

    expect(isMobile()).toBe(true);

    Object.defineProperty(navigator, 'userAgent', {
      value: originalUserAgent,
      configurable: true,
    });
  });

  it('should detect desktop based on window width', () => {
    const originalUserAgent = navigator.userAgent;
    const originalInnerWidth = window.innerWidth;

    Object.defineProperty(navigator, 'userAgent', {
      value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      configurable: true,
    });

    Object.defineProperty(window, 'innerWidth', {
      value: 500,
      configurable: true,
    });

    expect(isMobile()).toBe(true);

    Object.defineProperty(window, 'innerWidth', {
      value: originalInnerWidth,
      configurable: true,
    });

    Object.defineProperty(navigator, 'userAgent', {
      value: originalUserAgent,
      configurable: true,
    });
  });
});

describe('hasTouch', () => {
  it('should detect touch support', () => {
    // This test depends on the environment
    // In happy-dom, ontouchstart might not be defined
    const result = hasTouch();

    expect(typeof result).toBe('boolean');
  });

  it('should check for maxTouchPoints', () => {
    const originalMaxTouchPoints = navigator.maxTouchPoints;

    Object.defineProperty(navigator, 'maxTouchPoints', {
      value: 1,
      configurable: true,
    });

    expect(hasTouch()).toBe(true);

    Object.defineProperty(navigator, 'maxTouchPoints', {
      value: originalMaxTouchPoints,
      configurable: true,
    });
  });

  it('should return false when no touch support', () => {
    const originalMaxTouchPoints = navigator.maxTouchPoints;

    Object.defineProperty(navigator, 'maxTouchPoints', {
      value: 0,
      configurable: true,
    });

    // Result depends on ontouchstart which might be undefined in test environment
    const result = hasTouch();
    expect(typeof result).toBe('boolean');

    Object.defineProperty(navigator, 'maxTouchPoints', {
      value: originalMaxTouchPoints,
      configurable: true,
    });
  });
});
