/**
 * FeedbackModal Component
 *
 * Generic overlay modal to show the user what went wrong or other info
 * (e.g. wrong answer explanation). Renders on top of the game; closed via
 * button or backdrop/Escape.
 */

import React, { useEffect, useRef } from 'react';
import { AppModal } from './AppModal';

export type FeedbackModalVariant = 'wrong' | 'info' | 'default';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Modal title (e.g. "Peaaegu!") */
  title?: string;
  /** Main content. Use React node for rich content (paragraphs, lists, etc.) */
  children: React.ReactNode;
  /** Primary button label (e.g. "Jätka") */
  buttonLabel: string;
  /** Visual variant: wrong = amber, info = blue, default = slate */
  variant?: FeedbackModalVariant;
}

const variantStyles: Record<FeedbackModalVariant, { border: string; bg: string; title: string }> = {
  wrong: {
    border: 'border-amber-200',
    bg: 'from-amber-50 via-white to-amber-50/80',
    title: 'text-amber-900',
  },
  info: {
    border: 'border-blue-200',
    bg: 'from-blue-50 via-white to-blue-50/80',
    title: 'text-blue-900',
  },
  default: {
    border: 'border-slate-200',
    bg: 'from-slate-50 via-white to-slate-50',
    title: 'text-slate-800',
  },
};

const variantButtonStyles: Record<FeedbackModalVariant, string> = {
  wrong: 'bg-amber-500 hover:bg-amber-600 border-amber-600 text-white',
  info: 'bg-blue-500 hover:bg-blue-600 border-blue-600 text-white',
  default: 'bg-slate-600 hover:bg-slate-700 border-slate-700 text-white',
};

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  buttonLabel,
  variant = 'default',
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const style = variantStyles[variant];
  const buttonStyle = variantButtonStyles[variant];

  useEffect(() => {
    if (isOpen && buttonRef.current) {
      buttonRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AppModal
      labelledBy={title ? 'feedback-modal-title' : undefined}
      onClose={onClose}
      size="md"
      panelClassName={`border-2 ${style.border} bg-gradient-to-br ${style.bg}`}
      contentClassName="p-5 sm:p-6"
    >
      {title && (
        <h2
          id="feedback-modal-title"
          className={`text-lg sm:text-xl font-black mb-3 ${style.title}`}
        >
          {title}
        </h2>
      )}
      <div className="text-sm sm:text-base text-slate-700 mb-5 [&_p]:mb-2 [&_p:last-child]:mb-0">
        {children}
      </div>
      <div className="flex justify-end">
        <button
          ref={buttonRef}
          type="button"
          onClick={onClose}
          className={`px-5 py-2.5 rounded-xl font-bold border-2 shadow-md transition-colors ${buttonStyle}`}
        >
          {buttonLabel}
        </button>
      </div>
    </AppModal>
  );
};
