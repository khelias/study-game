/**
 * Content pack: Estonian syllable segmentation words.
 *
 * Grouped by syllable count (2, 3, 4) so mechanics can filter by difficulty.
 * Each item carries an emoji for visual anchoring (helps pre-readers).
 */

import type { ContentPack } from '../../types';
import { withSyllableWordMetadata, type SyllableWord, type SyllableWordBase } from './types';
import { LANGUAGE_SYLLABIFICATION_SKILL } from '../../skills/language';

const RAW_ITEMS: readonly SyllableWordBase[] = [
  // 2 syllables
  { syllables: ['AU', 'TO'], emoji: '🚗' },
  { syllables: ['KA', 'LA'], emoji: '🐟' },
  { syllables: ['KO', 'ER'], emoji: '🐶' },
  { syllables: ['KA', 'RU'], emoji: '🐻' },
  { syllables: ['LU', 'MI'], emoji: '❄️' },
  { syllables: ['MA', 'JA'], emoji: '🏠' },
  { syllables: ['HE', 'LI'], emoji: '🔔' },
  { syllables: ['MA', 'RI'], emoji: '🍓' },
  { syllables: ['KO', 'DU'], emoji: '🏡' },
  { syllables: ['JÕ', 'GI'], emoji: '🏞️' },
  { syllables: ['ME', 'RI'], emoji: '🌊' },
  { syllables: ['E', 'MA'], emoji: '👩' },
  { syllables: ['I', 'SA'], emoji: '👨' },
  { syllables: ['JÄ', 'NES'], emoji: '🐰' },
  { syllables: ['RAA', 'MAT'], emoji: '📖' },
  { syllables: ['RO', 'BOT'], emoji: '🤖' },
  { syllables: ['POR', 'GAND'], emoji: '🥕' },
  { syllables: ['KAR', 'TUL'], emoji: '🥔' },
  { syllables: ['TO', 'MAT'], emoji: '🍅' },
  { syllables: ['JÄÄ', 'TIS'], emoji: '🍦' },
  { syllables: ['KÜP', 'SIS'], emoji: '🍪' },
  { syllables: ['LEN', 'NUK'], emoji: '✈️' },
  { syllables: ['KIR', 'SI'], emoji: '🍒' },
  { syllables: ['SID', 'RUN'], emoji: '🍋' },
  { syllables: ['PÄH', 'KEL'], emoji: '🌰' },
  { syllables: ['PI', 'TSA'], emoji: '🍕' },
  { syllables: ['AR', 'BUUS'], emoji: '🍉' },
  { syllables: ['A', 'KEN'], emoji: '🪟' },
  { syllables: ['PA', 'BER'], emoji: '📄' },
  { syllables: ['PEE', 'GEL'], emoji: '🪞' },
  { syllables: ['SÕ', 'BER'], emoji: '🤝' },
  { syllables: ['PÄI', 'KE'], emoji: '☀️' },

  // 3 syllables
  { syllables: ['HO', 'BU', 'NE'], emoji: '🐎' },
  { syllables: ['E', 'LE', 'VANT'], emoji: '🐘' },
  { syllables: ['RE', 'BA', 'NE'], emoji: '🦊' },
  { syllables: ['LU', 'SI', 'KAS'], emoji: '🥄' },
  { syllables: ['LI', 'BLI', 'KAS'], emoji: '🦋' },
  { syllables: ['A', 'NA', 'NASS'], emoji: '🍍' },
  { syllables: ['MAA', 'SI', 'KAS'], emoji: '🍓' },
  { syllables: ['MUU', 'SI', 'KA'], emoji: '🎼' },
  { syllables: ['AR', 'VU', 'TI'], emoji: '💻' },
  { syllables: ['TE', 'LE', 'FON'], emoji: '📱' },
  { syllables: ['PO', 'LI', 'TSEI'], emoji: '👮' },
  { syllables: ['KA', 'ME', 'RA'], emoji: '📷' },

  // 4 syllables
  { syllables: ['HE', 'LI', 'KOP', 'TER'], emoji: '🚁' },
  { syllables: ['KA', 'EL', 'KIR', 'JAK'], emoji: '🦒' },
  { syllables: ['LU', 'ME', 'SA', 'DU'], emoji: '❄️' },
  { syllables: ['VIH', 'MA', 'VA', 'RI'], emoji: '☂️' },
  { syllables: ['MO', 'TOR', 'RA', 'TAS'], emoji: '🏍️' },
  { syllables: ['VA', 'NA', 'E', 'MA'], emoji: '👵' },
  { syllables: ['VA', 'NA', 'I', 'SA'], emoji: '👴' },
];

const ITEMS = withSyllableWordMetadata(RAW_ITEMS);

export const LANGUAGE_SYLLABIFICATION_ET_PACK: ContentPack<SyllableWord> = {
  id: 'language.syllabification.et',
  skillId: LANGUAGE_SYLLABIFICATION_SKILL.id,
  locale: 'et',
  version: '1.1.0',
  title: {
    et: 'Eesti silbid',
    en: 'Estonian syllables',
  },
  items: ITEMS,
};
