// Enhanced game card component - better UI/UX
import React, { useMemo } from 'react';
import { FadeIn } from './EnhancedAnimations';
import { GameConfig } from '../types/game';
import { LucideIcon } from 'lucide-react';
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
}

export const GameCard: React.FC<GameCardProps> = ({ 
  gameConfig, 
  level, 
  onClick, 
  isLocked = false,
  progress = null,
  badge = null,
  delay = 0
}) => {
  const t = useTranslation();
  const { formatText } = useProfileText();
  const IconComponent = useMemo(
    () => gameConfig.iconComponent || DefaultIcon,
    [gameConfig.iconComponent]
  );
  
  // Get translated title and description
  const gameTitle = t.games[gameConfig.id as keyof typeof t.games]?.title || gameConfig.title;
  const gameDesc = t.games[gameConfig.id as keyof typeof t.games]?.desc || gameConfig.desc;
  const difficultyText = gameConfig.difficulty 
    ? t.difficulty[gameConfig.difficulty as keyof typeof t.difficulty] || gameConfig.difficulty
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
          group relative flex items-center gap-4 p-5 rounded-3xl w-full
          ${gameConfig.theme.bg} border-4 ${gameConfig.theme.border}
          shadow-lg hover:shadow-2xl transition-all duration-300 
          hover:scale-[1.03] hover:-translate-y-1 active:scale-[0.98]
          ${isLocked ? 'opacity-50 cursor-not-allowed grayscale' : 'cursor-pointer'}
        `}
      >
        {/* Badge - enhanced */}
        {badge && (
          <div className="absolute -top-3 -right-3 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-black px-3 py-1.5 rounded-full animate-bounce shadow-lg z-10 border-2 border-white">
            ✨ {formatText(badge)}
          </div>
        )}
        
        {/* Icon - enhanced with gradient background */}
        <div className={`
          relative p-5 rounded-2xl transition-all duration-300
          group-hover:rotate-12 group-hover:scale-125
          bg-gradient-to-br ${gameConfig.theme.iconBg} 
          shadow-md group-hover:shadow-xl
          ${gameConfig.theme.text}
        `}>
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl"></div>
          <IconComponent size={36} className="relative z-10" />
        </div>
        
        {/* Content - enhanced */}
        <div className="text-left flex-1 min-w-0">
          <h3 className={`text-xl font-black ${gameConfig.theme.text} flex items-center gap-2 mb-1 truncate`}>
            {formatText(gameTitle)}
            {isLocked && <span className="text-sm">🔒</span>}
          </h3>
          <p className="text-sm font-semibold text-slate-600 mb-2 truncate">{formatText(gameDesc)}</p>
          
          {/* Difficulty badge */}
          {gameConfig.difficulty && difficultyText && (
            <div className="mt-1 flex items-center gap-1">
              <span className={`
                text-xs font-bold px-2 py-0.5 rounded-full
                ${gameConfig.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                  gameConfig.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'}
              `}>
                {formatText(difficultyText)}
              </span>
            </div>
          )}
          
          {/* Progress bar */}
          {progress && (
            <div className="mt-2 w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-500"
                style={{ width: `${(progress.current / progress.total) * 100}%` }}
              />
            </div>
          )}
        </div>
        
        {/* Level indicator - enhanced */}
        <div className="flex flex-col items-end gap-1 flex-shrink-0">
          <span className="text-xs font-bold text-slate-500 tracking-wider">{formatText(t.level)}</span>
          <div className={`
            w-16 h-16 rounded-2xl flex items-center justify-center
            bg-gradient-to-br ${gameConfig.theme.iconBg}
            border-4 ${gameConfig.theme.border}
            shadow-lg group-hover:scale-110 transition-transform
          `}>
            <span className={`text-3xl font-black ${gameConfig.theme.text}`}>
              {level}
            </span>
          </div>
        </div>
      </button>
    </FadeIn>
  );
};
