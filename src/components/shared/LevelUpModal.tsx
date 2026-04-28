/**
 * LevelUpModal Component
 *
 * Modal displayed when player levels up.
 */

import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from '../../i18n/useTranslation';
import type { GameConfig } from '../../types/game';
import { AppModal } from './AppModal';

interface LevelUpModalProps {
  level: number;
  onNext: () => void;
  gameConfig: GameConfig;
}

export const LevelUpModal: React.FC<LevelUpModalProps> = ({ level, onNext, gameConfig }) => {
  const t = useTranslation();
  return (
    <AppModal
      labelledBy="level-up-modal-title"
      closeOnBackdrop={false}
      closeOnEscape={false}
      size="sm"
      panelClassName="border-4 border-yellow-400 bg-gradient-to-br from-white to-slate-50"
      contentClassName="p-7 text-center sm:p-8"
    >
      <div className="mx-auto w-24 h-24 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-full flex items-center justify-center mb-4 text-6xl shadow-inner animate-star-collect">
        🏆
      </div>
      <h2
        id="level-up-modal-title"
        className="text-3xl font-black text-slate-800 mb-2 bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent"
      >
        {t.levelUp.level} {level}!
      </h2>
      <p className="text-slate-600 mb-8 font-bold">{t.levelUp.greatWork}</p>

      <button
        onClick={onNext}
        className={`w-full py-4 rounded-xl text-xl font-black text-white shadow-lg active:scale-95 transition-all hover:scale-105 flex items-center justify-center gap-2 ${gameConfig.theme.accent} hover:brightness-110`}
      >
        {t.levelUp.nextLevel} <ArrowRight />
      </button>
    </AppModal>
  );
};
