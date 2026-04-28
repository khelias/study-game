import type { ContentPack } from '../../types';
import { MATH_BALANCE_EQUATIONS_SKILL } from '../../skills/math';

export type BalanceEquationDistractorStrategy = 'nearby' | 'nearby_with_far' | 'wider_range';

export interface BalanceEquationProgressionItem {
  minLevel: number;
  maxLevel?: number;
  minSum: number;
  maxSum: number;
  advancedSumBoost: number;
  minVisibleWeight: number;
  optionCount: number;
  distractorStrategy: BalanceEquationDistractorStrategy;
  distractorOffsets: readonly number[];
  fallbackMaxOption: number;
}

const ITEMS: readonly BalanceEquationProgressionItem[] = [
  {
    minLevel: 1,
    maxLevel: 2,
    minSum: 4,
    maxSum: 7,
    advancedSumBoost: 2,
    minVisibleWeight: 2,
    optionCount: 3,
    distractorStrategy: 'nearby',
    distractorOffsets: [-2, -1, 1, 2],
    fallbackMaxOption: 10,
  },
  {
    minLevel: 3,
    maxLevel: 4,
    minSum: 6,
    maxSum: 10,
    advancedSumBoost: 2,
    minVisibleWeight: 2,
    optionCount: 3,
    distractorStrategy: 'nearby',
    distractorOffsets: [-3, -2, -1, 1, 2, 3],
    fallbackMaxOption: 12,
  },
  {
    minLevel: 5,
    maxLevel: 6,
    minSum: 9,
    maxSum: 14,
    advancedSumBoost: 3,
    minVisibleWeight: 2,
    optionCount: 4,
    distractorStrategy: 'nearby_with_far',
    distractorOffsets: [-4, -3, -2, -1, 1, 2, 3, 4],
    fallbackMaxOption: 16,
  },
  {
    minLevel: 7,
    maxLevel: 9,
    minSum: 12,
    maxSum: 18,
    advancedSumBoost: 4,
    minVisibleWeight: 3,
    optionCount: 4,
    distractorStrategy: 'nearby_with_far',
    distractorOffsets: [-5, -4, -3, -2, 2, 3, 4, 5],
    fallbackMaxOption: 20,
  },
  {
    minLevel: 10,
    maxLevel: 14,
    minSum: 16,
    maxSum: 24,
    advancedSumBoost: 5,
    minVisibleWeight: 3,
    optionCount: 4,
    distractorStrategy: 'wider_range',
    distractorOffsets: [-7, -5, -3, -2, 2, 3, 5, 7],
    fallbackMaxOption: 28,
  },
  {
    minLevel: 15,
    minSum: 21,
    maxSum: 32,
    advancedSumBoost: 6,
    minVisibleWeight: 4,
    optionCount: 5,
    distractorStrategy: 'wider_range',
    distractorOffsets: [-9, -7, -5, -3, 3, 5, 7, 9],
    fallbackMaxOption: 36,
  },
];

export function getBalanceEquationProgression(
  items: readonly BalanceEquationProgressionItem[],
  level = 1,
): BalanceEquationProgressionItem {
  const progression = items.find(
    (item) => level >= item.minLevel && (item.maxLevel === undefined || level <= item.maxLevel),
  );
  if (!progression) {
    throw new Error(`No balance equation progression found for level ${level}`);
  }
  return progression;
}

export const MATH_BALANCE_EQUATIONS_PACK: ContentPack<BalanceEquationProgressionItem> = {
  id: 'math.balance_equations.core',
  skillId: MATH_BALANCE_EQUATIONS_SKILL.id,
  locale: 'et',
  version: '1.1.0',
  title: {
    et: 'Tasakaaluvõrrandite astmestik',
    en: 'Balance equation progression',
  },
  items: ITEMS,
};
