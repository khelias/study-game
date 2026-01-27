/**
 * Persistence Service Layer
 * 
 * Provides an abstraction layer for data persistence that supports:
 * - LocalStorage (current/default)
 * - API backend (future)
 * - Hybrid mode (LocalStorage + API sync)
 * 
 * This service follows the adapter pattern, allowing easy switching
 * between different storage backends without changing application code.
 */

export { PersistenceAdapter, PersistenceError } from './types';
export { LocalStorageAdapter } from './localStorageAdapter';
export { ApiAdapter } from './apiAdapter';
export { PersistenceService } from './persistenceService';

// Default instance using LocalStorage (for MVP)
import { LocalStorageAdapter } from './localStorageAdapter';
import { PersistenceService } from './persistenceService';

/**
 * Default persistence service instance
 * Uses LocalStorageAdapter as the default for MVP
 * 
 * To switch to API persistence, create a new instance:
 * ```typescript
 * import { PersistenceService, ApiAdapter } from './services/persistence';
 * import { apiClient } from './services/api';
 * 
 * const apiAdapter = new ApiAdapter(apiClient);
 * const apiPersistenceService = new PersistenceService(apiAdapter);
 * ```
 * 
 * Or use a hybrid approach (LocalStorage + API sync):
 * ```typescript
 * // Use LocalStorage for immediate saves, sync to API in background
 * const hybridService = new PersistenceService(new LocalStorageAdapter());
 * // Later, sync to API
 * await hybridService.sync(); // If adapter supports it
 * ```
 */
export const persistenceService = new PersistenceService(new LocalStorageAdapter());
