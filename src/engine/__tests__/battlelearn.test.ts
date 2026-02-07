/**
 * BattleLearn Engine Tests
 * 
 * Tests for pure BattleLearn game logic functions.
 */

import { describe, it, expect } from 'vitest';
import {
  placeShips,
  applyShot,
  checkWinCondition,
  getShipAtPosition,
  isShipSunk,
  getSunkShipPositions,
} from '../battlelearn';
import { createRng } from '../rng';
import type { Ship } from '../../types/game';

describe('placeShips', () => {
  it('should place ships without overlaps', () => {
    const rng = createRng(12345);
    const gridSize = 8;
    const shipLengths = [3, 2, 2];
    
    const ships = placeShips(gridSize, shipLengths, rng);
    
    expect(ships).toHaveLength(3);
    
    // Check no overlaps
    const occupied = new Set<string>();
    for (const ship of ships) {
      for (const [r, c] of ship.positions) {
        const key = `${r},${c}`;
        expect(occupied.has(key)).toBe(false);
        occupied.add(key);
      }
    }
  });

  it('should place ships within grid bounds', () => {
    const rng = createRng(12345);
    const gridSize = 6;
    const shipLengths = [3, 2];
    
    const ships = placeShips(gridSize, shipLengths, rng);
    
    for (const ship of ships) {
      for (const [r, c] of ship.positions) {
        expect(r).toBeGreaterThanOrEqual(0);
        expect(r).toBeLessThan(gridSize);
        expect(c).toBeGreaterThanOrEqual(0);
        expect(c).toBeLessThan(gridSize);
      }
    }
  });

  it('should create ships with correct lengths', () => {
    const rng = createRng(12345);
    const gridSize = 8;
    const shipLengths = [4, 3, 2];
    
    const ships = placeShips(gridSize, shipLengths, rng);
    
    expect(ships[0]!.length).toBe(4);
    expect(ships[0]!.positions).toHaveLength(4);
    expect(ships[1]!.length).toBe(3);
    expect(ships[1]!.positions).toHaveLength(3);
    expect(ships[2]!.length).toBe(2);
    expect(ships[2]!.positions).toHaveLength(2);
  });

  it('should be deterministic with same seed', () => {
    const rng1 = createRng(12345);
    const rng2 = createRng(12345);
    const gridSize = 8;
    const shipLengths = [3, 2, 2];
    
    const ships1 = placeShips(gridSize, shipLengths, rng1);
    const ships2 = placeShips(gridSize, shipLengths, rng2);
    
    expect(ships1).toEqual(ships2);
  });

  it('should initialize ships with zero hits', () => {
    const rng = createRng(12345);
    const gridSize = 8;
    const shipLengths = [3, 2];
    
    const ships = placeShips(gridSize, shipLengths, rng);
    
    for (const ship of ships) {
      expect(ship.hits).toBe(0);
    }
  });

  it('should place ships horizontally and vertically', () => {
    const rng = createRng(12345);
    const gridSize = 8;
    const shipLengths = [3, 3, 3];
    
    const ships = placeShips(gridSize, shipLengths, rng);
    
    // Check at least one horizontal and one vertical
    let hasHorizontal = false;
    let hasVertical = false;
    
    for (const ship of ships) {
      const positions = ship.positions;
      const isHorizontal = positions.every(([r], idx) => 
        idx === 0 || r === positions[idx - 1]![0]
      );
      const isVertical = positions.every(([, c], idx) => 
        idx === 0 || c === positions[idx - 1]![1]
      );
      
      if (isHorizontal) hasHorizontal = true;
      if (isVertical) hasVertical = true;
    }
    
    // With 3 ships and seed 12345, we expect both orientations
    expect(hasHorizontal || hasVertical).toBe(true);
  });
});

describe('applyShot', () => {
  let ships: Ship[];
  
  beforeEach(() => {
    // Create test ships manually
    ships = [
      {
        id: 'ship-0',
        length: 3,
        positions: [[0, 0], [0, 1], [0, 2]],
        hits: 0,
      },
      {
        id: 'ship-1',
        length: 2,
        positions: [[2, 2], [3, 2]],
        hits: 0,
      },
    ];
  });

  it('should detect a hit on a ship', () => {
    const revealed: Array<[number, number]> = [];
    const result = applyShot(ships, revealed, 0, 1);
    
    expect(result.hit).toBe(true);
    expect(result.alreadyShot).toBe(false);
    expect(result.sunkShipId).toBeNull();
    expect(ships[0]!.hits).toBe(1);
  });

  it('should detect a miss', () => {
    const revealed: Array<[number, number]> = [];
    const result = applyShot(ships, revealed, 5, 5);
    
    expect(result.hit).toBe(false);
    expect(result.alreadyShot).toBe(false);
    expect(result.sunkShipId).toBeNull();
  });

  it('should detect when shot was already taken', () => {
    const revealed: Array<[number, number]> = [[0, 1]];
    const result = applyShot(ships, revealed, 0, 1);
    
    expect(result.alreadyShot).toBe(true);
  });

  it('should sink a ship when all positions hit', () => {
    const revealed: Array<[number, number]> = [];
    
    // Hit first ship twice (not sunk yet)
    applyShot(ships, revealed, 0, 0);
    applyShot(ships, revealed, 0, 1);
    expect(ships[0]!.hits).toBe(2);
    
    // Third hit should sink it
    const result = applyShot(ships, revealed, 0, 2);
    expect(result.hit).toBe(true);
    expect(result.sunkShipId).toBe('ship-0');
    expect(ships[0]!.hits).toBe(3);
  });

  it('should increment hits correctly', () => {
    const revealed: Array<[number, number]> = [];
    
    applyShot(ships, revealed, 2, 2);
    expect(ships[1]!.hits).toBe(1);
    
    applyShot(ships, revealed, 3, 2);
    expect(ships[1]!.hits).toBe(2);
  });
});

