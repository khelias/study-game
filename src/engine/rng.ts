import type { RngFunction } from '../types/game';

/**
 * Creates a deterministic random number generator for testability
 * @param seed - The seed for the RNG (defaults to current timestamp)
 * @returns A function that generates random numbers between 0 and 1
 */
export const createRng = (seed: number = Date.now()): RngFunction => {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return s / 2147483647;
  };
};

/**
 * Gets a random element from an array
 * @param arr - The array to pick from
 * @param rng - Random number generator function (defaults to Math.random)
 * @returns A random element from the array or null if array is empty
 */
export const getRandom = <T>(arr: T[], rng: RngFunction = Math.random): T | null =>
  arr && arr.length > 0 ? arr[Math.floor(rng() * arr.length)] : null;

/**
 * Generates a unique ID using the RNG
 * @param rng - Random number generator function (defaults to Math.random)
 * @returns A short unique ID string
 */
export const uid = (rng: RngFunction = Math.random): string => 
  rng().toString(36).substring(2, 11);
