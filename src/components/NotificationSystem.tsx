/**
 * Unified Notification System
 *
 * - Single rendering layer for toasts + modal popups
 * - Slot-based stacking (top/center/bottom/overlay)
 * - Consistent i18n (no hardcoded strings)
 * - Profile-aware text formatting
 */

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { useTranslation } from '../i18n/useTranslation';
import { useProfileText } from '../hooks/useProfileText';
import { AppModal } from './shared';
import type { Notification, NotificationType } from '../types/notification';
import { Z_INDEX } from '../utils/zIndex';

export type NotificationSlot = 'top' | 'center' | 'bottom' | 'overlay';

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

const NOTIFICATION_SLOT: Record<NotificationType, NotificationSlot> = {
  correct: 'center',
  streak: 'center',
  wrong: 'center',
  hint: 'top',
  info: 'top',
  tip: 'bottom',
  levelUp: 'overlay',
  achievement: 'overlay',
};

const DEFAULT_DURATION: Partial<Record<NotificationType, number>> = {
  correct: 500,
  streak: 500,
  wrong: 500,
  info: 1000,
  hint: 2200,
  achievement: 3000,
};

const AUTO_DISMISS: Record<NotificationType, boolean> = {
  correct: true,
  streak: true,
  wrong: true,
  info: true,
  hint: true,
  tip: false,
  levelUp: false,
  achievement: true,
};

const STACK_LIMIT: Record<NotificationSlot, number> = {
  top: 2,
  center: 1,
  bottom: 1,
  overlay: 1,
};

const CORRECT_EMOJIS = ['🌟', '⭐', '✨', '💫', '🎉'];
const LEVEL_UP_ICON_MAP: Record<string, string> = {
  Type: '🔤',
  TrainFront: '🚂',
  BookOpen: '📖',
  Brain: '🧠',
  Bot: '🤖',
  Ruler: '📏',
  Scale: '⚖️',
  Clock3: '🕒',
};

const resolveLevelUpEmoji = (value?: string): string => {
  if (!value) return '🏆';
  const mapped = LEVEL_UP_ICON_MAP[value];
  if (mapped) return mapped;
  if (/^[A-Za-z0-9]+$/.test(value)) return '🏆';
  return value;
};

