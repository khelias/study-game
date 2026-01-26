import React from 'react';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';

interface ControlPadProps {
  onUp: () => void;
  onDown: () => void;
  onLeft: () => void;
  onRight: () => void;
  disabled?: boolean;
  className?: string;
  compact?: boolean;
}

export const ControlPad: React.FC<ControlPadProps> = ({
  onUp,
  onDown,
  onLeft,
  onRight,
  disabled = false,
  className,
  compact = false,
}) => {
  const buttonClass = `rounded-full shadow-lg border-2 border-slate-300/80 bg-gradient-to-br from-white via-slate-50 to-slate-100 text-slate-700 flex items-center justify-center transition-all duration-200 active:translate-y-0.5 active:scale-90 hover:shadow-xl hover:border-slate-400 hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:shadow-lg disabled:hover:scale-100`;
  return (
    <div 
      className={`grid grid-cols-3 ${className ?? ''}`}
      style={{ 
        gap: compact ? 'clamp(0.375rem, 1.5vw, 0.625rem)' : 'clamp(0.5rem, 2vw, 0.75rem)'
      }}
    >
      <div />
      <button
        type="button"
        onClick={onUp}
        disabled={disabled}
        aria-label="Up"
        className={buttonClass}
        style={{
          width: compact ? 'clamp(2.25rem, 8vw, 3rem)' : 'clamp(2.5rem, 9vw, 3.5rem)',
          height: compact ? 'clamp(2.25rem, 8vw, 3rem)' : 'clamp(2.5rem, 9vw, 3.5rem)'
        }}
      >
        <ArrowUp size={compact ? 'clamp(0.875rem, 3.5vw, 1.25rem)' : 'clamp(1rem, 4vw, 1.5rem)'} />
      </button>
      <div />

      <button
        type="button"
        onClick={onLeft}
        disabled={disabled}
        aria-label="Left"
        className={buttonClass}
        style={{
          width: compact ? 'clamp(2.25rem, 8vw, 3rem)' : 'clamp(2.5rem, 9vw, 3.5rem)',
          height: compact ? 'clamp(2.25rem, 8vw, 3rem)' : 'clamp(2.5rem, 9vw, 3.5rem)'
        }}
      >
        <ArrowLeft size={compact ? 'clamp(0.875rem, 3.5vw, 1.25rem)' : 'clamp(1rem, 4vw, 1.5rem)'} />
      </button>
      <div />
      <button
        type="button"
        onClick={onRight}
        disabled={disabled}
        aria-label="Right"
        className={buttonClass}
        style={{
          width: compact ? 'clamp(2.25rem, 8vw, 3rem)' : 'clamp(2.5rem, 9vw, 3.5rem)',
          height: compact ? 'clamp(2.25rem, 8vw, 3rem)' : 'clamp(2.5rem, 9vw, 3.5rem)'
        }}
      >
        <ArrowRight size={compact ? 'clamp(0.875rem, 3.5vw, 1.25rem)' : 'clamp(1rem, 4vw, 1.5rem)'} />
      </button>

      <div />
      <button
        type="button"
        onClick={onDown}
        disabled={disabled}
        aria-label="Down"
        className={`col-start-2 ${buttonClass}`}
        style={{
          width: compact ? 'clamp(2.25rem, 8vw, 3rem)' : 'clamp(2.5rem, 9vw, 3.5rem)',
          height: compact ? 'clamp(2.25rem, 8vw, 3rem)' : 'clamp(2.5rem, 9vw, 3.5rem)'
        }}
      >
        <ArrowDown size={compact ? 'clamp(0.875rem, 3.5vw, 1.25rem)' : 'clamp(1rem, 4vw, 1.5rem)'} />
      </button>
      <div />
    </div>
  );
};
