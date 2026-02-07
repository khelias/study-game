import { describe, it, expect } from 'vitest';
import { createRng, getRandom, uid } from '../rng';

describe('createRng', () => {
  it('should create a deterministic RNG with seed', () => {
    const rng1 = createRng(12345);
    const rng2 = createRng(12345);
    
    // Same seed should produce same sequence
    const values1 = [rng1(), rng1(), rng1()];
    const values2 = [rng2(), rng2(), rng2()];
    
    expect(values1).toEqual(values2);
  });

  it('should produce values between 0 and 1', () => {
    const rng = createRng(12345);
    
    for (let i = 0; i < 100; i++) {
      const value = rng();
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThan(1);
    }
  });

  it('should produce different sequences with different seeds', () => {
    const rng1 = createRng(12345);
    const rng2 = createRng(54321);
    
    const values1 = [rng1(), rng1(), rng1()];
    const values2 = [rng2(), rng2(), rng2()];
    
    expect(values1).not.toEqual(values2);
  });

  it('should handle seed of 0 correctly', () => {
    const rng = createRng(0);
    const value = rng();
    
    expect(value).toBeGreaterThanOrEqual(0);
    expect(value).toBeLessThan(1);
  });

  it('should handle negative seed correctly', () => {
    const rng = createRng(-100);
    const value = rng();
    
    expect(value).toBeGreaterThanOrEqual(0);
    expect(value).toBeLessThan(1);
  });
});

describe('getRandom', () => {
  it('should select random element from array', () => {
    const arr = ['a', 'b', 'c', 'd'];
    const rng = createRng(12345);
    
    const element = getRandom(arr, rng);
    
    expect(arr).toContain(element);
  });

  it('should use seeded RNG consistently', () => {
    const arr = ['a', 'b', 'c', 'd'];
    const rng1 = createRng(12345);
    const rng2 = createRng(12345);
    
    const element1 = getRandom(arr, rng1);
    const element2 = getRandom(arr, rng2);
    
    expect(element1).toEqual(element2);
  });

  it('should return null for empty array', () => {
    const arr: string[] = [];
    const rng = createRng(12345);
    
    const element = getRandom(arr, rng);
    
    expect(element).toBeNull();
  });

  it('should return null for null array', () => {
    const rng = createRng(12345);
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const element = getRandom(null as any, rng);
    
    expect(element).toBeNull();
  });

  it('should return null for undefined array', () => {
    const rng = createRng(12345);
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const element = getRandom(undefined as any, rng);
    
    expect(element).toBeNull();
  });

  it('should return the only element in single-element array', () => {
    const arr = ['only'];
    const rng = createRng(12345);
    
    const element = getRandom(arr, rng);
    
    expect(element).toBe('only');
  });

  it('should use Math.random when no RNG provided', () => {
    const arr = ['a', 'b', 'c', 'd'];
    
    const element = getRandom(arr);
    
    expect(arr).toContain(element);
  });
});

describe('uid', () => {
  it('should generate unique IDs with seeded RNG', () => {
    const rng = createRng(12345);
    
    const id1 = uid(rng);
    const id2 = uid(rng);
    
    expect(id1).not.toEqual(id2);
    expect(typeof id1).toBe('string');
    expect(typeof id2).toBe('string');
  });

  it('should generate consistent IDs with same seed', () => {
    const rng1 = createRng(12345);
    const rng2 = createRng(12345);
    
    const id1 = uid(rng1);
    const id2 = uid(rng2);
    
    expect(id1).toEqual(id2);
  });

  it('should use Math.random when no RNG provided', () => {
    const id = uid();
    
    expect(typeof id).toBe('string');
    expect(id.length).toBeGreaterThan(0);
  });

  it('should generate IDs of reasonable length', () => {
    const rng = createRng(12345);
    const id = uid(rng);
    
    expect(id.length).toBeGreaterThan(0);
    expect(id.length).toBeLessThanOrEqual(11);
  });
});
