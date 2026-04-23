import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ApiAdapter } from '../apiAdapter';
import { PersistenceError } from '../types';

// Mock API client interface
interface MockApiClient {
  get<T>(path: string): Promise<T>;
  put<T>(path: string, data: unknown): Promise<T>;
  delete(path: string): Promise<void>;
}

describe('ApiAdapter', () => {
  let adapter: ApiAdapter;
  let mockApiClient: MockApiClient;
  let getFn: ReturnType<typeof vi.fn>;
  let putFn: ReturnType<typeof vi.fn>;
  let deleteFn: ReturnType<typeof vi.fn>;
  const testKey = 'test_key';
  const testData = { foo: 'bar', count: 42 };

  beforeEach(() => {
    // Use arrow functions to avoid unbound method issues
    getFn = vi.fn();
    putFn = vi.fn();
    deleteFn = vi.fn();

    mockApiClient = {
      get: getFn,
      put: putFn,
      delete: deleteFn,
    };
    adapter = new ApiAdapter(mockApiClient);
  });

  describe('save', () => {
    it('should save data via API client', async () => {
      vi.mocked(putFn).mockResolvedValue({} as never);

      await adapter.save(testKey, testData);

      expect(putFn).toHaveBeenCalledWith(`/user/data/${testKey}`, testData);
    });

    it('should throw PersistenceError when ApiClient is not initialized', async () => {
      const uninitializedAdapter = new ApiAdapter(null);

      await expect(uninitializedAdapter.save(testKey, testData)).rejects.toThrow(PersistenceError);
    });

    it('should throw PersistenceError when API call fails', async () => {
      const error = new Error('Network error');
      vi.mocked(putFn).mockRejectedValue(error);

      await expect(adapter.save(testKey, testData)).rejects.toThrow(PersistenceError);
    });
  });

  describe('load', () => {
    it('should load data via API client', async () => {
      vi.mocked(getFn).mockResolvedValue(testData);

      const loaded = await adapter.load<typeof testData>(testKey);

      expect(getFn).toHaveBeenCalledWith(`/user/data/${testKey}`);
      expect(loaded).toEqual(testData);
    });

    it('should return null for 404 responses', async () => {
      const error = { status: 404 };
      vi.mocked(getFn).mockRejectedValue(error);

      const loaded = await adapter.load(testKey);
      expect(loaded).toBeNull();
    });

    it('should throw PersistenceError for other API errors', async () => {
      const error = { status: 500, message: 'Server error' };
      vi.mocked(getFn).mockRejectedValue(error);

      await expect(adapter.load(testKey)).rejects.toThrow(PersistenceError);
    });

    it('should throw PersistenceError when ApiClient is not initialized', async () => {
      const uninitializedAdapter = new ApiAdapter(null);

      await expect(uninitializedAdapter.load(testKey)).rejects.toThrow(PersistenceError);
    });
  });

  describe('delete', () => {
    it('should delete data via API client', async () => {
      vi.mocked(deleteFn).mockResolvedValue();

      await adapter.delete(testKey);

      expect(deleteFn).toHaveBeenCalledWith(`/user/data/${testKey}`);
    });

    it('should throw PersistenceError when ApiClient is not initialized', async () => {
      const uninitializedAdapter = new ApiAdapter(null);

      await expect(uninitializedAdapter.delete(testKey)).rejects.toThrow(PersistenceError);
    });
  });

  describe('sync', () => {
    it('should throw PersistenceError (not yet implemented)', async () => {
      await expect(adapter.sync()).rejects.toThrow(PersistenceError);
    });
  });
});
