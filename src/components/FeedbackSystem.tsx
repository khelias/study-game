// Täiustatud tagasiside süsteem - parem visuaalne ja heliline tagasiside
import React, { useEffect, useState, useRef } from 'react';
import { playSound } from '../engine/audio';
import { getTranslations } from '../i18n';

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
    return undefined;
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
        fixed top-20 z-50 px-8 py-4 rounded-full shadow-2xl border-4 
        font-black text-xl transition-all duration-300
        ${getStyles()}
        ${animating ? 'animate-bounce-short scale-110' : 'scale-100 opacity-0'}
      `}
      style={{
        left: '50%',
        transform: 'translateX(-50%)',
        margin: 0,
        padding: '1rem 2rem'
      }}
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
  const t = getTranslations();
  const encouragements = t.feedback;
  
  if (type === 'correct') {
    if (streak >= 7) return encouragements.streak[5] ?? '';
    if (streak >= 6) return encouragements.streak[4] ?? '';
    if (streak >= 5) return encouragements.streak[3] ?? '';
    if (streak >= 4) return encouragements.streak[2] ?? '';
    if (streak >= 3) return encouragements.streak[1] ?? '';
    if (streak >= 2) return encouragements.streak[0] ?? '';
    return encouragements.correct[Math.floor(Math.random() * encouragements.correct.length)] ?? '';
  }
  if (type === 'wrong') {
    return encouragements.wrong[Math.floor(Math.random() * encouragements.wrong.length)] ?? '';
  }
  if (type === 'levelUp') {
    return encouragements.levelUp[Math.floor(Math.random() * encouragements.levelUp.length)] ?? '';
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
