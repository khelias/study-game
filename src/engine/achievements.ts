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
      const allTypes = ['word_builder', 'memory_math', 'sentence_logic', 'balance_scale', 
                       'letter_match', 'pattern', 'robo_path', 'syllable_builder', 'time_match'];
      return allTypes.every(type => (stats.gamesByType[type] || 0) > 0);
    }
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
