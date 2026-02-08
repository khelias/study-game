/**
 * ShapeDashView V2 – Polished Geometry Dash–inspired runner with neon visuals.
 * 
 * Features:
 * - Neon color theme with glow effects
 * - Particle system (trail, explosion, landing, fireworks)
 * - Animated player with rotation and squash/stretch
 * - Multi-layer parallax background
 * - Pulsing/glowing obstacles
 * - Screen shake effects
 * - HUD with progress bar and stats
 * - Enhanced collision detection
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

// V2 Canvas dimensions (increased from 560x360)
const CANVAS_WIDTH = 640;
const CANVAS_HEIGHT = 400;
const GROUND_Y = CANVAS_HEIGHT - 90;
const PLAYER_X = 140;
const PLAYER_SIZE = 42;

// Particle system
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  type: 'trail' | 'explosion' | 'landing' | 'firework';
}

// Game state (all mutable state in a single ref object)
interface GameState {
  scroll: number;
  playerY: number;
  playerVelY: number;
  playerRotation: number;
  isOnGround: boolean;
  canDoubleJump: boolean;
  gravityFlipped: boolean;
  speedMultiplier: number;
  playerScale: number;
  squashStretch: number;
  screenShake: number;
  attemptCount: number;
  score: number;
  coinsCollected: number;
  pulsePhase: number;
  particles: Particle[];
  trailPoints: Array<{ x: number; y: number }>;
}

// Particle system helpers
function createExplosionParticles(x: number, y: number, color: string): Particle[] {
  const particles: Particle[] = [];
  for (let i = 0; i < 24; i++) {
    const angle = (i / 24) * Math.PI * 2;
    const speed = 100 + Math.random() * 150;
    particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 1,
      maxLife: 1,
      size: 3 + Math.random() * 4,
      color,
      type: 'explosion',
    });
  }
  return particles;
}

function createLandParticles(x: number, y: number): Particle[] {
  const particles: Particle[] = [];
  for (let i = 0; i < 6; i++) {
    const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI;
    const speed = 50 + Math.random() * 80;
    particles.push({
      x: x + Math.random() * PLAYER_SIZE,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 0.5,
      maxLife: 0.5,
      size: 2 + Math.random() * 3,
      color: '#888888',
      type: 'landing',
    });
  }
  return particles;
}

function createFireworkParticles(x: number, y: number): Particle[] {
  const particles: Particle[] = [];
  const colors = ['#00ff88', '#00ffcc', '#ffcc00', '#ff6600', '#cc44ff'];
  for (let i = 0; i < 32; i++) {
    const angle = (i / 32) * Math.PI * 2;
    const speed = 120 + Math.random() * 100;
    particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 1.2,
      maxLife: 1.2,
      size: 3 + Math.random() * 5,
      color: colors[Math.floor(Math.random() * colors.length)]!,
      type: 'firework',
    });
  }
  return particles;
}

function updateParticles(particles: Particle[], dt: number): Particle[] {
  return particles
    .map((p) => {
      const newP = { ...p };
      newP.x += newP.vx * dt;
      newP.y += newP.vy * dt;
      newP.vy += 300 * dt; // Gravity on particles
      newP.life -= dt;
      return newP;
    })
    .filter((p) => p.life > 0);
}

// Rendering functions
function drawBackground(
  ctx: CanvasRenderingContext2D,
  scroll: number,
  pulsePhase: number,
  width: number,
  height: number,
  groundY: number
) {
  // Dark background gradient
  const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
  skyGrad.addColorStop(0, '#0a0a1a');
  skyGrad.addColorStop(0.5, '#1a1a3a');
  skyGrad.addColorStop(1, '#2a2a4a');
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, width, groundY);

  // Layer 1: Distant stars (0.05x scroll speed)
  ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
  const starOffset = (scroll * 0.05) % 100;
  for (let i = 0; i < 30; i++) {
    const x = ((i * 73) % width) - starOffset;
    const y = (i * 41) % groundY;
    ctx.fillRect(x, y, 2, 2);
  }

  // Layer 2: Geometric grid (0.15x scroll speed)
  const gridOffset = (scroll * 0.15) % 60;
  ctx.strokeStyle = 'rgba(0, 255, 136, 0.1)';
  ctx.lineWidth = 1;
  for (let x = -gridOffset; x < width + 60; x += 60) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, groundY);
    ctx.stroke();
  }
  for (let y = 0; y < groundY; y += 60) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  // Layer 3: Floating shapes (0.1x speed with rotation)
  const shapeOffset = (scroll * 0.1) % 150;
  ctx.strokeStyle = 'rgba(0, 255, 204, 0.15)';
  ctx.lineWidth = 2;
  for (let i = 0; i < 8; i++) {
    const x = ((i * 120) % width) - shapeOffset;
    const y = 50 + (i * 60) % (groundY - 100);
    const rot = pulsePhase * 0.5 + i;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);
    if (i % 3 === 0) {
      // Triangle
      ctx.beginPath();
      ctx.moveTo(0, -15);
      ctx.lineTo(13, 15);
      ctx.lineTo(-13, 15);
      ctx.closePath();
      ctx.stroke();
    } else if (i % 3 === 1) {
      // Square
      ctx.strokeRect(-12, -12, 24, 24);
    } else {
      // Circle
      ctx.beginPath();
      ctx.arc(0, 0, 12, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();
  }

  // Ground with stripes
  ctx.fillStyle = '#1a1a2a';
  ctx.fillRect(0, groundY, width, height - groundY);
  const stripeOffset = (scroll * 0.5) % 40;
  ctx.fillStyle = 'rgba(0, 255, 136, 0.08)';
  for (let sx = -stripeOffset; sx < width + 40; sx += 40) {
    ctx.fillRect(sx, groundY, 20, height - groundY);
  }

  // Ground line with neon glow
  ctx.shadowColor = '#00ff88';
  ctx.shadowBlur = 12;
  ctx.strokeStyle = '#00ff88';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(0, groundY);
  ctx.lineTo(width, groundY);
  ctx.stroke();
  ctx.shadowBlur = 0;
}

function drawPlayer(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  rotation: number,
  squashStretch: number,
  _scale: number,
  pulsePhase: number
) {
  ctx.save();
  ctx.translate(x + size / 2, y + size / 2);
  ctx.rotate(rotation);
  ctx.scale(1, squashStretch);

  // Neon glow (pulses)
  const glowIntensity = 12 + Math.sin(pulsePhase * 4) * 4;
  ctx.shadowColor = '#00ff88';
  ctx.shadowBlur = glowIntensity;

  // Player body
  ctx.fillStyle = '#00ff88';
  ctx.fillRect(-size / 2, -size / 2, size, size);

  // Inner highlight
  ctx.fillStyle = 'rgba(0, 255, 204, 0.3)';
  ctx.fillRect(-size / 2 + 6, -size / 2 + 6, size - 12, size - 12);

  // Face (eyes)
  ctx.shadowBlur = 0;
  ctx.fillStyle = '#0a0a1a';
  const eyeY = -size / 4;
  const eyeSize = 6;
  ctx.fillRect(-size / 3, eyeY, eyeSize, eyeSize);
  ctx.fillRect(size / 3 - eyeSize, eyeY, eyeSize, eyeSize);

  // Eye highlights
  ctx.fillStyle = '#00ff88';
  ctx.fillRect(-size / 3 + 1, eyeY + 1, 2, 2);
  ctx.fillRect(size / 3 - eyeSize + 1, eyeY + 1, 2, 2);

  ctx.restore();
}

function drawTrail(ctx: CanvasRenderingContext2D, trail: Array<{ x: number; y: number }>, size: number) {
  const colors = ['#ff0088', '#ff8800', '#ffff00', '#00ff88', '#0088ff', '#8800ff'];
  for (let i = 0; i < trail.length; i++) {
    const t = trail[i];
    if (!t) continue;
    const alpha = (i / trail.length) * 0.5;
    const colorIdx = Math.floor((i / trail.length) * colors.length);
    const color = colors[colorIdx] || colors[0]!;
    ctx.fillStyle = color.replace(')', `, ${alpha})`).replace('rgb', 'rgba').replace('#', 'rgba(') + `, ${alpha})`;
    const trailSize = (size * (i / trail.length)) / 2;
    ctx.fillRect(t.x + size / 2 - trailSize / 2, t.y + size / 2 - trailSize / 2, trailSize, trailSize);
  }
}

function drawObstacle(
  ctx: CanvasRenderingContext2D,
  type: string,
  screenX: number,
  groundY: number,
  offsetY: number,
  height: number,
  radius: number,
  pulsePhase: number
) {
  const pulse = 1 + Math.sin(pulsePhase * 3) * 0.03;
  const glowBlur = 12 + Math.sin(pulsePhase * 2) * 4;

  if (type === 'circle') {
    const cx = screenX + radius;
    const cy = groundY - radius - offsetY;
    ctx.shadowColor = '#cc44ff';
    ctx.shadowBlur = glowBlur;
    ctx.fillStyle = '#cc44ff';
    ctx.beginPath();
    ctx.arc(cx, cy, radius * pulse, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.beginPath();
    ctx.arc(cx - radius / 3, cy - radius / 3, radius / 3, 0, Math.PI * 2);
    ctx.fill();
  } else if (type === 'floating') {
    const top = groundY - height - offsetY;
    ctx.shadowColor = '#ffcc00';
    ctx.shadowBlur = glowBlur;
    ctx.fillStyle = '#ffcc00';
    ctx.fillRect(screenX, top, SPIKE_WIDTH * pulse, height * pulse);
    ctx.shadowBlur = 0;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.fillRect(screenX + 4, top + 4, SPIKE_WIDTH * pulse - 8, height * pulse - 8);
  } else if (type === 'spike') {
    const top = groundY - height - offsetY;
    ctx.shadowColor = '#ff3366';
    ctx.shadowBlur = glowBlur;
    ctx.fillStyle = '#ff3366';
    ctx.beginPath();
    ctx.moveTo(screenX, groundY - offsetY);
    ctx.lineTo(screenX + (SPIKE_WIDTH * pulse) / 2, top);
    ctx.lineTo(screenX + SPIKE_WIDTH * pulse, groundY - offsetY);
    ctx.closePath();
    ctx.fill();
    ctx.shadowBlur = 0;
  } else {
    // block
    const top = groundY - height - offsetY;
    ctx.shadowColor = '#ff6600';
    ctx.shadowBlur = glowBlur;
    ctx.fillStyle = '#ff6600';
    ctx.fillRect(screenX, top, SPIKE_WIDTH * pulse, height * pulse);
    ctx.shadowBlur = 0;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.fillRect(screenX + 4, top + 4, SPIKE_WIDTH * pulse - 8, height * pulse - 8);
  }
}

function drawCheckpoint(
  ctx: CanvasRenderingContext2D,
  screenX: number,
  groundY: number,
  pulsePhase: number
) {
  const cx = screenX + 20;
  const cy = groundY - 36;
  const outerR = 22;
  const innerR = 10;
  const pulse = 1 + Math.sin(pulsePhase * 4) * 0.1;

  ctx.shadowColor = '#fef08a';
  ctx.shadowBlur = 16;
  ctx.beginPath();
  for (let k = 0; k < 5; k++) {
    const aOut = (k * 2 * Math.PI) / 5 - Math.PI / 2;
    const aIn = ((k + 0.5) * 2 * Math.PI) / 5 - Math.PI / 2;
    if (k === 0) ctx.moveTo(cx + outerR * pulse * Math.cos(aOut), cy + outerR * pulse * Math.sin(aOut));
    else ctx.lineTo(cx + outerR * pulse * Math.cos(aOut), cy + outerR * pulse * Math.sin(aOut));
    ctx.lineTo(cx + innerR * pulse * Math.cos(aIn), cy + innerR * pulse * Math.sin(aIn));
  }
  ctx.closePath();
  ctx.fillStyle = '#fef08a';
  ctx.fill();
  ctx.strokeStyle = '#eab308';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.shadowBlur = 0;
}

function drawParticles(ctx: CanvasRenderingContext2D, particles: Particle[]) {
  for (const p of particles) {
    const alpha = p.life / p.maxLife;
    ctx.fillStyle = p.color.includes('rgba')
      ? p.color.replace(/[\d.]+\)$/g, `${alpha})`)
      : p.color + `${Math.floor(alpha * 255).toString(16).padStart(2, '0')}`;
    ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
  }
}

function drawHUD(
  ctx: CanvasRenderingContext2D,
  progress: number,
  attemptCount: number,
  score: number,
  width: number
) {
  // Progress bar
  const barWidth = 200;
  const barHeight = 8;
  const barX = (width - barWidth) / 2;
  const barY = 20;

  ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
  ctx.fillRect(barX - 2, barY - 2, barWidth + 4, barHeight + 4);

  const grad = ctx.createLinearGradient(barX, 0, barX + barWidth, 0);
  grad.addColorStop(0, '#00ff88');
  grad.addColorStop(1, '#00ffcc');
  ctx.fillStyle = grad;
  ctx.fillRect(barX, barY, barWidth * progress, barHeight);

  ctx.strokeStyle = '#00ff88';
  ctx.lineWidth = 2;
  ctx.strokeRect(barX, barY, barWidth, barHeight);

  // Progress percentage
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 12px Arial';
  ctx.textAlign = 'center';
  ctx.fillText(`${Math.floor(progress * 100)}%`, width / 2, barY + barHeight + 16);

  // Attempt counter (left)
  ctx.textAlign = 'left';
  ctx.fillText(`Attempt ${attemptCount}`, 12, 26);

  // Score (right)
  ctx.textAlign = 'right';
  ctx.fillText(`Score: ${score}`, width - 12, 26);
}

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
  const gameStateRef = useRef(gameState);
  const setGameStateRef = useRef(setGameState);
  const passedCheckpointsRef = useRef<Set<number>>(new Set());
  const lastTimeRef = useRef(0);
  const jumpRequestedRef = useRef(false);
  const lastGroundedRef = useRef(false);

  // V2: Single game state ref object
  const stateRef = useRef<GameState>({
    scroll: 0,
    playerY: GROUND_Y - PLAYER_SIZE,
    playerVelY: 0,
    playerRotation: 0,
    isOnGround: true,
    canDoubleJump: true,
    gravityFlipped: false,
    speedMultiplier: 1,
    playerScale: 1,
    squashStretch: 1,
    screenShake: 0,
    attemptCount: 1,
    score: 0,
    coinsCollected: 0,
    pulsePhase: 0,
    particles: [],
    trailPoints: [],
  });

  useEffect(() => {
    problemRef.current = problem;
    onAnswerRef.current = onAnswer;
    soundEnabledRef.current = soundEnabled;
    gameStateRef.current = gameState;
    setGameStateRef.current = setGameState;
  }, [problem, onAnswer, soundEnabled, gameState]);

  const doRetry = useCallback(() => {
    const state = stateRef.current;
    state.scroll = 0;
    state.playerY = GROUND_Y - PLAYER_SIZE;
    state.playerVelY = 0;
    state.playerRotation = 0;
    state.isOnGround = true;
    state.canDoubleJump = true;
    state.squashStretch = 1;
    state.screenShake = 0;
    state.score = 0;
    state.particles = [];
    state.trailPoints = [];
    state.attemptCount += 1;
    passedCheckpointsRef.current = new Set();
    jumpRequestedRef.current = false;
    lastGroundedRef.current = false;
    setGameStateRef.current('playing');
    playSound('tap', soundEnabledRef.current);
  }, []);

  const requestJump = useCallback(() => {
    jumpRequestedRef.current = true;
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
    const state = stateRef.current;
    state.scroll = 0;
    state.playerY = GROUND_Y - PLAYER_SIZE;
    state.playerVelY = 0;
    state.playerRotation = 0;
    state.isOnGround = true;
    state.canDoubleJump = true;
    state.squashStretch = 1;
    state.screenShake = 0;
    state.score = 0;
    state.particles = [];
    state.trailPoints = [];
    state.attemptCount = 1;
    passedCheckpointsRef.current = new Set();
    jumpRequestedRef.current = false;
    lastGroundedRef.current = false;
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

      const state = stateRef.current;
      const nextScroll = state.scroll + prob.scrollSpeed * dt;
      let py = state.playerY;
      let pvy = state.playerVelY;

      // Jump handling
      if (jumpRequestedRef.current) {
        jumpRequestedRef.current = false;
        const onGround = py + PLAYER_SIZE >= GROUND_Y - 4;
        if (onGround) {
          pvy = JUMP_VELOCITY;
          state.canDoubleJump = true;
          state.squashStretch = 0.7; // Jump squash
          playSound('tap', soundEnabledRef.current);
        } else if (state.canDoubleJump) {
          pvy = JUMP_VELOCITY;
          state.canDoubleJump = false;
          playSound('tap', soundEnabledRef.current);
        }
      }

      // Physics
      pvy += GRAVITY * dt;
      py += pvy * dt;

      // Ground collision
      const wasGrounded = lastGroundedRef.current;
      if (py + PLAYER_SIZE >= GROUND_Y) {
        py = GROUND_Y - PLAYER_SIZE;
        pvy = 0;
        state.isOnGround = true;
        state.canDoubleJump = true;
        // Landing detection
        if (!wasGrounded) {
          state.squashStretch = 1.3; // Landing stretch
          state.particles.push(...createLandParticles(PLAYER_X, GROUND_Y));
        }
        lastGroundedRef.current = true;
      } else {
        state.isOnGround = false;
        lastGroundedRef.current = false;
      }

      // Update rotation (8 rad/s during jumps)
      if (!state.isOnGround) {
        state.playerRotation += 8 * dt;
      } else {
        // Snap to nearest 90° on ground
        const target = Math.round(state.playerRotation / (Math.PI / 2)) * (Math.PI / 2);
        state.playerRotation = target;
      }

      // Squash/stretch decay
      state.squashStretch = state.squashStretch + (1 - state.squashStretch) * 0.15;

      // Screen shake decay
      if (state.screenShake > 0) {
        state.screenShake = Math.max(0, state.screenShake - dt * 10);
      }

      // Update pulse phase
      state.pulsePhase += dt;

      // Update score
      state.score = Math.floor(nextScroll / 10);

      // Update trail
      state.trailPoints.push({ x: PLAYER_X, y: py });
      if (state.trailPoints.length > 12) state.trailPoints.shift();

      // Update particles
      state.particles = updateParticles(state.particles, dt);

      state.playerY = py;
      state.playerVelY = pvy;
      state.scroll = nextScroll;

      const playerLeft = PLAYER_X;
      const playerRight = PLAYER_X + PLAYER_SIZE;
      const playerTop = py;
      const playerBottom = py + PLAYER_SIZE;

      // Collision detection (with 6px inset margins for forgiveness)
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
            const closestX = Math.max(playerLeft + 6, Math.min(cx, playerRight - 6));
            const closestY = Math.max(playerTop + 6, Math.min(cy, playerBottom - 6));
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
            if (playerRight - 6 > obsLeft + 6 && playerLeft + 6 < obsRight - 6 && playerBottom - 6 > obsTop + 6 && playerTop + 6 < obsBottom - 6) {
              collision = true;
              break;
            }
          }
        }
      }

      if (collision) {
        state.screenShake = 8;
        state.particles.push(...createExplosionParticles(PLAYER_X + PLAYER_SIZE / 2, py + PLAYER_SIZE / 2, '#00ff88'));
        setGameState('crashed');
        playSound('wrong', soundEnabledRef.current);
        onAnswerRef.current(false);
        return;
      }

      // Checkpoint detection
      const cpIdx = getReachedCheckpointIndex(PLAYER_X, checkpoints, nextScroll, passedCheckpointsRef.current);
      if (cpIdx !== null) {
        passedCheckpointsRef.current.add(cpIdx);
        setCheckpointIndex(cpIdx);
        setCheckpointOption(null);
        setGameState('checkpoint');
        return;
      }

      // Win detection
      if (hasReachedFinish(nextScroll, prob.runLength)) {
        // Victory fireworks (3 bursts staggered)
        setTimeout(() => {
          state.particles.push(...createFireworkParticles(CANVAS_WIDTH * 0.25, CANVAS_HEIGHT * 0.3));
        }, 0);
        setTimeout(() => {
          state.particles.push(...createFireworkParticles(CANVAS_WIDTH * 0.5, CANVAS_HEIGHT * 0.2));
        }, 200);
        setTimeout(() => {
          state.particles.push(...createFireworkParticles(CANVAS_WIDTH * 0.75, CANVAS_HEIGHT * 0.35));
        }, 400);
        setGameState('won');
        playSound('win', soundEnabledRef.current);
        setTimeout(() => onAnswerRef.current(true), 800);
        return;
      }

      // Rendering
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Apply screen shake
      ctx.save();
      if (state.screenShake > 0) {
        const shakeX = (Math.random() - 0.5) * state.screenShake * 2;
        const shakeY = (Math.random() - 0.5) * state.screenShake * 2;
        ctx.translate(shakeX, shakeY);
      }

      drawBackground(ctx, nextScroll, state.pulsePhase, CANVAS_WIDTH, CANVAS_HEIGHT, GROUND_Y);

      // Checkpoint stars
      const passedSet = passedCheckpointsRef.current;
      for (let i = 0; i < checkpoints.length; i++) {
        if (passedSet.has(i)) continue;
        const cp = checkpoints[i]!;
        const cpScreenX = cp.x - nextScroll;
        if (cpScreenX + 40 < 0 || cpScreenX > CANVAS_WIDTH + 40) continue;
        drawCheckpoint(ctx, cpScreenX, GROUND_Y, state.pulsePhase);
      }

      // Obstacles
      for (const obs of obstacles) {
        const obsScreenX = obs.x - nextScroll;
        if (obsScreenX + 50 < -20 || obsScreenX > CANVAS_WIDTH + 20) continue;
        const offsetY = obs.offsetY ?? 0;
        const height = obs.type === 'spike' ? SPIKE_HEIGHT : (obs.height ?? BLOCK_DEFAULT_HEIGHT);
        const radius = obs.radius ?? 18;
        drawObstacle(ctx, obs.type, obsScreenX, GROUND_Y, offsetY, height, radius, state.pulsePhase);
      }

      // Trail
      drawTrail(ctx, state.trailPoints, PLAYER_SIZE);

      // Player
      drawPlayer(ctx, PLAYER_X, py, PLAYER_SIZE, state.playerRotation, state.squashStretch, state.playerScale, state.pulsePhase);

      // Particles
      drawParticles(ctx, state.particles);

      // HUD
      const progress = Math.min(1, nextScroll / prob.runLength);
      drawHUD(ctx, progress, state.attemptCount, state.score, CANVAS_WIDTH);

      ctx.restore();
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
        className="relative rounded-2xl overflow-hidden border-2 border-emerald-400 shadow-xl bg-slate-900 cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
        style={{ 
          width: CANVAS_WIDTH, 
          height: CANVAS_HEIGHT,
          boxShadow: '0 0 40px rgba(0, 255, 136, 0.2)'
        }}
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
          <div 
            className="absolute inset-0 pointer-events-none" 
            style={{ 
              width: CANVAS_WIDTH, 
              height: CANVAS_HEIGHT,
              background: 'rgba(0, 0, 0, 0.4)',
              backdropFilter: 'blur(4px)'
            }} 
          />
        )}
        {gameState === 'won' && (
          <div 
            className="absolute inset-0 flex flex-col items-center justify-center gap-3 pointer-events-none rounded-2xl" 
            style={{ 
              width: CANVAS_WIDTH, 
              height: CANVAS_HEIGHT,
              background: 'radial-gradient(circle, rgba(0, 255, 136, 0.4) 0%, rgba(0, 255, 204, 0.2) 100%)'
            }}
          >
            <span className="text-5xl">🎉</span>
            <span className="text-3xl font-black text-white drop-shadow-lg">LEVEL COMPLETE!</span>
            <span className="text-xl font-bold text-white drop-shadow-md">
              Score: {stateRef.current.score}
            </span>
          </div>
        )}
        {gameState === 'crashed' && (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-2xl pointer-events-none"
            style={{ 
              width: CANVAS_WIDTH, 
              height: CANVAS_HEIGHT,
              background: 'radial-gradient(circle, rgba(255, 51, 102, 0.5) 0%, rgba(255, 0, 0, 0.3) 100%)'
            }}
          >
            <span className="text-5xl">💥</span>
            <span className="text-xl font-bold text-white drop-shadow-md text-center px-4">
              {tapToRetry}
            </span>
            <span className="text-lg font-semibold text-white/90 drop-shadow-md">
              Attempt {stateRef.current.attemptCount}
            </span>
          </div>
        )}
      </div>

      {/* Instructions hint */}
      <div className="text-sm text-slate-400 text-center">
        <kbd className="px-2 py-1 bg-slate-700 rounded text-xs font-semibold text-slate-200">SPACE</kbd> or tap to jump • Double-jump available!
      </div>

      {checkpoint && gameState === 'checkpoint' && (() => {
        const shapeNames = (t.games as { shape_dash?: { shapeNames?: Record<string, string> } })?.shape_dash?.shapeNames;
        const translatedOptions = checkpoint.question.options.map(
          (opt) => (shapeNames && opt in shapeNames ? shapeNames[opt]! : opt)
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
