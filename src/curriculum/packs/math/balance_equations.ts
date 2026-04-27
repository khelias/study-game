import type { ContentPack } from '../../types';
import { MATH_BALANCE_EQUATIONS_SKILL } from '../../skills/math';

export interface BalanceEquationProgressionItem {
  baseMinSum: number;
  baseMaxSum: number;
  minSumLevelGrowth: number;
  maxSumLevelGrowth: number;
  profileBoostMultiplier: number;
  minVisibleWeight: number;
  optionCount: number;
  distractorOffsetMin: number;
  distractorOffsetMax: number;
  fallbackMaxOption: number;
}

const ITEMS: readonly BalanceEquationProgressionItem[] = [
  {
    baseMinSum: 4,
    baseMaxSum: 7,
    minSumLevelGrowth: 0.6,
    maxSumLevelGrowth: 0.9,
    profileBoostMultiplier: 1.5,
    minVisibleWeight: 2,
    optionCount: 3,
    distractorOffsetMin: -2,
    distractorOffsetMax: 2,
    fallbackMaxOption: 10,
  },
];

export function getBalanceEquationProgression(
  items: readonly BalanceEquationProgressionItem[],
): BalanceEquationProgressionItem {
  const progression = items[0];
  if (!progression) {
    throw new Error('No balance equation progression found');
  }
  return progression;
}

export const MATH_BALANCE_EQUATIONS_PACK: ContentPack<BalanceEquationProgressionItem> = {
  id: 'math.balance_equations.core',
  skillId: MATH_BALANCE_EQUATIONS_SKILL.id,
  locale: 'et',
  version: '1.0.0',
  title: {
    et: 'Tasakaaluvõrrandite astmestik',
    en: 'Balance equation progression',
  },
  items: ITEMS,
};
