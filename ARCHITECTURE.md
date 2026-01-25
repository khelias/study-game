# Arhitektuuri Dokumentatsioon

## Ülevaade

**Tarkade Mängud** on hariduslik veebimäng, mis on loodud laiendatavaks, testitavaks ja hästi struktureeritud arhitektuuriga. See dokument kirjeldab projekti arhitektuuri, disainipõhimõtteid ja parimaid praktikaid.

## Tehnoloogiline Stack

### Core Technologies
- **React 19.2** - UI raamistik
- **TypeScript 5.9** - Tüübiturvaline JavaScript
- **Vite 7.2** - Build tool ja dev server
- **Zustand 4.5** - State management
- **Tailwind CSS 3.4** - Utility-first CSS raamistik
- **Vitest 1.6** - Testiraamistik
- **ESLint 9.39** - Koodi kvaliteedi kontroll

### Arendustööriistad
- **TypeScript ESLint** - TypeScript linting
- **React Testing Library** - Komponentide testimine
- **Happy DOM** - DOM implementatsioon testide jaoks

## Projekti Struktuur

```
src/
├── components/          # Üldised React komponendid
│   ├── AccessibilityHelpers.tsx
│   ├── AchievementModal.tsx
│   ├── FeedbackSystem.tsx
│   ├── GameCard.tsx
│   └── ...
├── engine/             # Mängu mootor (core logic)
│   ├── __tests__/      # Engine testid
│   ├── achievements.ts
│   ├── adaptiveDifficulty.ts
│   ├── audio.ts
│   ├── errorBoundary.tsx
│   ├── progression.ts
│   ├── rng.ts
│   └── stats.ts
├── features/           # Feature-based struktuur
│   ├── gameplay/       # Mängu funktsioonid
│   │   ├── GameOverScreen.tsx
│   │   ├── GameRenderer.tsx
│   │   └── GameScreen.tsx
│   ├── menu/          # Menüü funktsioonid
│   │   └── MenuScreen.tsx
│   └── modals/        # Modal komponendid
│       ├── AchievementsModal.tsx
│       ├── StatsModal.tsx
│       └── TutorialModal.tsx
├── games/             # Mängu andmed ja loogika
│   ├── __tests__/
│   ├── data.ts        # Mängu konfiguratsioon
│   └── generators.ts  # Ülesannete genereerimine
├── hooks/             # React hooks
│   ├── __tests__/
│   ├── useAchievements.ts
│   ├── useGameAudio.ts
│   ├── useGameEngine.ts
│   ├── useGameState.ts
│   └── useLocalStorage.ts
├── i18n/              # Internationalization
│   ├── locales/       # Tõlked
│   │   ├── et.ts      # Eesti keel
│   │   └── en.ts      # Inglise keel
│   ├── index.ts       # i18n core
│   └── useTranslation.tsx
├── monetization/      # Monetization süsteem (tulevikuks)
│   ├── config.ts
│   ├── hooks.ts
│   ├── store.ts
│   └── types.ts
├── stores/            # Zustand stores
│   ├── __tests__/
│   ├── gameStore.ts   # Põhiline mängu state
│   └── playSessionStore.ts  # Sessiooni state
├── types/             # TypeScript tüübid
│   ├── achievement.ts
│   ├── game.ts
│   ├── profile.ts
│   └── stats.ts
├── utils/             # Utiliidid
│   ├── __tests__/
│   ├── errorHandler.ts
│   ├── performance.ts
│   └── performanceOptimizations.ts
├── test/              # Test utiliidid
│   ├── setup.ts
│   └── utils.tsx
├── App.tsx            # Põhikomponent
└── main.tsx           # Entry point
```

## Arhitektuuri Põhimõtted

### 1. Separation of Concerns

Projekt on jaotatud selgelt erinevateks kihtideks:

- **Presentation Layer** (`components/`, `features/`) - UI komponendid
- **Business Logic Layer** (`engine/`, `games/`) - Äriloogika
- **State Management Layer** (`stores/`) - State haldus
- **Data Layer** (`games/data.ts`) - Andmed ja konfiguratsioon

### 2. Feature-Based Structure

Suuremad funktsioonid on organiseeritud `features/` kausta alla:
- Iga feature on iseseisev ja sisaldab kõiki vajalikke komponente
- See võimaldab lihtsat laiendamist ja testi

