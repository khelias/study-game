/**
 * GameHeader Component
 *
 * Header bar for the game screen showing score, level, hearts, and stars.
 */

import React from 'react';
import { Home, Menu, X } from 'lucide-react';
import { useTranslation } from '../i18n/useTranslation';
import { useProfileText } from '../hooks/useProfileText';
import { ResourceBadge } from './shared/ResourceBadge';

interface GameHeaderProps {
  score: number; // Current game session score
  stars: number; // Persistent currency
  hearts: number; // Persistent global resource
  levelProgress: {
    correctAnswers: number;
    totalAnswers: number;
  } | null;
  levelUpRequirement: number; // How many correct answers needed to level up
  /** When false (e.g. onGameWin games), level progress bar is hidden */
  showLevelProgress?: boolean;
  particleActive: boolean;
  onReturnToMenu: () => void;
  onSettingsClick: () => void;
  showSettingsMenu: boolean;
  settingsMenuRef: React.RefObject<HTMLDivElement>;
  onShopClick?: () => void; // Optional shop handler
  children?: React.ReactNode; // For settings menu dropdown
}

export const GameHeader: React.FC<GameHeaderProps> = ({
  score: _score,
  stars,
  hearts,
  levelProgress,
  levelUpRequirement,
  showLevelProgress = true,
  particleActive: _particleActive,
  onReturnToMenu,
  onSettingsClick,
  showSettingsMenu,
  settingsMenuRef,
  onShopClick,
  children,
}) => {
  const t = useTranslation();
  const { formatText } = useProfileText();

  // Calculate progress toward next level
  const progressCount = levelProgress?.correctAnswers || 0;
  const progressTotal = levelUpRequirement;
  const MAX_HEARTS = 5;

  return (
    <div className="w-full bg-white/90 backdrop-blur-md border-b-2 sm:border-b-4 border-slate-200 sticky top-0 z-40 shadow-sm">
      <div className="w-full max-w-2xl mx-auto flex items-center justify-between gap-2 sm:gap-3 px-2 sm:px-4 p-2 sm:p-2.5 min-h-[56px] sm:min-h-[64px]">
        {/* Left: Home button + Stars */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={onReturnToMenu}
            aria-label={t.gameScreen.returnToMenu}
            className="bg-slate-100 hover:bg-slate-200 p-2 rounded-lg transition-colors active:scale-90 flex items-center justify-center"
          >
            <Home size={18} className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600" />
          </button>
          <ResourceBadge type="stars" value={stars} compact={true} onClick={onShopClick} />
        </div>

        {/* Center: Level Progress (hidden for onGameWin games) */}
        <div className="flex-1 flex flex-col items-center gap-1 min-w-0 mx-2 sm:mx-4">
          {showLevelProgress && (
            <div className="w-full max-w-[120px] sm:max-w-[180px]">
              <div className="text-xs sm:text-sm font-bold text-slate-700 text-center mb-1">
                {progressCount}/{progressTotal}
              </div>
              <div className="w-full h-2 sm:h-2.5 bg-slate-200 rounded-full overflow-hidden shadow-inner">
                <div
                  className="h-full bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500 transition-all duration-500 ease-out rounded-full"
                  style={{ width: `${Math.min(100, (progressCount / progressTotal) * 100)}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Right: Hearts + Menu */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <ResourceBadge
            type="hearts"
            value={hearts}
            maxValue={MAX_HEARTS}
            compact={true}
            onClick={onShopClick}
          />
          <div className="relative" ref={settingsMenuRef}>
            <button
              onClick={onSettingsClick}
              aria-label={formatText(t.menu.settings)}
              title={formatText(t.menu.settings)}
              aria-expanded={showSettingsMenu}
              className="bg-slate-100 hover:bg-slate-200 p-2 rounded-lg transition-colors active:scale-90 flex items-center justify-center"
            >
              {showSettingsMenu ? (
                <X size={18} className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600" />
              ) : (
                <Menu size={18} className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600" />
              )}
            </button>
            {showSettingsMenu && children}
          </div>
        </div>
      </div>
    </div>
  );
};
