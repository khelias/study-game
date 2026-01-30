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

  // Reset state on new problem
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPieces(problem.pieces.map(p => ({ ...p })));
    setSelectedPiece(null);
    setStatus('idle');
  }, [problem.uid, problem.pieces]);

  // Handle piece click/tap for rotation
  const handlePieceClick = (pieceId: string) => {
    if (status !== 'idle') return;
    
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

  // Check if puzzle is complete
  const checkCompletion = () => {
    const nonDecoyPieces = pieces.filter(p => !p.isDecoy);
    const allPlaced = nonDecoyPieces.every(p => p.currentPosition !== null);
    
    if (allPlaced) {
      const isCorrect = validateShapeShift(problem, pieces);
      setStatus(isCorrect ? 'correct' : 'wrong');
      playSound(isCorrect ? 'correct' : 'wrong', soundEnabled);
      
      setTimeout(() => {
        onAnswer(isCorrect);
        setStatus('idle');
      }, isCorrect ? 1000 : 500);
    }
  };

  // Drag handlers
  const handleDragStart = (pieceId: string, e: React.MouseEvent | React.TouchEvent) => {
    if (status !== 'idle') return;
    
    const clientX = 'touches' in e ? e.touches[0]?.clientX ?? 0 : e.clientX;
    const clientY = 'touches' in e ? e.touches[0]?.clientY ?? 0 : e.clientY;
    
    setDragState({
      pieceId,
      startX: clientX,
      startY: clientY,
      currentX: clientX,
      currentY: clientY,
    });
    setSelectedPiece(pieceId);
  };

  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!dragState.pieceId) return;
    
    const clientX = 'touches' in e ? e.touches[0]?.clientX ?? 0 : e.clientX;
    const clientY = 'touches' in e ? e.touches[0]?.clientY ?? 0 : e.clientY;
    
    setDragState(prev => ({
      ...prev,
      currentX: clientX,
      currentY: clientY,
    }));
  };

  const handleDragEnd = () => {
    if (!dragState.pieceId || !boardRef.current) {
      setDragState({ pieceId: null, startX: 0, startY: 0, currentX: 0, currentY: 0 });
      return;
    }

    const boardRect = boardRef.current.getBoundingClientRect();
    const relativeX = dragState.currentX - boardRect.left;
    const relativeY = dragState.currentY - boardRect.top;
    
    // Check if dropped on board
    const onBoard = relativeX >= 0 && relativeX <= boardRect.width && 
                    relativeY >= 0 && relativeY <= boardRect.height;
    
    if (onBoard) {
      // Convert pixel position to grid position
      const gridX = Math.floor((relativeX / boardRect.width) * problem.puzzle.gridSize);
      const gridY = Math.floor((relativeY / boardRect.height) * problem.puzzle.gridSize);
      
      setPieces(prev => prev.map(p =>
        p.id === dragState.pieceId ? { ...p, currentPosition: { x: gridX, y: gridY } } : p
      ));
      playSound('tap', soundEnabled);
    } else {
      // Dropped outside board, return to tray
      setPieces(prev => prev.map(p =>
        p.id === dragState.pieceId ? { ...p, currentPosition: null } : p
      ));
    }
    
    setDragState({ pieceId: null, startX: 0, startY: 0, currentX: 0, currentY: 0 });
    
    // Check for completion after a brief delay
    setTimeout(checkCompletion, 100);
  };

  const unplacedPieces = pieces.filter(p => p.currentPosition === null);
  const placedPieces = pieces.filter(p => p.currentPosition !== null);

  // Get puzzle name based on locale
  const puzzleName = locale === 'et' ? problem.puzzle.nameEt : problem.puzzle.nameEn;

  return (
    <div className="w-full flex flex-col items-center px-4 sm:px-6 max-w-2xl mx-auto pt-4 sm:pt-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="mb-4 text-center">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-700">
          {puzzleName}
        </h2>
        <p className="text-sm text-slate-500">
          {t.games.shape_shift.instructions[problem.mode]}
        </p>
      </div>

      {/* Target Board */}
      <div
        ref={boardRef}
        className="relative bg-slate-100 rounded-2xl border-2 border-dashed border-slate-300 overflow-hidden"
        style={{
          width: 'min(90vw, 20rem)',
          aspectRatio: '1',
        }}
        onMouseMove={handleDragMove}
        onTouchMove={handleDragMove}
        onMouseUp={handleDragEnd}
        onTouchEnd={handleDragEnd}
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
              className={`absolute cursor-move transition-transform ${
                selectedPiece === piece.id ? 'scale-105 drop-shadow-lg' : ''
              } ${isDragging ? 'opacity-50' : ''}`}
              style={{
                left: `${left}%`,
                top: `${top}%`,
                width: `${cellSize * piece.size}%`,
                height: `${cellSize * piece.size}%`,
                transform: `rotate(${piece.currentRotation}deg)`,
              }}
              onMouseDown={(e) => handleDragStart(piece.id, e)}
              onTouchStart={(e) => handleDragStart(piece.id, e)}
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

      {/* Piece Tray */}
      <div className="mt-6 flex flex-wrap justify-center gap-3 min-h-[80px]">
        {unplacedPieces.map(piece => {
          const isDragging = dragState.pieceId === piece.id;
          
          return (
            <div
              key={piece.id}
              className={`relative cursor-move bg-white rounded-xl border-2 border-slate-200 p-2 transition-transform ${
                selectedPiece === piece.id ? 'scale-105 drop-shadow-lg border-teal-400' : ''
              } ${isDragging ? 'opacity-50' : ''} hover:scale-105`}
              style={{
                width: '4rem',
                height: '4rem',
                touchAction: 'none',
              }}
              onMouseDown={(e) => handleDragStart(piece.id, e)}
              onTouchStart={(e) => handleDragStart(piece.id, e)}
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
      <p className="mt-4 text-xs text-slate-400 text-center">
        {t.games.shape_shift.tapToRotate} • {t.games.shape_shift.dragToPlace}
      </p>
    </div>
  );
};
