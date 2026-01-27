/**
 * Answer Handler Engine
 * 
 * Pure business logic for processing game answers.
 * This module handles the core logic of what happens when a player answers correctly or incorrectly.
 * UI concerns (notifications, animations) are handled by the calling code.
 */

import { resolveMathSnakeAnswer } from './mathSnake';
import type { Problem, RngFunction } from '../types/game';

export interface AnswerResult {
  shouldShowFeedback: boolean;
  shouldShowParticles: boolean;
  shouldIncrementScore: boolean;
  shouldIncrementStars: boolean;
  shouldDecrementHearts: boolean;
  shouldEndGame: boolean;
  shouldLevelUp: boolean;
  updatedProblem: Problem | null;
  gameOver: boolean;
  points: number;
}

export interface AnswerHandlerContext {
  isCorrect: boolean;
  problem: Problem;
  gameType: string;
  currentStreak: number;
  currentStars: number;
  currentHearts: number;
  rng: RngFunction;
}

/**
 * Processes an answer for math snake game type
 */
export function processMathSnakeAnswer(context: AnswerHandlerContext): AnswerResult {
  const { isCorrect, problem, gameType, currentHearts, rng } = context;
  const baseGameType = gameType.replace('_adv', '');
  
  if (baseGameType !== 'math_snake' || problem.type !== 'math_snake') {
    throw new Error('processMathSnakeAnswer called for non-math-snake game');
  }

  const points = isCorrect ? 10 : 0;
  let updatedProblem: Problem | null = null;
  let gameOver = false;

  if (isCorrect) {
    // Resolve the math snake answer (updates snake, spawns new apple)
    const resolution = resolveMathSnakeAnswer(problem, isCorrect, rng);
    updatedProblem = resolution.problem;
    gameOver = resolution.gameOver;

    return {
      shouldShowFeedback: true,
      shouldShowParticles: true,
      shouldIncrementScore: true,
      shouldIncrementStars: true,
      shouldDecrementHearts: false,
      shouldEndGame: gameOver,
      shouldLevelUp: false, // Level up is handled separately based on star count
      updatedProblem,
      gameOver,
      points,
    };
  } else {
    // Wrong answer: decrement hearts
    const newHearts = currentHearts - 1;
    const shouldEndGame = newHearts <= 0;

    if (shouldEndGame) {
      // Resolve the answer to update problem state before ending
      const resolution = resolveMathSnakeAnswer(problem, isCorrect, rng);
      updatedProblem = resolution.problem;
    }

    return {
      shouldShowFeedback: true,
      shouldShowParticles: false,
      shouldIncrementScore: false,
      shouldIncrementStars: false,
      shouldDecrementHearts: true,
      shouldEndGame,
      shouldLevelUp: false,
      updatedProblem,
      gameOver: shouldEndGame,
      points: 0,
    };
  }
}

/**
 * Processes an answer for standard game types (non-math-snake)
 */
export function processStandardAnswer(context: AnswerHandlerContext): AnswerResult {
  const { isCorrect, currentStars, currentHearts } = context;
  const points = isCorrect ? 10 : 0;

  if (isCorrect) {
    const nextStars = currentStars + 1;
    const shouldLevelUp = nextStars >= 5;

    return {
      shouldShowFeedback: true,
      shouldShowParticles: true,
      shouldIncrementScore: true,
      shouldIncrementStars: true,
      shouldDecrementHearts: false,
      shouldEndGame: false,
      shouldLevelUp,
      updatedProblem: null, // Standard games generate new problem after correct answer
      gameOver: false,
      points,
    };
  } else {
    // Wrong answer: decrement hearts
    const newHearts = currentHearts - 1;
    const shouldEndGame = newHearts <= 0;

    return {
      shouldShowFeedback: true,
      shouldShowParticles: false,
      shouldIncrementScore: false,
      shouldIncrementStars: false,
      shouldDecrementHearts: true,
      shouldEndGame,
      shouldLevelUp: false,
      updatedProblem: null,
      gameOver: shouldEndGame,
      points: 0,
    };
  }
}

/**
 * Main answer processing function
 * Determines game type and routes to appropriate handler
 */
export function processAnswer(context: AnswerHandlerContext): AnswerResult {
  const { gameType, problem } = context;
  const baseGameType = gameType.replace('_adv', '');

  if (baseGameType === 'math_snake' && problem.type === 'math_snake') {
    return processMathSnakeAnswer(context);
  }

  return processStandardAnswer(context);
}
