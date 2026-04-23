/**
 * Monetization store
 *
 * This store manages monetization state using Zustand.
 * Currently, all features are free. The structure is ready
 * for future monetization implementation.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { MonetizationState, SubscriptionTier } from './types';
import { DEFAULT_MONETIZATION_CONFIG } from './config';

const APP_KEY_MONETIZATION = 'smart_adv_monetization_v1';

/**
 * Default monetization state
 */
const createDefaultState = (): MonetizationState => ({
  subscription: {
    tier: 'free',
    isActive: true,
    features: DEFAULT_MONETIZATION_CONFIG.features.filter((f) => f.enabled).map((f) => f.id),
  },
  purchasedItems: [],
  availableFeatures: DEFAULT_MONETIZATION_CONFIG.features.filter((f) => f.enabled).map((f) => f.id),
});

export interface MonetizationStore extends MonetizationState {
  // Actions
  setSubscription: (tier: SubscriptionTier, expiresAt?: number) => void;
  addPurchasedItem: (itemId: string) => void;
  removePurchasedItem: (itemId: string) => void;
  hasFeature: (featureId: string) => boolean;
  reset: () => void;
}

export const useMonetizationStore = create<MonetizationStore>()(
  persist(
    (set, get) => ({
      ...createDefaultState(),

      setSubscription: (tier: SubscriptionTier, expiresAt?: number) => {
        const config = DEFAULT_MONETIZATION_CONFIG;
        const features = config.features
          .filter((f) => !f.requiresSubscription || f.requiresSubscription === tier)
          .map((f) => f.id);

        set({
          subscription: {
            tier,
            isActive: true,
            expiresAt,
            features,
          },
          availableFeatures: features,
        });
      },

      addPurchasedItem: (itemId: string) => {
        const state = get();
        if (!state.purchasedItems.includes(itemId)) {
          set({
            purchasedItems: [...state.purchasedItems, itemId],
          });
        }
      },

      removePurchasedItem: (itemId: string) => {
        const state = get();
        set({
          purchasedItems: state.purchasedItems.filter((id) => id !== itemId),
        });
      },

      hasFeature: (featureId: string) => {
        const state = get();
        return state.availableFeatures.includes(featureId);
      },

      reset: () => {
        set(createDefaultState());
      },
    }),
    {
      name: APP_KEY_MONETIZATION,
      partialize: (state) => ({
        subscription: state.subscription,
        purchasedItems: state.purchasedItems,
        availableFeatures: state.availableFeatures,
      }),
    },
  ),
);
