/**
 * ResourceDisplay Component
 * 
 * Shared component for displaying game resources (Hearts, Stars, Score)
 * Used in both GameHeader and MenuScreen for consistency
 */

import React from 'react';
import { Heart, Star, Trophy } from 'lucide-react';

interface ResourceDisplayProps {
  hearts: number;
  stars: number;
  score?: number; // Optional - can be hidden to reduce clutter
  showScore?: boolean; // Control score visibility
  compact?: boolean; // Compact mode for smaller screens
  maxHearts?: number;
  heartsAsNumber?: boolean; // Show hearts as "3/5" instead of icons on mobile
}

export const ResourceDisplay: React.FC<ResourceDisplayProps> = ({
  hearts,
  stars,
  score = 0,
  showScore = true,
  compact = false,
  maxHearts = 5,
  heartsAsNumber = false,
}) => {
  const heartSize = compact ? 'w-3.5 h-3.5' : 'w-4 h-4 sm:w-5 sm:h-5';
  const iconSize = compact ? 12 : 14;
  const textSize = compact ? 'text-xs' : 'text-xs sm:text-sm';
  const padding = compact ? 'px-1.5 py-0.5' : 'px-2 py-1 sm:px-2.5 sm:py-1';
  const gap = compact ? 'gap-1' : 'gap-1.5 sm:gap-2';

  return (
    <div className={`flex items-center ${gap}`}>
      {/* Hearts - Show as number on mobile if requested, icons on desktop */}
      {heartsAsNumber ? (
        <div className={`flex items-center gap-1 bg-red-50 border border-red-200 ${padding} rounded-lg`}>
          <Heart size={iconSize} className={`text-red-500 fill-red-500 ${compact ? 'w-3 h-3' : 'w-3.5 h-3.5 sm:w-4 sm:h-4'}`} />
          <span className={`${textSize} font-bold text-red-700`}>{hearts}/{maxHearts}</span>
        </div>
      ) : (
        <div className="flex items-center gap-0.5">
          {Array.from({ length: maxHearts }, (_, i) => (
            <Heart
              key={i}
              className={`${heartSize} transition-all duration-300 ${
                i < hearts ? 'text-red-500 fill-red-500' : 'text-slate-200'
              }`}
            />
          ))}
        </div>
      )}

      {/* Stars - Currency */}
      <div className={`flex items-center gap-1 bg-yellow-50 border border-yellow-200 ${padding} rounded-lg`}>
        <Star 
          size={iconSize} 
          className={`fill-yellow-400 text-yellow-600 ${compact ? 'w-3 h-3' : 'w-3.5 h-3.5 sm:w-4 sm:h-4'}`} 
        />
        <span className={`${textSize} font-bold text-yellow-700`}>{stars}</span>
      </div>

      {/* Score - Optional, can be hidden, responsive (hidden on mobile if compact) */}
      {showScore && (
        <div className={`hidden sm:flex items-center gap-1 bg-slate-50 border border-slate-200 ${padding} rounded-lg`}>
          <Trophy 
            size={iconSize} 
            className={`text-slate-600 ${compact ? 'w-3 h-3' : 'w-3.5 h-3.5 sm:w-4 sm:h-4'}`} 
          />
          <span className={`${textSize} font-bold text-slate-700`}>{score}</span>
        </div>
      )}
    </div>
  );
};
