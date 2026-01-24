// Error handling utility - production-safe error logging
const isDevelopment = import.meta.env.DEV;

export const logError = (message, error = null, context = {}) => {
  if (isDevelopment) {
    console.error(`[Error] ${message}`, { error, context });
  }
  // In production, you could send errors to an error tracking service
  // Example: Sentry, LogRocket, etc.
};

export const logWarning = (message, context = {}) => {
  if (isDevelopment) {
    console.warn(`[Warning] ${message}`, context);
  }
};

export const logInfo = (message, context = {}) => {
  if (isDevelopment) {
    console.log(`[Info] ${message}`, context);
  }
};
