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

export const LANGUAGE_SPATIAL_SENTENCES_SKILL: Skill = {
  id: 'language.spatial_sentences',
  name: {
    et: 'Asukohalaused',
    en: 'Spatial sentences',
  },
  taxonomy: {
    subject: 'emakeel',
    grade: 1,
    level: 'foundation',
    topic: 'language.grammar.spatial_relations',
  },
};

export const LANGUAGE_VOCABULARY_SKILL: Skill = {
  id: 'language.vocabulary',
  name: {
    et: 'Sõnavara',
    en: 'Vocabulary',
  },
  taxonomy: {
    subject: 'emakeel',
    grade: 1,
    level: 'foundation',
    topic: 'language.vocabulary.words',
  },
};

export const LANGUAGE_LONG_VOCABULARY_SKILL: Skill = {
  id: 'language.vocabulary.long_words',
  name: {
    et: 'Pikad sõnad',
    en: 'Long words',
  },
  taxonomy: {
    subject: 'emakeel',
    grade: 1,
    level: 'intermediate',
    topic: 'language.vocabulary.long_words',
  },
};
