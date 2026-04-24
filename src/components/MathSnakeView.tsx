import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { playSound } from '../engine/audio';
import { useTranslation } from '../i18n/useTranslation';
import { ControlPad } from './ControlPad';
import { GameProblemModal, PaidHintButtons } from './shared';
import { GAME_CONFIG } from '../games/data';
import type { Direction, MathSnakeProblem } from '../types/game';

interface MathSnakeViewProps {
  problem: MathSnakeProblem;
  onAnswer: (answer: boolean) => void;
  onMove?: (direction: Direction) => void;
  soundEnabled: boolean;
  level?: number;
  gameType?: string;
  stars?: number;
  spendStars?: (count: number) => boolean;
}

export const MathSnakeView: React.FC<MathSnakeViewProps> = ({
  problem,
  onAnswer,
  onMove,
  soundEnabled,
  level = 1,
  gameType,
  stars = 0,
  spendStars,
}) => {
  const t = useTranslation();
  const baseType = gameType?.replace('_adv', '') ?? 'math_snake';
  const gameConfig = GAME_CONFIG[baseType];
  const paidHints = gameConfig?.paidHints ?? [];
  const visualTheme = gameConfig?.visualTheme;
  const normalEmoji = visualTheme?.normalCollectibleEmoji ?? '🍎';
  const challengeEmoji = visualTheme?.challengeCollectibleEmoji ?? '🧮';
  const isCosmic = visualTheme?.background === 'cosmic';
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [justAte, setJustAte] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [eliminatedOptions, setEliminatedOptions] = useState<number[]>([]);
  const eliminatedRef = useRef<number[]>([]);
  const prevSnakeLengthRef = useRef(problem.snake.length);

  useEffect(() => {
    eliminatedRef.current = eliminatedOptions;
  }, [eliminatedOptions]);

  // Reset status and eliminated options when problem or math challenge changes
  React.useEffect(() => {
    setStatus('idle');
    setSelectedOption(null);
    setEliminatedOptions([]);
    eliminatedRef.current = [];
  }, [problem.uid, problem.math]);

  // Detect when snake eats and trigger animation
  useEffect(() => {
    if (problem.snake.length > prevSnakeLengthRef.current) {
      prevSnakeLengthRef.current = problem.snake.length;
      // Use setTimeout to defer state update and avoid cascading renders
      const ateTimer = setTimeout(() => setJustAte(true), 0);
      const resetTimer = setTimeout(() => setJustAte(false), 400);
      return () => {
        clearTimeout(ateTimer);
        clearTimeout(resetTimer);
      };
    }
    prevSnakeLengthRef.current = problem.snake.length;
    return undefined;
  }, [problem.snake.length]);

  const snakeSegments = useMemo(() => {
    const map = new Map<
      string,
      {
        type: 'head' | 'body' | 'tail';
        prev?: [number, number];
        next?: [number, number];
        index: number;
      }
    >();
    problem.snake.forEach((pos, index) => {
      const prev = index > 0 ? problem.snake[index - 1] : undefined;
      const next = index < problem.snake.length - 1 ? problem.snake[index + 1] : undefined;
      map.set(`${pos[0]},${pos[1]}`, {
        type: index === 0 ? 'head' : index === problem.snake.length - 1 ? 'tail' : 'body',
        prev,
        next,
        index,
      });
    });
    return map;
  }, [problem.snake]);

  const handleAnswerClick = useCallback(
    (value: number) => {
      if (!problem.math || status !== 'idle') return;
      const isCorrect = value === problem.math.answer;
      setSelectedOption(value);
      playSound(isCorrect ? 'correct' : 'wrong', soundEnabled);
      setStatus(isCorrect ? 'correct' : 'wrong');
      setTimeout(() => {
        onAnswer(isCorrect);
        setStatus('idle');
        setSelectedOption(null);
      }, 800);
    },
    [onAnswer, problem.math, soundEnabled, status],
  );

  const handlePaidHint = useCallback(
    (hintId: string) => {
      if (hintId !== 'eliminate' || !spendStars || !problem.math) return;
      const correctIndex = problem.math.options.indexOf(problem.math.answer);
      const wrongIndices = problem.math.options
        .map((_, idx) => (idx !== correctIndex ? idx : -1))
        .filter((i) => i >= 0 && !eliminatedRef.current.includes(i));
      if (wrongIndices.length === 0) return;
      if (!spendStars(1)) return;
      const pick = wrongIndices[Math.floor(Math.random() * wrongIndices.length)] as number;
      setEliminatedOptions((prev) => {
        const next = [...prev, pick];
        eliminatedRef.current = next;
        return next;
      });
    },
    [problem.math, spendStars],
  );

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent): void => {
      if (!onMove || problem.math || status !== 'idle') return;
      if (
        (event.target as HTMLElement).tagName === 'INPUT' ||
        (event.target as HTMLElement).tagName === 'TEXTAREA'
      )
        return;
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

  const getDir = (
    from?: [number, number],
    to?: [number, number],
  ): 'up' | 'down' | 'left' | 'right' | null => {
    if (!from || !to) return null;
    if (to[0] === from[0] && to[1] === from[1] - 1) return 'up';
    if (to[0] === from[0] && to[1] === from[1] + 1) return 'down';
    if (to[0] === from[0] - 1 && to[1] === from[1]) return 'left';
    if (to[0] === from[0] + 1 && to[1] === from[1]) return 'right';
    return null;
  };

  const getSegmentColors = (index: number, isHead: boolean, isTail: boolean) => {
    if (isHead) {
      return {
        gradient: 'from-emerald-300 via-emerald-500 to-emerald-700',
        border: 'border-emerald-800/70',
        shadow: '0 4px 8px rgba(16,185,129,0.5), inset 0 1px 2px rgba(255,255,255,0.7)',
      };
    }
    if (isTail) {
      return {
        gradient: 'from-emerald-400 via-emerald-500 to-emerald-600',
        border: 'border-emerald-700/50',
        shadow: '0 2px 4px rgba(16,185,129,0.3)',
      };
    }
    // Alternating pattern for body segments
    const isEven = index % 2 === 0;
    return isEven
      ? {
          gradient: 'from-emerald-300 via-emerald-400 to-emerald-500',
          border: 'border-emerald-600/50',
          shadow: '0 2px 4px rgba(16,185,129,0.4)',
        }
      : {
          gradient: 'from-emerald-500 via-emerald-600 to-emerald-700',
          border: 'border-emerald-800/50',
          shadow: '0 2px 4px rgba(16,185,129,0.5)',
        };
  };

  const renderCell = (x: number, y: number): React.ReactNode => {
    const key = `${x},${y}`;
    const segment = snakeSegments.get(key);
    const isHead = segment?.type === 'head';
    const isBody = segment?.type === 'body';
    const isTail = segment?.type === 'tail';
    const apple =
      problem.apple && problem.apple.pos[0] === x && problem.apple.pos[1] === y
        ? problem.apple
        : null;
    const connectionDirs = segment
      ? [getDir([x, y], segment.prev), getDir([x, y], segment.next)].filter(Boolean)
      : [];
    const headDir = segment?.type === 'head' ? getDir(segment.next, [x, y]) : null;

    const connectorStyle = (dir: 'up' | 'down' | 'left' | 'right'): React.CSSProperties => {
      switch (dir) {
        case 'up':
          return {
            top: 0,
            left: '50%',
            width: '52%',
            height: '52%',
            transform: 'translateX(-50%)',
          };
        case 'down':
          return {
            bottom: 0,
            left: '50%',
            width: '52%',
            height: '52%',
            transform: 'translateX(-50%)',
          };
        case 'left':
          return {
            left: 0,
            top: '50%',
            width: '52%',
            height: '52%',
            transform: 'translateY(-50%)',
          };
        case 'right':
          return {
            right: 0,
            top: '50%',
            width: '52%',
            height: '52%',
            transform: 'translateY(-50%)',
          };
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
        case 'up':
          return { bottom: '8%', left: '50%', transform: 'translate(-50%, 50%)' };
        case 'down':
          return { top: '8%', left: '50%', transform: 'translate(-50%, -50%)' };
        case 'left':
          return { right: '8%', top: '50%', transform: 'translate(50%, -50%)' };
        case 'right':
          return { left: '8%', top: '50%', transform: 'translate(-50%, -50%)' };
        default:
          return { bottom: '10%', left: '50%', transform: 'translate(-50%, 50%)' };
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
                style={{
                  fontSize: 'clamp(1rem, 4vw, 1.5rem)',
                  filter:
                    'drop-shadow(0 0 8px rgba(59, 130, 246, 0.6)) drop-shadow(0 0 12px rgba(59, 130, 246, 0.4))',
                }}
              >
                {challengeEmoji}
              </div>
            ) : (
              <div
                className="flex items-center justify-center drop-shadow-lg animate-bounce-subtle"
                style={{
                  fontSize: 'clamp(1.25rem, 5vw, 2rem)',
                  filter:
                    'drop-shadow(0 0 6px rgba(239, 68, 68, 0.5)) drop-shadow(0 0 10px rgba(239, 68, 68, 0.3))',
                }}
              >
                {normalEmoji}
              </div>
            )}
          </div>
        )}
        {(isBody || isHead || isTail) && segment && (
          <div className="absolute inset-0 flex items-center justify-center">
            {connectionDirs.map((dir, idx) => {
              const colors = getSegmentColors(segment.index, isHead, isTail);
              return (
                <div
                  key={`${key}-${dir}-${idx}`}
                  className={`absolute rounded-full bg-gradient-to-br ${colors.gradient} border ${colors.border}`}
                  style={{
                    ...connectorStyle(dir as 'up' | 'down' | 'left' | 'right'),
                    boxShadow: colors.shadow,
                  }}
                >
                  {/* Scale pattern overlay for body segments */}
                  {isBody && (
                    <div
                      className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent"
                      style={{ transform: 'translateY(-15%)' }}
                    />
                  )}
                </div>
              );
            })}
            {isTail && (
              <div
                className="absolute rounded-full bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-800 shadow-sm"
                style={{
                  ...tailTipStyle(),
                  width: 'clamp(0.5rem, 2vw, 0.75rem)',
                  height: 'clamp(0.5rem, 2vw, 0.75rem)',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.3), inset 0 1px 1px rgba(255,255,255,0.2)',
                }}
              >
                {/* Highlight on tail tip */}
                <div
                  className="absolute inset-0 rounded-full bg-gradient-to-br from-white/30 to-transparent"
                  style={{ transform: 'translateY(-20%)' }}
                />
              </div>
            )}
            {isHead && (
              <>
                {/* Glow ring when eating */}
                {justAte && (
                  <div
                    className="absolute rounded-full border-4 border-emerald-400 animate-ping"
                    style={{
                      width: 'clamp(2rem, 8vw, 3.5rem)',
                      height: 'clamp(2rem, 8vw, 3.5rem)',
                    }}
                  />
                )}
                <div
                  className="absolute rounded-full bg-gradient-to-br from-emerald-300 via-emerald-500 to-emerald-700 border-2 border-emerald-800/70 transition-transform duration-200"
                  style={{
                    width: 'clamp(1.25rem, 5vw, 2rem)',
                    height: 'clamp(1.25rem, 5vw, 2rem)',
                    transform: `rotate(${headRotation()}) ${justAte && segment && segment.index < 3 ? 'scale(1.15)' : ''}`,
                    boxShadow:
                      '0 4px 8px rgba(16,185,129,0.5), inset 0 1px 2px rgba(255,255,255,0.7)',
                  }}
                >
                  {/* Shine/highlight overlay on head */}
                  <div
                    className="absolute inset-0 rounded-full bg-gradient-to-br from-white/40 to-transparent"
                    style={{ transform: 'translateY(-15%)' }}
                  />
                  {/* Eyes - white background with inset shadow */}
                  <div
                    className="absolute rounded-full bg-white"
                    style={{
                      top: 'clamp(0.25rem, 1vw, 0.5rem)',
                      left: 'clamp(0.2rem, 0.8vw, 0.4rem)',
                      width: 'clamp(0.375rem, 1.5vw, 0.625rem)',
                      height: 'clamp(0.375rem, 1.5vw, 0.625rem)',
                      boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.2)',
                    }}
                  ></div>
                  <div
                    className="absolute rounded-full bg-white"
                    style={{
                      top: 'clamp(0.25rem, 1vw, 0.5rem)',
                      right: 'clamp(0.2rem, 0.8vw, 0.4rem)',
                      width: 'clamp(0.375rem, 1.5vw, 0.625rem)',
                      height: 'clamp(0.375rem, 1.5vw, 0.625rem)',
                      boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.2)',
                    }}
                  ></div>
                  {/* Pupils - dilate when eating */}
                  <div
                    className={`absolute rounded-full bg-slate-900 transition-transform duration-200 ${justAte ? 'scale-125' : ''}`}
                    style={{
                      top: 'clamp(0.375rem, 1.5vw, 0.625rem)',
                      left: 'clamp(0.35rem, 1.4vw, 0.6rem)',
                      width: 'clamp(0.125rem, 0.5vw, 0.25rem)',
                      height: 'clamp(0.125rem, 0.5vw, 0.25rem)',
                    }}
                  ></div>
                  <div
                    className={`absolute rounded-full bg-slate-900 transition-transform duration-200 ${justAte ? 'scale-125' : ''}`}
                    style={{
                      top: 'clamp(0.375rem, 1.5vw, 0.625rem)',
                      right: 'clamp(0.35rem, 1.4vw, 0.6rem)',
                      width: 'clamp(0.125rem, 0.5vw, 0.25rem)',
                      height: 'clamp(0.125rem, 0.5vw, 0.25rem)',
                    }}
                  ></div>
                  {/* Tongue when eating */}
                  {justAte && (
                    <div
                      className="absolute bg-red-500 rounded-full"
                      style={{
                        bottom: 'clamp(0.125rem, 0.5vw, 0.25rem)',
                        left: '50%',
                        width: 'clamp(0.25rem, 1vw, 0.375rem)',
                        height: 'clamp(0.375rem, 1.5vw, 0.625rem)',
                        transform: 'translateX(-50%) translateY(50%)',
                      }}
                    />
                  )}
                </div>
                {/* +1 indicator when eating */}
                {justAte && (
                  <div
                    className="absolute font-bold text-emerald-600 animate-ping"
                    style={{
                      top: 'clamp(-1rem, -4vw, -1.5rem)',
                      left: 'clamp(-0.5rem, -2vw, -0.75rem)',
                      fontSize: 'clamp(0.75rem, 3vw, 1rem)',
                    }}
                  >
                    +1
                  </div>
                )}
                {/* Sparkle particles when eating */}
                {justAte && (
                  <>
                    <div
                      className="absolute animate-ping"
                      style={{
                        top: 'clamp(-0.75rem, -3vw, -1rem)',
                        right: 'clamp(-0.5rem, -2vw, -0.75rem)',
                        fontSize: 'clamp(0.625rem, 2.5vw, 0.875rem)',
                      }}
                    >
                      ✨
                    </div>
                    <div
                      className="absolute animate-ping"
                      style={{
                        bottom: 'clamp(-0.5rem, -2vw, -0.75rem)',
                        left: 'clamp(-0.75rem, -3vw, -1rem)',
                        fontSize: 'clamp(0.625rem, 2.5vw, 0.875rem)',
                        animationDelay: '0.1s',
                      }}
                    >
                      ✨
                    </div>
                  </>
                )}
                {status === 'wrong' && (
                  <div
                    className="absolute animate-bounce"
                    style={{
                      top: 'clamp(-0.5rem, -2vw, -0.75rem)',
                      right: 'clamp(-0.5rem, -2vw, -0.75rem)',
                      fontSize: 'clamp(0.875rem, 3vw, 1.25rem)',
                    }}
                  >
                    💥
                  </div>
                )}
                {status === 'correct' && (
                  <div
                    className="absolute animate-spin"
                    style={{
                      top: 'clamp(-0.5rem, -2vw, -0.75rem)',
                      right: 'clamp(-0.5rem, -2vw, -0.75rem)',
                      fontSize: 'clamp(0.875rem, 3vw, 1.25rem)',
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

  // Calculate level theme colors. Cosmic theme (multiplication_snake et al)
  // replaces pastel level gradient with a starry night background.
  const getLevelTheme = (lvl: number) => {
    if (isCosmic) {
      return { bg: 'from-indigo-950 via-slate-900 to-violet-950', border: 'border-indigo-400/40' };
    }
    if (lvl <= 2)
      return { bg: 'from-blue-50 via-cyan-50 to-emerald-50', border: 'border-blue-300/60' };
    if (lvl <= 4)
      return { bg: 'from-emerald-50 via-lime-50 to-amber-50', border: 'border-emerald-300/60' };
    if (lvl <= 6)
      return { bg: 'from-amber-50 via-orange-50 to-red-50', border: 'border-amber-300/60' };
    return { bg: 'from-red-50 via-pink-50 to-purple-50', border: 'border-red-300/60' };
  };

  const levelTheme = getLevelTheme(level);

  // Prepare modal options
  const modalOptions = problem.math ? problem.math.options.map(String) : [];
  const correctIndex = problem.math ? problem.math.options.indexOf(problem.math.answer) : -1;
  const selectedIndex =
    problem.math && selectedOption !== null ? problem.math.options.indexOf(selectedOption) : null;

  return (
    <div className="w-full flex flex-col items-center px-4 sm:px-6 max-w-2xl mx-auto pt-4 sm:pt-6 animate-in fade-in duration-300">
      {/* Math Problem Modal */}
      {problem.math && (
        <GameProblemModal
          isOpen={true}
          title={t.gameScreen.mathSnake.nextMathLabel}
          prompt={
            problem.math.equation.includes('=')
              ? problem.math.equation
              : `${problem.math.equation} = ?`
          }
          options={modalOptions}
          correctIndex={correctIndex}
          selectedOption={selectedIndex}
          onOptionSelect={(idx) => handleAnswerClick(problem.math!.options[idx]!)}
          disabled={status !== 'idle'}
          icon="🧮"
          eliminatedIndices={eliminatedOptions}
        >
          {paidHints.length > 0 && (
            <PaidHintButtons
              hints={paidHints}
              stars={stars}
              onHintClick={handlePaidHint}
              disabled={status !== 'idle'}
            />
          )}
        </GameProblemModal>
      )}

      {/* Game Board - Scales with viewport */}
      <div className="w-full" style={{ maxWidth: 'min(90vw, 28rem, 100%)' }}>
        <div
          className={`relative w-full bg-gradient-to-br ${levelTheme.bg} rounded-2xl sm:rounded-3xl border-2 ${levelTheme.border} shadow-lg`}
          style={{
            padding: 'clamp(0.5rem, 2vw, 1rem)',
            backgroundImage:
              'radial-gradient(circle at 20% 20%, rgba(16,185,129,0.1), transparent 50%), radial-gradient(circle at 80% 80%, rgba(251,191,36,0.1), transparent 50%)',
          }}
        >
          <div
            className="grid"
            style={{
              gridTemplateColumns: `repeat(${problem.gridSize}, minmax(0, 1fr))`,
              gap: 'clamp(0.25rem, 1vw, 0.5rem)',
            }}
          >
            {Array.from({ length: problem.gridSize }, (_, row) =>
              Array.from({ length: problem.gridSize }, (_, col) => renderCell(col, row)),
            )}
          </div>
        </div>
      </div>

      {/* Control Pad - Below game board */}
      <div
        className="w-full mt-3 sm:mt-4 flex justify-center"
        style={{ maxWidth: 'min(90vw, 28rem, 100%)' }}
      >
        <ControlPad
          onUp={() => onMove?.('UP')}
          onDown={() => onMove?.('DOWN')}
          onLeft={() => onMove?.('LEFT')}
          onRight={() => onMove?.('RIGHT')}
          disabled={!onMove || Boolean(problem.math)}
          compact
        />
      </div>
    </div>
  );
};
