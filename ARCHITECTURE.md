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
├── components/          # React components
│   ├── gameViews/      # Individual game view components
│   │   ├── BalanceScaleView.tsx
│   │   ├── StandardGameView.tsx
│   │   ├── WordGameView.tsx
│   │   ├── SyllableGameView.tsx
│   │   ├── PatternTrainView.tsx
│   │   ├── MemoryGameView.tsx
│   │   ├── RoboPathView.tsx
│   │   ├── TimeGameView.tsx
│   │   ├── UnitConversionView.tsx
│   │   └── index.ts
│   ├── shared/         # Shared/reusable components
│   │   ├── LevelUpModal.tsx
│   │   ├── Confetti.tsx
│   │   ├── TimeDisplay.tsx
│   │   ├── SvgWeight.tsx
│   │   └── index.ts
│   ├── AccessibilityHelpers.tsx
│   ├── FeedbackSystem.tsx
│   ├── GameCard.tsx
│   ├── GameHeader.tsx
│   ├── SettingsMenu.tsx
│   └── ...
├── engine/             # Game engine (core logic)
│   ├── __tests__/      # Engine tests
│   ├── achievements.ts
│   ├── adaptiveDifficulty.ts
│   ├── answerHandler.ts # Answer processing logic
│   ├── audio.ts
│   ├── errorBoundary.tsx
│   ├── mathSnake.ts
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
│   ├── generators.ts  # Problem generation
│   ├── registry.ts     # Game registry system
│   ├── registrations.ts # Game auto-registration
│   └── validators.ts  # Answer validation functions
├── hooks/             # React hooks
│   ├── __tests__/
│   ├── useAchievements.ts
│   ├── useAnswerHandler.ts # Answer handling logic
│   ├── useGameAudio.ts
│   ├── useGameEngine.ts
│   ├── useGameHints.ts    # Hint generation logic
│   ├── useGameState.ts
│   ├── useGameTips.ts     # Tip display logic
│   ├── useLocalStorage.ts
│   └── useProfileText.ts
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
│   ├── notification.ts
│   ├── profile.ts
│   └── stats.ts
├── utils/             # Utilities
│   ├── __tests__/
│   ├── achievementCopy.ts
│   ├── errorHandler.ts
│   ├── performance.ts
│   ├── performanceOptimizations.ts
│   ├── unitConversion.ts
│   └── zIndex.ts
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

### 3. Modular Component Architecture

Components are organized by purpose:
- **`components/gameViews/`** - Individual game view components (one per game type)
- **`components/shared/`** - Reusable components used across multiple features
- **`components/`** - General-purpose UI components

This modular structure makes it easy to:
- Find specific game implementations
- Reuse shared components
- Maintain and test individual components
- Add new games without touching existing code

### 4. Type Safety

- All files use TypeScript
- Strict type checking (`strict: true`)
- Types are defined in `types/` folder
- No `any` types (ESLint rule)

### 5. Testability

- **Engine tests** - Critical business logic is tested
- **Component tests** - UI components are tested
- **Test coverage** - 70%+ threshold
- **Deterministic tests** - Seeded RNG

### 6. Internationalization (i18n)

- Translation system is ready for multiple languages
- All strings are separated into translation files
- Type-safe translations
- Easy addition of new languages

### 7. Monetization Ready

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
- **Notifications** - In-game notifications

**Persistence**: Not saved (only during session)

### State Flow

