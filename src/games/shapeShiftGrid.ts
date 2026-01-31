/**
 * Shape Shift – Grid coordinate model and layout
 *
 * CONTRACT (single source of truth):
 * - Grid: gridSize × gridSize cells. Indices 0 .. gridSize-1.
 * - Piece: (x, y) = top-left cell; size = width and height in cells.
 *   Bounds: 0 ≤ x, y and x + size ≤ gridSize, y + size ≤ gridSize.
 * - Layout: ONLY gridPieceToPercent(x, y, size, gridSize) converts grid → CSS %.
 *   Used for: placed pieces on board, outline overlay, and (for size) ghost/tray.
 *   No scaling or margin inside this function.
 * - Snap: boardPxToGridTopLeft(rx, ry, boardWidthPx, gridSize, pieceSize) for drop.
 * - Validator: exact (x, y) and rotation. Outline uses same correctPosition/size/rotation.
 */

export interface GridPosition {
  x: number;
  y: number;
}

/**
 * Convert board-relative pixel (rx, ry) and piece size to piece top-left in grid.
 * Used when dropping a piece onto the board. Center of drop → cell → top-left clamped.
 */
export function boardPxToGridTopLeft(
  rx: number,
  ry: number,
  boardWidthPx: number,
  gridSize: number,
  pieceSize: number
): GridPosition {
  const cellSizePx = boardWidthPx / gridSize;
  const centerCellX = Math.floor(rx / cellSizePx);
  const centerCellY = Math.floor(ry / cellSizePx);
  const half = Math.floor((pieceSize - 1) / 2);
  const gx = centerCellX - half;
  const gy = centerCellY - half;
  return {
    x: Math.max(0, Math.min(gx, gridSize - pieceSize)),
    y: Math.max(0, Math.min(gy, gridSize - pieceSize)),
  };
}

/**
 * Piece position and size as percentage of grid. Single layout formula for board and outline.
 * Returns { left, top, width, height } in % for CSS.
 */
export function gridPieceToPercent(
  x: number,
  y: number,
  size: number,
  gridSize: number
): { left: number; top: number; width: number; height: number } {
  return {
    left: (x / gridSize) * 100,
    top: (y / gridSize) * 100,
    width: (size / gridSize) * 100,
    height: (size / gridSize) * 100,
  };
}

/**
 * Sort by distance from grid center (draw order: center first, outer on top).
 */
export function sortByDistanceFromCenter<T>(
  items: T[],
  gridSize: number,
  getPosition: (item: T) => GridPosition,
  getSize: (item: T) => number
): T[] {
  const center = (gridSize - 1) / 2;
  return [...items].sort((a, b) => {
    const acx = getPosition(a).x + (getSize(a) - 1) / 2;
    const acy = getPosition(a).y + (getSize(a) - 1) / 2;
    const bcx = getPosition(b).x + (getSize(b) - 1) / 2;
    const bcy = getPosition(b).y + (getSize(b) - 1) / 2;
    const da = (acx - center) ** 2 + (acy - center) ** 2;
    const db = (bcx - center) ** 2 + (bcy - center) ** 2;
    return da - db;
  });
}

/** True if piece (x, y, size) fits inside grid. */
export function pieceInBounds(
  x: number,
  y: number,
  size: number,
  gridSize: number
): boolean {
  return (
    x >= 0 &&
    y >= 0 &&
    x + size <= gridSize &&
    y + size <= gridSize
  );
}
