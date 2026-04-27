/**
 * Game Registry Tests
 *
 * Tests for the game registry system to ensure games are properly registered
 * and can be retrieved.
 */

import { describe, it, expect } from 'vitest';
import { gameRegistry } from '../registry';
import { MATH_GEOMETRY_SHAPES_SKILL } from '../../curriculum/skills/math';
import { MATH_GEOMETRY_SHAPES_PACK } from '../../curriculum/packs/math/geometry_shapes';

// Import registrations to ensure games are registered
import '../registrations';

describe('GameRegistry', () => {
  it('should have registered games', () => {
    const count = gameRegistry.getCount();
    expect(count).toBeGreaterThan(0);
  });

  it('should retrieve word_builder game', () => {
    const game = gameRegistry.get('word_builder');
    expect(game).toBeDefined();
    expect(game?.id).toBe('word_builder');
    expect(game?.component).toBeDefined();
    expect(game?.generator).toBeDefined();
    expect(game?.validator).toBeDefined();
    expect(game?.config).toBeDefined();
  });

  it('should retrieve balance_scale game', () => {
    const game = gameRegistry.get('balance_scale');
    expect(game).toBeDefined();
    expect(game?.id).toBe('balance_scale');
  });

  it('should bind shape_dash to the geometry curriculum pack', () => {
    const game = gameRegistry.get('shape_dash');
    expect(game).toBeDefined();
    expect(game?.skillIds).toEqual([MATH_GEOMETRY_SHAPES_SKILL.id]);
    expect(game?.contentPackId).toBe(MATH_GEOMETRY_SHAPES_PACK.id);
  });

  it('should return undefined for unknown game', () => {
    const game = gameRegistry.get('unknown_game');
    expect(game).toBeUndefined();
  });

  it('should get all games', () => {
    const allGames = gameRegistry.getAll();
    expect(allGames.length).toBeGreaterThan(0);
    expect(allGames.every((game) => game.id !== undefined)).toBe(true);
  });

  it('should get games by profile', () => {
    const starterGames = gameRegistry.getByProfile('starter');
    const advancedGames = gameRegistry.getByProfile('advanced');

    expect(starterGames.length).toBeGreaterThan(0);
    expect(advancedGames.length).toBeGreaterThan(0);

    // Word builder should be available for both profiles
    const wordBuilder = starterGames.find((g) => g.id === 'word_builder');
    expect(wordBuilder).toBeDefined();

    // Balance scale should only be for advanced
    const balanceScale = advancedGames.find((g) => g.id === 'balance_scale');
    expect(balanceScale).toBeDefined();

    const balanceScaleStarter = starterGames.find((g) => g.id === 'balance_scale');
    expect(balanceScaleStarter).toBeUndefined();
  });

  it('should have all required game properties', () => {
    const allGames = gameRegistry.getAll();

    allGames.forEach((game) => {
      expect(game.id).toBeDefined();
      expect(game.component).toBeDefined();
      expect(game.generator).toBeDefined();
      expect(game.config).toBeDefined();
      expect(game.validator).toBeDefined();
      expect(game.allowedProfiles).toBeDefined();
      expect(Array.isArray(game.allowedProfiles)).toBe(true);
      expect(game.allowedProfiles.length).toBeGreaterThan(0);
    });
  });

  it('should check if game exists', () => {
    expect(gameRegistry.has('word_builder')).toBe(true);
    expect(gameRegistry.has('balance_scale')).toBe(true);
    expect(gameRegistry.has('unknown_game')).toBe(false);
  });

  it('should get all game IDs', () => {
    const ids = gameRegistry.getIds();
    expect(ids.length).toBeGreaterThan(0);
    expect(ids).toContain('word_builder');
    expect(ids).toContain('balance_scale');
  });
});