```
User Action → Component → Hook/Store Action → State Update → Component Re-render
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

#### `answerHandler.ts` - Answer Processing
- Pure business logic for processing game answers
- Handles math snake and standard game types
- Returns structured results for UI coordination
- Testable and reusable

#### `mathSnake.ts` - Math Snake Game Logic
- Snake movement and collision detection
- Apple spawning logic
- Math challenge generation
- Game state resolution

#### `audio.ts` - Audio System
- Sound playback
- Audio settings management

## Custom Hooks

### Game Logic Hooks

#### `useAnswerHandler` - Answer Handling
- Encapsulates answer processing logic
- Coordinates between engine and UI
- Handles achievements, scoring, and feedback
- Manages game state transitions

#### `useGameHints` - Hint Generation
- Generates hints for different game types
- Handles hint display logic
- Game-type-specific hint content

#### `useGameTips` - Tip Display
- Manages tip display logic
- Shows tips once per session
- Allows manual tip replay
- Responsive layout awareness

#### `useGameEngine` - Game Engine
- Problem generation
- Answer validation
- RNG access

#### `useGameAudio` - Audio
- Sound effect playback
- Respects user preferences

### State Management Hooks

#### `useGameState` - Game State
- Unified game state access
- Combines store selectors

#### `useAchievements` - Achievements
- Achievement tracking
- Achievement display logic

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

### `games/registry.ts`
- Centralized game registry system
- Enables zero-touch game addition
- Supports dynamic game loading
- Scales to 50+ games without code bloat

### `games/registrations.ts`
- Auto-registration of all games
- Runs automatically on import
- Registers games with their components, generators, validators, and configs

### `games/validators.ts`
- Answer validation functions for each game type
- Pure functions that validate user answers
- Type-safe validation logic

## Component Architecture

### Game Views

Each game type has its own view component in `components/gameViews/`:
- **BalanceScaleView** - Balance scale problems
- **StandardGameView** - Sentence logic and letter match
- **WordGameView** - Word builder
- **SyllableGameView** - Syllable builder
- **PatternTrainView** - Pattern recognition
- **MemoryGameView** - Memory math matching
- **RoboPathView** - Robot path programming
- **TimeGameView** - Time matching
- **UnitConversionView** - Unit conversion

### Shared Components

Reusable components in `components/shared/`:
- **LevelUpModal** - Level up celebration
- **Confetti** - Confetti animation
- **TimeDisplay** - Analog clock display
- **SvgWeight** - SVG weight for balance scale

### UI Components

General-purpose components:
- **GameHeader** - Game screen header with score, level, hearts, stars
- **SettingsMenu** - Settings dropdown menu
- **GameCard** - Game selection card
- **FeedbackSystem** - Feedback and notifications
- **NotificationSystem** - Unified notification display

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

The game registry system makes adding new games simple and scalable:

1. **Add game configuration** `games/data.ts`
   ```typescript
   new_game: {
     id: 'new_game',
     title: 'NEW GAME',
     theme: THEME.blue,
     icon: 'Icon',
     desc: 'Game description',
     allowedProfiles: ['starter'],
     difficulty: 'easy',
     category: 'logic'
   }
   ```

2. **Add generation logic** `games/generators.ts`
   ```typescript
   new_game: (level, rng, profile) => {
     // Generate problem
     return { type: 'new_game', ... };
   }
   ```

3. **Create validator** `games/validators.ts`
   ```typescript
   export const validateNewGame: AnswerValidator = (problem, userAnswer) => {
     if (problem.type !== 'new_game') return false;
     return userAnswer === problem.answer;
   };
   ```

4. **Create game view component** `components/gameViews/NewGameView.tsx`
   ```typescript
   export const NewGameView: React.FC<NewGameViewProps> = ({ 
     problem, 
     onAnswer, 
     soundEnabled 
   }) => {
     // Game UI
   };
   ```

5. **Register the game** `games/registrations.ts`
   ```typescript
   gameRegistry.register({
     id: 'new_game',
     component: NewGameView,
     generator: Generators.new_game,
     config: GAME_CONFIG.new_game,
     validator: validateNewGame,
     allowedProfiles: GAME_CONFIG.new_game.allowedProfiles,
   });
   ```

6. **Add translations** `i18n/locales/et.ts` and `en.ts`

**Note:** No need to modify `GameRenderer.tsx` anymore! The registry automatically handles game rendering.

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
- ✅ Game registry system (scales to 50+ games)
- ✅ Extensibility
- ✅ Testability
- ✅ Code quality
- ✅ Accessibility
- ✅ Scalable component architecture
- ✅ Modular game views
- ✅ Zero-touch game addition

Everything is ready for future development and expansion!
