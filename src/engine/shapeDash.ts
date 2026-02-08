/**
 * Shape Dash engine – pure business logic (no UI).
 * Collision detection, checkpoint detection, jump physics.
 * V3: Adds star collection, jump pads, boost zones, combo system
 * V4: Adds shape gate detection, terrain segments
 */

import type { ShapeDashObstacle, ShapeDashCheckpoint, ShapeDashStar, ShapeDashJumpPad, ShapeDashBoostZone, ShapeDashShapeGate, ShapeDashTerrainSegment } from '../types/game';

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

// ================= V3 Features =================

/** Star collection radius in px */
export const STAR_COLLECT_RADIUS = 20;

/** Jump pad dimensions */
export const JUMP_PAD_WIDTH = 40;
export const JUMP_PAD_BOOST_VELOCITY = -800; // Higher jump than normal

/** Boost zone speed multiplier */
export const BOOST_ZONE_MULTIPLIER = 1.3;

/**
 * Check if player is touching a star (for collection)
 */
export function checkStarCollection(
  playerState: PlayerState,
  stars: ShapeDashStar[],
  scrollOffset: number
): string[] {
  const collected: string[] = [];
  const playerCenterX = playerState.x + PLAYER_WIDTH / 2;
  const playerCenterY = playerState.y - PLAYER_HEIGHT / 2;

  for (const star of stars) {
    if (star.collected) continue;
    const starScreenX = star.x - scrollOffset;
    const starScreenY = -star.y; // Convert from ground-up to screen coordinates
    const dx = playerCenterX - starScreenX;
    const dy = playerCenterY - starScreenY;
    const distSq = dx * dx + dy * dy;
    if (distSq < STAR_COLLECT_RADIUS * STAR_COLLECT_RADIUS) {
      collected.push(star.id);
    }
  }
  return collected;
}

/**
 * Check if player is touching a jump pad (for auto-bounce)
 */
export function checkJumpPadContact(
  playerState: PlayerState,
  jumpPads: ShapeDashJumpPad[],
  scrollOffset: number
): string | null {
  if (!playerState.isOnGround) return null;
  
  const playerLeft = playerState.x;
  const playerRight = playerState.x + PLAYER_WIDTH;

  for (const pad of jumpPads) {
    const padScreenX = pad.x - scrollOffset;
    const padLeft = padScreenX;
    const padRight = padScreenX + JUMP_PAD_WIDTH;
    
    // Check if player is overlapping with jump pad horizontally
    if (playerRight > padLeft && playerLeft < padRight) {
      return pad.id;
    }
  }
  return null;
}

/**
 * Check if player is in a boost zone
 */
export function checkBoostZone(
  playerX: number,
  boostZones: ShapeDashBoostZone[],
  scrollOffset: number
): boolean {
  const playerCenter = playerX + PLAYER_WIDTH / 2;
  
  for (const zone of boostZones) {
    const zoneScreenX = zone.x - scrollOffset;
    if (playerCenter >= zoneScreenX && playerCenter <= zoneScreenX + zone.width) {
      return true;
    }
  }
  return false;
}

// ================= V4 Features =================

/** Shape gate dimensions */
export const GATE_WIDTH = 80;
export const GATE_HEIGHT = 120;
export const GATE_SPACING = 20; // Space between gates
export const GATE_ZONE_WIDTH = GATE_WIDTH * 3 + GATE_SPACING * 2; // Total width of 3 gates

/**
 * Check if player is approaching a shape gate (for visual warning)
 */
export function getApproachingGateIndex(
  playerX: number,
  shapeGates: ShapeDashShapeGate[],
  scrollOffset: number,
  passedGateIndices: Set<number>,
  warningDistance: number = 400
): number | null {
  const playerRight = playerX + PLAYER_WIDTH;
  for (let i = 0; i < shapeGates.length; i++) {
    if (passedGateIndices.has(i)) continue;
    const gateWorldX = shapeGates[i]!.x - scrollOffset;
    const distance = gateWorldX - playerRight;
    if (distance > 0 && distance < warningDistance) return i;
  }
  return null;
}

/**
 * Check if player is passing through a shape gate zone
 * Returns: { gateIndex, gateChoice } or null
 * gateChoice: 0=left, 1=middle, 2=right
 */
export function checkShapeGatePass(
  playerState: PlayerState,
  shapeGates: ShapeDashShapeGate[],
  scrollOffset: number,
  passedGateIndices: Set<number>
): { gateIndex: number; gateChoice: number } | null {
  const playerCenterX = playerState.x + PLAYER_WIDTH / 2;
  
  for (let i = 0; i < shapeGates.length; i++) {
    if (passedGateIndices.has(i)) continue;
    
    const gate = shapeGates[i]!;
    const gateScreenX = gate.x - scrollOffset;
    const gateZoneLeft = gateScreenX - GATE_ZONE_WIDTH / 2;
    const gateZoneRight = gateScreenX + GATE_ZONE_WIDTH / 2;
    
    // Check if player center is within gate zone horizontally
    if (playerCenterX >= gateZoneLeft && playerCenterX <= gateZoneRight) {
      // Determine which gate (left, middle, right) the player is passing through
      const relativeX = playerCenterX - gateZoneLeft;
      const gateSlot = Math.floor(relativeX / (GATE_WIDTH + GATE_SPACING));
      const gateChoice = Math.max(0, Math.min(2, gateSlot)); // Clamp to 0-2
      
      return { gateIndex: i, gateChoice };
    }
  }
  return null;
}

/**
 * Get terrain segment at a given x position
 */
export function getTerrainAtPosition(
  x: number,
  terrainSegments: ShapeDashTerrainSegment[]
): ShapeDashTerrainSegment | null {
  for (const segment of terrainSegments) {
    if (x >= segment.x && x < segment.x + segment.width) {
      return segment;
    }
  }
  return null;
}
