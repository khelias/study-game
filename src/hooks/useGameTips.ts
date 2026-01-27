/**
 * useGameTips Hook
 * 
 * Encapsulates tip generation and display logic for different game types.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from '../i18n/useTranslation';
import type { Notification } from '../types/notification';

export interface UseGameTipsResult {
  getTipsForGame: (gameType: string) => string[];
  handleTipReplay: () => void;
  canReopenTip: boolean;
}

export function useGameTips(
  gameType: string | null,
  problem: unknown,
  notifications: Notification[],
  addNotification: (notification: { type: 'tip'; message: string }) => void,
  isCompactLayout: boolean
): UseGameTipsResult {
  const t = useTranslation();
  const tipShownOnceRef = useRef(false);
  const tipMessageRef = useRef<string | null>(null);
  const [canReopenTip, setCanReopenTip] = useState(false);

  const getTipsForGame = useCallback((type: string): string[] => {
    const baseType = type.replace('_adv', '');
    switch (baseType) {
      case 'word_builder':
        return [...t.gameScreen.tips.word_builder];
      case 'syllable_builder':
        return [...t.gameScreen.tips.syllable_builder];
      case 'pattern':
        return [...t.gameScreen.tips.pattern];
      case 'sentence_logic':
        return [...t.gameScreen.tips.sentence_logic];
      case 'memory_math':
        return [...t.gameScreen.tips.memory_math];
      case 'balance_scale':
        return [...t.gameScreen.tips.balance_scale];
      case 'robo_path':
        return [...t.gameScreen.tips.robo_path];
      case 'math_snake':
        return [...t.gameScreen.tips.math_snake];
      case 'time_match':
        return [...t.gameScreen.tips.time_match];
      case 'letter_match':
        return [...t.gameScreen.tips.letter_match];
      case 'unit_conversion':
        return [...t.gameScreen.tips.unit_conversion];
      default:
        return [];
    }
  }, [t]);

  const handleTipReplay = useCallback(() => {
    if (!tipMessageRef.current) return;
    const hasTipNotification = notifications.some(n => n.type === 'tip');
    if (hasTipNotification) return;
    addNotification({
      type: 'tip',
      message: tipMessageRef.current,
    });
  }, [addNotification, notifications]);

  // Reset tip state when game type changes
  useEffect(() => {
    tipShownOnceRef.current = false;
    tipMessageRef.current = null;
    const resetTimer = setTimeout(() => setCanReopenTip(false), 0);
    return () => clearTimeout(resetTimer);
  }, [gameType]);

  // Show learning tip only once per session
  useEffect(() => {
    if (!gameType || !problem) {
      return;
    }

    const hasTipNotification = notifications.some(n => n.type === 'tip');

    if (!tipShownOnceRef.current && !hasTipNotification) {
      const gameTypeBase = gameType.replace('_adv', '');
      const tips = getTipsForGame(gameTypeBase);

      if (tips.length > 0) {
        const tipMessage = tips[Math.floor(Math.random() * tips.length)];
        if (tipMessage) {
          tipShownOnceRef.current = true;
          tipMessageRef.current = tipMessage;
          const tipTimer = setTimeout(() => {
            setCanReopenTip(true);
            if (!isCompactLayout) {
              addNotification({
                type: 'tip',
                message: tipMessage,
              });
            }
          }, 0);
          return () => {
            clearTimeout(tipTimer);
          };
        }
      }
    }
    return undefined;
  }, [gameType, problem, notifications, addNotification, getTipsForGame, isCompactLayout]);

  return { getTipsForGame, handleTipReplay, canReopenTip };
}
