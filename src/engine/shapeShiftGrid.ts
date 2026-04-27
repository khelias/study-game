/**
 * Shape Shift – Grid coordinate model and layout
 *
 * CONTRACT (single source of truth):
 * - Grid: gridSize × gridSize cells. Indices 0 .. gridSize-1.
 * - Piece: (x, y) = top-left cell; size is square fallback, width/height can override.
 *   Bounds: 0 ≤ x, y and x + width ≤ gridSize, y + height ≤ gridSize.
 * - Layout: ONLY gridPieceToPercent(x, y, size, gridSize) converts grid → CSS %.
 *   Used for: placed pieces on board, outline overlay, and (for size) ghost/tray.
 *   No scaling or margin inside this function.
 * - Snap: boardPxToGridTopLeft(rx, ry, boardWidthPx, gridSize, pieceSize) for drop.
 * - Validator: tolerant position matching and rotation symmetry. Outline uses same target data.
 */

export interface GridPosition {
  x: number;
  y: number;
}

export interface GridDimensions {
  width: number;
  height: number;
}

export interface ShapeShiftSizedPiece {
  size: number;
  width?: number;
  height?: number;
}

export interface ShapeShiftSnapTarget {
  id: string;
  type: string;
  color: string;
  correctPosition: GridPosition;
  size: number;
  width?: number;
  height?: number;
  isDecoy?: boolean;
}

export interface ShapeShiftSnapPiece extends ShapeShiftSizedPiece {
  id: string;
  type: string;
  color: string;
  isDecoy?: boolean;
}

export function getPieceGridDimensions(piece: ShapeShiftSizedPiece): GridDimensions {
  return {
    width: piece.width ?? piece.size,
    height: piece.height ?? piece.size,
  };
}

export function shapeShiftPiecesCompatible(
  piece: ShapeShiftSnapPiece,
  target: ShapeShiftSnapTarget,
): boolean {
  if (piece.isDecoy || target.isDecoy) return false;
  if (piece.id === target.id) return true;

  const pieceDims = getPieceGridDimensions(piece);
  const targetDims = getPieceGridDimensions(target);

  return (
    piece.type === target.type &&
    piece.color === target.color &&
    pieceDims.width === targetDims.width &&
    pieceDims.height === targetDims.height
  );
}

/**
 * Convert board-relative pixel (rx, ry) and piece size to piece top-left in grid.
 * Uses round so dropping near a cell boundary snaps to the nearest cell (more leeway).
 */
export function boardPxToGridTopLeft(
  rx: number,
  ry: number,
  boardWidthPx: number,
  gridSize: number,
  pieceWidth: number,
  pieceHeight = pieceWidth,
): GridPosition {
  const cellSizePx = boardWidthPx / gridSize;
  const centerCellX = rx / cellSizePx;
  const centerCellY = ry / cellSizePx;
  const gx = Math.round(centerCellX - pieceWidth / 2);
  const gy = Math.round(centerCellY - pieceHeight / 2);
  return {
    x: Math.max(0, Math.min(gx, gridSize - pieceWidth)),
    y: Math.max(0, Math.min(gy, gridSize - pieceHeight)),
  };
}

/**
 * Magnetically snap a dropped piece to its intended target when it lands close enough.
 * Shape Shift puzzles use a 100-unit design grid, so exact top-left placement is too
 * strict for touch input. This keeps free placement possible while making near-correct
 * drops feel intentional.
 */
export function snapGridTopLeftToTarget(
  rawPosition: GridPosition,
  piece: ShapeShiftSnapPiece,
  targets: ShapeShiftSnapTarget[],
): GridPosition {
  let bestMatch: { target: ShapeShiftSnapTarget; distance: number } | null = null;

  for (const target of targets) {
    if (!shapeShiftPiecesCompatible(piece, target)) continue;

    const { width, height } = getPieceGridDimensions(target);
    const threshold = Math.min(18, Math.max(4, Math.round(Math.max(width, height) * 0.4)));
    const distance = Math.hypot(
      rawPosition.x - target.correctPosition.x,
      rawPosition.y - target.correctPosition.y,
    );

    if (distance > threshold) continue;
    if (!bestMatch || distance < bestMatch.distance) {
      bestMatch = { target, distance };
    }
  }

  return bestMatch ? { ...bestMatch.target.correctPosition } : rawPosition;
}

/**
 * Piece position and size as percentage of grid. Single layout formula for board and outline.
 * Returns { left, top, width, height } in % for CSS.
 */
export function gridPieceToPercent(
  x: number,
  y: number,
  width: number,
  gridSize: number,
  height = width,
): { left: number; top: number; width: number; height: number } {
  return {
    left: (x / gridSize) * 100,
    top: (y / gridSize) * 100,
    width: (width / gridSize) * 100,
    height: (height / gridSize) * 100,
  };
}

/**
 * Sort by distance from grid center (draw order: center first, outer on top).
 */
export function sortByDistanceFromCenter<T>(
  items: T[],
  gridSize: number,
  getPosition: (item: T) => GridPosition,
  getWidth: (item: T) => number,
  getHeight: (item: T) => number = getWidth,
): T[] {
  const center = (gridSize - 1) / 2;
  return [...items].sort((a, b) => {
    const acx = getPosition(a).x + getWidth(a) / 2;
    const acy = getPosition(a).y + getHeight(a) / 2;
    const bcx = getPosition(b).x + getWidth(b) / 2;
    const bcy = getPosition(b).y + getHeight(b) / 2;
    const da = (acx - center) ** 2 + (acy - center) ** 2;
    const db = (bcx - center) ** 2 + (bcy - center) ** 2;
    return da - db;
  });
}

/** True if piece (x, y, width, height) fits inside grid. */
export function pieceInBounds(
  x: number,
  y: number,
  width: number,
  gridSize: number,
  height = width,
): boolean {
  return x >= 0 && y >= 0 && x + width <= gridSize && y + height <= gridSize;
}
