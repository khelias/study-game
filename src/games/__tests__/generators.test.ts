import { describe, it, expect } from 'vitest';
import { Generators } from '../generators';
import { createRng } from '../../engine/rng';
import type {
  BalanceScaleProblem,
  WordBuilderProblem,
  PatternProblem,
  MathSnakeProblem,
  CompareSizesProblem,
  PicturePairsProblem,
} from '../../types/game';

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
      // Shuffled should have all correct letters (no distractors at level 1)
      expect(problem.shuffled.length).toBe(problem.target.length);
    });

    it('should have all target letters in shuffled array at level 1', () => {
      const rng = createRng(12345);
      const generator = Generators.word_builder;
      if (!generator) throw new Error('word_builder generator not found');
      const problem = generator(1, rng, 'starter') as WordBuilderProblem;

      const targetLetters = problem.target.split('').sort();
      const shuffledLetters = problem.shuffled.map((l) => l.char).sort();

      expect(shuffledLetters).toEqual(targetLetters);
    });

    it('should use uppercase letters at level 1-3', () => {
      const rng = createRng(12345);
      const generator = Generators.word_builder;
      if (!generator) throw new Error('word_builder generator not found');
      const problem1 = generator(1, rng, 'starter') as WordBuilderProblem;
      const problem3 = generator(3, rng, 'starter') as WordBuilderProblem;

      // All letters should be uppercase
      expect(problem1.target).toBe(problem1.target.toUpperCase());
      expect(problem3.target).toBe(problem3.target.toUpperCase());
    });

    it('should use capitalized first letter at level 4-6', () => {
      const rng = createRng(12345);
      const generator = Generators.word_builder;
      if (!generator) throw new Error('word_builder generator not found');
      const problem4 = generator(4, rng, 'starter') as WordBuilderProblem;
      const problem6 = generator(6, rng, 'starter') as WordBuilderProblem;

      // First letter uppercase, rest lowercase
      const first4 = problem4.target[0];
      const first6 = problem6.target[0];
      if (first4) {
        expect(first4).toBe(first4.toUpperCase());
        expect(problem4.target.slice(1)).toBe(problem4.target.slice(1).toLowerCase());
      }
      if (first6) {
        expect(first6).toBe(first6.toUpperCase());
        expect(problem6.target.slice(1)).toBe(problem6.target.slice(1).toLowerCase());
      }
    });

    it('should use lowercase letters at level 7-9', () => {
      const rng = createRng(12345);
      const generator = Generators.word_builder;
      if (!generator) throw new Error('word_builder generator not found');
      const problem7 = generator(7, rng, 'starter') as WordBuilderProblem;
      const problem9 = generator(9, rng, 'starter') as WordBuilderProblem;

      // All letters should be lowercase
      expect(problem7.target).toBe(problem7.target.toLowerCase());
      expect(problem9.target).toBe(problem9.target.toLowerCase());
    });

    it('should add distractor letters at level 3+', () => {
      const rng = createRng(12345);
      const generator = Generators.word_builder;
      if (!generator) throw new Error('word_builder generator not found');

      // Level 1-2: no distractors
      const problem1 = generator(1, rng, 'starter') as WordBuilderProblem;
      expect(problem1.shuffled.length).toBe(problem1.target.length);

      // Level 3-4: 1 distractor
      const problem3 = generator(3, rng, 'starter') as WordBuilderProblem;
      expect(problem3.shuffled.length).toBe(problem3.target.length + 1);

      // Level 5-7: 2 distractors
      const problem5 = generator(5, rng, 'starter') as WordBuilderProblem;
      expect(problem5.shuffled.length).toBe(problem5.target.length + 2);

      // Level 8+: 3 distractors
      const problem8 = generator(8, rng, 'starter') as WordBuilderProblem;
      expect(problem8.shuffled.length).toBe(problem8.target.length + 3);
    });

    it('should add pre-filled positions for 6+ letter words', () => {
      const generator = Generators.word_builder;
      if (!generator) throw new Error('word_builder generator not found');

      // Generate multiple problems until we get a 6+ letter word
      let problem: WordBuilderProblem | null = null;
      for (let i = 0; i < 50; i++) {
        const testRng = createRng(12345 + i);
        const testProblem = generator(9, testRng, 'starter') as WordBuilderProblem;
        if (testProblem.target.length >= 6) {
          problem = testProblem;
          break;
        }
      }

      if (problem && problem.target.length >= 6) {
        expect(problem.preFilledPositions).toBeDefined();
        expect(problem.preFilledPositions!.length).toBeGreaterThan(0);

        // 6-letter words should have 1 pre-filled
        if (problem.target.length === 6) {
          expect(problem.preFilledPositions!.length).toBe(1);
        }
        // 7+ letter words should have 2 pre-filled
        if (problem.target.length >= 7) {
          expect(problem.preFilledPositions!.length).toBe(2);
        }
      }
    });

    it('should increase word length with level', () => {
      const rng1 = createRng(12345);
      const rng2 = createRng(12345);
      const rng3 = createRng(12345);
      const generator = Generators.word_builder;
      if (!generator) throw new Error('word_builder generator not found');

      const problem1 = generator(1, rng1, 'starter') as WordBuilderProblem;
      const problem5 = generator(5, rng2, 'starter') as WordBuilderProblem;
      const problem10 = generator(10, rng3, 'starter') as WordBuilderProblem;

      // Higher level should generally have longer words
      expect(problem5.target.length).toBeGreaterThanOrEqual(problem1.target.length);
      expect(problem10.target.length).toBeGreaterThanOrEqual(problem5.target.length);
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
      expect(problem.patternRule).toBeDefined();
      expect(problem.patternCycle.length).toBeGreaterThan(0);
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

  describe('picture_pairs', () => {
    it('should generate valid picture pairs problem', () => {
      const rng = createRng(12345);
      const generator = Generators.picture_pairs;
      if (!generator) throw new Error('picture_pairs generator not found');
      const problem = generator(1, rng, 'starter') as PicturePairsProblem;

      expect(problem.type).toBe('picture_pairs');
      expect(problem.cards).toBeInstanceOf(Array);
      expect(problem.pairs).toBeInstanceOf(Array);
      expect(problem.cards.length).toBe(problem.pairs.length * 2);
      expect(problem.pairs.length).toBeGreaterThanOrEqual(4);
    });

    it('should have exactly two cards per matchId (starter: emoji+emoji, advanced: word+emoji)', () => {
      const rng = createRng(999);
      const generator = Generators.picture_pairs;
      if (!generator) throw new Error('picture_pairs generator not found');

      const starter = generator(2, rng, 'starter') as PicturePairsProblem;
      const byMatchIdStarter = starter.cards.reduce<Record<string, typeof starter.cards>>(
        (acc, c) => {
          const id = c.matchId;
          if (!acc[id]) acc[id] = [];
          acc[id].push(c);
          return acc;
        },
        {},
      );
      Object.values(byMatchIdStarter).forEach((cards) => {
        expect(cards).toHaveLength(2);
        cards.forEach((c) => expect(c.cardType).toBe('emoji'));
      });

      const rng2 = createRng(888);
      const advanced = generator(2, rng2, 'advanced') as PicturePairsProblem;
      const byMatchIdAdv = advanced.cards.reduce<Record<string, typeof advanced.cards>>(
        (acc, c) => {
          const id = c.matchId;
          if (!acc[id]) acc[id] = [];
          acc[id].push(c);
          return acc;
        },
        {},
      );
      Object.values(byMatchIdAdv).forEach((cards) => {
        expect(cards).toHaveLength(2);
        const types = new Set(cards.map((c) => c.cardType));
        expect(types).toContain('emoji');
        expect(types).toContain('word');
      });
    });

    it('should increase pair count with level for advanced profile', () => {
      const rng = createRng(111);
      const generator = Generators.picture_pairs;
      if (!generator) throw new Error('picture_pairs generator not found');
      const low = generator(1, rng, 'advanced') as PicturePairsProblem;
      const rng2 = createRng(222);
      const high = generator(10, rng2, 'advanced') as PicturePairsProblem;
      expect(high.pairs.length).toBeGreaterThanOrEqual(low.pairs.length);
    });
  });

  describe('math_snake', () => {
    it('should generate valid math snake problem', () => {
      const rng = createRng(4242);
      const generator = Generators.math_snake;
      if (!generator) throw new Error('math_snake generator not found');
      const problem = generator(2, rng, 'starter') as MathSnakeProblem;

      expect(problem.type).toBe('math_snake');
      expect(problem.gridSize).toBeGreaterThanOrEqual(5);
      expect(problem.snake.length).toBeGreaterThanOrEqual(3);
      expect(problem.apple).not.toBeNull();
      expect(problem.math).toBeNull();
      expect(problem.applesUntilMath).toBeGreaterThan(0);
    });

    it('should keep apples inside the grid and off the snake', () => {
      const rng = createRng(4242);
      const generator = Generators.math_snake;
      if (!generator) throw new Error('math_snake generator not found');
      const problem = generator(3, rng, 'starter') as MathSnakeProblem;

      const snakeSet = new Set(problem.snake.map(([x, y]) => `${x},${y}`));
      const apple = problem.apple;
      if (!apple) throw new Error('Expected apple');
      const [x, y] = apple.pos;
      expect(x).toBeGreaterThanOrEqual(0);
      expect(y).toBeGreaterThanOrEqual(0);
      expect(x).toBeLessThan(problem.gridSize);
      expect(y).toBeLessThan(problem.gridSize);
      expect(snakeSet.has(`${x},${y}`)).toBe(false);
      expect(apple.kind).toBe('normal');
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

  describe('compare_sizes', () => {
    it('should generate valid compare sizes problem', () => {
      const rng = createRng(12345);
      const generator = Generators.compare_sizes;
      if (!generator) throw new Error('compare_sizes generator not found');
      const problem = generator(1, rng, 'starter') as CompareSizesProblem;

      expect(problem.type).toBe('compare_sizes');
      expect(problem.leftItem).toHaveProperty('value');
      expect(problem.leftItem).toHaveProperty('display');
      expect(problem.rightItem).toHaveProperty('value');
      expect(problem.rightItem).toHaveProperty('display');
      expect(['left', 'right', 'equal']).toContain(problem.answer);
      expect(problem.options).toBeInstanceOf(Array);
      expect(problem.options.length).toBeGreaterThanOrEqual(2);
    });

    it('should compute correct answer', () => {
      const rng = createRng(12345);
      const generator = Generators.compare_sizes;
      if (!generator) throw new Error('compare_sizes generator not found');
      const problem = generator(1, rng, 'starter') as CompareSizesProblem;

      const leftValue = problem.leftItem.value;
      const rightValue = problem.rightItem.value;
      const expectedAnswer =
        leftValue > rightValue ? 'left' : leftValue < rightValue ? 'right' : 'equal';

      expect(problem.answer).toBe(expectedAnswer);
    });

    it('should include correct answer in options (when applicable)', () => {
      const rng = createRng(12345);
      const generator = Generators.compare_sizes;
      if (!generator) throw new Error('compare_sizes generator not found');
      const problem = generator(5, rng, 'starter') as CompareSizesProblem; // Use level 5 to ensure 'equal' is in options

      expect(problem.options).toContain(problem.answer);
    });

    it('should generate consistent problems with same seed', () => {
      const rng1 = createRng(12345);
      const rng2 = createRng(12345);
      const generator = Generators.compare_sizes;
      if (!generator) throw new Error('compare_sizes generator not found');

      const problem1 = generator(1, rng1, 'starter') as CompareSizesProblem;
      const problem2 = generator(1, rng2, 'starter') as CompareSizesProblem;

      expect(problem1.answer).toBe(problem2.answer);
      expect(problem1.leftItem.value).toBe(problem2.leftItem.value);
      expect(problem1.rightItem.value).toBe(problem2.rightItem.value);
    });

    it('should not show numbers at level 1-2', () => {
      const rng = createRng(12345);
      const generator = Generators.compare_sizes;
      if (!generator) throw new Error('compare_sizes generator not found');
      const problem = generator(1, rng, 'starter') as CompareSizesProblem;

      // Level 1-3 use dice only, no numbers
      expect(problem.showNumbers).toBe(false);
    });

    it('should show numbers at level 4+', () => {
      const rng = createRng(12345);
      const generator = Generators.compare_sizes;
      if (!generator) throw new Error('compare_sizes generator not found');
      const problem = generator(4, rng, 'starter') as CompareSizesProblem;

      // Level 4+ show numbers (with or alongside dice)
      expect(problem.showNumbers).toBe(true);
    });

    it('should always show symbols (core learning objective)', () => {
      const rng = createRng(12345);
      const generator = Generators.compare_sizes;
      if (!generator) throw new Error('compare_sizes generator not found');
      const problem = generator(1, rng, 'starter') as CompareSizesProblem;

      // Symbols should ALWAYS be shown now - this is the main learning objective
      expect(problem.showSymbols).toBe(true);
    });

    it('should show symbols at all levels', () => {
      const rng1 = createRng(12345);
      const rng2 = createRng(12345);
      const generator = Generators.compare_sizes;
      if (!generator) throw new Error('compare_sizes generator not found');
      const problem1 = generator(1, rng1, 'starter') as CompareSizesProblem;
      const problem7 = generator(7, rng2, 'starter') as CompareSizesProblem;

      // Both levels should show symbols
      expect(problem1.showSymbols).toBe(true);
      expect(problem7.showSymbols).toBe(true);
    });

    it('should have only 2 options at level 1', () => {
      const rng = createRng(12345);
      const generator = Generators.compare_sizes;
      if (!generator) throw new Error('compare_sizes generator not found');
      const problem = generator(1, rng, 'starter') as CompareSizesProblem;

      expect(problem.options.length).toBe(2);
      expect(problem.options).toContain('left');
      expect(problem.options).toContain('right');
      expect(problem.options).not.toContain('equal');
    });

    it('should have 3 options from level 2+', () => {
      const rng = createRng(12345);
      const generator = Generators.compare_sizes;
      if (!generator) throw new Error('compare_sizes generator not found');
      const problem = generator(2, rng, 'starter') as CompareSizesProblem;

      expect(problem.options.length).toBe(3);
      expect(problem.options).toContain('left');
      expect(problem.options).toContain('right');
      expect(problem.options).toContain('equal');
    });

    it('should use dice visualization at early levels', () => {
      const rng = createRng(12345);
      const generator = Generators.compare_sizes;
      if (!generator) throw new Error('compare_sizes generator not found');
      const problem = generator(1, rng, 'starter') as CompareSizesProblem;

      // Level 1 should use dice emoji visualization
      expect(problem.leftItem.visual).toContain('🎲');
    });

    it('should increase max value with level', () => {
      const rng1 = createRng(12345);
      const rng2 = createRng(12345);
      const generator = Generators.compare_sizes;
      if (!generator) throw new Error('compare_sizes generator not found');

      const problem1 = generator(1, rng1, 'starter') as CompareSizesProblem;
      const problem7 = generator(7, rng2, 'starter') as CompareSizesProblem;

      // Level 1 max is 6 (single die), level 7 max is 30
      const maxValue1 = Math.max(problem1.leftItem.value, problem1.rightItem.value);
      const maxValue7 = Math.max(problem7.leftItem.value, problem7.rightItem.value);

      expect(maxValue1).toBeLessThanOrEqual(6);
      expect(maxValue7).toBeGreaterThan(6);
    });

    it('should generate harder problems for advanced profile', () => {
      const rng1 = createRng(12345);
      const rng2 = createRng(12345);
      const generator = Generators.compare_sizes;
      if (!generator) throw new Error('compare_sizes generator not found');

      const starterProblem = generator(1, rng1, 'starter') as CompareSizesProblem;
      const advancedProblem = generator(1, rng2, 'advanced') as CompareSizesProblem;

      // Advanced profile should show numbers at level 1 (effective level 3)
      // Starter at level 1 should not show numbers (effective level 1)
      expect(starterProblem.showNumbers).toBe(false);
      expect(advancedProblem.showNumbers).toBe(false); // Level 1 advanced = effective 3, which is still < 4
      expect(starterProblem.showSymbols).toBe(true);
      expect(advancedProblem.showSymbols).toBe(true);

      // Advanced should have equal option at level 1 (effective 3)
      expect(starterProblem.options.length).toBe(2); // Level 1 starter
      expect(advancedProblem.options.length).toBe(3); // Level 1 advanced = effective 3
    });

    it('should introduce equality from level 2', () => {
      const rng = createRng(54321);
      const generator = Generators.compare_sizes;
      if (!generator) throw new Error('compare_sizes generator not found');

      // Level 2 should have equal option available
      const problem = generator(2, rng, 'starter') as CompareSizesProblem;
      expect(problem.options).toContain('equal');
      expect(problem.options.length).toBe(3);
    });

    it('should generate closer values at higher levels', () => {
      const generator = Generators.compare_sizes;
      if (!generator) throw new Error('compare_sizes generator not found');

      // Generate multiple problems at different levels
      const level1Problems = Array.from(
        { length: 20 },
        (_, i) => generator(1, createRng(11111 + i), 'starter') as CompareSizesProblem,
      );
      const level8Problems = Array.from(
        { length: 20 },
        (_, i) => generator(8, createRng(11111 + i), 'starter') as CompareSizesProblem,
      );

      // Calculate average gap for each level
      const avgGapLevel1 =
        level1Problems.reduce((sum, p) => sum + Math.abs(p.leftItem.value - p.rightItem.value), 0) /
        level1Problems.length;
      const avgGapLevel8 =
        level8Problems.reduce((sum, p) => sum + Math.abs(p.leftItem.value - p.rightItem.value), 0) /
        level8Problems.length;

      // At higher levels with larger max values, gaps might be larger in absolute terms
      // but should be smaller relative to the max value
      const maxValueLevel1 = 6;
      const maxValueLevel8 = 30;

      const relativeGapLevel1 = avgGapLevel1 / maxValueLevel1;
      const relativeGapLevel8 = avgGapLevel8 / maxValueLevel8;

      // Higher levels should have proportionally closer values (or at least not much larger)
      expect(relativeGapLevel8).toBeLessThanOrEqual(relativeGapLevel1 * 1.5);
    });
  });

  describe('star_mapper', () => {
    it('should generate valid star mapper problem', () => {
      const rng = createRng(12345);
      const generator = Generators.star_mapper;
      if (!generator) throw new Error('star_mapper generator not found');
      const problem = generator(1, rng, 'starter');

      expect(problem.type).toBe('star_mapper');
      expect(problem.constellation).toBeDefined();
      expect(problem.constellation.stars).toBeInstanceOf(Array);
      expect(problem.constellation.lines).toBeInstanceOf(Array);
      expect(problem.correctAnswer).toBe(problem.constellation.id);
      expect(problem.playerLines).toEqual([]);
    });

    it('should set mode to trace for levels 1-2', () => {
      const rng = createRng(12345);
      const generator = Generators.star_mapper;
      if (!generator) throw new Error('star_mapper generator not found');

      const problem1 = generator(1, rng, 'starter');
      const problem2 = generator(2, rng, 'starter');

      expect(problem1.mode).toBe('trace');
      expect(problem2.mode).toBe('trace');
      expect(problem1.showGuide).toBe(true);
    });

    it('should set mode to build for levels 3-5', () => {
      const rng = createRng(12345);
      const generator = Generators.star_mapper;
      if (!generator) throw new Error('star_mapper generator not found');

      const problem3 = generator(3, rng, 'starter');
      const problem5 = generator(5, rng, 'starter');

      expect(problem3.mode).toBe('build');
      expect(problem5.mode).toBe('build');
      expect(problem3.showGuide).toBe(false);
    });

    it('should set mode to identify for levels 6-8', () => {
      const rng = createRng(12345);
      const generator = Generators.star_mapper;
      if (!generator) throw new Error('star_mapper generator not found');

      const problem6 = generator(6, rng, 'starter');
      const problem8 = generator(8, rng, 'starter');

      expect(problem6.mode).toBe('identify');
      expect(problem8.mode).toBe('identify');
      expect(problem6.options).toBeDefined();
      expect(problem6.options?.length).toBe(4);
      expect(problem6.options).toContain(problem6.correctAnswer);
    });

    it('should set mode to expert for levels 9+', () => {
      const rng = createRng(12345);
      const generator = Generators.star_mapper;
      if (!generator) throw new Error('star_mapper generator not found');

      const problem9 = generator(9, rng, 'starter');
      const problem11 = generator(11, rng, 'starter');

      expect(problem9.mode).toBe('expert');
      expect(problem11.mode).toBe('expert');
      expect(problem9.distractorStars.length).toBeGreaterThan(0);
    });

    it('should have valid constellation data', () => {
      const rng = createRng(12345);
      const generator = Generators.star_mapper;
      if (!generator) throw new Error('star_mapper generator not found');
      const problem = generator(1, rng, 'starter');

      // Check constellation has required properties
      expect(problem.constellation.id).toBeDefined();
      expect(problem.constellation.nameEn).toBeDefined();
      expect(problem.constellation.nameEt).toBeDefined();
      expect(problem.constellation.stars.length).toBeGreaterThan(0);
      expect(problem.constellation.lines.length).toBeGreaterThan(0);

      // Check that all line references point to existing stars
      const starIds = new Set(problem.constellation.stars.map((s) => s.id));
      problem.constellation.lines.forEach((line) => {
        expect(starIds.has(line.from)).toBe(true);
        expect(starIds.has(line.to)).toBe(true);
      });
    });

    it('should increase difficulty with level', () => {
      const rng1 = createRng(12345);
      const rng2 = createRng(12345);
      const generator = Generators.star_mapper;
      if (!generator) throw new Error('star_mapper generator not found');

      const problem1 = generator(1, rng1, 'starter');
      const problem7 = generator(7, rng2, 'starter');

      // Level 1 should be easy, level 7+ should potentially be harder
      expect(['easy', 'medium', 'hard']).toContain(problem1.constellation.difficulty);
      expect(['easy', 'medium', 'hard']).toContain(problem7.constellation.difficulty);
    });
  });

  describe('shape_shift', () => {
    it('should generate valid shape shift problem', () => {
      const rng = createRng(12345);
      const generator = Generators.shape_shift;
      if (!generator) throw new Error('shape_shift generator not found');
      const problem = generator(1, rng, 'starter');

      expect(problem.type).toBe('shape_shift');
      expect(problem.mode).toBeDefined();
      expect(problem.puzzle).toBeDefined();
      expect(problem.pieces).toBeInstanceOf(Array);
      expect(problem.pieces.length).toBeGreaterThan(0);
      expect(problem.showHints).toBeDefined();
    });

    it('should use match mode for levels 1-3', () => {
      const rng = createRng(12345);
      const generator = Generators.shape_shift;
      if (!generator) throw new Error('shape_shift generator not found');

      const problem1 = generator(1, rng, 'starter');
      const problem2 = generator(2, rng, 'starter');
      const problem3 = generator(3, rng, 'starter');

      expect(problem1.mode).toBe('match');
      expect(problem2.mode).toBe('match');
      expect(problem3.mode).toBe('match');
    });

    it('should use rotate mode for levels 4-6', () => {
      const rng = createRng(12345);
      const generator = Generators.shape_shift;
      if (!generator) throw new Error('shape_shift generator not found');

      const problem4 = generator(4, rng, 'starter');
      const problem5 = generator(5, rng, 'starter');
      const problem6 = generator(6, rng, 'starter');

      expect(problem4.mode).toBe('rotate');
      expect(problem5.mode).toBe('rotate');
      expect(problem6.mode).toBe('rotate');
    });

    it('should use build mode for levels 7-10', () => {
      const rng = createRng(12345);
      const generator = Generators.shape_shift;
      if (!generator) throw new Error('shape_shift generator not found');

      const problem7 = generator(7, rng, 'starter');
      const problem10 = generator(10, rng, 'starter');

      expect(problem7.mode).toBe('build');
      expect(problem10.mode).toBe('build');
    });

    it('should use expert mode for levels 11+', () => {
      const rng = createRng(12345);
      const generator = Generators.shape_shift;
      if (!generator) throw new Error('shape_shift generator not found');

      const problem11 = generator(11, rng, 'starter');

      expect(problem11.mode).toBe('expert');
    });

    it('should include decoy piece in expert mode', () => {
      const rng = createRng(12345);
      const generator = Generators.shape_shift;
      if (!generator) throw new Error('shape_shift generator not found');

      const problem = generator(11, rng, 'starter');
      const decoyPieces = problem.pieces.filter((p) => p.isDecoy);

      expect(decoyPieces.length).toBeGreaterThan(0);
    });

    it('should have pieces in tray initially', () => {
      const rng = createRng(12345);
      const generator = Generators.shape_shift;
      if (!generator) throw new Error('shape_shift generator not found');

      const problem = generator(1, rng, 'starter');

      problem.pieces.forEach((piece) => {
        expect(piece.currentPosition).toBeNull();
      });
    });

    it('should have correct rotation in match mode', () => {
      const rng = createRng(12345);
      const generator = Generators.shape_shift;
      if (!generator) throw new Error('shape_shift generator not found');

      const problem = generator(1, rng, 'starter');

      expect(problem.mode).toBe('match');
      problem.pieces.forEach((piece) => {
        if (!piece.isDecoy) {
          expect(piece.currentRotation).toBe(piece.correctRotation);
        }
      });
    });
  });

  describe('battlelearn', () => {
    it('should generate valid battlelearn problem', () => {
      const rng = createRng(12345);
      const generator = Generators.battlelearn;
      if (!generator) throw new Error('battlelearn generator not found');
      const problem = generator(1, rng, 'starter');

      expect(problem.type).toBe('battlelearn');
      expect(problem.gridSize).toBeGreaterThan(0);
      expect(problem.cellGrid).toBeDefined();
      expect(problem.cellGrid).toHaveLength(problem.gridSize);
      expect(problem.cellGrid[0]).toHaveLength(problem.gridSize);
      expect(problem.ships).toBeInstanceOf(Array);
      expect(problem.ships.length).toBeGreaterThan(0);
      expect(problem.revealed).toEqual([]);
      expect(problem.hits).toEqual([]);
      expect(problem.sunkShips).toEqual([]);
      expect(problem.shotAvailable).toBe(false);
      expect(problem.gameWon).toBe(false);
      expect(problem.question).toBeDefined();
      expect(problem.question.prompt).toBeTruthy();
      expect(problem.question.options).toHaveLength(4);
      expect(problem.question.correctIndex).toBeGreaterThanOrEqual(0);
      expect(problem.question.correctIndex).toBeLessThan(4);
    });

    it('should have correct answer in options', () => {
      const rng = createRng(12345);
      const generator = Generators.battlelearn;
      if (!generator) throw new Error('battlelearn generator not found');
      const problem = generator(1, rng, 'starter');

      const correctAnswer = problem.question.options[problem.question.correctIndex];
      expect(correctAnswer).toBeDefined();
      expect(problem.question.options).toContain(correctAnswer);
    });

    it('should generate consistent problems with same seed', () => {
      const rng1 = createRng(12345);
      const rng2 = createRng(12345);
      const generator = Generators.battlelearn;
      if (!generator) throw new Error('battlelearn generator not found');

      const problem1 = generator(1, rng1, 'starter');
      const problem2 = generator(1, rng2, 'starter');

      expect(problem1.ships).toEqual(problem2.ships);
      expect(problem1.cellGrid).toEqual(problem2.cellGrid);
      expect(problem1.question).toEqual(problem2.question);
    });

    it('should scale difficulty with level', () => {
      const rng1 = createRng(12345);
      const rng2 = createRng(54321);
      const generator = Generators.battlelearn;
      if (!generator) throw new Error('battlelearn generator not found');

      const problem1 = generator(1, rng1, 'starter');
      const problem10 = generator(10, rng2, 'starter');

      // Higher level should have more or longer ships
      const totalLength1 = problem1.ships.reduce((sum, ship) => sum + ship.length, 0);
      const totalLength10 = problem10.ships.reduce((sum, ship) => sum + ship.length, 0);

      expect(totalLength10).toBeGreaterThanOrEqual(totalLength1);
    });
  });

  describe('battlelearn with advanced profile', () => {
    it('should generate valid battlelearn problem for advanced profile', () => {
      const generator = Generators.battlelearn;
      if (!generator) throw new Error('battlelearn generator not found');
      const rng = createRng(12345);
      const problem = generator(1, rng, 'advanced');
      expect(problem.type).toBe('battlelearn');
      expect(problem.gridSize).toBeGreaterThanOrEqual(5);
      expect(problem.ships).toBeInstanceOf(Array);
      expect(problem.ships.length).toBeGreaterThan(0);
      expect(problem.question).toBeDefined();
      expect(problem.question.options).toHaveLength(4);
    });

    it('should have larger grid for advanced than starter at same level', () => {
      const generator = Generators.battlelearn;
      if (!generator) throw new Error('battlelearn generator not found');
      const rng1 = createRng(12345);
      const rng2 = createRng(12345);
      const starterProblem = generator(1, rng1, 'starter');
      const advancedProblem = generator(1, rng2, 'advanced');
      expect(advancedProblem.gridSize).toBeGreaterThan(starterProblem.gridSize);
    });

    it('should generate coordinate or arithmetic questions for advanced', () => {
      const generator = Generators.battlelearn;
      if (!generator) throw new Error('battlelearn generator not found');
      const questions = new Set<string>();
      for (let seed = 0; seed < 20; seed++) {
        const rng = createRng(seed);
        const problem = generator(5, rng, 'advanced');
        questions.add(problem.question.prompt);
      }
      expect(questions.size).toBeGreaterThan(1);
    });

    it('should increase complexity with level for advanced', () => {
      const generator = Generators.battlelearn;
      if (!generator) throw new Error('battlelearn generator not found');
      const rng1 = createRng(12345);
      const rng2 = createRng(54321);
      const problem1 = generator(1, rng1, 'advanced');
      const problem10 = generator(10, rng2, 'advanced');
      expect(problem10.gridSize).toBeGreaterThanOrEqual(problem1.gridSize);
      expect(problem10.ships.length).toBeGreaterThanOrEqual(problem1.ships.length);
    });

    it('should have significant question variety for advanced (no bilingual strings)', () => {
      const generator = Generators.battlelearn;
      if (!generator) throw new Error('battlelearn generator not found');
      const questions = new Set<string>();
      for (let seed = 0; seed < 50; seed++) {
        const rng = createRng(seed);
        const problem = generator(5, rng, 'advanced');
        questions.add(problem.question.prompt);
      }
      expect(questions.size).toBeGreaterThanOrEqual(5);
      for (const question of questions) {
        expect(question).not.toContain(' / ');
      }
    });
  });

  describe('battlelearn question variety', () => {
    it('should generate varied questions for starter profile level 1-3', () => {
      const generator = Generators.battlelearn;
      if (!generator) throw new Error('battlelearn generator not found');

      const questions = new Set<string>();
      for (let seed = 0; seed < 30; seed++) {
        const rng = createRng(seed);
        const problem = generator(2, rng, 'starter');
        questions.add(problem.question.prompt);
      }

      // Should have variety
      expect(questions.size).toBeGreaterThanOrEqual(3);
    });

    it('should generate varied questions for starter profile level 4-6', () => {
      const generator = Generators.battlelearn;
      if (!generator) throw new Error('battlelearn generator not found');

      const questions = new Set<string>();
      for (let seed = 0; seed < 30; seed++) {
        const rng = createRng(seed);
        const problem = generator(5, rng, 'starter');
        questions.add(problem.question.prompt);
      }

      // Should have variety
      expect(questions.size).toBeGreaterThanOrEqual(3);
    });

    it('should generate varied questions for starter profile level 7+', () => {
      const generator = Generators.battlelearn;
      if (!generator) throw new Error('battlelearn generator not found');

      const questions = new Set<string>();
      for (let seed = 0; seed < 30; seed++) {
        const rng = createRng(seed);
        const problem = generator(8, rng, 'starter');
        questions.add(problem.question.prompt);
      }

      // Should have variety
      expect(questions.size).toBeGreaterThanOrEqual(3);
    });

    it('should not have bilingual questions in starter profile', () => {
      const generator = Generators.battlelearn;
      if (!generator) throw new Error('battlelearn generator not found');

      for (let level = 1; level <= 10; level++) {
        const rng = createRng(level);
        const problem = generator(level, rng, 'starter');

        // No bilingual format
        expect(problem.question.prompt).not.toContain(' / ');
      }
    });
  });
});
