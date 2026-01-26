/**
 * Core game type definitions
 */

// Theme configuration for games
export interface Theme {
  bg: string;
  border: string;
  text: string;
  iconBg: string;
  accent: string;
}

// Category definition
export interface Category {
  id: string;
  name: string;
  emoji: string;
  description: string;
  color: string;
}

// Game difficulty levels
export type Difficulty = 'easy' | 'medium' | 'hard';

// Profile types
export type ProfileType = 'starter' | 'advanced';

// Position constants for sentence logic game (English keys, translated to Estonian in UI)
export const POSITION = {
  NEXT_TO: 'NEXT_TO',    // KÕRVAL
  ON: 'ON',               // PEAL
  UNDER: 'UNDER',         // ALL
  IN_FRONT: 'IN_FRONT',   // EES
  BEHIND: 'BEHIND',       // TAGA
  INSIDE: 'INSIDE'        // SEES
} as const;

export type PositionType = typeof POSITION[keyof typeof POSITION];

// Game configuration
export interface GameConfig {
  id: string;
  title: string;
  theme: Theme;
  icon: string;
  desc: string;
  allowedProfiles: ProfileType[];
  difficulty: Difficulty;
  category: string;
}

// Word object for word-based games
export interface WordObject {
  w: string;
  e: string;
}

// Letter object for word builder
export interface LetterObject {
  char: string;
  id: string;
}

// Scene subject for sentence logic games
export interface SceneSubject {
  n: string;
  e: string;
}

// Scene anchor for sentence logic games
export interface SceneAnchor {
  n: string;
  adess: string;
  iness: string;
  genitive: string; // Genitive case for postpositions (all, peal, kõrval, ees, taga)
  e: string;
}

// Scene definition
export interface Scene {
  bg: string;
  name: string;
  subjects: SceneSubject[];
  anchors: SceneAnchor[];
  positions: string[];
}

// Base problem interface
export interface BaseProblem {
  type: string;
  uid: string;
}

// Balance scale problem
export interface BalanceScaleProblem extends BaseProblem {
  type: 'balance_scale';
  display: {
    left: number[];
    right: number[];
  };
  answer: number;
  options: number[];
}

// Word builder problem
export interface WordBuilderProblem extends BaseProblem {
  type: 'word_builder';
  target: string;
  emoji: string;
  shuffled: LetterObject[];
  preFilledPositions?: number[]; // Indices of pre-filled positions for longer words
}

// Pattern problem
export type PatternRuleId =
  | 'repeat_ab'
  | 'repeat_abc'
  | 'repeat_abcd'
  | 'repeat_aab'
  | 'repeat_aabb'
  | 'repeat_aabc';

export interface PatternProblem extends BaseProblem {
  type: 'pattern';
  sequence: string[];
  answer: string;
  options: string[];
  patternRule: PatternRuleId;
  patternCycle: string[];
}

// Sentence logic problem
export interface SentenceLogicProblem extends BaseProblem {
  type: 'sentence_logic';
  scene: string;
  sceneName?: string;
  subject: SceneSubject;
  anchor: SceneAnchor;
  position: string;
  caseType: 'adess' | 'iness';
  sentence: string;
  display?: string;
  options: Array<string | { text: string; pos?: string; answer?: boolean }>;
  answer: string;
}

// Memory math problem
export interface MemoryMathProblem extends BaseProblem {
  type: 'memory_math';
  cards: Array<{ id: string; content: string; matched?: boolean; flipped?: boolean; solved?: boolean; matchId?: string; type?: string }>;
  pairs: Array<{ eq: string; ans: number }>;
}

// Robo path problem
export interface RoboPathProblem extends BaseProblem {
  type: 'robo_path';
  grid: number[][];
  gridSize: number;
  start: [number, number];
  goal: [number, number];
  end?: [number, number];
  obstacles: Array<[number, number]>;
  correctPath: string[];
  options: string[];
  maxCommands?: number;
  optimalMoves?: number;
  coal?: [number, number];
  coins?: Array<[number, number]>;
}

// Time match problem
export interface TimeMatchProblem extends BaseProblem {
  type: 'time_match';
  hours: number;
  minutes: number;
  display: { hour: number; minute: number };
  options: string[];
  answer: string;
}

// Syllable builder problem
export interface SyllableBuilderProblem extends BaseProblem {
  type: 'syllable_builder';
  target: string;
  emoji: string;
  hint?: string;
  parts?: number;
  syllables: string[];
  shuffled: Array<{ text: string; id: string }>;
}

// Letter match problem
export interface LetterMatchProblem extends BaseProblem {
  type: 'letter_match';
  word: string;
  emoji: string;
  display?: string;
  targetLetter: string;
  targetPosition: number;
  options: string[];
  answer?: string;
}

// Unit conversion problem
export interface UnitConversionProblem extends BaseProblem {
  type: 'unit_conversion';
  value: number;
  fromUnit: string;
  toUnit: string;
  category: string;
  answer: number;
  options: number[];
}

// Union type for all problems
export type Problem =
  | BalanceScaleProblem
  | WordBuilderProblem
  | PatternProblem
  | SentenceLogicProblem
  | MemoryMathProblem
  | RoboPathProblem
  | TimeMatchProblem
  | SyllableBuilderProblem
  | LetterMatchProblem
  | UnitConversionProblem;

// RNG function type
export type RngFunction = () => number;

// Generator function type
export type GeneratorFunction = (
  level: number,
  rng?: RngFunction,
  profile?: ProfileType
) => Problem;
