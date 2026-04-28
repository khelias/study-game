import type { ContentPack, LocaleCode } from '../../types';
import { MATH_ADDITION_MEMORY_SKILL } from '../../skills/math';

export type MemoryMathProgressionProfile = 'starter' | 'advanced';
export type MemoryMathFocus =
  | 'first_pairs'
  | 'sums_within_10'
  | 'sums_within_15'
  | 'sums_within_20'
  | 'advanced_warmup'
  | 'sums_within_20_dense'
  | 'sums_within_25'
  | 'sums_within_35';

export interface MemoryMathProgressionItem {
  kind: 'stage';
  profile: MemoryMathProgressionProfile;
  minLevel: number;
  maxLevel?: number;
  focus: MemoryMathFocus;
  learningOutcome: Record<LocaleCode, string>;
  cardCount: number;
  minAnswerSum: number;
  maxAnswerSum: number;
  minAddend: number;
}

const ITEMS: readonly MemoryMathProgressionItem[] = [
  {
    kind: 'stage',
    profile: 'starter',
    minLevel: 1,
    maxLevel: 2,
    focus: 'first_pairs',
    learningOutcome: { et: 'Liitmise paarid väikeste summadega', en: 'Match first addition pairs' },
    cardCount: 6,
    minAnswerSum: 3,
    maxAnswerSum: 8,
    minAddend: 1,
  },
  {
    kind: 'stage',
    profile: 'starter',
    minLevel: 3,
    maxLevel: 4,
    focus: 'sums_within_10',
    learningOutcome: { et: 'Liitmised summani 10', en: 'Addition sums within 10' },
    cardCount: 8,
    minAnswerSum: 3,
    maxAnswerSum: 10,
    minAddend: 1,
  },
  {
    kind: 'stage',
    profile: 'starter',
    minLevel: 5,
    maxLevel: 7,
    focus: 'sums_within_15',
    learningOutcome: { et: 'Liitmised summani 15', en: 'Addition sums within 15' },
    cardCount: 10,
    minAnswerSum: 4,
    maxAnswerSum: 15,
    minAddend: 1,
  },
  {
    kind: 'stage',
    profile: 'starter',
    minLevel: 8,
    focus: 'sums_within_20',
    learningOutcome: { et: 'Liitmised summani 20', en: 'Addition sums within 20' },
    cardCount: 12,
    minAnswerSum: 5,
    maxAnswerSum: 20,
    minAddend: 2,
  },
  {
    kind: 'stage',
    profile: 'advanced',
    minLevel: 1,
    maxLevel: 2,
    focus: 'advanced_warmup',
    learningOutcome: { et: 'Kiirem kordus summani 15', en: 'Faster review within 15' },
    cardCount: 8,
    minAnswerSum: 5,
    maxAnswerSum: 15,
    minAddend: 2,
  },
  {
    kind: 'stage',
    profile: 'advanced',
    minLevel: 3,
    maxLevel: 5,
    focus: 'sums_within_20_dense',
    learningOutcome: {
      et: 'Tihedam liitmiste kordus summani 20',
      en: 'Dense addition review within 20',
    },
    cardCount: 10,
    minAnswerSum: 6,
    maxAnswerSum: 20,
    minAddend: 2,
  },
  {
    kind: 'stage',
    profile: 'advanced',
    minLevel: 6,
    maxLevel: 9,
    focus: 'sums_within_25',
    learningOutcome: { et: 'Liitmised summani 25', en: 'Addition sums within 25' },
    cardCount: 12,
    minAnswerSum: 8,
    maxAnswerSum: 25,
    minAddend: 2,
  },
  {
    kind: 'stage',
    profile: 'advanced',
    minLevel: 10,
    focus: 'sums_within_35',
    learningOutcome: { et: 'Liitmised summani 35', en: 'Addition sums within 35' },
    cardCount: 14,
    minAnswerSum: 10,
    maxAnswerSum: 35,
    minAddend: 3,
  },
];

export function getMemoryMathProgression(
  items: readonly MemoryMathProgressionItem[],
  profile: MemoryMathProgressionProfile,
  level = 1,
): MemoryMathProgressionItem {
  const progression = items.find(
    (item) =>
      item.profile === profile &&
      level >= item.minLevel &&
      (item.maxLevel === undefined || level <= item.maxLevel),
  );
  if (!progression) {
    throw new Error(`No memory math progression found for ${profile} level ${level}`);
  }
  return progression;
}

export const MATH_ADDITION_MEMORY_PACK: ContentPack<MemoryMathProgressionItem> = {
  id: 'math.addition_memory.core',
  skillId: MATH_ADDITION_MEMORY_SKILL.id,
  locale: 'et',
  version: '1.1.0',
  title: {
    et: 'Liitmistehete mälumängu astmestik',
    en: 'Addition memory progression',
  },
  items: ITEMS,
};
