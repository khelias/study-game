/**
 * ResourceBadge Component
 *
 * Individual badge for displaying a single resource (Stars or Hearts)
 * Used for side-by-side display in headers
 */

import React from 'react';
import { Heart, Star } from 'lucide-react';

interface ResourceBadgeProps {
  type: 'stars' | 'hearts';
  value: number;
  maxValue?: number; // For hearts
  compact?: boolean;
  onClick?: () => void; // Optional click handler to open shop
}

export const ResourceBadge: React.FC<ResourceBadgeProps> = ({
  type,
  value,
  maxValue = 5,
  compact = false,
  onClick,
}) => {
  const iconSize = 16;
  const textSize = compact ? 'text-xs' : 'text-sm';
  const padding = compact ? 'px-2 py-1.5' : 'px-2.5 py-1.5';

  const baseClasses = onClick
    ? 'cursor-pointer transition-all hover:scale-105 active:scale-95'
    : '';

  if (type === 'stars') {
    return (
      <div
        onClick={onClick}
        className={`flex items-center gap-1.5 bg-yellow-50 border border-yellow-200 ${padding} rounded-lg ${baseClasses}`}
        role={onClick ? 'button' : undefined}
        tabIndex={onClick ? 0 : undefined}
        onKeyDown={
          onClick
            ? (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onClick();
                }
              }
            : undefined
        }
        aria-label={onClick ? 'Open shop to buy stars' : undefined}
      >
        <Star
          size={iconSize}
          className="fill-yellow-400 text-yellow-600 w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0"
        />
        <span className={`${textSize} font-bold text-yellow-700 whitespace-nowrap`}>{value}</span>
      </div>
    );
  }

  // Hearts
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-1.5 bg-red-50 border border-red-200 ${padding} rounded-lg ${baseClasses}`}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
      aria-label={onClick ? 'Open shop to buy hearts' : undefined}
    >
      <Heart
        size={iconSize}
        className="text-red-500 fill-red-500 w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0"
      />
      <span className={`${textSize} font-bold text-red-700 whitespace-nowrap`}>
        {value}/{maxValue}
      </span>
    </div>
  );
};
