/**
 * ShapeDashView – Geometry Dash–inspired runner (canvas-based).
 * Space or tap to jump; obstacles on ground; checkpoints ask geometry questions.
 *
 * Refactored: single continuous game loop (started once on mount), all mutable
 * state in refs so the loop is never torn down by React re-renders.
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { playSound } from '../../engine/audio';
import {
  GRAVITY,
  JUMP_VELOCITY,
  SPIKE_WIDTH,
  SPIKE_HEIGHT,
  BLOCK_DEFAULT_HEIGHT,
} from '../../engine/shapeDash';
import { getReachedCheckpointIndex, hasReachedFinish } from '../../engine/shapeDash';
import { useTranslation } from '../../i18n/useTranslation';
import { GameProblemModal } from '../shared';
import type { ShapeDashProblem } from '../../types/game';

type AnswerHandler = (answer: boolean) => void;

interface ShapeDashViewProps {
  problem: ShapeDashProblem;
  onAnswer: AnswerHandler;
  soundEnabled: boolean;
  gameType?: string;
}

const CANVAS_WIDTH = 560;
const CANVAS_HEIGHT = 360;
const GROUND_Y = CANVAS_HEIGHT - 80;
const PLAYER_X = 120;
const PLAYER_SIZE = 44;

export const ShapeDashView: React.FC<ShapeDashViewProps> = ({
  problem,
  onAnswer,
  soundEnabled,
}) => {
  const t = useTranslation();
  const [gameState, setGameState] = useState<'playing' | 'checkpoint' | 'crashed' | 'won'>('playing');
  const [checkpointIndex, setCheckpointIndex] = useState<number | null>(null);
  const [checkpointOption, setCheckpointOption] = useState<number | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const problemRef = useRef(problem);
  const onAnswerRef = useRef(onAnswer);
  const soundEnabledRef = useRef(soundEnabled);
  const scrollRef = useRef(0);
  const playerYRef = useRef(GROUND_Y - PLAYER_SIZE);
  const playerVelYRef = useRef(0);
  const jumpRequestedRef = useRef(false);
  const passedCheckpointsRef = useRef<Set<number>>(new Set());
  const lastTimeRef = useRef(0);
  const gameStateRef = useRef(gameState);
  const setGameStateRef = useRef(setGameState);
  const canDoubleJumpRef = useRef(true);

  useEffect(() => {
    problemRef.current = problem;
    onAnswerRef.current = onAnswer;
    soundEnabledRef.current = soundEnabled;
    gameStateRef.current = gameState;
    setGameStateRef.current = setGameState;
  }, [problem, onAnswer, soundEnabled, gameState]);

  const doRetry = useCallback(() => {
    scrollRef.current = 0;
    playerYRef.current = GROUND_Y - PLAYER_SIZE;
    playerVelYRef.current = 0;
    jumpRequestedRef.current = false;
    canDoubleJumpRef.current = true;
    passedCheckpointsRef.current = new Set();
    setGameStateRef.current('playing');
    playSound('tap', soundEnabledRef.current);
  }, []);

  const requestJump = useCallback(() => {
    jumpRequestedRef.current = true;
    const onGround = playerYRef.current + PLAYER_SIZE >= GROUND_Y - 4;
    if (gameStateRef.current === 'playing') {
      if (onGround) {
        playerVelYRef.current = JUMP_VELOCITY;
      } else if (canDoubleJumpRef.current) {
        playerVelYRef.current = JUMP_VELOCITY;
        canDoubleJumpRef.current = false;
      }
    }
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.code !== 'Space' && e.key !== ' ') return;
      e.preventDefault();
      e.stopPropagation();
      if (gameStateRef.current === 'crashed') {
        doRetry();
        return;
      }
      requestJump();
    };
    window.addEventListener('keydown', handleKey, true);
    return () => window.removeEventListener('keydown', handleKey, true);
  }, [requestJump, doRetry]);

  useEffect(() => {
    scrollRef.current = 0;
    playerYRef.current = GROUND_Y - PLAYER_SIZE;
    playerVelYRef.current = 0;
    jumpRequestedRef.current = false;
    canDoubleJumpRef.current = true;
    passedCheckpointsRef.current = new Set();
    const id = setTimeout(() => {
      setGameState('playing');
      setCheckpointIndex(null);
      setCheckpointOption(null);
    }, 0);
    return () => clearTimeout(id);
  }, [problem.uid]);

  useEffect(() => {
    containerRef.current?.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let rafId = 0;

    const loop = (time: number) => {
      rafId = requestAnimationFrame(loop);

      const prob = problemRef.current;
      const obstacles = prob.obstacles ?? [];
      const checkpoints = prob.checkpoints ?? [];

      if (gameStateRef.current !== 'playing') {
        return;
      }

      const dt = Math.min(0.032, (time - lastTimeRef.current) / 1000);
      lastTimeRef.current = time;

      const nextScroll = scrollRef.current + prob.scrollSpeed * dt;
      let py = playerYRef.current;
      let pvy = playerVelYRef.current;

      if (jumpRequestedRef.current) {
        jumpRequestedRef.current = false;
        const onGround = py + PLAYER_SIZE >= GROUND_Y - 4;
        if (onGround) {
          pvy = JUMP_VELOCITY;
          canDoubleJumpRef.current = true;
          playSound('tap', soundEnabledRef.current);
        } else if (canDoubleJumpRef.current) {
          pvy = JUMP_VELOCITY;
          canDoubleJumpRef.current = false;
          playSound('tap', soundEnabledRef.current);
        }
      }
      if (py + PLAYER_SIZE >= GROUND_Y) {
        canDoubleJumpRef.current = true;
      }

      pvy += GRAVITY * dt;
      py += pvy * dt;

      if (py + PLAYER_SIZE >= GROUND_Y) {
        py = GROUND_Y - PLAYER_SIZE;
        pvy = 0;
      }

      playerYRef.current = py;
      playerVelYRef.current = pvy;
      scrollRef.current = nextScroll;

      const playerLeft = PLAYER_X;
      const playerRight = PLAYER_X + PLAYER_SIZE;
      const playerTop = py;
      const playerBottom = py + PLAYER_SIZE;

      // Only collide when falling or on ground. While moving up (pvy < 0) we give grace.
      let collision = false;
      if (pvy >= 0) {
        for (const obs of obstacles) {
          const obsScreenX = obs.x - nextScroll;
          const offsetY = obs.offsetY ?? 0;
          if (obs.type === 'circle') {
            const r = obs.radius ?? 18;
            const cx = obsScreenX + r;
            const cy = GROUND_Y - r - offsetY;
            if (obsScreenX + r * 2 < -20 || obsScreenX > CANVAS_WIDTH + 20) continue;
            const closestX = Math.max(playerLeft, Math.min(cx, playerRight));
            const closestY = Math.max(playerTop, Math.min(cy, playerBottom));
            const distSq = (closestX - cx) ** 2 + (closestY - cy) ** 2;
            if (distSq < (r + 4) ** 2) collision = true;
            if (collision) break;
          } else {
            const w = SPIKE_WIDTH;
            const h = obs.type === 'spike' ? SPIKE_HEIGHT : (obs.height ?? BLOCK_DEFAULT_HEIGHT);
            const obsLeft = obsScreenX;
            const obsRight = obsScreenX + w;
            const obsTop = GROUND_Y - h - offsetY;
            const obsBottom = GROUND_Y - offsetY;
            if (obsScreenX + w < -20 || obsScreenX > CANVAS_WIDTH + 20) continue;
            if (playerRight > obsLeft + 4 && playerLeft + 4 < obsRight && playerBottom > obsTop + 4 && playerTop + 4 < obsBottom) {
              collision = true;
              break;
            }
          }
        }
      }

      if (collision) {
        setGameState('crashed');
        playSound('wrong', soundEnabledRef.current);
        onAnswerRef.current(false);
        return;
      }

      const cpIdx = getReachedCheckpointIndex(PLAYER_X, checkpoints, nextScroll, passedCheckpointsRef.current);
      if (cpIdx !== null) {
        passedCheckpointsRef.current.add(cpIdx);
        setCheckpointIndex(cpIdx);
        setCheckpointOption(null);
        setGameState('checkpoint');
        return;
      }

      if (hasReachedFinish(nextScroll, prob.runLength)) {
        setGameState('won');
        playSound('win', soundEnabledRef.current);
        setTimeout(() => onAnswerRef.current(true), 800);
        return;
      }

      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Sky gradient
      const skyGrad = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
      skyGrad.addColorStop(0, '#0e7490');
      skyGrad.addColorStop(0.5, '#0891b2');
      skyGrad.addColorStop(1, '#06b6d4');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, CANVAS_WIDTH, GROUND_Y);

      // Distant grid (parallax)
      const gridOffset = (nextScroll * 0.2) % 48;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 1;
      for (let x = -gridOffset; x < CANVAS_WIDTH + 48; x += 48) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, GROUND_Y);
        ctx.stroke();
      }

      // Ground: stripe + fill
      ctx.fillStyle = 'rgba(15, 118, 110, 0.95)';
      ctx.fillRect(0, GROUND_Y, CANVAS_WIDTH, CANVAS_HEIGHT - GROUND_Y);
      const stripeOffset = Math.floor(nextScroll * 0.5) % 40;
      ctx.fillStyle = 'rgba(20, 184, 166, 0.4)';
      for (let sx = -stripeOffset; sx < CANVAS_WIDTH + 40; sx += 40) {
        ctx.fillRect(sx, GROUND_Y, 20, CANVAS_HEIGHT - GROUND_Y);
      }
      ctx.beginPath();
      ctx.moveTo(0, GROUND_Y);
      ctx.lineTo(CANVAS_WIDTH, GROUND_Y);
      ctx.lineWidth = 5;
      ctx.strokeStyle = '#0f766e';
      ctx.stroke();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#14b8a6';
      ctx.stroke();

      // Checkpoint stars (visible on track so they don't appear out of nowhere)
      const passedSet = passedCheckpointsRef.current;
      for (let i = 0; i < checkpoints.length; i++) {
        if (passedSet.has(i)) continue;
        const cp = checkpoints[i]!;
        const cpScreenX = cp.x - nextScroll;
        if (cpScreenX + 40 < 0 || cpScreenX > CANVAS_WIDTH + 40) continue;
        const cx = cpScreenX + 20;
        const cy = GROUND_Y - 36;
        const outerR = 22;
        const innerR = 10;
        ctx.beginPath();
        for (let k = 0; k < 5; k++) {
          const aOut = (k * 2 * Math.PI) / 5 - Math.PI / 2;
          const aIn = ((k + 0.5) * 2 * Math.PI) / 5 - Math.PI / 2;
          if (k === 0) ctx.moveTo(cx + outerR * Math.cos(aOut), cy + outerR * Math.sin(aOut));
          else ctx.lineTo(cx + outerR * Math.cos(aOut), cy + outerR * Math.sin(aOut));
          ctx.lineTo(cx + innerR * Math.cos(aIn), cy + innerR * Math.sin(aIn));
        }
        ctx.closePath();
        ctx.shadowColor = 'rgba(0,0,0,0.3)';
        ctx.shadowBlur = 6;
        ctx.shadowOffsetY = 2;
        ctx.fillStyle = '#fef08a';
        ctx.fill();
        ctx.strokeStyle = '#eab308';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.shadowBlur = 0;
        ctx.shadowOffsetY = 0;
      }

      // Obstacles with shadow (spike, block, circle, floating)
      for (const obs of obstacles) {
        const obsScreenX = obs.x - nextScroll;
        const offsetY = obs.offsetY ?? 0;
        ctx.shadowColor = 'rgba(0,0,0,0.35)';
        ctx.shadowBlur = 8;
        ctx.shadowOffsetY = 3;
        if (obs.type === 'circle') {
          const r = obs.radius ?? 18;
          const cx = obsScreenX + r;
          const cy = GROUND_Y - r - offsetY;
          if (obsScreenX + r * 2 < -20 || obsScreenX > CANVAS_WIDTH + 20) continue;
          ctx.beginPath();
          ctx.arc(cx, cy, r, 0, Math.PI * 2);
          ctx.fillStyle = '#a855f7';
          ctx.fill();
          ctx.strokeStyle = '#7c3aed';
          ctx.lineWidth = 2;
          ctx.stroke();
        } else if (obs.type === 'floating') {
          const w = SPIKE_WIDTH;
          const h = obs.height ?? BLOCK_DEFAULT_HEIGHT;
          const top = GROUND_Y - h - offsetY;
          if (obsScreenX + w < -20 || obsScreenX > CANVAS_WIDTH + 20) continue;
          ctx.fillStyle = '#f59e0b';
          ctx.fillRect(obsScreenX, top, w, h);
          ctx.strokeStyle = '#d97706';
          ctx.lineWidth = 2;
          ctx.strokeRect(obsScreenX, top, w, h);
        } else {
          const w = SPIKE_WIDTH;
          const h = obs.type === 'spike' ? SPIKE_HEIGHT : (obs.height ?? BLOCK_DEFAULT_HEIGHT);
          const top = GROUND_Y - h - offsetY;
          if (obsScreenX + w < -20 || obsScreenX > CANVAS_WIDTH + 20) continue;
          if (obs.type === 'spike') {
            ctx.fillStyle = '#ef4444';
            ctx.beginPath();
            ctx.moveTo(obsScreenX, GROUND_Y - offsetY);
            ctx.lineTo(obsScreenX + w / 2, top);
            ctx.lineTo(obsScreenX + w, GROUND_Y - offsetY);
            ctx.closePath();
            ctx.fill();
            ctx.strokeStyle = '#b91c1c';
            ctx.lineWidth = 2;
            ctx.stroke();
          } else {
            ctx.fillStyle = '#ea580c';
            ctx.fillRect(obsScreenX, top, w, h);
            ctx.strokeStyle = '#c2410c';
            ctx.lineWidth = 2;
            ctx.strokeRect(obsScreenX, top, w, h);
          }
        }
        ctx.shadowBlur = 0;
        ctx.shadowOffsetY = 0;
      }

      // Player with simple face
      ctx.shadowColor = 'rgba(0,0,0,0.25)';
      ctx.shadowBlur = 4;
      ctx.shadowOffsetY = 2;
      ctx.fillStyle = '#14b8a6';
      ctx.fillRect(PLAYER_X, py, PLAYER_SIZE, PLAYER_SIZE);
      ctx.strokeStyle = '#0f766e';
      ctx.lineWidth = 3;
      ctx.strokeRect(PLAYER_X, py, PLAYER_SIZE, PLAYER_SIZE);
      ctx.fillStyle = '#0d9488';
      ctx.fillRect(PLAYER_X + 8, py + 8, PLAYER_SIZE - 16, PLAYER_SIZE - 16);
      ctx.fillStyle = '#134e4a';
      ctx.fillRect(PLAYER_X + 12, py + 14, 6, 6);
      ctx.fillRect(PLAYER_X + 26, py + 14, 6, 6);
      ctx.shadowBlur = 0;
      ctx.shadowOffsetY = 0;
    };

    lastTimeRef.current = performance.now();
    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, []);

  const handleCheckpointAnswer = useCallback(
    (index: number) => {
      if (checkpointIndex === null) return;
      const checkpoints = problem.checkpoints ?? [];
      const q = checkpoints[checkpointIndex]?.question;
      if (!q) return;
      setCheckpointOption(index);
      const correct = index === q.correctIndex;
      playSound(correct ? 'correct' : 'wrong', soundEnabled);
      if (correct) {
        setTimeout(() => {
          setGameState('playing');
          setCheckpointIndex(null);
          setCheckpointOption(null);
        }, 400);
      } else {
        setGameState('crashed');
        onAnswer(false);
      }
    },
    [checkpointIndex, problem.checkpoints, onAnswer, soundEnabled]
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      if (gameState === 'crashed') {
        doRetry();
        return;
      }
      requestJump();
    },
    [gameState, requestJump, doRetry]
  );

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      if (gameState === 'crashed') {
        doRetry();
        return;
      }
      requestJump();
    },
    [gameState, requestJump, doRetry]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === ' ') {
        e.preventDefault();
        if (gameState === 'crashed') {
          doRetry();
          return;
        }
        requestJump();
      }
    },
    [gameState, requestJump, doRetry]
  );

  const checkpoints = problem.checkpoints ?? [];
  const checkpoint = checkpointIndex !== null ? checkpoints[checkpointIndex] ?? null : null;
  const tapToRetry = (t.games as Record<string, { tapToRetry?: string }>)?.['shape_dash']?.tapToRetry ?? (t.game as { retry?: string })?.retry ?? 'Tap to try again';

  return (
    <div className="flex flex-col items-center gap-3 w-full max-w-2xl">
      <div
        ref={containerRef}
        className="relative rounded-2xl overflow-hidden border-2 border-slate-400 shadow-xl bg-slate-900 cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
        style={{ width: CANVAS_WIDTH, height: CANVAS_HEIGHT }}
        onClick={handleClick}
        onPointerDown={handlePointerDown}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
        aria-label={gameState === 'crashed' ? 'Tap to try again' : 'Jump'}
      >
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          className="block w-full h-full"
          style={{ display: 'block' }}
        />
        {gameState === 'checkpoint' && (
          <div className="absolute inset-0 bg-black/30 pointer-events-none" style={{ width: CANVAS_WIDTH, height: CANVAS_HEIGHT }} />
        )}
        {gameState === 'won' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-emerald-500/60 pointer-events-none rounded-2xl" style={{ width: CANVAS_WIDTH, height: CANVAS_HEIGHT }}>
            <span className="text-4xl font-black text-white drop-shadow-lg">✓ WIN!</span>
          </div>
        )}
        {gameState === 'crashed' && (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-red-600/70 rounded-2xl pointer-events-none"
            style={{ width: CANVAS_WIDTH, height: CANVAS_HEIGHT }}
          >
            <span className="text-4xl font-black text-white drop-shadow-lg">💥</span>
            <span className="text-xl font-bold text-white drop-shadow-md text-center px-4">
              {tapToRetry}
            </span>
          </div>
        )}
      </div>

      {checkpoint && gameState === 'checkpoint' && (() => {
        const shapeNames = (t.games as { shape_dash?: { shapeNames?: Record<string, string> } })?.shape_dash?.shapeNames;
        const translatedOptions = checkpoint.question.options.map(
          (opt) => (shapeNames && opt in shapeNames ? shapeNames[opt] : opt)
        );
        return (
          <GameProblemModal
            isOpen={true}
            prompt={checkpoint.question.prompt}
            options={translatedOptions}
            correctIndex={checkpoint.question.correctIndex}
            selectedOption={checkpointOption}
            onOptionSelect={handleCheckpointAnswer}
            disabled={checkpointOption !== null}
            variant="compact"
            title={t.notifications?.tipTitle ?? 'Checkpoint'}
          />
        );
      })()}
    </div>
  );
};
