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
import {
  applyLegacyGameLevelToLearner,
  createLearnerProfileFromLegacyProgress,
  getLearnerLevelForLegacyGame,
  type LearnerProfile,
} from '../learner';
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

export const MAX_HEARTS = 5;
export const DEFAULT_HEARTS = 3;
export const HEART_COST_STARS = 10;
export const STAR_PURCHASE_AMOUNT = 50;

const DEFAULT_FAVOURITE_GAME_IDS = ['battlelearn', 'word_cascade', 'addition_snake'];
export const GAME_STORE_VERSION = 3;
const DEFAULT_LOCALE = 'et';

export interface GameStore {
  // State
  profile: string;
  levels: Record<string, Record<string, number>>;
  activeLearnerProfile: LearnerProfile;
  stats: ReturnType<typeof createStats>;
  unlockedAchievements: string[];
  soundEnabled: boolean;
  score: number;
  stars: number; // Spendable star balance
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
  getLevelForGame: (gameType: string) => number;
  unlockAchievement: (id: string) => void;
  toggleSound: () => void;
  resetGame: () => void;
  earnStars: (count: number, reason?: string) => { newAchievements: AchievementData[] };
  spendStars: (count: number) => boolean;
  spendHeart: () => boolean; // Returns true if heart was spent, false if no hearts available
  addHeart: (count?: number) => void; // Adds hearts up to MAX_HEARTS
  buyHeartsWithStars: (count: number) => boolean; // Buy hearts with stars, returns true if successful
  buyStars: (count: number) => boolean; // Temporary top-up until real purchases exist
  setScore: (score: number) => void;
  addScore: (points: number) => void;
  markTutorialSeen: () => void;
  setLevel: (gameType: string, level: number) => void; // Manually set level for a game
  updateHighScore: (gameType: string, score: number) => boolean; // Update high score, returns true if new record
  getHighScore: (gameType: string) => number; // Get high score for a game type
}

const DEFAULT_PROFILE: ProfileType = 'starter';

function normalizeProfile(profile: unknown): ProfileType {
  return typeof profile === 'string' && profile in PROFILES
    ? (profile as ProfileType)
    : DEFAULT_PROFILE;
}

function isLearnerProfile(value: unknown): value is LearnerProfile {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Partial<LearnerProfile>;
  return (
    typeof candidate.id === 'string' &&
    typeof candidate.displayName === 'string' &&
    typeof candidate.skillMastery === 'object' &&
    candidate.skillMastery !== null
  );
}

function createActiveLearnerProfile(
  profile: unknown,
  levels: Record<string, Record<string, number>>,
): LearnerProfile {
  const profileId = normalizeProfile(profile);
  return createLearnerProfileFromLegacyProgress({
    displayName: PROFILES[profileId].label,
    legacyProfileId: profileId,
    levelsByProfile: levels,
    locale: DEFAULT_LOCALE,
    now: Date.now(),
  });
}

