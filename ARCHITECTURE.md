# Architecture Documentation

## Overview

**Smart Games** is an educational web game built with extensible, testable, and well-structured architecture. This document describes the project architecture, design principles, and best practices.

## Technology Stack

### Core Technologies
- **React 19.2** - UI framework
- **TypeScript 5.9** - Type-safe JavaScript
- **Vite 7.2** - Build tool and dev server
- **Zustand 4.5** - State management
- **Tailwind CSS 3.4** - Utility-first CSS framework
- **Vitest 1.6** - Testing framework
- **ESLint 9.39** - Code quality control

### Development Tools
- **TypeScript ESLint** - TypeScript linting
- **React Testing Library** - Component testing
- **Happy DOM** - DOM implementation for tests

## Project Structure

```
src/
├── components/          # General React components
│   ├── AccessibilityHelpers.tsx
│   ├── AchievementModal.tsx
│   ├── FeedbackSystem.tsx
│   ├── GameCard.tsx
│   └── ...
├── engine/             # Game engine (core logic)
│   ├── __tests__/      # Engine tests
│   ├── achievements.ts
│   ├── adaptiveDifficulty.ts
│   ├── audio.ts
│   ├── errorBoundary.tsx
│   ├── progression.ts
│   ├── rng.ts
│   └── stats.ts
├── features/           # Feature-based structure
│   ├── gameplay/       # Game functions
│   │   ├── GameOverScreen.tsx
│   │   ├── GameRenderer.tsx
│   │   └── GameScreen.tsx
│   ├── menu/          # Menu functions
│   │   └── MenuScreen.tsx
│   └── modals/        # Modal components
│       ├── AchievementsModal.tsx
│       ├── StatsModal.tsx
│       └── TutorialModal.tsx
├── games/             # Game data and logic
│   ├── __tests__/
│   ├── data.ts        # Game configuration
│   └── generators.ts  # Problem generation
├── hooks/             # React hooks
│   ├── __tests__/
│   ├── useAchievements.ts
│   ├── useGameAudio.ts
│   ├── useGameEngine.ts
│   ├── useGameState.ts
│   └── useLocalStorage.ts
├── i18n/              # Internationalization
│   ├── locales/       # Translations
│   │   ├── et.ts      # Estonian (default)
│   │   └── en.ts      # English
│   ├── index.ts       # i18n core
│   └── useTranslation.tsx
├── monetization/      # Monetization system (for future)
│   ├── config.ts
│   ├── hooks.ts
│   ├── store.ts
│   └── types.ts
├── stores/            # Zustand stores
│   ├── __tests__/
│   ├── gameStore.ts   # Main game state
│   └── playSessionStore.ts  # Session state
├── types/             # TypeScript types
│   ├── achievement.ts
│   ├── game.ts
│   ├── profile.ts
│   └── stats.ts
├── utils/             # Utilities
│   ├── __tests__/
│   ├── errorHandler.ts
│   ├── performance.ts
│   └── performanceOptimizations.ts
├── test/              # Test utilities
│   ├── setup.ts
│   └── utils.tsx
├── App.tsx            # Main component
└── main.tsx           # Entry point
```

## Architecture Principles

### 1. Separation of Concerns

The project is clearly divided into different layers:

- **Presentation Layer** (`components/`, `features/`) - UI components
- **Business Logic Layer** (`engine/`, `games/`) - Business logic
- **State Management Layer** (`stores/`) - State management
- **Data Layer** (`games/data.ts`) - Data and configuration

### 2. Feature-Based Structure

Larger features are organized under `features/` folder:
- Each feature is independent and contains all necessary components
- This allows easy extension and testing

### 3. Type Safety

- All files use TypeScript
- Strict type checking (`strict: true`)
- Types are defined in `types/` folder
- No `any` types (ESLint rule)

### 4. Testability

- **Engine tests** - Critical business logic is tested
- **Component tests** - UI components are tested
- **Test coverage** - 70%+ threshold
- **Deterministic tests** - Seeded RNG

### 5. Internationalization (i18n)

- Translation system is ready for multiple languages
- All strings are separated into translation files
- Type-safe translations
- Easy addition of new languages

### 6. Monetization Ready

- Monetization structure is ready
- Feature flags system
- Subscription tiers
- All features are currently free

## State Management

### Zustand Stores

The project uses two main stores:

#### `gameStore` (Persistent)
- **Profile** - Selected age profile
- **Levels** - Each game's level
- **Statistics** - Game statistics
- **Achievements** - Unlocked achievements
- **Settings** - Sound, score, etc.

**Persistence**: LocalStorage (Zustand persist middleware)

#### `playSessionStore` (Session)
- **Game state** - menu/playing/game_over
- **Current problem** - Currently played problem
- **Session data** - Score, hearts, stars
- **Adaptive difficulty** - Session difficulty level

**Persistence**: Not saved (only during session)

### State Flow

```
User Action → Component → Store Action → State Update → Component Re-render
```

## Game Engine

### Core Modules

#### `rng.ts` - Random Number Generation
- Deterministic RNG (seeded)
- Testable and reproducible
- Used for problem generation

