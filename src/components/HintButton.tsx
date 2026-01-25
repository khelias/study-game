import React, { useState } from 'react';
import { Lightbulb } from 'lucide-react';
import { playSound } from '../engine/audio';

interface HintButtonProps {
  onHint?: () => void;
  soundEnabled: boolean;
  disabled?: boolean;
}

export const HintButton: React.FC<HintButtonProps> = ({ onHint, soundEnabled, disabled = false }) => {
  const [used, setUsed] = useState<boolean>(false);

  const handleClick = (): void => {
    if (used || disabled) return;
    setUsed(true);
    playSound('click', soundEnabled);
    if (onHint) onHint();
  };

  return (
    <button
      onClick={handleClick}
      disabled={used || disabled}
      className={`
        fixed bottom-4 right-4 z-50 p-4 rounded-full shadow-lg transition-all
        ${used || disabled
          ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
          : 'bg-yellow-400 hover:bg-yellow-500 text-yellow-900 hover:scale-110 active:scale-95'
        }
      `}
      aria-label={used ? 'Vihje on juba kasutatud' : 'Näita vihjet'}
      title={used ? 'Vihje on juba kasutatud' : 'Vihje'}
    >
      <Lightbulb size={24} className={used ? 'opacity-50' : ''} />
    </button>
  );
};