const stripEmojis = (text: string): string => {
  return text
    .replace(/\p{Extended_Pictographic}/gu, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
};

interface NotificationSystemProps {
  notifications: Notification[];
  onDismiss: (id: string) => void;
}

const sortByPriority = (a: Notification, b: Notification): number => {
  const priorityDiff = NOTIFICATION_PRIORITY[b.type] - NOTIFICATION_PRIORITY[a.type];
  if (priorityDiff !== 0) return priorityDiff;
  return (b.createdAt ?? 0) - (a.createdAt ?? 0);
};

const groupBySlot = (notifications: Notification[]): Record<NotificationSlot, Notification[]> => {
  return notifications.reduce(
    (acc, notification) => {
      const slot = NOTIFICATION_SLOT[notification.type];
      acc[slot].push(notification);
      return acc;
    },
    { top: [], center: [], bottom: [], overlay: [] } as Record<NotificationSlot, Notification[]>,
  );
};

const selectVisible = (items: Notification[], slot: NotificationSlot): Notification[] => {
  const sorted = [...items].sort(sortByPriority);
  return sorted.slice(0, STACK_LIMIT[slot]);
};

export const NotificationSystem: React.FC<NotificationSystemProps> = ({
  notifications,
  onDismiss,
}) => {
  const grouped = useMemo(() => groupBySlot(notifications), [notifications]);

  const topNotifications = useMemo(() => selectVisible(grouped.top, 'top'), [grouped.top]);
  const centerNotifications = useMemo(
    () => selectVisible(grouped.center, 'center'),
    [grouped.center],
  );
  const bottomNotifications = useMemo(
    () => selectVisible(grouped.bottom, 'bottom'),
    [grouped.bottom],
  );
  const overlayNotification = useMemo(
    () => selectVisible(grouped.overlay, 'overlay')[0] ?? null,
    [grouped.overlay],
  );

  return (
    <>
      {overlayNotification && (
        <NotificationItem notification={overlayNotification} onDismiss={onDismiss} />
      )}
      <NotificationStack slot="top" notifications={topNotifications} onDismiss={onDismiss} />
      <NotificationStack slot="center" notifications={centerNotifications} onDismiss={onDismiss} />
      <NotificationStack slot="bottom" notifications={bottomNotifications} onDismiss={onDismiss} />
    </>
  );
};

interface NotificationStackProps {
  slot: NotificationSlot;
  notifications: Notification[];
  onDismiss: (id: string) => void;
}

const STACK_CLASSES: Record<NotificationSlot, string> = {
  top: 'fixed inset-x-0 top-16 sm:top-20 flex flex-col items-center gap-3 px-4 pointer-events-none',
  center: 'fixed inset-0 flex flex-col items-center justify-center gap-4 px-4 pointer-events-none',
  bottom:
    'fixed inset-x-0 bottom-4 sm:bottom-6 flex flex-col items-center gap-3 px-4 pointer-events-none',
  overlay: '',
};

const NotificationStack: React.FC<NotificationStackProps> = ({
  slot,
  notifications,
  onDismiss,
}) => {
  if (notifications.length === 0) return null;

  return (
    <div className={STACK_CLASSES[slot]} style={{ zIndex: Z_INDEX.NOTIFICATIONS }}>
      {notifications.map((notification) => (
        <NotificationItem key={notification.id} notification={notification} onDismiss={onDismiss} />
      ))}
    </div>
  );
};

interface NotificationItemProps {
  notification: Notification;
  onDismiss: (id: string) => void;
}

const ENTER_DELAY_MS = 20;
const EXIT_DURATION_MS = 220;

const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onDismiss }) => {
  const t = useTranslation();
  const { formatText } = useProfileText();
  const slot = NOTIFICATION_SLOT[notification.type];

  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);
  const exitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const dismiss = useCallback(() => {
    if (exiting) return;
    if (notification.type === 'levelUp' && notification.levelUpOnDismiss) {
      notification.levelUpOnDismiss();
    }
    setExiting(true);

    if (exitTimerRef.current) {
      clearTimeout(exitTimerRef.current);
    }
    exitTimerRef.current = setTimeout(() => {
      onDismiss(notification.id);
    }, EXIT_DURATION_MS);
  }, [exiting, notification, onDismiss]);

  useEffect(() => {
    const showTimer = setTimeout(() => setVisible(true), ENTER_DELAY_MS);
    return () => clearTimeout(showTimer);
  }, []);

  useEffect(() => {
    return () => {
      if (exitTimerRef.current) {
        clearTimeout(exitTimerRef.current);
      }
    };
  }, []);

  const duration = notification.duration ?? DEFAULT_DURATION[notification.type];
  const autoDismiss =
    notification.duration !== undefined
      ? notification.duration > 0
      : AUTO_DISMISS[notification.type];

  useEffect(() => {
    if (!visible) return;
    if (!autoDismiss || !duration || duration <= 0) return;

    const timer = setTimeout(() => {
      dismiss();
    }, duration);

    return () => clearTimeout(timer);
  }, [autoDismiss, duration, dismiss, visible]);

  if (!visible && !exiting) return null;

  if (notification.type === 'levelUp') {
    return (
      <LevelUpPopup
        notification={notification}
        isShowing={visible && !exiting}
        onDismiss={dismiss}
        titleFallback={formatText(t.notifications.levelUpTitle)}
        messageFallback={formatText(t.levelUp.greatWork)}
        buttonLabel={formatText(t.levelUp.nextLevel)}
        closeLabel={t.notifications.closeLevelUp}
        formatText={formatText}
      />
    );
  }

  if (notification.type === 'achievement') {
    return (
      <AchievementPopup
        notification={notification}
        isShowing={visible && !exiting}
        onDismiss={dismiss}
        titleFallback={formatText(t.notifications.achievementTitle)}
        closeLabel={t.notifications.closeAchievement}
        formatText={formatText}
      />
    );
  }

  return (
    <ToastNotification
      notification={notification}
      slot={slot}
      isShowing={visible && !exiting}
      onDismiss={dismiss}
      formatText={formatText}
      t={t}
    />
  );
};

