import { describe, it, expect } from 'vitest';
import {
  createStats,
  updateStats,
  recordGameStart,
  recordAnswer,
  recordLevelUp,
  recordScore,
} from '../stats';

describe('createStats', () => {
  it('should create initial stats object with correct defaults', () => {
    const stats = createStats();
    
    expect(stats).toEqual({
      gamesPlayed: 0,
      correctAnswers: 0,
      wrongAnswers: 0,
      totalScore: 0,
      maxStreak: 0,
      currentStreak: 0,
      maxLevels: {},
      gamesByType: {},
      totalTimePlayed: 0,
      lastPlayed: null,
      collectedStars: 0,
    });
  });
});

describe('updateStats', () => {
  it('should update stats with provided values', () => {
    const stats = createStats();
    const updated = updateStats(stats, { gamesPlayed: 5, totalScore: 100 });
    
    expect(updated.gamesPlayed).toBe(5);
    expect(updated.totalScore).toBe(100);
  });

  it('should not mutate original stats object', () => {
    const stats = createStats();
    const updated = updateStats(stats, { gamesPlayed: 5 });
    
    expect(stats.gamesPlayed).toBe(0);
    expect(updated.gamesPlayed).toBe(5);
  });

  it('should merge updates with existing stats', () => {
    const stats = createStats();
    stats.gamesPlayed = 10;
    stats.totalScore = 50;
    
    const updated = updateStats(stats, { totalScore: 100 });
    
    expect(updated.gamesPlayed).toBe(10);
    expect(updated.totalScore).toBe(100);
  });
});

describe('recordGameStart', () => {
  it('should increment games played counter', () => {
    const stats = createStats();
    const updated = recordGameStart(stats, 'word_builder');
    
    expect(updated.gamesPlayed).toBe(1);
  });

  it('should update games by type counter', () => {
    const stats = createStats();
    const updated = recordGameStart(stats, 'word_builder');
    
    expect(updated.gamesByType.word_builder).toBe(1);
  });

  it('should increment existing game type count', () => {
    const stats = createStats();
    stats.gamesByType = { word_builder: 3 };
    
    const updated = recordGameStart(stats, 'word_builder');
    
    expect(updated.gamesByType.word_builder).toBe(4);
  });

  it('should update last played timestamp', () => {
    const stats = createStats();
    const before = Date.now();
    const updated = recordGameStart(stats, 'word_builder');
    const after = Date.now();
    
    expect(updated.lastPlayed).toBeGreaterThanOrEqual(before);
    expect(updated.lastPlayed).toBeLessThanOrEqual(after);
  });

  it('should handle multiple game types', () => {
    const stats = createStats();
    let updated = recordGameStart(stats, 'word_builder');
    updated = recordGameStart(updated, 'memory_math');
    updated = recordGameStart(updated, 'word_builder');
    
    expect(updated.gamesByType.word_builder).toBe(2);
    expect(updated.gamesByType.memory_math).toBe(1);
    expect(updated.gamesPlayed).toBe(3);
  });
});

describe('recordAnswer', () => {
  it('should increment correct answers for correct answer', () => {
    const stats = createStats();
    const updated = recordAnswer(stats, true);
    
    expect(updated.correctAnswers).toBe(1);
    expect(updated.wrongAnswers).toBe(0);
  });

  it('should increment wrong answers for incorrect answer', () => {
    const stats = createStats();
    const updated = recordAnswer(stats, false);
    
    expect(updated.correctAnswers).toBe(0);
    expect(updated.wrongAnswers).toBe(1);
  });

  it('should increase streak on correct answer', () => {
    const stats = createStats();
    let updated = recordAnswer(stats, true);
    updated = recordAnswer(updated, true);
    updated = recordAnswer(updated, true);
    
    expect(updated.currentStreak).toBe(3);
  });

  it('should reset streak on wrong answer', () => {
    const stats = createStats();
    stats.currentStreak = 5;
    
    const updated = recordAnswer(stats, false);
    
    expect(updated.currentStreak).toBe(0);
  });

  it('should update max streak when current streak exceeds it', () => {
    const stats = createStats();
    let updated = recordAnswer(stats, true);
    updated = recordAnswer(updated, true);
    updated = recordAnswer(updated, true);
    
    expect(updated.maxStreak).toBe(3);
    expect(updated.currentStreak).toBe(3);
  });

  it('should not decrease max streak', () => {
    const stats = createStats();
    stats.maxStreak = 10;
    stats.currentStreak = 5;
    
    const updated = recordAnswer(stats, true);
    
    expect(updated.maxStreak).toBe(10);
    expect(updated.currentStreak).toBe(6);
  });

  it('should maintain max streak when current is lower', () => {
    const stats = createStats();
    stats.maxStreak = 10;
    stats.currentStreak = 3;
    
    const updated = recordAnswer(stats, false);
    
    expect(updated.maxStreak).toBe(10);
    expect(updated.currentStreak).toBe(0);
  });
});

describe('recordLevelUp', () => {
  it('should record new max level for game type', () => {
    const stats = createStats();
    const updated = recordLevelUp(stats, 'word_builder', 5);
    
    expect(updated.maxLevels.word_builder).toBe(5);
  });

  it('should update max level when new level is higher', () => {
    const stats = createStats();
    stats.maxLevels = { word_builder: 3 };
    
    const updated = recordLevelUp(stats, 'word_builder', 5);
    
    expect(updated.maxLevels.word_builder).toBe(5);
  });

  it('should not decrease max level when new level is lower', () => {
    const stats = createStats();
    stats.maxLevels = { word_builder: 7 };
    
    const updated = recordLevelUp(stats, 'word_builder', 5);
    
    expect(updated.maxLevels.word_builder).toBe(7);
  });

  it('should handle multiple game types', () => {
    const stats = createStats();
    let updated = recordLevelUp(stats, 'word_builder', 5);
    updated = recordLevelUp(updated, 'memory_math', 3);
    
    expect(updated.maxLevels.word_builder).toBe(5);
    expect(updated.maxLevels.memory_math).toBe(3);
  });

  it('should initialize max level to 0 if not present', () => {
    const stats = createStats();
    const updated = recordLevelUp(stats, 'word_builder', 3);
    
    expect(updated.maxLevels.word_builder).toBe(3);
  });
});

describe('recordScore', () => {
  it('should add points to total score', () => {
    const stats = createStats();
    const updated = recordScore(stats, 10);
    
    expect(updated.totalScore).toBe(10);
  });

  it('should accumulate points over multiple calls', () => {
    const stats = createStats();
    let updated = recordScore(stats, 10);
    updated = recordScore(updated, 20);
    updated = recordScore(updated, 5);
    
    expect(updated.totalScore).toBe(35);
  });

  it('should handle zero points', () => {
    const stats = createStats();
    stats.totalScore = 50;
    
    const updated = recordScore(stats, 0);
    
    expect(updated.totalScore).toBe(50);
  });

  it('should handle negative points', () => {
    const stats = createStats();
    stats.totalScore = 50;
    
    const updated = recordScore(stats, -10);
    
    expect(updated.totalScore).toBe(40);
  });
});
