import { create } from 'zustand';
import { createAdaptiveDifficulty, updateAdaptiveDifficulty as updateDifficulty } from '../engine/adaptiveDifficulty';
import type { Problem } from '../types/game';
import type { Notification } from '../components/NotificationSystem';

type GameState = 'menu' | 'playing' | 'game_over';

interface AdaptiveDifficulty {
  recentAccuracy: boolean[];
  averageResponseTime: number[];
  consecutiveCorrect: number;
  consecutiveWrong: number;
  difficultyMultiplier: number;
  levelAdjustment: number;
}

interface AchievementData {
  id: string;
  title: string;
  desc: string;
  icon: string;
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
  
  // Legacy state (kept for backward compatibility during migration)
  showLevelUp: boolean;
  showAchievement: AchievementData | null;
  bgClass: string;
  confetti: boolean;
  enhancedConfetti: boolean;
  particleActive: boolean;
  gameStartTime: number | null;
  showHint: boolean;
  feedbackMessage: string | null;
  feedbackType: 'info' | 'correct' | 'wrong' | 'streak' | 'hint';
  showLearningTip: boolean;
  
  // Actions
  startGame: (gameType: string) => void;
  setProblem: (problem: Problem | null) => void;
  submitAnswer: (isCorrect: boolean) => void;
  endGame: () => void;
  returnToMenu: () => void;
  
  // New notification system actions
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
  
  // Legacy actions (kept for backward compatibility during migration)
  showLevelUpModal: () => void;
  dismissLevelUpModal: () => void;
  setShowAchievement: (achievement: AchievementData | null) => void;
  setBgClass: (bgClass: string) => void;
  setConfetti: (confetti: boolean) => void;
  setEnhancedConfetti: (enhanced: boolean) => void;
  setParticleActive: (active: boolean) => void;
  setShowHint: (show: boolean) => void;
  setFeedbackMessage: (message: string | null, type?: 'info' | 'correct' | 'wrong' | 'streak' | 'hint') => void;
  setShowLearningTip: (show: boolean) => void;
  updateAdaptiveDifficulty: (isCorrect: boolean, responseTime?: number) => void;
  incrementStars: () => number;
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
  
  // Legacy state
  showLevelUp: false,
  showAchievement: null,
  bgClass: 'bg-slate-50',
  confetti: false,
  enhancedConfetti: false,
  particleActive: false,
  gameStartTime: null,
  showHint: false,
  feedbackMessage: null,
  feedbackType: 'info' as const,
  showLearningTip: true,
};

export const usePlaySessionStore = create<PlaySessionStore>((set, get) => ({
  ...initialState,
  
  // Actions
  startGame: (gameType: string) => {
    set({
      gameType,
      gameState: 'playing',
      bgClass: 'bg-slate-50',
      feedbackMessage: null,
      stars: 0,
      hearts: 3,
      showHint: false,
      showLearningTip: true,
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
      feedbackMessage: null,
    });
  },
  
  showLevelUpModal: () => {
    set({ showLevelUp: true });
  },
  
  dismissLevelUpModal: () => {
    set({ 
      showLevelUp: false,
      confetti: false,
      stars: 0,
    });
  },
  
  setShowAchievement: (achievement: AchievementData | null) => {
    set({ showAchievement: achievement });
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
  
  setFeedbackMessage: (message: string | null, type: 'info' | 'correct' | 'wrong' | 'streak' | 'hint' = 'info') => {
    set({ feedbackMessage: message, feedbackType: type });
  },
  
  setShowLearningTip: (show: boolean) => {
    set({ showLearningTip: show });
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
  addNotification: (notification: Omit<Notification, 'id'>) => {
    const id = `notification-${Date.now()}-${Math.random()}`;
    set((state) => ({
      notifications: [...state.notifications, { ...notification, id }],
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
