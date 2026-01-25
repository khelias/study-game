// Täiustatud tagasiside süsteem - parem visuaalne ja heliline tagasiside
import React, { useEffect, useState, useRef } from 'react';
import { playSound } from '../engine/audio';

const ENCOURAGEMENTS = {
  correct: [
    'ÕIGE! 🌟', 'SUUREPÄRANE! ⭐', 'VÄGA HEA! 🎉', 'FANTASTILINE! 🚀', 
    'IMELISELT! ✨', 'TUBLI! 💪', 'TÄIUSLIK! 🏆', 'HÄMMASTAV! 🌈',
    'WOW! 🔥', 'VÄGA TUBLI! 🎊', 'SULLE LIHTNE! 💯', 'PROFESSIONAALNE! 🎯'
  ],
  wrong: [
    'PROOVI UUESTI! 💪', 'ÄRA ANNA ALLA! 🌟', 'SAAD SEDA! ⭐', 'JÄTKA! 🚀',
    'LÄHED ÕIGELE TEEDELE! 🎯', 'PROOVI VEEL! 💡', 'PEAAEGU! ✨',
    'VÄGA LÄHEDAL! 🎉', 'JÄRGMINE KORD! 🌈', 'ÄRA LOOBU! 💪'
  ],
  streak: [
    '2 ÕIGET JÄRJEST! 🔥', '3 ÕIGET JÄRJEST! ⭐⭐', '4 ÕIGET JÄRJEST! 🌟🌟',
    '5 ÕIGET JÄRJEST! 🏆', '6 ÕIGET JÄRJEST! 💯', '7+ ÕIGET JÄRJEST! 🚀'
  ],
  levelUp: [
    'TASE TÕUSIS! 🎊', 'UUS TASE! 🌟', 'EDENED! ⭐', 'SUUREPÄRANE! 🏆'
  ]
};

type FeedbackType = 'correct' | 'wrong' | 'hint' | 'levelUp' | 'streak' | 'info';

interface FeedbackMessageProps {
  message: string | null;
  type?: FeedbackType;
  duration?: number;
  onComplete?: () => void;
  soundEnabled: boolean;
}

export const FeedbackMessage: React.FC<FeedbackMessageProps> = ({ 
  message, 
  type = 'info', 
  duration = 2000, 
  onComplete, 
  soundEnabled 
}) => {
  const [visible, setVisible] = useState(Boolean(message));
  const [animating, setAnimating] = useState(Boolean(message));
  const messageRef = useRef<string | null>(message);

  useEffect(() => {
    if (message && message !== messageRef.current) {
      messageRef.current = message;
      
      // Mängi heli
      if (type === 'correct' || type === 'levelUp') {
        playSound('correct', soundEnabled);
      } else if (type === 'wrong') {
        playSound('wrong', soundEnabled);
      }

      // Schedule state updates
      const showTimer = setTimeout(() => {
        setVisible(true);
        setAnimating(true);
      }, 0);

      const hideTimer = setTimeout(() => {
        setAnimating(false);
        setTimeout(() => {
          setVisible(false);
          if (onComplete) onComplete();
        }, 300);
      }, duration);

      return () => {
        clearTimeout(showTimer);
        clearTimeout(hideTimer);
      };
    } else if (!message && messageRef.current) {
      // Reset state when message is cleared
      messageRef.current = null;
      const timer = setTimeout(() => {
        setVisible(false);
        setAnimating(false);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [message, type, duration, onComplete, soundEnabled]);

  if (!visible || !message) return null;

  const getStyles = (): string => {
    switch (type) {
      case 'correct':
        return 'bg-gradient-to-r from-green-500 to-emerald-500 border-green-600 text-white';
      case 'wrong':
        return 'bg-gradient-to-r from-red-500 to-rose-500 border-red-600 text-white';
      case 'hint':
        return 'bg-gradient-to-r from-yellow-400 to-orange-400 border-yellow-500 text-yellow-900';
      case 'levelUp':
        return 'bg-gradient-to-r from-purple-500 to-pink-500 border-purple-600 text-white';
      case 'streak':
        return 'bg-gradient-to-r from-blue-500 to-indigo-500 border-blue-600 text-white';
      default:
        return 'bg-gradient-to-r from-slate-500 to-slate-600 border-slate-600 text-white';
    }
  };

  return (
    <div
      className={`
        fixed top-20 left-1/2 -translate-x-1/2 z-50 px-8 py-4 rounded-full shadow-2xl border-4 
        font-black text-xl transition-all duration-300
        ${getStyles()}
        ${animating ? 'animate-bounce-short scale-110' : 'scale-100 opacity-0'}
      `}
      role="alert"
      aria-live="polite"
    >
      {message}
    </div>
  );
};

// Helper function (not a component)
/**
 * Get a random encouragement message for the given type
 * @param type - The type of encouragement ('correct', 'wrong', 'levelUp')
 * @param streak - Optional streak count for correct answers
 * @returns The encouragement message
 */
// eslint-disable-next-line react-refresh/only-export-components
export const getRandomEncouragement = (type: FeedbackType, streak = 0): string => {
  if (type === 'correct') {
    if (streak >= 7) return ENCOURAGEMENTS.streak[5] ?? '';
    if (streak >= 6) return ENCOURAGEMENTS.streak[4] ?? '';
    if (streak >= 5) return ENCOURAGEMENTS.streak[3] ?? '';
    if (streak >= 4) return ENCOURAGEMENTS.streak[2] ?? '';
    if (streak >= 3) return ENCOURAGEMENTS.streak[1] ?? '';
    if (streak >= 2) return ENCOURAGEMENTS.streak[0] ?? '';
    return ENCOURAGEMENTS.correct[Math.floor(Math.random() * ENCOURAGEMENTS.correct.length)] ?? '';
  }
  if (type === 'wrong') {
    return ENCOURAGEMENTS.wrong[Math.floor(Math.random() * ENCOURAGEMENTS.wrong.length)] ?? '';
  }
  if (type === 'levelUp') {
    return ENCOURAGEMENTS.levelUp[Math.floor(Math.random() * ENCOURAGEMENTS.levelUp.length)] ?? '';
  }
  return '';
};

interface ProgressIndicatorProps {
  current: number;
  total: number;
  label?: string;
}

// Progress indicator komponent
const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ 
  current, 
  total, 
  label = '' 
}) => {
  const percentage = (current / total) * 100;
  
  return (
    <div className="w-full max-w-xs">
      {label && (
        <div className="text-sm font-semibold text-slate-600 mb-1 text-center">
          {label}
        </div>
      )}
      <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden shadow-inner">
        <div
          className="h-full bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500 transition-all duration-500 ease-out rounded-full"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="text-xs text-slate-500 text-center mt-1">
        {current} / {total}
      </div>
    </div>
  );
};

export { ProgressIndicator };
