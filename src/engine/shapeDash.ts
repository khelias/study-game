/**
 * Shape Dash engine – pure business logic (no UI).
 * Collision detection, checkpoint detection, jump physics.
 * V3: Adds star collection, jump pads, boost zones, combo system
 * V4: Adds shape gate detection, terrain segments
 */

import type {
  ShapeDashObstacle,
  ShapeDashCheckpoint,
  ShapeDashStar,
  ShapeDashJumpPad,
  ShapeDashBoostZone,
  ShapeDashShapeGate,
} from '../types/game';

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
  y: number; // Bottom of player (feet)
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
  scrollOffset: number,
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
  const h = obstacle.type === 'spike' ? SPIKE_HEIGHT : (obstacle.height ?? BLOCK_DEFAULT_HEIGHT);
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
  scrollOffset: number,
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
  passedCheckpointIndices: Set<number>,
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
  landingMarginPx: number = DEFAULT_LANDING_MARGIN_PX,
): number {
  const distanceDuringJump = scrollSpeed * JUMP_AIR_TIME_S;
  return distanceDuringJump + SPIKE_WIDTH + landingMarginPx;
}

// ================= V3 Features =================

/** Visible star radius in px */
export const STAR_VISUAL_RADIUS = 16;

/** Forgiving collection distance from the player hitbox in px */
export const STAR_COLLECT_RADIUS = 30;

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
  scrollOffset: number,
  groundY: number = GROUND_Y,
): string[] {
  const collected: string[] = [];
  const playerBounds = getPlayerBounds(playerState);

  for (const star of stars) {
    if (star.collected) continue;
    const starScreenX = star.x - scrollOffset;
    const starScreenY = groundY - star.y; // Fixed: Use same coordinate system as rendering
    const closestX = Math.max(playerBounds.left, Math.min(starScreenX, playerBounds.right));
    const closestY = Math.max(playerBounds.top, Math.min(starScreenY, playerBounds.bottom));
    const dx = closestX - starScreenX;
    const dy = closestY - starScreenY;
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
  scrollOffset: number,
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
  scrollOffset: number,
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
export const GATE_WIDTH = 96;
export const GATE_HEIGHT = 54;
export const GATE_SPACING = 12; // Space between vertical answer lanes
export const GATE_ZONE_WIDTH = GATE_WIDTH; // Horizontal pass window for one answer stack
export const GATE_ZONE_HEIGHT = GATE_HEIGHT * 3 + GATE_SPACING * 2;

export function getGateStackTopY(groundY: number): number {
  return Math.max(56, groundY - GATE_ZONE_HEIGHT - 12);
}

/**
 * Check if player is approaching a shape gate (for visual warning)
 */
export function getApproachingGateIndex(
  playerX: number,
  shapeGates: ShapeDashShapeGate[],
  scrollOffset: number,
  passedGateIds: Set<string>,
  warningDistance: number = 400,
): number | null {
  const playerRight = playerX + PLAYER_WIDTH;
  for (let i = 0; i < shapeGates.length; i++) {
    const gate = shapeGates[i]!;
    if (passedGateIds.has(gate.id)) continue;
    const gateWorldX = gate.x - scrollOffset;
    const distance = gateWorldX - playerRight;
    if (distance > 0 && distance < warningDistance) return i;
  }
  return null;
}

/**
 * Check if player is passing through a shape gate zone
 * Returns: { gateIndex, gateChoice } or null
 * gateChoice: 0=top, 1=middle, 2=bottom
 */
export function checkShapeGatePass(
  playerState: PlayerState,
  shapeGates: ShapeDashShapeGate[],
  scrollOffset: number,
  passedGateIds: Set<string>,
  groundY: number = 310,
): { gateIndex: number; gateChoice: number } | null {
  const playerCenterX = playerState.x + PLAYER_WIDTH / 2;
  const playerCenterY = playerState.y - PLAYER_HEIGHT / 2;
  const gateStackTopY = getGateStackTopY(groundY);
  const gateStackBottomY = gateStackTopY + GATE_ZONE_HEIGHT;

  for (let i = 0; i < shapeGates.length; i++) {
    const gate = shapeGates[i]!;
    if (passedGateIds.has(gate.id)) continue;
    const gateScreenX = gate.x - scrollOffset;
    const gateZoneLeft = gateScreenX - GATE_WIDTH / 2;
    const gateZoneRight = gateScreenX + GATE_WIDTH / 2;

    if (playerCenterX < gateZoneLeft || playerCenterX > gateZoneRight) continue;
    if (playerCenterY < gateStackTopY || playerCenterY > gateStackBottomY) continue;

    const relativeY = playerCenterY - gateStackTopY;
    const laneSlotHeight = GATE_HEIGHT + GATE_SPACING;
    const gateSlot = Math.floor(relativeY / laneSlotHeight);
    const posWithinSlot = relativeY % laneSlotHeight;

    // Player is between answer lanes, so do not register a choice yet.
    if (posWithinSlot > GATE_HEIGHT) continue;

    const gateChoice = Math.max(0, Math.min(2, gateSlot)); // 0=top, 1=middle, 2=bottom
    return { gateIndex: i, gateChoice };
  }
  return null;
}
