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
  checkStarCollection,
  checkShapeGatePass,
  GRAVITY,
  JUMP_VELOCITY,
  JUMP_AIR_TIME_S,
  PLAYER_WIDTH,
  PLAYER_HEIGHT,
  GROUND_Y,
  GATE_HEIGHT,
  GATE_SPACING,
  getGateStackTopY,
} from '../shapeDash';
import type { PlayerState } from '../shapeDash';
import type {
  ShapeDashObstacle,
  ShapeDashCheckpoint,
  ShapeDashStar,
  ShapeDashShapeGate,
} from '../../types/game';

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
    const obstacles: ShapeDashObstacle[] = [{ id: 'o1', x: 80 + 50, type: 'spike' }];
    const scrollOffset = 50;
    const hit = checkObstacleCollision(player, obstacles, scrollOffset);
    expect(hit).toBe(true);
  });

  it('checkObstacleCollision returns false when player is past obstacle', () => {
    const player: PlayerState = { x: 80, y: 0, velocityY: 0, isOnGround: true };
    const obstacles: ShapeDashObstacle[] = [{ id: 'o1', x: 50, type: 'spike' }];
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

  describe('V3: Star collection', () => {
    it('checkStarCollection uses correct coordinate system (GROUND_Y - star.y)', () => {
      // Star at ground level (y=0 in world coordinates)
      const stars: ShapeDashStar[] = [{ id: 'star1', x: 150, y: 0, collected: false }];

      // Player at ground level, centered on star
      const playerState: PlayerState = {
        x: 150 - PLAYER_WIDTH / 2, // Center player on star X
        y: GROUND_Y, // Player Y at ground
        velocityY: 0,
        isOnGround: true,
      };

      const scrollOffset = 0;
      const collected = checkStarCollection(playerState, stars, scrollOffset, GROUND_Y);

      // Star should be collected when coordinates match
      expect(collected).toContain('star1');
    });

    it('checkStarCollection does not collect distant stars', () => {
      const stars: ShapeDashStar[] = [{ id: 'star1', x: 500, y: 0, collected: false }];

      const playerState: PlayerState = {
        x: 100,
        y: GROUND_Y,
        velocityY: 0,
        isOnGround: true,
      };

      const scrollOffset = 0;
      const collected = checkStarCollection(playerState, stars, scrollOffset, GROUND_Y);

      expect(collected).toHaveLength(0);
    });

    it('checkStarCollection uses a forgiving hitbox around the player body', () => {
      const stars: ShapeDashStar[] = [
        { id: 'near-star', x: 150, y: PLAYER_HEIGHT + 24, collected: false },
      ];

      const playerState: PlayerState = {
        x: 150 - PLAYER_WIDTH / 2,
        y: GROUND_Y,
        velocityY: 0,
        isOnGround: true,
      };

      const collected = checkStarCollection(playerState, stars, 0, GROUND_Y);

      expect(collected).toContain('near-star');
    });
  });

  describe('V4: Shape gate detection', () => {
    const gateGroundY = 310;
    const gateCenterX = 500;
    const playerXInGate = gateCenterX - PLAYER_WIDTH / 2;
    const playerYInLane = (laneIndex: number) =>
      getGateStackTopY(gateGroundY) +
      laneIndex * (GATE_HEIGHT + GATE_SPACING) +
      GATE_HEIGHT / 2 +
      PLAYER_HEIGHT / 2;

    it('checkShapeGatePass detects correct gate when player is in top answer lane', () => {
      const shapeGates: ShapeDashShapeGate[] = [
        {
          id: 'gate1',
          x: gateCenterX,
          prompt: 'Test',
          shapes: [
            { type: 'circle', label: 'Circle', isCorrect: true },
            { type: 'square', label: 'Square', isCorrect: false },
            { type: 'triangle', label: 'Triangle', isCorrect: false },
          ],
        },
      ];

      const playerState: PlayerState = {
        x: playerXInGate,
        y: playerYInLane(0),
        velocityY: 0,
        isOnGround: false,
      };

      const scrollOffset = 0;
      const passedGateIds = new Set<string>();
      const result = checkShapeGatePass(
        playerState,
        shapeGates,
        scrollOffset,
        passedGateIds,
        gateGroundY,
      );

      expect(result).not.toBeNull();
      expect(result?.gateIndex).toBe(0);
      expect(result?.gateChoice).toBe(0);
    });

    it('checkShapeGatePass detects correct gate when player is in middle answer lane', () => {
      const shapeGates: ShapeDashShapeGate[] = [
        {
          id: 'gate1',
          x: gateCenterX,
          prompt: 'Test',
          shapes: [
            { type: 'circle', label: 'Circle', isCorrect: false },
            { type: 'square', label: 'Square', isCorrect: true },
            { type: 'triangle', label: 'Triangle', isCorrect: false },
          ],
        },
      ];

      const playerState: PlayerState = {
        x: playerXInGate,
        y: playerYInLane(1),
        velocityY: 0,
        isOnGround: false,
      };

      const scrollOffset = 0;
      const passedGateIds = new Set<string>();
      const result = checkShapeGatePass(
        playerState,
        shapeGates,
        scrollOffset,
        passedGateIds,
        gateGroundY,
      );

      expect(result).not.toBeNull();
      expect(result?.gateIndex).toBe(0);
      expect(result?.gateChoice).toBe(1);
    });

    it('checkShapeGatePass returns null when player is between answer lanes', () => {
      const shapeGates: ShapeDashShapeGate[] = [
        {
          id: 'gate1',
          x: gateCenterX,
          prompt: 'Test',
          shapes: [
            { type: 'circle', label: 'Circle', isCorrect: true },
            { type: 'square', label: 'Square', isCorrect: false },
            { type: 'triangle', label: 'Triangle', isCorrect: false },
          ],
        },
      ];

      const playerState: PlayerState = {
        x: playerXInGate,
        y: getGateStackTopY(gateGroundY) + GATE_HEIGHT + GATE_SPACING / 2 + PLAYER_HEIGHT / 2,
        velocityY: 0,
        isOnGround: false,
      };

      const scrollOffset = 0;
      const passedGateIds = new Set<string>();
      const result = checkShapeGatePass(
        playerState,
        shapeGates,
        scrollOffset,
        passedGateIds,
        gateGroundY,
      );

      expect(result).toBeNull();
    });

    it('checkShapeGatePass returns null when player is outside gate zone', () => {
      const shapeGates: ShapeDashShapeGate[] = [
        {
          id: 'gate1',
          x: gateCenterX,
          prompt: 'Test',
          shapes: [
            { type: 'circle', label: 'Circle', isCorrect: true },
            { type: 'square', label: 'Square', isCorrect: false },
            { type: 'triangle', label: 'Triangle', isCorrect: false },
          ],
        },
      ];

      // Player positioned far before the gate zone
      const playerState: PlayerState = {
        x: 100,
        y: playerYInLane(2),
        velocityY: 0,
        isOnGround: true,
      };

      const scrollOffset = 0;
      const passedGateIds = new Set<string>();
      const result = checkShapeGatePass(
        playerState,
        shapeGates,
        scrollOffset,
        passedGateIds,
        gateGroundY,
      );

      expect(result).toBeNull();
    });

    it('checkShapeGatePass ignores already passed gates', () => {
      const shapeGates: ShapeDashShapeGate[] = [
        {
          id: 'gate1',
          x: gateCenterX,
          prompt: 'Test',
          shapes: [
            { type: 'circle', label: 'Circle', isCorrect: true },
            { type: 'square', label: 'Square', isCorrect: false },
            { type: 'triangle', label: 'Triangle', isCorrect: false },
          ],
        },
      ];

      const playerState: PlayerState = {
        x: playerXInGate,
        y: playerYInLane(0),
        velocityY: 0,
        isOnGround: false,
      };

      const scrollOffset = 0;
      const passedGateIds = new Set<string>(['gate1']);
      const result = checkShapeGatePass(
        playerState,
        shapeGates,
        scrollOffset,
        passedGateIds,
        gateGroundY,
      );

      // Should return null because gate is already passed
      expect(result).toBeNull();
    });
  });
});
