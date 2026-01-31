/**
 * Shape Shift Puzzle Database
 *
 * Written from scratch: every piece is in-bounds and adjacent pieces touch (shared edge).
 * Coordinate model: gridSize×gridSize cells; piece (x, y) = top-left, size = width and height.
 * Bounds: 0 ≤ x, y and x + size ≤ gridSize, y + size ≤ gridSize.
 * Triangle SVG: tip at top, base at BOTTOM of box (rot 0); base at TOP for rot 180; base at LEFT for rot 90; base at RIGHT for rot 270.
 * See src/games/shapeShiftGrid.ts for layout.
 */

import type { Puzzle } from '../types/game';

export const PUZZLES: Puzzle[] = [
  // ============ EASY ============
  {
    id: 'simple_square',
    nameEt: 'Ruut',
    nameEn: 'Square',
    category: 'shapes',
    difficulty: 'easy',
    gridSize: 32,
    pieces: [
      { id: 'p1', type: 'half_square', color: 'red', correctPosition: { x: 0, y: 0 }, correctRotation: 0, size: 16 },
      { id: 'p2', type: 'half_square', color: 'blue', correctPosition: { x: 0, y: 0 }, correctRotation: 180, size: 16 },
    ],
  },
  {
    id: 'simple_diamond',
    nameEt: 'Romb',
    nameEn: 'Diamond',
    category: 'shapes',
    difficulty: 'easy',
    gridSize: 32,
    pieces: [
      { id: 'p1', type: 'triangle', color: 'purple', correctPosition: { x: 0, y: 0 }, correctRotation: 0, size: 16 },
      { id: 'p2', type: 'triangle', color: 'pink', correctPosition: { x: 0, y: 16 }, correctRotation: 180, size: 16 },
    ],
  },
  {
    id: 'simple_house',
    nameEt: 'Maja',
    nameEn: 'House',
    category: 'objects',
    difficulty: 'easy',
    gridSize: 48,
    pieces: [
      { id: 'p1', type: 'triangle', color: 'blue', correctPosition: { x: 12, y: 0 }, correctRotation: 0, size: 24 },
      { id: 'p2', type: 'square', color: 'red', correctPosition: { x: 12, y: 24 }, correctRotation: 0, size: 24 },
    ],
  },
  {
    id: 'simple_tree',
    nameEt: 'Puu',
    nameEn: 'Tree',
    category: 'objects',
    difficulty: 'easy',
    gridSize: 48,
    pieces: [
      { id: 'p1', type: 'triangle', color: 'green', correctPosition: { x: 12, y: 0 }, correctRotation: 0, size: 24 },
      { id: 'p2', type: 'rectangle', color: 'orange', correctPosition: { x: 20, y: 24 }, correctRotation: 90, size: 8 },
    ],
  },
  {
    id: 'ice_cream',
    nameEt: 'Jäätis',
    nameEn: 'Ice Cream',
    category: 'objects',
    difficulty: 'easy',
    gridSize: 48,
    pieces: [
      { id: 'p1', type: 'circle', color: 'pink', correctPosition: { x: 12, y: 0 }, correctRotation: 0, size: 24 },
      { id: 'p2', type: 'triangle', color: 'orange', correctPosition: { x: 12, y: 24 }, correctRotation: 180, size: 24 },
    ],
  },

  // ============ MEDIUM ============
  {
    id: 'arrow_right',
    nameEt: 'Nool',
    nameEn: 'Arrow',
    category: 'abstract',
    difficulty: 'medium',
    gridSize: 48,
    pieces: [
      { id: 'p1', type: 'rectangle', color: 'red', correctPosition: { x: 0, y: 12 }, correctRotation: 90, size: 24 },
      { id: 'p2', type: 'triangle', color: 'red', correctPosition: { x: 24, y: 12 }, correctRotation: 90, size: 24 },
    ],
  },
  {
    id: 'cat_face',
    nameEt: 'Kass',
    nameEn: 'Cat',
    category: 'animals',
    difficulty: 'medium',
    gridSize: 48,
    pieces: [
      { id: 'p1', type: 'circle', color: 'orange', correctPosition: { x: 8, y: 16 }, correctRotation: 0, size: 32 },
      { id: 'p2', type: 'triangle', color: 'orange', correctPosition: { x: 0, y: 0 }, correctRotation: 0, size: 16 },
      { id: 'p3', type: 'triangle', color: 'orange', correctPosition: { x: 32, y: 0 }, correctRotation: 0, size: 16 },
    ],
  },
  {
    id: 'fish',
    nameEt: 'Kala',
    nameEn: 'Fish',
    category: 'animals',
    difficulty: 'medium',
    gridSize: 48,
    pieces: [
      { id: 'p1', type: 'diamond', color: 'blue', correctPosition: { x: 8, y: 8 }, correctRotation: 0, size: 24 },
      { id: 'p2', type: 'triangle', color: 'cyan', correctPosition: { x: 32, y: 8 }, correctRotation: 90, size: 16 },
      { id: 'p3', type: 'circle', color: 'white', correctPosition: { x: 12, y: 16 }, correctRotation: 0, size: 8 },
    ],
  },
  {
    id: 'boat',
    nameEt: 'Paat',
    nameEn: 'Boat',
    category: 'objects',
    difficulty: 'medium',
    gridSize: 48,
    pieces: [
      { id: 'p1', type: 'half_square', color: 'brown', correctPosition: { x: 0, y: 24 }, correctRotation: 0, size: 24 },
      { id: 'p2', type: 'triangle', color: 'white', correctPosition: { x: 12, y: 0 }, correctRotation: 0, size: 24 },
      { id: 'p3', type: 'rectangle', color: 'brown', correctPosition: { x: 24, y: 16 }, correctRotation: 90, size: 8 },
    ],
  },
  {
    id: 'mushroom',
    nameEt: 'Seen',
    nameEn: 'Mushroom',
    category: 'objects',
    difficulty: 'medium',
    gridSize: 48,
    pieces: [
      { id: 'p1', type: 'circle', color: 'red', correctPosition: { x: 0, y: 0 }, correctRotation: 0, size: 32 },
      { id: 'p2', type: 'rectangle', color: 'white', correctPosition: { x: 16, y: 32 }, correctRotation: 90, size: 16 },
      { id: 'p3', type: 'circle', color: 'white', correctPosition: { x: 8, y: 8 }, correctRotation: 0, size: 8 },
      { id: 'p4', type: 'circle', color: 'white', correctPosition: { x: 24, y: 16 }, correctRotation: 0, size: 8 },
    ],
  },
  {
    id: 'butterfly',
    nameEt: 'Liblikas',
    nameEn: 'Butterfly',
    category: 'animals',
    difficulty: 'medium',
    gridSize: 48,
    pieces: [
      { id: 'p1', type: 'circle', color: 'purple', correctPosition: { x: 0, y: 0 }, correctRotation: 0, size: 16 },
      { id: 'p2', type: 'circle', color: 'purple', correctPosition: { x: 32, y: 0 }, correctRotation: 0, size: 16 },
      { id: 'p3', type: 'circle', color: 'pink', correctPosition: { x: 0, y: 24 }, correctRotation: 0, size: 16 },
      { id: 'p4', type: 'circle', color: 'pink', correctPosition: { x: 32, y: 24 }, correctRotation: 0, size: 16 },
      { id: 'p5', type: 'rectangle', color: 'brown', correctPosition: { x: 16, y: 0 }, correctRotation: 90, size: 24 },
    ],
  },

  // ============ HARD ============
  {
    id: 'rocket',
    nameEt: 'Rakett',
    nameEn: 'Rocket',
    category: 'objects',
    difficulty: 'hard',
    gridSize: 64,
    pieces: [
      { id: 'p1', type: 'triangle', color: 'red', correctPosition: { x: 20, y: 0 }, correctRotation: 0, size: 24 },
      { id: 'p2', type: 'rectangle', color: 'white', correctPosition: { x: 20, y: 24 }, correctRotation: 90, size: 24 },
      { id: 'p3', type: 'triangle', color: 'blue', correctPosition: { x: 4, y: 40 }, correctRotation: 270, size: 16 },
      { id: 'p4', type: 'triangle', color: 'blue', correctPosition: { x: 44, y: 40 }, correctRotation: 90, size: 16 },
      { id: 'p5', type: 'triangle', color: 'orange', correctPosition: { x: 20, y: 48 }, correctRotation: 180, size: 16 },
    ],
  },
  {
    id: 'bird',
    nameEt: 'Lind',
    nameEn: 'Bird',
    category: 'animals',
    difficulty: 'hard',
    gridSize: 64,
    pieces: [
      { id: 'p1', type: 'diamond', color: 'yellow', correctPosition: { x: 24, y: 16 }, correctRotation: 0, size: 16 },
      { id: 'p2', type: 'triangle', color: 'yellow', correctPosition: { x: 0, y: 16 }, correctRotation: 270, size: 24 },
      { id: 'p3', type: 'triangle', color: 'yellow', correctPosition: { x: 40, y: 16 }, correctRotation: 90, size: 24 },
      { id: 'p4', type: 'triangle', color: 'orange', correctPosition: { x: 40, y: 24 }, correctRotation: 90, size: 8 },
    ],
  },
  {
    id: 'heart',
    nameEt: 'Süda',
    nameEn: 'Heart',
    category: 'abstract',
    difficulty: 'hard',
    gridSize: 64,
    pieces: [
      { id: 'p1', type: 'circle', color: 'red', correctPosition: { x: 0, y: 0 }, correctRotation: 0, size: 16 },
      { id: 'p2', type: 'circle', color: 'red', correctPosition: { x: 32, y: 0 }, correctRotation: 0, size: 16 },
      { id: 'p3', type: 'triangle', color: 'red', correctPosition: { x: 0, y: 16 }, correctRotation: 180, size: 48 },
    ],
  },
  {
    id: 'star',
    nameEt: 'Täht',
    nameEn: 'Star',
    category: 'abstract',
    difficulty: 'hard',
    gridSize: 72,
    pieces: [
      { id: 'p1', type: 'triangle', color: 'yellow', correctPosition: { x: 24, y: 0 }, correctRotation: 0, size: 24 },
      { id: 'p2', type: 'triangle', color: 'yellow', correctPosition: { x: 24, y: 48 }, correctRotation: 180, size: 24 },
      { id: 'p3', type: 'triangle', color: 'gold', correctPosition: { x: 0, y: 24 }, correctRotation: 270, size: 24 },
      { id: 'p4', type: 'triangle', color: 'gold', correctPosition: { x: 48, y: 24 }, correctRotation: 90, size: 24 },
      { id: 'p5', type: 'square', color: 'orange', correctPosition: { x: 24, y: 24 }, correctRotation: 0, size: 24 },
    ],
  },
  {
    id: 'castle',
    nameEt: 'Loss',
    nameEn: 'Castle',
    category: 'objects',
    difficulty: 'hard',
    gridSize: 64,
    pieces: [
      { id: 'p1', type: 'rectangle', color: 'gray', correctPosition: { x: 16, y: 16 }, correctRotation: 0, size: 32 },
      { id: 'p2', type: 'square', color: 'gray', correctPosition: { x: 0, y: 0 }, correctRotation: 0, size: 16 },
      { id: 'p3', type: 'square', color: 'gray', correctPosition: { x: 48, y: 0 }, correctRotation: 0, size: 16 },
      { id: 'p4', type: 'triangle', color: 'red', correctPosition: { x: 0, y: 0 }, correctRotation: 0, size: 16 },
      { id: 'p5', type: 'triangle', color: 'red', correctPosition: { x: 48, y: 0 }, correctRotation: 0, size: 16 },
      { id: 'p6', type: 'square', color: 'brown', correctPosition: { x: 24, y: 40 }, correctRotation: 0, size: 16 },
    ],
  },
];
