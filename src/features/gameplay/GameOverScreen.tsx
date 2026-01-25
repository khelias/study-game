import React from 'react';
import { useGameStore } from '../../stores/gameStore';
import { usePlaySessionStore } from '../../stores/playSessionStore';

export const GameOverScreen: React.FC = () => {
  const score = useGameStore(state => state.score);
  const returnToMenu = usePlaySessionStore(state => state.returnToMenu);
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-red-50 p-4 animate-in fade-in">
      <div className="text-8xl mb-4 animate-bounce">😢</div>
      <h2 className="text-4xl font-black text-red-600 mb-2">Mäng Läbi!</h2>
      <p className="text-slate-600 mb-8">Said {score} punkti!</p>
      <button 
        onClick={returnToMenu} 
        className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-xl font-bold text-xl shadow-lg transition-transform active:scale-95"
      >
        Tagasi Menüüsse
      </button>
    </div>
  );
};
