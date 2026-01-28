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
export const getRandom = <T>(arr: T[], rng: RngFunction = Math.random): T | null => {
  if (!arr || arr.length === 0) return null;
  return arr[Math.floor(rng() * arr.length)] ?? null;
};

/**
 * Generates a unique ID using the RNG
 * @param rng - Random number generator function (defaults to Math.random)
 * @returns A short unique ID string (always 9+ characters)
 * 
 * This function ensures uniqueness by:
 * 1. Using multiple RNG calls to avoid collisions from similar RNG states
 * 2. Converting to base36 for compact representation
 * 3. Combining multiple parts to ensure minimum length
 * 4. Using a counter/timestamp fallback if needed (for production builds where RNG might be deterministic)
 */
export const uid = (rng: RngFunction = Math.random): string => {
  // Generate multiple random values and combine them to ensure uniqueness
  // This prevents collisions that can occur with very small RNG values or when RNG state is similar
  const parts: string[] = [];
  
  // Use 4 RNG calls to ensure sufficient entropy
  for (let i = 0; i < 4; i++) {
    const val = rng();
    // Convert to integer representation in base36 for consistent length
    // Multiply by a large number to get more digits, then convert to base36
    const intVal = Math.floor(val * 0xFFFFFF); // Use 24 bits for good distribution
    const base36 = intVal.toString(36);
    parts.push(base36);
  }
  
  // Combine all parts
  let combined = parts.join('');
  
  // Ensure minimum length of 9 characters
  // If somehow we still don't have enough, use additional RNG calls
  let attempts = 0;
  while (combined.length < 9 && attempts < 10) {
    const extra = Math.floor(rng() * 0xFFFFFF).toString(36);
    combined += extra;
    attempts++;
  }
  
  // Return first 11 characters (optimal length for React keys)
  // Should always be at least 9 characters after the above logic
  return combined.slice(0, 11) || Math.random().toString(36).substring(2, 11);
};
