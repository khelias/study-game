import { describe, it, expect } from 'vitest';
import { createRng } from '../rng';
import { createMathSnakeProblem, moveMathSnake, resolveMathSnakeAnswer } from '../mathSnake';

describe('mathSnake engine', () => {
  it('creates a problem with an apple off the snake', () => {
    const rng = createRng(1357);
    const problem = createMathSnakeProblem(2, rng, 'starter');

    expect(problem.type).toBe('math_snake');
    expect(problem.apple).not.toBeNull();

    const apple = problem.apple;
    if (!apple) throw new Error('Expected apple');

    const snakeSet = new Set(problem.snake.map(([x, y]) => `${x},${y}`));
    expect(snakeSet.has(`${apple.pos[0]},${apple.pos[1]}`)).toBe(false);
  });

  it('moves the snake one step without growing when no apple', () => {
    const rng = createRng(2468);
    const problem = createMathSnakeProblem(1, rng, 'starter');
    const result = moveMathSnake(problem, 'RIGHT', 1, rng, 'starter');

    expect(result.collision).toBe(false);
    expect(result.problem.snake.length).toBe(problem.snake.length);
  });

  it('grows when eating a normal apple', () => {
    const rng = createRng(7777);
    const problem = createMathSnakeProblem(1, rng, 'starter');
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
    const problem = createMathSnakeProblem(3, rng, 'starter');
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
});
