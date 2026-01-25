import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { APP_KEY, PROFILES, GAME_CONFIG } from '../games/data';
import { createStats, recordGameStart, recordAnswer as recordStatsAnswer, recordLevelUp as recordStatsLevelUp, recordScore } from '../engine/stats';
import { checkAchievements } from '../engine/achievements';
import { getTranslations } from '../i18n';
import type { ProfileType } from '../types/game';

interface AchievementData {
  id: string;
  title: string;
  desc: string;
  icon: string;
}


// Build default levels for all profiles and game types
const buildDefaultLevels = () => {
  const base: Record<string, Record<string, number>> = {};
  (Object.keys(PROFILES) as ProfileType[]).forEach(pid => {
    const profile = PROFILES[pid];
    const start = profile.levelStart || 1;
    base[pid] = Object.keys(GAME_CONFIG).reduce((acc, g) => ({ ...acc, [g]: start }), {} as Record<string, number>);
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
  recordAnswer: (isCorrect: boolean, points?: number) => { newAchievements: AchievementData[] };
  recordGameStart: (gameType: string) => { newAchievements: AchievementData[] };
  recordLevelUp: (gameType: string, newLevel: number) => { newAchievements: AchievementData[] };
  unlockAchievement: (id: string) => void;
  toggleSound: () => void;
  resetGame: () => void;
  addCollectedStars: (count: number) => { newAchievements: AchievementData[] };
  setScore: (score: number) => void;
  addScore: (points: number) => void;
  markTutorialSeen: () => void;
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      // Initial state
      profile: (Object.keys(PROFILES)[0] as ProfileType) ?? 'starter',
      levels: buildDefaultLevels(),
      stats: createStats(),
      unlockedAchievements: [],
      soundEnabled: true,
      score: 0,
      collectedStars: 0,
      hasSeenTutorial: false,
      
      // Actions
      setProfile: (profile: string) => {
        if (profile in PROFILES) {
          set({ profile: profile as ProfileType });
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
        const achievementData: AchievementData[] = newAchievements.map(a => ({
          id: a.id,
          title: a.title,
          desc: a.desc,
          icon: a.icon
        }));
        
        set({ 
          stats: updatedStats,
          unlockedAchievements: newAchievements.length > 0 
            ? [...state.unlockedAchievements, ...newAchievements.map(a => a.id)]
            : state.unlockedAchievements
        });
        
        return { newAchievements: achievementData };
      },
      
      recordGameStart: (gameType: string) => {
        const state = get();
        const updatedStats = recordGameStart(state.stats, gameType);
        
        // Check for new achievements
        const newAchievements = checkAchievements(updatedStats, state.unlockedAchievements);
        const achievementData: AchievementData[] = newAchievements.map(a => ({
          id: a.id,
          title: a.title,
          desc: a.desc,
          icon: a.icon
        }));
        
        set({ 
          stats: updatedStats,
          unlockedAchievements: newAchievements.length > 0 
            ? [...state.unlockedAchievements, ...newAchievements.map(a => a.id)]
            : state.unlockedAchievements
        });
        
        return { newAchievements: achievementData };
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
        const achievementData: AchievementData[] = newAchievements.map(a => ({
          id: a.id,
          title: a.title,
          desc: a.desc,
          icon: a.icon
        }));
        
        set({ 
          levels: updatedLevels,
          stats: updatedStats,
          unlockedAchievements: newAchievements.length > 0 
            ? [...state.unlockedAchievements, ...newAchievements.map(a => a.id)]
            : state.unlockedAchievements
        });
        
        return { newAchievements: achievementData };
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
        const t = getTranslations();
        const confirmed = confirm(t.errors.confirmReset);
        if (confirmed) {
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
        const achievementData: AchievementData[] = newAchievements.map(a => ({
          id: a.id,
          title: a.title,
          desc: a.desc,
          icon: a.icon
        }));
        
        set({ 
          collectedStars: newCollectedStars,
          stats: updatedStats,
          unlockedAchievements: newAchievements.length > 0 
            ? [...state.unlockedAchievements, ...newAchievements.map(a => a.id)]
            : state.unlockedAchievements
        });
        
        return { newAchievements: achievementData };
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
      migrate: (persistedState: unknown) => {
        // Merge old format with new if needed
        if (persistedState && typeof persistedState === 'object') {
          const stateObj = persistedState as Record<string, unknown>;
          const defaults = {
            profile: (Object.keys(PROFILES)[0] as ProfileType) ?? 'starter',
            levels: buildDefaultLevels(),
            stats: createStats(),
            unlockedAchievements: [],
            soundEnabled: true,
            score: 0,
            collectedStars: 0,
            hasSeenTutorial: false,
          };
          
          // Merge levels properly
          if (stateObj.levels && typeof stateObj.levels === 'object') {
            const template = buildDefaultLevels();
            const merged = { ...template };
            const levelsObj = stateObj.levels as Record<string, Record<string, number>>;
            Object.entries(levelsObj).forEach(([pid, lvlObj]) => {
              if (typeof lvlObj === 'object' && lvlObj !== null) {
                merged[pid] = { ...template[pid], ...lvlObj };
              }
            });
            stateObj.levels = merged;
          }
          
          // Sync collectedStars with stats if needed
          const statsObj = stateObj.stats as Record<string, unknown> | undefined;
          if (statsObj && !statsObj.collectedStars && stateObj.collectedStars) {
            statsObj.collectedStars = stateObj.collectedStars;
          } else if (statsObj && statsObj.collectedStars) {
            stateObj.collectedStars = statsObj.collectedStars;
          }
          
          return { ...defaults, ...stateObj };
        }
        return persistedState;
      },
    }
  )
);
