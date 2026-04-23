/**
 * ShapeShiftView – Geometric puzzle: drag shapes onto the board to match the target.
 *
 * Refactored to use useShapeShiftGame hook and standarized ShapeDefinitions.
 * Uses a clean "snap points" grid instead of dense mesh.
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from '../../i18n/useTranslation';
import { getLocale } from '../../i18n';
import { gridPieceToPercent, sortByDistanceFromCenter } from '../../games/shapeShiftGrid';
import { usePlaySessionStore } from '../../stores/playSessionStore';
import { GAME_CONFIG } from '../../games/data';
import type { ShapeShiftProblem } from '../../types/game';
import { useShapeShiftGame } from '../../games/shapeShift/useShapeShiftGame';
import { PieceSvg } from '../../games/shapeShift/ShapeDefinitions';
import { PaidHintButtons } from '../shared';

// ─── Constants ─────────────────────────────────────────────────────────────

const OUTLINE_BASE_COST = 1;
const PLACE_PIECE_BASE_COST = 2;
const OUTLINE_DURATION_MS = 3000;

// ─── Types ──────────────────────────────────────────────────────────────────

interface ShapeShiftViewProps {
  problem: ShapeShiftProblem;
  onAnswer: (isCorrect: boolean) => void;
  soundEnabled: boolean;
  level?: number;
  stars?: number;
  spendStars?: (count: number) => boolean;
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
  const addNotification = usePlaySessionStore((state) => state.addNotification);

  const boardRef = useRef<HTMLDivElement>(null);
  const trayRef = useRef<HTMLDivElement>(null);
  const [boardWidthPx, setBoardWidthPx] = useState(0);

  // Visual state
  const [showOutlineOverlay, setShowOutlineOverlay] = useState(false);
  const [dragState, setDragState] = useState<{
    x: number;
    y: number;
    isoX: number; // Offset from piece center
    isoY: number;
    pieceId: string;
    dragScale: number; // Scale factor for ghost
  } | null>(null);

  // Hook for game logic
  const { pieces, status, placeHintPiece, handleStartDrag, handleDragMove, handleDragEnd } =
    useShapeShiftGame(problem, onAnswer, soundEnabled, boardWidthPx);

  // Measure board
  useEffect(() => {
    const el = boardRef.current;
    if (!el) return;
    const update = () => setBoardWidthPx(el.getBoundingClientRect().width);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Auto-hide outline
  useEffect(() => {
    if (!showOutlineOverlay) return;
    const id = setTimeout(() => setShowOutlineOverlay(false), OUTLINE_DURATION_MS);
    return () => clearTimeout(id);
  }, [showOutlineOverlay]);

  // Use refs for drag handlers to access latest state without re-binding
  const boardRefValues = useRef<{ board: HTMLDivElement | null; tray: HTMLDivElement | null }>({
    board: null,
    tray: null,
  });
  useEffect(() => {
    boardRefValues.current = { board: boardRef.current, tray: trayRef.current };
  });

  // ─── Input Handlers ──────────────────────────────────────────────────────

  const onPointerDown = useCallback(
    (e: React.PointerEvent, pieceId: string) => {
      e.preventDefault();
      e.stopPropagation();

      // Only left click or touch
      if (e.button !== 0) return;

      const target = e.currentTarget as HTMLElement;
      const rect = target.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Offset from center of the piece (unscaled initially)
      const offsetX = e.clientX - centerX;
      const offsetY = e.clientY - centerY;

      // Calculate dragScale
      const piece = pieces.find((p) => p.id === pieceId);
      let scale = 1;

      // Helper to calculate tray size logic locally if needed, or re-use function
      // We need to re-calc boardSize and traySize here to determine ratio
      if (piece && piece.currentPosition === null && boardWidthPx > 0) {
        // Re-calculate tray size for this piece
        // (Logic duplicated from below, or we could hoist getTrayPieceSize)
        const gs = problem.puzzle.gridSize;
        const TRAY_PIECE_MAX_PX = 80;
        const rawPx = (boardWidthPx / gs) * piece.size;
        const traySize = Math.min(rawPx, TRAY_PIECE_MAX_PX);
        const boardSize = rawPx; // Size on board

        if (traySize > 0) {
          scale = boardSize / traySize;
        }
      }

      setDragState({
        x: e.clientX,
        y: e.clientY,
        isoX: offsetX,
        isoY: offsetY,
        pieceId,
        dragScale: scale,
      });

      handleStartDrag(pieceId, e.clientX, e.clientY, offsetX, offsetY, scale);

      // Capture pointer
      target.setPointerCapture(e.pointerId);
    },
    [handleStartDrag, pieces, boardWidthPx, problem.puzzle.gridSize],
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragState) return;
      e.preventDefault();

      setDragState((prev) => (prev ? { ...prev, x: e.clientX, y: e.clientY } : null));
      handleDragMove(e.clientX, e.clientY);
    },
    [dragState, handleDragMove],
  );

  const onPointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (!dragState) return;
      e.preventDefault();

      const { board, tray } = boardRefValues.current;

      const boardRect = board?.getBoundingClientRect() ?? null;
      const trayRect = tray?.getBoundingClientRect() ?? null;

      // Release capture first
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        try {
          e.currentTarget.releasePointerCapture(e.pointerId);
        } catch {
          // Ignore if already released
        }
      }

      handleDragEnd(e.clientX, e.clientY, boardRect, trayRect);
      setDragState(null);
    },
    [dragState, handleDragEnd],
  );

  // ─── Hints ──────────────────────────────────────────────────────────────

  const handleHintClick = (hintId: string) => {
    if (!spendStars) return;

    if (hintId === 'outline') {
      if (stars < OUTLINE_BASE_COST) {
        addNotification({ type: 'hint', message: t.shop.notEnoughStars });
        return;
      }
      if (spendStars(OUTLINE_BASE_COST)) {
        setShowOutlineOverlay(true);
      }
    } else if (hintId === 'place') {
      if (stars < PLACE_PIECE_BASE_COST) {
        addNotification({ type: 'hint', message: t.shop.notEnoughStars });
        return;
      }
      if (placeHintPiece()) {
        spendStars(PLACE_PIECE_BASE_COST);
      }
    }
  };

  // Get game config for hints
  const gameConfig = GAME_CONFIG.shape_shift;

  // ─── Rendering Helpers ──────────────────────────────────────────────────

  const gs = problem.puzzle.gridSize;
  const _puzzleName = locale === 'et' ? problem.puzzle.nameEt : problem.puzzle.nameEn;

  // Sort pieces for z-index (center pieces on top)
  const placedPieces = pieces.filter((p) => p.currentPosition !== null);
  const trayPieces = pieces.filter((p) => p.currentPosition === null);

  const placedSorted = sortByDistanceFromCenter(
    placedPieces,
    gs,
    (p) => p.currentPosition!,
    (p) => p.size,
  );

  // Calculate size for tray items (limited max size)
  const TRAY_PIECE_MAX_PX = 80;
  const getTrayPieceSize = (gridSizeUnits: number) => {
    if (boardWidthPx === 0) return 40;
    const rawPx = (boardWidthPx / gs) * gridSizeUnits;
    return Math.min(rawPx, TRAY_PIECE_MAX_PX);
  };

  // Ghost element for dragging
  const dragPiece = pieces.find((p) => p.id === dragState?.pieceId);
  const ghostSize = dragPiece ? (boardWidthPx / gs) * dragPiece.size : 0;

  return (
    <div className="w-full flex flex-col items-center px-4 max-w-3xl mx-auto pt-4 animate-in fade-in duration-300 select-none">
      {/* Game Board */}
      <div
        className="relative mb-6 rounded-2xl shadow-xl bg-slate-50 overflow-hidden border-4 border-slate-200"
        style={{
          width: 'min(90vw, 500px)',
          aspectRatio: '1',
        }}
      >
        <div ref={boardRef} className="absolute inset-0 w-full h-full">
          {/* Grid Pattern Background */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: 'radial-gradient(circle, #94a3b8 1px, transparent 1px)',
              backgroundSize: `${100 / 12}% ${100 / 12}%`, // 12x12 visual grid
            }}
          />

          {/* Hints Overlay */}
          {showOutlineOverlay && (
            <div className="absolute inset-0 z-0">
              {problem.puzzle.pieces
                .filter((p) => !p.isDecoy)
                .map((p) => {
                  const pct = gridPieceToPercent(
                    p.correctPosition.x,
                    p.correctPosition.y,
                    p.size,
                    gs,
                  );
                  return (
                    <div
                      key={`outline-${p.id}`}
                      className="absolute opacity-20 pointer-events-none"
                      style={{
                        left: `${pct.left}%`,
                        top: `${pct.top}%`,
                        width: `${pct.width}%`,
                        height: `${pct.height}%`,
                      }}
                    >
                      <PieceSvg type={p.type} color={p.color} rotation={p.correctRotation} />
                    </div>
                  );
                })}
            </div>
          )}

          {/* Placed Pieces */}
          {placedSorted.map((p) => {
            const pct = gridPieceToPercent(p.currentPosition!.x, p.currentPosition!.y, p.size, gs);
            const isDragging = dragState?.pieceId === p.id;

            return (
              <div
                key={p.id}
                className={`absolute transition-transform ${isDragging ? 'opacity-0' : 'cursor-grab active:cursor-grabbing hover:brightness-110'}`}
                style={{
                  left: `${pct.left}%`,
                  top: `${pct.top}%`,
                  width: `${pct.width}%`,
                  height: `${pct.height}%`,
                  touchAction: 'none',
                }}
                onPointerDown={(e) => onPointerDown(e, p.id)}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
              >
                <PieceSvg
                  type={p.type}
                  color={p.color}
                  rotation={p.currentRotation}
                  dropShadow // Add shadow for "lifted" feel
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Drag Ghost (Floating on top of everything) */}
      {dragState && dragPiece && (
        <div
          className="fixed pointer-events-none z-[9999]"
          style={{
            left: dragState.x, // Current mouse position
            top: dragState.y,
            width: ghostSize,
            height: ghostSize,
            // Alignment correction:
            // 1. We want the piece visual anchor to match mouse relative offset.
            // 2. Mouse is at (Left, Top) of this div.
            // 3. This Div is top-left anchored at mouse.
            // 4. We shift margins so that Div's internal "anchor" is at mouse.
            // anchor = (isoX * scale, isoY * scale) from top-left.
            marginLeft: -(dragState.isoX * dragState.dragScale),
            marginTop: -(dragState.isoY * dragState.dragScale),
            // No transform needed if using margins.
            // Wait, if no transform, (left, top) is top-left corner.
            // Margin moves that corner back. So mouse stays at (0,0) relative to viewport?
            // No. fixed position sets left/top. Margin offsets from there.
            // So visually: (mouse) is over point (isoX*scale, isoY*scale) inside the ghost.
            // This is correct.
          }}
        >
          <div className="w-full h-full filter drop-shadow-2xl opacity-90">
            <PieceSvg
              type={dragPiece.type}
              color={dragPiece.color}
              rotation={dragPiece.currentRotation}
            />
          </div>
        </div>
      )}

      {/* Paid Hint Buttons */}
      {typeof spendStars === 'function' && status !== 'correct' && gameConfig.paidHints && (
        <PaidHintButtons
          hints={gameConfig.paidHints}
          stars={stars}
          onHintClick={handleHintClick}
          disabled={status !== 'idle' || trayPieces.length === 0}
        />
      )}

      {/* Tray */}
      <div
        ref={trayRef}
        className="w-full max-w-2xl bg-slate-100/80 rounded-xl border-2 border-dashed border-slate-300 p-4 min-h-[100px] flex items-center justify-center flex-wrap gap-4"
      >
        {trayPieces.length === 0 && status === 'idle' && (
          <span className="text-slate-400 italic text-sm">{t.games.shape_shift.dragHint}</span>
        )}

        {trayPieces.map((p) => {
          const isDragging = dragState?.pieceId === p.id;
          const sizePx = getTrayPieceSize(p.size);

          return (
            <div
              key={p.id}
              className={`transition-all ${isDragging ? 'opacity-0 w-0 h-0 m-0 overflow-hidden' : 'cursor-grab active:cursor-grabbing hover:scale-110'}`}
              style={{
                width: sizePx,
                height: sizePx,
                touchAction: 'none',
              }}
              onPointerDown={(e) => onPointerDown(e, p.id)}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
            >
              <PieceSvg type={p.type} color={p.color} rotation={p.currentRotation} />
            </div>
          );
        })}
      </div>
    </div>
  );
};
