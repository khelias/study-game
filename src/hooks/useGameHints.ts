/**
 * useGameHints Hook
 * 
 * Encapsulates hint generation logic for different game types.
 */

import { useCallback } from 'react';
import { useTranslation } from '../i18n/useTranslation';
import { useProfileText } from './useProfileText';
import { buildUnitConversionQuestion } from '../utils/unitConversion';
import type { Problem } from '../types/game';

export interface UseGameHintsResult {
  getHint: (problem: Problem) => string;
  showHint: (problem: Problem) => void;
}

export function useGameHints(
  addNotification: (notification: { type: 'hint'; message: string }) => void,
  setBgClass: (bgClass: string) => void
): UseGameHintsResult {
  const t = useTranslation();
  const { formatText } = useProfileText();

  const getHint = useCallback((problem: Problem): string => {
    switch (problem.type) {
      case 'word_builder':
        if (problem.type === 'word_builder') {
          return problem.target ? `${t.gameScreen.hints.wordBuilder} "${problem.target[0] ?? ''}"` : '';
        }
        return '';
      case 'syllable_builder':
        if (problem.type === 'syllable_builder') {
          const firstSyllable = problem.shuffled?.[0];
          return firstSyllable ? `${t.gameScreen.hints.syllableBuilder} "${firstSyllable.text ?? ''}"` : '';
        }
        return '';
      case 'balance_scale': {
        if (problem.type === 'balance_scale') {
          const leftSum = problem.display.left.reduce((a, b) => a + b, 0);
          const rightKnown = problem.display.right.reduce((a, b) => a + b, 0);
          return `${t.gameScreen.hints.balanceScale} ${leftSum}, ${t.gameScreen.hints.balanceScaleRight} ${rightKnown} + ?`;
        }
        return '';
      }
      case 'pattern':
        return t.gameScreen.hints.pattern;
      case 'memory_math':
        return t.gameScreen.hints.memoryMath;
      case 'picture_pairs':
        return t.gameScreen.hints.picturePairs;
      case 'sentence_logic':
        if (problem.type === 'sentence_logic') {
          const firstWord = problem.sentence.split(' ')[0];
          return `${t.gameScreen.hints.sentenceLogic} ${firstWord} ${t.gameScreen.hints.sentenceLogicScene}`;
        }
        return '';
      case 'robo_path':
        return t.gameScreen.hints.roboPath;
      case 'math_snake':
        return t.gameScreen.hints.mathSnake;
      case 'time_match':
        return t.gameScreen.hints.timeMatch;
      case 'unit_conversion':
        if (problem.type === 'unit_conversion') {
          return buildUnitConversionQuestion(t, problem.value, problem.fromUnit, problem.toUnit);
        }
        return '';
      case 'compare_sizes':
        return t.gameScreen.hints.compare_sizes;
      case 'letter_match':
        return t.gameScreen.hints.default;
      case 'shape_shift':
        return t.games.shape_shift.hintText;
      default:
        return t.gameScreen.hints.default;
    }
  }, [t]);

  const showHint = useCallback((problem: Problem) => {
    const hintText = getHint(problem);
    if (hintText) {
      addNotification({
        type: 'hint',
        message: formatText(hintText),
      });
      setBgClass('bg-yellow-50');
      setTimeout(() => {
        setBgClass('bg-slate-50');
      }, 3000);
    }
  }, [getHint, addNotification, setBgClass, formatText]);

  return { getHint, showHint };
}
