import { PROFILES } from '../games/data';
import { uid } from './rng';
import type { Direction, MathSnakeProblem, ProfileType, RngFunction } from '../types/game';

interface MathChallenge {
  equation: string;
  answer: number;
  options: number[];
}

interface SpawnResult {
  apple: MathSnakeProblem['apple'];
  applesUntilMath: number;
  noSpace: boolean;
}

const profileMeta = (profileId: ProfileType) => PROFILES[profileId] || PROFILES.starter;

const randomInt = (min: number, max: number, rng: RngFunction): number => {
  if (max <= min) return min;
  return Math.floor(rng() * (max - min + 1)) + min;
};

const shuffle = <T>(items: T[], rng: RngFunction): T[] => {
  return items.slice().sort(() => rng() - 0.5);
};

const directionVectors: Record<Direction, [number, number]> = {
  UP: [0, -1],
  DOWN: [0, 1],
  LEFT: [-1, 0],
  RIGHT: [1, 0],
};

const oppositeDirection: Record<Direction, Direction> = {
  UP: 'DOWN',
  DOWN: 'UP',
  LEFT: 'RIGHT',
  RIGHT: 'LEFT',
};

const getMathSnakeGridSizeForLevel = (_level: number, _profile: ProfileType = 'starter'): number => {
  return 7;
};

const getRandomCountdown = (rng: RngFunction): number => randomInt(2, 3, rng);

const createInitialSnake = (gridSize: number): { snake: Array<[number, number]>; direction: Direction } => {
  const mid = Math.floor(gridSize / 2);
  return {
    snake: [
      [mid, mid],
      [mid - 1, mid],
      [mid - 2, mid],
    ],
    direction: 'RIGHT',
  };
};

const getEmptyCells = (gridSize: number, snake: Array<[number, number]>): Array<[number, number]> => {
  const snakeSet = new Set(snake.map(([x, y]) => `${x},${y}`));
  const cells: Array<[number, number]> = [];
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      if (!snakeSet.has(`${x},${y}`)) {
        cells.push([x, y]);
      }
    }
  }
  return cells;
};

const spawnApple = (
  gridSize: number,
  snake: Array<[number, number]>,
  applesUntilMath: number,
  rng: RngFunction
): SpawnResult => {
  const empty = getEmptyCells(gridSize, snake);
  if (empty.length === 0) {
    return { apple: null, applesUntilMath, noSpace: true };
  }

  const isMath = applesUntilMath <= 1;
  const nextCountdown = isMath ? getRandomCountdown(rng) : applesUntilMath - 1;
  const pos = empty[randomInt(0, empty.length - 1, rng)] ?? empty[0]!;

  return {
    apple: {
      id: `apple-${uid(rng)}`,
      kind: isMath ? 'math' : 'normal',
      pos,
    },
    applesUntilMath: nextCountdown,
    noSpace: false,
  };
};

const generateEquation = (level: number, rng: RngFunction, harder: boolean) => {
  const baseMax = level <= 2 ? 10 : level <= 4 ? 15 : level <= 6 ? 20 : 30;
  const maxValue = Math.min(50, baseMax + (harder ? 10 : 0));
  const useSubtraction = level >= 4 && rng() > 0.4;

  if (useSubtraction) {
    const a = randomInt(4, maxValue, rng);
    const b = randomInt(1, Math.max(1, a - 1), rng);
    return { equation: `${a} - ${b}`, answer: a - b, maxValue };
  }

  const sum = randomInt(4, maxValue, rng);
  const a = randomInt(1, sum - 1, rng);
  const b = sum - a;
  return { equation: `${a} + ${b}`, answer: a + b, maxValue };
};

const buildOptions = (answer: number, count: number, level: number, rng: RngFunction, maxValue: number) => {
  const optionsSet = new Set<number>([answer]);
  const spread = level <= 3 ? 2 : level <= 6 ? 4 : 6;
  let guard = 0;
  while (optionsSet.size < count && guard < 40) {
    const delta = randomInt(-spread, spread, rng);
    if (delta === 0) {
      guard++;
      continue;
    }
    const candidate = answer + delta;
    if (candidate > 0) optionsSet.add(candidate);
    guard++;
  }
  while (optionsSet.size < count) {
    const candidate = randomInt(1, maxValue, rng);
    if (candidate !== answer) optionsSet.add(candidate);
  }
  return shuffle(Array.from(optionsSet), rng);
};

const createMathChallenge = (level: number, rng: RngFunction, profile: ProfileType): MathChallenge => {
  const meta = profileMeta(profile);
  const harder = meta.difficultyOffset > 0;
  const { equation, answer, maxValue } = generateEquation(level, rng, harder);
  const options = buildOptions(answer, 3, level, rng, maxValue);
  return { equation, answer, options };
};

const isOpposite = (current: Direction, next: Direction): boolean => oppositeDirection[current] === next;

