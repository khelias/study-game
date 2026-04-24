import { describe, it, expect } from 'vitest';
import { createRng } from '../rng';
import { createMathSnakeProblem, moveMathSnake, resolveMathSnakeAnswer } from '../mathSnake';
import type { ArithmeticSpec } from '../../types/game';

// Minimal spec set sufficient for mechanics tests that don't care about equation
// content. Covers all ops so challenge-generation doesn't fall into the empty-pool
// fallback at any level.
const ALL_OPS_SPECS: readonly ArithmeticSpec[] = [
  { op: 'add_result' },
  { op: 'add_missing' },
  { op: 'sub_result' },
  { op: 'sub_missing_minuend' },
  { op: 'sub_missing_subtrahend' },
  { op: 'mul_result' },
  { op: 'mul_missing' },
];

describe('mathSnake engine', () => {
  it('creates a problem with an apple off the snake', () => {
    const rng = createRng(1357);
    const problem = createMathSnakeProblem(ALL_OPS_SPECS, 2, rng, 'starter');

    expect(problem.type).toBe('math_snake');
    expect(problem.apple).not.toBeNull();

    const apple = problem.apple;
    if (!apple) throw new Error('Expected apple');

    const snakeSet = new Set(problem.snake.map(([x, y]) => `${x},${y}`));
    expect(snakeSet.has(`${apple.pos[0]},${apple.pos[1]}`)).toBe(false);
  });

  it('moves the snake one step without growing when no apple', () => {
    const rng = createRng(2468);
    const problem = createMathSnakeProblem(ALL_OPS_SPECS, 1, rng, 'starter');
    const result = moveMathSnake(problem, 'RIGHT', 1, rng, 'starter');

    expect(result.collision).toBe(false);
    expect(result.problem.snake.length).toBe(problem.snake.length);
  });

  it('grows when eating a normal apple', () => {
    const rng = createRng(7777);
    const problem = createMathSnakeProblem(ALL_OPS_SPECS, 1, rng, 'starter');
    const head = problem.snake[0] ?? [0, 0];
    const target: [number, number] = [head[0] + 1, head[1]];

    const updated = {
      ...problem,
      apple: { id: 'test-apple', kind: 'normal' as const, pos: target },
    };

    const result = moveMathSnake(updated, 'RIGHT', 1, rng, 'starter');
    expect(result.collision).toBe(false);
    expect(result.problem.snake.length).toBe(problem.snake.length + 1);
  });

  it('creates a math challenge and resolves with correct/incorrect length change', () => {
    const rng = createRng(9999);
    const problem = createMathSnakeProblem(ALL_OPS_SPECS, 3, rng, 'starter');
    const head = problem.snake[0] ?? [0, 0];
    const target: [number, number] = [head[0] + 1, head[1]];

    const updated = {
      ...problem,
      apple: { id: 'math-apple', kind: 'math' as const, pos: target },
    };

    const moved = moveMathSnake(updated, 'RIGHT', 3, rng, 'starter');
    expect(moved.problem.math).not.toBeNull();

    const correct = resolveMathSnakeAnswer(moved.problem, true, rng);
    expect(correct.gameOver).toBe(false);
    // Math apple: +1 when eaten, +2 more when correct = +3 total from original
    // But moved.problem already has +1 from eating, so correct adds +2 more
    expect(correct.problem.snake.length).toBe(moved.problem.snake.length + 2);

    const wrong = resolveMathSnakeAnswer(moved.problem, false, rng);
    // Math apple: +1 when eaten, no change when wrong (hearts system handles wrong answers)
    // Wrong answer doesn't change snake length anymore
    expect(wrong.problem.snake.length).toBe(moved.problem.snake.length);
  });

  // ---------------------------------------------------------------------------
  // Spec-pool behavior (Phase 1 Slice 3)
  // ---------------------------------------------------------------------------

  it('respects unlockLevel — a spec gated above current level never fires', () => {
    // Only one spec, locked at level 99 → effective pool empty → engine's
    // add_result fallback runs (always a "? + ? = ..." shape, no ×).
    const lockedSpecs: readonly ArithmeticSpec[] = [{ op: 'mul_result', unlockLevel: 99 }];
    const rng = createRng(42);
    const problem = createMathSnakeProblem(lockedSpecs, 1, rng, 'starter');
    // Force a math challenge
    const head = problem.snake[0] ?? [0, 0];
    const target: [number, number] = [head[0] + 1, head[1]];
    const forced = {
      ...problem,
      apple: { id: 'math-apple', kind: 'math' as const, pos: target },
    };
    const moved = moveMathSnake(forced, 'RIGHT', 1, rng, 'starter');
    expect(moved.problem.math).not.toBeNull();
    // Fallback is add_result, which contains '+'.
    expect(moved.problem.math?.equation).toContain('+');
  });

  it('multiplication pack with factorRange [2,5] stays within that range at any level', () => {
    const mulSpecs: readonly ArithmeticSpec[] = [{ op: 'mul_result', factorRange: [2, 5] }];
    // Run at a high level where default factor range would widen to [2, 10];
    // override must hold.
    const rng = createRng(123);
    for (let i = 0; i < 20; i++) {
      const problem = createMathSnakeProblem(mulSpecs, 12, rng, 'starter');
      const head = problem.snake[0] ?? [0, 0];
      const target: [number, number] = [head[0] + 1, head[1]];
      const forced = {
        ...problem,
        apple: { id: `math-apple-${i}`, kind: 'math' as const, pos: target },
      };
      const moved = moveMathSnake(forced, 'RIGHT', 12, rng, 'starter');
      const eq = moved.problem.math?.equation ?? '';
      const match = eq.match(/^(\d+) × (\d+)/);
      expect(match).not.toBeNull();
      if (match) {
        const a = Number(match[1]);
        const b = Number(match[2]);
        expect(a).toBeGreaterThanOrEqual(2);
        expect(a).toBeLessThanOrEqual(5);
        expect(b).toBeGreaterThanOrEqual(2);
        expect(b).toBeLessThanOrEqual(5);
      }
    }
  });
});
