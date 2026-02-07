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
  const currentTipIndexRef = useRef<number>(0);
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
      case 'compare_sizes':
        return [...t.gameScreen.tips.compare_sizes];
      case 'shape_shift':
        return [...t.gameScreen.tips.shape_shift];
      default:
        return [];
    }
  }, [t]);

  const handleTipReplay = useCallback(() => {
    if (!gameType) return;
    const hasTipNotification = notifications.some(n => n.type === 'tip');
    if (hasTipNotification) return;
    
    const gameTypeBase = gameType.replace('_adv', '');
    const tips = getTipsForGame(gameTypeBase);
    
    if (tips.length === 0) return;
    
    // Get next tip in cycle
    const tipMessage = tips[currentTipIndexRef.current];
    if (!tipMessage) return;
    
    // Move to next tip for next time (cycle back to 0 if at end)
    currentTipIndexRef.current = (currentTipIndexRef.current + 1) % tips.length;
    
    addNotification({
      type: 'tip',
      message: tipMessage,
    });
  }, [addNotification, notifications, gameType, getTipsForGame]);

  // Reset tip state when game type changes
  useEffect(() => {
    tipShownOnceRef.current = false;
    currentTipIndexRef.current = 0;
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
        // Start with first tip
        const tipMessage = tips[0];
        if (tipMessage) {
          tipShownOnceRef.current = true;
          // Next time will show tip at index 1
          currentTipIndexRef.current = 1;
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
