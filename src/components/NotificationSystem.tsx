/**
 * Unified Notification System
 * 
 * This component provides a centralized notification system that replaces
 * multiple fragmented popup/feedback components (FeedbackMessage, AchievementModal,
 * LevelUpModal, LearningTip) with a single, cohesive interface.
 * 
 * Features:
 * - Multiple notification types (correct, wrong, streak, hint, levelUp, achievement, info, tip)
 * - Proper z-index hierarchy to avoid conflicts
 * - Notification stacking with priority system (max 3 visible)
 * - Beautiful animations (fade, scale, bounce, shake, pulse)
 * - Responsive design for mobile and desktop
 * - Accessibility support (ARIA labels, keyboard navigation)
 * 
 * Z-Index Hierarchy:
 * - MODALS (9999): StatsModal, AchievementsModal, TutorialModal
 * - NOTIFICATIONS (8000): This NotificationSystem
 * - OVERLAYS (7000): Confetti, Particles
 * - HINTS (6000): HintButton
 * - GAME_UI (1000): Game elements
 * 
 * Usage Examples:
 * 
 * // Correct answer notification
 * addNotification({
 *   type: 'correct',
 *   message: 'ÕIGE!',
 *   duration: 1500,
 *   position: 'center',
 *   size: 'large'
 * });
 * 
 * // Achievement notification
 * addNotification({
 *   type: 'achievement',
 *   achievement: { id: '...', title: '...', desc: '...', icon: '🏆' },
 *   duration: 3000,
 *   position: 'center',
 *   size: 'large'
 * });
 * 
 * // Level up notification
 * addNotification({
 *   type: 'levelUp',
 *   title: 'TASE 5',
 *   emoji: '🎯',
 *   position: 'center',
 *   size: 'large'
 * });
 * 
 * // Learning tip notification
 * addNotification({
 *   type: 'tip',
 *   message: 'Proovi mõelda, mis sõna võiks emoji järgi olla!',
 *   position: 'bottom',
 *   size: 'small'
 * });
 */

import React, { useEffect, useState, useCallback } from 'react';
import { X } from 'lucide-react';
import { AchievementUnlock } from '../types/achievement';

// Z-index hierarchy constants
export const Z_INDEX = {
  MODALS: 9999,        // StatsModal, AchievementsModal, TutorialModal
  NOTIFICATIONS: 8000, // NotificationSystem
  OVERLAYS: 7000,      // Confetti, Particles
  HINTS: 6000,         // HintButton
  GAME_UI: 1000,       // Game elements
} as const;

// Notification types
export type NotificationType = 
  | 'correct'      // Correct answer
  | 'wrong'        // Wrong answer  
  | 'streak'       // Consecutive correct answers
  | 'hint'         // Hint
  | 'levelUp'      // Level increased
  | 'achievement'  // Achievement unlocked
  | 'info'         // Info message
  | 'tip';         // Learning tip

// Notification interface
export interface Notification {
  id: string;
  type: NotificationType;
  message?: string;
  title?: string;
  emoji?: string;
  achievement?: AchievementUnlock;
  duration?: number;
  position?: 'top' | 'center' | 'bottom';
  size?: 'small' | 'medium' | 'large';
  streakCount?: number;
}

// Notification priority (higher = more important)
const NOTIFICATION_PRIORITY: Record<NotificationType, number> = {
  achievement: 7,
  levelUp: 6,
  streak: 5,
  correct: 4,
  wrong: 3,
  hint: 2,
  tip: 1,
  info: 0,
};

// Random emojis for correct answers
const CORRECT_EMOJIS = ['🌟', '⭐', '✨', '💫', '🎉'];

interface NotificationSystemProps {
  notifications: Notification[];
  onDismiss: (id: string) => void;
}

