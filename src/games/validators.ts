/**
 * Game Answer Validators
 * 
 * Validator functions for each game type.
 * These are pure functions that validate user answers against problems.
 */

import type { Problem } from '../types/game';
import type { AnswerValidator } from './registry';

/**
 * Validator for word builder games
 * Case-insensitive comparison to handle mixed case letters
 */
export const validateWordBuilder: AnswerValidator = (problem: Problem, userAnswer: unknown): boolean => {
  if (problem.type !== 'word_builder') return false;
  if (typeof userAnswer !== 'string' || typeof problem.target !== 'string') return false;
  return userAnswer.toLowerCase() === problem.target.toLowerCase();
};

/**
 * Validator for word cascade games
 * Case-insensitive comparison to handle mixed case letters
 */
export const validateWordCascade: AnswerValidator = (problem: Problem, userAnswer: unknown): boolean => {
  if (problem.type !== 'word_cascade') return false;
  if (typeof userAnswer !== 'string' || typeof problem.target !== 'string') return false;
  return userAnswer.toLowerCase() === problem.target.toLowerCase();
};

/**
 * Validator for syllable builder games
 * Case-insensitive comparison to handle mixed case letters
 */
export const validateSyllableBuilder: AnswerValidator = (problem: Problem, userAnswer: unknown): boolean => {
  if (problem.type !== 'syllable_builder') return false;
  if (typeof userAnswer !== 'string' || typeof problem.target !== 'string') return false;
  return userAnswer.toLowerCase() === problem.target.toLowerCase();
};

/**
 * Validator for letter match games
 */
export const validateLetterMatch: AnswerValidator = (problem: Problem, userAnswer: unknown): boolean => {
  if (problem.type !== 'letter_match') return false;
  return userAnswer === (problem.answer ?? problem.targetLetter);
};

/**
 * Validator for sentence logic games
 */
export const validateSentenceLogic: AnswerValidator = (problem: Problem, userAnswer: unknown): boolean => {
  if (problem.type !== 'sentence_logic') return false;
  return userAnswer === problem.answer;
};

/**
 * Validator for pattern games
 */
export const validatePattern: AnswerValidator = (problem: Problem, userAnswer: unknown): boolean => {
  if (problem.type !== 'pattern') return false;
  return userAnswer === problem.answer;
};

/**
 * Validator for time match games
 */
export const validateTimeMatch: AnswerValidator = (problem: Problem, userAnswer: unknown): boolean => {
  if (problem.type !== 'time_match') return false;
  return userAnswer === problem.answer;
};

/**
 * Validator for balance scale games
 */
export const validateBalanceScale: AnswerValidator = (problem: Problem, userAnswer: unknown): boolean => {
  if (problem.type !== 'balance_scale') return false;
  return userAnswer === problem.answer;
};

/**
 * Validator for unit conversion games
 */
export const validateUnitConversion: AnswerValidator = (problem: Problem, userAnswer: unknown): boolean => {
  if (problem.type !== 'unit_conversion') return false;
  return userAnswer === problem.answer;
};

/**
 * Validator for compare sizes games
 */
export const validateCompareSizes: AnswerValidator = (problem: Problem, userAnswer: unknown): boolean => {
  if (problem.type !== 'compare_sizes') return false;
  return userAnswer === problem.answer;
};

/**
 * Validator for math snake games
 */
export const validateMathSnake: AnswerValidator = (problem: Problem, userAnswer: unknown): boolean => {
  if (problem.type !== 'math_snake') return false;
  return userAnswer === problem.math?.answer;
};

/**
 * Validator for memory math games
 * Note: Memory math doesn't have simple answer validation - it's handled in the component
 */
export const validateMemoryMath: AnswerValidator = (_problem: Problem, _userAnswer: unknown): boolean => {
  // Memory math validation is complex and handled in the component
  // This is a placeholder
  return false;
};

/**
 * Validator for robo path games
 * Note: Robo path doesn't have simple answer validation - it's handled in the component
 */
export const validateRoboPath: AnswerValidator = (_problem: Problem, _userAnswer: unknown): boolean => {
  // Robo path validation is complex and handled in the component
  // This is a placeholder
  return false;
};

