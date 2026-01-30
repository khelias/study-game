/**
 * ShapeShiftView – Geometric puzzle: drag shapes onto the board to match the target.
 *
 * Grid layout (single source of truth):
 * - Board is a square (aspect-ratio 1), gs×gs cells. cellPct = 100/gs.
 * - Piece at grid (x,y) with size s: left = x*cellPct%, top = y*cellPct%, width/height = s*cellPct%.
 * - Drop: snap by piece center to logical grid via boardPxToGridTopLeft (high-res gs = 16–32).
 * - Piece scale: 1 so shapes fill their cell; edges meet at cell boundaries (no gaps).
 * - Draw order: center pieces first, then outer (by distance from center) so overlapping
 *   regions show the outer piece on top (e.g. star triangles on top of center square).
 * Feedback: success/wrong use global notifications (same as other games).
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { playSound } from '../../engine/audio';
import { useTranslation } from '../../i18n/useTranslation';
import { getLocale } from '../../i18n';
import { validateShapeShift } from '../../games/validators';
import type { ShapeShiftProblem, PieceState, ShapeType } from '../../types/game';

interface ShapeShiftViewProps {
  problem: ShapeShiftProblem;
  onAnswer: (isCorrect: boolean) => void;
  soundEnabled: boolean;
  level?: number;
}

const SHAPE_PATHS: Record<ShapeType, string> = {
  triangle: 'M25,0 L50,50 L0,50 Z',
  half_square: 'M0,0 L50,50 L0,50 Z',
  square: 'M0,0 L50,0 L50,50 L0,50 Z',
  rectangle: 'M0,0 L100,0 L100,50 L0,50 Z',
  diamond: 'M25,0 L50,25 L25,50 L0,25 Z',
  hexagon: 'M12.5,0 L37.5,0 L50,25 L37.5,50 L12.5,50 L0,25 Z',
  circle: 'M25,25 m-25,0 a25,25 0 1,0 50,0 a25,25 0 1,0 -50,0',
};

const COLOR_CLASSES: Record<string, string> = {
  red: '#ef4444',
  blue: '#3b82f6',
  green: '#22c55e',
  yellow: '#eab308',
  purple: '#a855f7',
  orange: '#f97316',
  pink: '#ec4899',
  cyan: '#06b6d4',
  brown: '#92400e',
  white: '#f8fafc',
  gold: '#fbbf24',
  gray: '#64748b',
};

const TAP_THRESHOLD_PX = 12;
const TAP_ON_BOARD_THRESHOLD_PX = 24; // larger so tap-to-rotate on board is reliable
const BOARD_MAX_WIDTH = '32rem'; // larger play area for finer placement
const PIECE_SCALE = 0.5; // shapes fill 50% of cell (centered)
const GHOST_FALLBACK_PX = 48; // used before board is measured
/** Tray content height (tray fixed height minus vertical padding); cap piece size so they stay inside */
const TRAY_CONTENT_MAX_PX = 72;

type DragState = {
  pieceId: string;
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
  /** Offset from pointer to piece center at drag start; drop uses piece center for snap */
  pointerOffsetX: number;
  pointerOffsetY: number;
};

function hapticDrop(): void {
  if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(10);
}

/**
 * Grid model: board is a square (gs×gs cells). Piece at (x,y) size s
 * occupies (x/gs, y/gs) to ((x+s)/gs, (y+s)/gs) in normalized [0,1].
 * Snap: pixel position → cell containing piece center → top-left of piece.
 */
function boardPxToGridTopLeft(
  rx: number,
  ry: number,
  boardWidthPx: number,
  gs: number,
  size: number
): { x: number; y: number } {
  const cellSizePx = boardWidthPx / gs;
  const centerCellX = Math.floor(rx / cellSizePx);
  const centerCellY = Math.floor(ry / cellSizePx);
  const gx = centerCellX - Math.floor((size - 1) / 2);
  const gy = centerCellY - Math.floor((size - 1) / 2);
  return {
    x: Math.max(0, Math.min(gx, gs - size)),
    y: Math.max(0, Math.min(gy, gs - size)),
  };
}

