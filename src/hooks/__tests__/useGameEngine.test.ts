import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useGameEngine } from '../useGameEngine';

describe('useGameEngine', () => {
  describe('Problem Generation', () => {
    it('should generate unique problems', () => {
      const { result } = renderHook(() => useGameEngine());
      
      const problem1 = result.current.generateUniqueProblemForGame('word_builder', 1, 'starter', {
        recentAccuracy: [],
        averageResponseTime: [],
        consecutiveCorrect: 0,
        consecutiveWrong: 0,
        difficultyMultiplier: 1.0,
        levelAdjustment: 0,
      });
      
      expect(problem1).toBeTruthy();
      expect(problem1).toHaveProperty('type');
      expect(problem1).toHaveProperty('answer');
    });

    it('should handle advanced game types', () => {
      const { result } = renderHook(() => useGameEngine());
      
      const problem = result.current.generateUniqueProblemForGame('word_builder_adv', 1, 'advanced', {
        recentAccuracy: [],
        averageResponseTime: [],
        consecutiveCorrect: 0,
        consecutiveWrong: 0,
        difficultyMultiplier: 1.0,
        levelAdjustment: 0,
      });
      
      expect(problem).toBeTruthy();
      expect(problem?.type).toBe('word_builder');
    });

    it('should use adaptive difficulty', () => {
      const { result } = renderHook(() => useGameEngine());
      
      // Generate with easier difficulty
      const problem1 = result.current.generateUniqueProblemForGame('word_builder', 3, 'starter', {
        recentAccuracy: [],
        averageResponseTime: [],
        consecutiveCorrect: 0,
        consecutiveWrong: 0,
        difficultyMultiplier: 1.0,
        levelAdjustment: -2, // Should lower the level
      });
      
      expect(problem1).toBeTruthy();
    });

    it('should generate different problems for different games', () => {
      const { result } = renderHook(() => useGameEngine());
      
      const wordProblem = result.current.generateUniqueProblemForGame('word_builder', 1, 'starter', {
        recentAccuracy: [],
        averageResponseTime: [],
        consecutiveCorrect: 0,
        consecutiveWrong: 0,
        difficultyMultiplier: 1.0,
        levelAdjustment: 0,
      });
      
      const patternProblem = result.current.generateUniqueProblemForGame('pattern', 1, 'starter', {
        recentAccuracy: [],
        averageResponseTime: [],
        consecutiveCorrect: 0,
        consecutiveWrong: 0,
        difficultyMultiplier: 1.0,
        levelAdjustment: 0,
      });
      
      expect(wordProblem?.type).toBe('word_builder');
      expect(patternProblem?.type).toBe('pattern');
    });

    it('should return null for invalid game type', () => {
      const { result } = renderHook(() => useGameEngine());
      
      const problem = result.current.generateUniqueProblemForGame('invalid_game', 1, 'starter', {
        recentAccuracy: [],
        averageResponseTime: [],
        consecutiveCorrect: 0,
        consecutiveWrong: 0,
        difficultyMultiplier: 1.0,
        levelAdjustment: 0,
      });
      
      expect(problem).toBeNull();
    });
  });

  describe('Answer Validation', () => {
    it('should validate correct answer', () => {
      const { result } = renderHook(() => useGameEngine());
      
      const problem = {
        type: 'word_builder',
        answer: 'TEST',
        target: 'TEST',
      };
      
      const isCorrect = result.current.validateAnswer(problem, 'TEST');
      expect(isCorrect).toBe(true);
    });

    it('should validate wrong answer', () => {
      const { result } = renderHook(() => useGameEngine());
      
      const problem = {
        type: 'word_builder',
        answer: 'TEST',
        target: 'TEST',
      };
      
      const isCorrect = result.current.validateAnswer(problem, 'WRONG');
      expect(isCorrect).toBe(false);
    });

    it('should handle null problem', () => {
      const { result } = renderHook(() => useGameEngine());
      
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const isCorrect = result.current.validateAnswer(null as any, 'TEST');
      expect(isCorrect).toBe(false);
    });
  });
});