interface ToastNotificationProps {
  notification: Notification;
  slot: NotificationSlot;
  isShowing: boolean;
  onDismiss: () => void;
  formatText: (text: string) => string;
  t: ReturnType<typeof useTranslation>;
}

const getToastStateClass = (slot: NotificationSlot, isShowing: boolean): string => {
  if (isShowing) return 'opacity-100 translate-y-0 scale-100';
  if (slot === 'top') return 'opacity-0 -translate-y-2 scale-95';
  if (slot === 'bottom') return 'opacity-0 translate-y-2 scale-95';
  return 'opacity-0 scale-90';
};

const ToastNotification: React.FC<ToastNotificationProps> = ({
  notification,
  slot,
  isShowing,
  onDismiss,
  formatText,
  t,
}) => {
  switch (notification.type) {
    case 'correct': {
      const emojiIndex =
        notification.id.charCodeAt(notification.id.length - 1) % CORRECT_EMOJIS.length;
      const emoji = notification.emoji ?? CORRECT_EMOJIS[emojiIndex] ?? '✨';
      const message = stripEmojis(formatText(notification.message ?? t.notifications.correctTitle));
      return (
        <HeroToast
          slot={slot}
          isShowing={isShowing}
          emoji={emoji}
          message={message}
          role="alert"
          tone="success"
        />
      );
    }
    case 'streak': {
      const streakCount = notification.streakCount ?? 2;
      const fallback = `${streakCount} ${t.notifications.streakSuffix}`;
      const message = stripEmojis(formatText(notification.message ?? fallback));
      return (
        <HeroToast
          slot={slot}
          isShowing={isShowing}
          emoji={notification.emoji ?? '🔥'}
          message={message}
          role="alert"
          tone="celebration"
        />
      );
    }
    case 'wrong': {
      const message = stripEmojis(formatText(notification.message ?? t.notifications.wrongTitle));
      return (
        <HeroToast
          slot={slot}
          isShowing={isShowing}
          emoji={notification.emoji ?? '💪'}
          message={message}
          role="alert"
          tone="support"
          attentionClass={isShowing ? 'animate-shake' : ''}
        />
      );
    }
    case 'hint': {
      const message = formatText(notification.message ?? t.gameScreen.hints.default);
      return (
        <StandardToast
          slot={slot}
          isShowing={isShowing}
          icon={notification.emoji ?? '💡'}
          label={formatText(notification.title ?? t.notifications.hintTitle)}
          message={message}
          role="alert"
          tone="warning"
          attentionClass={isShowing ? 'animate-bounce-short' : ''}
          showClose
          onClose={onDismiss}
          closeLabel={t.notifications.closeHint}
        />
      );
    }
    case 'tip': {
      const message = formatText(notification.message ?? '');
      return (
        <StandardToast
          slot={slot}
          isShowing={isShowing}
          icon={notification.emoji ?? '💡'}
          label={formatText(notification.title ?? t.notifications.tipTitle)}
          message={message}
          role="status"
          tone="info"
          attentionClass={isShowing ? 'animate-fade-in' : ''}
          showClose
          onClose={onDismiss}
          closeLabel={t.notifications.closeTip}
        />
      );
    }
    case 'info':
    default: {
      const message = formatText(notification.message ?? t.notifications.infoTitle);
      return (
        <StandardToast
          slot={slot}
          isShowing={isShowing}
          icon={notification.emoji ?? '✨'}
          message={message}
          role="status"
          tone="neutral"
        />
      );
    }
  }
};

interface HeroToastProps {
  slot: NotificationSlot;
  isShowing: boolean;
  emoji: string;
  message: string;
  role: 'alert' | 'status';
  tone: 'success' | 'celebration' | 'support';
  attentionClass?: string;
}

