/**
 * API Persistence Adapter
 * 
 * Implements persistence using a remote API backend.
 * This adapter will be fully implemented when the backend API is ready.
 * 
 * For now, this is a placeholder that throws errors to indicate
 * that API persistence is not yet available.
 */

import { PersistenceAdapter, PersistenceError } from './types';

/**
 * Placeholder API Client interface
 * This will be replaced with the actual ApiClient when section 2.3 is implemented
 */
interface ApiClient {
  get<T>(path: string): Promise<T>;
  put<T>(path: string, data: unknown): Promise<T>;
  delete(path: string): Promise<void>;
}

/**
 * API Persistence Adapter
 * 
 * Saves/loads data via HTTP API calls to a backend server.
 * This enables cloud sync, multi-device support, and backup/recovery.
 */
export class ApiAdapter implements PersistenceAdapter {
  constructor(
    private apiClient: ApiClient | null = null,
    private basePath: string = '/user/data'
  ) {
    // For now, apiClient is null until API service layer is implemented
    if (!apiClient) {
      console.warn(
        'ApiAdapter initialized without ApiClient. ' +
        'API persistence will not work until ApiClient is provided. ' +
        'See section 2.3 of ARCHITECTURAL_REVIEW.md for API service layer implementation.'
      );
    }
  }

  /**
   * Set the API client (to be called when API service layer is ready)
   */
  setApiClient(apiClient: ApiClient): void {
    this.apiClient = apiClient;
  }

  /**
   * Save data to the API backend
   * @param key - Data key
   * @param data - Data to save
   */
  async save(key: string, data: unknown): Promise<void> {
    if (!this.apiClient) {
      throw new PersistenceError(
        'ApiClient not initialized. API persistence requires the API service layer (section 2.3).',
        key,
        'save'
      );
    }

    try {
      await this.apiClient.put(`${this.basePath}/${key}`, data);
    } catch (error) {
      throw new PersistenceError(
        `Failed to save data to API for key: ${key}`,
        key,
        'save',
        error
      );
    }
  }

  /**
   * Load data from the API backend
   * @param key - Data key
   * @returns The loaded data, or null if not found
   */
  async load<T>(key: string): Promise<T | null> {
    if (!this.apiClient) {
      throw new PersistenceError(
        'ApiClient not initialized. API persistence requires the API service layer (section 2.3).',
        key,
        'load'
      );
    }

    try {
      const response = await this.apiClient.get<T>(`${this.basePath}/${key}`);
      return response ?? null;
    } catch (error) {
      // If 404, return null (data doesn't exist)
      if (error && typeof error === 'object' && 'status' in error && error.status === 404) {
        return null;
      }
      
      throw new PersistenceError(
        `Failed to load data from API for key: ${key}`,
        key,
        'load',
        error
      );
    }
  }

  /**
   * Delete data from the API backend
   * @param key - Data key to delete
   */
  async delete(key: string): Promise<void> {
    if (!this.apiClient) {
      throw new PersistenceError(
        'ApiClient not initialized. API persistence requires the API service layer (section 2.3).',
        key,
        'delete'
      );
    }

    try {
      await this.apiClient.delete(`${this.basePath}/${key}`);
    } catch (error) {
      throw new PersistenceError(
        `Failed to delete data from API for key: ${key}`,
        key,
        'delete',
        error
      );
    }
  }

  /**
   * Sync local data with remote backend
   * This will be used for hybrid persistence mode (LocalStorage + API)
   */
  // eslint-disable-next-line @typescript-eslint/require-await
  async sync(): Promise<void> {
    if (!this.apiClient) {
      throw new PersistenceError(
        'ApiClient not initialized. Sync requires the API service layer (section 2.3).',
        'sync',
        'sync'
      );
    }

    // TODO: Implement sync logic when hybrid mode is needed
    // This would typically:
    // 1. Load all keys from LocalStorage
    // 2. Compare with remote versions
    // 3. Resolve conflicts (last-write-wins or merge strategy)
    // 4. Upload local changes and download remote changes
    throw new PersistenceError(
      'Sync not yet implemented. Will be available in hybrid persistence mode.',
      'sync',
      'sync'
    );
  }
}
