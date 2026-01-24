import React, { useState } from 'react';
import { Lightbulb } from 'lucide-react';
import { playSound } from '../engine/audio';

export const HintButton = ({ onHint, soundEnabled, disabled = false }) => {
  const [used, setUsed] = useState(false);

  const handleClick = () => {
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
