/**
 * Persistence Adapter Interface
 *
 * Defines the contract for persistence adapters that can save/load data
 * from different storage backends (LocalStorage, API, etc.)
 */
export interface PersistenceAdapter {
  /**
   * Save data to the persistence backend
   * @param key - Unique identifier for the data
   * @param data - Data to save (will be serialized)
   * @throws {PersistenceError} If save operation fails
   */
  save(key: string, data: unknown): Promise<void>;

  /**
   * Load data from the persistence backend
   * @param key - Unique identifier for the data
   * @returns The loaded data, or null if not found
   * @throws {PersistenceError} If load operation fails
   */
  load<T>(key: string): Promise<T | null>;

  /**
   * Delete data from the persistence backend
   * @param key - Unique identifier for the data to delete
   * @throws {PersistenceError} If delete operation fails
   */
  delete(key: string): Promise<void>;

  /**
   * Optional: Sync data with remote backend (for cloud sync)
   * @throws {PersistenceError} If sync operation fails
   */
  sync?(): Promise<void>;
}

/**
 * Error thrown by persistence adapters
 */
export class PersistenceError extends Error {
  constructor(
    message: string,
    public readonly key: string,
    public readonly operation: 'save' | 'load' | 'delete' | 'sync',
    public readonly cause?: unknown,
  ) {
    super(message);
    this.name = 'PersistenceError';
  }
}
