import { describe, it, expect } from 'vitest';
import { gameIdToSlug, slugToGameId, isValidGameSlug } from '../gameSlug';

describe('gameSlug utilities', () => {
  describe('gameIdToSlug', () => {
    it('should convert underscores to hyphens', () => {
      expect(gameIdToSlug('word_cascade')).toBe('word-cascade');
      expect(gameIdToSlug('math_snake')).toBe('math-snake');
      expect(gameIdToSlug('balance_scale')).toBe('balance-scale');
    });

    it('should handle IDs with multiple underscores', () => {
      expect(gameIdToSlug('word_cascade')).toBe('word-cascade');
      expect(gameIdToSlug('math_snake')).toBe('math-snake');
    });

    it('should handle IDs without underscores', () => {
      expect(gameIdToSlug('pattern')).toBe('pattern');
      expect(gameIdToSlug('battlelearn')).toBe('battlelearn');
    });
  });

  describe('slugToGameId', () => {
    it('should convert hyphens to underscores', () => {
      expect(slugToGameId('word-cascade')).toBe('word_cascade');
      expect(slugToGameId('math-snake')).toBe('math_snake');
      expect(slugToGameId('balance-scale')).toBe('balance_scale');
    });

    it('should map legacy -adv slugs to single game id', () => {
      expect(slugToGameId('word-cascade-adv')).toBe('word_cascade');
      expect(slugToGameId('math-snake-adv')).toBe('math_snake');
      expect(slugToGameId('battlelearn-adv')).toBe('battlelearn');
    });

    it('should handle slugs without hyphens', () => {
      expect(slugToGameId('pattern')).toBe('pattern');
      expect(slugToGameId('battlelearn')).toBe('battlelearn');
    });
  });

  describe('isValidGameSlug', () => {
    const validGameIds = ['word_cascade', 'math_snake', 'pattern', 'balance_scale'];

    it('should return true for valid slugs', () => {
      expect(isValidGameSlug('word-cascade', validGameIds)).toBe(true);
      expect(isValidGameSlug('math-snake', validGameIds)).toBe(true);
      expect(isValidGameSlug('pattern', validGameIds)).toBe(true);
      expect(isValidGameSlug('balance-scale', validGameIds)).toBe(true);
    });

    it('should return false for invalid slugs', () => {
      expect(isValidGameSlug('invalid-game', validGameIds)).toBe(false);
      expect(isValidGameSlug('unknown', validGameIds)).toBe(false);
      expect(isValidGameSlug('word-builder-pro', validGameIds)).toBe(false);
    });
  });

  describe('round-trip conversion', () => {
    it('should maintain consistency when converting back and forth', () => {
      const gameIds = ['word_cascade', 'math_snake', 'pattern', 'balance_scale'];
      gameIds.forEach((gameId) => {
        const slug = gameIdToSlug(gameId);
        const convertedBack = slugToGameId(slug);
        expect(convertedBack).toBe(gameId);
      });
    });
  });
});
