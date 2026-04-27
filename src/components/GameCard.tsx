// Game card component
import React, { useMemo } from 'react';
import { FadeIn } from './EnhancedAnimations';
import { GameConfig } from '../types/game';
import { Lock, Trophy, type LucideIcon } from 'lucide-react';
import { useTranslation } from '../i18n/useTranslation';
import { useProfileText } from '../hooks/useProfileText';

const DefaultIcon = () => null;

interface Progress {
  current: number;
  total: number;
}

interface GameCardProps {
  gameConfig: GameConfig & {
    iconComponent?: LucideIcon | React.ComponentType<{ size?: number; className?: string }>;
  };
  level: number;
  onClick: () => void;
  isLocked?: boolean;
  progress?: Progress | null;
  badge?: string | null;
  delay?: number;
  highScore?: number; // Optional high score to display
}

export const GameCard: React.FC<GameCardProps> = ({
  gameConfig,
  level,
  onClick,
  isLocked = false,
  progress = null,
  badge = null,
  delay = 0,
  highScore,
}) => {
  const t = useTranslation();
  const { formatText } = useProfileText();
  const IconComponent = useMemo(
    () => gameConfig.iconComponent || DefaultIcon,
    [gameConfig.iconComponent],
  );

  // Get translated title and description (assert string for i18n key access)
  const gameTitle: string = (t.games[gameConfig.id as keyof typeof t.games]?.title ??
    gameConfig.title) as string;
  const gameDesc: string = (t.games[gameConfig.id as keyof typeof t.games]?.desc ??
    gameConfig.desc) as string;
  const difficultyText = gameConfig.difficulty
    ? ((t.difficulty[gameConfig.difficulty as keyof typeof t.difficulty] ??
        gameConfig.difficulty) as string)
    : null;
  const levelLabel = formatText(t.game.level);
  const ariaLabel = `${formatText(gameTitle)} - ${formatText(gameDesc)} - ${levelLabel} ${level}`;

  return (
    <FadeIn delay={delay}>
      <button
        onClick={onClick}
        disabled={isLocked}
        aria-label={ariaLabel}
        className={`
          group relative grid w-full grid-cols-[auto_1fr_auto] items-center gap-3 rounded-lg p-4 text-left
          ${gameConfig.theme.bg} border ${gameConfig.theme.border}
          shadow-sm transition-colors duration-200 hover:bg-white hover:shadow-md active:bg-slate-50
          ${isLocked ? 'opacity-50 cursor-not-allowed grayscale' : 'cursor-pointer'}
        `}
      >
        <div
          className={`
          flex h-12 w-12 items-center justify-center rounded-lg border border-white/70
          ${gameConfig.theme.iconBg} ${gameConfig.theme.text}
        `}
        >
          <IconComponent size={26} aria-hidden />
        </div>

        <div className="text-left flex-1 min-w-0">
          <h3
            className={`text-base sm:text-lg font-bold ${gameConfig.theme.text} flex items-center gap-2 mb-1 truncate`}
          >
            {formatText(gameTitle)}
            {isLocked && <Lock size={14} aria-hidden className="shrink-0" />}
          </h3>
          <p className="text-sm font-medium text-slate-600 truncate">{formatText(gameDesc)}</p>

          <div className="mt-2 flex items-center gap-2 flex-wrap">
            {badge && (
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-slate-900 text-white">
                {formatText(badge)}
              </span>
            )}
            {gameConfig.difficulty && difficultyText && (
              <span
                className={`
                text-[11px] font-bold px-2 py-0.5 rounded-md
                ${
                  gameConfig.difficulty === 'easy'
                    ? 'bg-green-100 text-green-700'
                    : gameConfig.difficulty === 'medium'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-red-100 text-red-700'
                }
              `}
              >
                {formatText(difficultyText)}
              </span>
            )}
            {highScore !== undefined && (
              <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                <Trophy size={12} aria-hidden />
                {formatText(t.game.highScore || 'High Score')}: {highScore > 0 ? highScore : '-'}
              </span>
            )}
          </div>

          {/* Progress bar */}
          {progress && (
            <div className="mt-2 w-full h-1.5 bg-slate-200 rounded-md overflow-hidden">
              <div
                className="h-full bg-emerald-500 transition-all duration-500"
                style={{ width: `${(progress.current / progress.total) * 100}%` }}
              />
            </div>
          )}
        </div>

        <div className="flex flex-col items-end gap-1 flex-shrink-0">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
            {formatText(t.level)}
          </span>
          <div
            className={`
            w-12 h-12 rounded-lg flex items-center justify-center
            bg-white/80 border ${gameConfig.theme.border}
          `}
          >
            <span className={`text-xl font-black ${gameConfig.theme.text}`}>{level}</span>
          </div>
        </div>
      </button>
    </FadeIn>
  );
};