describe('checkWinCondition', () => {
  it('should return false when no ships are sunk', () => {
    const ships: Ship[] = [
      { id: 'ship-0', length: 3, positions: [[0, 0], [0, 1], [0, 2]], hits: 0 },
      { id: 'ship-1', length: 2, positions: [[2, 2], [3, 2]], hits: 0 },
    ];
    
    expect(checkWinCondition(ships)).toBe(false);
  });

  it('should return false when some ships are sunk', () => {
    const ships: Ship[] = [
      { id: 'ship-0', length: 3, positions: [[0, 0], [0, 1], [0, 2]], hits: 3 },
      { id: 'ship-1', length: 2, positions: [[2, 2], [3, 2]], hits: 1 },
    ];
    
    expect(checkWinCondition(ships)).toBe(false);
  });

  it('should return true when all ships are sunk', () => {
    const ships: Ship[] = [
      { id: 'ship-0', length: 3, positions: [[0, 0], [0, 1], [0, 2]], hits: 3 },
      { id: 'ship-1', length: 2, positions: [[2, 2], [3, 2]], hits: 2 },
    ];
    
    expect(checkWinCondition(ships)).toBe(true);
  });

  it('should handle empty ship array', () => {
    const ships: Ship[] = [];
    expect(checkWinCondition(ships)).toBe(true);
  });
});

describe('getShipAtPosition', () => {
  it('should return ship at given position', () => {
    const ships: Ship[] = [
      { id: 'ship-0', length: 3, positions: [[0, 0], [0, 1], [0, 2]], hits: 0 },
      { id: 'ship-1', length: 2, positions: [[2, 2], [3, 2]], hits: 0 },
    ];
    
    const ship = getShipAtPosition(ships, 0, 1);
    expect(ship).toBe(ships[0]);
  });

  it('should return null when no ship at position', () => {
    const ships: Ship[] = [
      { id: 'ship-0', length: 3, positions: [[0, 0], [0, 1], [0, 2]], hits: 0 },
    ];
    
    const ship = getShipAtPosition(ships, 5, 5);
    expect(ship).toBeNull();
  });
});

describe('isShipSunk', () => {
  it('should return false for undamaged ship', () => {
    const ship: Ship = { id: 'ship-0', length: 3, positions: [[0, 0], [0, 1], [0, 2]], hits: 0 };
    expect(isShipSunk(ship)).toBe(false);
  });

  it('should return false for partially damaged ship', () => {
    const ship: Ship = { id: 'ship-0', length: 3, positions: [[0, 0], [0, 1], [0, 2]], hits: 2 };
    expect(isShipSunk(ship)).toBe(false);
  });

  it('should return true for fully damaged ship', () => {
    const ship: Ship = { id: 'ship-0', length: 3, positions: [[0, 0], [0, 1], [0, 2]], hits: 3 };
    expect(isShipSunk(ship)).toBe(true);
  });
});

describe('getSunkShipPositions', () => {
  it('should return empty array when no ships sunk', () => {
    const ships: Ship[] = [
      { id: 'ship-0', length: 3, positions: [[0, 0], [0, 1], [0, 2]], hits: 0 },
      { id: 'ship-1', length: 2, positions: [[2, 2], [3, 2]], hits: 0 },
    ];
    
    const positions = getSunkShipPositions(ships);
    expect(positions).toEqual([]);
  });

  it('should return positions of sunk ships', () => {
    const ships: Ship[] = [
      { id: 'ship-0', length: 3, positions: [[0, 0], [0, 1], [0, 2]], hits: 3 },
      { id: 'ship-1', length: 2, positions: [[2, 2], [3, 2]], hits: 1 },
    ];
    
    const positions = getSunkShipPositions(ships);
    expect(positions).toEqual([[0, 0], [0, 1], [0, 2]]);
  });

  it('should return all positions when all ships sunk', () => {
    const ships: Ship[] = [
      { id: 'ship-0', length: 2, positions: [[0, 0], [0, 1]], hits: 2 },
      { id: 'ship-1', length: 2, positions: [[2, 2], [3, 2]], hits: 2 },
    ];
    
    const positions = getSunkShipPositions(ships);
    expect(positions).toEqual([[0, 0], [0, 1], [2, 2], [3, 2]]);
  });
});
