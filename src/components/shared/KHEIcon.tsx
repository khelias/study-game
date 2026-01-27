/**
 * KHE Icon Component
 * 
 * Personal logo for Kaido Henrik Elias
 * Professional monogram-style logo
 */

import React from 'react';

interface KHEIconProps {
  size?: number;
  className?: string;
}

export const KHEIcon: React.FC<KHEIconProps> = ({ 
  size, 
  className = '' 
}) => {
  // Match home button size: w-4 h-4 sm:w-5 sm:h-5 (16px/20px)
  return (
    <div 
      className={`flex items-center justify-center w-4 h-4 sm:w-5 sm:h-5 ${className}`}
    >
      {/* Pink and blue gradient design */}
      <div className="relative flex items-center justify-center w-full h-full rounded bg-gradient-to-br from-pink-100 to-blue-100 border border-pink-200/60 shadow-sm">
        <div className="flex items-center justify-center gap-[1.5px] leading-none">
          <span className="text-pink-600 text-[9px] sm:text-[11px] font-black tracking-tight">K</span>
          <span className="text-pink-500 text-[9px] sm:text-[11px] font-black tracking-tight">H</span>
          <span className="text-blue-600 text-[9px] sm:text-[11px] font-black tracking-tight">E</span>
        </div>
      </div>
    </div>
  );
};
