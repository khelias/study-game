/**
 * ShapeShiftView Component
 * 
 * Game view for geometric puzzle games where players drag and rotate shapes to fill a silhouette.
 */

import React, { useEffect, useState, useRef } from 'react';
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

// SVG paths for different shape types
const SHAPE_PATHS: Record<ShapeType, string> = {
  triangle: 'M25,0 L50,50 L0,50 Z',
  half_square: 'M0,0 L50,50 L0,50 Z',
  square: 'M0,0 L50,0 L50,50 L0,50 Z',
  rectangle: 'M0,0 L100,0 L100,50 L0,50 Z',
  diamond: 'M25,0 L50,25 L25,50 L0,25 Z',
  hexagon: 'M12.5,0 L37.5,0 L50,25 L37.5,50 L12.5,50 L0,25 Z',
  circle: 'M25,25 m-25,0 a25,25 0 1,0 50,0 a25,25 0 1,0 -50,0',
};

// Tailwind color classes for pieces
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

/** Short haptic pulse when placing a piece (supported on mobile). */
function hapticDrop(): void {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    navigator.vibrate(10);
  }
}

export const ShapeShiftView: React.FC<ShapeShiftViewProps> = ({
  problem,
  onAnswer,
  soundEnabled,
}) => {
  const t = useTranslation();
  const locale = getLocale();
  const [pieces, setPieces] = useState<PieceState[]>([]);
  const [selectedPiece, setSelectedPiece] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [dragState, setDragState] = useState<{
    pieceId: string | null;
    startX: number;
    startY: number;
    currentX: number;
    currentY: number;
  }>({ pieceId: null, startX: 0, startY: 0, currentX: 0, currentY: 0 });
  const boardRef = useRef<HTMLDivElement>(null);
  const dragJustEndedRef = useRef(false);
  const submittedForProblemRef = useRef<string | null>(null);
  const dragStateRef = useRef(dragState);
  dragStateRef.current = dragState;
  const [showDragHint, setShowDragHint] = useState(true);

  /** Treat as tap (rotate/select) if move was under this many px */
  const TAP_MOVE_THRESHOLD_PX = 12;

  /** Size of the drag ghost in px (visible, touch-friendly) */
  const DRAG_GHOST_SIZE_PX = 64;

  // Reset state on new problem
  useEffect(() => {
    submittedForProblemRef.current = null;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPieces(problem.pieces.map(p => ({ ...p })));
    setSelectedPiece(null);
    setStatus('idle');
    setShowDragHint(true);
  }, [problem.uid, problem.pieces]);

  // Dismiss drag hint after delay or on first successful drop (handled in handlePointerUp)
  useEffect(() => {
    if (!showDragHint) return;
    const id = setTimeout(() => setShowDragHint(false), 4000);
    return () => clearTimeout(id);
  }, [showDragHint]);

  // Run completion check when pieces change (avoids stale closure from setTimeout after drag)
  useEffect(() => {
    if (status !== 'idle') return;
    if (submittedForProblemRef.current === problem.uid) return;
    const nonDecoyPieces = pieces.filter(p => !p.isDecoy);
    const allPlaced = nonDecoyPieces.every(p => p.currentPosition !== null);
    if (!allPlaced) return;

    submittedForProblemRef.current = problem.uid;
    const isCorrect = validateShapeShift(problem, pieces);
    setStatus(isCorrect ? 'correct' : 'wrong');
    playSound(isCorrect ? 'correct' : 'wrong', soundEnabled);

    const timeout = setTimeout(() => {
      onAnswer(isCorrect);
      setStatus('idle');
    }, isCorrect ? 1000 : 500);
    return () => clearTimeout(timeout);
  }, [pieces, status, problem, soundEnabled, onAnswer]);

  // Handle piece click/tap for rotation (ignore if we just finished a drag to avoid double-handling)
  const handlePieceClick = (pieceId: string) => {
    if (status !== 'idle') return;
    if (dragJustEndedRef.current) {
      dragJustEndedRef.current = false;
      return;
    }

    const piece = pieces.find(p => p.id === pieceId);
    if (!piece) return;

    if (selectedPiece === pieceId) {
      // Rotate the piece
      setPieces(prev => prev.map(p =>
        p.id === pieceId
          ? { ...p, currentRotation: (p.currentRotation + 90) % 360 }
          : p
      ));
      playSound('tap', soundEnabled);
    } else {
      setSelectedPiece(pieceId);
      playSound('tap', soundEnabled);
    }
  };

  // Dedicated rotate button (works on mobile where tap-to-rotate is hard)
  const handleRotateButton = () => {
    if (status !== 'idle' || !selectedPiece) return;
    setPieces(prev => prev.map(p =>
      p.id === selectedPiece
        ? { ...p, currentRotation: (p.currentRotation + 90) % 360 }
        : p
    ));
    playSound('tap', soundEnabled);
  };

  // Unified pointer drag handlers (mouse + touch, with capture so drag works everywhere)
  const handlePointerDown = (pieceId: string, e: React.PointerEvent) => {
    if (status !== 'idle') return;
    e.preventDefault();
    setShowDragHint(false); // dismiss hint as soon as user starts dragging
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    setDragState({
      pieceId,
      startX: e.clientX,
      startY: e.clientY,
      currentX: e.clientX,
      currentY: e.clientY,
    });
    setSelectedPiece(pieceId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragStateRef.current.pieceId) return;
    if (e.pointerType === 'touch') e.preventDefault();
    setDragState(prev => ({ ...prev, currentX: e.clientX, currentY: e.clientY }));
    dragStateRef.current = { ...dragStateRef.current, currentX: e.clientX, currentY: e.clientY };
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    const state = dragStateRef.current;
    if (!state.pieceId) {
      setDragState({ pieceId: null, startX: 0, startY: 0, currentX: 0, currentY: 0 });
      return;
    }
    const endX = e.clientX;
    const endY = e.clientY;
    const moved = Math.hypot(endX - state.startX, endY - state.startY);
    let placed = false;

    if (boardRef.current) {
      const boardRect = boardRef.current.getBoundingClientRect();
      const relativeX = endX - boardRect.left;
      const relativeY = endY - boardRect.top;
      const onBoard =
        relativeX >= 0 && relativeX <= boardRect.width &&
        relativeY >= 0 && relativeY <= boardRect.height;

      if (onBoard) {
        const gs = problem.puzzle.gridSize;
        const cellW = boardRect.width / gs;
        const cellH = boardRect.height / gs;
        const gridX = Math.floor((relativeX + cellW / 2) / cellW);
        const gridY = Math.floor((relativeY + cellH / 2) / cellH);
        const clampedX = Math.max(0, Math.min(gridX, gs - 1));
        const clampedY = Math.max(0, Math.min(gridY, gs - 1));
        setPieces(prev =>
          prev.map(p =>
            p.id === state.pieceId ? { ...p, currentPosition: { x: clampedX, y: clampedY } } : p
          )
        );
        playSound('tap', soundEnabled);
        hapticDrop();
        placed = true;
      } else {
        setPieces(prev =>
          prev.map(p => (p.id === state.pieceId ? { ...p, currentPosition: null } : p))
        );
      }
    }

    setDragState({ pieceId: null, startX: 0, startY: 0, currentX: 0, currentY: 0 });

    if (!placed && moved < TAP_MOVE_THRESHOLD_PX) {
      dragJustEndedRef.current = false;
      setTimeout(() => handlePieceClick(state.pieceId), 10);
    } else {
      dragJustEndedRef.current = true;
    }
  };

  const unplacedPieces = pieces.filter(p => p.currentPosition === null);
  const placedPieces = pieces.filter(p => p.currentPosition !== null);
  const draggingPiece = dragState.pieceId ? pieces.find(p => p.id === dragState.pieceId) : null;

  // Get puzzle name based on locale
  const puzzleName = locale === 'et' ? problem.puzzle.nameEt : problem.puzzle.nameEn;

  return (
    <div className="w-full flex flex-col items-center px-4 sm:px-6 max-w-2xl mx-auto pt-4 sm:pt-6 animate-in fade-in duration-300">
      {/* Drag ghost: follows pointer so user sees the piece while dragging (mouse + touch) */}
      {draggingPiece && (
        <div
          className="fixed pointer-events-none z-[100] will-change-transform"
          style={{
            left: dragState.currentX,
            top: dragState.currentY,
            width: DRAG_GHOST_SIZE_PX,
            height: DRAG_GHOST_SIZE_PX,
            transform: 'translate(-50%, -50%)',
          }}
        >
          <div
            className="w-full h-full drop-shadow-xl"
            style={{ transform: `rotate(${draggingPiece.currentRotation}deg)` }}
          >
            <svg
              viewBox={draggingPiece.type === 'rectangle' ? '0 0 100 50' : '0 0 50 50'}
              className="w-full h-full"
            >
              <path
                d={SHAPE_PATHS[draggingPiece.type]}
                fill={COLOR_CLASSES[draggingPiece.color] || COLOR_CLASSES.gray}
                stroke={draggingPiece.color === 'white' ? '#cbd5e1' : 'none'}
                strokeWidth={draggingPiece.color === 'white' ? '2' : '0'}
              />
            </svg>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-4 text-center">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-700">
          {puzzleName}
        </h2>
        <p className="text-sm text-slate-500">
          {t.games.shape_shift.instructions[problem.mode]}
        </p>
      </div>

      {/* Target Board - large so pieces fit and drop target is clear */}
      <div
        ref={boardRef}
        className="relative bg-slate-100 rounded-2xl border-2 border-dashed border-slate-300 overflow-hidden flex-shrink-0 select-none touch-none"
        style={{
          width: 'min(94vw, 28rem)',
          aspectRatio: '1',
          touchAction: 'none',
        }}
      >
        {/* Placed pieces */}
        {placedPieces.map(piece => {
          const isDragging = dragState.pieceId === piece.id;
          const position = piece.currentPosition;
          if (!position) return null;

          const cellSize = 100 / problem.puzzle.gridSize;
          const left = position.x * cellSize;
          const top = position.y * cellSize;

          return (
            <div
              key={piece.id}
              role="button"
              tabIndex={0}
              className={`absolute cursor-grab active:cursor-grabbing select-none touch-none transition-all duration-200 ease-out ${
                selectedPiece === piece.id ? 'scale-105 drop-shadow-lg' : ''
              } ${isDragging ? 'opacity-40 pointer-events-none' : ''}`}
              style={{
                left: `${left}%`,
                top: `${top}%`,
                width: `${cellSize * piece.size}%`,
                height: `${cellSize * piece.size}%`,
                transform: `rotate(${piece.currentRotation}deg)`,
                touchAction: 'none',
              }}
              onPointerDown={(e) => handlePointerDown(piece.id, e)}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              onClick={() => handlePieceClick(piece.id)}
            >
              <svg
                viewBox={piece.type === 'rectangle' ? '0 0 100 50' : '0 0 50 50'}
                className="w-full h-full"
              >
                <path
                  d={SHAPE_PATHS[piece.type]}
                  fill={COLOR_CLASSES[piece.color] || COLOR_CLASSES.gray}
                  stroke={piece.color === 'white' ? '#cbd5e1' : 'none'}
                  strokeWidth={piece.color === 'white' ? '2' : '0'}
                />
              </svg>
            </div>
          );
        })}

        {/* Success overlay */}
        {status === 'correct' && (
          <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center animate-in fade-in duration-300">
            <span className="text-4xl">🎉</span>
          </div>
        )}
      </div>

      {/* Rotate button - always visible so mobile can rotate without double-tap */}
      {unplacedPieces.length > 0 && (
        <div className="mt-3 flex justify-center">
          <button
            type="button"
            onClick={handleRotateButton}
            disabled={!selectedPiece || status !== 'idle'}
            className="px-4 py-2 text-sm font-medium rounded-xl border-2 border-teal-300 bg-teal-50 text-teal-800 disabled:opacity-50 disabled:pointer-events-none active:bg-teal-100"
          >
            {t.games.shape_shift.rotateButton}
          </button>
        </div>
      )}

      {/* Drag hint - first load only, dismisses on first drag or after 4s */}
      {showDragHint && unplacedPieces.length > 0 && (
        <p
          className="mt-2 text-sm text-teal-600 font-medium animate-in fade-in duration-500 slide-in-from-bottom-2"
          role="status"
        >
          {t.games.shape_shift.dragHint}
        </p>
      )}

      {/* Piece Tray - smaller pieces so board feels bigger */}
      <div className="mt-4 flex flex-wrap justify-center gap-2 min-h-[64px]">
        {unplacedPieces.map(piece => {
          const isDragging = dragState.pieceId === piece.id;
          return (
            <div
              key={piece.id}
              role="button"
              tabIndex={0}
              className={`relative cursor-grab active:cursor-grabbing bg-white rounded-lg border-2 border-slate-200 p-1.5 transition-transform select-none touch-none min-w-[3.5rem] min-h-[3.5rem] w-14 h-14 sm:w-12 sm:h-12 flex items-center justify-center ${
                selectedPiece === piece.id ? 'scale-105 drop-shadow-lg border-teal-400 ring-2 ring-teal-200' : ''
              } ${isDragging ? 'opacity-40 pointer-events-none' : ''} hover:scale-105 active:scale-100`}
              style={{ touchAction: 'none' }}
              onPointerDown={(e) => handlePointerDown(piece.id, e)}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              onClick={() => handlePieceClick(piece.id)}
            >
              <svg
                viewBox={piece.type === 'rectangle' ? '0 0 100 50' : '0 0 50 50'}
                className="w-full h-full"
                style={{
                  transform: `rotate(${piece.currentRotation}deg)`,
                }}
              >
                <path
                  d={SHAPE_PATHS[piece.type]}
                  fill={COLOR_CLASSES[piece.color] || COLOR_CLASSES.gray}
                  stroke={piece.color === 'white' ? '#cbd5e1' : 'none'}
                  strokeWidth={piece.color === 'white' ? '2' : '0'}
                />
              </svg>
            </div>
          );
        })}
      </div>

      {/* Instructions */}
      <p className="mt-3 text-xs text-slate-500 text-center">
        {t.games.shape_shift.dragToPlace}. {t.games.shape_shift.tapToRotate} {t.games.shape_shift.orUse} {t.games.shape_shift.rotateButton}.
      </p>
    </div>
  );
};
