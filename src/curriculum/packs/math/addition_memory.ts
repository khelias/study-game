import type { ContentPack } from '../../types';
import { MATH_ADDITION_MEMORY_SKILL } from '../../skills/math';

export type MemoryMathProgressionProfile = 'starter' | 'advanced';

export interface MemoryMathProgressionItem {
  profile: MemoryMathProgressionProfile;
  baseCards: number;
  maxCards: number;
  cardGrowthDivisor: number;
  cardGrowthStep: number;
  minAnswerSum: number;
  baseMaxSum: number;
  maxSum: number;
  sumGrowthMultiplier: number;
}

const ITEMS: readonly MemoryMathProgressionItem[] = [
  {
    profile: 'starter',
    baseCards: 6,
    maxCards: 12,
    cardGrowthDivisor: 2.5,
    cardGrowthStep: 2,
    minAnswerSum: 3,
    baseMaxSum: 10,
    maxSum: 25,
    sumGrowthMultiplier: 2,
  },
  {
    profile: 'advanced',
    baseCards: 8,
    maxCards: 14,
    cardGrowthDivisor: 2.5,
    cardGrowthStep: 2,
    minAnswerSum: 3,
    baseMaxSum: 15,
    maxSum: 35,
    sumGrowthMultiplier: 2,
  },
];

export function getMemoryMathProgression(
  items: readonly MemoryMathProgressionItem[],
  profile: MemoryMathProgressionProfile,
): MemoryMathProgressionItem {
  const progression = items.find((item) => item.profile === profile);
  if (!progression) {
    throw new Error(`No memory math progression found for ${profile}`);
  }
  return progression;
}

export const MATH_ADDITION_MEMORY_PACK: ContentPack<MemoryMathProgressionItem> = {
  id: 'math.addition_memory.core',
  skillId: MATH_ADDITION_MEMORY_SKILL.id,
  locale: 'et',
  version: '1.0.0',
  title: {
    et: 'Liitmistehete mälumängu astmestik',
    en: 'Addition memory progression',
  },
  items: ITEMS,
};
