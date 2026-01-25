import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { playSound } from '../engine/audio';
import { AchievementUnlock } from '../types/achievement';

interface AchievementModalProps {
  achievement: AchievementUnlock | null;
  onClose: () => void;
  soundEnabled: boolean;
}

export const AchievementModal: React.FC<AchievementModalProps> = ({ 
  achievement, 
  onClose, 
  soundEnabled 
}) => {
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const hasPlayedSound = useRef(false);

  useEffect(() => {
    if (achievement) {
      // Only play sound once per achievement
      if (!hasPlayedSound.current) {
        playSound('win', soundEnabled);
        hasPlayedSound.current = true;
      }
      
      // Clear any existing timer
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      
      timerRef.current = setTimeout(() => {
        onClose();
        hasPlayedSound.current = false;
      }, 3000);
      
      return () => {
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }
      };
    } else {
      hasPlayedSound.current = false;
    }
    return undefined;
  }, [achievement, onClose, soundEnabled]);

  if (!achievement) return null;

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
      <div 
        className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center transform scale-100 animate-bounce-short border-4 border-yellow-400 relative"
        style={{ margin: '0 auto' }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white transition-colors"
          aria-label="Sulge"
        >
          <X size={20} className="text-slate-600" />
        </button>
        
        <div className="mx-auto w-28 h-28 bg-gradient-to-br from-yellow-200 to-orange-200 rounded-full flex items-center justify-center mb-4 text-7xl shadow-inner animate-pulse">
          {achievement.icon}
        </div>
        <div className="text-2xl font-black text-yellow-600 mb-2">SAAVUTUS!</div>
        <h2 className="text-3xl font-black text-slate-800 mb-2">{achievement.title}</h2>
        <p className="text-slate-600 mb-6 font-semibold">{achievement.desc}</p>
        
        <div className="flex gap-2 justify-center">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="w-2 h-2 bg-yellow-400 rounded-full animate-ping" style={{ animationDelay: `${i * 0.1}s` }} />
          ))}
        </div>
      </div>
    </div>
  );
};
