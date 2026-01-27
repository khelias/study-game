import { PROFILES, GAME_CONFIG } from '../games/data';
import { getTranslations } from '../i18n';
import type { ProfileType } from '../types/game';
import type { DifficultyResult, ProgressionRecommendation } from '../types/profile';
import type { Stats, PerformanceMetrics } from '../types/stats';

/**
 * Calculates the optimal difficulty for a game type and profile
 * @param gameType - Type of game
 * @param level - Current level
 * @param profile - Player profile
 * @returns Difficulty calculation result
 */
export const calculateOptimalDifficulty = (
  _gameType: string,
  level: number,
  profile: ProfileType
): DifficultyResult => {
  const profileData = PROFILES[profile] || PROFILES.starter;
  const baseLevel = profileData.levelStart || 1;
  const difficultyOffset = profileData.difficultyOffset || 0;
  
  // Smoother progression - fewer sharp jumps
  const effectiveLevel = Math.max(1, level + difficultyOffset);
  
  return {
    effectiveLevel,
    baseLevel,
    difficultyOffset,
    // Returns difficulty parameters
    isEasy: effectiveLevel <= 2,
    isMedium: effectiveLevel > 2 && effectiveLevel <= 5,
    isHard: effectiveLevel > 5,
  };
};

/**
 * Calculates the next level difficulty based on performance
 * @param currentLevel - Current level
 * @param performance - Performance metrics
 * @returns Next level number
 */
export const getNextLevelDifficulty = (
  currentLevel: number,
  performance: PerformanceMetrics
): number => {
  // If performance is good (>80% accuracy), increase difficulty faster
  // If performance is poor (<50% accuracy), increase difficulty slower
  const { accuracy, averageTime } = performance;
  
  let levelIncrease = 1;
  
  if (accuracy > 0.8 && averageTime < 5000) {
    // Good performance - increase difficulty
    levelIncrease = 1.5;
  } else if (accuracy < 0.5 || averageTime > 15000) {
    // Poor performance - increase difficulty slower
    levelIncrease = 0.5;
  }
  
  return Math.max(1, Math.floor(currentLevel + levelIncrease));
};

/**
 * Gets a progression recommendation for a game
 * @param stats - Player statistics
 * @param gameType - Type of game
 * @returns Progression recommendation
 */
export const getProgressionRecommendation = (
  stats: Stats,
  gameType: string
): ProgressionRecommendation => {
  const t = getTranslations();
  const gameStats = stats.gamesByType[gameType] || 0;
  const maxLevel = stats.maxLevels[gameType] || 1;
  const accuracy = stats.correctAnswers / (stats.correctAnswers + stats.wrongAnswers) || 0;
  
  if (gameStats === 0) {
    return {
      message: t.progression.startGame,
      action: 'start',
      priority: 'high'
    };
  }
  
  if (accuracy > 0.8 && maxLevel < 5) {
    return {
      message: t.progression.doingGreat,
      action: 'level_up',
      priority: 'medium'
    };
  }
  
  if (accuracy < 0.5 && maxLevel > 3) {
    return {
      message: t.progression.maybeTooHard,
      action: 'level_down',
      priority: 'low'
    };
  }
  
  return {
    message: t.progression.keepPracticing,
    action: 'continue',
    priority: 'low'
  };
};

/**
 * Calculates a success score for a game (0-100)
 * @param stats - Player statistics
 * @param gameType - Type of game
 * @returns Success score (0-100)
 */
export const calculateGameSuccessScore = (
  stats: Stats,
  gameType: string
): number => {
  const gameStats = stats.gamesByType[gameType] || 0;
  const maxLevel = stats.maxLevels[gameType] || 1;
  const accuracy = stats.correctAnswers / (stats.correctAnswers + stats.wrongAnswers) || 0;
  
  // Score 0-100
  const levelScore = Math.min(100, maxLevel * 10);
  const accuracyScore = accuracy * 50;
  const gamesPlayedScore = Math.min(30, gameStats * 2);
  
  return Math.round(levelScore + accuracyScore + gamesPlayedScore);
};

/**
 * Game difficulty tiers for star rewards
 * Prevents farming easy games for stars
 */
const GAME_DIFFICULTY_TIERS: Record<string, number> = {
  easy: 1,    // Easy games: 1 star base
  medium: 2,  // Medium games: 2 stars base
  hard: 3,    // Hard games: 3 stars base
};

/**
 * Calculates how many correct answers are needed to level up
 * @param level - Current level
 * @returns Number of correct answers required
 */
export const calculateLevelUpRequirement = (level: number): number => {
  // Scaling requirements: higher levels need more correct answers
  if (level <= 1) return 5;
  if (level <= 2) return 7;
  if (level <= 3) return 10;
  if (level <= 4) return 12;
  if (level <= 5) return 15;
  if (level <= 10) return 18;
  if (level <= 15) return 20;
  // Level 16+: 25 correct answers
  return 25;
};

/**
 * Checks if player should level up based on performance
 * @param currentLevel - Current level
 * @param correctAnswers - Number of correct answers in current level
 * @param totalAnswers - Total answers (correct + wrong) in current level
 * @returns True if should level up
 */
export const checkLevelUp = (
  currentLevel: number,
  correctAnswers: number,
  totalAnswers: number
): boolean => {
  const required = calculateLevelUpRequirement(currentLevel);
  const accuracy = totalAnswers > 0 ? correctAnswers / totalAnswers : 0;
  
  // Must have required correct answers AND maintain 80%+ accuracy
  return correctAnswers >= required && accuracy >= 0.8;
};

/**
 * Gets the base star reward for a game based on difficulty
 * @param gameType - Game type (e.g., 'word_builder', 'math_snake')
 * @returns Base star reward (1-3)
 */
export const getGameBaseStarReward = (gameType: string): number => {
  const baseGameType = gameType.replace('_adv', '');
  const config = GAME_CONFIG[baseGameType] || GAME_CONFIG['word_builder']!;
  const difficulty = config.difficulty || 'easy';
  return GAME_DIFFICULTY_TIERS[difficulty] || 1;
};

/**
 * Calculates level multiplier for star rewards
 * @param level - Current level
 * @returns Multiplier (1.0, 1.5, 2.0, or 2.5)
 */
export const getLevelStarMultiplier = (level: number): number => {
  if (level <= 5) return 1.0;
  if (level <= 10) return 1.5;
  if (level <= 15) return 2.0;
  return 2.5;
};

/**
 * Calculates star reward for completing a level
 * @param gameType - Game type
 * @param level - Level completed
 * @param perfect - Whether level was completed perfectly (no wrong answers)
 * @returns Number of stars earned
 */
export const calculateStarReward = (
  gameType: string,
  level: number,
  perfect: boolean = false
): number => {
  const baseReward = getGameBaseStarReward(gameType);
  const multiplier = getLevelStarMultiplier(level);
  const baseStars = Math.round(baseReward * multiplier);
  const perfectBonus = perfect ? 1 : 0;
  
  return baseStars + perfectBonus;
};
