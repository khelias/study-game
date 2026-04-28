/**
 * Statistics type definitions
 */

// Statistics object structure
export interface Stats {
  gamesPlayed: number;
  correctAnswers: number;
  wrongAnswers: number;
  totalScore: number;
  maxStreak: number;
  currentStreak: number;
  maxLevels: Record<string, number>;
  gamesByType: Record<string, number>;
  totalTimePlayed: number; // in seconds
  lastPlayed: number | null;
  collectedStars: number; // Lifetime earned stars for stats and achievements
  maxSnakeLength: number; // Maximum snake length achieved in math snake
}

// Game session statistics
export interface GameSession {
  startTime: number | null;
  gameType: string | null;
  problemsSolved: number;
  correctAnswers: number;
  wrongAnswers: number;
  currentStreak: number;
  maxStreak: number;
}
