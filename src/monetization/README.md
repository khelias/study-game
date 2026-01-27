# Monetization System

## Overview

The monetization system is structured and ready, but currently all features are free. This structure allows for easy addition of monetization in the future.

## Structure

```
monetization/
├── types.ts      # TypeScript types
├── config.ts     # Configuration and feature flags
├── store.ts      # Zustand store for monetization state
├── hooks.ts      # React hooks
└── README.md     # This file
```

## Current Status

**All features are currently free!**

Monetization is:
- ✅ Structured
- ✅ Type-safe
- ✅ Testable
- ❌ Not activated (everything is free)

## Feature Flags

Features are defined with feature flags:

- `all_games` - All games
- `unlimited_play` - Unlimited play
- `progress_tracking` - Progress tracking
- `achievements` - Achievements
- `adaptive_difficulty` - Adaptive difficulty
- `offline_mode` - Offline mode
- `multiple_profiles` - Multiple profiles
- `export_data` - Data export

Currently, all these features are **free** and **enabled**.

## Subscription Tiers

The system supports three subscription tiers:

- `free` - Free (currently everything)
- `premium` - Premium (future)
- `family` - Family (future)

## Usage

### Using Hooks

```tsx
import { useHasFeature, useSubscriptionTier } from '../monetization/hooks';

function MyComponent() {
  const hasPremium = useHasFeature('premium_games');
  const tier = useSubscriptionTier();
  
  if (hasPremium) {
    // Show premium content
  }
}
```

### Using Store

```tsx
import { useMonetizationStore } from '../monetization/store';

function MyComponent() {
  const hasFeature = useMonetizationStore(state => 
    state.hasFeature('premium_games')
  );
  
  const subscription = useMonetizationStore(state => state.subscription);
}
```

## Future Implementation

When monetization needs to be activated:

1. **Activate monetization** in `config.ts`:
   ```ts
   enabled: true
   ```

2. **Add feature flags** that require subscription:
   ```ts
   {
     id: 'premium_games',
     requiresSubscription: 'premium',
     enabled: false, // Free users won't see
   }
   ```

3. **Integrate payment system**:
   - Stripe
   - PayPal
   - Apple In-App Purchase
   - Google Play Billing

4. **Add subscription management UI**

5. **Add analytics** for purchase tracking

## Structure

### Types

- `SubscriptionTier` - Subscription tier
- `FeatureFlag` - Feature flag definition
- `SubscriptionStatus` - Subscription status
- `PurchaseItem` - Purchase item
- `MonetizationConfig` - Configuration
- `MonetizationState` - State

### Store

Zustand store manages:
- Subscription status
- Purchased items
- Available features

### Hooks

- `useHasFeature(featureId)` - Check if feature is available
- `useSubscriptionTier()` - Current subscription tier
- `useIsSubscriptionActive()` - Check if subscription is active

## Best Practices

1. **Always check feature flags** before showing premium content
2. **Use hooks** in React components
3. **Don't hardcode** premium checks
4. **Test** all monetization features

## Notes

- Monetization is currently **not activated**
- All features are **free**
- Structure is **ready** for the future
- **No changes needed** right now

## Future

Possible extensions:
- [ ] Subscription management
- [ ] Payment integration
- [ ] Analytics
- [ ] A/B testing
- [ ] Promotional campaigns
