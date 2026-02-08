/**
 * Shape Dash engine tests – collision, checkpoint, finish logic.
 */

import { describe, it, expect } from 'vitest';
import {
  checkObstacleCollision,
  getReachedCheckpointIndex,
  hasReachedFinish,
  getObstacleBounds,
  getPlayerBounds,
  checkAABBOverlap,
  getMinObstacleGap,
  GRAVITY,
  JUMP_VELOCITY,
  JUMP_AIR_TIME_S,
  PLAYER_WIDTH,
  PLAYER_HEIGHT,
  GROUND_Y,
} from '../shapeDash';
import type { PlayerState } from '../shapeDash';
import type { ShapeDashObstacle, ShapeDashCheckpoint } from '../../types/game';

describe('shapeDash engine', () => {
  it('getPlayerBounds returns AABB for player', () => {
    const state: PlayerState = { x: 80, y: 0, velocityY: 0, isOnGround: true };
    const b = getPlayerBounds(state);
    expect(b.left).toBe(80);
    expect(b.right).toBe(80 + PLAYER_WIDTH);
    expect(b.bottom).toBe(0);
    expect(b.top).toBe(-PLAYER_HEIGHT);
  });

  it('getObstacleBounds returns screen-space bounds for spike', () => {
    const obs: ShapeDashObstacle = { id: 's1', x: 200, type: 'spike' };
    const b = getObstacleBounds(obs, 100);
    expect(b.left).toBe(100);
    expect(b.right).toBe(100 + 24);
    expect(b.bottom).toBe(GROUND_Y);
    expect(b.top).toBe(-24);
  });

  it('checkAABBOverlap detects overlap', () => {
    const a = { left: 0, right: 10, top: 0, bottom: 10 };
    const b = { left: 5, right: 15, top: 5, bottom: 15 };
    expect(checkAABBOverlap(a, b)).toBe(true);
  });

  it('checkAABBOverlap detects no overlap', () => {
    const a = { left: 0, right: 10, top: 0, bottom: 10 };
    const b = { left: 11, right: 21, top: 0, bottom: 10 };
    expect(checkAABBOverlap(a, b)).toBe(false);
  });

  it('checkObstacleCollision returns true when player hits obstacle', () => {
    const player: PlayerState = { x: 80, y: 0, velocityY: 0, isOnGround: true };
    const obstacles: ShapeDashObstacle[] = [
      { id: 'o1', x: 80 + 50, type: 'spike' },
    ];
    const scrollOffset = 50;
    const hit = checkObstacleCollision(player, obstacles, scrollOffset);
    expect(hit).toBe(true);
  });

  it('checkObstacleCollision returns false when player is past obstacle', () => {
    const player: PlayerState = { x: 80, y: 0, velocityY: 0, isOnGround: true };
    const obstacles: ShapeDashObstacle[] = [
      { id: 'o1', x: 50, type: 'spike' },
    ];
    const scrollOffset = 200;
    const hit = checkObstacleCollision(player, obstacles, scrollOffset);
    expect(hit).toBe(false);
  });

  it('getReachedCheckpointIndex returns index when player passed checkpoint', () => {
    const checkpoints: ShapeDashCheckpoint[] = [
      {
        id: 'c1',
        x: 500,
        question: { prompt: '?', options: ['3', '4'], correctIndex: 0 },
      },
    ];
    const passed = new Set<number>();
    const idx = getReachedCheckpointIndex(80, checkpoints, 450, passed);
    expect(idx).toBe(0);
  });

  it('getReachedCheckpointIndex returns null when checkpoint not yet reached', () => {
    const checkpoints: ShapeDashCheckpoint[] = [
      {
        id: 'c1',
        x: 500,
        question: { prompt: '?', options: ['3', '4'], correctIndex: 0 },
      },
    ];
    const passed = new Set<number>();
    const idx = getReachedCheckpointIndex(80, checkpoints, 300, passed);
    expect(idx).toBe(null);
  });

  it('getReachedCheckpointIndex returns null for already passed checkpoint', () => {
    const checkpoints: ShapeDashCheckpoint[] = [
      {
        id: 'c1',
        x: 500,
        question: { prompt: '?', options: ['3', '4'], correctIndex: 0 },
      },
    ];
    const passed = new Set<number>([0]);
    const idx = getReachedCheckpointIndex(80, checkpoints, 450, passed);
    expect(idx).toBe(null);
  });

  it('hasReachedFinish returns true when scroll past run length', () => {
    expect(hasReachedFinish(3000, 2800)).toBe(true);
    expect(hasReachedFinish(2799, 2800)).toBe(false);
  });

  it('exports jump and gravity constants', () => {
    expect(typeof GRAVITY).toBe('number');
    expect(GRAVITY).toBeGreaterThan(0);
    expect(typeof JUMP_VELOCITY).toBe('number');
    expect(JUMP_VELOCITY).toBeLessThan(0);
  });

  it('JUMP_AIR_TIME_S is positive and consistent with GRAVITY and JUMP_VELOCITY', () => {
    expect(JUMP_AIR_TIME_S).toBeGreaterThan(0);
    const expected = (2 * Math.abs(JUMP_VELOCITY)) / GRAVITY;
    expect(JUMP_AIR_TIME_S).toBeCloseTo(expected, 5);
  });

  it('getMinObstacleGap returns gap >= distance during jump + spike width', () => {
    const scrollSpeed = 150;
    const gap = getMinObstacleGap(scrollSpeed);
    const minExpected = scrollSpeed * JUMP_AIR_TIME_S + 24;
    expect(gap).toBeGreaterThanOrEqual(minExpected);
    expect(getMinObstacleGap(200)).toBeGreaterThan(gap);
  });
});
