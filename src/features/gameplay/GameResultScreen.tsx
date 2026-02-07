/**
 * GameResultScreen Component
 * 
 * Generic result screen for various game completion states:
 * - victory: Player won the game (e.g., BattleLearn all ships sunk)
 * - perfect: Player achieved perfect score (e.g., RoboPath optimal path)
 * - gameOver: Player ran out of hearts
 * 
 * Replaces the old GameOverScreen with a more flexible, reusable approach.
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../../stores/gameStore';
import { usePlaySessionStore } from '../../stores/playSessionStore';
import { useTranslation } from '../../i18n/useTranslation';
import { useProfileText } from '../../hooks/useProfileText';
import { useGameAudio } from '../../hooks/useGameAudio';
import { GAME_CONFIG, CATEGORIES } from '../../games/data';
import { gameIdToSlug } from '../../utils/gameSlug';

export type GameResultType = 'victory' | 'perfect' | 'gameOver';

interface GameResultScreenProps {
  type: GameResultType;
  onContinue?: () => void; // For victory/perfect - continue to next problem
  onRetry?: () => void; // For perfect - try again for better score
  customMessage?: string; // Optional custom message
}

export const GameResultScreen: React.FC<GameResultScreenProps> = ({ 
  type, 
  onContinue,
  onRetry,
  customMessage,
}) => {
  const navigate = useNavigate();
  const t = useTranslation();
  const { formatText } = useProfileText();
  const score = usePlaySessionStore(state => state.score);
  const soundEnabled = useGameStore(state => state.soundEnabled);
  const gameType = usePlaySessionStore(state => state.gameType);
  const returnToMenu = usePlaySessionStore(state => state.returnToMenu);
  const getHighScore = useGameStore(state => state.getHighScore);
  const hearts = useGameStore(state => state.hearts);
  const { playClick } = useGameAudio(soundEnabled);

  const highScore = gameType ? getHighScore(gameType) : 0;
  const isNewRecord = gameType && score > 0 && score >= highScore;

  const baseType = gameType ? gameType.replace('_adv', '') : null;
  const gameConfig = baseType ? GAME_CONFIG[baseType] : undefined;
  const category = gameConfig ? CATEGORIES[gameConfig.category] : undefined;

  const headerEmoji = category?.emoji ?? '🎮';
  const headerTitle =
    baseType && t.games[baseType as keyof typeof t.games]
      ? t.games[baseType as keyof typeof t.games].title
      : formatText(t.game.gameOver);

  const themeBorder = gameConfig?.theme.border ?? 'border-slate-200';
  const themeText = gameConfig?.theme.text ?? 'text-slate-800';
  const themeBgSoft = gameConfig?.theme.bg ?? 'bg-slate-50';

  // Configuration based on result type
  const config = {
    victory: {
      icon: '🏆',
      iconGradient: 'from-yellow-400 via-amber-500 to-orange-500',
      iconShadow: 'shadow-[0_0_24px_rgba(251,191,36,0.45)]',
      title: formatText(t.battlelearn?.victory || 'Victory!'),
      message: customMessage || formatText(t.battlelearn?.allShipsSunk || 'Great job!'),
      primaryButton: formatText(t.game.continue || 'Continue'),
      primaryAction: onContinue,
      primaryGradient: 'from-green-400 via-emerald-500 to-teal-500',
      primaryShadow: 'shadow-green-500/40 hover:shadow-green-400/60',
      secondaryButton: formatText(t.game.returnToMenu),
      showScore: true,
    },
    perfect: {
      icon: '⭐',
      iconGradient: 'from-yellow-300 via-yellow-400 to-amber-400',
      iconShadow: 'shadow-[0_0_28px_rgba(250,204,21,0.6)]',
      title: formatText(t.roboPath?.perfect || 'Perfect!'),
      message: customMessage || formatText(t.roboPath?.perfectMessage || 'You found the optimal solution!'),
      primaryButton: formatText(t.roboPath?.continueButton || 'Next Level'),
      primaryAction: onContinue,
      primaryGradient: 'from-sky-400 via-blue-500 to-indigo-500',
      primaryShadow: 'shadow-blue-500/40 hover:shadow-blue-400/60',
      secondaryButton: onRetry ? formatText(t.roboPath?.tryAgainButton || 'Try Again') : formatText(t.game.returnToMenu),
      secondaryAction: onRetry,
      showScore: true,
    },
    gameOver: {
      icon: '💔',
      iconGradient: 'from-rose-400 via-pink-500 to-purple-500',
      iconShadow: 'shadow-[0_0_24px_rgba(244,114,182,0.45)]',
      title: formatText(t.game.gameOver),
      message: customMessage || formatText(t.game.scoreMessage.replace('{score}', String(score))),
      primaryButton: hearts > 0 
        ? formatText(t.game.retry) 
        : formatText(t.shop?.getMoreHearts || 'Get More Hearts'),
      primaryAction: hearts > 0 ? () => {
        playClick();
        if (gameType) {
          const slug = gameIdToSlug(gameType);
          void navigate(`/games/${slug}`);
        }
      } : undefined, // Will be handled separately for shop
      primaryGradient: hearts > 0 
        ? 'from-sky-400 via-blue-500 to-indigo-500'
        : 'from-pink-400 via-rose-500 to-red-500',
      primaryShadow: hearts > 0 
        ? 'shadow-blue-500/40 hover:shadow-blue-400/60'
        : 'shadow-rose-500/40 hover:shadow-rose-400/60',
      secondaryButton: formatText(t.game.returnToMenu),
      showScore: true,
      showHeartWarning: hearts === 0,
    },
  };

  const currentConfig = config[type];

  const handlePrimaryAction = () => {
    playClick();
    
    // Special handling for game over with no hearts
    if (type === 'gameOver' && hearts === 0) {
      // Navigate to shop (we'll need to update this based on shop navigation pattern)
      returnToMenu();
      void navigate('/?openShop=true');
      return;
    }
    
    if (currentConfig.primaryAction) {
      currentConfig.primaryAction();
    }
  };

  const handleSecondaryAction = () => {
    playClick();
    
    if (currentConfig.secondaryAction) {
      currentConfig.secondaryAction();
    } else {
      returnToMenu();
      void navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-slate-50 animate-in fade-in">
      <div className="w-full max-w-md">
        <div className={`relative rounded-3xl bg-white/95 shadow-xl border ${themeBorder} px-6 py-6 sm:px-8 sm:py-8`}>
          {/* Game title pill */}
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${themeBgSoft} border border-slate-200 mb-4`}>
            <span className="text-lg" aria-hidden="true">
              {headerEmoji}
            </span>
            <span className={`text-xs font-semibold tracking-wide uppercase ${themeText}`}>
              {headerTitle}
            </span>
          </div>

          {/* Icon + headline */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="relative mb-3">
              <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-br ${currentConfig.iconGradient} ${currentConfig.iconShadow} flex items-center justify-center`}>
                <span className="text-4xl sm:text-5xl" aria-hidden="true">
                  {currentConfig.icon}
                </span>
              </div>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-1">
              {currentConfig.title}
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              {currentConfig.message}
            </p>
          </div>

          {/* Heart warning for game over with no hearts */}
          {currentConfig.showHeartWarning && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl">
              <p className="text-sm text-rose-700 text-center font-medium">
                {formatText(t.game.noHeartsLeft || 'No hearts left! Visit the shop to get more.')}
              </p>
            </div>
          )}

          {/* Score + high score */}
          {currentConfig.showScore && (
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="rounded-2xl bg-slate-50 border border-slate-200 px-4 py-3 text-center">
                <div className="text-[0.65rem] sm:text-xs uppercase tracking-wide text-slate-500 mb-1">
                  {formatText(t.game.score)}
                </div>
                <div className="text-2xl sm:text-3xl font-black text-slate-900">
                  {score}
                </div>
              </div>
              <div
                className={[
                  'rounded-2xl px-4 py-3 text-center border',
                  isNewRecord
                    ? 'bg-yellow-50 border-yellow-300 shadow-[0_0_16px_rgba(250,204,21,0.5)]'
                    : 'bg-slate-50 border-slate-200',
                ].join(' ')}
              >
                <div className="text-[0.65rem] sm:text-xs uppercase tracking-wide text-slate-500 mb-1">
                  {formatText(t.game.highScore || 'High Score')}
                </div>
                <div className="flex items-center justify-center gap-1">
                  <span className="text-2xl sm:text-3xl font-black text-slate-900">
                    {highScore > 0 ? highScore : '-'}
                  </span>
                  {isNewRecord && (
                    <span className="text-xs sm:text-sm font-bold text-yellow-600">
                      {formatText(t.game.newRecord || 'New!')}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={handlePrimaryAction}
              className={`flex-1 inline-flex items-center justify-center px-4 py-3 rounded-xl bg-gradient-to-r ${currentConfig.primaryGradient} text-white font-bold text-sm sm:text-base shadow-lg ${currentConfig.primaryShadow} active:scale-95 transition-transform`}
            >
              {currentConfig.primaryButton}
            </button>
            <button
              type="button"
              onClick={handleSecondaryAction}
              className="flex-1 inline-flex items-center justify-center px-4 py-3 rounded-xl bg-slate-100 text-slate-800 font-semibold text-sm sm:text-base border border-slate-300 hover:bg-slate-200 active:scale-95 transition-transform"
            >
              {currentConfig.secondaryButton}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
