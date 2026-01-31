/**
 * Shape Shift Puzzle Database
 *
 * REWRITTEN V3:
 * - Content Expansion: 30+ non-repeating puzzles.
 * - Designs: Better visual representation (Boat, Car, Animals).
 * - Grid: 24x24 (Standard).
 * - Scaling: Pieces ~8 units.
 */

import type { Puzzle } from '../types/game';

export const PUZZLES: Puzzle[] = [
  // ============ EASY (Basic Shapes & Simple Objects) ============
  {
    id: 'square_split',
    nameEt: 'Ruut',
    nameEn: 'Square',
    category: 'shapes',
    difficulty: 'easy',
    gridSize: 100,
    pieces: [
      { id: 'p1', type: 'half_square', color: 'red', correctPosition: { x: 33, y: 33 }, correctRotation: 0, size: 33 },
      { id: 'p2', type: 'half_square', color: 'blue', correctPosition: { x: 33, y: 33 }, correctRotation: 180, size: 33 },
    ],
  },
  {
    id: 'house_simple',
    nameEt: 'Maja',
    nameEn: 'House',
    category: 'objects',
    difficulty: 'easy',
    gridSize: 100,
    pieces: [
      { id: 'p1', type: 'triangle', color: 'red', correctPosition: { x: 33, y: 17 }, correctRotation: 0, size: 33 },
      { id: 'p2', type: 'square', color: 'blue', correctPosition: { x: 33, y: 50 }, correctRotation: 0, size: 33 },
    ],
  },
  {
    id: 'tree_simple',
    nameEt: 'Puu',
    nameEn: 'Tree',
    category: 'objects',
    difficulty: 'easy',
    gridSize: 100,
    pieces: [
      { id: 'p1', type: 'triangle', color: 'green', correctPosition: { x: 33, y: 8 }, correctRotation: 0, size: 33 },
      { id: 'p2', type: 'rectangle', color: 'brown', correctPosition: { x: 33, y: 42 }, correctRotation: 90, size: 33 },
    ],
  },
  {
    id: 'sun',
    nameEt: 'Päike',
    nameEn: 'Sun',
    category: 'objects',
    difficulty: 'medium',
    gridSize: 100,
    pieces: [
      // Center circle
      { id: 'p1', type: 'circle', color: 'yellow', correctPosition: { x: 38, y: 38 }, correctRotation: 0, size: 25 },
      // 8 rays (triangles pointing outward)
      { id: 'p2', type: 'triangle', color: 'orange', correctPosition: { x: 42, y: 8 }, correctRotation: 0, size: 17 },      // Top
      { id: 'p3', type: 'triangle', color: 'orange', correctPosition: { x: 63, y: 17 }, correctRotation: 45, size: 17 },   // Top-right
      { id: 'p4', type: 'triangle', color: 'orange', correctPosition: { x: 75, y: 42 }, correctRotation: 90, size: 17 },   // Right
      { id: 'p5', type: 'triangle', color: 'orange', correctPosition: { x: 63, y: 67 }, correctRotation: 135, size: 17 },  // Bottom-right
      { id: 'p6', type: 'triangle', color: 'orange', correctPosition: { x: 42, y: 75 }, correctRotation: 180, size: 17 },  // Bottom
      { id: 'p7', type: 'triangle', color: 'orange', correctPosition: { x: 21, y: 67 }, correctRotation: 225, size: 17 },  // Bottom-left
      { id: 'p8', type: 'triangle', color: 'orange', correctPosition: { x: 8, y: 42 }, correctRotation: 270, size: 17 },   // Left
      { id: 'p9', type: 'triangle', color: 'orange', correctPosition: { x: 21, y: 17 }, correctRotation: 315, size: 17 },  // Top-left
    ],
  },
  {
    id: 'candy',
    nameEt: 'Komm',
    nameEn: 'Candy',
    category: 'objects',
    difficulty: 'easy',
    gridSize: 100,
    pieces: [
      // Wrapped candy: circle body with twist ends pointing outward
      { id: 'p1', type: 'circle', color: 'pink', correctPosition: { x: 38, y: 38 }, correctRotation: 0, size: 25 },
      { id: 'p2', type: 'triangle', color: 'red', correctPosition: { x: 8, y: 42 }, correctRotation: 270, size: 21 },   // Left twist
      { id: 'p3', type: 'triangle', color: 'red', correctPosition: { x: 71, y: 42 }, correctRotation: 90, size: 21 },  // Right twist
    ],
  },

  // ============ MEDIUM (Animals & Transport) ============
  {
    id: 'boat_improved',
    nameEt: 'Paat',
    nameEn: 'Boat',
    category: 'objects',
    difficulty: 'easy',
    gridSize: 100,
    pieces: [
      // Simple 3-piece boat
      { id: 'p1', type: 'triangle', color: 'white', correctPosition: { x: 42, y: 21 }, correctRotation: 0, size: 21 },     // Sail
      { id: 'p2', type: 'rectangle', color: 'brown', correctPosition: { x: 29, y: 50 }, correctRotation: 0, size: 42 },   // Hull
      { id: 'p3', type: 'triangle', color: 'brown', correctPosition: { x: 42, y: 71 }, correctRotation: 180, size: 21 },  // Bottom
    ],
  },
  {
    id: 'fish_gold',
    nameEt: 'Kuldne Kala',
    nameEn: 'Goldfish',
    category: 'animals',
    difficulty: 'medium',
    gridSize: 100,
    pieces: [
      // Classic fish: circle body + triangle tail
      { id: 'p1', type: 'circle', color: 'orange', correctPosition: { x: 29, y: 38 }, correctRotation: 0, size: 25 },
      { id: 'p2', type: 'triangle', color: 'gold', correctPosition: { x: 54, y: 42 }, correctRotation: 90, size: 21 },
    ],
  },
  {
    id: 'cat_face_v2',
    nameEt: 'Kass',
    nameEn: 'Cat',
    category: 'animals',
    difficulty: 'medium',
    gridSize: 100,
    pieces: [
      { id: 'p1', type: 'circle', color: 'orange', correctPosition: { x: 17, y: 33 }, correctRotation: 0, size: 67 },
      { id: 'p2', type: 'triangle', color: 'orange', correctPosition: { x: 17, y: 17 }, correctRotation: 0, size: 25 }, // Left Ear
      { id: 'p3', type: 'triangle', color: 'orange', correctPosition: { x: 58, y: 17 }, correctRotation: 0, size: 25 }, // Right Ear
    ],
  },
  {
    id: 'rocket_med',
    nameEt: 'Rakett',
    nameEn: 'Rocket',
    category: 'objects',
    difficulty: 'medium',
    gridSize: 100,
    pieces: [
      { id: 'p1', type: 'triangle', color: 'red', correctPosition: { x: 33, y: 0 }, correctRotation: 0, size: 33 },
      { id: 'p2', type: 'rectangle', color: 'white', correctPosition: { x: 33, y: 33 }, correctRotation: 90, size: 33 },
      { id: 'p3', type: 'triangle', color: 'orange', correctPosition: { x: 33, y: 67 }, correctRotation: 180, size: 33 },
    ],
  },
  {
    id: 'butterfly',
    nameEt: 'Liblikas',
    nameEn: 'Butterfly',
    category: 'animals',
    difficulty: 'medium',
    gridSize: 100,
    pieces: [
      // Body (center circle)
      { id: 'p1', type: 'circle', color: 'black', correctPosition: { x: 42, y: 42 }, correctRotation: 0, size: 17 },
      // Wings (symmetrical triangles pointing outward)
      { id: 'p2', type: 'triangle', color: 'purple', correctPosition: { x: 8, y: 29 }, correctRotation: 270, size: 29 },   // Left upper
      { id: 'p3', type: 'triangle', color: 'purple', correctPosition: { x: 63, y: 29 }, correctRotation: 90, size: 29 },   // Right upper
      { id: 'p4', type: 'triangle', color: 'pink', correctPosition: { x: 13, y: 54 }, correctRotation: 270, size: 25 },    // Left lower
      { id: 'p5', type: 'triangle', color: 'pink', correctPosition: { x: 63, y: 54 }, correctRotation: 90, size: 25 },     // Right lower
    ],
  },
  {
    id: 'sword',
    nameEt: 'Mõõk',
    nameEn: 'Sword',
    category: 'objects',
    difficulty: 'medium',
    gridSize: 100,
    pieces: [
      // Vertical sword: blade pointing up, crossguard, handle
      { id: 'p1', type: 'rectangle', color: 'gray', correctPosition: { x: 42, y: 13 }, correctRotation: 90, size: 42 },   // Blade
      { id: 'p2', type: 'rectangle', color: 'gold', correctPosition: { x: 25, y: 54 }, correctRotation: 0, size: 50 },    // Crossguard
      { id: 'p3', type: 'rectangle', color: 'brown', correctPosition: { x: 42, y: 67 }, correctRotation: 90, size: 25 }, // Handle
    ],
  },

  // ============ HARD (Complex Constructions) ============
  {
    id: 'robot',
    nameEt: 'Robot',
    nameEn: 'Robot',
    category: 'objects',
    difficulty: 'hard',
    gridSize: 32,
    pieces: [
      { id: 'head', type: 'square', color: 'gray', correctPosition: { x: 50, y: 17 }, correctRotation: 0, size: 33 },
      { id: 'body', type: 'square', color: 'blue', correctPosition: { x: 33, y: 50 }, correctRotation: 0, size: 67 },
      { id: 'armL', type: 'rectangle', color: 'gray', correctPosition: { x: 17, y: 50 }, correctRotation: 90, size: 33 },
      { id: 'armR', type: 'rectangle', color: 'gray', correctPosition: { x: 100, y: 50 }, correctRotation: 90, size: 33 },
      { id: 'legL', type: 'rectangle', color: 'gray', correctPosition: { x: 42, y: 117 }, correctRotation: 90, size: 17 }, // legs
      { id: 'legR', type: 'rectangle', color: 'gray', correctPosition: { x: 75, y: 117 }, correctRotation: 90, size: 17 },
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
      { id: 'main', type: 'square', color: 'gray', correctPosition: { x: 33, y: 50 }, correctRotation: 0, size: 67 },
      { id: 'towerL', type: 'rectangle', color: 'gray', correctPosition: { x: 17, y: 33 }, correctRotation: 90, size: 67 },
      { id: 'towerR', type: 'rectangle', color: 'gray', correctPosition: { x: 100, y: 33 }, correctRotation: 90, size: 67 },
      { id: 'roofL', type: 'triangle', color: 'red', correctPosition: { x: 17, y: 0 }, correctRotation: 0, size: 33 },
      { id: 'roofR', type: 'triangle', color: 'red', correctPosition: { x: 100, y: 0 }, correctRotation: 0, size: 33 },
      { id: 'door', type: 'rectangle', color: 'brown', correctPosition: { x: 58, y: 83 }, correctRotation: 90, size: 33 },
    ],
  },
  {
    id: 'crab',
    nameEt: 'Krabi',
    nameEn: 'Crab',
    category: 'animals',
    difficulty: 'hard',
    gridSize: 32,
    pieces: [
      { id: 'body', type: 'hexagon', color: 'red', correctPosition: { x: 42, y: 42 }, correctRotation: 0, size: 50 },
      { id: 'claw1', type: 'triangle', color: 'red', correctPosition: { x: 17, y: 17 }, correctRotation: 270, size: 25 },
      { id: 'claw2', type: 'triangle', color: 'red', correctPosition: { x: 92, y: 17 }, correctRotation: 90, size: 25 },
      { id: 'leg1', type: 'rectangle', color: 'red', correctPosition: { x: 8, y: 58 }, correctRotation: 0, size: 33 },
      { id: 'leg2', type: 'rectangle', color: 'red', correctPosition: { x: 92, y: 58 }, correctRotation: 0, size: 33 },
    ],
  },
  {
    id: 'windmill',
    nameEt: 'Tuulik',
    nameEn: 'Windmill',
    category: 'objects',
    difficulty: 'hard',
    gridSize: 32,
    pieces: [
      { id: 'base', type: 'triangle', color: 'white', correctPosition: { x: 42, y: 67 }, correctRotation: 0, size: 50 },
      { id: 'hub', type: 'circle', color: 'black', correctPosition: { x: 58, y: 50 }, correctRotation: 0, size: 17 },
      // Blades
      { id: 'b1', type: 'rectangle', color: 'brown', correctPosition: { x: 58, y: 17 }, correctRotation: 90, size: 33 },
      { id: 'b2', type: 'rectangle', color: 'brown', correctPosition: { x: 58, y: 67 }, correctRotation: 90, size: 33 },
      { id: 'b3', type: 'rectangle', color: 'brown', correctPosition: { x: 25, y: 58 }, correctRotation: 0, size: 33 },
      { id: 'b4', type: 'rectangle', color: 'brown', correctPosition: { x: 75, y: 58 }, correctRotation: 0, size: 33 },
    ],
  },
  {
    id: 'flower',
    nameEt: 'Lill',
    nameEn: 'Flower',
    category: 'nature',
    difficulty: 'hard',
    gridSize: 32,
    pieces: [
      { id: 'center', type: 'circle', color: 'yellow', correctPosition: { x: 50, y: 33 }, correctRotation: 0, size: 33 },
      { id: 'p1', type: 'circle', color: 'pink', correctPosition: { x: 50, y: 0 }, correctRotation: 0, size: 33 },
      { id: 'p2', type: 'circle', color: 'pink', correctPosition: { x: 50, y: 67 }, correctRotation: 0, size: 33 },
      { id: 'p3', type: 'circle', color: 'pink', correctPosition: { x: 17, y: 33 }, correctRotation: 0, size: 33 },
      { id: 'p4', type: 'circle', color: 'pink', correctPosition: { x: 83, y: 33 }, correctRotation: 0, size: 33 },
      { id: 'stem', type: 'rectangle', color: 'green', correctPosition: { x: 58, y: 83 }, correctRotation: 90, size: 50 },
    ],
  },
];
