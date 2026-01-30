/**
 * StarMapperView Component
 * 
 * Interactive constellation learning game view.
 * Supports multiple game modes: trace, build, identify, expert.
 */

import React, { useEffect, useState, useMemo } from 'react';
import { playSound } from '../../engine/audio';
import { useTranslation } from '../../i18n/useTranslation';
import type { StarMapperProblem, Star, ConstellationLine } from '../../types/game';

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
  level = 1,
}) => {
  const t = useTranslation();
  const [selectedStar, setSelectedStar] = useState<string | null>(null);
  const [drawnLines, setDrawnLines] = useState<ConstellationLine[]>([]);
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  // Reset on new problem
  useEffect(() => {
    setSelectedStar(null);
    setDrawnLines([]);
    setStatus('idle');
    setSelectedOption(null);
  }, [problem.uid]);

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
      // Draw line between selected and tapped
      const newLine = { from: selectedStar, to: starId };
      const newLines = [...drawnLines, newLine];
      setDrawnLines(newLines);
      setSelectedStar(null);
      playSound('connect', soundEnabled);

      // Check if constellation complete
      checkCompletion(newLines);
    }
  };

  // Check if constellation is complete
  const checkCompletion = (lines: ConstellationLine[]) => {
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
      }, 1500);
    }
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
    } else {
      playSound('error', soundEnabled);
    }

    setTimeout(() => {
      onAnswer(isCorrect);
    }, isCorrect ? 1500 : 2000);
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
    const key = `starMapper.instructions.${problem.mode}` as const;
    return t(key);
  };

  // Calculate remaining lines for trace/build modes
  const linesRemaining = problem.constellation.lines.length - drawnLines.length;

  return (
    <div className="w-full flex flex-col items-center px-4 sm:px-6 max-w-2xl mx-auto pt-4 sm:pt-6 animate-in fade-in duration-300">
      {/* Header - Constellation name */}
      <div className="mb-4 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-white drop-shadow-glow">
          {problem.constellation.nameEt}
        </h2>
        <p className="text-sm text-blue-200 opacity-80">
          {problem.constellation.nameEn}
        </p>
        {problem.constellation.folkNameEt && (
          <p className="text-xs text-blue-300 opacity-70 italic">
            ({problem.constellation.folkNameEt})
          </p>
        )}
      </div>

      {/* Instructions */}
      <div className="mb-3 text-center">
        <p className="text-sm sm:text-base text-blue-100">
          {getInstructions()}
        </p>
        {(problem.mode === 'trace' || problem.mode === 'build' || problem.mode === 'expert') && (
          <p className="text-xs sm:text-sm text-blue-200 mt-1">
            {t('starMapper.linesRemaining').replace('{count}', String(linesRemaining))}
          </p>
        )}
      </div>

      {/* Star Field */}
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
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white opacity-20 animate-twinkle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${1 + Math.random() * 2}px`,
                height: `${1 + Math.random() * 2}px`,
                animationDelay: `${Math.random() * 3}s`,
              }}
            />
          ))}
        </div>

        {/* SVG for lines and stars */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Guide lines (trace mode) */}
          {problem.showGuide &&
            problem.constellation.lines.map((line, idx) => {
              const fromStar = problem.constellation.stars.find(s => s.id === line.from);
              const toStar = problem.constellation.stars.find(s => s.id === line.to);
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
            const fromStar = problem.constellation.stars.find(s => s.id === line.from);
            const toStar = problem.constellation.stars.find(s => s.id === line.to);
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

          {/* Constellation stars */}
          {problem.constellation.stars.map(star => {
            const isSelected = selectedStar === star.id;
            const isConnected = drawnLines.some(l => l.from === star.id || l.to === star.id);
            const size = getStarSize(star.magnitude);
            const color = getStarColor(star.magnitude);

            return (
              <g key={star.id}>
                <circle
                  cx={star.x}
                  cy={star.y}
                  r={size * 0.5}
                  fill={color}
                  filter={isSelected || (status === 'correct' && isConnected) ? 'url(#glow)' : undefined}
                  className={`cursor-pointer transition-all ${
                    isSelected ? 'animate-pulse' : ''
                  } ${status === 'correct' ? 'animate-twinkle' : ''}`}
                  onClick={() => handleStarTap(star.id)}
                  style={{
                    transform: isSelected ? 'scale(1.5)' : 'scale(1)',
                    transformOrigin: 'center',
                  }}
                />
                {isSelected && (
                  <circle
                    cx={star.x}
                    cy={star.y}
                    r={size * 0.8}
                    fill="none"
                    stroke="#88ddff"
                    strokeWidth="0.5"
                    className="animate-ping"
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
        </svg>

        {/* Success animation overlay */}
        {status === 'correct' && (
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-500/20 to-transparent animate-pulse pointer-events-none" />
        )}
      </div>

      {/* Identify mode options */}
      {problem.mode === 'identify' && problem.options && (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full max-w-md mt-4">
          {problem.options.map((optionId) => {
            const constellation = require('../../games/constellations').getConstellationById(optionId);
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

      {/* Completion message */}
      {status === 'correct' && (problem.mode === 'trace' || problem.mode === 'build' || problem.mode === 'expert') && (
        <div className="mt-4 text-center animate-bounce">
          <p className="text-xl sm:text-2xl font-bold text-green-400">
            {t('starMapper.complete')}
          </p>
        </div>
      )}
    </div>
  );
};
