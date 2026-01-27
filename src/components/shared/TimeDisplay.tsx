/**
 * TimeDisplay Component
 * 
 * Analog clock display component for time matching games.
 */

import React from 'react';

interface TimeDisplayProps {
  hour: number;
  minute: number;
}

export const TimeDisplay: React.FC<TimeDisplayProps> = ({ hour, minute }) => {
  const angleH = ((hour % 12) + minute / 60) * 30;
  const angleM = minute * 6;
  const hourLen = 46;
  const minuteLen = 70;
  return (
    <div className="relative w-48 h-48 sm:w-52 sm:h-52">
      <div className="absolute inset-0 rounded-full bg-white border-[6px] sm:border-[10px] border-blue-100 shadow-[0_10px_25px_rgba(59,130,246,0.12)]"></div>
      {/* minute ticks */}
      {Array.from({ length: 60 }).map((_, i) => (
        <div
          key={i}
          className="absolute left-1/2 top-1/2 origin-bottom"
          style={{
            width: i % 5 === 0 ? 3 : 1,
            height: i % 5 === 0 ? 10 : 6,
            background: i % 5 === 0 ? '#93c5fd' : '#cbd5e1',
            transform: `translate(-50%, -50%) rotate(${i * 6}deg) translateY(-95px)`
          }}
        />
      ))}
      {/* numbers */}
      {Array.from({ length: 12 }).map((_, i) => {
        const n = i === 0 ? 12 : i;
        const angle = i * 30;
        return (
          <div
            key={n}
            className="absolute left-1/2 top-1/2 text-xs font-bold text-slate-500"
            style={{
              transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-78px) rotate(${-angle}deg)`
            }}
          >
            {n}
          </div>
        );
      })}
      {/* hour hand */}
      <div
        className="absolute left-1/2 top-1/2 w-[8px] bg-blue-500 rounded-full origin-bottom shadow-md"
        style={{ height: `${hourLen}px`, transform: `translate(-50%, -100%) rotate(${angleH}deg)` }}
      />
      {/* minute hand */}
      <div
        className="absolute left-1/2 top-1/2 w-[6px] bg-blue-800 rounded-full origin-bottom shadow"
        style={{ height: `${minuteLen}px`, transform: `translate(-50%, -100%) rotate(${angleM}deg)` }}
      />
      <div className="absolute left-1/2 top-1/2 w-4 h-4 -translate-x-1/2 -translate-y-1/2 bg-blue-900 rounded-full shadow-inner"></div>
    </div>
  );
};
