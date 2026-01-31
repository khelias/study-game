/**
 * ShapeShiftView – Geometric puzzle: drag shapes onto the board to match the target.
 *
 * Full rewrite: single layout formula from src/games/shapeShiftGrid.ts.
 * - Board and outline: gridPieceToPercent(x, y, size, gridSize) only. No scaling.
 * - Outline uses same puzzle.correctPosition / size / correctRotation as validator.
 * - Ghost and tray size: (boardWidthPx / gridSize) * piece.size (capped for tray).
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { playSound } from '../../engine/audio';
import { useTranslation } from '../../i18n/useTranslation';
import { getLocale } from '../../i18n';
import { validateShapeShift } from '../../games/validators';
import {
  boardPxToGridTopLeft,
  gridPieceToPercent,
  sortByDistanceFromCenter,
} from '../../games/shapeShiftGrid';
import { usePlaySessionStore } from '../../stores/playSessionStore';
import type { ShapeShiftProblem, PieceState, ShapeType } from '../../types/game';

// ─── Constants ─────────────────────────────────────────────────────────────

const OUTLINE_BASE_COST = 1;
const PLACE_PIECE_BASE_COST = 2;
const OUTLINE_DURATION_MS = 12_000;

const TAP_THRESHOLD_PX = 12;
const TAP_ON_BOARD_THRESHOLD_PX = 24;
const BOARD_MAX_WIDTH = '48rem';
const GHOST_FALLBACK_PX = 48;
const TRAY_CONTENT_MAX_PX = 40;

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

// ─── Types ──────────────────────────────────────────────────────────────────

interface ShapeShiftViewProps {
  problem: ShapeShiftProblem;
  onAnswer: (isCorrect: boolean) => void;
  soundEnabled: boolean;
  level?: number;
  stars?: number;
  spendStars?: (count: number) => boolean;
}

type DragState = {
  pieceId: string;
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
  pointerOffsetX: number;
  pointerOffsetY: number;
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function hapticDrop(): void {
  if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(10);
}

function PieceSvg({
  type,
  color,
  rotation,
  className = '',
  opacity = 1,
}: {
  type: ShapeType;
  color: string;
  rotation: number;
  className?: string;
  opacity?: number;
}) {
  const viewBox = type === 'rectangle' ? '0 0 100 50' : '0 0 50 50';
  const preserveAspectRatio = type === 'rectangle' ? 'xMidYMid meet' : 'none';
  const fill = COLOR_CLASSES[color] ?? COLOR_CLASSES.gray;
  const stroke = color === 'white' ? '#cbd5e1' : 'none';
  const strokeWidth = color === 'white' ? 2 : 0;
  return (
    <svg
      viewBox={viewBox}
      className={className}
      preserveAspectRatio={preserveAspectRatio}
      style={{ transform: `rotate(${rotation}deg)`, opacity }}
    >
      <path d={SHAPE_PATHS[type]} fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
    </svg>
  );
}

// ─── Component ──────────────────────────────────────────────────────────────

export const ShapeShiftView: React.FC<ShapeShiftViewProps> = ({
  problem,
  onAnswer,
  soundEnabled,
  stars = 0,
  spendStars,
}) => {
  const t = useTranslation();
  const locale = getLocale();
  const addNotification = usePlaySessionStore(state => state.addNotification);
  const boardRef = useRef<HTMLDivElement>(null);
  const trayRef = useRef<HTMLDivElement>(null);

  const [pieces, setPieces] = useState<PieceState[]>(() =>
    problem.pieces.map(p => ({ ...p }))
  );
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [drag, setDrag] = useState<DragState | null>(null);
  const [showHint, setShowHint] = useState(true);
  const [boardWidthPx, setBoardWidthPx] = useState(0);
  const [showOutlineOverlay, setShowOutlineOverlay] = useState(false);
  const [outlineUseCount, setOutlineUseCount] = useState(0);
  const [placePieceUseCount, setPlacePieceUseCount] = useState(0);

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

  const gs = problem.puzzle.gridSize;
  const outlineCost = OUTLINE_BASE_COST + outlineUseCount;
  const placePieceCost = PLACE_PIECE_BASE_COST + placePieceUseCount;

  // ─── Effects ──────────────────────────────────────────────────────────────

  useEffect(() => {
    submittedUidRef.current = null;
    setShowOutlineOverlay(false);
    setOutlineUseCount(0);
    setPlacePieceUseCount(0);
    if (completionTimeoutRef.current) {
      clearTimeout(completionTimeoutRef.current);
      completionTimeoutRef.current = null;
    }
    setPieces(problem.pieces.map(p => ({ ...p })));
    setStatus('idle');
    setShowHint(true);
  }, [problem.uid, problem.pieces]);

  useEffect(() => {
    if (!showHint) return;
    const id = setTimeout(() => setShowHint(false), 4000);
    return () => clearTimeout(id);
  }, [showHint]);

  useEffect(() => {
    if (!showOutlineOverlay) return;
    const id = setTimeout(() => setShowOutlineOverlay(false), OUTLINE_DURATION_MS);
    return () => clearTimeout(id);
  }, [showOutlineOverlay]);

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
  }, [pieces, status, problem, soundEnabled, onAnswer]);

  useEffect(() => {
    return () => {
      if (completionTimeoutRef.current) {
        clearTimeout(completionTimeoutRef.current);
        completionTimeoutRef.current = null;
      }
    };
  }, [problem.uid]);

  useEffect(() => {
    const el = boardRef.current;
    if (!el) return;
    const update = () => setBoardWidthPx(el.getBoundingClientRect().width);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // ─── Callbacks ───────────────────────────────────────────────────────────

  const handleOutlineHint = useCallback(() => {
    if (!spendStars || stars < outlineCost) {
      if (stars < outlineCost && spendStars) {
        addNotification({ type: 'hint', message: t.shop.notEnoughStars });
      }
      return;
    }
    if (!spendStars(outlineCost)) return;
    setOutlineUseCount(c => c + 1);
    setShowOutlineOverlay(true);
    playSound('tap', soundEnabled);
  }, [spendStars, stars, outlineCost, soundEnabled, addNotification, t.shop.notEnoughStars]);

  const handlePlacePieceHint = useCallback(() => {
    const unplaced = pieces.filter(p => !p.isDecoy && p.currentPosition === null);
    if (unplaced.length === 0) return;
    if (!spendStars || stars < placePieceCost) {
      if (stars < placePieceCost && spendStars) {
        addNotification({ type: 'hint', message: t.shop.notEnoughStars });
      }
      return;
    }
    const template = problem.puzzle.pieces.find(p => p.id === unplaced[0].id);
    if (!template) return;
    if (!spendStars(placePieceCost)) return;
    setPlacePieceUseCount(c => c + 1);
    setPieces(prev =>
      prev.map(p =>
        p.id === template.id
          ? {
              ...p,
              currentPosition: { ...template.correctPosition },
              currentRotation: template.correctRotation,
            }
          : p
      )
    );
    playSound('tap', soundEnabled);
  }, [spendStars, stars, placePieceCost, pieces, problem.puzzle.pieces, soundEnabled, addNotification, t.shop.notEnoughStars]);

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
      const cellSizePx = rect.width / gs;
      const margin = cellSizePx * 0.5;
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
  }, [gs, soundEnabled, handleTapPiece]);

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
      startDrag(pieceId, x, y, x - centerX, y - centerY);
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

  // ─── Derived ──────────────────────────────────────────────────────────────

  const unplaced = pieces.filter(p => p.currentPosition === null);
  const placed = pieces.filter(p => p.currentPosition !== null);
  const draggingPiece = drag ? pieces.find(p => p.id === drag.pieceId) : null;
  const puzzleName = locale === 'et' ? problem.puzzle.nameEt : problem.puzzle.nameEn;

  const placedSorted = sortByDistanceFromCenter(
    placed,
    gs,
    p => p.currentPosition!,
    p => p.size
  );

  /** Outline = same data as validator: puzzle.pieces (non-decoy) correctPosition/size/rotation */
  const outlinePieces = problem.puzzle.pieces.filter(p => !p.isDecoy);
  const outlinePiecesSorted = sortByDistanceFromCenter(
    outlinePieces,
    gs,
    p => p.correctPosition,
    p => p.size
  );

  /** Ghost size: same formula as board cell size × piece size */
  const ghostSizePx =
    draggingPiece && boardWidthPx > 0
      ? (boardWidthPx / gs) * draggingPiece.size
      : GHOST_FALLBACK_PX;

  /** Tray piece size: same formula, capped */
  const trayPieceSizePx = (pieceSize: number) =>
    boardWidthPx > 0
      ? Math.min((boardWidthPx / gs) * pieceSize, TRAY_CONTENT_MAX_PX)
      : GHOST_FALLBACK_PX;

  // ─── Render ──────────────────────────────────────────────────────────────

  return (
    <div className="w-full flex flex-col items-center px-2 sm:px-4 max-w-2xl mx-auto pt-2 sm:pt-4 animate-in fade-in duration-300">
      {/* Drag ghost – same size as on board */}
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
          <div className="w-full h-full drop-shadow-lg">
            <PieceSvg
              type={draggingPiece.type}
              color={draggingPiece.color}
              rotation={draggingPiece.currentRotation}
              className="w-full h-full"
            />
          </div>
        </div>
      )}

      <header className="mb-2 text-center">
        <h2 className="text-lg sm:text-xl font-bold text-slate-700">{puzzleName}</h2>
      </header>

      {/* Board – grid fills area; layout from gridPieceToPercent only */}
      <div
        className="relative bg-slate-100 rounded-2xl border-2 border-dashed border-slate-300 overflow-hidden flex-shrink-0 select-none"
        style={{
          width: `min(96vw, ${BOARD_MAX_WIDTH})`,
          aspectRatio: '1',
          touchAction: 'none',
        }}
      >
        <div ref={boardRef} className="absolute inset-0 rounded-xl overflow-hidden">
          {/* Outline overlay – same positions/sizes/rotations as validator */}
          {showOutlineOverlay && (
            <div
              role="button"
              tabIndex={0}
              className="absolute inset-0 z-20 rounded-lg cursor-pointer bg-slate-300/30 focus:outline-none focus:ring-2 focus:ring-teal-400"
              style={{ top: 0, right: 0, bottom: 0, left: 0 }}
              onClick={() => setShowOutlineOverlay(false)}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setShowOutlineOverlay(false);
                }
              }}
              aria-label={t.games.shape_shift.hintOutlineUsed}
            >
              <div className="absolute inset-0 pointer-events-none">
                {outlinePiecesSorted.map(required => {
                  const pct = gridPieceToPercent(
                    required.correctPosition.x,
                    required.correctPosition.y,
                    required.size,
                    gs
                  );
                  return (
                    <div
                      key={required.id}
                      className="absolute w-full h-full opacity-50"
                      style={{
                        left: `${pct.left}%`,
                        top: `${pct.top}%`,
                        width: `${pct.width}%`,
                        height: `${pct.height}%`,
                        transform: `rotate(${required.correctRotation}deg)`,
                      }}
                    >
                      <PieceSvg
                        type={required.type as ShapeType}
                        color={required.color}
                        rotation={required.correctRotation}
                        className="w-full h-full"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Placed pieces – same layout formula */}
          {placedSorted.map(piece => {
            const pos = piece.currentPosition!;
            const pct = gridPieceToPercent(pos.x, pos.y, piece.size, gs);
            const isDragging = drag?.pieceId === piece.id;
            return (
              <div
                key={piece.id}
                data-shape-piece
                data-piece-id={piece.id}
                role="button"
                tabIndex={0}
                className={`absolute cursor-grab active:cursor-grabbing touch-none transition-transform duration-200 ${
                  isDragging ? 'opacity-40 pointer-events-none' : ''
                }`}
                style={{
                  left: `${pct.left}%`,
                  top: `${pct.top}%`,
                  width: `${pct.width}%`,
                  height: `${pct.height}%`,
                  transform: `rotate(${piece.currentRotation}deg)`,
                }}
                onClick={() => onPieceClick(piece.id)}
              >
                <PieceSvg
                  type={piece.type}
                  color={piece.color}
                  rotation={piece.currentRotation}
                  className="w-full h-full pointer-events-none"
                />
              </div>
            );
          })}
        </div>
      </div>

      <p className="mt-3 mb-2 text-xs sm:text-sm text-slate-500 text-center" role="status">
        {t.games.shape_shift.instructions[problem.mode]}
      </p>

      {typeof spendStars === 'function' && (
        <div className="flex flex-wrap justify-center gap-2 mb-2">
          <button
            type="button"
            onClick={handleOutlineHint}
            disabled={stars < outlineCost}
            className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-amber-100 text-amber-800 border border-amber-300 hover:enabled:bg-amber-200"
          >
            {t.games.shape_shift.hintOutlineCost.replace('{cost}', String(outlineCost))}
          </button>
          <button
            type="button"
            onClick={handlePlacePieceHint}
            disabled={stars < placePieceCost || unplaced.length === 0}
            className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-amber-100 text-amber-800 border border-amber-300 hover:enabled:bg-amber-200"
          >
            {t.games.shape_shift.hintPlacePieceCost.replace('{cost}', String(placePieceCost))}
          </button>
        </div>
      )}

      {showHint && unplaced.length > 0 && (
        <p className="mb-2 text-xs sm:text-sm text-teal-600 font-medium text-center" role="status">
          {t.games.shape_shift.dragHint}
        </p>
      )}

      {/* Tray – piece size from same formula, capped */}
      <div
        ref={trayRef}
        className="flex flex-wrap justify-center items-center gap-2 w-[min(96vw,48rem)] h-24 py-2 px-3 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/80 flex-shrink-0 overflow-hidden"
      >
        {unplaced.map(piece => {
          const isDragging = drag?.pieceId === piece.id;
          return (
            <div
              key={piece.id}
              data-shape-piece
              data-piece-id={piece.id}
              role="button"
              tabIndex={0}
              className={`relative cursor-grab active:cursor-grabbing rounded-lg border border-slate-200 bg-slate-50/60 p-0.5 touch-none flex items-center justify-center flex-shrink-0 ${
                isDragging ? 'opacity-40 pointer-events-none' : ''
              }`}
              style={{
                touchAction: 'none',
                width: trayPieceSizePx(piece.size),
                height: trayPieceSizePx(piece.size),
              }}
              onClick={() => onPieceClick(piece.id)}
            >
              <PieceSvg
                type={piece.type}
                color={piece.color}
                rotation={piece.currentRotation}
                className="w-full h-full pointer-events-none"
              />
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
