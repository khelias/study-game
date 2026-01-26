import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { playSound } from '../engine/audio';
import { useTranslation } from '../i18n/useTranslation';
import { useProfileText } from '../hooks/useProfileText';
import { ControlPad } from './ControlPad';
import type { Direction, MathSnakeProblem } from '../types/game';

interface MathSnakeViewProps {
  problem: MathSnakeProblem;
  onAnswer: (answer: boolean) => void;
  onMove?: (direction: Direction) => void;
  soundEnabled: boolean;
  level?: number;
  gameType?: string;
}

export const MathSnakeView: React.FC<MathSnakeViewProps> = ({ problem, onAnswer, onMove, soundEnabled, level = 1, gameType }) => {
  const t = useTranslation();
  const { formatText } = useProfileText();
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
  
  // Reset status when problem changes
  React.useEffect(() => {
    setStatus('idle');
  }, [problem.uid]);

  const snakeSegments = useMemo(() => {
    const map = new Map<string, { type: 'head' | 'body' | 'tail'; prev?: [number, number]; next?: [number, number] }>();
    problem.snake.forEach((pos, index) => {
      const prev = index > 0 ? problem.snake[index - 1] : undefined;
      const next = index < problem.snake.length - 1 ? problem.snake[index + 1] : undefined;
      map.set(`${pos[0]},${pos[1]}`, {
        type: index === 0 ? 'head' : index === problem.snake.length - 1 ? 'tail' : 'body',
        prev,
        next,
      });
    });
    return map;
  }, [problem.snake]);

  const handleAnswerClick = useCallback((value: number) => {
    if (!problem.math || status !== 'idle') return;
    const isCorrect = value === problem.math.answer;
    playSound(isCorrect ? 'correct' : 'wrong', soundEnabled);
    setStatus(isCorrect ? 'correct' : 'wrong');
    setTimeout(() => {
      onAnswer(isCorrect);
      setStatus('idle');
    }, 350);
  }, [onAnswer, problem.math, soundEnabled, status]);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent): void => {
      if (!onMove || problem.math || status !== 'idle') return;
      if ((event.target as HTMLElement).tagName === 'INPUT' || (event.target as HTMLElement).tagName === 'TEXTAREA') return;
      let direction: Direction | null = null;
      if (event.key === 'ArrowUp' || event.key === 'w' || event.key === 'W') direction = 'UP';
      if (event.key === 'ArrowDown' || event.key === 's' || event.key === 'S') direction = 'DOWN';
      if (event.key === 'ArrowLeft' || event.key === 'a' || event.key === 'A') direction = 'LEFT';
      if (event.key === 'ArrowRight' || event.key === 'd' || event.key === 'D') direction = 'RIGHT';
      if (!direction) return;
      event.preventDefault();
      onMove(direction);
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [onMove, problem.math, status]);

  const getDir = (from?: [number, number], to?: [number, number]): 'up' | 'down' | 'left' | 'right' | null => {
    if (!from || !to) return null;
    if (to[0] === from[0] && to[1] === from[1] - 1) return 'up';
    if (to[0] === from[0] && to[1] === from[1] + 1) return 'down';
    if (to[0] === from[0] - 1 && to[1] === from[1]) return 'left';
    if (to[0] === from[0] + 1 && to[1] === from[1]) return 'right';
    return null;
  };

  const renderCell = (x: number, y: number): React.ReactNode => {
    const key = `${x},${y}`;
    const segment = snakeSegments.get(key);
    const isHead = segment?.type === 'head';
    const isBody = segment?.type === 'body';
    const isTail = segment?.type === 'tail';
    const apple = problem.apple && problem.apple.pos[0] === x && problem.apple.pos[1] === y ? problem.apple : null;
    const connectionDirs = segment
      ? [getDir([x, y], segment.prev), getDir([x, y], segment.next)].filter(Boolean)
      : [];
    const headDir = segment?.type === 'head' ? getDir(segment.next, [x, y]) : null;

    const connectorStyle = (dir: 'up' | 'down' | 'left' | 'right'): React.CSSProperties => {
      switch (dir) {
        case 'up': return { top: 0, left: '50%', width: '52%', height: '52%', transform: 'translateX(-50%)' };
        case 'down': return { bottom: 0, left: '50%', width: '52%', height: '52%', transform: 'translateX(-50%)' };
        case 'left': return { left: 0, top: '50%', width: '52%', height: '52%', transform: 'translateY(-50%)' };
        case 'right': return { right: 0, top: '50%', width: '52%', height: '52%', transform: 'translateY(-50%)' };
      }
    };

    const headRotation = (): string => {
      if (headDir === 'right') return '90deg';
      if (headDir === 'down') return '180deg';
      if (headDir === 'left') return '-90deg';
      return '0deg';
    };

    const tailDir = segment?.type === 'tail' ? getDir([x, y], segment.prev) : null;
    const tailTipStyle = (): React.CSSProperties => {
      switch (tailDir) {
        case 'up': return { bottom: '8%', left: '50%', transform: 'translate(-50%, 50%)' };
        case 'down': return { top: '8%', left: '50%', transform: 'translate(-50%, -50%)' };
        case 'left': return { right: '8%', top: '50%', transform: 'translate(50%, -50%)' };
        case 'right': return { left: '8%', top: '50%', transform: 'translate(-50%, -50%)' };
        default: return { bottom: '10%', left: '50%', transform: 'translate(-50%, 50%)' };
      }
    };

    return (
      <div
        key={key}
        className="relative w-full aspect-square rounded-md border border-slate-300/50 bg-gradient-to-br from-slate-50 via-white to-slate-50 shadow-sm flex items-center justify-center"
      >
        {apple && (
          <div 
            className="relative flex items-center justify-center animate-bounce-subtle"
            style={{ width: 'clamp(1.5rem, 6vw, 2.5rem)', height: 'clamp(1.5rem, 6vw, 2.5rem)' }}
          >
            {apple.kind === 'math' ? (
              <div 
                className="flex items-center justify-center drop-shadow-lg animate-bounce-subtle"
                style={{ fontSize: 'clamp(1rem, 4vw, 1.5rem)' }}
              >
                ⭐
              </div>
            ) : (
              <div 
                className="flex items-center justify-center drop-shadow-lg animate-bounce-subtle"
                style={{ fontSize: 'clamp(1.25rem, 5vw, 2rem)' }}
              >
                🍎
              </div>
            )}
          </div>
        )}
        {(isBody || isHead || isTail) && (
          <div className="absolute inset-0 flex items-center justify-center">
            {connectionDirs.map((dir, idx) => (
              <div
                key={`${key}-${dir}-${idx}`}
                className="absolute rounded-full bg-gradient-to-br from-emerald-400 via-emerald-500 to-emerald-600 border border-emerald-700/50"
                style={connectorStyle(dir as 'up' | 'down' | 'left' | 'right')}
              />
            ))}
            {isTail && (
              <div 
                className="absolute rounded-full bg-emerald-700/80 shadow-sm" 
                style={{
                  ...tailTipStyle(),
                  width: 'clamp(0.5rem, 2vw, 0.75rem)',
                  height: 'clamp(0.5rem, 2vw, 0.75rem)'
                }}
              ></div>
            )}
            {isHead && (
              <>
                <div
                  className="absolute rounded-full bg-gradient-to-br from-emerald-300 via-emerald-500 to-emerald-700 border-2 border-emerald-800/70"
                  style={{
                    width: 'clamp(1.25rem, 5vw, 2rem)',
                    height: 'clamp(1.25rem, 5vw, 2rem)',
                    transform: `rotate(${headRotation()})`,
                    boxShadow: '0 4px 8px rgba(16,185,129,0.5), inset 0 1px 2px rgba(255,255,255,0.7)',
                  }}
                >
                  <div 
                    className="absolute rounded-full bg-white shadow-sm"
                    style={{
                      top: 'clamp(0.25rem, 1vw, 0.5rem)',
                      left: 'clamp(0.375rem, 1.5vw, 0.625rem)',
                      width: 'clamp(0.375rem, 1.5vw, 0.625rem)',
                      height: 'clamp(0.375rem, 1.5vw, 0.625rem)'
                    }}
                  ></div>
                  <div 
                    className="absolute rounded-full bg-white shadow-sm"
                    style={{
                      top: 'clamp(0.25rem, 1vw, 0.5rem)',
                      right: 'clamp(0.375rem, 1.5vw, 0.625rem)',
                      width: 'clamp(0.375rem, 1.5vw, 0.625rem)',
                      height: 'clamp(0.375rem, 1.5vw, 0.625rem)'
                    }}
                  ></div>
                  <div 
                    className="absolute rounded-full bg-slate-900"
                    style={{
                      top: 'clamp(0.375rem, 1.5vw, 0.625rem)',
                      left: 'clamp(0.5rem, 2vw, 0.875rem)',
                      width: 'clamp(0.125rem, 0.5vw, 0.25rem)',
                      height: 'clamp(0.125rem, 0.5vw, 0.25rem)'
                    }}
                  ></div>
                  <div 
                    className="absolute rounded-full bg-slate-900"
                    style={{
                      top: 'clamp(0.375rem, 1.5vw, 0.625rem)',
                      right: 'clamp(0.5rem, 2vw, 0.875rem)',
                      width: 'clamp(0.125rem, 0.5vw, 0.25rem)',
                      height: 'clamp(0.125rem, 0.5vw, 0.25rem)'
                    }}
                  ></div>
                </div>
                {status === 'wrong' && (
                  <div 
                    className="absolute"
                    style={{
                      top: 'clamp(-0.5rem, -2vw, -0.75rem)',
                      right: 'clamp(-0.5rem, -2vw, -0.75rem)',
                      fontSize: 'clamp(0.875rem, 3vw, 1.25rem)'
                    }}
                  >
                    💥
                  </div>
                )}
                {status === 'correct' && (
                  <div 
                    className="absolute"
                    style={{
                      top: 'clamp(-0.5rem, -2vw, -0.75rem)',
                      right: 'clamp(-0.5rem, -2vw, -0.75rem)',
                      fontSize: 'clamp(0.875rem, 3vw, 1.25rem)'
                    }}
                  >
                    ✨
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    );
  };

  // Calculate level theme colors
  const getLevelTheme = (lvl: number) => {
    if (lvl <= 2) return { bg: 'from-blue-50 via-cyan-50 to-emerald-50', border: 'border-blue-300/60' };
    if (lvl <= 4) return { bg: 'from-emerald-50 via-lime-50 to-amber-50', border: 'border-emerald-300/60' };
    if (lvl <= 6) return { bg: 'from-amber-50 via-orange-50 to-red-50', border: 'border-amber-300/60' };
    return { bg: 'from-red-50 via-pink-50 to-purple-50', border: 'border-red-300/60' };
  };
  
  const levelTheme = getLevelTheme(level);
  
  // Get game title
  const gameTitle = gameType ? (t.games[gameType.replace('_adv', '') as keyof typeof t.games]?.title || gameType) : '';

  return (
    <div className="w-full flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-500 px-2 sm:px-3 md:px-4" style={{ maxWidth: '100vw' }}>
      {/* Game Title Badge */}
      {gameTitle && (
        <div className="w-full mb-2 flex justify-center" style={{ maxWidth: 'min(90vw, 28rem, 100%)' }}>
          <div className="bg-gradient-to-r from-emerald-100 to-green-100 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold shadow-sm text-emerald-800 border border-emerald-300">
            {formatText(gameTitle)}
          </div>
        </div>
      )}

      {/* Game Board - Scales with viewport */}
      <div className="w-full" style={{ maxWidth: 'min(90vw, 28rem, 100%)' }}>
        <div
          className={`relative w-full bg-gradient-to-br ${levelTheme.bg} rounded-2xl sm:rounded-3xl border-2 ${levelTheme.border} shadow-lg`}
          style={{
            padding: 'clamp(0.5rem, 2vw, 1rem)',
            backgroundImage: 'radial-gradient(circle at 20% 20%, rgba(16,185,129,0.1), transparent 50%), radial-gradient(circle at 80% 80%, rgba(251,191,36,0.1), transparent 50%)',
          }}
        >
          <div
            className="grid"
            style={{ 
              gridTemplateColumns: `repeat(${problem.gridSize}, minmax(0, 1fr))`,
              gap: 'clamp(0.25rem, 1vw, 0.5rem)'
            }}
          >
            {Array.from({ length: problem.gridSize }, (_, row) =>
              Array.from({ length: problem.gridSize }, (_, col) => renderCell(col, row))
            )}
          </div>
        </div>
      </div>

      {/* Controls and Math Problem - Better scaling */}
      <div 
        className="w-full mt-3 sm:mt-4 flex flex-col sm:flex-row gap-3 sm:gap-4 items-center sm:items-start"
        style={{ maxWidth: 'min(90vw, 28rem, 100%)' }}
      >
        {/* Control Pad */}
        <div className="flex-shrink-0 w-full sm:w-auto flex justify-center">
          <ControlPad
            onUp={() => onMove?.('UP')}
            onDown={() => onMove?.('DOWN')}
            onLeft={() => onMove?.('LEFT')}
            onRight={() => onMove?.('RIGHT')}
            disabled={!onMove || Boolean(problem.math)}
            compact
          />
        </div>

        {/* Math Problem or Status */}
        <div className="flex-1 w-full sm:w-auto min-w-0">
          {problem.math ? (
            <div 
              className="bg-gradient-to-br from-emerald-50 via-white to-emerald-50 rounded-xl sm:rounded-2xl shadow-lg border-2 border-emerald-300/60"
              style={{ padding: 'clamp(0.75rem, 2.5vw, 1.25rem)' }}
            >
              <div className="text-center mb-2 sm:mb-3">
                <div 
                  className="font-black text-slate-800 tracking-tight whitespace-nowrap"
                  style={{ fontSize: 'clamp(1rem, 4vw, 1.5rem)' }}
                >
                  {problem.math.equation} = ?
                </div>
              </div>
              <div className="flex gap-1.5 sm:gap-2 justify-center items-center flex-wrap">
                {problem.math.options.map(option => (
                  <button
                    key={`${problem.uid}-${option}`}
                    type="button"
                    disabled={status !== 'idle'}
                    onClick={() => handleAnswerClick(option)}
                    className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl border-2 font-black shadow-md transition-all duration-200 active:scale-95 disabled:opacity-50 ${
                      status === 'correct' && option === problem.math?.answer
                        ? 'bg-emerald-500 border-emerald-600 text-white scale-105'
                        : status === 'wrong' && option !== problem.math?.answer
                        ? 'bg-red-100 border-red-300 text-red-700'
                        : 'bg-white border-emerald-300 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-400 hover:shadow-lg'
                    }`}
                    style={{ 
                      minWidth: 'clamp(3rem, 8vw, 4.5rem)',
                      fontSize: 'clamp(0.875rem, 2.5vw, 1rem)'
                    }}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div 
              className="bg-gradient-to-br from-amber-50 via-white to-amber-50 rounded-xl sm:rounded-2xl shadow-lg border-2 border-amber-300/60"
              style={{ padding: 'clamp(0.75rem, 2.5vw, 1.25rem)' }}
            >
              <div className="text-center">
                <div 
                  className="uppercase tracking-wider text-amber-600 font-bold mb-1 sm:mb-2"
                  style={{ fontSize: 'clamp(0.625rem, 2vw, 0.875rem)' }}
                >
                  {formatText(t.gameScreen.mathSnake.nextMathLabel)}
                </div>
                <div 
                  className="font-black text-amber-700"
                  style={{ fontSize: 'clamp(1.5rem, 6vw, 2.5rem)' }}
                >
                  {problem.applesUntilMath}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
