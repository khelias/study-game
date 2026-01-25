import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { APP_KEY, PROFILES, GAME_CONFIG } from '../games/data';
import { createStats, recordGameStart, recordAnswer as recordStatsAnswer, recordLevelUp as recordStatsLevelUp, recordScore } from '../engine/stats';
import { checkAchievements } from '../engine/achievements';

// Build default levels for all profiles and game types
const buildDefaultLevels = () => {
  const base = {};
  Object.keys(PROFILES).forEach(pid => {
    const start = PROFILES[pid].levelStart || 1;
    base[pid] = Object.keys(GAME_CONFIG).reduce((acc, g) => ({ ...acc, [g]: start }), {});
  });
  return base;
};

export interface GameStore {
  // State
  profile: string;
  levels: Record<string, Record<string, number>>;
  stats: ReturnType<typeof createStats>;
  unlockedAchievements: string[];
  soundEnabled: boolean;
  score: number;
  collectedStars: number;
  hasSeenTutorial: boolean;
  
  // Actions
  setProfile: (profile: string) => void;
  updateStats: (updater: (stats: ReturnType<typeof createStats>) => ReturnType<typeof createStats>) => void;
  recordAnswer: (isCorrect: boolean, points?: number) => { newAchievements: any[] };
  recordGameStart: (gameType: string) => { newAchievements: any[] };
  recordLevelUp: (gameType: string, newLevel: number) => { newAchievements: any[] };
  unlockAchievement: (id: string) => void;
  toggleSound: () => void;
  resetGame: () => void;
  addCollectedStars: (count: number) => { newAchievements: any[] };
  setScore: (score: number) => void;
  addScore: (points: number) => void;
  markTutorialSeen: () => void;
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      // Initial state
      profile: Object.keys(PROFILES)[0],
      levels: buildDefaultLevels(),
      stats: createStats(),
      unlockedAchievements: [],
      soundEnabled: true,
      score: 0,
      collectedStars: 0,
      hasSeenTutorial: false,
      
      // Actions
      setProfile: (profile: string) => {
        if (PROFILES[profile]) {
          set({ profile });
        }
      },
      
      updateStats: (updater) => {
        const currentStats = get().stats;
        const newStats = updater(currentStats);
        set({ stats: newStats });
      },
      
      recordAnswer: (isCorrect: boolean, points: number = 0) => {
        const state = get();
        let updatedStats = recordStatsAnswer(state.stats, isCorrect);
        
        if (points > 0) {
          updatedStats = recordScore(updatedStats, points);
        }
        
        // Check for new achievements
        const newAchievements = checkAchievements(updatedStats, state.unlockedAchievements);
        
        set({ 
          stats: updatedStats,
          unlockedAchievements: newAchievements.length > 0 
            ? [...state.unlockedAchievements, ...newAchievements.map(a => a.id)]
            : state.unlockedAchievements
        });
        
        return { newAchievements };
      },
      
      recordGameStart: (gameType: string) => {
        const state = get();
        const updatedStats = recordGameStart(state.stats, gameType);
        
        // Check for new achievements
        const newAchievements = checkAchievements(updatedStats, state.unlockedAchievements);
        
        set({ 
          stats: updatedStats,
          unlockedAchievements: newAchievements.length > 0 
            ? [...state.unlockedAchievements, ...newAchievements.map(a => a.id)]
            : state.unlockedAchievements
        });
        
        return { newAchievements };
      },
      
      recordLevelUp: (gameType: string, newLevel: number) => {
        const state = get();
        
        // Update levels
        const updatedLevels = {
          ...state.levels,
          [state.profile]: {
            ...state.levels[state.profile],
            [gameType]: newLevel
          }
        };
        
        // Update stats
        const updatedStats = recordStatsLevelUp(state.stats, gameType, newLevel);
        
        // Check for new achievements
        const newAchievements = checkAchievements(updatedStats, state.unlockedAchievements);
        
        set({ 
          levels: updatedLevels,
          stats: updatedStats,
          unlockedAchievements: newAchievements.length > 0 
            ? [...state.unlockedAchievements, ...newAchievements.map(a => a.id)]
            : state.unlockedAchievements
        });
        
        return { newAchievements };
      },
      
      unlockAchievement: (id: string) => {
        const state = get();
        if (!state.unlockedAchievements.includes(id)) {
          set({ unlockedAchievements: [...state.unlockedAchievements, id] });
        }
      },
      
      toggleSound: () => {
        set((state) => ({ soundEnabled: !state.soundEnabled }));
      },
      
      resetGame: () => {
        if (confirm('Kas oled kindel, et soovid kogu progressi kustutada?')) {
          set({
            profile: Object.keys(PROFILES)[0],
            levels: buildDefaultLevels(),
            stats: createStats(),
            unlockedAchievements: [],
            soundEnabled: true,
            score: 0,
            collectedStars: 0,
            hasSeenTutorial: false,
          });
        }
      },
      
      addCollectedStars: (count: number) => {
        const state = get();
        const newCollectedStars = state.collectedStars + count;
        
        // Update stats with collected stars
        const updatedStats = { 
          ...state.stats, 
          collectedStars: newCollectedStars 
        };
        
        // Check for new achievements
        const newAchievements = checkAchievements(updatedStats, state.unlockedAchievements);
        
        set({ 
          collectedStars: newCollectedStars,
          stats: updatedStats,
          unlockedAchievements: newAchievements.length > 0 
            ? [...state.unlockedAchievements, ...newAchievements.map(a => a.id)]
            : state.unlockedAchievements
        });
        
        return { newAchievements };
      },
      
      setScore: (score: number) => {
        set({ score });
      },
      
      addScore: (points: number) => {
        set((state) => ({ score: state.score + points }));
      },
      
      markTutorialSeen: () => {
        set({ hasSeenTutorial: true });
      },
    }),
    {
      name: APP_KEY,
      partialize: (state) => ({
        profile: state.profile,
        levels: state.levels,
        stats: state.stats,
        unlockedAchievements: state.unlockedAchievements,
        soundEnabled: state.soundEnabled,
        score: state.score,
        collectedStars: state.collectedStars,
        hasSeenTutorial: state.hasSeenTutorial,
      }),
      // Handle migration from old localStorage format
      migrate: (persistedState: any, version: number) => {
        // Merge old format with new if needed
        if (persistedState && typeof persistedState === 'object') {
          const defaults = {
            profile: Object.keys(PROFILES)[0],
            levels: buildDefaultLevels(),
            stats: createStats(),
            unlockedAchievements: [],
            soundEnabled: true,
            score: 0,
            collectedStars: 0,
            hasSeenTutorial: false,
          };
          
          // Merge levels properly
          if (persistedState.levels && typeof persistedState.levels === 'object') {
            const template = buildDefaultLevels();
            const merged = { ...template };
            Object.entries(persistedState.levels).forEach(([pid, lvlObj]: [string, any]) => {
              merged[pid] = { ...template[pid], ...lvlObj };
            });
            persistedState.levels = merged;
          }
          
          // Sync collectedStars with stats if needed
          if (persistedState.stats && !persistedState.stats.collectedStars && persistedState.collectedStars) {
            persistedState.stats.collectedStars = persistedState.collectedStars;
          } else if (persistedState.stats && persistedState.stats.collectedStars) {
            persistedState.collectedStars = persistedState.stats.collectedStars;
          }
          
          return { ...defaults, ...persistedState };
        }
        return persistedState;
      },
    }
  )
);
