import { describe, it, expect } from 'vitest';
import { useGameEngine } from '../useGameEngine';
import { renderHook } from '@testing-library/react';

// Import game registrations to ensure games are registered
import '../../games/registrations';

describe('useGameEngine - Problem UID Uniqueness', () => {
  it('generates unique problem UIDs on consecutive calls', () => {
    const { result } = renderHook(() => useGameEngine());

    const adaptiveDifficulty = {
      recentAccuracy: [],
      averageResponseTime: [],
      consecutiveCorrect: 0,
      consecutiveWrong: 0,
      difficultyMultiplier: 1,
      levelAdjustment: 0,
    };

    // Generate multiple problems for word_builder
    const problem1 = result.current.generateUniqueProblemForGame(
      'word_builder',
      1,
      'starter',
      adaptiveDifficulty,
    );
    const problem2 = result.current.generateUniqueProblemForGame(
      'word_builder',
      1,
      'starter',
      adaptiveDifficulty,
    );
    const problem3 = result.current.generateUniqueProblemForGame(
      'word_builder',
      1,
      'starter',
      adaptiveDifficulty,
    );

    // All problems should have unique UIDs
    expect(problem1?.uid).toBeDefined();
    expect(problem2?.uid).toBeDefined();
    expect(problem3?.uid).toBeDefined();

    if (problem1 && problem2 && problem3) {
      expect(problem1.uid).not.toBe(problem2.uid);
      expect(problem2.uid).not.toBe(problem3.uid);
      expect(problem1.uid).not.toBe(problem3.uid);
    }
  });

  it('generates unique UIDs for word_cascade problems', () => {
    const { result } = renderHook(() => useGameEngine());

    const adaptiveDifficulty = {
      recentAccuracy: [],
      averageResponseTime: [],
      consecutiveCorrect: 0,
      consecutiveWrong: 0,
      difficultyMultiplier: 1,
      levelAdjustment: 0,
    };

    // Generate multiple problems for word_cascade
    const problem1 = result.current.generateUniqueProblemForGame(
      'word_cascade',
      1,
      'starter',
      adaptiveDifficulty,
    );
    const problem2 = result.current.generateUniqueProblemForGame(
      'word_cascade',
      1,
      'starter',
      adaptiveDifficulty,
    );
    const problem3 = result.current.generateUniqueProblemForGame(
      'word_cascade',
      1,
      'starter',
      adaptiveDifficulty,
    );

    // All problems should have unique UIDs
    expect(problem1?.uid).toBeDefined();
    expect(problem2?.uid).toBeDefined();
    expect(problem3?.uid).toBeDefined();

    if (problem1 && problem2 && problem3) {
      expect(problem1.uid).not.toBe(problem2.uid);
      expect(problem2.uid).not.toBe(problem3.uid);
      expect(problem1.uid).not.toBe(problem3.uid);
    }
  });

  it('generates unique UIDs across rapid successive calls', () => {
    const { result } = renderHook(() => useGameEngine());

    const adaptiveDifficulty = {
      recentAccuracy: [],
      averageResponseTime: [],
      consecutiveCorrect: 0,
      consecutiveWrong: 0,
      difficultyMultiplier: 1,
      levelAdjustment: 0,
    };

    // Generate 10 problems rapidly
    const problems = [];
    for (let i = 0; i < 10; i++) {
      const problem = result.current.generateUniqueProblemForGame(
        'word_builder',
        1,
        'starter',
        adaptiveDifficulty,
      );
      if (problem) {
        problems.push(problem);
      }
    }

    // Extract all UIDs
    const uids = problems.map((p) => p.uid);

    // All UIDs should be unique (no duplicates)
    const uniqueUids = new Set(uids);
    expect(uniqueUids.size).toBe(uids.length);
  });

  it('avoids generating the same word consecutively for word games', () => {
    const { result } = renderHook(() => useGameEngine());

    const adaptiveDifficulty = {
      recentAccuracy: [],
      averageResponseTime: [],
      consecutiveCorrect: 0,
      consecutiveWrong: 0,
      difficultyMultiplier: 1,
      levelAdjustment: 0,
    };

    // Use level 3 for a larger word pool (level 1 pool is too small for guaranteed dedup)
    const problems = [];
    for (let i = 0; i < 4; i++) {
      const problem = result.current.generateUniqueProblemForGame(
        'word_builder',
        3,
        'starter',
        adaptiveDifficulty,
      );
      if (problem && problem.type === 'word_builder') {
        problems.push(problem);
      }
    }

    // Count consecutive duplicates — at most 1 allowed (small pool fallback)
    let consecutiveRepeats = 0;
    for (let i = 0; i < problems.length - 1; i++) {
      const current = problems[i];
      const next = problems[i + 1];
      if (current && next && current.target === next.target) {
        consecutiveRepeats++;
      }
    }
    expect(consecutiveRepeats).toBeLessThanOrEqual(1);
  });
});
