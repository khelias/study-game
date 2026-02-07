/**
 * TimeDisplay Component
 *
 * Analog clock for time matching. Accessible via aria-label.
 */

import React from 'react';

interface TimeDisplayProps {
  hour: number;
  minute: number;
  /** Optional: 'correct' green pulse, 'wrong' red tint */
  feedback?: 'correct' | 'wrong' | null;
}

/** Clock radius in px for tick/number positioning (container is w-56/w-64) */
const RAD = 112;
const HOUR_LEN = 58;
const MIN_LEN = 88;

function formatTimeForA11y(hour: number, minute: number): string {
  const h = hour % 12 || 12;
  const m = minute.toString().padStart(2, '0');
  return `${h}:${m}`;
}

export const TimeDisplay: React.FC<TimeDisplayProps> = ({ hour, minute, feedback }) => {
  const angleH = ((hour % 12) + minute / 60) * 30;
  const angleM = minute * 6;
  const a11yLabel = `Clock showing ${formatTimeForA11y(hour, minute)}`;
  const feedbackClass =
    feedback === 'correct'
      ? 'ring-4 ring-green-400 ring-offset-2 rounded-full animate-pulse'
      : feedback === 'wrong'
        ? 'ring-4 ring-red-300 ring-offset-2 rounded-full'
        : '';
  return (
    <div
      className={`relative w-56 h-56 sm:w-64 sm:h-64 transition-all duration-300 ${feedbackClass}`}
      role="img"
      aria-label={a11yLabel}
    >
      <div className="absolute inset-0 rounded-full bg-white border-[8px] sm:border-[10px] border-blue-100 shadow-[0_10px_25px_rgba(59,130,246,0.12)]" />
      {Array.from({ length: 60 }).map((_, i) => (
        <div
          key={i}
          className="absolute left-1/2 top-1/2 origin-bottom"
          style={{
            width: i % 5 === 0 ? 3 : 1,
            height: i % 5 === 0 ? 12 : 6,
            background: i % 5 === 0 ? '#93c5fd' : '#cbd5e1',
            transform: `translate(-50%, -50%) rotate(${i * 6}deg) translateY(-${RAD - 4}px)`,
          }}
        />
      ))}
      {Array.from({ length: 12 }).map((_, i) => {
        const n = i === 0 ? 12 : i;
        const angle = i * 30;
        return (
          <div
            key={n}
            className="absolute left-1/2 top-1/2 text-sm font-bold text-slate-500"
            style={{
              transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-${RAD - 22}px) rotate(${-angle}deg)`,
            }}
          >
            {n}
          </div>
        );
      })}
      <div
        className="absolute left-1/2 top-1/2 w-2 bg-blue-500 rounded-full origin-bottom shadow-md"
        style={{ height: `${HOUR_LEN}px`, transform: `translate(-50%, -100%) rotate(${angleH}deg)` }}
      />
      <div
        className="absolute left-1/2 top-1/2 w-[6px] bg-blue-800 rounded-full origin-bottom shadow"
        style={{ height: `${MIN_LEN}px`, transform: `translate(-50%, -100%) rotate(${angleM}deg)` }}
      />
      <div className="absolute left-1/2 top-1/2 w-5 h-5 -translate-x-1/2 -translate-y-1/2 bg-blue-900 rounded-full shadow-inner" />
    </div>
  );
};
