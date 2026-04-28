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

// Difficulty result for game
export interface GameDifficulty {
  effectiveLevel: number;
  multiplier: number;
  isHarder: boolean;
  isEasier: boolean;
}