const HeroToast: React.FC<HeroToastProps> = ({
  slot,
  isShowing,
  emoji,
  message,
  role,
  tone,
  attentionClass = '',
}) => {
  const toneClasses = {
    success: 'bg-gradient-to-r from-green-500 to-emerald-500 border-green-600 text-white',
    celebration:
      'bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 border-orange-400 text-white',
    support:
      'bg-gradient-to-r from-amber-400 via-orange-400 to-rose-500 border-amber-400 text-white',
  }[tone];

  return (
    <div
      className={`
        pointer-events-none
        ${toneClasses}
        ${getToastStateClass(slot, isShowing)}
        ${attentionClass}
        rounded-3xl border-4 shadow-2xl
        text-center max-w-sm w-full mx-4
        px-6 py-6 sm:px-8 sm:py-7
        transition-all duration-200
      `}
      style={{ zIndex: Z_INDEX.NOTIFICATIONS }}
      role={role}
      aria-live="polite"
    >
      <div className="text-6xl sm:text-7xl mb-3 animate-pulse">{emoji}</div>
      <div className="text-2xl sm:text-3xl font-black leading-tight">{message}</div>
    </div>
  );
};

interface StandardToastProps {
  slot: NotificationSlot;
  isShowing: boolean;
  icon: string;
  message: string;
  label?: string;
  role: 'alert' | 'status';
  tone: 'danger' | 'warning' | 'info' | 'neutral';
  attentionClass?: string;
  showClose?: boolean;
  onClose?: () => void;
  closeLabel?: string;
}

