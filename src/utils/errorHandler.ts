/**
 * Error handling utility - production-safe error logging
 */

const isDevelopment = import.meta.env.DEV;

/**
 * Logs an error message
 * @param message - Error message
 * @param error - Error object (optional)
 * @param context - Additional context (optional)
 */
export const logError = (message: string, error: Error | null = null, context: Record<string, unknown> = {}): void => {
  if (isDevelopment) {
    console.error(`[Error] ${message}`, { error, context });
  }
  // In production, you could send errors to an error tracking service
  // Example: Sentry, LogRocket, etc.
};

/**
 * Logs a warning message
 * @param message - Warning message
 * @param context - Additional context (optional)
 */
export const logWarning = (message: string, context: Record<string, unknown> = {}): void => {
  if (isDevelopment) {
    console.warn(`[Warning] ${message}`, context);
  }
};

/**
 * Logs an info message
 * @param message - Info message
 * @param context - Additional context (optional)
 */
export const logInfo = (message: string, context: Record<string, unknown> = {}): void => {
  if (isDevelopment) {
    console.log(`[Info] ${message}`, context);
  }
};
