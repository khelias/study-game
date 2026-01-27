/**
 * LevelSelectorModal Component
 * 
 * Modal for manually changing the level of the current game.
 */

import React, { useState } from 'react';
import { X, TrendingUp } from 'lucide-react';
import { useTranslation } from '../../i18n/useTranslation';
import { useProfileText } from '../../hooks/useProfileText';
import { GAME_CONFIG } from '../../games/data';
import { FocusTrap } from '../../components/AccessibilityHelpers';

interface LevelSelectorModalProps {
  currentLevel: number;
  gameType: string;
  onClose: () => void;
  onLevelChange: (level: number) => void;
}

export const LevelSelectorModal: React.FC<LevelSelectorModalProps> = ({
  currentLevel,
  gameType,
  onClose,
  onLevelChange,
}) => {
  const t = useTranslation();
  const { formatText } = useProfileText();
  const [selectedLevel, setSelectedLevel] = useState<number>(currentLevel);

  const handleConfirm = () => {
    if (selectedLevel !== currentLevel) {
      onLevelChange(selectedLevel);
    }
    onClose();
  };

  // Get game title (translated)
  const baseType = gameType.replace('_adv', '');
  const gameConfig = GAME_CONFIG[baseType];
  const gameTitle: string = gameConfig 
    ? (t.games[gameConfig.id as keyof typeof t.games]?.title || gameConfig.title)
    : gameType;

  // Generate level options (1-20, or reasonable range)
  const maxLevel = 20;
  const levels = Array.from({ length: maxLevel }, (_, i) => i + 1);

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300"
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
        justifyContent: 'center'
      }}
      onClick={(e: React.MouseEvent<HTMLDivElement>) => e.target === e.currentTarget && onClose()}
    >
      <FocusTrap active={true}>
        <div 
          className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto"
          style={{ margin: '0 auto' }}
        >
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <TrendingUp size={24} className="text-purple-600" />
              <h2 className="text-2xl font-black text-slate-800">{formatText(String(t.gameScreen.selectLevel))}</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors"
              aria-label={t.statsModal.close}
            >
              <X size={20} className="text-slate-600" />
            </button>
          </div>

          <div className="space-y-4 mb-6">
            {/* Game info */}
            <div className="bg-slate-50 p-4 rounded-xl border-2 border-slate-200">
              <div className="text-sm font-semibold text-slate-600 mb-1">{formatText(String(t.gameScreen.game))}</div>
              <div className="text-lg font-black text-slate-800">{formatText(gameTitle)}</div>
            </div>

            {/* Current level */}
            <div className="bg-purple-50 p-4 rounded-xl border-2 border-purple-200">
              <div className="text-sm font-semibold text-purple-600 mb-1">{formatText(String(t.gameScreen.currentLevel))}</div>
              <div className="text-2xl font-black text-purple-700">{currentLevel}</div>
            </div>

            {/* Level selector */}
            <div>
              <div className="text-sm font-semibold text-slate-600 mb-3">{formatText(String(t.gameScreen.selectNewLevel))}</div>
              <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 max-h-[300px] overflow-y-auto p-2 bg-slate-50 rounded-xl">
                {levels.map((level) => (
                  <button
                    key={level}
                    onClick={() => setSelectedLevel(level)}
                    className={`
                      h-10 sm:h-12 rounded-lg font-bold text-sm sm:text-base transition-all
                      ${selectedLevel === level
                        ? 'bg-purple-500 text-white scale-110 shadow-lg ring-2 ring-purple-300'
                        : level === currentLevel
                        ? 'bg-purple-100 text-purple-700 border-2 border-purple-300'
                        : 'bg-white text-slate-700 hover:bg-purple-50 hover:border-purple-200 border-2 border-slate-200'
                      }
                    `}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold py-3 px-4 rounded-xl transition-colors"
            >
              {formatText(t.common.cancel)}
            </button>
            <button
              onClick={handleConfirm}
              disabled={selectedLevel === currentLevel}
              className="flex-1 bg-purple-500 hover:bg-purple-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-xl transition-colors"
            >
              {formatText(t.common.confirm)}
            </button>
          </div>
        </div>
      </FocusTrap>
    </div>
  );
};
