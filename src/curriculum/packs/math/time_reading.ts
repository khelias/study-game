import type { ContentPack } from '../../types';
import { MATH_TIME_READING_SKILL } from '../../skills/math';

export interface TimeReadingStageItem {
  minLevel: number;
  maxLevel?: number;
  stepMinutes: number;
  optionCount: number;
}

const ITEMS: readonly TimeReadingStageItem[] = [
  { minLevel: 1, maxLevel: 2, stepMinutes: 30, optionCount: 3 },
  { minLevel: 3, maxLevel: 4, stepMinutes: 15, optionCount: 4 },
  { minLevel: 5, maxLevel: 5, stepMinutes: 10, optionCount: 4 },
  { minLevel: 6, maxLevel: 6, stepMinutes: 10, optionCount: 6 },
  { minLevel: 7, stepMinutes: 5, optionCount: 6 },
];

export function getTimeReadingStage(
  items: readonly TimeReadingStageItem[],
  level: number,
): TimeReadingStageItem {
  const stage = items.find(
    (item) => level >= item.minLevel && (item.maxLevel === undefined || level <= item.maxLevel),
  );
  if (!stage) {
    throw new Error(`No time reading stage found for level ${level}`);
  }
  return stage;
}

export const MATH_TIME_READING_PACK: ContentPack<TimeReadingStageItem> = {
  id: 'math.time_reading.core',
  skillId: MATH_TIME_READING_SKILL.id,
  locale: 'et',
  version: '1.0.0',
  title: {
    et: 'Kellaaja lugemise astmed',
    en: 'Reading time stages',
  },
  items: ITEMS,
};