export const NotificationSystem: React.FC<NotificationSystemProps> = ({
  notifications,
  onDismiss,
}) => {
  // Sort notifications by priority and limit to max 3
  const sortedNotifications = [...notifications]
    .sort((a, b) => NOTIFICATION_PRIORITY[b.type] - NOTIFICATION_PRIORITY[a.type])
    .slice(0, 3);

  return (
    <>
      {sortedNotifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onDismiss={onDismiss}
        />
      ))}
    </>
  );
};

interface NotificationItemProps {
  notification: Notification;
  onDismiss: (id: string) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onDismiss,
}) => {
  const [visible, setVisible] = useState(false);
  const [animating, setAnimating] = useState(false);

  const handleDismiss = useCallback(() => {
    setAnimating(false);
    setTimeout(() => {
      setVisible(false);
      onDismiss(notification.id);
    }, 300);
  }, [notification.id, onDismiss]);

  // Handle auto-dismiss based on duration
  useEffect(() => {
    // Show animation
    const showTimer = setTimeout(() => {
      setVisible(true);
      setAnimating(true);
    }, 50);

    // Auto-dismiss if duration is set (tips don't auto-dismiss)
    let hideTimer: NodeJS.Timeout | undefined;
    if (notification.duration && notification.type !== 'tip') {
      hideTimer = setTimeout(() => {
        handleDismiss();
      }, notification.duration);
    }

    return () => {
      clearTimeout(showTimer);
      if (hideTimer) clearTimeout(hideTimer);
    };
  }, [notification.duration, notification.id, notification.type, handleDismiss]);

  if (!visible) return null;

  // Render appropriate notification based on type
  switch (notification.type) {
    case 'correct':
      return (
        <CorrectNotification
          notification={notification}
          animating={animating}
        />
      );
    case 'wrong':
      return (
        <WrongNotification
          notification={notification}
          animating={animating}
        />
      );
    case 'streak':
      return (
        <StreakNotification
          notification={notification}
          animating={animating}
        />
      );
    case 'levelUp':
      return (
        <LevelUpNotification
          notification={notification}
          animating={animating}
          onDismiss={handleDismiss}
        />
      );
    case 'achievement':
      return (
        <AchievementNotification
          notification={notification}
          animating={animating}
          onDismiss={handleDismiss}
        />
      );
    case 'tip':
      return (
        <TipNotification
          notification={notification}
          animating={animating}
          onDismiss={handleDismiss}
        />
      );
    case 'hint':
      return (
        <HintNotification
          notification={notification}
          animating={animating}
        />
      );
    default:
      return (
        <InfoNotification
          notification={notification}
          animating={animating}
        />
      );
  }
};

// Correct Answer Notification
const CorrectNotification: React.FC<{
  notification: Notification;
  animating: boolean;
}> = ({ notification, animating }) => {
  // Use a stable random emoji by using notification ID as seed
  const emojiIndex = notification.id.charCodeAt(notification.id.length - 1) % CORRECT_EMOJIS.length;
  const randomEmoji = CORRECT_EMOJIS[emojiIndex];
  
  return (
    <div
      className={`
        fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
        bg-gradient-to-r from-green-500 to-emerald-500 
        text-white rounded-3xl p-8 shadow-2xl border-4 border-green-600
        text-center max-w-sm w-full mx-4
        transition-all duration-300
        ${animating ? 'scale-100 opacity-100 animate-bounce-short' : 'scale-80 opacity-0'}
      `}
      style={{ zIndex: Z_INDEX.NOTIFICATIONS }}
      role="alert"
      aria-live="polite"
    >
      <div className="text-7xl mb-4 animate-pulse">
        {randomEmoji}
      </div>
      <div className="text-4xl font-black mb-2">ÕIGE!</div>
      {notification.message && (
        <div className="text-xl font-bold">{notification.message}</div>
      )}
    </div>
  );
};

