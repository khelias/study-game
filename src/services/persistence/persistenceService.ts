import type { PersistenceAdapter } from './types';
import type { GameStore } from '../../stores/gameStore';

/**
 * Persistence Service
 * 
 * High-level service for persisting application data.
 * Uses an adapter pattern to support different storage backends.
 * 
 * Currently supports:
 * - LocalStorage (via LocalStorageAdapter) - Default for MVP
 * - API (via ApiAdapter) - For future cloud sync
 * 
 * Usage:
 * ```typescript
 * import { persistenceService } from './services/persistence';
 * 
 * // Save game state
 * await persistenceService.saveGameState(gameStore);
 * 
 * // Load game state
 * const state = await persistenceService.loadGameState();
 * ```
 */
export class PersistenceService {
  constructor(private adapter: PersistenceAdapter) {}

  /**
   * Save game state to persistence backend
   * @param state - The game store state to save
   */
  async saveGameState(state: GameStore): Promise<void> {
    await this.adapter.save('gameState', state);
  }

  /**
   * Load game state from persistence backend
   * @returns The game store state, or null if not found
   */
  async loadGameState(): Promise<GameStore | null> {
    return this.adapter.load<GameStore>('gameState');
  }

  /**
   * Save a generic value by key
   * @param key - Storage key
   * @param data - Data to save
   */
  async save<T>(key: string, data: T): Promise<void> {
    await this.adapter.save(key, data);
  }

  /**
   * Load a generic value by key
   * @param key - Storage key
   * @returns The loaded data, or null if not found
   */
  async load<T>(key: string): Promise<T | null> {
    return this.adapter.load<T>(key);
  }

  /**
   * Delete data by key
   * @param key - Storage key to delete
   */
  async delete(key: string): Promise<void> {
    await this.adapter.delete(key);
  }

  /**
   * Sync data with remote backend (if adapter supports it)
   * This is used for hybrid persistence mode
   */
  async sync(): Promise<void> {
    if (this.adapter.sync) {
      await this.adapter.sync();
    } else {
      throw new Error('Sync is not supported by the current adapter');
    }
  }

  /**
   * Get the current adapter (for testing or advanced usage)
   */
  getAdapter(): PersistenceAdapter {
    return this.adapter;
  }
}
