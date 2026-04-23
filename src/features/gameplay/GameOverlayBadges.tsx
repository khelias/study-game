import React from 'react';
import { TrendingUp, Trophy } from 'lucide-react';
import { useTranslation } from '../../i18n/useTranslation';
import { useProfileText } from '../../hooks/useProfileText';
import { GAME_CONFIG } from '../../games/data';

interface GameOverlayBadgesProps {
  level: number;
  gameType: string;
  score: number;
  onLevelClick: () => void;
  onGameNameClick: () => void;
}

/**
 * Three floating badges that sit above the game area:
 * level (top-left), game name (top-center, opens the description
 * modal), and session score (top-right). Extracted from GameScreen
 * to keep the parent focused on state wiring.
 */
export const GameOverlayBadges: React.FC<GameOverlayBadgesProps> = ({
  level,
  gameType,
  score,
  onLevelClick,
  onGameNameClick,
}) => {
  const t = useTranslation();
  const { formatText } = useProfileText();

  const baseType = gameType.replace('_adv', '');
  const gameConfig = GAME_CONFIG[baseType];
  const gameEmoji = gameConfig?.emoji ?? '🎮';
  const gameTitleStr: string =
    gameConfig && t.games[baseType as keyof typeof t.games]
      ? t.games[baseType as keyof typeof t.games].title
      : gameType.toUpperCase();
  const gameName = formatText(gameTitleStr);

  return (
    <>
      {/* Level Badge — top-left, clickable to open level selector */}
      <div
        onClick={onLevelClick}
        className="absolute top-2 left-2 sm:top-4 sm:left-4 z-30 flex items-center gap-1.5 bg-purple-50 border-purple-200 rounded-lg shadow-md hover:bg-purple-100 hover:border-purple-300 transition-colors cursor-pointer"
        style={{
          padding: '0.375rem 0.625rem',
          boxSizing: 'border-box',
          border: '1px solid',
          borderColor: 'rgb(233, 213, 255)',
          width: 'fit-content',
          height: 'fit-content',
        }}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onLevelClick();
          }
        }}
        aria-label="Change level"
      >
        <TrendingUp size={14} className="text-purple-600 w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
        <span className="text-xs sm:text-sm font-bold text-purple-700 whitespace-nowrap">
          {level}
        </span>
      </div>

      {/* Game Name Badge — top-center, opens the game description modal */}
      <button
        type="button"
        onClick={onGameNameClick}
        className="absolute top-2 left-1/2 transform -translate-x-1/2 sm:top-4 z-30 flex items-center gap-1.5 bg-slate-50 border-slate-200 rounded-lg shadow-md cursor-pointer hover:bg-slate-100 active:scale-[0.98] transition-colors"
        style={{
          padding: '0.375rem 0.75rem',
          boxSizing: 'border-box',
          border: '1px solid',
          borderColor: 'rgb(226, 232, 240)',
          width: 'fit-content',
          height: 'fit-content',
          maxWidth: '60vw',
        }}
        aria-label={formatText(t.gameScreen.gameDescriptionTitle)}
      >
        <span className="text-base sm:text-lg flex-shrink-0">{gameEmoji}</span>
        <span className="text-xs sm:text-sm font-bold text-slate-700 whitespace-nowrap truncate">
          {gameName}
        </span>
      </button>

      {/* Session Score Badge — top-right, passive */}
      <div
        className="absolute top-2 right-2 sm:top-4 sm:right-4 z-30 flex items-center gap-1.5 bg-blue-50 border-blue-200 rounded-lg shadow-md"
        style={{
          padding: '0.375rem 0.625rem',
          boxSizing: 'border-box',
          border: '1px solid',
          borderColor: 'rgb(191, 219, 254)',
          width: 'fit-content',
          height: 'fit-content',
        }}
      >
        <Trophy size={14} className="text-blue-600 w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
        <span className="text-xs sm:text-sm font-bold text-blue-700 whitespace-nowrap">
          {score}
        </span>
      </div>
    </>
  );
};
