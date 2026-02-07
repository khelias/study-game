/**
 * Utilities for converting game IDs to URL-safe slugs and vice versa.
 * Ensures English slugs are used regardless of locale.
 */

/**
 * Converts a game ID to a URL-safe slug.
 * Examples:
 *   word_cascade -> word-cascade
 *   math_snake_adv -> math-snake-adv
 *   balance_scale -> balance-scale
 */
export function gameIdToSlug(gameId: string): string {
  return gameId.replace(/_/g, '-');
}

/**
 * Converts a URL slug back to a game ID.
 * Examples:
 *   word-cascade -> word_cascade
 *   math-snake-adv -> math_snake_adv
 *   balance-scale -> balance_scale
 */
export function slugToGameId(slug: string): string {
  return slug.replace(/-/g, '_');
}

/**
 * Validates if a slug corresponds to a valid game ID.
 */
export function isValidGameSlug(slug: string, validGameIds: string[]): boolean {
  const gameId = slugToGameId(slug);
  return validGameIds.includes(gameId);
}
