import { create } from 'zustand';
import { createAdaptiveDifficulty, updateAdaptiveDifficulty as updateDifficulty } from '../engine/adaptiveDifficulty';
import type { Problem } from '../types/game';
import type { Notification, NotificationInput } from '../types/notification';

type GameState = 'menu' | 'playing' | 'game_over';

interface AdaptiveDifficulty {
  recentAccuracy: boolean[];
  averageResponseTime: number[];
  consecutiveCorrect: number;
  consecutiveWrong: number;
  difficultyMultiplier: number;
  levelAdjustment: number;
}

export interface LevelProgress {
  correctAnswers: number;
  totalAnswers: number;
  levelStartedAt: number; // Timestamp when level started
}

export interface PlaySessionStore {
  // State
  gameState: GameState;
  gameType: string | null;
  problem: Problem | null;
  score: number;
  // hearts removed - now using gameStore.hearts (persistent global resource)
  // stars removed - now using gameStore.stars (persistent currency)
  currentStreak: number;
  adaptiveDifficulty: AdaptiveDifficulty;
  levelProgress: LevelProgress | null; // Tracks progress toward next level
  
  // New unified notification system
  notifications: Notification[];
  
  bgClass: string;
  confetti: boolean;
  enhancedConfetti: boolean;
  particleActive: boolean;
  gameStartTime: number | null;
  showHint: boolean;
  
  // Actions
  startGame: (gameType: string) => void;
  setProblem: (problem: Problem | null) => void;
  submitAnswer: (isCorrect: boolean) => void;
  endGame: () => void;
  resumeGame: () => void; // Back to playing without resetting problem/score (e.g. after buying hearts)
  returnToMenu: () => void;
  
  // New notification system actions
  addNotification: (notification: NotificationInput) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
  
  setBgClass: (bgClass: string) => void;
  setConfetti: (confetti: boolean) => void;
  setEnhancedConfetti: (enhanced: boolean) => void;
  setParticleActive: (active: boolean) => void;
  setShowHint: (show: boolean) => void;
  updateAdaptiveDifficulty: (isCorrect: boolean, responseTime?: number) => void;
  setScore: (score: number) => void;
  addScore: (points: number) => void;
  resetSessionState: () => void;
  recordLevelAnswer: (isCorrect: boolean) => void; // Track answer for level progress
  resetLevelProgress: () => void; // Reset when level changes
}

const initialState = {
  gameState: 'menu' as GameState,
  gameType: null,
  problem: null,
  score: 0,
  // hearts removed - now using gameStore.hearts (persistent global resource)
  // stars removed - now using gameStore.stars (persistent currency)
  currentStreak: 0,
  adaptiveDifficulty: createAdaptiveDifficulty(),
  levelProgress: null as LevelProgress | null,
  
  // New notification system
  notifications: [] as Notification[],
  
  bgClass: 'bg-slate-50',
  confetti: false,
  enhancedConfetti: false,
  particleActive: false,
  gameStartTime: null,
  showHint: false,
};

