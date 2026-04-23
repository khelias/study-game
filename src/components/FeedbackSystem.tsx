import React from 'react';
import { getTranslations } from '../i18n';

type EncouragementType = 'correct' | 'wrong' | 'levelUp';

/**
 * Get a random encouragement message for the given type.
 */
// eslint-disable-next-line react-refresh/only-export-components
export const getRandomEncouragement = (type: EncouragementType, streak = 0): string => {
  const t = getTranslations();
  const encouragements = t.feedback;

  if (type === 'correct') {
    if (streak >= 7) return encouragements.streak[5] ?? '';
    if (streak >= 6) return encouragements.streak[4] ?? '';
    if (streak >= 5) return encouragements.streak[3] ?? '';
    if (streak >= 4) return encouragements.streak[2] ?? '';
    if (streak >= 3) return encouragements.streak[1] ?? '';
    if (streak >= 2) return encouragements.streak[0] ?? '';
    return encouragements.correct[Math.floor(Math.random() * encouragements.correct.length)] ?? '';
  }
  if (type === 'wrong') {
    return encouragements.wrong[Math.floor(Math.random() * encouragements.wrong.length)] ?? '';
  }
  if (type === 'levelUp') {
    return encouragements.levelUp[Math.floor(Math.random() * encouragements.levelUp.length)] ?? '';
  }
  return '';
};

interface ProgressIndicatorProps {
  current: number;
  total: number;
  label?: string;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  current,
  total,
  label = '',
}) => {
  const percentage = (current / total) * 100;

  return (
    <div className="w-full max-w-xs">
      {label && (
        <div className="text-sm font-semibold text-slate-600 mb-1 text-center">{label}</div>
      )}
      <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden shadow-inner">
        <div
          className="h-full bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500 transition-all duration-500 ease-out rounded-full"
          style={{ width: `${percentage}%` }}
        />
      </div>
      {/* Text display is now optional - can be hidden if shown elsewhere */}
      {label && (
        <div className="text-xs text-slate-500 text-center mt-1">
          {current} / {total}
        </div>
      )}
    </div>
  );
};
