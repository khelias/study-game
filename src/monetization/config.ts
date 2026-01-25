/**
 * Monetization configuration
 * 
 * This file contains the configuration for the monetization system.
 * Currently, all features are free. This structure allows easy
 * addition of premium features in the future.
 */

import type { MonetizationConfig, FeatureFlag, PurchaseItem } from './types';

/**
 * Default feature flags
 * All features are currently free
 */
export const DEFAULT_FEATURES: FeatureFlag[] = [
  {
    id: 'all_games',
    name: 'All Games',
    description: 'Access to all educational games',
    enabled: true,
  },
  {
    id: 'unlimited_play',
    name: 'Unlimited Play',
    description: 'Play games without limits',
    enabled: true,
  },
  {
    id: 'progress_tracking',
    name: 'Progress Tracking',
    description: 'Track learning progress and statistics',
    enabled: true,
  },
  {
    id: 'achievements',
    name: 'Achievements',
    description: 'Unlock achievements and badges',
    enabled: true,
  },
  {
    id: 'adaptive_difficulty',
    name: 'Adaptive Difficulty',
    description: 'Automatic difficulty adjustment',
    enabled: true,
  },
  {
    id: 'offline_mode',
    name: 'Offline Mode',
    description: 'Play games without internet connection',
    enabled: true,
  },
  {
    id: 'multiple_profiles',
    name: 'Multiple Profiles',
    description: 'Create multiple player profiles',
    enabled: true,
  },
  {
    id: 'export_data',
    name: 'Export Data',
    description: 'Export progress and statistics',
    enabled: true,
  },
];

/**
 * Default purchase items
 * Currently empty - can be populated when monetization is implemented
 */
export const DEFAULT_PURCHASE_ITEMS: PurchaseItem[] = [
  // Example structure for future use:
  // {
  //   id: 'premium_monthly',
  //   name: 'Premium Monthly',
  //   description: 'Premium features for one month',
  //   price: 4.99,
  //   currency: 'EUR',
  //   type: 'subscription',
  // },
];

/**
 * Default monetization configuration
 */
export const DEFAULT_MONETIZATION_CONFIG: MonetizationConfig = {
  enabled: false, // Monetization is currently disabled
  subscriptionTiers: ['free', 'premium', 'family'],
  features: DEFAULT_FEATURES,
  purchaseItems: DEFAULT_PURCHASE_ITEMS,
};
