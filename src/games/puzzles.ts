/**
 * Shape Shift Puzzle Database
 * 
 * Curated puzzles for the Shape Shift game, organized by difficulty.
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
    gridSize: 4,
    pieces: [
      { id: 'p1', type: 'half_square', color: 'red', correctPosition: { x: 0, y: 0 }, correctRotation: 0, size: 2 },
      { id: 'p2', type: 'half_square', color: 'blue', correctPosition: { x: 0, y: 0 }, correctRotation: 180, size: 2 },
    ],
  },
  {
    id: 'simple_house',
    nameEt: 'Maja',
    nameEn: 'House',
    category: 'objects',
    difficulty: 'easy',
    gridSize: 5,
    pieces: [
      { id: 'p1', type: 'square', color: 'red', correctPosition: { x: 1, y: 2 }, correctRotation: 0, size: 3 },
      { id: 'p2', type: 'triangle', color: 'blue', correctPosition: { x: 1, y: 0 }, correctRotation: 0, size: 3 },
    ],
  },
  {
    id: 'simple_tree',
    nameEt: 'Puu',
    nameEn: 'Tree',
    category: 'objects',
    difficulty: 'easy',
    gridSize: 5,
    pieces: [
      { id: 'p1', type: 'triangle', color: 'green', correctPosition: { x: 1, y: 0 }, correctRotation: 0, size: 3 },
      { id: 'p2', type: 'rectangle', color: 'orange', correctPosition: { x: 2, y: 3 }, correctRotation: 90, size: 1 },
    ],
  },
  {
    id: 'simple_diamond',
    nameEt: 'Romb',
    nameEn: 'Diamond',
    category: 'shapes',
    difficulty: 'easy',
    gridSize: 4,
    pieces: [
      { id: 'p1', type: 'triangle', color: 'purple', correctPosition: { x: 0, y: 0 }, correctRotation: 0, size: 2 },
      { id: 'p2', type: 'triangle', color: 'pink', correctPosition: { x: 0, y: 2 }, correctRotation: 180, size: 2 },
    ],
  },
  {
    id: 'ice_cream',
    nameEt: 'Jäätis',
    nameEn: 'Ice Cream',
    category: 'objects',
    difficulty: 'easy',
    gridSize: 5,
    pieces: [
      { id: 'p1', type: 'circle', color: 'pink', correctPosition: { x: 1, y: 0 }, correctRotation: 0, size: 3 },
      { id: 'p2', type: 'triangle', color: 'orange', correctPosition: { x: 1, y: 2 }, correctRotation: 180, size: 3 },
    ],
  },

  // ============ MEDIUM - Animals & Objects (Levels 4-7) ============
  {
    id: 'cat_face',
    nameEt: 'Kass',
    nameEn: 'Cat',
    category: 'animals',
    difficulty: 'medium',
    gridSize: 6,
    pieces: [
      { id: 'p1', type: 'circle', color: 'orange', correctPosition: { x: 1, y: 2 }, correctRotation: 0, size: 4 },
      { id: 'p2', type: 'triangle', color: 'orange', correctPosition: { x: 0, y: 0 }, correctRotation: 0, size: 2 },
      { id: 'p3', type: 'triangle', color: 'orange', correctPosition: { x: 4, y: 0 }, correctRotation: 0, size: 2 },
    ],
  },
  {
    id: 'fish',
    nameEt: 'Kala',
    nameEn: 'Fish',
    category: 'animals',
    difficulty: 'medium',
    gridSize: 6,
    pieces: [
      { id: 'p1', type: 'diamond', color: 'blue', correctPosition: { x: 1, y: 1 }, correctRotation: 0, size: 3 },
      { id: 'p2', type: 'triangle', color: 'cyan', correctPosition: { x: 4, y: 1 }, correctRotation: 90, size: 2 },
      { id: 'p3', type: 'circle', color: 'white', correctPosition: { x: 1, y: 2 }, correctRotation: 0, size: 1 },
    ],
  },
  {
    id: 'boat',
    nameEt: 'Paat',
    nameEn: 'Boat',
    category: 'objects',
    difficulty: 'medium',
    gridSize: 6,
    pieces: [
      { id: 'p1', type: 'half_square', color: 'brown', correctPosition: { x: 0, y: 3 }, correctRotation: 0, size: 6 },
      { id: 'p2', type: 'triangle', color: 'white', correctPosition: { x: 2, y: 0 }, correctRotation: 0, size: 3 },
      { id: 'p3', type: 'rectangle', color: 'brown', correctPosition: { x: 3, y: 0 }, correctRotation: 90, size: 1 },
    ],
  },
  {
    id: 'arrow_right',
    nameEt: 'Nool',
    nameEn: 'Arrow',
    category: 'abstract',
    difficulty: 'medium',
    gridSize: 6,
    pieces: [
      { id: 'p1', type: 'rectangle', color: 'red', correctPosition: { x: 0, y: 2 }, correctRotation: 0, size: 3 },
      { id: 'p2', type: 'triangle', color: 'red', correctPosition: { x: 3, y: 1 }, correctRotation: 90, size: 3 },
    ],
  },
  {
    id: 'mushroom',
    nameEt: 'Seen',
    nameEn: 'Mushroom',
    category: 'objects',
    difficulty: 'medium',
    gridSize: 6,
    pieces: [
      { id: 'p1', type: 'circle', color: 'red', correctPosition: { x: 0, y: 0 }, correctRotation: 0, size: 4 },
      { id: 'p2', type: 'rectangle', color: 'white', correctPosition: { x: 2, y: 3 }, correctRotation: 90, size: 2 },
      { id: 'p3', type: 'circle', color: 'white', correctPosition: { x: 1, y: 1 }, correctRotation: 0, size: 1 },
      { id: 'p4', type: 'circle', color: 'white', correctPosition: { x: 3, y: 2 }, correctRotation: 0, size: 1 },
    ],
  },
  {
    id: 'butterfly',
    nameEt: 'Liblikas',
    nameEn: 'Butterfly',
    category: 'animals',
    difficulty: 'medium',
    gridSize: 6,
    pieces: [
      { id: 'p1', type: 'circle', color: 'purple', correctPosition: { x: 0, y: 0 }, correctRotation: 0, size: 2 },
      { id: 'p2', type: 'circle', color: 'purple', correctPosition: { x: 4, y: 0 }, correctRotation: 0, size: 2 },
      { id: 'p3', type: 'circle', color: 'pink', correctPosition: { x: 0, y: 3 }, correctRotation: 0, size: 2 },
      { id: 'p4', type: 'circle', color: 'pink', correctPosition: { x: 4, y: 3 }, correctRotation: 0, size: 2 },
      { id: 'p5', type: 'rectangle', color: 'brown', correctPosition: { x: 2, y: 0 }, correctRotation: 90, size: 3 },
    ],
  },

  // ============ HARD - Complex shapes (Levels 8+) ============
  {
    id: 'rocket',
    nameEt: 'Rakett',
    nameEn: 'Rocket',
    category: 'objects',
    difficulty: 'hard',
    gridSize: 8,
    pieces: [
      { id: 'p1', type: 'triangle', color: 'red', correctPosition: { x: 2, y: 0 }, correctRotation: 0, size: 3 },
      { id: 'p2', type: 'rectangle', color: 'white', correctPosition: { x: 2, y: 2 }, correctRotation: 90, size: 3 },
      { id: 'p3', type: 'triangle', color: 'blue', correctPosition: { x: 0, y: 5 }, correctRotation: 270, size: 2 },
      { id: 'p4', type: 'triangle', color: 'blue', correctPosition: { x: 5, y: 5 }, correctRotation: 90, size: 2 },
      { id: 'p5', type: 'triangle', color: 'orange', correctPosition: { x: 2, y: 6 }, correctRotation: 180, size: 2 },
    ],
  },
  {
    id: 'bird',
    nameEt: 'Lind',
    nameEn: 'Bird',
    category: 'animals',
    difficulty: 'hard',
    gridSize: 8,
    pieces: [
      { id: 'p1', type: 'diamond', color: 'yellow', correctPosition: { x: 3, y: 2 }, correctRotation: 0, size: 2 },
      { id: 'p2', type: 'triangle', color: 'yellow', correctPosition: { x: 0, y: 2 }, correctRotation: 270, size: 3 },
      { id: 'p3', type: 'triangle', color: 'yellow', correctPosition: { x: 5, y: 2 }, correctRotation: 90, size: 3 },
      { id: 'p4', type: 'triangle', color: 'orange', correctPosition: { x: 5, y: 3 }, correctRotation: 90, size: 1 },
    ],
  },
  {
    id: 'heart',
    nameEt: 'Süda',
    nameEn: 'Heart',
    category: 'abstract',
    difficulty: 'hard',
    gridSize: 6,
    pieces: [
      { id: 'p1', type: 'circle', color: 'red', correctPosition: { x: 0, y: 0 }, correctRotation: 0, size: 2 },
      { id: 'p2', type: 'circle', color: 'red', correctPosition: { x: 3, y: 0 }, correctRotation: 0, size: 2 },
      { id: 'p3', type: 'triangle', color: 'red', correctPosition: { x: 0, y: 2 }, correctRotation: 180, size: 5 },
    ],
  },
  {
    id: 'star',
    nameEt: 'Täht',
    nameEn: 'Star',
    category: 'abstract',
    difficulty: 'hard',
    gridSize: 8,
    pieces: [
      { id: 'p1', type: 'triangle', color: 'yellow', correctPosition: { x: 2, y: 0 }, correctRotation: 0, size: 3 },
      { id: 'p2', type: 'triangle', color: 'yellow', correctPosition: { x: 2, y: 5 }, correctRotation: 180, size: 3 },
      { id: 'p3', type: 'triangle', color: 'gold', correctPosition: { x: 0, y: 2 }, correctRotation: 270, size: 3 },
      { id: 'p4', type: 'triangle', color: 'gold', correctPosition: { x: 5, y: 2 }, correctRotation: 90, size: 3 },
      { id: 'p5', type: 'square', color: 'orange', correctPosition: { x: 2, y: 2 }, correctRotation: 0, size: 3 },
    ],
  },
  {
    id: 'castle',
    nameEt: 'Loss',
    nameEn: 'Castle',
    category: 'objects',
    difficulty: 'hard',
    gridSize: 8,
    pieces: [
      { id: 'p1', type: 'rectangle', color: 'gray', correctPosition: { x: 1, y: 3 }, correctRotation: 90, size: 4 },
      { id: 'p2', type: 'square', color: 'gray', correctPosition: { x: 0, y: 0 }, correctRotation: 0, size: 2 },
      { id: 'p3', type: 'square', color: 'gray', correctPosition: { x: 6, y: 0 }, correctRotation: 0, size: 2 },
      { id: 'p4', type: 'triangle', color: 'red', correctPosition: { x: 0, y: 0 }, correctRotation: 0, size: 2 },
      { id: 'p5', type: 'triangle', color: 'red', correctPosition: { x: 6, y: 0 }, correctRotation: 0, size: 2 },
      { id: 'p6', type: 'square', color: 'brown', correctPosition: { x: 3, y: 5 }, correctRotation: 0, size: 2 },
    ],
  },
];
