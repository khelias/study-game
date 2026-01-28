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
 */
export const validateWordBuilder: AnswerValidator = (problem: Problem, userAnswer: unknown): boolean => {
  if (problem.type !== 'word_builder') return false;
  return userAnswer === problem.target;
};

/**
 * Validator for word cascade games
 */
export const validateWordCascade: AnswerValidator = (problem: Problem, userAnswer: unknown): boolean => {
  if (problem.type !== 'word_cascade') return false;
  return userAnswer === problem.target;
};

/**
 * Validator for syllable builder games
 */
export const validateSyllableBuilder: AnswerValidator = (problem: Problem, userAnswer: unknown): boolean => {
  if (problem.type !== 'syllable_builder') return false;
  return userAnswer === problem.target;
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
