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

export interface PlaySessionStore {
  // State
  gameState: GameState;
  gameType: string | null;
  problem: Problem | null;
  score: number;
  hearts: number;
  stars: number;
  currentStreak: number;
  adaptiveDifficulty: AdaptiveDifficulty;
  
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
  incrementStars: () => number;
  resetStars: () => void;
  decrementHearts: () => number;
  setScore: (score: number) => void;
  addScore: (points: number) => void;
  resetSessionState: () => void;
}

const initialState = {
  gameState: 'menu' as GameState,
  gameType: null,
  problem: null,
  score: 0,
  hearts: 3,
  stars: 0,
  currentStreak: 0,
  adaptiveDifficulty: createAdaptiveDifficulty(),
  
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
      bgClass: 'bg-slate-50',
      notifications: [],
      stars: 0,
      hearts: 3,
      showHint: false,
      currentStreak: 0,
      gameStartTime: Date.now(),
      adaptiveDifficulty: createAdaptiveDifficulty(),
    });
  },
  
  setProblem: (problem: Problem | null) => {
    set({ problem });
  },
  
  submitAnswer: (isCorrect: boolean) => {
    const state = get();
    const newStreak = isCorrect ? state.currentStreak + 1 : 0;
    
    set({ currentStreak: newStreak });
  },
  
  endGame: () => {
    set({ gameState: 'game_over' });
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
  
  incrementStars: () => {
    const currentStars = get().stars;
    const newStars = currentStars + 1;
    set({ stars: newStars });
    return newStars;
  },

  resetStars: () => {
    set({ stars: 0 });
  },
  
  decrementHearts: () => {
    const currentHearts = get().hearts;
    const newHearts = currentHearts - 1;
    set({ hearts: newHearts });
    return newHearts;
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