### 3. Type Safety

- Kõik failid kasutavad TypeScript'i
- Range type checking (`strict: true`)
- Tüübid on defineeritud `types/` kaustas
- No `any` types (ESLint reegel)

### 4. Testability

- **Engine testid** - Kriitiline äriloogika on testitud
- **Komponentide testid** - UI komponendid on testitud
- **Test coverage** - 70%+ threshold
- **Deterministlikud testid** - Seeded RNG

### 5. Internationalization (i18n)

- Tõlke süsteem on valmis mitme keele toetamiseks
- Kõik stringid on eraldatud tõlke failidesse
- Type-safe tõlked
- Lihtne uute keelte lisamine

### 6. Monetization Ready

- Monetization struktuur on valmis
- Feature flags süsteem
- Subscription tiers
- Kõik funktsioonid on praegu tasuta

## State Management

### Zustand Stores

Projekt kasutab kahte peamist store'i:

#### `gameStore` (Persistent)
- **Profiil** - Valitud vanuseprofiil
- **Tasemed** - Iga mängu tase
- **Statistika** - Mängu statistika
- **Saavutused** - Avatud saavutused
- **Seaded** - Heli, skoor, jne.

**Persistence**: LocalStorage (Zustand persist middleware)

#### `playSessionStore` (Session)
- **Mängu olek** - menu/playing/game_over
- **Praegune ülesanne** - Hetkel mängitav ülesanne
- **Sessiooni andmed** - Skoor, südamed, tähed
- **Adaptiivne raskus** - Sessiooni raskusaste

**Persistence**: Ei salvestata (ainult sessiooni ajal)

### State Flow

```
User Action → Component → Store Action → State Update → Component Re-render
```

## Mängu Mootor (Engine)

### Core Modules

#### `rng.ts` - Juhuslikkuse genereerimine
- Deterministlik RNG (seeded)
- Testitav ja reprodutseeritav
- Kasutatakse ülesannete genereerimiseks

#### `adaptiveDifficulty.ts` - Adaptiivne raskusaste
- Jälgib mängija jõudlust
- Kohandab raskust automaatselt
- Põhineb täpsuse ja vastuste seeriadel

#### `progression.ts` - Progressiooni loogika
- Arvutab optimaalse raskusastme
- Soovitab progressiooni
- Edukuse skoori arvutamine

#### `stats.ts` - Statistika
- Mängude arvestus
- Vastuste salvestamine
- Seeriaid jälgimine
- Tasemete ja skooride jälgimine

#### `achievements.ts` - Saavutused
- Saavutuste avamine
- Tingimuste kontroll
- Dubleeritud avamiste vältimine

#### `audio.ts` - Heli süsteem
- Helide mängimine
- Heli seadete haldus

## Mängu Andmed

### `games/data.ts`
- Mängu konfiguratsioon
- Profiilid
- Kategooriad
- Sõnade andmebaas

### `games/generators.ts`
- Ülesannete genereerimise funktsioonid
- Iga mängutüüp on oma genereerimise funktsioon
- Raskusastme progressioon

## Internationalization (i18n)

### Struktuur

```
i18n/
├── locales/
│   ├── et.ts    # Eesti keel (default)
│   └── en.ts    # Inglise keel
├── index.ts     # Core i18n logic
└── useTranslation.tsx  # React hook
```

### Kasutamine

```tsx
import { useTranslation } from '../i18n/useTranslation';

function MyComponent() {
  const t = useTranslation();
  return <div>{t.menu.title}</div>;
}
```

### Uue keele lisamine

1. Loo uus fail `locales/XX.ts`
2. Lisa keel `SupportedLocale` tüüpi
3. Lisa tõlked `translations` objekti

## Monetization

### Struktuur

Monetization süsteem on valmis, aga praegu kõik funktsioonid on tasuta.

```
monetization/
├── types.ts      # TypeScript tüübid
├── config.ts     # Konfiguratsioon
├── store.ts      # Zustand store
└── hooks.ts      # React hooks
```

### Feature Flags

Funktsioonid on määratletud feature flag'idega:
- `all_games` - Kõik mängud
- `unlimited_play` - Piiramatu mängimine
- `progress_tracking` - Progressi jälgimine
- `achievements` - Saavutused
- jne.

