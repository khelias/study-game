/**
 * StarMapperView Component
 * 
 * Interactive constellation learning game view.
 * Supports multiple game modes: trace, build, identify, expert.
 */

import React, { useState, useMemo, useRef, useCallback } from 'react';
import { playSound } from '../../engine/audio';
import { useTranslation } from '../../i18n/useTranslation';
import { getConstellationById } from '../../games/constellations';
import type { StarMapperProblem, Star, ConstellationLine } from '../../types/game';

/** Minimum touch target radius in viewBox units (0–100) for comfortable tapping */
const TOUCH_TARGET_R = 6;

type AnswerHandler = (answer: boolean) => void;

interface StarMapperViewProps {
  problem: StarMapperProblem;
  onAnswer: AnswerHandler;
  soundEnabled: boolean;
  level?: number;
}

export const StarMapperView: React.FC<StarMapperViewProps> = ({
  problem,
  onAnswer,
  soundEnabled,
}) => {
  const t = useTranslation();
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedStar, setSelectedStar] = useState<string | null>(null);
  const [drawnLines, setDrawnLines] = useState<ConstellationLine[]>([]);
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [dragStartStarId, setDragStartStarId] = useState<string | null>(null);

  // Reset state when problem changes (render-time sync avoids cascading effect renders)
  const [prevUid, setPrevUid] = useState(problem.uid);
  if (prevUid !== problem.uid) {
    setPrevUid(problem.uid);
    setSelectedStar(null);
    setDrawnLines([]);
    setStatus('idle');
    setSelectedOption(null);
    setDragStartStarId(null);
  }

  // Star tap handler for trace/build/expert modes
  const handleStarTap = (starId: string) => {
    if (status !== 'idle') return;

    if (!selectedStar) {
      // First star selected
      setSelectedStar(starId);
      playSound('tap', soundEnabled);
    } else if (selectedStar === starId) {
      // Deselect
      setSelectedStar(null);
      playSound('tap', soundEnabled);
    } else {
      // Draw line between selected and tapped (reject duplicate connection)
      const newLine = { from: selectedStar, to: starId };
      const alreadyExists = drawnLines.some(
        l => (l.from === newLine.from && l.to === newLine.to) || (l.from === newLine.to && l.to === newLine.from)
      );
      if (alreadyExists) return;

      const newLines = [...drawnLines, newLine];
      setDrawnLines(newLines);
      setSelectedStar(null);
      playSound('connect', soundEnabled);

      checkCompletion(newLines);
    }
  };

  // Undo last drawn line (trace/build/expert only)
  const handleUndo = useCallback(() => {
    if (status !== 'idle' || drawnLines.length === 0) return;
    setDrawnLines(prev => prev.slice(0, -1));
    setSelectedStar(null);
    playSound('tap', soundEnabled);
  }, [status, drawnLines.length, soundEnabled]);

  // Check if constellation is complete or wrong (used by tap and drag-to-connect)
  const checkCompletion = useCallback((lines: ConstellationLine[]) => {
    const requiredLines = problem.constellation.lines;
    const allComplete = requiredLines.every(required =>
      lines.some(player =>
        (player.from === required.from && player.to === required.to) ||
        (player.from === required.to && player.to === required.from)
      )
    );

    if (allComplete) {
      setStatus('correct');
      playSound('success', soundEnabled);
      setTimeout(() => {
        onAnswer(true);
      }, 2200);
      return;
    }

    // All lines drawn but wrong: brief feedback then hand off to global handler (toast, heart); clear state so user can retry same problem
    if (lines.length >= requiredLines.length) {
      playSound('error', soundEnabled);
      const delay = 400;
      setTimeout(() => {
        setSelectedStar(null);
        setDrawnLines([]);
        setSelectedOption(null);
        setDragStartStarId(null);
        setStatus('idle');
        onAnswer(false);
      }, delay);
    }
  }, [problem.constellation.lines, soundEnabled, onAnswer]);

  // Find star at viewBox position (for drag-to-connect release)
  const getStarAtPosition = useCallback((x: number, y: number): Star | null => {
    for (const star of problem.constellation.stars) {
      const dx = star.x - x;
      const dy = star.y - y;
      if (dx * dx + dy * dy <= TOUCH_TARGET_R * TOUCH_TARGET_R) return star;
    }
    return null;
  }, [problem.constellation.stars]);

  // Convert client coords to viewBox (0–100)
  const clientToViewBox = useCallback((clientX: number, clientY: number): { x: number; y: number } | null => {
    const svg = svgRef.current;
    if (!svg) return null;
    const pt = svg.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;
    const ctm = svg.getScreenCTM();
    if (!ctm) return null;
    const svgPt = pt.matrixTransform(ctm.inverse());
    return { x: svgPt.x, y: svgPt.y };
  }, []);

  // Pointer up on star field: complete drag-to-connect if we started on a star and released on another
  const handleStarFieldPointerUp = (e: React.PointerEvent) => {
    if (!dragStartStarId || status !== 'idle') {
      setDragStartStarId(null);
      return;
    }
    const pt = clientToViewBox(e.clientX, e.clientY);
    if (!pt) {
      setDragStartStarId(null);
      return;
    }
    const starAt = getStarAtPosition(pt.x, pt.y);
    if (starAt && starAt.id !== dragStartStarId) {
      const newLine = { from: dragStartStarId, to: starAt.id };
      const alreadyExists = drawnLines.some(
        l => (l.from === newLine.from && l.to === newLine.to) || (l.from === newLine.to && l.to === newLine.from)
      );
      if (!alreadyExists) {
        const newLines = [...drawnLines, newLine];
        setDrawnLines(newLines);
        setSelectedStar(null);
        playSound('connect', soundEnabled);
        checkCompletion(newLines);
      }
    }
    setDragStartStarId(null);
  };

  // Handle identify mode option selection
  const handleIdentify = (constellationId: string) => {
    if (status !== 'idle') return;

    setSelectedOption(constellationId);
    playSound('click', soundEnabled);

    const isCorrect = constellationId === problem.correctAnswer;
    setStatus(isCorrect ? 'correct' : 'wrong');

    if (isCorrect) {
      playSound('success', soundEnabled);
      setTimeout(() => onAnswer(true), 2200);
    } else {
      playSound('error', soundEnabled);
      const wrongDelay = 400;
      setTimeout(() => {
        setSelectedStar(null);
        setDrawnLines([]);
        setSelectedOption(null);
        setDragStartStarId(null);
        setStatus('idle');
        onAnswer(false);
      }, wrongDelay);
    }
  };

  // Calculate star size based on magnitude (brighter stars are larger)
  const getStarSize = (magnitude: number): number => {
    return 8 - magnitude; // magnitude 0 = size 8, magnitude 6 = size 2
  };

  // Get star color based on magnitude
  const getStarColor = (magnitude: number, isDistractor = false): string => {
    if (isDistractor) return '#444466';
    if (magnitude <= 1) return '#ffffff';
    if (magnitude <= 3) return '#e8e8ff';
    return '#8888aa';
  };

  // Render mode instructions
  const getInstructions = (): string => {
    return t.starMapper.instructions[problem.mode];
  };

  // Calculate remaining lines for trace/build modes
  const linesRemaining = problem.constellation.lines.length - drawnLines.length;

  // Create star lookup map for O(1) access (performance optimization)
  const starMap = useMemo(() => {
    const map = new Map<string, Star>();
    problem.constellation.stars.forEach(star => map.set(star.id, star));
    return map;
  }, [problem.constellation.stars]);

  // Generate ambient stars positions once (stable across re-renders)
  const ambientStars = useMemo(() => {
    // Use problem UID to create stable random seed
    const seed = problem.uid.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const seededRandom = (i: number) => {
      const x = Math.sin(seed + i * 12.9898) * 43758.5453;
      return x - Math.floor(x);
    };

    return Array.from({ length: 30 }, (_, i) => ({
      key: i,
      left: seededRandom(i * 5) * 100,
      top: seededRandom(i * 5 + 1) * 100,
      width: 1 + seededRandom(i * 5 + 2) * 2,
      height: 1 + seededRandom(i * 5 + 3) * 2,
      animationDelay: Math.min(3, seededRandom(i * 5 + 4) * 3), // Clamp max delay to 3s
    }));
  }, [problem.uid]);

  const isConnectMode = problem.mode === 'trace' || problem.mode === 'build' || problem.mode === 'expert';

  return (
    <div className="w-full flex flex-col items-center px-4 sm:px-6 max-w-2xl mx-auto pt-4 sm:pt-6 animate-in fade-in duration-300">
      {/* Header - same structure as other game views (Pattern, etc.) */}
      <div className="w-full max-w-3xl text-center mb-3 sm:mb-4">
        <div className="text-[10px] sm:text-xs font-bold uppercase tracking-wide text-indigo-600">
          {t.starMapper.title}
        </div>
        <div className="text-lg sm:text-2xl font-black text-slate-800">
          {problem.constellation.nameEt}
        </div>
        <div className="text-xs sm:text-sm text-slate-500 mt-1">
          {problem.constellation.nameEn}
          {problem.constellation.folkNameEt && ` (${problem.constellation.folkNameEt})`}
        </div>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          {getInstructions()}
        </p>
        {isConnectMode && (
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {t.starMapper.formLabel}: {problem.constellation.folkNameEt || problem.constellation.nameEt}
          </p>
        )}
      </div>

      {/* Star Field - overflow-hidden clips selection marker inside bounds */}
      <div
        className="relative w-full rounded-2xl overflow-hidden shadow-2xl"
        style={{
          background: 'linear-gradient(to bottom, #0a0a1a 0%, #1a1a3a 50%, #2a2a4a 100%)',
          maxWidth: 'min(90vw, 28rem)',
          aspectRatio: `${problem.constellation.bounds.width} / ${problem.constellation.bounds.height}`,
        }}
      >
        {/* Background ambient stars */}
        <div className="absolute inset-0">
          {ambientStars.map((star) => (
            <div
              key={star.key}
              className="absolute rounded-full bg-white opacity-20 animate-twinkle"
              style={{
                left: `${star.left}%`,
                top: `${star.top}%`,
                width: `${star.width}px`,
                height: `${star.height}px`,
                animationDelay: `${star.animationDelay}s`,
              }}
            />
          ))}
        </div>

        {/* SVG for lines and stars - overflow hidden keeps selection ring inside playable area */}
        <svg
          ref={svgRef}
          className="absolute inset-0 w-full h-full touch-none"
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid meet"
          style={{ overflow: 'hidden' }}
          onPointerUp={problem.mode !== 'identify' ? handleStarFieldPointerUp : undefined}
        >
          <defs>
            <clipPath id="starFieldClip">
              <rect x="0" y="0" width="100" height="100" />
            </clipPath>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <g clipPath="url(#starFieldClip)">

          {/* Constellation shape: identify mode (show shape so it can be recognized) */}
          {problem.mode === 'identify' &&
            problem.constellation.lines.map((line, idx) => {
              const fromStar = starMap.get(line.from);
              const toStar = starMap.get(line.to);
              if (!fromStar || !toStar) return null;
              return (
                <line
                  key={`shape-${idx}`}
                  x1={fromStar.x}
                  y1={fromStar.y}
                  x2={toStar.x}
                  y2={toStar.y}
                  stroke="rgba(150, 200, 255, 0.85)"
                  strokeWidth="0.7"
                />
              );
            })}

          {/* Guide lines (trace mode) */}
          {problem.showGuide &&
            problem.constellation.lines.map((line, idx) => {
              const fromStar = starMap.get(line.from);
              const toStar = starMap.get(line.to);
              if (!fromStar || !toStar) return null;

              return (
                <line
                  key={`guide-${idx}`}
                  x1={fromStar.x}
                  y1={fromStar.y}
                  x2={toStar.x}
                  y2={toStar.y}
                  stroke="rgba(100, 150, 255, 0.3)"
                  strokeWidth="0.5"
                  strokeDasharray="2,2"
                />
              );
            })}

          {/* Player drawn lines */}
          {drawnLines.map((line, idx) => {
            const fromStar = starMap.get(line.from);
            const toStar = starMap.get(line.to);
            if (!fromStar || !toStar) return null;

            return (
              <line
                key={`drawn-${idx}`}
                x1={fromStar.x}
                y1={fromStar.y}
                x2={toStar.x}
                y2={toStar.y}
                stroke={status === 'correct' ? '#88ddff' : 'rgba(150, 200, 255, 0.8)'}
                strokeWidth="0.8"
                filter={status === 'correct' ? 'url(#glow)' : undefined}
                className={status === 'correct' ? 'animate-pulse' : ''}
              />
            );
          })}

          {/* Constellation stars: large touch target (r=TOUCH_TARGET_R) + visible star */}
          {problem.constellation.stars.map(star => {
            const isSelected = selectedStar === star.id;
            const isConnected = drawnLines.some(l => l.from === star.id || l.to === star.id);
            const size = getStarSize(star.magnitude);
            const color = getStarColor(star.magnitude);

            return (
              <g key={star.id}>
                {/* Large invisible hit area for touch (tap and drag-to-connect) */}
                <circle
                  cx={star.x}
                  cy={star.y}
                  r={TOUCH_TARGET_R}
                  fill="transparent"
                  className="cursor-pointer"
                  onClick={() => handleStarTap(star.id)}
                  onPointerDown={(e) => {
                    e.stopPropagation();
                    setDragStartStarId(star.id);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleStarTap(star.id);
                    }
                  }}
                  tabIndex={0}
                  role="button"
                  aria-label={`Star ${star.name || star.id}${isSelected ? ' (selected)' : ''}`}
                />
                {/* Visible star (no pointer events so hit area gets taps) */}
                <circle
                  cx={star.x}
                  cy={star.y}
                  r={size * 0.5}
                  fill={color}
                  pointerEvents="none"
                  filter={isSelected || (status === 'correct' && isConnected) ? 'url(#glow)' : undefined}
                  className={`transition-all ${isSelected ? 'animate-pulse' : ''} ${status === 'correct' ? 'animate-twinkle' : ''}`}
                  style={{
                    transform: isSelected ? 'scale(1.5)' : 'scale(1)',
                    transformOrigin: 'center',
                  }}
                />
                {isSelected && (
                  <circle
                    cx={star.x}
                    cy={star.y}
                    r={size * 0.6}
                    fill="none"
                    stroke="#88ddff"
                    strokeWidth="0.6"
                    pointerEvents="none"
                  />
                )}
              </g>
            );
          })}

          {/* Distractor stars (expert mode) */}
          {problem.distractorStars.map(star => {
            const size = getStarSize(star.magnitude);
            const color = getStarColor(star.magnitude, true);

            return (
              <circle
                key={star.id}
                cx={star.x}
                cy={star.y}
                r={size * 0.4}
                fill={color}
                opacity="0.6"
              />
            );
          })}
          </g>
        </svg>

        {/* Success animation overlay */}
        {status === 'correct' && (
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-500/20 to-transparent animate-pulse pointer-events-none" />
        )}
      </div>

      {/* Fixed bar below play area: lines remaining + Undo (no pop-in) */}
      {isConnectMode && (
        <div className="w-full max-w-md mt-3 flex items-center justify-between gap-3">
          <span className="text-xs sm:text-sm text-slate-500">
            {t.starMapper.linesRemaining.replace('{count}', String(linesRemaining))}
          </span>
          <button
            type="button"
            onClick={handleUndo}
            disabled={drawnLines.length === 0 || status !== 'idle'}
            className="px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 active:bg-slate-100 disabled:opacity-50 disabled:pointer-events-none"
          >
            {t.starMapper.undo}
          </button>
        </div>
      )}

      {/* One-line fact when correct (teaches something before next problem) */}
      {status === 'correct' && (() => {
        const constellations = t.starMapper.constellations as Record<string, { desc?: string }>;
        const fact = constellations[problem.constellation.id]?.desc;
        return fact ? (
          <p className="mt-3 text-center text-sm text-slate-600 italic animate-in fade-in duration-300">
            {fact}
          </p>
        ) : null;
      })()}

      {/* Identify mode options */}
      {problem.mode === 'identify' && problem.options && (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full max-w-md mt-4">
          {problem.options.map((optionId) => {
            const constellation = getConstellationById(optionId);
            if (!constellation) return null;

            const isSelected = selectedOption === optionId;
            const isCorrect = optionId === problem.correctAnswer;
            const showResult = status !== 'idle';

            return (
              <button
                key={optionId}
                disabled={status !== 'idle'}
                onClick={() => handleIdentify(optionId)}
                className={`
                  px-4 py-3 rounded-xl sm:rounded-2xl border-b-4 sm:border-b-6
                  text-sm sm:text-base font-bold flex items-center justify-center
                  transition-all shadow-lg min-h-[3rem]
                  ${
                    showResult && isCorrect
                      ? 'bg-green-500 border-green-700 text-white scale-105'
                      : showResult && isSelected && !isCorrect
                      ? 'bg-red-500 border-red-700 text-white scale-95'
                      : status === 'idle'
                      ? 'bg-gradient-to-br from-white to-indigo-50 border-indigo-300 hover:border-indigo-500 hover:bg-indigo-100 hover:scale-105 hover:-translate-y-1 hover:shadow-xl active:scale-95 active:border-b-2 active:translate-y-1 text-indigo-700'
                      : 'bg-slate-200 border-slate-300 text-slate-400 opacity-40'
                  }
                `}
              >
                <span className="text-center">{constellation.nameEt}</span>
              </button>
            );
          })}
        </div>
      )}

    </div>
  );
};
