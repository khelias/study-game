/**
 * Shape Shift Puzzle Database
 *
 * REWRITTEN V4:
 * - Grid: 100x100 (Pixel Perfect).
 * - Designs: "Premium" aesthetic, clearer shapes, logical assemblies.
 * - Coordinates: Top-Left based. Center of grid is 50,50.
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
      // Two right triangles forming a square (Tangram style)
      // Top-Left Half
      {
        id: 'p1',
        type: 'half_square',
        color: 'blue',
        correctPosition: { x: 30, y: 30 },
        correctRotation: 0,
        size: 40,
      },
      // Bottom-Right Half
      {
        id: 'p2',
        type: 'half_square',
        color: 'cyan',
        correctPosition: { x: 30, y: 30 },
        correctRotation: 180,
        size: 40,
      },
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
      // Roof (Overhangs slightly)
      {
        id: 'roof',
        type: 'triangle',
        color: 'red',
        correctPosition: { x: 25, y: 15 },
        correctRotation: 0,
        size: 50,
      },
      // Body
      {
        id: 'walls',
        type: 'square',
        color: 'white',
        correctPosition: { x: 35, y: 50 },
        correctRotation: 0,
        size: 30,
      },
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
      // Foliage
      {
        id: 'top',
        type: 'triangle',
        color: 'green',
        correctPosition: { x: 25, y: 10 },
        correctRotation: 0,
        size: 50,
      },
      // Trunk (Rotated rectangle to be vertical)
      {
        id: 'trunk',
        type: 'rectangle',
        color: 'brown',
        correctPosition: { x: 40, y: 50 },
        correctRotation: 90,
        size: 20,
      },
    ],
  },
  {
    id: 'sun',
    nameEt: 'Päike',
    nameEn: 'Sun',
    category: 'objects',
    difficulty: 'easy',
    gridSize: 100,
    pieces: [
      // Center
      {
        id: 'core',
        type: 'circle',
        color: 'yellow',
        correctPosition: { x: 35, y: 35 },
        correctRotation: 0,
        size: 30,
      },
      // Rays (Cardinals)
      {
        id: 'r_top',
        type: 'triangle',
        color: 'orange',
        correctPosition: { x: 40, y: 10 },
        correctRotation: 0,
        size: 20,
      },
      {
        id: 'r_bottom',
        type: 'triangle',
        color: 'orange',
        correctPosition: { x: 40, y: 70 },
        correctRotation: 180,
        size: 20,
      },
      {
        id: 'r_left',
        type: 'triangle',
        color: 'orange',
        correctPosition: { x: 10, y: 40 },
        correctRotation: 270,
        size: 20,
      },
      {
        id: 'r_right',
        type: 'triangle',
        color: 'orange',
        correctPosition: { x: 70, y: 40 },
        correctRotation: 90,
        size: 20,
      },
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
      // Center
      {
        id: 'pop',
        type: 'circle',
        color: 'pink',
        correctPosition: { x: 35, y: 35 },
        correctRotation: 0,
        size: 30,
      },
      // Wrapper Ends
      {
        id: 'w_left',
        type: 'triangle',
        color: 'purple',
        correctPosition: { x: 10, y: 35 },
        correctRotation: 270,
        size: 25,
      },
      {
        id: 'w_right',
        type: 'triangle',
        color: 'purple',
        correctPosition: { x: 65, y: 35 },
        correctRotation: 90,
        size: 25,
      },
    ],
  },

  // ============ MEDIUM (Animals & Transport) ============
  {
    id: 'boat_sleek',
    nameEt: 'Paat',
    nameEn: 'Boat',
    category: 'objects',
    difficulty: 'medium',
    gridSize: 100,
    pieces: [
      // Hull (Wide rectangle at bottom)
      // Visual: x=10..90, y=60..100
      {
        id: 'hull_main',
        type: 'rectangle',
        color: 'brown',
        correctPosition: { x: 10, y: 40 },
        correctRotation: 0,
        size: 80,
      },
      // Mast (Vertical rectangle)
      // Visual: x=40..60, y=20..60
      {
        id: 'mast',
        type: 'rectangle',
        color: 'gray',
        correctPosition: { x: 30, y: 20 },
        correctRotation: 90,
        size: 40,
      },
      // Sail (Triangle pointing right, attached to mast)
      // Visual: x=60..100, y=20..60
      {
        id: 'sail_main',
        type: 'triangle',
        color: 'white',
        correctPosition: { x: 60, y: 20 },
        correctRotation: 90,
        size: 40,
      },
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
      // Body (Circle) - Center 50,50. Radius 25. x=25..75
      {
        id: 'body',
        type: 'circle',
        color: 'gold',
        correctPosition: { x: 25, y: 25 },
        correctRotation: 0,
        size: 50,
      },
      // Tail (Triangle pointing right) - Base attached to body at x=75.
      // Rot 90 base is at x=75 (Left of box).
      {
        id: 'tail',
        type: 'triangle',
        color: 'orange',
        correctPosition: { x: 75, y: 35 },
        correctRotation: 90,
        size: 30,
      },
    ],
  },
  {
    id: 'cat_face',
    nameEt: 'Kass',
    nameEn: 'Cat',
    category: 'animals',
    difficulty: 'medium',
    gridSize: 100,
    pieces: [
      {
        id: 'head',
        type: 'circle',
        color: 'gray',
        correctPosition: { x: 25, y: 25 },
        correctRotation: 0,
        size: 50,
      },
      {
        id: 'ear_l',
        type: 'triangle',
        color: 'gray',
        correctPosition: { x: 20, y: 5 },
        correctRotation: 0,
        size: 25,
      },
      {
        id: 'ear_r',
        type: 'triangle',
        color: 'gray',
        correctPosition: { x: 55, y: 5 },
        correctRotation: 0,
        size: 25,
      },
    ],
  },
  {
    id: 'rocket',
    nameEt: 'Rakett',
    nameEn: 'Rocket',
    category: 'objects',
    difficulty: 'medium',
    gridSize: 100,
    pieces: [
      {
        id: 'nose',
        type: 'triangle',
        color: 'red',
        correctPosition: { x: 35, y: 10 },
        correctRotation: 0,
        size: 30,
      },
      {
        id: 'body',
        type: 'rectangle',
        color: 'white',
        correctPosition: { x: 35, y: 35 },
        correctRotation: 90,
        size: 30,
      },
      // Fins
      {
        id: 'fin_l',
        type: 'triangle',
        color: 'red',
        correctPosition: { x: 20, y: 60 },
        correctRotation: 0,
        size: 20,
      },
      {
        id: 'fin_r',
        type: 'triangle',
        color: 'red',
        correctPosition: { x: 60, y: 60 },
        correctRotation: 0,
        size: 20,
      },
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
      // Body
      {
        id: 'body',
        type: 'rectangle',
        color: 'gray',
        correctPosition: { x: 45, y: 30 },
        correctRotation: 90,
        size: 10,
      },
      // Wings
      {
        id: 'wing_tl',
        type: 'triangle',
        color: 'pink',
        correctPosition: { x: 20, y: 20 },
        correctRotation: 270,
        size: 30,
      },
      {
        id: 'wing_tr',
        type: 'triangle',
        color: 'pink',
        correctPosition: { x: 50, y: 20 },
        correctRotation: 90,
        size: 30,
      },
      {
        id: 'wing_bl',
        type: 'triangle',
        color: 'purple',
        correctPosition: { x: 25, y: 50 },
        correctRotation: 270,
        size: 20,
      },
      {
        id: 'wing_br',
        type: 'triangle',
        color: 'purple',
        correctPosition: { x: 55, y: 50 },
        correctRotation: 90,
        size: 20,
      },
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
      // Tip (Triangle) - Visual (40,0) to (60,20)
      {
        id: 'blade_tip',
        type: 'triangle',
        color: 'white',
        correctPosition: { x: 40, y: 0 },
        correctRotation: 0,
        size: 20,
      },
      // Blade (Rotated Rect) - Visual (40,20) to (60,60)
      {
        id: 'blade',
        type: 'rectangle',
        color: 'white',
        correctPosition: { x: 30, y: 20 },
        correctRotation: 90,
        size: 40,
      },
      // Guard (crossbar) – y 40 so guard fits in grid (40+60=100)
      {
        id: 'guard',
        type: 'rectangle',
        color: 'gold',
        correctPosition: { x: 20, y: 40 },
        correctRotation: 0,
        size: 60,
      },
      // Hilt (handle) – below guard, centered at bottom
      {
        id: 'hilt',
        type: 'rectangle',
        color: 'brown',
        correctPosition: { x: 40, y: 80 },
        correctRotation: 90,
        size: 20,
      },
    ],
  },

  // ============ HARD (Premium & Complex) ============
  {
    id: 'crown',
    nameEt: 'Kroon',
    nameEn: 'Crown',
    category: 'objects',
    difficulty: 'hard',
    gridSize: 100,
    pieces: [
      // Base
      {
        id: 'base',
        type: 'rectangle',
        color: 'gold',
        correctPosition: { x: 20, y: 60 },
        correctRotation: 0,
        size: 60,
      },
      // Points
      {
        id: 'p_left',
        type: 'triangle',
        color: 'gold',
        correctPosition: { x: 20, y: 30 },
        correctRotation: 0,
        size: 30,
      },
      {
        id: 'p_mid',
        type: 'diamond',
        color: 'red',
        correctPosition: { x: 35, y: 10 },
        correctRotation: 0,
        size: 30,
      },
      {
        id: 'p_right',
        type: 'triangle',
        color: 'gold',
        correctPosition: { x: 50, y: 30 },
        correctRotation: 0,
        size: 30,
      },
    ],
  },
  {
    id: 'gem_cluster',
    nameEt: 'Juveel',
    nameEn: 'Gem',
    category: 'objects',
    difficulty: 'hard',
    gridSize: 100,
    pieces: [
      // Center
      {
        id: 'center',
        type: 'hexagon',
        color: 'cyan',
        correctPosition: { x: 35, y: 35 },
        correctRotation: 0,
        size: 30,
      },
      // Facets
      {
        id: 'f1',
        type: 'triangle',
        color: 'blue',
        correctPosition: { x: 35, y: 10 },
        correctRotation: 0,
        size: 20,
      },
      {
        id: 'f2',
        type: 'triangle',
        color: 'blue',
        correctPosition: { x: 60, y: 30 },
        correctRotation: 90,
        size: 20,
      },
      {
        id: 'f3',
        type: 'triangle',
        color: 'blue',
        correctPosition: { x: 40, y: 65 },
        correctRotation: 180,
        size: 20,
      },
      {
        id: 'f4',
        type: 'triangle',
        color: 'blue',
        correctPosition: { x: 15, y: 40 },
        correctRotation: 270,
        size: 20,
      },
    ],
  },
  {
    id: 'laptop',
    nameEt: 'Sülearvuti',
    nameEn: 'Laptop',
    category: 'objects',
    difficulty: 'hard',
    gridSize: 100,
    pieces: [
      // Screen
      {
        id: 'screen',
        type: 'rectangle',
        color: 'gray',
        correctPosition: { x: 25, y: 20 },
        correctRotation: 0,
        size: 50,
      },
      {
        id: 'display',
        type: 'rectangle',
        color: 'cyan',
        correctPosition: { x: 30, y: 25 },
        correctRotation: 0,
        size: 40,
      },
      // Keyboard base
      {
        id: 'base',
        type: 'rectangle',
        color: 'gray',
        correctPosition: { x: 20, y: 60 },
        correctRotation: 0,
        size: 60,
      },
    ],
  },
  {
    id: 'robot_fancy',
    nameEt: 'Robot',
    nameEn: 'Robot',
    category: 'objects',
    difficulty: 'hard',
    gridSize: 100,
    pieces: [
      {
        id: 'head',
        type: 'square',
        color: 'gray',
        correctPosition: { x: 35, y: 10 },
        correctRotation: 0,
        size: 30,
      },
      {
        id: 'eye',
        type: 'circle',
        color: 'cyan',
        correctPosition: { x: 45, y: 20 },
        correctRotation: 0,
        size: 10,
      },
      {
        id: 'body',
        type: 'square',
        color: 'blue',
        correctPosition: { x: 25, y: 40 },
        correctRotation: 0,
        size: 50,
      },
      {
        id: 'arm_l',
        type: 'rectangle',
        color: 'gray',
        correctPosition: { x: 5, y: 40 },
        correctRotation: 90,
        size: 30,
      },
      {
        id: 'arm_r',
        type: 'rectangle',
        color: 'gray',
        correctPosition: { x: 75, y: 40 },
        correctRotation: 90,
        size: 30,
      },
      {
        id: 'foot_l',
        type: 'rectangle',
        color: 'gray',
        correctPosition: { x: 25, y: 90 },
        correctRotation: 0,
        size: 20,
      },
      {
        id: 'foot_r',
        type: 'rectangle',
        color: 'gray',
        correctPosition: { x: 55, y: 90 },
        correctRotation: 0,
        size: 20,
      },
    ],
  },
];
