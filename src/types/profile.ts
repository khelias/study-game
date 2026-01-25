/**
 * Profile and level type definitions
 */

import { ProfileType } from './game';

// Profile configuration
export interface Profile {
  id: ProfileType;
  label: string;
  desc: string;
  levelStart: number;
  difficultyOffset: number;
  emoji: string;
}

// Level configuration for a specific game
export interface LevelConfig {
  level: number;
  lastPlayed?: number;
  bestScore?: number;
  attempts?: number;
}

// Difficulty calculation result
export interface DifficultyResult {
  effectiveLevel: number;
  baseLevel: number;
  difficultyOffset: number;
  isEasy: boolean;
  isMedium: boolean;
  isHard: boolean;
}

// Progression recommendation
export interface ProgressionRecommendation {
  message: string;
  action: 'start' | 'level_up' | 'level_down' | 'continue';
  priority: 'high' | 'medium' | 'low';
}

// Difficulty result for game
export interface GameDifficulty {
  effectiveLevel: number;
  multiplier: number;
  isHarder: boolean;
  isEasier: boolean;
}
