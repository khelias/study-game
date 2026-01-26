import React, { useState } from 'react';
import { Lightbulb } from 'lucide-react';
import { playSound } from '../engine/audio';
import { useTranslation } from '../i18n/useTranslation';
import { useProfileText } from '../hooks/useProfileText';
import { Z_INDEX } from '../utils/zIndex';

interface HintButtonProps {
  onHint?: () => void;
  soundEnabled: boolean;
  disabled?: boolean;
}

export const HintButton: React.FC<HintButtonProps> = ({ onHint, soundEnabled, disabled = false }) => {
  const [used, setUsed] = useState<boolean>(false);
  const t = useTranslation();
  const { formatText } = useProfileText();
  const isDisabled = used || disabled;
  const label = formatText(isDisabled ? t.gameScreen.hintButton.used : t.gameScreen.hintButton.show);

  const handleClick = (): void => {
    if (isDisabled) return;
    setUsed(true);
    playSound('click', soundEnabled);
    if (onHint) onHint();
  };

  return (
    <button
      onClick={handleClick}
      disabled={isDisabled}
      className={`
        fixed bottom-4 right-4 p-4 rounded-full shadow-lg transition-all
        ${isDisabled
          ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
          : 'bg-yellow-400 hover:bg-yellow-500 text-yellow-900 hover:scale-110 active:scale-95'
        }
      `}
      style={{ zIndex: Z_INDEX.HINTS }}
      aria-label={label}
      title={label}
    >
      <Lightbulb size={24} className={isDisabled ? 'opacity-50' : ''} />
    </button>
  );
};