/**
 * Validator for star mapper games
 */
export const validateStarMapper: AnswerValidator = (problem: Problem, userAnswer: unknown): boolean => {
  if (problem.type !== 'star_mapper') return false;

  if (problem.mode === 'identify') {
    // For identify mode, answer is constellation ID
    return userAnswer === problem.correctAnswer;
  }

  // For trace/build/expert modes, answer is the lines drawn
  if (!Array.isArray(userAnswer)) return false;

  const playerLines = userAnswer as Array<{ from: string; to: string }>;
  const requiredLines = problem.constellation.lines;

  // Check if all required connections are made (order-independent, bidirectional)
  return requiredLines.every(required =>
    playerLines.some(player =>
      (player.from === required.from && player.to === required.to) ||
      (player.from === required.to && player.to === required.from)
    )
  );
};

/**
 * Validator for shape shift games.
 * Requires exact position (x, y) and rotation (with symmetry for circle, square, etc.).
 * Coordinate model: see src/games/shapeShiftGrid.ts.
 */
export const validateShapeShift: AnswerValidator = (problem: Problem, userAnswer: unknown): boolean => {
  if (problem.type !== 'shape_shift') return false;

  const placedPieces = userAnswer as Array<{
    id: string;
    type: string;
    isDecoy?: boolean;
    currentPosition: { x: number; y: number } | null;
    currentRotation: number;
  }>;

  if (!Array.isArray(placedPieces)) return false;

  // Get required (non-decoy) pieces
  const requiredPieces = problem.puzzle.pieces.filter(p => !p.isDecoy);

  // Count placed non-decoy pieces
  const placedNonDecoy = placedPieces.filter(p => !p.isDecoy && p.currentPosition !== null);

  if (placedNonDecoy.length !== requiredPieces.length) return false;

  // Each required piece must be correctly placed
  return requiredPieces.every(required => {
    const placed = placedPieces.find(p => p.id === required.id);
    if (!placed || !placed.currentPosition) return false;

    // Check position: Allow ±6 units tolerance on 100x100 grid for smoother UX
    const POSITION_TOLERANCE = 6;
    const positionOk =
      Math.abs(placed.currentPosition.x - required.correctPosition.x) <= POSITION_TOLERANCE &&
      Math.abs(placed.currentPosition.y - required.correctPosition.y) <= POSITION_TOLERANCE;

    // Check rotation (handle symmetric shapes)
    const placedRot = ((placed.currentRotation % 360) + 360) % 360;
    const correctRot = ((required.correctRotation % 360) + 360) % 360;
    const ROTATION_TOLERANCE = 15; // ±15 degrees

    // Helper to check if angles are close (modulo 360)
    const isAngleClose = (a: number, b: number, tolerance: number) => {
      const diff = Math.abs(a - b) % 360;
      return diff <= tolerance || diff >= 360 - tolerance;
    };

    let rotationOk = false;

    if (required.type === 'circle') {
      rotationOk = true; // Rotation irrelevant
    } else if (required.type === 'square' || required.type === 'diamond') {
      // 90° symmetry: (placed - correct) should be multiple of 90
      const diff = Math.abs(placedRot - correctRot) % 90;
      rotationOk = diff <= ROTATION_TOLERANCE || diff >= 90 - ROTATION_TOLERANCE;
    } else if (required.type === 'rectangle' || required.type === 'hexagon') {
      // 180° symmetry
      const diff = Math.abs(placedRot - correctRot) % 180;
      rotationOk = diff <= ROTATION_TOLERANCE || diff >= 180 - ROTATION_TOLERANCE;
    } else {
      // No symmetry (triangles)
      rotationOk = isAngleClose(placedRot, correctRot, ROTATION_TOLERANCE);
    }

    return positionOk && rotationOk;
  });
};

/**
 * Validator for BattleLearn games
 * Validates the answer to the educational question
 */
export const validateBattleLearn: AnswerValidator = (problem: Problem, userAnswer: unknown): boolean => {
  if (problem.type !== 'battlelearn') return false;
  
  // userAnswer should be the index of the selected option
  if (typeof userAnswer !== 'number') return false;
  
  return userAnswer === problem.question.correctIndex;
};
