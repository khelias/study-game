import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { APP_KEY, PROFILES, GAME_CONFIG } from '../games/data';
import {
  createStats,
  recordGameStart,
  recordAnswer as recordStatsAnswer,
  recordLevelUp as recordStatsLevelUp,
  recordScore,
} from '../engine/stats';
import { checkAchievements } from '../engine/achievements';
import { getTranslations } from '../i18n';
import { getAchievementCopy } from '../utils/achievementCopy';
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
  (Object.keys(PROFILES) as ProfileType[]).forEach((pid) => {
    const profile = PROFILES[pid];
    const start = profile.levelStart || 1;
    base[pid] = Object.keys(GAME_CONFIG).reduce(
      (acc, g) => ({ ...acc, [g]: start }),
      {} as Record<string, number>,
    );
  });
  return base;
};

const MAX_HEARTS = 5;
const DEFAULT_HEARTS = 3;

const DEFAULT_FAVOURITE_GAME_IDS = ['battlelearn', 'word_cascade', 'math_snake'];

export interface GameStore {
  // State
  profile: string;
  levels: Record<string, Record<string, number>>;
  stats: ReturnType<typeof createStats>;
  unlockedAchievements: string[];
  soundEnabled: boolean;
  score: number;
  stars: number; // Persistent currency (replaces collectedStars)
  hearts: number; // Persistent global resource (replaces session hearts)
  hasSeenTutorial: boolean;
  highScores: Record<string, number>; // High score per game type
  favouriteGameIds: string[]; // User-chosen games shown in Favourites section

  // Actions
  setProfile: (profile: string) => void;
  setFavouriteGameIds: (ids: string[]) => void;
  updateStats: (
    updater: (stats: ReturnType<typeof createStats>) => ReturnType<typeof createStats>,
  ) => void;
  recordAnswer: (isCorrect: boolean, points?: number) => { newAchievements: AchievementData[] };
  recordGameStart: (gameType: string) => { newAchievements: AchievementData[] };
  recordLevelUp: (gameType: string, newLevel: number) => { newAchievements: AchievementData[] };
  unlockAchievement: (id: string) => void;
  toggleSound: () => void;
  resetGame: () => void;
  earnStars: (count: number, reason?: string) => { newAchievements: AchievementData[] };
  spendStars: (count: number) => boolean;
  spendHeart: () => boolean; // Returns true if heart was spent, false if no hearts available
  addHeart: (count?: number) => void; // Adds hearts up to MAX_HEARTS
  buyHeartsWithStars: (count: number) => boolean; // Buy hearts with stars, returns true if successful
  buyStars: (count: number) => void; // Buy stars (mocked as FREE for now)
  setScore: (score: number) => void;
  addScore: (points: number) => void;
  markTutorialSeen: () => void;
  setLevel: (gameType: string, level: number) => void; // Manually set level for a game
  updateHighScore: (gameType: string, score: number) => boolean; // Update high score, returns true if new record
  getHighScore: (gameType: string) => number; // Get high score for a game type
}

