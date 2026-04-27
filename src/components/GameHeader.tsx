/**
 * GameHeader Component
 *
 * Compact in-game HUD showing navigation, game status, score, hearts, and stars.
 */

import React from 'react';
import { Home, Menu, TrendingUp, Trophy, X } from 'lucide-react';
import { useTranslation } from '../i18n/useTranslation';
import { useProfileText } from '../hooks/useProfileText';
import { GAME_CONFIG } from '../games/data';
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
  currentLevel: number;
  gameType: string;
  onLevelClick: () => void;
  onGameNameClick: () => void;
  showSettingsMenu: boolean;
  settingsMenuRef: React.RefObject<HTMLDivElement>;
  onShopClick?: () => void; // Optional shop handler
  children?: React.ReactNode; // For settings menu dropdown
}

export const GameHeader: React.FC<GameHeaderProps> = ({
  score,
  stars,
  hearts,
  levelProgress,
  levelUpRequirement,
  showLevelProgress = true,
  particleActive: _particleActive,
  onReturnToMenu,
  onSettingsClick,
  currentLevel,
  gameType,
  onLevelClick,
  onGameNameClick,
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
  const baseType = gameType.replace('_adv', '');
  const gameConfig = GAME_CONFIG[baseType];
  const gameEmoji = gameConfig?.emoji ?? '🎮';
  const gameTitleStr: string =
    gameConfig && t.games[baseType as keyof typeof t.games]
      ? t.games[baseType as keyof typeof t.games].title
      : gameType.toUpperCase();
  const gameName = formatText(gameTitleStr);

  return (
    <div className="w-full border-b border-slate-200 bg-slate-50/95">
      <div className="mx-auto grid w-full max-w-5xl grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-2 px-3 py-2 sm:px-4 lg:grid-cols-[minmax(14rem,1fr)_minmax(12rem,18rem)_minmax(14rem,1fr)]">
        <div className="flex min-w-0 items-center gap-2">
          <button
            onClick={onReturnToMenu}
            aria-label={t.gameScreen.returnToMenu}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white/90 text-slate-700 shadow-sm transition-colors hover:bg-slate-100 active:scale-95"
          >
            <Home size={18} aria-hidden className="text-slate-600" />
          </button>
          <button
            type="button"
            onClick={onGameNameClick}
            className="flex min-w-0 items-center gap-2 rounded-lg px-1.5 py-1 text-left text-slate-800 transition-colors hover:bg-slate-100"
            aria-label={formatText(t.gameScreen.gameDescriptionTitle)}
          >
            <span className="text-lg" aria-hidden>
              {gameEmoji}
            </span>
            <span className="block min-w-0 truncate text-sm font-black leading-tight">
              {gameName}
            </span>
          </button>
          <button
            type="button"
            onClick={onLevelClick}
            className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-lg border border-purple-200 bg-purple-50 px-2.5 text-sm font-black text-purple-700 shadow-sm transition-colors hover:bg-purple-100"
            aria-label="Change level"
          >
            <TrendingUp size={15} aria-hidden className="text-purple-600" />
            <span className="hidden sm:inline">{formatText(t.game.level)}</span>
            {currentLevel}
          </button>
        </div>

        <div className="order-3 col-span-2 flex min-w-0 items-center lg:order-none lg:col-span-1">
          {showLevelProgress && (
            <div className="min-w-0 flex-1">
              <div className="mb-1 flex items-center justify-center gap-2 text-xs font-black text-slate-700">
                {progressCount}/{progressTotal}
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200 shadow-inner">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500 transition-all duration-500 ease-out"
                  style={{ width: `${Math.min(100, (progressCount / progressTotal) * 100)}%` }}
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-2">
          <div className="hidden h-9 items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-2.5 text-sm font-black text-blue-700 shadow-sm sm:inline-flex">
            <Trophy size={15} aria-hidden className="text-blue-600" />
            {score}
          </div>
          <ResourceBadge type="stars" value={stars} compact={true} onClick={onShopClick} />
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
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-slate-100 text-slate-700 transition-colors hover:bg-slate-200 active:scale-95"
            >
              {showSettingsMenu ? (
                <X size={18} aria-hidden className="text-slate-600" />
              ) : (
                <Menu size={18} aria-hidden className="text-slate-600" />
              )}
            </button>
            {showSettingsMenu && children}
          </div>
        </div>
      </div>
    </div>
  );
};
