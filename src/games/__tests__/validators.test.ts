import { describe, it, expect } from 'vitest';
import { validateStarMapper, validateBattleLearn, validateShapeDash } from '../validators';
import type { StarMapperProblem } from '../../types/game';

describe('validateStarMapper', () => {
  const baseConstellation = {
    id: 'test_constellation',
    nameEn: 'Test Constellation',
    nameEt: 'Test Tähtkuju',
    descriptionKey: 'test.desc',
    season: 'winter' as const,
    difficulty: 'easy' as const,
    stars: [
      { id: 'star1', x: 10, y: 10, magnitude: 2 },
      { id: 'star2', x: 20, y: 20, magnitude: 2 },
      { id: 'star3', x: 30, y: 30, magnitude: 2 },
    ],
    lines: [
      { from: 'star1', to: 'star2' },
      { from: 'star2', to: 'star3' },
    ],
    bounds: { width: 100, height: 100 },
  };

  describe('identify mode', () => {
    it('should return true for correct constellation ID', () => {
      const problem: StarMapperProblem = {
        type: 'star_mapper',
        uid: 'test-1',
        mode: 'identify',
        constellation: baseConstellation,
        distractorStars: [],
        showGuide: false,
        options: ['test_constellation', 'other1', 'other2', 'other3'],
        correctAnswer: 'test_constellation',
        playerLines: [],
      };

      expect(validateStarMapper(problem, 'test_constellation')).toBe(true);
    });

    it('should return false for incorrect constellation ID', () => {
      const problem: StarMapperProblem = {
        type: 'star_mapper',
        uid: 'test-2',
        mode: 'identify',
        constellation: baseConstellation,
        distractorStars: [],
        showGuide: false,
        options: ['test_constellation', 'other1', 'other2', 'other3'],
        correctAnswer: 'test_constellation',
        playerLines: [],
      };

      expect(validateStarMapper(problem, 'other1')).toBe(false);
    });
  });

  describe('trace/build/expert modes', () => {
    it('should return true when all lines are drawn correctly', () => {
      const problem: StarMapperProblem = {
        type: 'star_mapper',
        uid: 'test-3',
        mode: 'trace',
        constellation: baseConstellation,
        distractorStars: [],
        showGuide: true,
        correctAnswer: 'test_constellation',
        playerLines: [],
      };

      const playerLines = [
        { from: 'star1', to: 'star2' },
        { from: 'star2', to: 'star3' },
      ];

      expect(validateStarMapper(problem, playerLines)).toBe(true);
    });

    it('should return true when lines are drawn in reverse order', () => {
      const problem: StarMapperProblem = {
        type: 'star_mapper',
        uid: 'test-4',
        mode: 'build',
        constellation: baseConstellation,
        distractorStars: [],
        showGuide: false,
        correctAnswer: 'test_constellation',
        playerLines: [],
      };

      const playerLines = [
        { from: 'star2', to: 'star1' }, // Reversed
        { from: 'star3', to: 'star2' }, // Reversed
      ];

      expect(validateStarMapper(problem, playerLines)).toBe(true);
    });

    it('should return false when not all lines are drawn', () => {
      const problem: StarMapperProblem = {
        type: 'star_mapper',
        uid: 'test-5',
        mode: 'trace',
        constellation: baseConstellation,
        distractorStars: [],
        showGuide: true,
        correctAnswer: 'test_constellation',
        playerLines: [],
      };

      const playerLines = [
        { from: 'star1', to: 'star2' },
        // Missing: { from: 'star2', to: 'star3' }
      ];

      expect(validateStarMapper(problem, playerLines)).toBe(false);
    });

    it('should return false when wrong lines are drawn', () => {
      const problem: StarMapperProblem = {
        type: 'star_mapper',
        uid: 'test-6',
        mode: 'build',
        constellation: baseConstellation,
        distractorStars: [],
        showGuide: false,
        correctAnswer: 'test_constellation',
        playerLines: [],
      };

      const playerLines = [
        { from: 'star1', to: 'star3' }, // Wrong connection
        { from: 'star2', to: 'star3' },
      ];

      expect(validateStarMapper(problem, playerLines)).toBe(false);
    });

    it('should return true when extra lines are drawn but all required lines are present', () => {
      const problem: StarMapperProblem = {
        type: 'star_mapper',
        uid: 'test-7',
        mode: 'expert',
        constellation: baseConstellation,
        distractorStars: [{ id: 'distractor1', x: 50, y: 50, magnitude: 4 }],
        showGuide: false,
        correctAnswer: 'test_constellation',
        playerLines: [],
      };

      const playerLines = [
        { from: 'star1', to: 'star2' },
        { from: 'star2', to: 'star3' },
        { from: 'star1', to: 'star3' }, // Extra line, but all required are present
      ];

      expect(validateStarMapper(problem, playerLines)).toBe(true);
    });

    it('should return false for invalid answer type', () => {
      const problem: StarMapperProblem = {
        type: 'star_mapper',
        uid: 'test-8',
        mode: 'trace',
        constellation: baseConstellation,
        distractorStars: [],
        showGuide: true,
        correctAnswer: 'test_constellation',
        playerLines: [],
      };

      expect(validateStarMapper(problem, 'not-an-array')).toBe(false);
      expect(validateStarMapper(problem, null)).toBe(false);
      expect(validateStarMapper(problem, undefined)).toBe(false);
      expect(validateStarMapper(problem, 123)).toBe(false);
    });
  });

  describe('problem type validation', () => {
    it('should return false for non-star_mapper problems', () => {
      const wrongProblem = {
        type: 'word_builder',
        uid: 'test-9',
      } as unknown as StarMapperProblem;

      expect(validateStarMapper(wrongProblem, [])).toBe(false);
    });
  });
});

