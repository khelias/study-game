import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createStats } from '../../engine/stats';
import { APP_KEY, PROFILES } from '../../games/data';
import { LANGUAGE_VOCABULARY_SKILL } from '../../curriculum/skills/language';
import { MATH_GEOMETRY_SHAPES_SKILL } from '../../curriculum/skills/math';

describe('gameStore persist migration', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.resetModules();
  });

  it('declares an explicit persist version', async () => {
    const { GAME_STORE_VERSION, useGameStore } = await import('../gameStore');

    expect(useGameStore.persist.getOptions().version).toBe(GAME_STORE_VERSION);
  });

  it('migrates legacy serialized payloads during hydration', async () => {
    localStorage.setItem(
      APP_KEY,
      JSON.stringify({
        state: {
          profile: 'starter',
          levels: {
            starter: {
              word_builder: 6,
              word_cascade: 3,
              shape_dash: 2,
              shape_shift: 5,
            },
            advanced: {
              word_builder: 9,
            },
          },
          stats: {
            ...createStats(),
            collectedStars: 2,
          },
          collectedStars: 14,
          hearts: 9,
          featuredGameIds: ['battlelearn', 'word_cascade', 42],
        },
        version: 0,
      }),
    );

    const { GAME_STORE_VERSION, useGameStore } = await import('../gameStore');
    await useGameStore.persist.rehydrate();
    const state = useGameStore.getState();

    expect(state.stars).toBe(14);
    expect(state.stats.collectedStars).toBe(14);
    expect(state.hearts).toBe(5);
    expect(state.favouriteGameIds).toEqual(['battlelearn', 'word_cascade']);
    expect(state.levels.starter?.word_builder).toBe(6);
    expect(state.activeLearnerProfile.persona).toBe('kid');
    expect(state.activeLearnerProfile.displayName).toBe('5+');
    expect(state.activeLearnerProfile.skillMastery[LANGUAGE_VOCABULARY_SKILL.id]?.level).toBe(6);
    expect(state.activeLearnerProfile.skillMastery[MATH_GEOMETRY_SHAPES_SKILL.id]?.level).toBe(5);
    expect(Object.keys(state.levels)).toEqual(expect.arrayContaining(Object.keys(PROFILES)));

    const persisted = JSON.parse(localStorage.getItem(APP_KEY) ?? '{}') as { version?: number };
    expect(persisted.version).toBe(GAME_STORE_VERSION);
  });

  it('migrates stars from legacy stats when top-level stars are missing', async () => {
    localStorage.setItem(
      APP_KEY,
      JSON.stringify({
        state: {
          stats: {
            ...createStats(),
            collectedStars: 8,
          },
        },
        version: 0,
      }),
    );

    const { useGameStore } = await import('../gameStore');
    await useGameStore.persist.rehydrate();

    expect(useGameStore.getState().stars).toBe(8);
    expect(useGameStore.getState().hearts).toBe(3);
  });

  it('preserves lifetime earned stars separately from spendable balance', async () => {
    localStorage.setItem(
      APP_KEY,
      JSON.stringify({
        state: {
          stars: 4,
          stats: {
            ...createStats(),
            collectedStars: 18,
          },
        },
        version: 2,
      }),
    );

    const { useGameStore } = await import('../gameStore');
    await useGameStore.persist.rehydrate();

    expect(useGameStore.getState().stars).toBe(4);
    expect(useGameStore.getState().stats.collectedStars).toBe(18);
  });

  it('does not treat legacy spendable-only star balance as lifetime earned stars', async () => {
    localStorage.setItem(
      APP_KEY,
      JSON.stringify({
        state: {
          stars: 50,
          stats: {
            ...createStats(),
            collectedStars: 0,
          },
        },
        version: 2,
      }),
    );

    const { useGameStore } = await import('../gameStore');
    await useGameStore.persist.rehydrate();

    expect(useGameStore.getState().stars).toBe(50);
    expect(useGameStore.getState().stats.collectedStars).toBe(0);
  });
});