export function migrateGameStoreState(persistedState: unknown): unknown {
  if (!persistedState || typeof persistedState !== 'object') {
    return persistedState;
  }

  const stateObj = { ...(persistedState as Record<string, unknown>) };
  const defaultLevels = buildDefaultLevels();
  const defaults = {
    profile: DEFAULT_PROFILE,
    levels: defaultLevels,
    activeLearnerProfile: createActiveLearnerProfile(DEFAULT_PROFILE, defaultLevels),
    stats: createStats(),
    unlockedAchievements: [],
    soundEnabled: true,
    score: 0,
    stars: 0,
    hearts: DEFAULT_HEARTS,
    hasSeenTutorial: false,
    highScores: {},
    favouriteGameIds: DEFAULT_FAVOURITE_GAME_IDS,
  };

  // Merge levels properly
  if (stateObj.levels && typeof stateObj.levels === 'object') {
    const merged = { ...defaultLevels };
    const levelsObj = stateObj.levels as Record<string, Record<string, number>>;
    Object.entries(levelsObj).forEach(([pid, lvlObj]) => {
      if (typeof lvlObj === 'object' && lvlObj !== null) {
        merged[pid] = { ...(defaultLevels[pid] ?? {}), ...lvlObj };
      }
    });
    stateObj.levels = merged;
  } else {
    stateObj.levels = defaultLevels;
  }

  const legacyTopLevelStars =
    'collectedStars' in stateObj && typeof stateObj.collectedStars === 'number'
      ? Math.max(0, stateObj.collectedStars)
      : undefined;

  // Migrate old top-level collectedStars to the spendable star balance if needed.
  if ('collectedStars' in stateObj && typeof stateObj.collectedStars === 'number') {
    delete stateObj.collectedStars;
    if (typeof stateObj.stars !== 'number') {
      stateObj.stars = legacyTopLevelStars;
    }
  }

  // Keep stars as current spendable balance and stats.collectedStars as lifetime
  // earned stars for stats + achievement thresholds.
  if (typeof stateObj.stars === 'number') {
    stateObj.stars = Math.max(0, stateObj.stars);
  }

  const statsObj =
    stateObj.stats && typeof stateObj.stats === 'object'
      ? (stateObj.stats as Record<string, unknown>)
      : undefined;
  if (statsObj) {
    const statsLifetime =
      typeof statsObj.collectedStars === 'number' ? Math.max(0, statsObj.collectedStars) : 0;
    if (typeof stateObj.stars !== 'number') {
      stateObj.stars = statsLifetime;
    }
    statsObj.collectedStars = Math.max(statsLifetime, legacyTopLevelStars ?? 0);
  } else {
    stateObj.stats = {
      ...createStats(),
      collectedStars: Math.max(
        typeof stateObj.stars === 'number' ? stateObj.stars : 0,
        legacyTopLevelStars ?? 0,
      ),
    };
  }

  // Migrate hearts: if hearts don't exist, set to default
  if (!('hearts' in stateObj) || typeof stateObj.hearts !== 'number') {
    stateObj.hearts = DEFAULT_HEARTS;
  }
  // Ensure hearts stay within the supported global-resource range
  if (typeof stateObj.hearts === 'number') {
    stateObj.hearts = Math.min(MAX_HEARTS, Math.max(0, stateObj.hearts));
  }
  // Migrate featuredGameIds -> favouriteGameIds; default if missing
  if (Array.isArray(stateObj.featuredGameIds)) {
    stateObj.favouriteGameIds = stateObj.featuredGameIds.filter((id) => typeof id === 'string');
    delete stateObj.featuredGameIds;
  }
  if (!Array.isArray(stateObj.favouriteGameIds)) {
    stateObj.favouriteGameIds = DEFAULT_FAVOURITE_GAME_IDS;
  }

  if (!isLearnerProfile(stateObj.activeLearnerProfile)) {
    stateObj.activeLearnerProfile = createActiveLearnerProfile(
      stateObj.profile,
      stateObj.levels as Record<string, Record<string, number>>,
    );
  }

  return { ...defaults, ...stateObj };
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      // Initial state
      profile: DEFAULT_PROFILE,
      levels: buildDefaultLevels(),
      activeLearnerProfile: createActiveLearnerProfile(DEFAULT_PROFILE, buildDefaultLevels()),
      stats: createStats(),
      unlockedAchievements: [],
      soundEnabled: true,
      score: 0,
      stars: 0, // Spendable star balance
      hearts: DEFAULT_HEARTS, // Persistent global resource
      hasSeenTutorial: false,
      highScores: {},
      favouriteGameIds: DEFAULT_FAVOURITE_GAME_IDS,

      // Actions
      setProfile: (profile: string) => {
        if (profile in PROFILES) {
          const state = get();
          set({
            profile: profile as ProfileType,
            activeLearnerProfile: createActiveLearnerProfile(profile, state.levels),
          });
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
          activeLearnerProfile: applyLegacyGameLevelToLearner(
            state.activeLearnerProfile,
            gameType,
            newLevel,
            Date.now(),
          ),
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

      getLevelForGame: (gameType: string) => {
        const state = get();
        return getLearnerLevelForLegacyGame(
          state.activeLearnerProfile,
          gameType,
          state.levels[state.profile]?.[gameType] ?? 1,
        );
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
            activeLearnerProfile: createActiveLearnerProfile(DEFAULT_PROFILE, buildDefaultLevels()),
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
        const earned = Math.max(0, count);
        const state = get();
        const newStars = state.stars + earned;
        const lifetimeStars = Math.max(0, state.stats.collectedStars ?? 0) + earned;

        const updatedStats = {
          ...state.stats,
          collectedStars: lifetimeStars,
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
        if (count <= 0) return false;
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
        if (count <= 0) return false;
        const state = get();
        const heartsCanAdd = Math.min(count, MAX_HEARTS - state.hearts);
        const totalCost = HEART_COST_STARS * heartsCanAdd;

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
        if (count <= 0) return false;
        const state = get();
        set({ stars: state.stars + count });
        return true;
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
        set({
          activeLearnerProfile: applyLegacyGameLevelToLearner(
            state.activeLearnerProfile,
            gameType,
            newLevel,
            Date.now(),
          ),
        });
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
      version: GAME_STORE_VERSION,
      partialize: (state) => ({
        profile: state.profile,
        levels: state.levels,
        activeLearnerProfile: state.activeLearnerProfile,
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
      migrate: migrateGameStoreState,
    },
  ),
);
