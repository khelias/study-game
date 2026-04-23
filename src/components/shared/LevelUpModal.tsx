/**
 * LevelUpModal Component
 *
 * Modal displayed when player levels up.
 */

import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from '../../i18n/useTranslation';
import type { GameConfig } from '../../types/game';

interface LevelUpModalProps {
  level: number;
  onNext: () => void;
  gameConfig: GameConfig;
}

export const LevelUpModal: React.FC<LevelUpModalProps> = ({ level, onNext, gameConfig }) => {
  const t = useTranslation();
  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-300"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        margin: 0,
        padding: '1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        className="bg-gradient-to-br from-white to-slate-50 rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center transform scale-100 animate-bounce-short border-4 border-yellow-400"
        style={{ margin: '0 auto' }}
      >
        <div className="mx-auto w-24 h-24 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-full flex items-center justify-center mb-4 text-6xl shadow-inner animate-star-collect">
          🏆
        </div>
        <h2 className="text-3xl font-black text-slate-800 mb-2 bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
          {t.levelUp.level} {level}!
        </h2>
        <p className="text-slate-600 mb-8 font-bold">{t.levelUp.greatWork}</p>

        <button
          onClick={onNext}
          className={`w-full py-4 rounded-xl text-xl font-black text-white shadow-lg active:scale-95 transition-all hover:scale-105 flex items-center justify-center gap-2 ${gameConfig.theme.accent} hover:brightness-110`}
        >
          {t.levelUp.nextLevel} <ArrowRight />
        </button>
      </div>
    </div>
  );
};
