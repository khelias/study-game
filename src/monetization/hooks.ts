/**
 * Monetization hooks
 *
 * React hooks for accessing monetization features
 */

import { useMonetizationStore } from './store';

/**
 * Hook to check if a feature is available
 *
 * @param featureId - The feature ID to check
 * @returns True if the feature is available
 *
 * @example
 * ```tsx
 * const hasPremium = useHasFeature('premium_games');
 * if (hasPremium) {
 *   // Show premium content
 * }
 * ```
 */
export function useHasFeature(featureId: string): boolean {
  return useMonetizationStore((state) => state.hasFeature(featureId));
}

/**
 * Hook to get subscription tier
 *
 * @returns The current subscription tier
 *
 * @example
 * ```tsx
 * const tier = useSubscriptionTier();
 * if (tier === 'premium') {
 *   // Show premium UI
 * }
 * ```
 */
export function useSubscriptionTier(): string {
  return useMonetizationStore((state) => state.subscription.tier);
}

/**
 * Hook to check if subscription is active
 *
 * @returns True if subscription is active
 */
export function useIsSubscriptionActive(): boolean {
  return useMonetizationStore((state) => state.subscription.isActive);
}