describe('validateBattleLearn', () => {
  it('should return true for correct answer index', () => {
    const problem = {
      type: 'battlelearn' as const,
      uid: 'test-1',
      gridSize: 5,
      ships: [],
      revealed: [],
      hits: [],
      sunkShips: [],
      shotAvailable: false,
      question: {
        prompt: 'What is 2 + 3?',
        options: ['4', '5', '6', '7'],
        correctIndex: 1,
      },
      gameWon: false,
    };

    expect(validateBattleLearn(problem, 1)).toBe(true);
  });

  it('should return false for incorrect answer index', () => {
    const problem = {
      type: 'battlelearn' as const,
      uid: 'test-2',
      gridSize: 5,
      ships: [],
      revealed: [],
      hits: [],
      sunkShips: [],
      shotAvailable: false,
      question: {
        prompt: 'What is 2 + 3?',
        options: ['4', '5', '6', '7'],
        correctIndex: 1,
      },
      gameWon: false,
    };

    expect(validateBattleLearn(problem, 0)).toBe(false);
    expect(validateBattleLearn(problem, 2)).toBe(false);
    expect(validateBattleLearn(problem, 3)).toBe(false);
  });

  it('should return false for non-number answer', () => {
    const problem = {
      type: 'battlelearn' as const,
      uid: 'test-3',
      gridSize: 5,
      ships: [],
      revealed: [],
      hits: [],
      sunkShips: [],
      shotAvailable: false,
      question: {
        prompt: 'What is 2 + 3?',
        options: ['4', '5', '6', '7'],
        correctIndex: 1,
      },
      gameWon: false,
    };

    expect(validateBattleLearn(problem, '1')).toBe(false);
    expect(validateBattleLearn(problem, null)).toBe(false);
    expect(validateBattleLearn(problem, undefined)).toBe(false);
    expect(validateBattleLearn(problem, {})).toBe(false);
  });

  it('should return false for wrong problem type', () => {
    const problem = {
      type: 'word_builder' as const,
      uid: 'test-4',
      target: 'test',
      emoji: '🎯',
      shuffled: [],
    };

    expect(validateBattleLearn(problem, 1)).toBe(false);
  });
});

describe('validateShapeDash', () => {
  const shapeDashProblem = {
    type: 'shape_dash' as const,
    uid: 'test-1',
    obstacles: [{ id: 'o1', x: 100, type: 'spike' as const }],
    checkpoints: [
      {
        id: 'c1',
        x: 500,
        question: { prompt: '?', options: ['3', '4'], correctIndex: 0 },
      },
    ],
    scrollSpeed: 150,
    runLength: 3000,
  };

  it('should return true when userAnswer is true (run completed)', () => {
    expect(validateShapeDash(shapeDashProblem, true)).toBe(true);
  });

  it('should return false when userAnswer is false (crashed or wrong checkpoint)', () => {
    expect(validateShapeDash(shapeDashProblem, false)).toBe(false);
  });

  it('should return false for wrong problem type', () => {
    expect(
      validateShapeDash(
        { type: 'word_builder', uid: 'x', target: 'x', emoji: 'x', shuffled: [] },
        true,
      ),
    ).toBe(false);
  });
});
