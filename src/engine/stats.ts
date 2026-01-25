import type { Stats } from '../types/stats';

/**
 * Creates a new statistics object with default values
 * @returns A fresh stats object
 */
export const createStats = (): Stats => ({
  gamesPlayed: 0,
  correctAnswers: 0,
  wrongAnswers: 0,
  totalScore: 0,
  maxStreak: 0,
  currentStreak: 0,
  maxLevels: {},
  gamesByType: {},
  totalTimePlayed: 0, // in seconds
  lastPlayed: null,
  collectedStars: 0 // Stars collected for narrative purposes
});

/**
 * Updates statistics with new values
 * @param stats - Current stats object
 * @param update - Partial stats to update
 * @returns Updated stats object
 */
export const updateStats = (stats: Stats, update: Partial<Stats>): Stats => {
  return { ...stats, ...update };
};

/**
 * Records the start of a game
 * @param stats - Current stats object
 * @param gameType - Type of game being started
 * @returns Updated stats object
 */
export const recordGameStart = (stats: Stats, gameType: string): Stats => {
  return updateStats(stats, {
    gamesPlayed: stats.gamesPlayed + 1,
    gamesByType: {
      ...stats.gamesByType,
      [gameType]: (stats.gamesByType[gameType] || 0) + 1
    },
    lastPlayed: Date.now()
  });
};

/**
 * Records an answer (correct or wrong)
 * @param stats - Current stats object
 * @param isCorrect - Whether the answer was correct
 * @returns Updated stats object
 */
export const recordAnswer = (stats: Stats, isCorrect: boolean): Stats => {
  const newStreak = isCorrect ? stats.currentStreak + 1 : 0;
  return updateStats(stats, {
    [isCorrect ? 'correctAnswers' : 'wrongAnswers']: 
      stats[isCorrect ? 'correctAnswers' : 'wrongAnswers'] + 1,
    currentStreak: newStreak,
    maxStreak: Math.max(stats.maxStreak, newStreak)
  });
};

/**
 * Records a level up for a specific game
 * @param stats - Current stats object
 * @param gameType - Type of game
 * @param newLevel - The new level reached
 * @returns Updated stats object
 */
export const recordLevelUp = (stats: Stats, gameType: string, newLevel: number): Stats => {
  return updateStats(stats, {
    maxLevels: {
      ...stats.maxLevels,
      [gameType]: Math.max(stats.maxLevels[gameType] || 0, newLevel)
    }
  });
};

/**
 * Records score points earned
 * @param stats - Current stats object
 * @param points - Points to add
 * @returns Updated stats object
 */
export const recordScore = (stats: Stats, points: number): Stats => {
  return updateStats(stats, {
    totalScore: stats.totalScore + points
  });
};
