import React from 'react';
import { useGameStore } from '../../stores/gameStore';
import { usePlaySessionStore } from '../../stores/playSessionStore';
import { useTranslation } from '../../i18n/useTranslation';
import { useProfileText } from '../../hooks/useProfileText';

export const GameOverScreen: React.FC = () => {
  const t = useTranslation();
  const { formatText } = useProfileText();
  const score = useGameStore(state => state.score);
  const returnToMenu = usePlaySessionStore(state => state.returnToMenu);
  const scoreMessage = formatText(
    t.game.scoreMessage.replace('{score}', String(score))
  );
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-red-50 p-4 animate-in fade-in">
      <div className="text-8xl mb-4 animate-bounce">😢</div>
      <h2 className="text-4xl font-black text-red-600 mb-2">{formatText(t.game.gameOver)}</h2>
      <p className="text-slate-600 mb-8">{scoreMessage}</p>
      <button 
        onClick={returnToMenu} 
        className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-xl font-bold text-xl shadow-lg transition-transform active:scale-95"
      >
        {formatText(t.game.returnToMenu)}
      </button>
    </div>
  );
};
