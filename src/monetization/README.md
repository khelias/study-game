# Monetization System

## Ülevaade

Monetization süsteem on struktureeritud ja valmis, aga praegu on kõik funktsioonid tasuta. See struktuur võimaldab lihtsat monetization süsteemi lisamist tulevikus.

## Struktuur

```
monetization/
├── types.ts      # TypeScript tüübid
├── config.ts     # Konfiguratsioon ja feature flags
├── store.ts      # Zustand store monetization state'ile
├── hooks.ts      # React hooks
└── README.md     # See fail
```

## Praegune Olek

**Kõik funktsioonid on praegu tasuta!**

Monetization on:
- ✅ Struktureeritud
- ✅ Type-safe
- ✅ Testitav
- ❌ Mitte aktiveeritud (kõik on tasuta)

## Feature Flags

Funktsioonid on määratletud feature flag'idega:

- `all_games` - Kõik mängud
- `unlimited_play` - Piiramatu mängimine
- `progress_tracking` - Progressi jälgimine
- `achievements` - Saavutused
- `adaptive_difficulty` - Adaptiivne raskusaste
- `offline_mode` - Offline režiim
- `multiple_profiles` - Mitmed profiilid
- `export_data` - Andmete eksport

Praegu on kõik need funktsioonid **tasuta** ja **aktiveeritud**.

## Subscription Tiers

Süsteem toetab kolme subscription tier'i:

- `free` - Tasuta (praegu kõik)
- `premium` - Premium (tulevikus)
- `family` - Pere (tulevikus)

## Kasutamine

### Hook'ide Kasutamine

```tsx
import { useHasFeature, useSubscriptionTier } from '../monetization/hooks';

function MyComponent() {
  const hasPremium = useHasFeature('premium_games');
  const tier = useSubscriptionTier();
  
  if (hasPremium) {
    // Näita premium sisu
  }
}
```

### Store'i Kasutamine

```tsx
import { useMonetizationStore } from '../monetization/store';

function MyComponent() {
  const hasFeature = useMonetizationStore(state => 
    state.hasFeature('premium_games')
  );
  
  const subscription = useMonetizationStore(state => state.subscription);
}
```

## Tuleviku Implementatsioon

Kui monetization on vaja aktiveerida:

1. **Aktiveeri monetization** `config.ts`:
   ```ts
   enabled: true
   ```

2. **Lisa feature flags** mis nõuavad subscription'i:
   ```ts
   {
     id: 'premium_games',
     requiresSubscription: 'premium',
     enabled: false, // Tasuta kasutajad ei näe
   }
   ```

3. **Integreeri maksesüsteem**:
   - Stripe
   - PayPal
   - Apple In-App Purchase
   - Google Play Billing

4. **Lisa subscription management UI**

5. **Lisa analytics** ostude jälgimiseks

## Struktuur

### Types

- `SubscriptionTier` - Subscription tase
- `FeatureFlag` - Feature flag definitsioon
- `SubscriptionStatus` - Subscription olek
- `PurchaseItem` - Ostu üksus
- `MonetizationConfig` - Konfiguratsioon
- `MonetizationState` - State

### Store

Zustand store haldab:
- Subscription olekut
- Ostetud üksusi
- Saadaolevaid funktsioone

### Hooks

- `useHasFeature(featureId)` - Kas funktsioon on saadaval
- `useSubscriptionTier()` - Praegune subscription tase
- `useIsSubscriptionActive()` - Kas subscription on aktiivne

## Best Practices

1. **Alati kontrolli feature flags** enne premium sisu näitamist
2. **Kasuta hooks** React komponentides
3. **Ära hardcode'i** premium kontrolli
4. **Testi** kõiki monetization funktsioone

## Märkused

- Monetization on praegu **mitte aktiveeritud**
- Kõik funktsioonid on **tasuta**
- Struktuur on **valmis** tulevikuks
- **Ei ole vaja** midagi muuta praegu

## Tulevik

Võimalikud laiendused:
- [ ] Subscription management
- [ ] Payment integration
- [ ] Analytics
- [ ] A/B testing
- [ ] Promotional campaigns
