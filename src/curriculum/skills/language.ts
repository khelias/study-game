import type { Skill } from '../types';

/**
 * Syllabification: segmenting words into syllables.
 *
 * Cross-locale concept (same mechanic works for any language), so a single
 * skill binds to multiple locale-scoped content packs (et + en). Mechanics
 * resolve the right pack via `getPackItemsForLocale(skillId, locale)`.
 */
export const LANGUAGE_SYLLABIFICATION_SKILL: Skill = {
  id: 'language.syllabification',
  name: {
    et: 'Silbitamine',
    en: 'Syllables',
  },
  taxonomy: {
    subject: 'emakeel',
    grade: 1,
    level: 'foundation',
    topic: 'language.phonology.syllables',
  },
};