export const ShapeShiftView: React.FC<ShapeShiftViewProps> = ({
  problem,
  onAnswer,
  soundEnabled,
}) => {
  const t = useTranslation();
  const locale = getLocale();
  const boardRef = useRef<HTMLDivElement>(null);
  const trayRef = useRef<HTMLDivElement>(null);

  const [pieces, setPieces] = useState<PieceState[]>(() =>
    problem.pieces.map(p => ({ ...p }))
  );
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [drag, setDrag] = useState<DragState | null>(null);
  const [showHint, setShowHint] = useState(true);
  const [boardWidthPx, setBoardWidthPx] = useState(0);
  const boardRectRef = useRef<DOMRect | null>(null);

  const submittedUidRef = useRef<string | null>(null);
  const completionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dragJustEndedRef = useRef(false);
  const tapHandledInPerformDropRef = useRef(false);
  const dragRef = useRef<DragState | null>(null);
  const piecesRef = useRef(pieces);
  const statusRef = useRef(status);
  dragRef.current = drag;
  piecesRef.current = pieces;
  statusRef.current = status;

  // Reset on new problem and clear any pending completion timeout
  useEffect(() => {
    submittedUidRef.current = null;
    if (completionTimeoutRef.current) {
      clearTimeout(completionTimeoutRef.current);
      completionTimeoutRef.current = null;
    }
    setPieces(problem.pieces.map(p => ({ ...p })));
    setStatus('idle');
    setShowHint(true);
  }, [problem.uid, problem.pieces]);

  // Dismiss hint after delay
  useEffect(() => {
    if (!showHint) return;
    const id = setTimeout(() => setShowHint(false), 4000);
    return () => clearTimeout(id);
  }, [showHint]);

  // Completion: when all non-decoy pieces are placed, validate once and call onAnswer.
  // Timeout is stored in a ref so we don't clear it when status changes (effect re-runs and would cancel the timeout).
  useEffect(() => {
    if (status !== 'idle') return;
    if (submittedUidRef.current === problem.uid) return;
    const required = pieces.filter(p => !p.isDecoy);
    const allPlaced = required.every(p => p.currentPosition !== null);
    if (!allPlaced) return;

    submittedUidRef.current = problem.uid;
    const isCorrect = validateShapeShift(problem, pieces);
    setStatus(isCorrect ? 'correct' : 'wrong');
    playSound(isCorrect ? 'correct' : 'wrong', soundEnabled);

    const delay = isCorrect ? 1200 : 600;
    const problemSnapshot = problem;
    completionTimeoutRef.current = setTimeout(() => {
      completionTimeoutRef.current = null;
      onAnswer(isCorrect);
      setStatus('idle');
      if (!isCorrect) {
        setPieces(problemSnapshot.pieces.map(p => ({ ...p })));
      }
    }, delay);
    // Do NOT clear the timeout here when effect re-runs (e.g. when status changes).
    // Clearing it would cancel onAnswer and leave the game stuck in correct/wrong.
  }, [pieces, status, problem, soundEnabled, onAnswer]);

  // Clear completion timeout only when problem changes or on unmount
  useEffect(() => {
    return () => {
      if (completionTimeoutRef.current) {
        clearTimeout(completionTimeoutRef.current);
        completionTimeoutRef.current = null;
      }
    };
  }, [problem.uid]);

  // Measure board rect so ghost size and drop preview position are correct
  useEffect(() => {
    const el = boardRef.current;
    if (!el) return;
    const update = () => {
      const rect = el.getBoundingClientRect();
      boardRectRef.current = rect;
      setBoardWidthPx(rect.width);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const startDrag = useCallback(
    (pieceId: string, clientX: number, clientY: number, pointerOffsetX: number, pointerOffsetY: number) => {
      if (statusRef.current !== 'idle') return;
      setShowHint(false);
      setDrag({
        pieceId,
        startX: clientX,
        startY: clientY,
        currentX: clientX,
        currentY: clientY,
        pointerOffsetX,
        pointerOffsetY,
      });
    },
    []
  );

  const handleTapPiece = useCallback((pieceId: string) => {
    if (statusRef.current !== 'idle') return;
    if (dragJustEndedRef.current) {
      dragJustEndedRef.current = false;
      return;
    }
    setPieces(prev =>
      prev.map(p =>
        p.id === pieceId
          ? { ...p, currentRotation: (p.currentRotation + 90) % 360 }
          : p
      )
    );
    playSound('tap', soundEnabled);
  }, [soundEnabled]);

  const onPieceClick = useCallback(
    (pieceId: string) => {
      if (tapHandledInPerformDropRef.current) {
        tapHandledInPerformDropRef.current = false;
        return;
      }
      handleTapPiece(pieceId);
    },
    [handleTapPiece]
  );

  const performDrop = useCallback((clientX: number, clientY: number) => {
    const d = dragRef.current;
    if (!d) return;
    setDrag(null);
    const moved = Math.hypot(clientX - d.startX, clientY - d.startY);
    const piece = piecesRef.current.find(p => p.id === d.pieceId);
    const dropX = clientX - d.pointerOffsetX;
    const dropY = clientY - d.pointerOffsetY;
    let placed = false;
    let scheduledTap = false;

    // Tap-to-rotate: small movement → rotate (ignore release point)
    if (piece?.currentPosition != null && moved < TAP_ON_BOARD_THRESHOLD_PX) {
      tapHandledInPerformDropRef.current = true;
      scheduledTap = true;
      setTimeout(() => handleTapPiece(d.pieceId), 10);
      placed = true;
    } else if (piece?.currentPosition == null && moved < TAP_THRESHOLD_PX) {
      tapHandledInPerformDropRef.current = true;
      scheduledTap = true;
      setTimeout(() => handleTapPiece(d.pieceId), 10);
      placed = true;
    } else if (trayRef.current) {
      const trayRect = trayRef.current.getBoundingClientRect();
      const inTray =
        dropX >= trayRect.left && dropX <= trayRect.right &&
        dropY >= trayRect.top && dropY <= trayRect.bottom;
      if (inTray) {
        setPieces(prev =>
          prev.map(p => (p.id === d.pieceId ? { ...p, currentPosition: null } : p))
        );
        placed = true;
      }
    }

    if (!placed && boardRef.current) {
      const rect = boardRef.current.getBoundingClientRect();
      const rx = dropX - rect.left;
      const ry = dropY - rect.top;
      const gs = problem.puzzle.gridSize;
      const cellSizePx = rect.width / gs;
      const margin = cellSizePx * 0.5; // half a logical cell
      const onBoard =
        rx >= -margin && rx <= rect.width + margin &&
        ry >= -margin && ry <= rect.height + margin;

      if (onBoard) {
        const size = piece?.size ?? 1;
        const { x: cx, y: cy } = boardPxToGridTopLeft(rx, ry, rect.width, gs, size);
        setPieces(prev =>
          prev.map(p =>
            p.id === d.pieceId ? { ...p, currentPosition: { x: cx, y: cy } } : p
          )
        );
        playSound('tap', soundEnabled);
        hapticDrop();
        placed = true;
      } else {
        setPieces(prev =>
          prev.map(p => (p.id === d.pieceId ? { ...p, currentPosition: null } : p))
        );
        placed = true;
      }
    }

    if (!placed && moved < TAP_THRESHOLD_PX) {
      tapHandledInPerformDropRef.current = true;
      scheduledTap = true;
      setTimeout(() => handleTapPiece(d.pieceId), 10);
    }
    if (!scheduledTap) {
      dragJustEndedRef.current = true;
    }
  }, [problem.puzzle.gridSize, soundEnabled, handleTapPiece]);

  // Native document capture: start drag on any piece (tray or board)
  useEffect(() => {
    const onStart = (e: MouseEvent | PointerEvent | TouchEvent) => {
      if (statusRef.current !== 'idle') return;
      const el = (e.target as HTMLElement).closest?.('[data-shape-piece]');
      if (!el) return;
      const pieceId = (el as HTMLElement).getAttribute('data-piece-id');
      if (!pieceId) return;
      e.preventDefault();
      e.stopPropagation();
      let x: number, y: number;
      if ('touches' in e && e.touches.length > 0) {
        x = e.touches[0].clientX;
        y = e.touches[0].clientY;
      } else if ('clientX' in e) {
        x = e.clientX;
        y = e.clientY;
      } else return;
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const pointerOffsetX = x - centerX;
      const pointerOffsetY = y - centerY;
      startDrag(pieceId, x, y, pointerOffsetX, pointerOffsetY);
    };
    document.addEventListener('mousedown', onStart, true);
    document.addEventListener('pointerdown', onStart, true);
    document.addEventListener('touchstart', onStart, { capture: true, passive: false });
    return () => {
      document.removeEventListener('mousedown', onStart, true);
      document.removeEventListener('pointerdown', onStart, true);
      document.removeEventListener('touchstart', onStart, true);
    };
  }, [startDrag]);

  // Window: move and end drag
  useEffect(() => {
    if (!drag) return;
    const onMove = (e: PointerEvent | MouseEvent | TouchEvent) => {
      if (!dragRef.current) return;
      let x: number, y: number;
      if ('touches' in e && e.touches.length > 0) {
        x = e.touches[0].clientX;
        y = e.touches[0].clientY;
        e.preventDefault();
      } else if ('clientX' in e) {
        x = e.clientX;
        y = e.clientY;
        if (e instanceof PointerEvent && e.pointerType === 'touch') e.preventDefault();
      } else return;
      setDrag(prev => prev ? { ...prev, currentX: x, currentY: y } : null);
    };
    const onEnd = (e: PointerEvent | MouseEvent | TouchEvent) => {
      let x: number, y: number;
      if ('changedTouches' in e && e.changedTouches.length > 0) {
        x = e.changedTouches[0].clientX;
        y = e.changedTouches[0].clientY;
      } else if ('clientX' in e) {
        x = e.clientX;
        y = e.clientY;
      } else return;
      performDrop(x, y);
    };
    window.addEventListener('pointermove', onMove, { passive: false });
    window.addEventListener('pointerup', onEnd);
    window.addEventListener('pointercancel', onEnd);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onEnd);
    window.addEventListener('touchmove', onMove, { passive: false });
    window.addEventListener('touchend', onEnd);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onEnd);
      window.removeEventListener('pointercancel', onEnd);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onEnd);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onEnd);
    };
  }, [drag?.pieceId, performDrop]);

  const unplaced = pieces.filter(p => p.currentPosition === null);
  const placed = pieces.filter(p => p.currentPosition !== null);
  const draggingPiece = drag ? pieces.find(p => p.id === drag.pieceId) : null;
  const puzzleName = locale === 'et' ? problem.puzzle.nameEt : problem.puzzle.nameEn;
  const gs = problem.puzzle.gridSize;
  const cellPct = 100 / gs;

  // Draw order: center pieces first so outer pieces (e.g. star triangles) render on top at shared edges
  const boardCenter = (gs - 1) / 2;
  const placedSorted = [...placed].sort((a, b) => {
    const acx = a.currentPosition!.x + (a.size - 1) / 2;
    const acy = a.currentPosition!.y + (a.size - 1) / 2;
    const bcx = b.currentPosition!.x + (b.size - 1) / 2;
    const bcy = b.currentPosition!.y + (b.size - 1) / 2;
    const da = (acx - boardCenter) ** 2 + (acy - boardCenter) ** 2;
    const db = (bcx - boardCenter) ** 2 + (bcy - boardCenter) ** 2;
    return da - db;
  });

  // Ghost size = same as placed piece on board (cell size × piece size × scale)
  const ghostSizePx =
    draggingPiece && boardWidthPx > 0
      ? (boardWidthPx / gs) * draggingPiece.size * PIECE_SCALE
      : GHOST_FALLBACK_PX;

  return (
    <div className="w-full flex flex-col items-center px-2 sm:px-4 max-w-2xl mx-auto pt-2 sm:pt-4 animate-in fade-in duration-300">
      {/* Drag ghost – follows piece center so drop lands where you see it (no offset) */}
      {draggingPiece && drag && (
        <div
          className="fixed pointer-events-none z-[100]"
          style={{
            left: drag.currentX - drag.pointerOffsetX,
            top: drag.currentY - drag.pointerOffsetY,
            width: ghostSizePx,
            height: ghostSizePx,
            transform: 'translate(-50%, -50%)',
          }}
        >
          <div className="w-full h-full drop-shadow-lg" style={{ transform: `rotate(${draggingPiece.currentRotation}deg)` }}>
            <svg viewBox={draggingPiece.type === 'rectangle' ? '0 0 100 50' : '0 0 50 50'} className="w-full h-full" preserveAspectRatio={draggingPiece.type === 'rectangle' ? 'xMidYMid meet' : 'none'}>
              <path
                d={SHAPE_PATHS[draggingPiece.type]}
                fill={COLOR_CLASSES[draggingPiece.color] ?? COLOR_CLASSES.gray}
                stroke={draggingPiece.color === 'white' ? '#cbd5e1' : 'none'}
                strokeWidth={draggingPiece.color === 'white' ? 2 : 0}
              />
            </svg>
          </div>
        </div>
      )}

      <header className="mb-2 text-center">
        <h2 className="text-lg sm:text-xl font-bold text-slate-700">{puzzleName}</h2>
      </header>

      {/* Board – larger play area */}
      <div
        ref={boardRef}
        className="relative bg-slate-100 rounded-2xl border-2 border-dashed border-slate-300 overflow-hidden flex-shrink-0 select-none"
        style={{
          width: `min(96vw, ${BOARD_MAX_WIDTH})`,
          aspectRatio: '1',
          touchAction: 'none',
        }}
      >
        {placedSorted.map(piece => {
          const pos = piece.currentPosition!;
          const isDragging = drag?.pieceId === piece.id;
          const leftPct = (pos.x / gs) * 100;
          const topPct = (pos.y / gs) * 100;
          const sizePct = (piece.size / gs) * 100;
          return (
            <div
              key={piece.id}
              data-shape-piece
              data-piece-id={piece.id}
              role="button"
              tabIndex={0}
              className={`absolute flex items-center justify-center cursor-grab active:cursor-grabbing touch-none transition-transform duration-200 ${
                isDragging ? 'opacity-40 pointer-events-none' : ''
              }`}
              style={{
                left: `${leftPct}%`,
                top: `${topPct}%`,
                width: `${sizePct}%`,
                height: `${sizePct}%`,
                transform: `rotate(${piece.currentRotation}deg)`,
              }}
              onClick={() => onPieceClick(piece.id)}
            >
              <div className="pointer-events-none w-full h-full flex items-center justify-center">
                <div style={{ width: `${PIECE_SCALE * 100}%`, height: `${PIECE_SCALE * 100}%` }} className="flex-shrink-0">
                  <svg viewBox={piece.type === 'rectangle' ? '0 0 100 50' : '0 0 50 50'} className="w-full h-full" preserveAspectRatio={piece.type === 'rectangle' ? 'xMidYMid meet' : 'none'}>
                    <path
                      d={SHAPE_PATHS[piece.type]}
                      fill={COLOR_CLASSES[piece.color] ?? COLOR_CLASSES.gray}
                      stroke={piece.color === 'white' ? '#cbd5e1' : 'none'}
                      strokeWidth={piece.color === 'white' ? 2 : 0}
                    />
                  </svg>
                </div>
              </div>
            </div>
          );
        })}

      </div>

      <p className="mt-3 mb-2 text-xs sm:text-sm text-slate-500 text-center" role="status">
        {t.games.shape_shift.instructions[problem.mode]}
      </p>

      {showHint && unplaced.length > 0 && (
        <p className="mb-2 text-xs sm:text-sm text-teal-600 font-medium text-center" role="status">
          {t.games.shape_shift.dragHint}
        </p>
      )}

      {/* Tray – fixed-size drop zone; pieces capped so they stay inside */}
      <div
        ref={trayRef}
        className="flex flex-wrap justify-center items-center gap-2 w-[min(96vw,32rem)] h-24 py-2 px-3 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/80 flex-shrink-0 overflow-hidden"
      >
        {unplaced.map(piece => {
          const isDragging = drag?.pieceId === piece.id;
          const rawSize =
            boardWidthPx > 0 ? (boardWidthPx / gs) * piece.size * PIECE_SCALE : GHOST_FALLBACK_PX;
          const trayPieceSizePx = Math.min(rawSize, TRAY_CONTENT_MAX_PX);
          return (
            <div
              key={piece.id}
              data-shape-piece
              data-piece-id={piece.id}
              role="button"
              tabIndex={0}
              className={`relative cursor-grab active:cursor-grabbing rounded-lg border-2 border-slate-200 bg-white p-1 touch-none flex items-center justify-center flex-shrink-0 ${
                isDragging ? 'opacity-40 pointer-events-none' : ''
              }`}
              style={{
                touchAction: 'none',
                width: trayPieceSizePx,
                height: trayPieceSizePx,
              }}
              onClick={() => onPieceClick(piece.id)}
            >
              <svg
                viewBox={piece.type === 'rectangle' ? '0 0 100 50' : '0 0 50 50'}
                className="w-full h-full pointer-events-none"
                preserveAspectRatio={piece.type === 'rectangle' ? 'xMidYMid meet' : 'none'}
                style={{ transform: `rotate(${piece.currentRotation}deg)` }}
              >
                <path
                  d={SHAPE_PATHS[piece.type]}
                  fill={COLOR_CLASSES[piece.color] ?? COLOR_CLASSES.gray}
                  stroke={piece.color === 'white' ? '#cbd5e1' : 'none'}
                  strokeWidth={piece.color === 'white' ? 2 : 0}
                />
              </svg>
            </div>
          );
        })}
      </div>

      <p className="mt-2 text-xs text-slate-500 text-center">
        {t.games.shape_shift.dragToPlace}. {t.games.shape_shift.tapToRotate}.
      </p>
    </div>
  );
};
