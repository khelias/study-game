import { describe, it, expect } from 'vitest';
import { ACHIEVEMENTS, checkAchievements } from '../achievements';
import { createTestStats } from '../../test/utils';

describe('ACHIEVEMENTS', () => {
  it('should have all required achievement properties', () => {
    Object.values(ACHIEVEMENTS).forEach((achievement) => {
      expect(achievement).toHaveProperty('id');
      expect(achievement).toHaveProperty('title');
      expect(achievement).toHaveProperty('desc');
      expect(achievement).toHaveProperty('icon');
      expect(achievement).toHaveProperty('check');
      expect(typeof achievement.check).toBe('function');
    });
  });

  it('should have unique achievement IDs', () => {
    const ids = Object.values(ACHIEVEMENTS).map((a) => a.id);
    const uniqueIds = new Set(ids);
    
    expect(ids.length).toBe(uniqueIds.size);
  });
});

describe('checkAchievements', () => {
  it('should return empty array when no achievements are unlocked', () => {
    const stats = createTestStats();
    const unlocked: string[] = [];
    
    const newUnlocks = checkAchievements(stats, unlocked);
    
    expect(newUnlocks).toEqual([]);
  });

  it('should return first_game achievement when one game played', () => {
    const stats = createTestStats({ gamesPlayed: 1 });
    const unlocked: string[] = [];
    
    const newUnlocks = checkAchievements(stats, unlocked);
    
    expect(newUnlocks).toHaveLength(1);
    expect(newUnlocks[0].id).toBe('first_game');
  });

  it('should not return already unlocked achievements', () => {
    const stats = createTestStats({ gamesPlayed: 1 });
    const unlocked = ['first_game'];
    
    const newUnlocks = checkAchievements(stats, unlocked);
    
    expect(newUnlocks).toHaveLength(0);
  });

  it('should unlock perfect_5 with max streak of 5', () => {
    const stats = createTestStats({ maxStreak: 5 });
    const unlocked: string[] = [];
    
    const newUnlocks = checkAchievements(stats, unlocked);
    
    const perfect5 = newUnlocks.find((a) => a.id === 'perfect_5');
    expect(perfect5).toBeDefined();
  });

  it('should unlock word_master with word_builder level 5', () => {
    const stats = createTestStats({
      maxLevels: { word_builder: 5 },
    });
    const unlocked: string[] = [];
    
    const newUnlocks = checkAchievements(stats, unlocked);
    
    const wordMaster = newUnlocks.find((a) => a.id === 'word_master');
    expect(wordMaster).toBeDefined();
  });

  it('should unlock math_whiz with memory_math level 5', () => {
    const stats = createTestStats({
      maxLevels: { memory_math: 5 },
    });
    const unlocked: string[] = [];
    
    const newUnlocks = checkAchievements(stats, unlocked);
    
    const mathWhiz = newUnlocks.find((a) => a.id === 'math_whiz');
    expect(mathWhiz).toBeDefined();
  });

  it('should unlock pattern_pro with pattern level 5', () => {
    const stats = createTestStats({
      maxLevels: { pattern: 5 },
    });
    const unlocked: string[] = [];
    
    const newUnlocks = checkAchievements(stats, unlocked);
    
    const patternPro = newUnlocks.find((a) => a.id === 'pattern_pro');
    expect(patternPro).toBeDefined();
  });

  it('should unlock score_100 with 100 points', () => {
    const stats = createTestStats({ totalScore: 100 });
    const unlocked: string[] = [];
    
    const newUnlocks = checkAchievements(stats, unlocked);
    
    const score100 = newUnlocks.find((a) => a.id === 'score_100');
    expect(score100).toBeDefined();
  });

  it('should unlock score_500 with 500 points', () => {
    const stats = createTestStats({ totalScore: 500 });
    const unlocked: string[] = [];
    
    const newUnlocks = checkAchievements(stats, unlocked);
    
    const score500 = newUnlocks.find((a) => a.id === 'score_500');
    expect(score500).toBeDefined();
  });

  it('should unlock persistent with 10 games played', () => {
    const stats = createTestStats({ gamesPlayed: 10 });
    const unlocked: string[] = [];
    
    const newUnlocks = checkAchievements(stats, unlocked);
    
    const persistent = newUnlocks.find((a) => a.id === 'persistent');
    expect(persistent).toBeDefined();
  });

  it('should unlock all_games when all game types played', () => {
    const stats = createTestStats({
      gamesByType: {
        word_builder: 1,
        memory_math: 1,
        sentence_logic: 1,
        balance_scale: 1,
        letter_match: 1,
        pattern: 1,
        robo_path: 1,
        syllable_builder: 1,
        time_match: 1,
      },
    });
    const unlocked: string[] = [];
    
    const newUnlocks = checkAchievements(stats, unlocked);
    
    const allGames = newUnlocks.find((a) => a.id === 'all_games');
    expect(allGames).toBeDefined();
  });

  it('should not unlock all_games when missing one game type', () => {
    const stats = createTestStats({
      gamesByType: {
        word_builder: 1,
        memory_math: 1,
        sentence_logic: 1,
        balance_scale: 1,
        letter_match: 1,
        pattern: 1,
        robo_path: 1,
        syllable_builder: 1,
        // time_match missing
      },
    });
    const unlocked: string[] = [];
    
    const newUnlocks = checkAchievements(stats, unlocked);
    
    const allGames = newUnlocks.find((a) => a.id === 'all_games');
    expect(allGames).toBeUndefined();
  });

  it('should unlock star_collector_50 with 50 stars', () => {
    const stats = createTestStats({ collectedStars: 50 });
    const unlocked: string[] = [];
    
    const newUnlocks = checkAchievements(stats, unlocked);
    
    const starCollector = newUnlocks.find((a) => a.id === 'star_collector_50');
    expect(starCollector).toBeDefined();
  });

  it('should unlock star_collector_100 with 100 stars', () => {
    const stats = createTestStats({ collectedStars: 100 });
    const unlocked: string[] = [];
    
    const newUnlocks = checkAchievements(stats, unlocked);
    
    const starCollector = newUnlocks.find((a) => a.id === 'star_collector_100');
    expect(starCollector).toBeDefined();
  });

  it('should unlock star_collector_250 with 250 stars', () => {
    const stats = createTestStats({ collectedStars: 250 });
    const unlocked: string[] = [];
    
    const newUnlocks = checkAchievements(stats, unlocked);
    
    const starCollector = newUnlocks.find((a) => a.id === 'star_collector_250');
    expect(starCollector).toBeDefined();
  });

  it('should unlock multiple achievements at once', () => {
    const stats = createTestStats({
      gamesPlayed: 10,
      totalScore: 500,
      maxStreak: 5,
    });
    const unlocked: string[] = [];
    
    const newUnlocks = checkAchievements(stats, unlocked);
    
    expect(newUnlocks.length).toBeGreaterThan(1);
    expect(newUnlocks.find((a) => a.id === 'first_game')).toBeDefined();
    expect(newUnlocks.find((a) => a.id === 'persistent')).toBeDefined();
    expect(newUnlocks.find((a) => a.id === 'perfect_5')).toBeDefined();
    expect(newUnlocks.find((a) => a.id === 'score_500')).toBeDefined();
  });

  it('should not re-unlock achievements', () => {
    const stats = createTestStats({
      gamesPlayed: 100,
      totalScore: 1000,
    });
    const unlocked = ['first_game', 'persistent', 'score_100', 'score_500'];
    
    const newUnlocks = checkAchievements(stats, unlocked);
    
    expect(newUnlocks.find((a) => a.id === 'first_game')).toBeUndefined();
    expect(newUnlocks.find((a) => a.id === 'persistent')).toBeUndefined();
    expect(newUnlocks.find((a) => a.id === 'score_100')).toBeUndefined();
    expect(newUnlocks.find((a) => a.id === 'score_500')).toBeUndefined();
  });
});
