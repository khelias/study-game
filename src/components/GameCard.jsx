// Täiustatud mängukaart komponent - parem UI/UX
import React from 'react';
import { FadeIn } from './EnhancedAnimations';

export const GameCard = ({ 
  gameConfig, 
  level, 
  onClick, 
  isLocked = false,
  progress = null, // { current, total } või null
  badge = null, // Badge tekst (nt "UUS!")
  delay = 0
}) => {
  const Icon = gameConfig.iconComponent || (() => null);
  
  return (
    <FadeIn delay={delay}>
      <button
        onClick={onClick}
        disabled={isLocked}
        aria-label={`${gameConfig.title} - ${gameConfig.desc} - Tase ${level}`}
        className={`
          group relative flex items-center gap-4 p-5 rounded-3xl w-full
          ${gameConfig.theme.bg} border-4 ${gameConfig.theme.border}
          shadow-lg hover:shadow-2xl transition-all duration-300 
          hover:scale-[1.03] hover:-translate-y-1 active:scale-[0.98]
          ${isLocked ? 'opacity-50 cursor-not-allowed grayscale' : 'cursor-pointer'}
        `}
      >
        {/* Badge - täiustatud */}
        {badge && (
          <div className="absolute -top-3 -right-3 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-black px-3 py-1.5 rounded-full animate-bounce shadow-lg z-10 border-2 border-white">
            ✨ {badge}
          </div>
        )}
        
        {/* Icon - täiustatud gradient taustaga */}
        <div className={`
          relative p-5 rounded-2xl transition-all duration-300
          group-hover:rotate-12 group-hover:scale-125
          bg-gradient-to-br ${gameConfig.theme.iconBg} 
          shadow-md group-hover:shadow-xl
          ${gameConfig.theme.text}
        `}>
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl"></div>
          <Icon size={36} className="relative z-10" />
        </div>
        
        {/* Content - täiustatud */}
        <div className="text-left flex-1 min-w-0">
          <h3 className={`text-xl font-black uppercase ${gameConfig.theme.text} flex items-center gap-2 mb-1 truncate`}>
            {gameConfig.title}
            {isLocked && <span className="text-sm">🔒</span>}
          </h3>
          <p className="text-sm font-semibold text-slate-600 mb-2 truncate">{gameConfig.desc}</p>
          
          {/* Difficulty badge */}
          {gameConfig.difficulty && (
            <div className="mt-1 flex items-center gap-1">
              <span className={`
                text-xs font-bold px-2 py-0.5 rounded-full
                ${gameConfig.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                  gameConfig.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'}
              `}>
                {gameConfig.difficulty === 'easy' ? '⭐ Lihtne' :
                 gameConfig.difficulty === 'medium' ? '⭐⭐ Keskmine' :
                 '⭐⭐⭐ Raske'}
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
        
        {/* Level indicator - täiustatud */}
        <div className="flex flex-col items-end gap-1 flex-shrink-0">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tase</span>
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
