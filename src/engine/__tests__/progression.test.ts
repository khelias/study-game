import { describe, it, expect } from 'vitest';
import {
  calculateOptimalDifficulty,
  getNextLevelDifficulty,
  getProgressionRecommendation,
  calculateGameSuccessScore,
} from '../progression';
import { createTestStats } from '../../test/utils';

describe('calculateOptimalDifficulty', () => {
  it('should return effective level for starter profile', () => {
    const result = calculateOptimalDifficulty('word_builder', 3, 'starter');
    
    expect(result.effectiveLevel).toBe(3);
    expect(result.baseLevel).toBe(1);
    expect(result.difficultyOffset).toBe(0);
  });

  it('should apply difficulty offset for advanced profile', () => {
    const result = calculateOptimalDifficulty('word_builder', 3, 'advanced');
    
    expect(result.effectiveLevel).toBeGreaterThan(3);
    expect(result.difficultyOffset).toBeGreaterThan(0);
  });

  it('should mark level 1-2 as easy', () => {
    const result1 = calculateOptimalDifficulty('word_builder', 1, 'starter');
    const result2 = calculateOptimalDifficulty('word_builder', 2, 'starter');
    
    expect(result1.isEasy).toBe(true);
    expect(result1.isMedium).toBe(false);
    expect(result1.isHard).toBe(false);
    
    expect(result2.isEasy).toBe(true);
    expect(result2.isMedium).toBe(false);
    expect(result2.isHard).toBe(false);
  });

  it('should mark level 3-5 as medium', () => {
    const result3 = calculateOptimalDifficulty('word_builder', 3, 'starter');
    const result5 = calculateOptimalDifficulty('word_builder', 5, 'starter');
    
    expect(result3.isEasy).toBe(false);
    expect(result3.isMedium).toBe(true);
    expect(result3.isHard).toBe(false);
    
    expect(result5.isEasy).toBe(false);
    expect(result5.isMedium).toBe(true);
    expect(result5.isHard).toBe(false);
  });

  it('should mark level 6+ as hard', () => {
    const result = calculateOptimalDifficulty('word_builder', 6, 'starter');
    
    expect(result.isEasy).toBe(false);
    expect(result.isMedium).toBe(false);
    expect(result.isHard).toBe(true);
  });

  it('should not go below level 1', () => {
    const result = calculateOptimalDifficulty('word_builder', -5, 'starter');
    
    expect(result.effectiveLevel).toBeGreaterThanOrEqual(1);
  });

  it('should handle unknown profile gracefully', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = calculateOptimalDifficulty('word_builder', 3, 'unknown' as any);
    
    expect(result).toHaveProperty('effectiveLevel');
    expect(result).toHaveProperty('baseLevel');
  });
});

describe('getNextLevelDifficulty', () => {
  it('should increase level by 1 with average performance', () => {
    const next = getNextLevelDifficulty(3, { accuracy: 0.65, averageTime: 8000 });
    
    expect(next).toBe(4);
  });

  it('should increase level by 1.5 with high performance', () => {
    const next = getNextLevelDifficulty(3, { accuracy: 0.85, averageTime: 4000 });
    
    expect(next).toBe(4); // floor(3 + 1.5) = 4
  });

  it('should increase level by 0.5 with low performance', () => {
    const next = getNextLevelDifficulty(3, { accuracy: 0.4, averageTime: 16000 });
    
    expect(next).toBe(3); // floor(3 + 0.5) = 3
  });

  it('should not go below level 1', () => {
    const next = getNextLevelDifficulty(1, { accuracy: 0.2, averageTime: 20000 });
    
    expect(next).toBeGreaterThanOrEqual(1);
  });

  it('should increase faster with excellent accuracy and speed', () => {
    const next = getNextLevelDifficulty(5, { accuracy: 0.95, averageTime: 3000 });
    
    expect(next).toBeGreaterThan(5);
  });

  it('should increase slower with low accuracy', () => {
    const next = getNextLevelDifficulty(5, { accuracy: 0.3, averageTime: 6000 });
    
    expect(next).toBeLessThanOrEqual(6);
  });

  it('should increase slower with slow response time', () => {
    const next = getNextLevelDifficulty(5, { accuracy: 0.7, averageTime: 18000 });
    
    expect(next).toBeLessThanOrEqual(6);
  });
});

