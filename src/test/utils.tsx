import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';

// Custom render function that includes common providers if needed
export function customRender(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  return render(ui, { ...options });
}

// Override render with custom render
export { customRender as render };

// Test data factories
export const createTestStats = (overrides = {}) => ({
  gamesPlayed: 0,
  correctAnswers: 0,
  wrongAnswers: 0,
  totalScore: 0,
  maxStreak: 0,
  currentStreak: 0,
  maxLevels: {},
  gamesByType: {},
  totalTimePlayed: 0,
  lastPlayed: null,
  collectedStars: 0,
  ...overrides,
});

export const createTestAdaptiveDifficulty = (overrides = {}) => ({
  recentAccuracy: [],
  averageResponseTime: [],
  consecutiveCorrect: 0,
  consecutiveWrong: 0,
  difficultyMultiplier: 1.0,
  levelAdjustment: 0,
  ...overrides,
});

// Wait utilities
export const waitForMs = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
