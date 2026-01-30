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
 * Validator for shape shift games
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

    // Check position (with tolerance)
    const positionOk =
      Math.abs(placed.currentPosition.x - required.correctPosition.x) < 0.5 &&
      Math.abs(placed.currentPosition.y - required.correctPosition.y) < 0.5;

    // Check rotation (handle symmetric shapes)
    let rotationOk = false;
    const placedRot = ((placed.currentRotation % 360) + 360) % 360;
    const correctRot = ((required.correctRotation % 360) + 360) % 360;

    if (required.type === 'circle') {
      rotationOk = true;  // Any rotation is fine
    } else if (required.type === 'square') {
      rotationOk = placedRot % 90 === correctRot % 90;  // 90° symmetry
    } else if (required.type === 'rectangle' || required.type === 'half_square') {
      rotationOk = placedRot % 180 === correctRot % 180;  // 180° symmetry
    } else {
      rotationOk = placedRot === correctRot;
    }

    return positionOk && rotationOk;
  });
};
