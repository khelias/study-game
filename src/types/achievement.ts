/**
 * Achievement type definitions
 */

import { Stats } from './stats';

// Achievement definition
export interface Achievement {
  id: string;
  title: string;
  desc: string;
  icon: string;
  check: (stats: Stats) => boolean;
}

// Achievement unlock info
export interface AchievementUnlock {
  id: string;
  title: string;
  desc: string;
  icon: string;
  timestamp?: number;
}

// Adaptive difficulty state
export interface AdaptiveDifficulty {
  recentAccuracy: boolean[]; // Last 10 answers (true/false)
  averageResponseTime: number[]; // Last 10 response times (ms)
  consecutiveCorrect: number; // Consecutive correct answers
  consecutiveWrong: number; // Consecutive wrong answers
  difficultyMultiplier: number; // 0.5 (easy) to 2.0 (hard)
  levelAdjustment: number; // -2 to +2 level adjustment
}