describe('getProgressionRecommendation', () => {
  it('should recommend start for new game', () => {
    const stats = createTestStats();
    const recommendation = getProgressionRecommendation(stats, 'word_builder');
    
    expect(recommendation.action).toBe('start');
    expect(recommendation.priority).toBe('high');
    expect(recommendation.message).toContain('Alusta');
  });

  it('should recommend level up with high accuracy', () => {
    const stats = createTestStats({
      gamesByType: { word_builder: 5 },
      maxLevels: { word_builder: 3 },
      correctAnswers: 90,
      wrongAnswers: 10,
    });
    const recommendation = getProgressionRecommendation(stats, 'word_builder');
    
    expect(recommendation.action).toBe('level_up');
    expect(recommendation.priority).toBe('medium');
  });

  it('should recommend level down with low accuracy at high level', () => {
    const stats = createTestStats({
      gamesByType: { word_builder: 10 },
      maxLevels: { word_builder: 5 },
      correctAnswers: 30,
      wrongAnswers: 70,
    });
    const recommendation = getProgressionRecommendation(stats, 'word_builder');
    
    expect(recommendation.action).toBe('level_down');
    expect(recommendation.priority).toBe('low');
  });

  it('should recommend continue with average performance', () => {
    const stats = createTestStats({
      gamesByType: { word_builder: 5 },
      maxLevels: { word_builder: 3 },
      correctAnswers: 60,
      wrongAnswers: 40,
    });
    const recommendation = getProgressionRecommendation(stats, 'word_builder');
    
    expect(recommendation.action).toBe('continue');
    expect(recommendation.priority).toBe('low');
  });

  it('should not recommend level up if already at max level', () => {
    const stats = createTestStats({
      gamesByType: { word_builder: 10 },
      maxLevels: { word_builder: 10 },
      correctAnswers: 90,
      wrongAnswers: 10,
    });
    const recommendation = getProgressionRecommendation(stats, 'word_builder');
    
    expect(recommendation.action).not.toBe('level_up');
  });

  it('should handle missing game type data', () => {
    const stats = createTestStats({
      correctAnswers: 50,
      wrongAnswers: 50,
    });
    const recommendation = getProgressionRecommendation(stats, 'nonexistent_game');
    
    expect(recommendation).toHaveProperty('action');
    expect(recommendation).toHaveProperty('message');
    expect(recommendation).toHaveProperty('priority');
  });
});

describe('calculateGameSuccessScore', () => {
  it('should return low score for new game with no stats', () => {
    const stats = createTestStats();
    const score = calculateGameSuccessScore(stats, 'word_builder');
    
    // New game has level 1 (10 points) + 0 accuracy + 0 games = 10 points
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThan(20);
  });

  it('should increase score with higher level', () => {
    const stats1 = createTestStats({
      maxLevels: { word_builder: 3 },
      correctAnswers: 50,
      wrongAnswers: 50,
    });
    const stats2 = createTestStats({
      maxLevels: { word_builder: 7 },
      correctAnswers: 50,
      wrongAnswers: 50,
    });
    
    const score1 = calculateGameSuccessScore(stats1, 'word_builder');
    const score2 = calculateGameSuccessScore(stats2, 'word_builder');
    
    expect(score2).toBeGreaterThan(score1);
  });

  it('should increase score with higher accuracy', () => {
    const stats1 = createTestStats({
      correctAnswers: 30,
      wrongAnswers: 70,
    });
    const stats2 = createTestStats({
      correctAnswers: 90,
      wrongAnswers: 10,
    });
    
    const score1 = calculateGameSuccessScore(stats1, 'word_builder');
    const score2 = calculateGameSuccessScore(stats2, 'word_builder');
    
    expect(score2).toBeGreaterThan(score1);
  });

  it('should increase score with more games played', () => {
    const stats1 = createTestStats({
      gamesByType: { word_builder: 2 },
      correctAnswers: 50,
      wrongAnswers: 50,
    });
    const stats2 = createTestStats({
      gamesByType: { word_builder: 10 },
      correctAnswers: 50,
      wrongAnswers: 50,
    });
    
    const score1 = calculateGameSuccessScore(stats1, 'word_builder');
    const score2 = calculateGameSuccessScore(stats2, 'word_builder');
    
    expect(score2).toBeGreaterThan(score1);
  });

  it('should calculate high score for excellent performance', () => {
    const stats = createTestStats({
      maxLevels: { word_builder: 10 },
      gamesByType: { word_builder: 50 },
      correctAnswers: 100,
      wrongAnswers: 0,
    });
    
    const score = calculateGameSuccessScore(stats, 'word_builder');
    
    // Score components: level (100 capped) + accuracy (50) + games (30 capped) = 180
    // The actual implementation doesn't cap total, so test reflects reality
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeGreaterThan(100); // Can exceed 100 in current implementation
  });

  it('should cap level score at 100', () => {
    const stats = createTestStats({
      maxLevels: { word_builder: 20 },
      correctAnswers: 0,
      wrongAnswers: 0,
    });
    
    const score = calculateGameSuccessScore(stats, 'word_builder');
    
    // Level score is capped at 100
    expect(score).toBeLessThanOrEqual(100);
  });
});
