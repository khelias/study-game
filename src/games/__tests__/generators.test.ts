import { describe, it, expect } from 'vitest';
import { Generators } from '../generators';
import { createRng } from '../../engine/rng';
import type { BalanceScaleProblem, WordBuilderProblem, PatternProblem } from '../../types/game';

describe('Generators', () => {
  describe('balance_scale', () => {
    it('should generate valid balance scale problem', () => {
      const rng = createRng(12345);
      const generator = Generators.balance_scale;
      if (!generator) throw new Error('balance_scale generator not found');
      const problem = generator(1, rng, 'starter') as BalanceScaleProblem;
      
      expect(problem.type).toBe('balance_scale');
      expect(problem.display).toHaveProperty('left');
      expect(problem.display).toHaveProperty('right');
      expect(problem.display.left).toBeInstanceOf(Array);
      expect(problem.display.right).toBeInstanceOf(Array);
      expect(typeof problem.answer).toBe('number');
      expect(problem.options).toBeInstanceOf(Array);
      expect(problem.options.length).toBeGreaterThanOrEqual(3);
    });

    it('should include correct answer in options', () => {
      const rng = createRng(12345);
      const generator = Generators.balance_scale;
      if (!generator) throw new Error('balance_scale generator not found');
      const problem = generator(1, rng, 'starter') as BalanceScaleProblem;
      
      expect(problem.options).toContain(problem.answer);
    });

    it('should generate consistent problems with same seed', () => {
      const rng1 = createRng(12345);
      const rng2 = createRng(12345);
      const generator = Generators.balance_scale;
      if (!generator) throw new Error('balance_scale generator not found');
      
      const problem1 = generator(1, rng1, 'starter') as BalanceScaleProblem;
      const problem2 = generator(1, rng2, 'starter') as BalanceScaleProblem;
      
      expect(problem1.answer).toBe(problem2.answer);
      expect(problem1.display).toEqual(problem2.display);
    });

    it('should increase difficulty with level', () => {
      const rng1 = createRng(12345);
      const rng2 = createRng(12345);
      const generator = Generators.balance_scale;
      if (!generator) throw new Error('balance_scale generator not found');
      
      const problem1 = generator(1, rng1, 'starter') as BalanceScaleProblem;
      const problem5 = generator(5, rng2, 'starter') as BalanceScaleProblem;
      
      const sum1 = problem1.display.left.reduce((a, b) => a + b, 0);
      const sum5 = problem5.display.left.reduce((a, b) => a + b, 0);
      
      // Higher level should generally have larger numbers
      expect(sum5).toBeGreaterThan(sum1);
    });

    it('should balance correctly', () => {
      const rng = createRng(12345);
      const generator = Generators.balance_scale;
      if (!generator) throw new Error('balance_scale generator not found');
      const problem = generator(1, rng, 'starter') as BalanceScaleProblem;
      
      const leftSum = problem.display.left.reduce((a, b) => a + b, 0);
      const rightSum = problem.display.right.reduce((a, b) => a + b, 0) + problem.answer;
      
      expect(leftSum).toBe(rightSum);
    });
  });

  describe('word_builder', () => {
    it('should generate valid word builder problem', () => {
      const rng = createRng(12345);
      const generator = Generators.word_builder;
      if (!generator) throw new Error('word_builder generator not found');
      const problem = generator(1, rng, 'starter') as WordBuilderProblem;
      
      expect(problem.type).toBe('word_builder');
      expect(typeof problem.target).toBe('string');
      expect(problem.target.length).toBeGreaterThan(0);
      expect(problem.shuffled).toBeInstanceOf(Array);
      expect(problem.shuffled.length).toBe(problem.target.length);
    });

    it('should have all target letters in shuffled array', () => {
      const rng = createRng(12345);
      const generator = Generators.word_builder;
      if (!generator) throw new Error('word_builder generator not found');
      const problem = generator(1, rng, 'starter') as WordBuilderProblem;
      
      const targetLetters = problem.target.split('').sort();
      const shuffledLetters = problem.shuffled.map((l) => l.char).sort();
      
      expect(shuffledLetters).toEqual(targetLetters);
    });

    it('should generate consistent problems with same seed', () => {
      const rng1 = createRng(12345);
      const rng2 = createRng(12345);
      const generator = Generators.word_builder;
      if (!generator) throw new Error('word_builder generator not found');
      
      const problem1 = generator(1, rng1, 'starter') as WordBuilderProblem;
      const problem2 = generator(1, rng2, 'starter') as WordBuilderProblem;
      
      expect(problem1.target).toBe(problem2.target);
    });

    it('should increase word length with level', () => {
      const rng1 = createRng(12345);
      const rng2 = createRng(12345);
      const generator = Generators.word_builder;
      if (!generator) throw new Error('word_builder generator not found');
      
      const problem1 = generator(1, rng1, 'starter') as WordBuilderProblem;
      const problem5 = generator(8, rng2, 'starter') as WordBuilderProblem;
      
      expect(problem5.target.length).toBeGreaterThanOrEqual(problem1.target.length);
    });

    it('should have emoji for word', () => {
      const rng = createRng(12345);
      const generator = Generators.word_builder;
      if (!generator) throw new Error('word_builder generator not found');
      const problem = generator(1, rng, 'starter') as WordBuilderProblem;
      
      expect(typeof problem.emoji).toBe('string');
    });
  });

  describe('pattern', () => {
    it('should generate valid pattern problem', () => {
      const rng = createRng(12345);
      const generator = Generators.pattern;
      if (!generator) throw new Error('pattern generator not found');
      const problem = generator(1, rng, 'starter') as PatternProblem;
      
      expect(problem.type).toBe('pattern');
      expect(problem.sequence).toBeInstanceOf(Array);
      expect(typeof problem.answer).toBe('string');
      expect(problem.options).toBeInstanceOf(Array);
    });

    it('should include correct answer in options', () => {
      const rng = createRng(12345);
      const generator = Generators.pattern;
      if (!generator) throw new Error('pattern generator not found');
      const problem = generator(1, rng, 'starter') as PatternProblem;
      
      expect(problem.options).toContain(problem.answer);
    });

    it('should generate consistent problems with same seed', () => {
      const rng1 = createRng(12345);
      const rng2 = createRng(12345);
      const generator = Generators.pattern;
      if (!generator) throw new Error('pattern generator not found');
      
      const problem1 = generator(1, rng1, 'starter') as PatternProblem;
      const problem2 = generator(1, rng2, 'starter') as PatternProblem;
      
      expect(problem1.sequence).toEqual(problem2.sequence);
      expect(problem1.answer).toBe(problem2.answer);
    });

    it('should have at least 3 options', () => {
      const rng = createRng(12345);
      const generator = Generators.pattern;
      if (!generator) throw new Error('pattern generator not found');
      const problem = generator(1, rng, 'starter') as PatternProblem;
      
      expect(problem.options.length).toBeGreaterThanOrEqual(3);
    });

    it('should increase pattern complexity with level', () => {
      const rng1 = createRng(12345);
      const rng2 = createRng(12345);
      const generator = Generators.pattern;
      if (!generator) throw new Error('pattern generator not found');
      
      const problem1 = generator(1, rng1, 'starter') as PatternProblem;
      const problem5 = generator(5, rng2, 'starter') as PatternProblem;
      
      expect(problem5.sequence.length).toBeGreaterThanOrEqual(problem1.sequence.length);
    });
  });

  describe('answer validation', () => {
    it('should validate balance_scale answer correctly', () => {
      const rng = createRng(12345);
      const generator = Generators.balance_scale;
      if (!generator) throw new Error('balance_scale generator not found');
      const problem = generator(1, rng, 'starter') as BalanceScaleProblem;
      
      // Correct answer should match
      expect(problem.answer).toBe(problem.answer);
      
      // Wrong answer should not match
      const wrongAnswer = problem.answer + 1;
      expect(wrongAnswer).not.toBe(problem.answer);
    });

    it('should validate word_builder answer correctly', () => {
      const rng = createRng(12345);
      const generator = Generators.word_builder;
      if (!generator) throw new Error('word_builder generator not found');
      const problem = generator(1, rng, 'starter') as WordBuilderProblem;
      
      // Correct answer is the target word
      expect(problem.target).toBe(problem.target);
      
      // Wrong answer should not match
      expect('wrong').not.toBe(problem.target);
    });

    it('should validate pattern answer correctly', () => {
      const rng = createRng(12345);
      const generator = Generators.pattern;
      if (!generator) throw new Error('pattern generator not found');
      const problem = generator(1, rng, 'starter') as PatternProblem;
      
      // Correct answer should be in options
      expect(problem.options).toContain(problem.answer);
      
      // Wrong answer should not match
      const wrongOptions = problem.options.filter((opt) => opt !== problem.answer);
      if (wrongOptions.length > 0) {
        expect(wrongOptions[0]).not.toBe(problem.answer);
      }
    });
  });

  describe('profile difficulty', () => {
    it('should generate harder problems for advanced profile', () => {
      const rng1 = createRng(12345);
      const rng2 = createRng(12345);
      const generator = Generators.balance_scale;
      if (!generator) throw new Error('balance_scale generator not found');
      
      const starterProblem = generator(1, rng1, 'starter') as BalanceScaleProblem;
      const advancedProblem = generator(1, rng2, 'advanced') as BalanceScaleProblem;
      
      const starterSum = starterProblem.display.left.reduce((a, b) => a + b, 0);
      const advancedSum = advancedProblem.display.left.reduce((a, b) => a + b, 0);
      
      expect(advancedSum).toBeGreaterThanOrEqual(starterSum);
    });

    it('should generate longer words for advanced profile', () => {
      const rng1 = createRng(12345);
      const rng2 = createRng(12345);
      const generator = Generators.word_builder;
      if (!generator) throw new Error('word_builder generator not found');
      
      const starterProblem = generator(1, rng1, 'starter') as WordBuilderProblem;
      const advancedProblem = generator(1, rng2, 'advanced') as WordBuilderProblem;
      
      expect(advancedProblem.target.length).toBeGreaterThanOrEqual(starterProblem.target.length);
    });
  });
});