#### `adaptiveDifficulty.ts` - Adaptive Difficulty
- Tracks player performance
- Automatically adjusts difficulty
- Based on accuracy and answer streaks

#### `progression.ts` - Progression Logic
- Calculates optimal difficulty level
- Recommends progression
- Success score calculation

#### `stats.ts` - Statistics
- Game counting
- Answer saving
- Streak tracking
- Level and score tracking

#### `achievements.ts` - Achievements
- Achievement unlocking
- Condition checking
- Duplicate unlocking prevention

#### `audio.ts` - Audio System
- Sound playback
- Audio settings management

## Game Data

### `games/data.ts`
- Game configuration
- Profiles
- Categories
- Word database

### `games/generators.ts`
- Problem generation functions
- Each game type has its own generation function
- Difficulty progression

## Internationalization (i18n)

### Structure

```
i18n/
├── locales/
│   ├── et.ts    # Estonian (default)
│   └── en.ts    # English
├── index.ts     # Core i18n logic
└── useTranslation.tsx  # React hook
```

### Usage

```tsx
import { useTranslation } from '../i18n/useTranslation';

function MyComponent() {
  const t = useTranslation();
  return <div>{t.menu.title}</div>;
}
```

### Adding a New Language

1. Create new file `locales/XX.ts`
2. Add language to `SupportedLocale` type
3. Add translations to `translations` object

## Monetization

### Structure

Monetization system is ready, but currently all features are free.

```
monetization/
├── types.ts      # TypeScript types
├── config.ts     # Configuration
├── store.ts      # Zustand store
└── hooks.ts      # React hooks
```

### Feature Flags

Features are defined with feature flags:
- `all_games` - All games
- `unlimited_play` - Unlimited play
- `progress_tracking` - Progress tracking
- `achievements` - Achievements
- etc.

### Future

When monetization is needed, you can:
- Add subscription tiers
- Activate feature flags
- Integrate payment systems

## Testing

### Test Structure

- **Engine tests** - Critical logic
- **Component tests** - UI components
- **Utility tests** - Utilities

### Test Coverage

- **Engine**: 76.58% (goal: 80%+)
- **Components**: 100%
- **Overall**: Focused on critical functionality

### Testing Philosophy

- **Behavior, not implementation** - Tests check what code does
- **Fast and isolated** - Tests run quickly
- **Deterministic** - Seeded RNG
- **AAA pattern** - Arrange-Act-Assert

## Code Quality

### ESLint

- **Strict rules** - Strict rules
- **TypeScript ESLint** - Type checking
- **React hooks** - Hooks rules
- **No unused vars** - Unused variables

### TypeScript

- **Strict mode** - Strict type checking
- **No any** - Doesn't allow `any` types
- **No unused locals** - Doesn't allow unused variables
- **No unchecked indexed access** - Safe array access

### Code Style

- **Consistent naming** - Consistent naming
- **Comments** - Documented functions
- **Type safety** - Type-safe code

## Extensibility

### Adding a New Game

1. **Add game configuration** `games/data.ts`
2. **Add generation logic** `games/generators.ts`
3. **Add game view** `components/GameViews.tsx`
4. **Integrate** `features/gameplay/GameRenderer.tsx`

### Adding a New Feature

1. **Create feature folder** `features/new-feature/`
2. **Add necessary components**
3. **Add state management** (if needed)
4. **Add tests**

### Adding a New Language

1. **Create translation file** `i18n/locales/XX.ts`
2. **Add language** to `SupportedLocale` type
3. **Add translations** to `translations` object

## Performance

### Optimizations

- **React.memo** - Component memoization
- **useCallback** - Function memoization
- **useMemo** - Value memoization
- **Code splitting** - Vite automatic code splitting
- **Lazy loading** - When needed

### Performance Utilities

- `utils/performance.ts` - Performance utilities
- `utils/performanceOptimizations.ts` - Optimizations

## Accessibility

### WCAG 2.1 AA Compliance

- **Keyboard navigation** - Keyboard support
- **Screen reader support** - ARIA labels
- **Focus management** - Focus management
- **Reduced motion** - Animation control
- **High contrast** - High contrast

## Deployment

### Build Process

1. **Lint** - Code quality check
2. **Build** - Vite build
3. **Test** - Run tests (if needed)

### CI/CD

GitHub Actions workflow:
- Automatic build
- Lint check
- FTP deploy

## Future Plans

### Possible Extensions

1. **Multi-language support** - ✅ Ready (i18n system)
2. **Monetization** - ✅ Structure ready
3. **Backend integration** - Possible in future
4. **Multiplayer** - Possible in future
5. **Analytics** - Possible in future

### Improvements

- Increase test coverage (80%+ engine)
- Add more accessibility features
- Optimize performance
- Add more games

## Conclusion

The project is well-structured, extensible, and testable. The architecture supports:
- ✅ Multi-language support (i18n)
- ✅ Monetization system (structure)
- ✅ Extensibility
- ✅ Testability
- ✅ Code quality
- ✅ Accessibility

Everything is ready for future development and expansion!