// Wrong Answer Notification
const WrongNotification: React.FC<{
  notification: Notification;
  animating: boolean;
}> = ({ notification, animating }) => {
  return (
    <div
      className={`
        fixed top-20 left-1/2 -translate-x-1/2
        bg-gradient-to-r from-red-500 to-rose-500 
        text-white rounded-2xl p-6 shadow-2xl border-4 border-red-600
        text-center max-w-md w-full mx-4
        transition-all duration-300
        ${animating ? 'scale-100 opacity-100 animate-shake' : 'scale-80 opacity-0'}
      `}
      style={{ zIndex: Z_INDEX.NOTIFICATIONS }}
      role="alert"
      aria-live="polite"
    >
      <div className="text-5xl mb-3">💪</div>
      <div className="text-2xl font-black mb-2">Proovi uuesti!</div>
      {notification.message && (
        <div className="text-lg font-semibold">{notification.message}</div>
      )}
    </div>
  );
};

// Streak Notification
const StreakNotification: React.FC<{
  notification: Notification;
  animating: boolean;
}> = ({ notification, animating }) => {
  const streakCount = notification.streakCount || 2;
  
  return (
    <div
      className={`
        fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
        bg-gradient-to-r from-orange-500 via-red-500 to-pink-500
        text-white rounded-3xl p-8 shadow-2xl border-4 border-orange-400
        text-center max-w-sm w-full mx-4
        transition-all duration-300
        ${animating ? 'scale-100 opacity-100 animate-bounce-short' : 'scale-80 opacity-0'}
      `}
      style={{ zIndex: Z_INDEX.NOTIFICATIONS }}
      role="alert"
      aria-live="polite"
    >
      <div className="text-7xl mb-4 animate-pulse">
        🔥
      </div>
      <div className="text-4xl font-black mb-2">{streakCount} ÕIGET JÄRJEST!</div>
      {notification.message && (
        <div className="text-xl font-bold">{notification.message}</div>
      )}
    </div>
  );
};

// Level Up Notification
const LevelUpNotification: React.FC<{
  notification: Notification;
  animating: boolean;
  onDismiss: () => void;
}> = ({ notification, animating, onDismiss }) => {
  return (
    <div
      className={`
        fixed inset-0 flex items-center justify-center
        bg-black/60 backdrop-blur-sm p-4
        transition-all duration-300
        ${animating ? 'opacity-100' : 'opacity-0'}
      `}
      style={{ zIndex: Z_INDEX.NOTIFICATIONS }}
      onClick={(e) => e.target === e.currentTarget && onDismiss()}
    >
      <div
        className={`
          bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500
          rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center
          border-4 border-purple-300
          transition-all duration-300
          ${animating ? 'scale-100' : 'scale-80'}
        `}
        role="dialog"
        aria-labelledby="levelup-title"
      >
        <div className="mx-auto w-28 h-28 bg-white/20 rounded-full flex items-center justify-center mb-4 text-7xl animate-pulse">
          {notification.emoji || '🏆'}
        </div>
        <h2 id="levelup-title" className="text-4xl font-black text-white mb-2">
          {notification.title || 'LEVEL UP!'}
        </h2>
        <p className="text-white text-xl font-bold mb-6">
          {notification.message || 'Suurepärane töö!'}
        </p>
        <button
          onClick={onDismiss}
          className="w-full py-4 bg-white/20 hover:bg-white/30 rounded-xl text-xl font-black text-white shadow-lg active:scale-95 transition-all"
        >
          Jätka →
        </button>
      </div>
    </div>
  );
};

