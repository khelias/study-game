import { describe, expect, it } from 'vitest';

import {
  boardPxToGridTopLeft,
  getPieceGridDimensions,
  gridPieceToPercent,
  pieceInBounds,
  snapGridTopLeftToTarget,
  sortByDistanceFromCenter,
} from '../shapeShiftGrid';

describe('shapeShiftGrid', () => {
  it('snaps board pixels to a bounded top-left grid position', () => {
    expect(boardPxToGridTopLeft(120, 180, 500, 10, 3)).toEqual({ x: 1, y: 2 });
    expect(boardPxToGridTopLeft(-50, -50, 500, 10, 3)).toEqual({ x: 0, y: 0 });
    expect(boardPxToGridTopLeft(560, 560, 500, 10, 3)).toEqual({ x: 7, y: 7 });
  });

  it('snaps rectangular board pixels using independent width and height', () => {
    expect(boardPxToGridTopLeft(250, 400, 500, 100, 80, 18)).toEqual({ x: 10, y: 71 });
  });

  it('resolves rectangular dimensions with legacy square fallback', () => {
    expect(getPieceGridDimensions({ size: 30 })).toEqual({ width: 30, height: 30 });
    expect(getPieceGridDimensions({ size: 70, width: 70, height: 18 })).toEqual({
      width: 70,
      height: 18,
    });
  });

  it('converts grid pieces to board percentages', () => {
    expect(gridPieceToPercent(2, 3, 4, 10)).toEqual({
      left: 20,
      top: 30,
      width: 40,
      height: 40,
    });
    expect(gridPieceToPercent(10, 20, 70, 100, 18)).toEqual({
      left: 10,
      top: 20,
      width: 70,
      height: 18,
    });
  });

  it('magnetically snaps near-correct drops to the matching target', () => {
    const targets = [
      {
        id: 'roof',
        type: 'triangle',
        color: 'red',
        correctPosition: { x: 25, y: 15 },
        size: 50,
      },
      {
        id: 'walls',
        type: 'square',
        color: 'white',
        correctPosition: { x: 35, y: 50 },
        size: 30,
      },
    ];
    const roofPiece = { id: 'roof', type: 'triangle', color: 'red', size: 50 };

    expect(snapGridTopLeftToTarget({ x: 31, y: 21 }, roofPiece, targets)).toEqual({
      x: 25,
      y: 15,
    });
    expect(
      snapGridTopLeftToTarget(
        { x: 27, y: 37 },
        { id: 'core', type: 'circle', color: 'yellow', size: 30 },
        [
          {
            id: 'core',
            type: 'circle',
            color: 'yellow',
            correctPosition: { x: 35, y: 35 },
            size: 30,
          },
        ],
      ),
    ).toEqual({
      x: 35,
      y: 35,
    });
    expect(
      snapGridTopLeftToTarget(
        { x: 52, y: 50 },
        { id: 'walls', type: 'square', color: 'white', size: 30 },
        targets,
      ),
    ).toEqual({
      x: 52,
      y: 50,
    });
    expect(
      snapGridTopLeftToTarget(
        { x: 31, y: 21 },
        { id: 'unknown', type: 'circle', color: 'blue', size: 50 },
        targets,
      ),
    ).toEqual({
      x: 31,
      y: 21,
    });
  });

  it('snaps interchangeable pieces to the nearest compatible target', () => {
    const rayPiece = { id: 'r_top', type: 'triangle', color: 'orange', size: 20 };
    const targets = [
      {
        id: 'r_top',
        type: 'triangle',
        color: 'orange',
        correctPosition: { x: 40, y: 10 },
        size: 20,
      },
      {
        id: 'r_bottom',
        type: 'triangle',
        color: 'orange',
        correctPosition: { x: 40, y: 70 },
        size: 20,
      },
    ];

    expect(snapGridTopLeftToTarget({ x: 41, y: 70 }, rayPiece, targets)).toEqual({
      x: 40,
      y: 70,
    });
  });

  it('sorts pieces from center toward outer cells', () => {
    const items = [
      { id: 'corner', pos: { x: 0, y: 0 }, size: 1 },
      { id: 'center', pos: { x: 4, y: 4 }, size: 2 },
      { id: 'edge', pos: { x: 0, y: 4 }, size: 1 },
    ];

    const sorted = sortByDistanceFromCenter(
      items,
      10,
      (item) => item.pos,
      (item) => item.size,
    );

    expect(sorted.map((item) => item.id)).toEqual(['center', 'edge', 'corner']);
    expect(items.map((item) => item.id)).toEqual(['corner', 'center', 'edge']);
  });

  it('validates grid bounds for square pieces', () => {
    expect(pieceInBounds(0, 0, 2, 10)).toBe(true);
    expect(pieceInBounds(8, 8, 2, 10)).toBe(true);
    expect(pieceInBounds(9, 8, 2, 10)).toBe(false);
    expect(pieceInBounds(-1, 0, 2, 10)).toBe(false);
    expect(pieceInBounds(15, 82, 70, 100, 18)).toBe(true);
    expect(pieceInBounds(15, 83, 70, 100, 18)).toBe(false);
  });
});
