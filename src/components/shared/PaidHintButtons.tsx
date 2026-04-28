/**
 * PaidHintButtons - Global hint system for games with star-based hints
 *
 * Renders hint buttons configured in GameConfig.paidHints
 */

import React from 'react';
import { useTranslation } from '../../i18n/useTranslation';
import { Z_INDEX } from '../../utils/zIndex';
import type { PaidHint } from '../../types/game';

interface PaidHintButtonsProps {
  hints: PaidHint[];
  stars: number;
  onHintClick: (hintId: string) => void;
  disabled?: boolean;
  placement?: 'fixed' | 'inline';
}

export const PaidHintButtons: React.FC<PaidHintButtonsProps> = ({
  hints,
  stars,
  onHintClick,
  disabled = false,
  placement = 'fixed',
}) => {
  const t = useTranslation();

  if (hints.length === 0) return null;

  // Helper to get nested translation value
  const getNestedValue = (obj: unknown, path: string): string | undefined => {
    const parts = path.split('.');
    let current: unknown = obj;
    for (const part of parts) {
      if (typeof current === 'object' && current !== null && part in current) {
        current = (current as Record<string, unknown>)[part];
      } else {
        return undefined;
      }
    }
    return typeof current === 'string' ? current : undefined;
  };

  const containerClass =
    placement === 'inline'
      ? 'flex flex-wrap justify-center gap-3'
      : 'fixed bottom-4 right-4 flex flex-col gap-3';
  const containerStyle = placement === 'fixed' ? { zIndex: Z_INDEX.HINTS } : undefined;

  return (
    <div className={containerClass} style={containerStyle}>
      {hints.map((hint) => {
        const isDisabled = disabled || stars < hint.cost;
        const rawLabel = getNestedValue(t, hint.labelKey);
        const labelText =
          rawLabel?.replace('{cost}', String(hint.cost)) || `${hint.icon} ${hint.cost}⭐`;

        return (
          <button
            type="button"
            key={hint.id}
            onClick={() => !isDisabled && onHintClick(hint.id)}
            disabled={isDisabled}
            className="relative p-4 rounded-full shadow-lg transition-all bg-yellow-400 hover:bg-yellow-500 text-yellow-900 hover:scale-110 active:scale-95 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed"
            title={labelText}
            aria-label={labelText}
          >
            <span className="text-2xl leading-none">{hint.icon}</span>
            {/* Cost badge */}
            <span className="absolute -top-1 -right-1 bg-amber-600 text-white text-xs font-bold rounded-full px-1.5 py-0.5 shadow-md">
              {hint.cost}⭐
            </span>
          </button>
        );
      })}
    </div>
  );
};
