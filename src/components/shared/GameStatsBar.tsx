/**
 * GameStatsBar Component
 *
 * A flexible, reusable component for displaying game-specific statistics.
 * Used across multiple games to show contextual information like:
 * - Ships remaining (BattleLearn)
 * - Apples until math (MathSnake)
 * - Phase indicators
 * - Progress counters
 *
 * Design Philosophy:
 * - Compact and unobtrusive
 * - Horizontally scrollable on mobile
 * - Supports badges, counters, and status indicators
 */

import React from 'react';
import { LucideIcon } from 'lucide-react';

export interface GameStat {
  id: string;
  icon?: LucideIcon;
  emoji?: string;
  label?: string;
  value: string | number;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  pulse?: boolean;
  bounce?: boolean;
}

interface GameStatsBarProps {
  stats: GameStat[];
  className?: string;
}

const variantClasses = {
  default: 'bg-slate-50 border-slate-300 text-slate-700',
  success: 'bg-green-50 border-green-400 text-green-700',
  warning: 'bg-orange-50 border-orange-400 text-orange-700',
  danger: 'bg-red-50 border-red-400 text-red-700',
  info: 'bg-blue-50 border-blue-400 text-blue-700',
};

export const GameStatsBar: React.FC<GameStatsBarProps> = ({ stats, className = '' }) => {
  if (stats.length === 0) return null;

  return (
    <div className={`w-full overflow-x-auto pb-2 ${className}`}>
      <div className="flex items-center justify-center gap-2 sm:gap-3 min-w-max px-2">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const variantClass = variantClasses[stat.variant || 'default'];
          const animationClass = stat.pulse ? 'animate-pulse' : stat.bounce ? 'animate-bounce' : '';

          return (
            <div
              key={stat.id}
              className={`
                flex items-center gap-1.5 px-3 py-1.5 rounded-full border-2 shadow-sm
                text-sm font-bold whitespace-nowrap
                ${variantClass}
                ${animationClass}
              `}
            >
              {Icon && <Icon className="w-4 h-4 flex-shrink-0" />}
              {stat.emoji && <span className="text-base">{stat.emoji}</span>}
              {stat.label && <span className="text-xs sm:text-sm">{stat.label}:</span>}
              <span className="text-sm sm:text-base">{stat.value}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
