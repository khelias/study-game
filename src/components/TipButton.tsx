import React from 'react';
import { Sparkles } from 'lucide-react';
import { playSound } from '../engine/audio';
import { useTranslation } from '../i18n/useTranslation';
import { useProfileText } from '../hooks/useProfileText';
import { Z_INDEX } from '../utils/zIndex';

interface TipButtonProps {
  onTip?: () => void;
  soundEnabled: boolean;
  disabled?: boolean;
  placement?: 'fixed' | 'inline';
}

export const TipButton: React.FC<TipButtonProps> = ({
  onTip,
  soundEnabled,
  disabled = false,
  placement = 'fixed',
}) => {
  const t = useTranslation();
  const { formatText } = useProfileText();
  const label = formatText(
    disabled ? t.gameScreen.tipButton.unavailable : t.gameScreen.tipButton.show,
  );

  const handleClick = (): void => {
    if (disabled) return;
    playSound('click', soundEnabled);
    if (onTip) onTip();
  };

  const placementClass =
    placement === 'inline' ? 'p-4 rounded-full' : 'fixed bottom-4 left-4 p-4 rounded-full';

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`
        ${placementClass} shadow-lg transition-all
        ${
          disabled
            ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
            : 'bg-blue-400 hover:bg-blue-500 text-white hover:scale-110 active:scale-95'
        }
      `}
      style={placement === 'fixed' ? { zIndex: Z_INDEX.HINTS } : undefined}
      aria-label={label}
      title={label}
    >
      <Sparkles size={22} className={disabled ? 'opacity-50' : ''} />
    </button>
  );
};
