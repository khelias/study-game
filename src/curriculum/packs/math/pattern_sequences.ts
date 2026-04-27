import type { PatternRuleId } from '../../../types/game';
import type { ContentPack } from '../../types';
import { MATH_PATTERN_SEQUENCES_SKILL } from '../../skills/math';

export interface PatternThemeItem {
  kind: 'theme';
  id: string;
  symbols: readonly [string, string, string, string];
}

export interface PatternTemplateItem {
  kind: 'template';
  id: PatternRuleId;
  cycle: readonly number[];
  length: number;
}

export type PatternSequenceItem = PatternThemeItem | PatternTemplateItem;

const THEMES: readonly PatternThemeItem[] = [
  { kind: 'theme', id: 'colors', symbols: ['🔴', '🔵', '🟢', '🟡'] },
  { kind: 'theme', id: 'faces', symbols: ['🐶', '🐱', '🐸', '🦁'] },
  { kind: 'theme', id: 'fruit', symbols: ['🍎', '🍌', '🍇', '🍉'] },
  { kind: 'theme', id: 'sports', symbols: ['⚽', '🏀', '🎾', '🎱'] },
  { kind: 'theme', id: 'vehicles', symbols: ['🚗', '🚕', '🚙', '🚌'] },
];

const TEMPLATES: readonly PatternTemplateItem[] = [
  { kind: 'template', id: 'repeat_ab', cycle: [0, 1], length: 4 },
  { kind: 'template', id: 'repeat_abc', cycle: [0, 1, 2], length: 5 },
  { kind: 'template', id: 'repeat_abcd', cycle: [0, 1, 2, 3], length: 6 },
  { kind: 'template', id: 'repeat_aab', cycle: [0, 0, 1], length: 5 },
  { kind: 'template', id: 'repeat_aabb', cycle: [0, 0, 1, 1], length: 5 },
  { kind: 'template', id: 'repeat_aabc', cycle: [0, 0, 1, 2], length: 6 },
];

export function getPatternThemes(items: readonly PatternSequenceItem[]): PatternThemeItem[] {
  return items.filter((item): item is PatternThemeItem => item.kind === 'theme');
}

export function getPatternTemplates(items: readonly PatternSequenceItem[]): PatternTemplateItem[] {
  return items.filter((item): item is PatternTemplateItem => item.kind === 'template');
}

export function getPatternTemplatesForLevel(
  items: readonly PatternSequenceItem[],
  level: number,
  harder: boolean,
): PatternTemplateItem[] {
  const byId = new Map(getPatternTemplates(items).map((template) => [template.id, template]));
  const requireTemplate = (id: PatternRuleId): PatternTemplateItem => {
    const template = byId.get(id);
    if (!template) throw new Error(`Pattern template "${id}" is missing from the pack`);
    return template;
  };

  if (!harder) {
    if (level <= 2) {
      return [requireTemplate('repeat_ab'), requireTemplate('repeat_aab')];
    }
    if (level <= 4) {
      return [
        requireTemplate('repeat_ab'),
        requireTemplate('repeat_aab'),
        requireTemplate('repeat_abc'),
      ];
    }
    return [
      requireTemplate('repeat_ab'),
      requireTemplate('repeat_aab'),
      requireTemplate('repeat_abc'),
      requireTemplate('repeat_aabb'),
    ];
  }

  if (level <= 2) {
    return [requireTemplate('repeat_ab'), requireTemplate('repeat_abc')];
  }
  if (level <= 4) {
    return [
      requireTemplate('repeat_aab'),
      requireTemplate('repeat_abc'),
      requireTemplate('repeat_aabb'),
    ];
  }
  return [
    requireTemplate('repeat_abc'),
    requireTemplate('repeat_aabb'),
    requireTemplate('repeat_abcd'),
    requireTemplate('repeat_aabc'),
  ];
}

export const MATH_PATTERN_SEQUENCES_PACK: ContentPack<PatternSequenceItem> = {
  id: 'math.pattern_sequences.core',
  skillId: MATH_PATTERN_SEQUENCES_SKILL.id,
  locale: 'et',
  version: '1.0.0',
  title: {
    et: 'Mustrijadad',
    en: 'Pattern sequences',
  },
  items: [...THEMES, ...TEMPLATES],
};
