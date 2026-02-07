import type { Achievement } from '../types/achievement';
import type { Stats } from '../types/stats';

/**
 * Achievement definitions - achievements and medals system
 */
export const ACHIEVEMENTS: Record<string, Achievement> = {
  first_game: {
    id: 'first_game',
    icon: '🎮',
    check: (stats: Stats) => stats.gamesPlayed >= 1
  },
  perfect_5: {
    id: 'perfect_5',
    icon: '⭐',
    check: (stats: Stats) => stats.maxStreak >= 5
  },
  word_master: {
    id: 'word_master',
    icon: '📝',
    check: (stats: Stats) => (stats.maxLevels.word_builder || 0) >= 5
  },
  math_whiz: {
    id: 'math_whiz',
    icon: '🧮',
    check: (stats: Stats) => (stats.maxLevels.memory_math || 0) >= 5
  },
  pattern_pro: {
    id: 'pattern_pro',
    icon: '🚂',
    check: (stats: Stats) => (stats.maxLevels.pattern || 0) >= 5
  },
  score_100: {
    id: 'score_100',
    icon: '💯',
    check: (stats: Stats) => stats.totalScore >= 100
  },
  score_500: {
    id: 'score_500',
    icon: '🏆',
    check: (stats: Stats) => stats.totalScore >= 500
  },
  persistent: {
    id: 'persistent',
    icon: '💪',
    check: (stats: Stats) => stats.gamesPlayed >= 10
  },
  all_games: {
    id: 'all_games',
    icon: '🎯',
    check: (stats: Stats) => {
      const battlelearnPlayed =
        (stats.gamesByType.battlelearn || 0) > 0 || (stats.gamesByType.battlelearn_adv || 0) > 0;
      const otherTypes = [
        'word_builder', 
        'word_cascade',
        'syllable_builder', 
        'pattern', 
        'sentence_logic', 
        'memory_math', 
        'robo_path', 
        'math_snake', 
        'letter_match', 
        'unit_conversion', 
        'compare_sizes', 
        'balance_scale', 
        'time_match'
      ];
      return battlelearnPlayed && otherTypes.every(type => (stats.gamesByType[type] || 0) > 0);
    }
  },
  battlelearn_first_win: {
    id: 'battlelearn_first_win',
    icon: '⚓',
    check: (stats: Stats) =>
      (stats.maxLevels.battlelearn || 0) >= 2 || (stats.maxLevels.battlelearn_adv || 0) >= 2
  },
  battlelearn_captain: {
    id: 'battlelearn_captain',
    icon: '🚢',
    check: (stats: Stats) =>
      (stats.maxLevels.battlelearn || 0) >= 5 || (stats.maxLevels.battlelearn_adv || 0) >= 5
  },
  battlelearn_admiral: {
    id: 'battlelearn_admiral',
    icon: '🏴‍☠️',
    check: (stats: Stats) =>
      (stats.maxLevels.battlelearn || 0) >= 10 || (stats.maxLevels.battlelearn_adv || 0) >= 10
  },
  star_collector_50: {
    id: 'star_collector_50',
    icon: '⭐',
    check: (stats: Stats) => (stats.collectedStars || 0) >= 50
  },
  star_collector_100: {
    id: 'star_collector_100',
    icon: '🌟',
    check: (stats: Stats) => (stats.collectedStars || 0) >= 100
  },
  star_collector_250: {
    id: 'star_collector_250',
    icon: '✨',
    check: (stats: Stats) => (stats.collectedStars || 0) >= 250
  },
  snake_master: {
    id: 'snake_master',
    icon: '🐍',
    check: (stats: Stats) => (stats.maxLevels.math_snake || 0) >= 5
  },
  snake_growth_20: {
    id: 'snake_growth_20',
    icon: '📏',
    check: (stats: Stats) => (stats.maxSnakeLength || 0) >= 20
  },
  snake_growth_30: {
    id: 'snake_growth_30',
    icon: '📐',
    check: (stats: Stats) => (stats.maxSnakeLength || 0) >= 30
  },
  snake_growth_max: {
    id: 'snake_growth_max',
    icon: '👑',
    check: (stats: Stats) => (stats.maxSnakeLength || 0) >= 49 // 7x7 grid = 49 max
  },
  syllable_master: {
    id: 'syllable_master',
    icon: '📚',
    check: (stats: Stats) => (stats.maxLevels.syllable_builder || 0) >= 5
  },
  sentence_detective: {
    id: 'sentence_detective',
    icon: '🔍',
    check: (stats: Stats) => (stats.maxLevels.sentence_logic || 0) >= 5
  },
  robo_master: {
    id: 'robo_master',
    icon: '🤖',
    check: (stats: Stats) => (stats.maxLevels.robo_path || 0) >= 5
  },
  letter_detective: {
    id: 'letter_detective',
    icon: '🔎',
    check: (stats: Stats) => (stats.maxLevels.letter_match || 0) >= 5
  },
  unit_master: {
    id: 'unit_master',
    icon: '📏',
    check: (stats: Stats) => (stats.maxLevels.unit_conversion || 0) >= 5
  },
  compare_master: {
    id: 'compare_master',
    icon: '🔢',
    check: (stats: Stats) => (stats.maxLevels.compare_sizes || 0) >= 5
  },
  scale_master: {
    id: 'scale_master',
    icon: '⚖️',
    check: (stats: Stats) => (stats.maxLevels.balance_scale || 0) >= 5
  },
  clock_master: {
    id: 'clock_master',
    icon: '🕐',
    check: (stats: Stats) => (stats.maxLevels.time_match || 0) >= 5
  },
  cascade_master: {
    id: 'cascade_master',
    icon: '🌊',
    check: (stats: Stats) => (stats.maxLevels.word_cascade || 0) >= 5
  },
  cascade_perfect_10: {
    id: 'cascade_perfect_10',
    icon: '✨',
    check: (stats: Stats) => (stats.gamesByType.word_cascade || 0) >= 10
  }
};

/**
 * Checks for newly unlocked achievements
 * @param stats - Current player statistics
 * @param unlocked - Array of already unlocked achievement IDs
 * @returns Array of newly unlocked achievements
 */
export const checkAchievements = (stats: Stats, unlocked: string[]): Achievement[] => {
  const newUnlocks: Achievement[] = [];
  Object.values(ACHIEVEMENTS).forEach(achievement => {
    if (!unlocked.includes(achievement.id) && achievement.check(stats)) {
      newUnlocks.push(achievement);
    }
  });
  return newUnlocks;
};
