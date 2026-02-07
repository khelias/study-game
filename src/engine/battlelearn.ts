/**
 * BattleLearn Engine
 * 
 * Pure functions for BattleLearn game logic.
 * Handles ship placement, shot resolution, and win conditions.
 */

import type { RngFunction } from '../types/game';
import type { Ship } from '../types/game';

/**
 * Place ships on the grid without overlaps or out-of-bounds positions
 */
export function placeShips(
  gridSize: number,
  shipLengths: number[],
  rng: RngFunction
): Ship[] {
  const ships: Ship[] = [];
  const occupied = new Set<string>();

  for (const length of shipLengths) {
    let placed = false;
    let attempts = 0;
    const maxAttempts = 100;

    while (!placed && attempts < maxAttempts) {
      attempts++;
      
      // Random orientation: 0 = horizontal, 1 = vertical
      const isHorizontal = rng() < 0.5;
      
      // Random starting position
      const maxRow = isHorizontal ? gridSize : gridSize - length;
      const maxCol = isHorizontal ? gridSize - length : gridSize;
      const row = Math.floor(rng() * maxRow);
      const col = Math.floor(rng() * maxCol);
      
      // Generate positions for this ship
      const positions: Array<[number, number]> = [];
      for (let i = 0; i < length; i++) {
        const pos: [number, number] = isHorizontal ? [row, col + i] : [row + i, col];
        positions.push(pos);
      }
      
      // Check if all positions are free
      const key = (r: number, c: number) => `${r},${c}`;
      const allFree = positions.every(([r, c]) => !occupied.has(key(r, c)));
      
      if (allFree) {
        // Mark positions as occupied
        positions.forEach(([r, c]) => occupied.add(key(r, c)));
        
        // Create ship
        ships.push({
          id: `ship-${ships.length}`,
          length,
          positions,
          hits: 0,
        });
        
        placed = true;
      }
    }
    
    if (!placed) {
      throw new Error(`Failed to place ship of length ${length} after ${maxAttempts} attempts`);
    }
  }

  return ships;
}

/**
 * Result of taking a shot
 */
export interface ShotResult {
  hit: boolean;
  sunkShipId: string | null;
  alreadyShot: boolean;
}

/**
 * Apply a shot at the given coordinates
 */
export function applyShot(
  ships: Ship[],
  revealed: Array<[number, number]>,
  row: number,
  col: number
): ShotResult {
  // Check if already shot
  const alreadyShot = revealed.some(([r, c]) => r === row && c === col);
  if (alreadyShot) {
    return { hit: false, sunkShipId: null, alreadyShot: true };
  }

  // Check for hit
  let hitShip: Ship | null = null;
  for (const ship of ships) {
    if (ship.positions.some(([r, c]) => r === row && c === col)) {
      hitShip = ship;
      break;
    }
  }

  if (!hitShip) {
    return { hit: false, sunkShipId: null, alreadyShot: false };
  }

  // It's a hit - increment ship hits
  hitShip.hits++;

  // Check if ship is sunk
  const sunkShipId = hitShip.hits >= hitShip.length ? hitShip.id : null;

  return { hit: true, sunkShipId, alreadyShot: false };
}

/**
 * Check if all ships are sunk (win condition)
 */
export function checkWinCondition(ships: Ship[]): boolean {
  return ships.every(ship => ship.hits >= ship.length);
}

/**
 * Get ship by coordinates
 */
export function getShipAtPosition(
  ships: Ship[],
  row: number,
  col: number
): Ship | null {
  for (const ship of ships) {
    if (ship.positions.some(([r, c]) => r === row && c === col)) {
      return ship;
    }
  }
  return null;
}

/**
 * Check if a ship is sunk
 */
export function isShipSunk(ship: Ship): boolean {
  return ship.hits >= ship.length;
}

/**
 * Get all positions of sunk ships
 */
export function getSunkShipPositions(ships: Ship[]): Array<[number, number]> {
  const positions: Array<[number, number]> = [];
  for (const ship of ships) {
    if (isShipSunk(ship)) {
      positions.push(...ship.positions);
    }
  }
  return positions;
}
