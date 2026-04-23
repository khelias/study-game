/**
 * Monetization system types
 *
 * This module defines the types and interfaces for the monetization system.
 * The actual implementation can be added later when needed.
 */

/**
 * Subscription tier
 */
export type SubscriptionTier = 'free' | 'premium' | 'family';

/**
 * Feature flag
 */
export interface FeatureFlag {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  requiresSubscription?: SubscriptionTier;
}

/**
 * Subscription status
 */
export interface SubscriptionStatus {
  tier: SubscriptionTier;
  isActive: boolean;
  expiresAt?: number; // Unix timestamp
  features: string[]; // List of enabled feature IDs
}

/**
 * Purchase item
 */
export interface PurchaseItem {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  type: 'subscription' | 'one-time' | 'consumable';
}

/**
 * Monetization configuration
 */
export interface MonetizationConfig {
  enabled: boolean;
  subscriptionTiers: SubscriptionTier[];
  features: FeatureFlag[];
  purchaseItems: PurchaseItem[];
}

/**
 * Monetization state
 */
export interface MonetizationState {
  subscription: SubscriptionStatus;
  purchasedItems: string[];
  availableFeatures: string[];
}