const StandardToast: React.FC<StandardToastProps> = ({
  slot,
  isShowing,
  icon,
  message,
  label,
  role,
  tone,
  attentionClass = '',
  showClose = false,
  onClose,
  closeLabel,
}) => {
  const toneClasses = {
    danger: 'bg-gradient-to-r from-red-500 to-rose-500 border-red-600 text-white',
    warning: 'bg-gradient-to-r from-yellow-400 to-orange-400 border-yellow-500 text-yellow-900',
    info: 'bg-gradient-to-r from-blue-500 to-indigo-600 border-blue-300 text-white',
    neutral: 'bg-gradient-to-r from-slate-500 to-slate-600 border-slate-600 text-white',
  }[tone];

  return (
    <div
      className={`
        pointer-events-none
        ${toneClasses}
        ${getToastStateClass(slot, isShowing)}
        ${attentionClass}
        rounded-2xl border-4 shadow-2xl
        max-w-md w-full mx-4
        px-4 py-3 sm:px-5 sm:py-4
        transition-all duration-200
      `}
      style={{ zIndex: Z_INDEX.NOTIFICATIONS }}
      role={role}
      aria-live="polite"
    >
      <div className="flex items-start gap-3">
        <div className="text-2xl sm:text-3xl flex-shrink-0">{icon}</div>
        <div className="flex-1">
          {label && (
            <div className="text-xs sm:text-sm font-black uppercase tracking-wide mb-1">
              {label}
            </div>
          )}
          <div className="text-sm sm:text-base font-bold leading-snug">{message}</div>
        </div>
        {showClose && onClose && (
          <button
            onClick={(event) => {
              event.stopPropagation();
              onClose();
            }}
            type="button"
            className="pointer-events-auto ml-1 rounded-lg p-1.5 hover:bg-white/20 transition-colors"
            aria-label={closeLabel}
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};

interface LevelUpPopupProps {
  notification: Notification;
  isShowing: boolean;
  onDismiss: () => void;
  titleFallback: string;
  messageFallback: string;
  buttonLabel: string;
  closeLabel: string;
  formatText: (text: string) => string;
}

const LevelUpPopup: React.FC<LevelUpPopupProps> = ({
  notification,
  isShowing,
  onDismiss,
  titleFallback,
  messageFallback,
  buttonLabel,
  closeLabel,
  formatText,
}) => {
  return (
    <AppModal
      labelledBy={`${notification.id}-levelup-title`}
      onClose={onDismiss}
      size="sm"
      zIndex={Z_INDEX.NOTIFICATIONS}
      className={`transition-opacity duration-200 ${isShowing ? 'opacity-100' : 'opacity-0'}`}
      panelClassName={`
        relative border-4 border-purple-300 bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500 text-center
        transition-transform duration-200
        ${isShowing ? 'scale-100' : 'scale-95'}
      `}
      contentClassName="p-7 text-center sm:p-8"
    >
      <button
        onClick={(event) => {
          event.stopPropagation();
          onDismiss();
        }}
        className="absolute right-4 top-4 rounded-lg p-2 transition-colors hover:bg-white/20"
        aria-label={closeLabel}
      >
        <X size={20} className="text-white" />
      </button>
      <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-2xl bg-white/20 text-6xl shadow-inner sm:h-28 sm:w-28 sm:text-7xl">
        {resolveLevelUpEmoji(notification.emoji)}
      </div>
      <h2
        id={`${notification.id}-levelup-title`}
        className="mb-2 text-3xl font-black text-white sm:text-4xl"
      >
        {notification.title ? formatText(notification.title) : titleFallback}
      </h2>
      <p
        id={`${notification.id}-levelup-message`}
        className="mb-6 text-lg font-bold text-white sm:text-xl"
      >
        {notification.message ? formatText(notification.message) : messageFallback}
      </p>
      <button
        onClick={onDismiss}
        className="w-full rounded-xl bg-white/20 py-3 text-lg font-black text-white shadow-lg transition-all hover:bg-white/30 active:scale-95 sm:py-4 sm:text-xl"
      >
        {buttonLabel}
      </button>
    </AppModal>
  );
};

interface AchievementPopupProps {
  notification: Notification;
  isShowing: boolean;
  onDismiss: () => void;
  titleFallback: string;
  closeLabel: string;
  formatText: (text: string) => string;
}

const AchievementPopup: React.FC<AchievementPopupProps> = ({
  notification,
  isShowing,
  onDismiss,
  titleFallback,
  closeLabel,
  formatText,
}) => {
  const achievement = notification.achievement;

  useEffect(() => {
    if (!achievement) {
      onDismiss();
    }
  }, [achievement, onDismiss]);

  if (!achievement) return null;

  return (
    <AppModal
      labelledBy={`${notification.id}-achievement-title`}
      onClose={onDismiss}
      size="sm"
      zIndex={Z_INDEX.NOTIFICATIONS}
      className={`transition-opacity duration-200 ${isShowing ? 'opacity-100' : 'opacity-0'}`}
      panelClassName={`
        relative border-4 border-yellow-400 bg-gradient-to-br from-yellow-50 to-orange-50 text-center
        transition-transform duration-200
        ${isShowing ? 'scale-100 animate-bounce-short' : 'scale-95'}
      `}
      contentClassName="p-7 text-center sm:p-8"
    >
      <button
        onClick={(event) => {
          event.stopPropagation();
          onDismiss();
        }}
        className="absolute right-4 top-4 rounded-lg bg-white/80 p-2 transition-colors hover:bg-white"
        aria-label={closeLabel}
      >
        <X size={20} className="text-slate-600" />
      </button>
      <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-200 to-orange-200 text-6xl shadow-inner sm:h-28 sm:w-28 sm:text-7xl">
        {achievement.icon}
      </div>
      <div className="mb-2 text-2xl font-black text-yellow-600">{titleFallback}</div>
      <h2
        id={`${notification.id}-achievement-title`}
        className="mb-2 text-2xl font-black text-slate-800 sm:text-3xl"
      >
        {formatText(achievement.title)}
      </h2>
      <p className="mb-6 font-semibold text-slate-600">{formatText(achievement.desc)}</p>
      <div className="flex justify-center gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="h-2 w-2 rounded-full bg-yellow-400 animate-ping"
            style={{ animationDelay: `${i * 0.1}s` }}
          />
        ))}
      </div>
    </AppModal>
  );
};
