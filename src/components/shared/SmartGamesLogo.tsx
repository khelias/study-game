/**
 * Smart Games Logo Component
 *
 * Logo for the Smart Games educational game platform
 * Rocket icon with pink/blue gradient
 */

import React from 'react';

interface SmartGamesLogoProps {
  size?: number;
  className?: string;
  showText?: boolean;
}

export const SmartGamesLogo: React.FC<SmartGamesLogoProps> = ({
  size: _size,
  className = '',
  showText = false,
}) => {
  // Match home button size: w-4 h-4 sm:w-5 sm:h-5 (16px/20px)
  return (
    <div className={`flex items-center justify-center gap-1.5 ${className}`}>
      {/* Custom Rocket icon with pink/blue gradient */}
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-4 h-4 sm:w-5 sm:h-5"
      >
        <defs>
          <linearGradient id="rocketGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ec4899" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
        </defs>
        {/* Rocket paths from lucide-react Rocket icon */}
        <path
          d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"
          stroke="url(#rocketGradient)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"
          stroke="url(#rocketGradient)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"
          stroke="url(#rocketGradient)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"
          stroke="url(#rocketGradient)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {/* Optional text */}
      {showText && (
        <span className="text-sm sm:text-base font-bold text-slate-700 hidden sm:inline">
          Smart Games
        </span>
      )}
    </div>
  );
};
