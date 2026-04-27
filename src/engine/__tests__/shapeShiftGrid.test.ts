import { describe, expect, it } from 'vitest';

import {
  boardPxToGridTopLeft,
  gridPieceToPercent,
  pieceInBounds,
  sortByDistanceFromCenter,
} from '../shapeShiftGrid';

describe('shapeShiftGrid', () => {
  it('snaps board pixels to a bounded top-left grid position', () => {
    expect(boardPxToGridTopLeft(120, 180, 500, 10, 3)).toEqual({ x: 1, y: 3 });
    expect(boardPxToGridTopLeft(-50, -50, 500, 10, 3)).toEqual({ x: 0, y: 0 });
    expect(boardPxToGridTopLeft(560, 560, 500, 10, 3)).toEqual({ x: 7, y: 7 });
  });

  it('converts grid pieces to board percentages', () => {
    expect(gridPieceToPercent(2, 3, 4, 10)).toEqual({
      left: 20,
      top: 30,
      width: 40,
      height: 40,
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
  });
});