export const usePlaySessionStore = create<PlaySessionStore>((set, get) => ({
  ...initialState,
  
  // Actions
  startGame: (gameType: string) => {
    set({
      gameType,
      gameState: 'playing',
      problem: null, // Reset problem so new one gets generated
      score: 0, // Reset session score
      bgClass: 'bg-slate-50',
      notifications: [],
      // hearts removed - now using gameStore.hearts (persistent global resource)
      // stars removed - now using gameStore.stars (persistent currency)
      showHint: false,
      currentStreak: 0,
      gameStartTime: Date.now(),
      adaptiveDifficulty: createAdaptiveDifficulty(),
      levelProgress: {
        correctAnswers: 0,
        totalAnswers: 0,
        levelStartedAt: Date.now(),
      },
      confetti: false,
      enhancedConfetti: false,
      particleActive: false,
    });
  },
  
  setProblem: (problem: Problem | null) => {
    // Clone nested arrays to ensure React detects changes
    if (problem) {
      const clonedProblem: Problem = { ...problem };
      
      // Clone arrays that React might compare by reference
      if (problem.type === 'word_builder' && 'shuffled' in problem) {
        (clonedProblem as typeof problem).shuffled = [...(problem.shuffled || [])];
      }
      if (problem.type === 'syllable_builder' && 'shuffled' in problem) {
        (clonedProblem as typeof problem).shuffled = [...(problem.shuffled || [])];
      }
      if (problem.type === 'memory_math' && 'cards' in problem) {
        (clonedProblem as typeof problem).cards = [...(problem.cards || [])];
      }
      if (problem.type === 'pattern' && 'sequence' in problem) {
        (clonedProblem as typeof problem).sequence = [...(problem.sequence || [])];
        (clonedProblem as typeof problem).options = [...(problem.options || [])];
      }
      if (problem.type === 'balance_scale' && 'display' in problem) {
        (clonedProblem as typeof problem).display = {
          ...problem.display,
          left: [...(problem.display.left || [])],
          right: [...(problem.display.right || [])],
        };
        (clonedProblem as typeof problem).options = [...(problem.options || [])];
      }
      if (problem.type === 'robo_path' && 'grid' in problem) {
        (clonedProblem as typeof problem).grid = problem.grid.map(row => [...row]);
        (clonedProblem as typeof problem).obstacles = problem.obstacles.map(obs => [...obs] as [number, number]);
      }
      if (problem.type === 'math_snake' && 'snake' in problem) {
        (clonedProblem as typeof problem).snake = problem.snake.map(pos => [...pos] as [number, number]);
      }
      if (problem.type === 'battlelearn' && 'ships' in problem) {
        // Clone BattleLearn-specific arrays
        (clonedProblem as typeof problem).revealed = problem.revealed.map(pos => [...pos] as [number, number]);
        (clonedProblem as typeof problem).hits = problem.hits.map(pos => [...pos] as [number, number]);
        (clonedProblem as typeof problem).sunkShips = [...problem.sunkShips];
        (clonedProblem as typeof problem).ships = problem.ships.map(ship => ({
          ...ship,
          positions: ship.positions.map(pos => [...pos] as [number, number]),
        }));
      }
      
      set({ problem: clonedProblem });
    } else {
      set({ problem: null });
    }
  },

  
  submitAnswer: (isCorrect: boolean) => {
    const state = get();
    const newStreak = isCorrect ? state.currentStreak + 1 : 0;
    
    set({ currentStreak: newStreak });
  },
  
  endGame: () => {
    set({ gameState: 'game_over' });
  },

  resumeGame: () => {
    set({ gameState: 'playing' });
  },

  returnToMenu: () => {
    set({
      gameState: 'menu',
      gameType: null,
      problem: null,
      bgClass: 'bg-slate-50',
      notifications: [],
    });
  },
  
  setBgClass: (bgClass: string) => {
    set({ bgClass });
  },
  
  setConfetti: (confetti: boolean) => {
    set({ confetti });
  },
  
  setEnhancedConfetti: (enhanced: boolean) => {
    set({ enhancedConfetti: enhanced });
  },
  
  setParticleActive: (active: boolean) => {
    set({ particleActive: active });
  },
  
  setShowHint: (show: boolean) => {
    set({ showHint: show });
  },
  
  updateAdaptiveDifficulty: (isCorrect: boolean, responseTime?: number) => {
    const state = get();
    const updated = updateDifficulty(state.adaptiveDifficulty, isCorrect, responseTime || null);
    set({ adaptiveDifficulty: updated });
  },
  
  recordLevelAnswer: (isCorrect: boolean) => {
    const state = get();
    if (!state.levelProgress) {
      // Initialize if not set
      set({
        levelProgress: {
          correctAnswers: isCorrect ? 1 : 0,
          totalAnswers: 1,
          levelStartedAt: Date.now(),
        },
      });
      return;
    }
    
    set({
      levelProgress: {
        ...state.levelProgress,
        correctAnswers: state.levelProgress.correctAnswers + (isCorrect ? 1 : 0),
        totalAnswers: state.levelProgress.totalAnswers + 1,
      },
    });
  },
  
  resetLevelProgress: () => {
    set({
      levelProgress: {
        correctAnswers: 0,
        totalAnswers: 0,
        levelStartedAt: Date.now(),
      },
    });
  },
  
  setScore: (score: number) => {
    set({ score });
  },
  
  addScore: (points: number) => {
    set((state) => ({ score: state.score + points }));
  },
  
  resetSessionState: () => {
    set(initialState);
  },
  
  // New notification system actions
  addNotification: (notification: NotificationInput) => {
    const createdAt = Date.now();
    const id = `notification-${createdAt}-${Math.random()}`;
    set((state) => ({
      notifications: [...state.notifications, { ...notification, id, createdAt }],
    }));
  },
  
  removeNotification: (id: string) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    }));
  },
  
  clearNotifications: () => {
    set({ notifications: [] });
  },
}));
