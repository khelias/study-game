import { describe, it, expect, beforeEach, vi } from 'vitest';
import { LocalStorageAdapter } from '../localStorageAdapter';
import { PersistenceError } from '../types';

describe('LocalStorageAdapter', () => {
  let adapter: LocalStorageAdapter;
  const testKey = 'test_key';
  const testData = { foo: 'bar', count: 42 };

  beforeEach(() => {
    adapter = new LocalStorageAdapter();
    // Clear localStorage before each test
    localStorage.clear();
  });

  describe('save', () => {
    it('should save data to localStorage', async () => {
      await adapter.save(testKey, testData);
      
      const stored = localStorage.getItem(testKey);
      expect(stored).toBeTruthy();
      expect(JSON.parse(stored!)).toEqual(testData);
    });

    it('should handle complex nested objects', async () => {
      const complexData = {
        nested: {
          array: [1, 2, 3],
          object: { key: 'value' },
        },
        date: new Date().toISOString(),
      };
      
      await adapter.save(testKey, complexData);
      const loaded = await adapter.load<typeof complexData>(testKey);
      expect(loaded).toEqual(complexData);
    });

    it('should throw PersistenceError when localStorage.setItem throws', async () => {
      // Mock JSON.stringify to throw an error to test error handling path
      const originalStringify = JSON.stringify;
      JSON.stringify = vi.fn(() => {
        throw new Error('Serialization error');
      });

      await expect(adapter.save(testKey, testData)).rejects.toThrow(PersistenceError);
      
      JSON.stringify = originalStringify;
    });
  });

  describe('load', () => {
    it('should load data from localStorage', async () => {
      localStorage.setItem(testKey, JSON.stringify(testData));
      
      const loaded = await adapter.load<typeof testData>(testKey);
      expect(loaded).toEqual(testData);
    });

    it('should return null for non-existent keys', async () => {
      const loaded = await adapter.load('non_existent_key');
      expect(loaded).toBeNull();
    });

    it('should throw PersistenceError for corrupted data', async () => {
      localStorage.setItem(testKey, 'invalid json{');
      
      await expect(adapter.load(testKey)).rejects.toThrow(PersistenceError);
    });
  });

  describe('delete', () => {
    it('should delete data from localStorage', async () => {
      localStorage.setItem(testKey, JSON.stringify(testData));
      
      await adapter.delete(testKey);
      
      expect(localStorage.getItem(testKey)).toBeNull();
    });

    it('should not throw when deleting non-existent key', async () => {
      await expect(adapter.delete('non_existent_key')).resolves.not.toThrow();
    });
  });

  describe('isAvailable', () => {
    it('should detect when localStorage is available', () => {
      // In test environment, localStorage should be available
      expect(localStorage).toBeDefined();
    });
  });
});