const normalizeDirection = (current: Direction, next: Direction): Direction => {
  if (isOpposite(current, next)) return current;
  return next;
};

const isCollision = (
  _gridSize: number, // Not used anymore (wraparound handles walls)
  snake: Array<[number, number]>,
  nextHead: [number, number],
  ignoreTail: boolean
): boolean => {
  // Only check self-collision, not walls (wraparound handles walls)
  const snakeBody = ignoreTail ? snake.slice(0, Math.max(0, snake.length - 1)) : snake;
  const snakeSet = new Set(snakeBody.map(([sx, sy]) => `${sx},${sy}`));
  return snakeSet.has(`${nextHead[0]},${nextHead[1]}`);
};

const wrapPosition = (pos: [number, number], gridSize: number): [number, number] => {
  let [x, y] = pos;
  // Wrap around if out of bounds
  if (x < 0) x = gridSize - 1;
  if (x >= gridSize) x = 0;
  if (y < 0) y = gridSize - 1;
  if (y >= gridSize) y = 0;
  return [x, y];
};

export const createMathSnakeProblem = (
  level: number,
  rng: RngFunction = Math.random,
  profile: ProfileType = 'starter'
): MathSnakeProblem => {
  const gridSize = getMathSnakeGridSizeForLevel(level, profile);
  const { snake, direction } = createInitialSnake(gridSize);
  const initialCountdown = getRandomCountdown(rng);
  const spawn = spawnApple(gridSize, snake, initialCountdown, rng);

  return {
    type: 'math_snake',
    gridSize,
    snake,
    direction,
    apple: spawn.apple,
    applesUntilMath: spawn.applesUntilMath,
    math: null,
    uid: uid(rng),
  };
};

export const moveMathSnake = (
  problem: MathSnakeProblem,
  inputDirection: Direction,
  level: number,
  rng: RngFunction = Math.random,
  profile: ProfileType = 'starter'
): { problem: MathSnakeProblem; collision: boolean } => {
  if (problem.math) {
    return { problem, collision: false };
  }

  const direction = normalizeDirection(problem.direction, inputDirection);
  const [dx, dy] = directionVectors[direction];
  const head = problem.snake[0] ?? [0, 0];
  const rawNextHead: [number, number] = [head[0] + dx, head[1] + dy];
  
  // Wrap around if out of bounds
  const nextHead = wrapPosition(rawNextHead, problem.gridSize);

  const apple = problem.apple;
  const isApple = apple && apple.pos[0] === nextHead[0] && apple.pos[1] === nextHead[1];
  const willGrow = Boolean(isApple);

  // Only check self-collision (wraparound handles walls)
  if (isCollision(problem.gridSize, problem.snake, nextHead, !willGrow)) {
    return { problem, collision: true };
  }

  let nextSnake = [nextHead, ...problem.snake];

  // All apples make the snake grow immediately
  if (!isApple) {
    nextSnake = nextSnake.slice(0, Math.max(1, nextSnake.length - 1));
  }

  if (!isApple) {
    return {
      problem: {
        ...problem,
        snake: nextSnake,
        direction,
      },
      collision: false,
    };
  }

  if (apple.kind === 'normal') {
    const spawn = spawnApple(problem.gridSize, nextSnake, problem.applesUntilMath, rng);
    return {
      problem: {
        ...problem,
        snake: nextSnake,
        direction,
        apple: spawn.apple,
        applesUntilMath: spawn.applesUntilMath,
      },
      collision: false,
    };
  }

  const nextCountdown = getRandomCountdown(rng);
  const challenge = createMathChallenge(level, rng, profile);
  return {
    problem: {
      ...problem,
      snake: nextSnake,
      direction,
      apple: null,
      applesUntilMath: nextCountdown,
      math: challenge,
    },
    collision: false,
  };
};

export const resolveMathSnakeAnswer = (
  problem: MathSnakeProblem,
  isCorrect: boolean,
  rng: RngFunction = Math.random
): { problem: MathSnakeProblem; gameOver: boolean } => {
  if (!problem.math) {
    return { problem, gameOver: false };
  }

  // Math apple: +2 if correct, no change if wrong (hearts system handles wrong answers)
  let nextSnake = problem.snake;
  if (isCorrect) {
    // Add 2 segments for correct math answer
    const tail = problem.snake[problem.snake.length - 1] ?? problem.snake[0] ?? [0, 0];
    const secondLast = problem.snake[problem.snake.length - 2] ?? tail;
    nextSnake = [...problem.snake, secondLast, tail];
  }
  // Wrong answer: no change to snake length (hearts system handles it)

  const spawn = spawnApple(problem.gridSize, nextSnake, problem.applesUntilMath, rng);

  return {
    problem: {
      ...problem,
      snake: nextSnake,
      apple: spawn.apple,
      applesUntilMath: spawn.applesUntilMath,
      math: null,
    },
    gameOver: false,
  };
};
