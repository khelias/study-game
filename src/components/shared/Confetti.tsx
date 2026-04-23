/**
 * Confetti Component
 *
 * Animated confetti effect for celebrations.
 */

import React, { useMemo } from 'react';

export const Confetti: React.FC = () => {
  // Generate stable random positions for confetti using index-based seed (memoized to prevent recalculation)
  const confettiItems = useMemo(
    () =>
      Array.from({ length: 30 }).map((_, i) => {
        const seed = i * 12345;
        const left = ((seed * 9301 + 49297) % 233280) / 2332.8;
        const duration = 2 + ((seed * 48271) % 100) / 50;
        const delay = ((seed * 1103515245 + 12345) % 100) / 100;
        return { left, duration, delay };
      }),
    [],
  );

  return (
    <div className="fixed inset-0 pointer-events-none z-[50] overflow-hidden">
      {confettiItems.map(({ left, duration, delay }, i) => (
        <div
          key={i}
          className="absolute text-2xl animate-confetti"
          style={{
            left: `${left}%`,
            top: `-10%`,
            animationDuration: `${duration}s`,
            animationDelay: `${delay}s`,
          }}
        >
          🎉
        </div>
      ))}
      <style>{`@keyframes confetti { 100% { transform: translateY(110vh) rotate(720deg); opacity: 0; } } .animate-confetti { animation: confetti 3s ease-out forwards; }`}</style>
    </div>
  );
};