const DEFAULT_PROFILE: ProfileType = 'advanced';

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      // Initial state
      profile: DEFAULT_PROFILE,
      levels: buildDefaultLevels(),
      stats: createStats(),
      unlockedAchievements: [],
      soundEnabled: true,
      score: 0,
      stars: 0, // Persistent currency
      hearts: DEFAULT_HEARTS, // Persistent global resource
      hasSeenTutorial: false,
      highScores: {},
      favouriteGameIds: DEFAULT_FAVOURITE_GAME_IDS,

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
        const t = getTranslations();
        const achievementData: AchievementData[] = newAchievements.map((a) => {
          const copy = getAchievementCopy(t, a.id);
          return {
            id: a.id,
            title: copy.title,
            desc: copy.desc,
            icon: a.icon,
          };
        });

        set({
          stats: updatedStats,
          unlockedAchievements:
            newAchievements.length > 0
              ? [...state.unlockedAchievements, ...newAchievements.map((a) => a.id)]
              : state.unlockedAchievements,
        });

        return { newAchievements: achievementData };
      },

      recordGameStart: (gameType: string) => {
        const state = get();
        const updatedStats = recordGameStart(state.stats, gameType);

        // Check for new achievements
        const newAchievements = checkAchievements(updatedStats, state.unlockedAchievements);
        const t = getTranslations();
        const achievementData: AchievementData[] = newAchievements.map((a) => {
          const copy = getAchievementCopy(t, a.id);
          return {
            id: a.id,
            title: copy.title,
            desc: copy.desc,
            icon: a.icon,
          };
        });

        set({
          stats: updatedStats,
          unlockedAchievements:
            newAchievements.length > 0
              ? [...state.unlockedAchievements, ...newAchievements.map((a) => a.id)]
              : state.unlockedAchievements,
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
            [gameType]: newLevel,
          },
        };

        // Update stats
        const updatedStats = recordStatsLevelUp(state.stats, gameType, newLevel);

        // Check for new achievements
        const newAchievements = checkAchievements(updatedStats, state.unlockedAchievements);
        const t = getTranslations();
        const achievementData: AchievementData[] = newAchievements.map((a) => {
          const copy = getAchievementCopy(t, a.id);
          return {
            id: a.id,
            title: copy.title,
            desc: copy.desc,
            icon: a.icon,
          };
        });

        set({
          levels: updatedLevels,
          stats: updatedStats,
          unlockedAchievements:
            newAchievements.length > 0
              ? [...state.unlockedAchievements, ...newAchievements.map((a) => a.id)]
              : state.unlockedAchievements,
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
            profile: DEFAULT_PROFILE,
            levels: buildDefaultLevels(),
            stats: createStats(),
            unlockedAchievements: [],
            soundEnabled: true,
            score: 0,
            stars: 0,
            hearts: DEFAULT_HEARTS,
            hasSeenTutorial: false,
            highScores: {},
            favouriteGameIds: DEFAULT_FAVOURITE_GAME_IDS,
          });
        }
      },

      earnStars: (count: number, _reason?: string) => {
        const state = get();
        const newStars = state.stars + count;

        // Update stats with stars (for achievement tracking)
        const updatedStats = {
          ...state.stats,
          collectedStars: newStars, // Keep in stats for achievement compatibility
        };

        // Check for new achievements
        const newAchievements = checkAchievements(updatedStats, state.unlockedAchievements);
        const t = getTranslations();
        const achievementData: AchievementData[] = newAchievements.map((a) => {
          const copy = getAchievementCopy(t, a.id);
          return {
            id: a.id,
            title: copy.title,
            desc: copy.desc,
            icon: a.icon,
          };
        });

        set({
          stars: newStars,
          stats: updatedStats,
          unlockedAchievements:
            newAchievements.length > 0
              ? [...state.unlockedAchievements, ...newAchievements.map((a) => a.id)]
              : state.unlockedAchievements,
        });

        return { newAchievements: achievementData };
      },

      spendStars: (count: number) => {
        const state = get();
        if (state.stars >= count) {
          set({ stars: state.stars - count });
          return true;
        }
        return false;
      },

      spendHeart: () => {
        const state = get();
        if (state.hearts > 0) {
          set({ hearts: state.hearts - 1 });
          return true;
        }
        return false;
      },

      addHeart: (count: number = 1) => {
        const state = get();
        const newHearts = Math.min(state.hearts + count, MAX_HEARTS);
        set({ hearts: newHearts });
      },

      buyHeartsWithStars: (count: number) => {
        const state = get();
        const HEART_COST_STARS = 10; // 10 stars = 1 heart
        const totalCost = HEART_COST_STARS * count;
        const heartsCanAdd = Math.min(count, MAX_HEARTS - state.hearts);

        if (state.stars >= totalCost && heartsCanAdd > 0) {
          set({
            stars: state.stars - totalCost,
            hearts: Math.min(state.hearts + heartsCanAdd, MAX_HEARTS),
          });
          return true;
        }
        return false;
      },

      buyStars: (count: number) => {
        // Mocked as FREE for now - will be wired up to payment system later
        const state = get();
        set({ stars: state.stars + count });
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

      setLevel: (gameType: string, level: number) => {
        const state = get();
        // Ensure level is at least 1
        const newLevel = Math.max(1, level);

        // Update levels
        const updatedLevels = {
          ...state.levels,
          [state.profile]: {
            ...state.levels[state.profile],
            [gameType]: newLevel,
          },
        };

        set({ levels: updatedLevels });
      },

      updateHighScore: (gameType: string, score: number) => {
        const state = get();
        const baseType = gameType.replace('_adv', '');
        const currentHighScore = state.highScores[baseType] || 0;

        if (score > currentHighScore) {
          set({
            highScores: {
              ...state.highScores,
              [baseType]: score,
            },
          });
          return true; // New record
        }
        return false; // No new record
      },

      getHighScore: (gameType: string) => {
        const state = get();
        const baseType = gameType.replace('_adv', '');
        return state.highScores[baseType] || 0;
      },

      setFavouriteGameIds: (ids: string[]) => {
        set({ favouriteGameIds: ids });
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
        stars: state.stars,
        hearts: state.hearts,
        hasSeenTutorial: state.hasSeenTutorial,
        highScores: state.highScores,
        favouriteGameIds: state.favouriteGameIds,
      }),
      // Handle migration from old localStorage format
      migrate: (persistedState: unknown) => {
        // Merge old format with new if needed
        if (persistedState && typeof persistedState === 'object') {
          const stateObj = persistedState as Record<string, unknown>;
          const defaults = {
            profile: DEFAULT_PROFILE,
            levels: buildDefaultLevels(),
            stats: createStats(),
            unlockedAchievements: [],
            soundEnabled: true,
            score: 0,
            stars: 0,
            hearts: DEFAULT_HEARTS,
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

          // Migrate collectedStars to stars (Phase 1 consolidation)
          if ('collectedStars' in stateObj && typeof stateObj.collectedStars === 'number') {
            stateObj.stars = stateObj.collectedStars;
            delete stateObj.collectedStars;
          }

          // Sync stars with stats.collectedStars for achievement compatibility
          const statsObj = stateObj.stats as Record<string, unknown> | undefined;
          if (statsObj && typeof stateObj.stars === 'number') {
            statsObj.collectedStars = stateObj.stars;
          } else if (statsObj && statsObj.collectedStars && !stateObj.stars) {
            // Legacy: if stats has collectedStars but state doesn't have stars, migrate
            stateObj.stars = statsObj.collectedStars as number;
          }

          // Migrate hearts: if hearts don't exist, set to default
          if (!('hearts' in stateObj) || typeof stateObj.hearts !== 'number') {
            stateObj.hearts = DEFAULT_HEARTS;
          }
          // Ensure hearts don't exceed max
          if (typeof stateObj.hearts === 'number' && stateObj.hearts > MAX_HEARTS) {
            stateObj.hearts = MAX_HEARTS;
          }
          // Migrate featuredGameIds → favouriteGameIds; default if missing
          if (Array.isArray(stateObj.featuredGameIds)) {
            stateObj.favouriteGameIds = stateObj.featuredGameIds;
            delete stateObj.featuredGameIds;
          }
          if (!Array.isArray(stateObj.favouriteGameIds)) {
            stateObj.favouriteGameIds = DEFAULT_FAVOURITE_GAME_IDS;
          }
          return { ...defaults, ...stateObj };
        }
        return persistedState;
      },
    },
  ),
);