// Achievement Notification
const AchievementNotification: React.FC<{
  notification: Notification;
  animating: boolean;
  onDismiss: () => void;
}> = ({ notification, animating, onDismiss }) => {
  const achievement = notification.achievement;
  
  if (!achievement) return null;

  return (
    <div
      className={`
        fixed inset-0 flex items-center justify-center
        bg-black/60 backdrop-blur-sm p-4
        transition-all duration-300
        ${animating ? 'opacity-100' : 'opacity-0'}
      `}
      style={{ zIndex: Z_INDEX.NOTIFICATIONS }}
      onClick={(e) => e.target === e.currentTarget && onDismiss()}
    >
      <div
        className={`
          bg-gradient-to-br from-yellow-50 to-orange-50
          rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center
          border-4 border-yellow-400 relative
          transition-all duration-300
          ${animating ? 'scale-100 animate-bounce-short' : 'scale-80'}
        `}
        role="dialog"
        aria-labelledby="achievement-title"
      >
        <button
          onClick={onDismiss}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white transition-colors"
          aria-label="Sulge"
        >
          <X size={20} className="text-slate-600" />
        </button>
        
        <div className="mx-auto w-28 h-28 bg-gradient-to-br from-yellow-200 to-orange-200 rounded-full flex items-center justify-center mb-4 text-7xl shadow-inner animate-pulse">
          {achievement.icon}
        </div>
        <div className="text-2xl font-black text-yellow-600 mb-2">SAAVUTUS!</div>
        <h2 id="achievement-title" className="text-3xl font-black text-slate-800 mb-2">
          {achievement.title}
        </h2>
        <p className="text-slate-600 mb-6 font-semibold">{achievement.desc}</p>
        
        <div className="flex gap-2 justify-center">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 bg-yellow-400 rounded-full animate-ping"
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// Learning Tip Notification
const TipNotification: React.FC<{
  notification: Notification;
  animating: boolean;
  onDismiss: () => void;
}> = ({ notification, animating, onDismiss }) => {
  return (
    <div
      className={`
        fixed bottom-4 left-1/2 -translate-x-1/2
        max-w-md w-full mx-4
        transition-all duration-300
        ${animating ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
      `}
      style={{ zIndex: Z_INDEX.NOTIFICATIONS }}
      role="status"
      aria-live="polite"
    >
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl p-4 shadow-2xl border-4 border-blue-300">
        <div className="flex items-start gap-3">
          <div className="text-2xl flex-shrink-0">💡</div>
          <div className="flex-1">
            <p className="text-sm font-bold leading-relaxed">
              {notification.message}
            </p>
          </div>
          <button
            onClick={onDismiss}
            className="flex-shrink-0 p-1 hover:bg-white/20 rounded-lg transition-colors"
            aria-label="Sulge näpunäide"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Hint Notification
const HintNotification: React.FC<{
  notification: Notification;
  animating: boolean;
}> = ({ notification, animating }) => {
  return (
    <div
      className={`
        fixed top-20 left-1/2 -translate-x-1/2
        bg-gradient-to-r from-yellow-400 to-orange-400 
        text-yellow-900 rounded-2xl p-6 shadow-2xl border-4 border-yellow-500
        text-center max-w-md w-full mx-4
        transition-all duration-300
        ${animating ? 'scale-100 opacity-100' : 'scale-80 opacity-0'}
      `}
      style={{ zIndex: Z_INDEX.NOTIFICATIONS }}
      role="alert"
      aria-live="polite"
    >
      <div className="text-4xl mb-3">💡</div>
      {notification.message && (
        <div className="text-lg font-bold">{notification.message}</div>
      )}
    </div>
  );
};

// Info Notification
const InfoNotification: React.FC<{
  notification: Notification;
  animating: boolean;
}> = ({ notification, animating }) => {
  return (
    <div
      className={`
        fixed top-20 left-1/2 -translate-x-1/2
        bg-gradient-to-r from-slate-500 to-slate-600 
        text-white rounded-2xl p-6 shadow-2xl border-4 border-slate-600
        text-center max-w-md w-full mx-4
        transition-all duration-300
        ${animating ? 'scale-100 opacity-100' : 'scale-80 opacity-0'}
      `}
      style={{ zIndex: Z_INDEX.NOTIFICATIONS }}
      role="alert"
      aria-live="polite"
    >
      {notification.message && (
        <div className="text-lg font-bold">{notification.message}</div>
      )}
    </div>
  );
};
