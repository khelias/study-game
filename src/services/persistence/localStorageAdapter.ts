import { PersistenceAdapter, PersistenceError } from './types';

/**
 * LocalStorage Persistence Adapter
 *
 * Implements persistence using browser LocalStorage.
 * This is the default adapter for MVP and offline-first scenarios.
 */
export class LocalStorageAdapter implements PersistenceAdapter {
  /**
   * Check if LocalStorage is available in the current environment
   */
  private isAvailable(): boolean {
    if (typeof window === 'undefined') {
      return false;
    }

    try {
      const testKey = '__localStorage_test__';
      window.localStorage.setItem(testKey, 'test');
      window.localStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Save data to LocalStorage
   * @param key - Storage key
   * @param data - Data to save (will be JSON stringified)
   */
  // eslint-disable-next-line @typescript-eslint/require-await
  async save(key: string, data: unknown): Promise<void> {
    if (!this.isAvailable()) {
      throw new PersistenceError('LocalStorage is not available in this environment', key, 'save');
    }

    try {
      const serialized = JSON.stringify(data);
      window.localStorage.setItem(key, serialized);
    } catch (error) {
      // Handle quota exceeded or other storage errors
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        throw new PersistenceError(`Storage quota exceeded for key: ${key}`, key, 'save', error);
      }

      throw new PersistenceError(`Failed to save data for key: ${key}`, key, 'save', error);
    }
  }

  /**
   * Load data from LocalStorage
   * @param key - Storage key
   * @returns The loaded data, or null if not found
   */
  // eslint-disable-next-line @typescript-eslint/require-await
  async load<T>(key: string): Promise<T | null> {
    if (!this.isAvailable()) {
      throw new PersistenceError('LocalStorage is not available in this environment', key, 'load');
    }

    try {
      const item = window.localStorage.getItem(key);
      if (item === null) {
        return null;
      }

      return JSON.parse(item) as T;
    } catch (error) {
      // If JSON parsing fails, the data might be corrupted
      // Log error but return null to allow recovery
      console.error(`Failed to parse data for key: ${key}`, error);
      throw new PersistenceError(
        `Failed to load or parse data for key: ${key}`,
        key,
        'load',
        error,
      );
    }
  }

  /**
   * Delete data from LocalStorage
   * @param key - Storage key to delete
   */
  // eslint-disable-next-line @typescript-eslint/require-await
  async delete(key: string): Promise<void> {
    if (!this.isAvailable()) {
      throw new PersistenceError(
        'LocalStorage is not available in this environment',
        key,
        'delete',
      );
    }

    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      throw new PersistenceError(`Failed to delete data for key: ${key}`, key, 'delete', error);
    }
  }
}
