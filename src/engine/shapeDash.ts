/**
 * Shape Dash engine – pure business logic (no UI).
 * Collision detection, checkpoint detection, jump physics.
 */

import type { ShapeDashObstacle, ShapeDashCheckpoint } from '../types/game';

/** Player hitbox: width and height in px */
export const PLAYER_WIDTH = 28;
export const PLAYER_HEIGHT = 36;

/** Ground Y in world (bottom of player when standing) */
export const GROUND_Y = 0;

/** Spike/block dimensions for collision */
export const SPIKE_WIDTH = 24;
export const SPIKE_HEIGHT = 24;
export const BLOCK_DEFAULT_HEIGHT = 40;

export interface PlayerState {
  x: number;
  y: number;       // Bottom of player (feet)
  velocityY: number;
  isOnGround: boolean;
}

export interface ObstacleBounds {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

/** Circle default radius when not specified */
export const CIRCLE_DEFAULT_RADIUS = 18;

/**
 * Get obstacle collision bounds in world coordinates (AABB; circle uses bounding box).
 */
export function getObstacleBounds(
  obstacle: ShapeDashObstacle,
  scrollOffset: number
): ObstacleBounds {
  const worldX = obstacle.x - scrollOffset;
  const offsetY = obstacle.offsetY ?? 0;
  if (obstacle.type === 'circle') {
    const r = obstacle.radius ?? CIRCLE_DEFAULT_RADIUS;
    const cy = GROUND_Y - r - offsetY;
    return {
      left: worldX,
      right: worldX + r * 2,
      top: cy - r,
      bottom: cy + r,
    };
  }
  const w = SPIKE_WIDTH;
  const h =
    obstacle.type === 'spike'
      ? SPIKE_HEIGHT
      : (obstacle.height ?? BLOCK_DEFAULT_HEIGHT);
  return {
    left: worldX,
    right: worldX + w,
    top: GROUND_Y - h - offsetY,
    bottom: GROUND_Y - offsetY,
  };
}

/**
 * Get player collision bounds (AABB)
 */
export function getPlayerBounds(state: PlayerState): ObstacleBounds {
  return {
    left: state.x,
    right: state.x + PLAYER_WIDTH,
    top: state.y - PLAYER_HEIGHT,
    bottom: state.y,
  };
}

/**
 * AABB overlap test
 */
export function checkAABBOverlap(a: ObstacleBounds, b: ObstacleBounds): boolean {
  return a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
}

/**
 * Check if player collides with any obstacle at current scroll
 */
export function checkObstacleCollision(
  playerState: PlayerState,
  obstacles: ShapeDashObstacle[],
  scrollOffset: number
): boolean {
  const playerBounds = getPlayerBounds(playerState);
  for (const obs of obstacles) {
    const obsBounds = getObstacleBounds(obs, scrollOffset);
    if (checkAABBOverlap(playerBounds, obsBounds)) return true;
  }
  return false;
}

/**
 * Check if player has passed a checkpoint (player right edge past checkpoint x - scroll)
 */
export function getReachedCheckpointIndex(
  playerX: number,
  checkpoints: ShapeDashCheckpoint[],
  scrollOffset: number,
  passedCheckpointIndices: Set<number>
): number | null {
  const playerRight = playerX + PLAYER_WIDTH;
  for (let i = 0; i < checkpoints.length; i++) {
    if (passedCheckpointIndices.has(i)) continue;
    const cpWorldX = checkpoints[i]!.x - scrollOffset;
    if (playerRight >= cpWorldX) return i;
  }
  return null;
}

/**
 * Check if player has reached the finish line (scrollOffset >= runLength - viewport)
 */
export function hasReachedFinish(scrollOffset: number, runLength: number): boolean {
  return scrollOffset >= runLength;
}

/**
 * Gravity and jump constants. Units: px/s² (gravity), px/s (jump velocity).
 * Integration in view: pvy += GRAVITY * dt, py += pvy * dt.
 * Snappier jump (higher g): shorter air time so you land sooner and have time to jump again.
 * Peak height ≈ v²/(2g) — ~112px to clear spikes (24px) and blocks (40px).
 */
export const GRAVITY = 2000;
export const JUMP_VELOCITY = -670;

/** Full jump air time (up + down) in seconds. Used by level generator for spacing. */
export const JUMP_AIR_TIME_S = (2 * Math.abs(JUMP_VELOCITY)) / GRAVITY;

/** Landing margin (px) of ground after each jump so the player can land and jump again. */
const DEFAULT_LANDING_MARGIN_PX = 140;

/**
 * Minimum world-space gap between obstacle left-edges so the player can land between them.
 * minClear = scrollSpeed * airTime + obstacleWidth + landingMargin; gap = minClear.
 */
export function getMinObstacleGap(
  scrollSpeed: number,
  landingMarginPx: number = DEFAULT_LANDING_MARGIN_PX
): number {
  const distanceDuringJump = scrollSpeed * JUMP_AIR_TIME_S;
  return distanceDuringJump + SPIKE_WIDTH + landingMarginPx;
}
