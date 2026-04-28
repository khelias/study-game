/**
 * Content pack: English syllable segmentation words.
 *
 * Grouped by syllable count (2, 3, 4). Each item carries an emoji for visual
 * anchoring.
 */

import type { ContentPack } from '../../types';
import { withSyllableWordMetadata, type SyllableWord, type SyllableWordBase } from './types';
import { LANGUAGE_SYLLABIFICATION_SKILL } from '../../skills/language';

const RAW_ITEMS: readonly SyllableWordBase[] = [
  // 2 syllables
  { syllables: ['AP', 'PLE'], emoji: '🍎' },
  { syllables: ['TA', 'BLE'], emoji: '🪑' },
  { syllables: ['TI', 'GER'], emoji: '🐯' },
  { syllables: ['LI', 'ON'], emoji: '🦁' },
  { syllables: ['ZE', 'BRA'], emoji: '🦓' },
  { syllables: ['PIZ', 'ZA'], emoji: '🍕' },
  { syllables: ['BUR', 'GER'], emoji: '🍔' },
  { syllables: ['RAB', 'BIT'], emoji: '🐰' },
  { syllables: ['TUR', 'TLE'], emoji: '🐢' },
  { syllables: ['MON', 'KEY'], emoji: '🐵' },
  { syllables: ['PEN', 'CIL'], emoji: '✏️' },
  { syllables: ['FLOW', 'ER'], emoji: '🌸' },
  { syllables: ['WIN', 'TER'], emoji: '❄️' },
  { syllables: ['SUM', 'MER'], emoji: '☀️' },
  { syllables: ['RO', 'BOT'], emoji: '🤖' },
  { syllables: ['PIC', 'NIC'], emoji: '🧺' },
  { syllables: ['O', 'CEAN'], emoji: '🌊' },
  { syllables: ['BUT', 'TER'], emoji: '🧈' },
  { syllables: ['CAR', 'ROT'], emoji: '🥕' },
  { syllables: ['GAR', 'DEN'], emoji: '🌻' },

  // 3 syllables
  { syllables: ['BA', 'NA', 'NA'], emoji: '🍌' },
  { syllables: ['EL', 'E', 'PHANT'], emoji: '🐘' },
  { syllables: ['OC', 'TO', 'PUS'], emoji: '🐙' },
  { syllables: ['PO', 'TA', 'TO'], emoji: '🥔' },
  { syllables: ['TO', 'MA', 'TO'], emoji: '🍅' },
  { syllables: ['BUT', 'TER', 'FLY'], emoji: '🦋' },
  { syllables: ['COM', 'PU', 'TER'], emoji: '💻' },
  { syllables: ['TE', 'LE', 'PHONE'], emoji: '📱' },
  { syllables: ['UM', 'BREL', 'LA'], emoji: '☂️' },
  { syllables: ['CAM', 'ER', 'A'], emoji: '📷' },
  { syllables: ['AN', 'I', 'MAL'], emoji: '🐾' },
  { syllables: ['CHOC', 'O', 'LATE'], emoji: '🍫' },

  // 4 syllables
  { syllables: ['A', 'VO', 'CA', 'DO'], emoji: '🥑' },
  { syllables: ['WA', 'TER', 'MEL', 'ON'], emoji: '🍉' },
  { syllables: ['HE', 'LI', 'COP', 'TER'], emoji: '🚁' },
];

const ITEMS = withSyllableWordMetadata(RAW_ITEMS);

export const LANGUAGE_SYLLABIFICATION_EN_PACK: ContentPack<SyllableWord> = {
  id: 'language.syllabification.en',
  skillId: LANGUAGE_SYLLABIFICATION_SKILL.id,
  locale: 'en',
  version: '1.1.0',
  title: {
    et: 'Inglise silbid',
    en: 'English syllables',
  },
  items: ITEMS,
};
