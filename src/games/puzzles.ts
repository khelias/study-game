/**
 * Shape Shift Puzzle Database
 *
 * Curated puzzles for the Shape Shift game, organized by difficulty.
 * Grid and positions use a high-resolution grid (4× legacy) for precise placement.
 */

import type { Puzzle } from '../types/game';

export const PUZZLES: Puzzle[] = [
  // ============ EASY - Basic Shapes (Levels 1-3) ============
  {
    id: 'simple_square',
    nameEt: 'Ruut',
    nameEn: 'Square',
    category: 'shapes',
    difficulty: 'easy',
    gridSize: 16,
    pieces: [
      { id: 'p1', type: 'half_square', color: 'red', correctPosition: { x: 0, y: 0 }, correctRotation: 0, size: 8 },
      { id: 'p2', type: 'half_square', color: 'blue', correctPosition: { x: 0, y: 0 }, correctRotation: 180, size: 8 },
    ],
  },
  {
    id: 'simple_house',
    nameEt: 'Maja',
    nameEn: 'House',
    category: 'objects',
    difficulty: 'easy',
    gridSize: 20,
    pieces: [
      { id: 'p1', type: 'square', color: 'red', correctPosition: { x: 4, y: 8 }, correctRotation: 0, size: 12 },
      { id: 'p2', type: 'triangle', color: 'blue', correctPosition: { x: 4, y: 0 }, correctRotation: 0, size: 12 },
    ],
  },
  {
    id: 'simple_tree',
    nameEt: 'Puu',
    nameEn: 'Tree',
    category: 'objects',
    difficulty: 'easy',
    gridSize: 20,
    pieces: [
      { id: 'p1', type: 'triangle', color: 'green', correctPosition: { x: 4, y: 0 }, correctRotation: 0, size: 12 },
      { id: 'p2', type: 'rectangle', color: 'orange', correctPosition: { x: 8, y: 12 }, correctRotation: 90, size: 4 },
    ],
  },
  {
    id: 'simple_diamond',
    nameEt: 'Romb',
    nameEn: 'Diamond',
    category: 'shapes',
    difficulty: 'easy',
    gridSize: 16,
    pieces: [
      { id: 'p1', type: 'triangle', color: 'purple', correctPosition: { x: 0, y: 0 }, correctRotation: 0, size: 8 },
      { id: 'p2', type: 'triangle', color: 'pink', correctPosition: { x: 0, y: 8 }, correctRotation: 180, size: 8 },
    ],
  },
  {
    id: 'ice_cream',
    nameEt: 'Jäätis',
    nameEn: 'Ice Cream',
    category: 'objects',
    difficulty: 'easy',
    gridSize: 20,
    pieces: [
      { id: 'p1', type: 'circle', color: 'pink', correctPosition: { x: 4, y: 0 }, correctRotation: 0, size: 12 },
      { id: 'p2', type: 'triangle', color: 'orange', correctPosition: { x: 4, y: 8 }, correctRotation: 180, size: 12 },
    ],
  },

  // ============ MEDIUM - Animals & Objects (Levels 4-7) ============
  {
    id: 'cat_face',
    nameEt: 'Kass',
    nameEn: 'Cat',
    category: 'animals',
    difficulty: 'medium',
    gridSize: 24,
    pieces: [
      { id: 'p1', type: 'circle', color: 'orange', correctPosition: { x: 4, y: 8 }, correctRotation: 0, size: 16 },
      { id: 'p2', type: 'triangle', color: 'orange', correctPosition: { x: 0, y: 0 }, correctRotation: 0, size: 8 },
      { id: 'p3', type: 'triangle', color: 'orange', correctPosition: { x: 16, y: 0 }, correctRotation: 0, size: 8 },
    ],
  },
  {
    id: 'fish',
    nameEt: 'Kala',
    nameEn: 'Fish',
    category: 'animals',
    difficulty: 'medium',
    gridSize: 24,
    pieces: [
      { id: 'p1', type: 'diamond', color: 'blue', correctPosition: { x: 4, y: 4 }, correctRotation: 0, size: 12 },
      { id: 'p2', type: 'triangle', color: 'cyan', correctPosition: { x: 16, y: 4 }, correctRotation: 90, size: 8 },
      { id: 'p3', type: 'circle', color: 'white', correctPosition: { x: 4, y: 8 }, correctRotation: 0, size: 4 },
    ],
  },
  {
    id: 'boat',
    nameEt: 'Paat',
    nameEn: 'Boat',
    category: 'objects',
    difficulty: 'medium',
    gridSize: 24,
    pieces: [
      { id: 'p1', type: 'half_square', color: 'brown', correctPosition: { x: 0, y: 12 }, correctRotation: 0, size: 24 },
      { id: 'p2', type: 'triangle', color: 'white', correctPosition: { x: 8, y: 0 }, correctRotation: 0, size: 12 },
      { id: 'p3', type: 'rectangle', color: 'brown', correctPosition: { x: 12, y: 0 }, correctRotation: 90, size: 4 },
    ],
  },
  {
    id: 'arrow_right',
    nameEt: 'Nool',
    nameEn: 'Arrow',
    category: 'abstract',
    difficulty: 'medium',
    gridSize: 24,
    pieces: [
      { id: 'p1', type: 'rectangle', color: 'red', correctPosition: { x: 0, y: 8 }, correctRotation: 0, size: 12 },
      { id: 'p2', type: 'triangle', color: 'red', correctPosition: { x: 12, y: 4 }, correctRotation: 90, size: 12 },
    ],
  },
  {
    id: 'mushroom',
    nameEt: 'Seen',
    nameEn: 'Mushroom',
    category: 'objects',
    difficulty: 'medium',
    gridSize: 24,
    pieces: [
      { id: 'p1', type: 'circle', color: 'red', correctPosition: { x: 0, y: 0 }, correctRotation: 0, size: 16 },
      { id: 'p2', type: 'rectangle', color: 'white', correctPosition: { x: 8, y: 12 }, correctRotation: 90, size: 8 },
      { id: 'p3', type: 'circle', color: 'white', correctPosition: { x: 4, y: 4 }, correctRotation: 0, size: 4 },
      { id: 'p4', type: 'circle', color: 'white', correctPosition: { x: 12, y: 8 }, correctRotation: 0, size: 4 },
    ],
  },
  {
    id: 'butterfly',
    nameEt: 'Liblikas',
    nameEn: 'Butterfly',
    category: 'animals',
    difficulty: 'medium',
    gridSize: 24,
    pieces: [
      { id: 'p1', type: 'circle', color: 'purple', correctPosition: { x: 0, y: 0 }, correctRotation: 0, size: 8 },
      { id: 'p2', type: 'circle', color: 'purple', correctPosition: { x: 16, y: 0 }, correctRotation: 0, size: 8 },
      { id: 'p3', type: 'circle', color: 'pink', correctPosition: { x: 0, y: 12 }, correctRotation: 0, size: 8 },
      { id: 'p4', type: 'circle', color: 'pink', correctPosition: { x: 16, y: 12 }, correctRotation: 0, size: 8 },
      { id: 'p5', type: 'rectangle', color: 'brown', correctPosition: { x: 8, y: 0 }, correctRotation: 90, size: 12 },
    ],
  },

  // ============ HARD - Complex shapes (Levels 8+) ============
  {
    id: 'rocket',
    nameEt: 'Rakett',
    nameEn: 'Rocket',
    category: 'objects',
    difficulty: 'hard',
    gridSize: 32,
    pieces: [
      { id: 'p1', type: 'triangle', color: 'red', correctPosition: { x: 8, y: 0 }, correctRotation: 0, size: 12 },
      { id: 'p2', type: 'rectangle', color: 'white', correctPosition: { x: 8, y: 8 }, correctRotation: 90, size: 12 },
      { id: 'p3', type: 'triangle', color: 'blue', correctPosition: { x: 0, y: 20 }, correctRotation: 270, size: 8 },
      { id: 'p4', type: 'triangle', color: 'blue', correctPosition: { x: 20, y: 20 }, correctRotation: 90, size: 8 },
      { id: 'p5', type: 'triangle', color: 'orange', correctPosition: { x: 8, y: 24 }, correctRotation: 180, size: 8 },
    ],
  },
  {
    id: 'bird',
    nameEt: 'Lind',
    nameEn: 'Bird',
    category: 'animals',
    difficulty: 'hard',
    gridSize: 32,
    pieces: [
      { id: 'p1', type: 'diamond', color: 'yellow', correctPosition: { x: 12, y: 8 }, correctRotation: 0, size: 8 },
      { id: 'p2', type: 'triangle', color: 'yellow', correctPosition: { x: 0, y: 8 }, correctRotation: 270, size: 12 },
      { id: 'p3', type: 'triangle', color: 'yellow', correctPosition: { x: 20, y: 8 }, correctRotation: 90, size: 12 },
      { id: 'p4', type: 'triangle', color: 'orange', correctPosition: { x: 20, y: 12 }, correctRotation: 90, size: 4 },
    ],
  },
  {
    id: 'heart',
    nameEt: 'Süda',
    nameEn: 'Heart',
    category: 'abstract',
    difficulty: 'hard',
    gridSize: 24,
    pieces: [
      { id: 'p1', type: 'circle', color: 'red', correctPosition: { x: 0, y: 0 }, correctRotation: 0, size: 8 },
      { id: 'p2', type: 'circle', color: 'red', correctPosition: { x: 12, y: 0 }, correctRotation: 0, size: 8 },
      { id: 'p3', type: 'triangle', color: 'red', correctPosition: { x: 0, y: 4 }, correctRotation: 180, size: 20 },
    ],
  },
  {
    id: 'star',
    nameEt: 'Täht',
    nameEn: 'Star',
    category: 'abstract',
    difficulty: 'hard',
    gridSize: 32,
    pieces: [
      { id: 'p1', type: 'triangle', color: 'yellow', correctPosition: { x: 8, y: 0 }, correctRotation: 0, size: 12 },
      { id: 'p2', type: 'triangle', color: 'yellow', correctPosition: { x: 8, y: 20 }, correctRotation: 180, size: 12 },
      { id: 'p3', type: 'triangle', color: 'gold', correctPosition: { x: 0, y: 8 }, correctRotation: 270, size: 12 },
      { id: 'p4', type: 'triangle', color: 'gold', correctPosition: { x: 20, y: 8 }, correctRotation: 90, size: 12 },
      { id: 'p5', type: 'square', color: 'orange', correctPosition: { x: 8, y: 8 }, correctRotation: 0, size: 12 },
    ],
  },
  {
    id: 'castle',
    nameEt: 'Loss',
    nameEn: 'Castle',
    category: 'objects',
    difficulty: 'hard',
    gridSize: 32,
    pieces: [
      { id: 'p1', type: 'rectangle', color: 'gray', correctPosition: { x: 4, y: 12 }, correctRotation: 90, size: 16 },
      { id: 'p2', type: 'square', color: 'gray', correctPosition: { x: 0, y: 0 }, correctRotation: 0, size: 8 },
      { id: 'p3', type: 'square', color: 'gray', correctPosition: { x: 24, y: 0 }, correctRotation: 0, size: 8 },
      { id: 'p4', type: 'triangle', color: 'red', correctPosition: { x: 0, y: 0 }, correctRotation: 0, size: 8 },
      { id: 'p5', type: 'triangle', color: 'red', correctPosition: { x: 24, y: 0 }, correctRotation: 0, size: 8 },
      { id: 'p6', type: 'square', color: 'brown', correctPosition: { x: 12, y: 20 }, correctRotation: 0, size: 8 },
    ],
  },
];
