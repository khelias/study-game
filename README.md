# Smart Games 🎮

Educational web game for children aged 5-8, helping them practice reading, math, and logic in a playful way.

## 📋 Contents

- [Overview](#overview)
- [Features](#features)
- [Games](#games)
- [Installation](#installation)
- [Usage](#usage)
- [Development](#development)
- [Project Structure](#project-structure)
- [Technologies](#technologies)

## 🎯 Overview

**Smart Games** is an interactive educational game offering 14 different games across two age profiles:
- **5+ (Starter)** - For preschoolers and 1st grade beginners
- **1st Grade+ (Advanced)** - For more experienced students

The game uses adaptive difficulty that automatically adjusts task complexity based on player performance.

## ✨ Features

### 🎮 Games

#### Starter profile (5+)
1. **WORD MASTER** - Building words from letters
2. **SYLLABLE MASTER** - Building words from syllables
3. **PATTERN TRAIN** - Pattern recognition and continuation
4. **SENTENCE DETECTIVE** - Logical thinking practice
5. **MATH MEMORY** - Math memory game
6. **ROBO PATH** - Programming basics
7. **LETTER DETECTIVE** - Letter recognition

#### Advanced profile (1st grade+)
1. **BALANCE SCALE** - Mathematical logic practice
2. **CLOCK GAME** - Learning to tell time
3. **MATH MEMORY** (enhanced) - Harder math tasks
4. **ROBO PATH** (enhanced) - More complex programming tasks
5. **SENTENCE DETECTIVE** (enhanced) - More complex logic tasks
6. **PATTERN TRAIN** (enhanced) - More complex patterns
7. **LETTER DETECTIVE** (enhanced) - More complex letter tasks

### 🌟 Key Enhancements

- **Adaptive difficulty** - The game tracks player performance and automatically adjusts difficulty
- **Progression system** - Each correct answer gives a star, 5 stars level up
- **Achievement system** - Medals and achievements encourage continued play
- **Statistics** - Detailed tracking of games played, accuracy, and progress
- **Educational tips** - Instructions and hints for playing games
- **Enhanced feedback** - Diverse encouragement and positive feedback
- **Accessibility** - WCAG 2.1 AA compliance, keyboard support, screen reader support
- **Responsive design** - Works on all devices (computer, tablet, phone)
- **Internationalization** - Supports Estonian (default) and English with easy language switching

## 🚀 Installation

### Requirements

- **Node.js** 18 or newer
- **npm** or **yarn** package manager

### Steps

1. **Clone repository**
   ```bash
   git clone https://github.com/khelias/study-game.git
   cd study-game
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run development server**
   ```bash
   npm run dev
   ```
   The game opens in browser at `http://localhost:5173`

4. **Build for production**
   ```bash
   npm run build
   ```
   Build result is in `dist/` folder.

### Automatic Deploy to FTP Server

The project uses GitHub Actions CI/CD workflow that automatically builds and uploads the application to FTP server on every `main` branch push.

**Setup:**
1. Go to GitHub repository → Settings → Secrets and variables → Actions
2. Add the following secrets:
   - `FTP_SERVER` - FTP server address (e.g., `ftp.example.com`)
   - `FTP_USERNAME` - FTP username
   - `FTP_PASSWORD` - FTP password
3. Change `server-dir` value in `.github/workflows/deploy.yml` file according to your FTP server structure

**Manual execution:**
Workflow can also be run manually from GitHub Actions page.

## 💻 Usage

### Development mode

```bash
npm run dev
```

### Production version

```bash
npm run build
npm run preview
```

### Testing

The project uses **Vitest** testing framework with **React Testing Library**.

```bash
# Run tests in watch mode
npm run test

# Run tests once
npm run test:run

# Run tests with UI (requires @vitest/ui installation)
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

**Test Coverage:**
- Engine (critical logic): 76.58% ✅
- Tested components: 100% ✅
- Testing goals: Engine 80%+, Components 60%+

### Code quality

```bash
npm run lint
```

## 🔧 Development

### Project Structure

```
study-game/
├── public/                 # Static files
│   └── vite.svg
├── src/
│   ├── components/         # React components
│   │   ├── GameViews.tsx   # Game views
│   │   ├── FeedbackSystem.tsx  # Feedback system
│   │   ├── EnhancedAnimations.tsx  # Animations
│   │   ├── AchievementModal.tsx  # Achievement modal
│   │   ├── StatsModal.tsx  # Statistics modal
│   │   └── ...
│   ├── engine/            # Game engine
│   │   ├── adaptiveDifficulty.ts  # Adaptive difficulty
│   │   ├── achievements.ts  # Achievement system
│   │   ├── stats.ts        # Statistics
│   │   ├── audio.ts        # Audio system
│   │   ├── progression.ts  # Progression logic
│   │   └── rng.ts          # Random number generation
│   ├── games/             # Game data
│   │   ├── data.ts        # Game configuration
│   │   └── generators.ts  # Problem generation
│   ├── hooks/             # React hooks
│   │   └── useGameState.ts  # State management
│   ├── utils/             # Utils
│   │   ├── errorHandler.ts  # Error handling
│   │   └── performanceOptimizations.ts  # Performance optimizations
│   ├── i18n/              # Internationalization
│   │   ├── locales/       # Translations
│   │   │   ├── et.ts      # Estonian (default)
│   │   │   └── en.ts      # English
│   │   └── useTranslation.tsx
│   ├── App.tsx            # Main component
│   ├── SmartAdventure.tsx # Main game component
│   └── main.tsx           # Entry point
├── .gitignore
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

### Adding a New Game

1. **Add game configuration** `src/games/data.ts`
   ```typescript
   new_game: {
     id: 'new_game',
     title: 'NEW GAME',
     theme: THEME.blue,
     icon: 'Icon',
     desc: 'Game description',
     allowedProfiles: ['starter'],
     difficulty: 'easy'
   }
   ```

2. **Add generation logic** `src/games/generators.ts`
   ```typescript
   generateNewGame(level, rng) {
     // Generate problem
   }
   ```

3. **Add game view** `src/components/GameViews.tsx`
   ```typescript
   export const NewGameView = ({ problem, onAnswer, ... }) => {
     // Game UI
   }
   ```

4. **Integrate** `src/SmartAdventure.tsx`
   - Add game type to `startGame` function
   - Add view rendering

### Adaptive Difficulty

The game uses adaptive difficulty that works as follows:

- **Increasing difficulty:**
  - Accuracy > 80% + 3+ consecutive correct answers
  - Raises effective level

- **Decreasing difficulty:**
  - Accuracy < 50% or 3+ consecutive wrong answers
  - Lowers effective level

### State Management

The game uses:
- **Zustand** - State management library
- **LocalStorage** - Saving progress and statistics
- **Custom hooks** - `useGameState` for state management

## 🎨 Technologies

### Frontend

- **React 19.2** - UI framework
- **TypeScript 5.9** - Type-safe JavaScript
- **Vite 7.2** - Build tool and dev server
- **Tailwind CSS 3.4** - CSS framework
- **Lucide React** - Icons
- **Zustand 4.5** - State management

### Development Tools

- **ESLint** - Code quality control
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixes
- **Vitest** - Testing framework

### Accessibility

- **WCAG 2.1 AA** compliance
- **Keyboard navigation** (ESC, Enter, Tab)
- **Screen reader support** (ARIA labels)
- **Focus management**
- **Reduced motion support**
- **High contrast support**

## 📊 Statistics and Progression

The game tracks:
- Number of games played
- Correct/wrong answers
- Best streak
- Highest levels
- Play time
- Collected stars
- Unlocked achievements

All data is saved to LocalStorage and persists across browser sessions.

## 🧪 Testing

### Testing Philosophy

The project follows best testing practices:
- **Behavior, not implementation** - Tests check what code does, not how
- **Fast and isolated** - Tests run quickly (under 10 seconds) and don't depend on each other
- **Deterministic** - Tests use seeded RNG for predictability
- **AAA pattern** - Tests follow Arrange-Act-Assert structure

### Test Suite

#### Engine Tests (Unit Tests)
Highest priority tests for critical business logic:

- **rng.test.ts** (16 tests)
  - Deterministic random number generation
  - Seeded RNG consistency
  - Array element selection
  - Unique ID generation

- **stats.test.ts** (25 tests)
  - Statistics creation and updating
  - Game counting
  - Answer saving and streaks
  - Level and score tracking

- **achievements.test.ts** (19 tests)
  - Achievement unlocking
  - Achievement condition checking
  - Duplicate unlocking prevention

- **adaptiveDifficulty.test.ts** (28 tests)
  - Difficulty adjustment based on performance
  - Consecutive correct/wrong answers
  - Difficulty limits

- **progression.test.ts** (26 tests)
  - Optimal difficulty calculation
  - Progression recommendations
  - Success score calculation

#### Game Logic Tests

- **generators.test.ts** (20 tests)
  - Problem generation (balance_scale, word_builder, pattern)
  - Difficulty progression
  - Seeded RNG consistency
  - Answer validation logic

#### Component Tests (Integration Tests)

- **GameCard.test.tsx** (13 tests)
  - Game info display
  - Click handling
  - Locked state handling
  - Progress display

- **StatsModal.test.tsx** (10 tests)
  - Statistics display
  - Close button functionality
  - Achievement rendering

- **AchievementsModal.test.tsx** (14 tests)
  - Locked/unlocked achievement display
  - Progress display

#### Utility Tests

- **performance.test.ts** (16 tests)
  - Debounce function
  - Throttle function
  - Device detection utilities

### Running Tests

```bash
# Watch mode (for development)
npm run test

# Once (for CI)
npm run test:run

# With coverage report
npm run test:coverage

# With UI (interactive)
npm run test:ui
```

### Coverage Goals

- **Engine**: 80%+ (achieved: 76.58%) ✅
- **Tested Components**: 100% ✅
- **Overall**: Focused on critical functionality

### Adding a New Test

1. Create test file in `__tests__` folder
2. Use consistent naming: `<component>.test.tsx` or `<module>.test.ts`
3. Use test utilities: `src/test/utils.tsx`
4. Follow AAA pattern (Arrange-Act-Assert)
5. Add descriptive test names

**Example:**
```typescript
import { describe, it, expect } from 'vitest';
import { createRng } from '../rng';

describe('createRng', () => {
  it('should create deterministic RNG with seed', () => {
    // Arrange
    const rng1 = createRng(12345);
    const rng2 = createRng(12345);
    
    // Act
    const values1 = [rng1(), rng1(), rng1()];
    const values2 = [rng2(), rng2(), rng2()];
    
    // Assert
    expect(values1).toEqual(values2);
  });
});
```

## 🎯 Educational Value

The game develops:
- **Reading** - Letter, syllable, and word practice
- **Math** - Calculations, logic, telling time
- **Logic** - Pattern recognition, programming basics
- **Memory** - Memory games

## 🌍 Internationalization

The game supports multiple languages:
- **Estonian** (default) - `et.ts`
- **English** - `en.ts`

Language can be changed from the menu. All user-facing strings are translated through the i18n system.

## 🐛 Reporting Issues

If you find a bug or want to suggest something, please open an [issue on GitHub](https://github.com/khelias/study-game/issues).

## 📝 Changes

See [CHANGELOG.md](CHANGELOG.md) file for all changes.

## 📄 License

Private project - all rights reserved.

---

**Version:** 2.1  
**Created:** 2026  
**Last updated:** 2026-01-25