### Tulevikus

Kui monetization on vaja, saab:
- Lisada subscription tiers
- Aktiveerida feature flags
- Integreerida maksesüsteemid

## Testimine

### Testi Struktuur

- **Engine testid** - Kriitiline loogika
- **Komponentide testid** - UI komponendid
- **Utility testid** - Utiliidid

### Test Coverage

- **Engine**: 76.58% (eesmärk: 80%+)
- **Komponendid**: 100%
- **Kogu**: Keskendutud kriitilisele funktsionaalsusele

### Testimise Filosoofia

- **Käitumine, mitte implementatsioon** - Testid kontrollivad, mida kood teeb
- **Kiired ja isoleeritud** - Testid töötavad kiiresti
- **Deterministlikud** - Seeded RNG
- **AAA muster** - Arrange-Act-Assert

## Koodi Kvaliteet

### ESLint

- **Strict rules** - Range reeglid
- **TypeScript ESLint** - Type checking
- **React hooks** - Hooks reeglid
- **No unused vars** - Kasutamata muutujad

### TypeScript

- **Strict mode** - Range type checking
- **No any** - Ei luba `any` tüüpe
- **No unused locals** - Ei luba kasutamata muutujaid
- **No unchecked indexed access** - Turvaline array access

### Code Style

- **Consistent naming** - Järjekindel nimetamine
- **Comments** - Dokumenteeritud funktsioonid
- **Type safety** - Tüübiturvaline kood

## Laiendatavus

### Uue Mängu Lisamine

1. **Lisa mängu konfiguratsioon** `games/data.ts`
2. **Lisa genereerimise loogika** `games/generators.ts`
3. **Lisa mängu vaade** `components/GameViews.tsx`
4. **Integreeri** `features/gameplay/GameRenderer.tsx`

### Uue Funktsiooni Lisamine

1. **Loo feature kaust** `features/new-feature/`
2. **Lisa vajalikud komponendid**
3. **Lisa state management** (vajadusel)
4. **Lisa testid**

### Uue Keele Lisamine

1. **Loo tõlke fail** `i18n/locales/XX.ts`
2. **Lisa keel** `SupportedLocale` tüüpi
3. **Lisa tõlked** `translations` objekti

## Performance

### Optimizations

- **React.memo** - Komponentide memoization
- **useCallback** - Funktsioonide memoization
- **useMemo** - Väärtuste memoization
- **Code splitting** - Vite automaatne code splitting
- **Lazy loading** - Vajadusel

### Performance Utilities

- `utils/performance.ts` - Performance utiliidid
- `utils/performanceOptimizations.ts` - Optimizations

## Accessibility

### WCAG 2.1 AA Compliance

- **Keyboard navigation** - Klaviatuuritugi
- **Screen reader support** - ARIA labels
- **Focus management** - Fookuse haldus
- **Reduced motion** - Animatsioonide kontroll
- **High contrast** - Kõrge kontrastsus

## Deployment

### Build Process

1. **Lint** - Koodi kvaliteedi kontroll
2. **Build** - Vite build
3. **Test** - Testide käivitamine (vajadusel)

### CI/CD

GitHub Actions workflow:
- Automaatne build
- Lint kontroll
- FTP deploy

## Tuleviku Plaanid

### Võimalikud Laiendused

1. **Mitme keele tugi** - ✅ Valmis (i18n süsteem)
2. **Monetization** - ✅ Struktuur valmis
3. **Backend integratsioon** - Võimalik tulevikus
4. **Multiplayer** - Võimalik tulevikus
5. **Analytics** - Võimalik tulevikus

### Parandused

- Suurenda test coverage (80%+ engine)
- Lisa rohkem accessibility funktsioone
- Optimeeri performance
- Lisa rohkem mänge

## Järeldus

Projekt on hästi struktureeritud, laiendatav ja testitav. Arhitektuur toetab:
- ✅ Mitme keele tuge (i18n)
- ✅ Monetization süsteemi (struktuur)
- ✅ Laiendatavust
- ✅ Testitavust
- ✅ Koodi kvaliteeti
- ✅ Accessibility

Kõik on valmis tulevikuks arendamiseks ja laiendamiseks!
