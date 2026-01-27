/**
 * GameHeader Component
 * 
 * Header bar for the game screen showing score, level, hearts, and stars.
 */

import React from 'react';
import { Home, Trophy, Sparkles, Heart, Menu, X, Star } from 'lucide-react';
import { useTranslation } from '../i18n/useTranslation';
import { useProfileText } from '../hooks/useProfileText';
import { PulseEffect } from './EnhancedAnimations';
import { ProgressIndicator } from './FeedbackSystem';

interface GameHeaderProps {
  score: number;
  currentLevel: number;
  hearts: number;
  stars: number;
  particleActive: boolean;
  onReturnToMenu: () => void;
  onSettingsClick: () => void;
  showSettingsMenu: boolean;
  settingsMenuRef: React.RefObject<HTMLDivElement>;
  children?: React.ReactNode; // For settings menu dropdown
}

export const GameHeader: React.FC<GameHeaderProps> = ({
  score,
  currentLevel,
  hearts,
  stars,
  particleActive,
  onReturnToMenu,
  onSettingsClick,
  showSettingsMenu,
  settingsMenuRef,
  children,
}) => {
  const t = useTranslation();
  const { formatText } = useProfileText();
  const scoreLabel = formatText(t.game.score);
  const levelLabel = formatText(t.game.level);

  return (
    <div className="flex justify-between items-center p-1.5 sm:p-3 bg-white/80 backdrop-blur-md border-b-2 sm:border-b-4 border-slate-200 sticky top-0 z-40 shadow-sm">
      <div className="w-full max-w-2xl mx-auto grid grid-cols-2 items-center gap-1.5 px-2 sm:px-0 sm:flex sm:items-center sm:justify-between sm:gap-3">
        <div className="flex items-center gap-2 sm:gap-3 order-1 sm:order-1">
          <button
            onClick={onReturnToMenu}
            aria-label={t.gameScreen.returnToMenu}
            className="bg-slate-100 hover:bg-slate-200 p-1.5 sm:p-3 rounded-lg sm:rounded-xl transition-colors active:scale-90"
          >
            <Home size={16} className="sm:w-5 sm:h-5 text-slate-600" />
          </button>
          <div className="relative" ref={settingsMenuRef}>
            <button
              onClick={onSettingsClick}
              aria-label={formatText(t.menu.settings)}
              title={formatText(t.menu.settings)}
              aria-expanded={showSettingsMenu}
              className="bg-slate-100 hover:bg-slate-200 p-1.5 sm:p-3 rounded-lg sm:rounded-xl transition-colors active:scale-90"
            >
              {showSettingsMenu ? (
                <X size={14} className="sm:w-5 sm:h-5 text-slate-600" />
              ) : (
                <Menu size={14} className="sm:w-5 sm:h-5 text-slate-600" />
              )}
            </button>
            {showSettingsMenu && children}
          </div>
        </div>

        <div className="flex flex-col items-end gap-0.5 sm:gap-1.5 order-2 sm:order-3">
          <div className="flex items-center gap-1 sm:gap-2">
            <div className="flex items-center gap-1 sm:gap-1.5 bg-yellow-100/80 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full text-yellow-700 shadow-sm">
              <Trophy size={13} className="sm:w-4 sm:h-4" />
              <span className="text-xs sm:text-sm font-black">{score}</span>
              <span className="hidden sm:inline text-[10px] font-bold uppercase tracking-wide text-yellow-700/80">
                {scoreLabel}
              </span>
              <span className="sr-only sm:hidden">{scoreLabel}</span>
            </div>
            <div className="flex items-center gap-1 sm:gap-1.5 bg-purple-100/80 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full text-purple-700 shadow-sm">
              <Sparkles size={13} className="sm:w-4 sm:h-4" />
              <span className="text-xs sm:text-sm font-black">{currentLevel}</span>
              <span className="hidden sm:inline text-[10px] font-bold uppercase tracking-wide text-purple-700/80">
                {levelLabel}
              </span>
              <span className="sr-only sm:hidden">{levelLabel}</span>
            </div>
          </div>
          <div className="hidden sm:flex gap-0.5 sm:gap-1">
            {Array.from({ length: 3 }, (_, i) => (
              <Heart
                key={i}
                className={`w-5 h-5 sm:w-7 sm:h-7 transition-all duration-300 ${
                  i < hearts ? 'text-red-500 fill-red-500 animate-pulse-slow' : 'text-slate-200'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="col-span-2 relative flex items-center justify-center order-3 sm:order-2 w-full">
          <div className="flex flex-col items-center gap-0.5 sm:gap-1">
            <div className="flex gap-0.5 sm:gap-1.5 bg-slate-100 px-1.5 sm:px-3 py-0.5 sm:py-2 rounded-full">
              {Array.from({ length: 5 }, (_, i) => (
                <PulseEffect key={i} active={i < stars && particleActive}>
                  <div className={`transition-all duration-500 ${i < stars ? 'scale-110' : 'scale-100'}`}>
                    <Star
                      className={`w-3.5 h-3.5 sm:w-5 sm:h-5 ${
                        i < stars ? 'text-yellow-400 fill-yellow-400 drop-shadow-sm' : 'text-slate-300'
                      }`}
                      strokeWidth={2.5}
                    />
                  </div>
                </PulseEffect>
              ))}
            </div>
            <div className="w-16 sm:w-full max-w-xs">
              <ProgressIndicator current={stars} total={5} />
            </div>
          </div>
          <div className="absolute right-0 top-1/2 -translate-y-1/2 flex gap-0.5 sm:hidden">
            {Array.from({ length: 3 }, (_, i) => (
              <Heart
                key={i}
                className={`w-4 h-4 transition-all duration-300 ${
                  i < hearts ? 'text-red-500 fill-red-500 animate-pulse-slow' : 'text-slate-200'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
