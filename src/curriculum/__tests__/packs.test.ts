import { describe, it, expect } from 'vitest';

import '../index'; // side-effect registration
import { contentPackRegistry, getPackItems, getPackItemsForLocale, skillRegistry } from '../index';
import {
  ASTRONOMY_VISIBLE_FROM_ESTONIA_PACK,
  getConstellationById,
  getConstellationsByDifficulty,
  getConstellationsForLevel,
} from '../packs/astronomy/visibleFromEstonia';
import { ASTRONOMY_VISIBLE_CONSTELLATIONS_SKILL } from '../skills/astronomy';
import {
  LANGUAGE_SPATIAL_SENTENCES_SKILL,
  LANGUAGE_SYLLABIFICATION_SKILL,
  LANGUAGE_VOCABULARY_SKILL,
} from '../skills/language';
import { LANGUAGE_SYLLABIFICATION_ET_PACK } from '../packs/language/syllables_et';
import { LANGUAGE_SYLLABIFICATION_EN_PACK } from '../packs/language/syllables_en';
import type { SyllableWord, VocabularyWord } from '../packs/language/types';
import {
  LANGUAGE_SPATIAL_SENTENCES_PACK,
  generateSentence,
} from '../packs/language/spatialSentences';
import {
  groupWordsByLength,
  LANGUAGE_VOCABULARY_EN_PACK,
  LANGUAGE_VOCABULARY_ET_PACK,
} from '../packs/language/vocabulary';
import {
  MATH_ADDITION_WITHIN_20_SKILL,
  MATH_ADDITION_WITHIN_100_SKILL,
  MATH_SUBTRACTION_WITHIN_20_SKILL,
  MATH_SUBTRACTION_WITHIN_100_SKILL,
  MATH_MULTIPLICATION_1_TO_5_SKILL,
  MATH_MULTIPLICATION_1_TO_10_SKILL,
  MATH_GEOMETRY_SHAPES_SKILL,
  MATH_PATTERN_SEQUENCES_SKILL,
  MATH_UNIT_CONVERSIONS_SKILL,
  MATH_COMPARE_NUMBERS_SKILL,
  MATH_TIME_READING_SKILL,
} from '../skills/math';
import { MATH_ADDITION_WITHIN_20_PACK } from '../packs/math/addition_within_20';
import { MATH_ADDITION_WITHIN_100_PACK } from '../packs/math/addition_within_100';
import { MATH_SUBTRACTION_WITHIN_20_PACK } from '../packs/math/subtraction_within_20';
import { MATH_SUBTRACTION_WITHIN_100_PACK } from '../packs/math/subtraction_within_100';
import { MATH_MULTIPLICATION_1_5_PACK } from '../packs/math/multiplication_1_5';
import { MATH_MULTIPLICATION_1_10_PACK } from '../packs/math/multiplication_1_10';
import {
  MATH_GEOMETRY_SHAPES_PACK,
  getShapeDashCheckpointQuestions,
  getShapeDashGateQuestions,
  getShapeDashShapeLabel,
} from '../packs/math/geometry_shapes';
import {
  MATH_PATTERN_SEQUENCES_PACK,
  getPatternTemplates,
  getPatternTemplatesForLevel,
  getPatternThemes,
} from '../packs/math/pattern_sequences';
import {
  MATH_UNIT_CONVERSIONS_PACK,
  getUnitConversionsByCategory,
} from '../packs/math/unit_conversions';
import { MATH_COMPARE_NUMBERS_PACK, getCompareNumberStage } from '../packs/math/compare_numbers';
import { MATH_TIME_READING_PACK, getTimeReadingStage } from '../packs/math/time_reading';
import { SHAPE_SHIFT_PUZZLES_PACK } from '../packs/geometry/shapeShiftPuzzles';
import type { Constellation } from '../../types/game';

describe('curriculum', () => {
  describe('registry', () => {
    it('registers the astronomy skill on import', () => {
      expect(skillRegistry.has(ASTRONOMY_VISIBLE_CONSTELLATIONS_SKILL.id)).toBe(true);
    });

    it('registers the astronomy pack on import', () => {
      expect(contentPackRegistry.has(ASTRONOMY_VISIBLE_FROM_ESTONIA_PACK.id)).toBe(true);
    });

    it('resolves pack items by id', () => {
      const items = getPackItems<Constellation>(ASTRONOMY_VISIBLE_FROM_ESTONIA_PACK.id);
      expect(Array.isArray(items)).toBe(true);
      expect(items.length).toBe(16);
    });

    it('throws for unknown pack', () => {
      expect(() => getPackItems('does.not.exist')).toThrow(/not registered/);
    });

    it('can look up packs by skill id', () => {
      const packs = contentPackRegistry.getBySkill(ASTRONOMY_VISIBLE_CONSTELLATIONS_SKILL.id);
      expect(packs).toHaveLength(1);
      expect(packs[0]?.id).toBe(ASTRONOMY_VISIBLE_FROM_ESTONIA_PACK.id);
    });

    it('resolves one pack per locale for a multi-locale skill', () => {
      const etPack = contentPackRegistry.findBySkillAndLocale(
        LANGUAGE_SYLLABIFICATION_SKILL.id,
        'et',
      );
      const enPack = contentPackRegistry.findBySkillAndLocale(
        LANGUAGE_SYLLABIFICATION_SKILL.id,
        'en',
      );
      expect(etPack?.id).toBe(LANGUAGE_SYLLABIFICATION_ET_PACK.id);
      expect(enPack?.id).toBe(LANGUAGE_SYLLABIFICATION_EN_PACK.id);
    });

    it('registers vocabulary packs per locale', () => {
      const etPack = contentPackRegistry.findBySkillAndLocale(LANGUAGE_VOCABULARY_SKILL.id, 'et');
      const enPack = contentPackRegistry.findBySkillAndLocale(LANGUAGE_VOCABULARY_SKILL.id, 'en');
      expect(etPack?.id).toBe(LANGUAGE_VOCABULARY_ET_PACK.id);
      expect(enPack?.id).toBe(LANGUAGE_VOCABULARY_EN_PACK.id);
    });

    it('getPackItemsForLocale returns locale-specific items', () => {
      const et = getPackItemsForLocale<SyllableWord>(LANGUAGE_SYLLABIFICATION_SKILL.id, 'et');
      const en = getPackItemsForLocale<SyllableWord>(LANGUAGE_SYLLABIFICATION_SKILL.id, 'en');
      expect(et.length).toBeGreaterThan(0);
      expect(en.length).toBeGreaterThan(0);
      expect(et).not.toBe(en);
      // Estonian words contain Estonian-only letters somewhere in the set
      const hasEstonianLetter = et.some((w) => w.syllables.some((s) => /[ÕÄÖÜŠŽ]/.test(s)));
      expect(hasEstonianLetter).toBe(true);
    });

    it('getPackItemsForLocale throws when skill has no packs', () => {
      expect(() => getPackItemsForLocale('does.not.exist', 'et')).toThrow(
        /No content pack registered/,
      );
    });
  });

  describe('astronomy pack shape', () => {
    const items = ASTRONOMY_VISIBLE_FROM_ESTONIA_PACK.items;

    it('binds to the astronomy skill', () => {
      expect(ASTRONOMY_VISIBLE_FROM_ESTONIA_PACK.skillId).toBe(
        ASTRONOMY_VISIBLE_CONSTELLATIONS_SKILL.id,
      );
    });

    it('has 8 easy, 7 medium, 1 hard constellations (16 total)', () => {
      expect(getConstellationsByDifficulty(items, 'easy')).toHaveLength(8);
      expect(getConstellationsByDifficulty(items, 'medium')).toHaveLength(7);
      expect(getConstellationsByDifficulty(items, 'hard')).toHaveLength(1);
    });

    it('getConstellationsForLevel includes easier tiers', () => {
      expect(getConstellationsForLevel(items, 'easy')).toHaveLength(8);
      expect(getConstellationsForLevel(items, 'medium')).toHaveLength(15);
      expect(getConstellationsForLevel(items, 'hard')).toHaveLength(16);
    });

    it('finds a known constellation by id', () => {
      const orion = getConstellationById(items, 'orion');
      expect(orion?.nameEn).toBe('Orion');
      expect(orion?.stars.length).toBeGreaterThan(0);
      expect(orion?.lines.length).toBeGreaterThan(0);
    });

    it('has unique constellation ids', () => {
      const ids = items.map((c) => c.id);
      expect(new Set(ids).size).toBe(ids.length);
    });

    it('every constellation has non-empty stars and lines', () => {
      for (const c of items) {
        expect(c.stars.length).toBeGreaterThan(0);
        expect(c.lines.length).toBeGreaterThan(0);
      }
    });
  });

  describe('syllabification packs shape', () => {
    it('both packs bind to the same skill', () => {
      expect(LANGUAGE_SYLLABIFICATION_ET_PACK.skillId).toBe(LANGUAGE_SYLLABIFICATION_SKILL.id);
      expect(LANGUAGE_SYLLABIFICATION_EN_PACK.skillId).toBe(LANGUAGE_SYLLABIFICATION_SKILL.id);
    });

    it('declare distinct locales', () => {
      expect(LANGUAGE_SYLLABIFICATION_ET_PACK.locale).toBe('et');
      expect(LANGUAGE_SYLLABIFICATION_EN_PACK.locale).toBe('en');
    });

    it('every item has at least 2 syllables and an emoji', () => {
      for (const pack of [LANGUAGE_SYLLABIFICATION_ET_PACK, LANGUAGE_SYLLABIFICATION_EN_PACK]) {
        for (const w of pack.items) {
          expect(w.syllables.length).toBeGreaterThanOrEqual(2);
          expect(w.emoji.length).toBeGreaterThan(0);
        }
      }
    });

    it('covers 2-, 3-, and 4-syllable words in each locale', () => {
      for (const pack of [LANGUAGE_SYLLABIFICATION_ET_PACK, LANGUAGE_SYLLABIFICATION_EN_PACK]) {
        const counts = new Set(pack.items.map((w) => w.syllables.length));
        expect(counts.has(2)).toBe(true);
        expect(counts.has(3)).toBe(true);
        expect(counts.has(4)).toBe(true);
      }
    });
  });

  describe('vocabulary packs shape', () => {
    it('both packs bind to the vocabulary skill', () => {
      expect(LANGUAGE_VOCABULARY_ET_PACK.skillId).toBe(LANGUAGE_VOCABULARY_SKILL.id);
      expect(LANGUAGE_VOCABULARY_EN_PACK.skillId).toBe(LANGUAGE_VOCABULARY_SKILL.id);
      expect(skillRegistry.has(LANGUAGE_VOCABULARY_SKILL.id)).toBe(true);
    });

    it('declare distinct locales', () => {
      expect(LANGUAGE_VOCABULARY_ET_PACK.locale).toBe('et');
      expect(LANGUAGE_VOCABULARY_EN_PACK.locale).toBe('en');
    });

    it('groups words by length for generator progression', () => {
      const et = groupWordsByLength(LANGUAGE_VOCABULARY_ET_PACK.items);
      const en = groupWordsByLength(LANGUAGE_VOCABULARY_EN_PACK.items);
      for (const db of [et, en]) {
        expect(db[3]?.length).toBeGreaterThan(0);
        expect(db[4]?.length).toBeGreaterThan(0);
        expect(db[5]?.length).toBeGreaterThan(0);
        expect(db[6]?.length).toBeGreaterThan(0);
        expect(db[7]?.length).toBeGreaterThan(0);
      }
    });

    it('returns locale-specific vocabulary through registry lookup', () => {
      const et = getPackItemsForLocale<VocabularyWord>(LANGUAGE_VOCABULARY_SKILL.id, 'et');
      const en = getPackItemsForLocale<VocabularyWord>(LANGUAGE_VOCABULARY_SKILL.id, 'en');
      expect(et).toBe(LANGUAGE_VOCABULARY_ET_PACK.items);
      expect(en).toBe(LANGUAGE_VOCABULARY_EN_PACK.items);
      expect(et.some((word) => /[ÕÄÖÜŠŽ]/.test(word.w))).toBe(true);
      expect(en.every((word) => /^[A-Z]+$/.test(word.w))).toBe(true);
    });
  });

  describe('spatial sentence pack shape', () => {
    it('binds to the spatial sentence skill and registers on import', () => {
      expect(LANGUAGE_SPATIAL_SENTENCES_PACK.skillId).toBe(LANGUAGE_SPATIAL_SENTENCES_SKILL.id);
      expect(skillRegistry.has(LANGUAGE_SPATIAL_SENTENCES_SKILL.id)).toBe(true);
      expect(contentPackRegistry.has(LANGUAGE_SPATIAL_SENTENCES_PACK.id)).toBe(true);
    });

    it('has keyed scenes with subjects, anchors, and positions', () => {
      expect(LANGUAGE_SPATIAL_SENTENCES_PACK.items.length).toBeGreaterThan(5);

      for (const scene of LANGUAGE_SPATIAL_SENTENCES_PACK.items) {
        expect(scene.id).not.toBe('');
        expect(scene.subjects.length).toBeGreaterThan(0);
        expect(scene.anchors.length).toBeGreaterThan(0);
        expect(scene.positions.length).toBeGreaterThan(0);
      }
    });

    it('can generate localized sentences from scene content', () => {
      const scene = LANGUAGE_SPATIAL_SENTENCES_PACK.items[0];
      if (!scene) throw new Error('spatial sentence pack has no scenes');
      const subject = scene.subjects[0];
      const anchor = scene.anchors[0];
      const position = scene.positions[0];
      if (!subject || !anchor || !position) throw new Error('spatial scene is incomplete');

      expect(generateSentence(subject, anchor, position, 'et')).toContain(subject.n);
      expect(generateSentence(subject, anchor, position, 'en')).toContain(' is ');
    });
  });

  describe('math packs shape', () => {
    const packBindings = [
      { pack: MATH_ADDITION_WITHIN_20_PACK, skill: MATH_ADDITION_WITHIN_20_SKILL },
      { pack: MATH_ADDITION_WITHIN_100_PACK, skill: MATH_ADDITION_WITHIN_100_SKILL },
      { pack: MATH_SUBTRACTION_WITHIN_20_PACK, skill: MATH_SUBTRACTION_WITHIN_20_SKILL },
      { pack: MATH_SUBTRACTION_WITHIN_100_PACK, skill: MATH_SUBTRACTION_WITHIN_100_SKILL },
      { pack: MATH_MULTIPLICATION_1_5_PACK, skill: MATH_MULTIPLICATION_1_TO_5_SKILL },
      { pack: MATH_MULTIPLICATION_1_10_PACK, skill: MATH_MULTIPLICATION_1_TO_10_SKILL },
      { pack: MATH_PATTERN_SEQUENCES_PACK, skill: MATH_PATTERN_SEQUENCES_SKILL },
      { pack: MATH_UNIT_CONVERSIONS_PACK, skill: MATH_UNIT_CONVERSIONS_SKILL },
      { pack: MATH_COMPARE_NUMBERS_PACK, skill: MATH_COMPARE_NUMBERS_SKILL },
      { pack: MATH_TIME_READING_PACK, skill: MATH_TIME_READING_SKILL },
    ];

    it('every math pack binds to its declared skill', () => {
      for (const { pack, skill } of packBindings) {
        expect(pack.skillId).toBe(skill.id);
      }
    });

    it('addition packs contain only add_* specs', () => {
      for (const pack of [MATH_ADDITION_WITHIN_20_PACK, MATH_ADDITION_WITHIN_100_PACK]) {
        for (const spec of pack.items) {
          expect(spec.op.startsWith('add_')).toBe(true);
        }
      }
    });

    it('subtraction packs contain only sub_* specs', () => {
      for (const pack of [MATH_SUBTRACTION_WITHIN_20_PACK, MATH_SUBTRACTION_WITHIN_100_PACK]) {
        for (const spec of pack.items) {
          expect(spec.op.startsWith('sub_')).toBe(true);
        }
      }
    });

    it('multiplication packs contain only mul_* specs', () => {
      for (const pack of [MATH_MULTIPLICATION_1_5_PACK, MATH_MULTIPLICATION_1_10_PACK]) {
        for (const spec of pack.items) {
          expect(spec.op.startsWith('mul_')).toBe(true);
        }
      }
    });

    it('addition_within_20 caps values at 20', () => {
      for (const spec of MATH_ADDITION_WITHIN_20_PACK.items) {
        expect(spec.valueRange?.[1]).toBe(20);
      }
    });

    it('addition_within_100 caps values at 100', () => {
      for (const spec of MATH_ADDITION_WITHIN_100_PACK.items) {
        expect(spec.valueRange?.[1]).toBe(100);
      }
    });

    it('multiplication_1_5 caps factors at [2,5]', () => {
      for (const spec of MATH_MULTIPLICATION_1_5_PACK.items) {
        expect(spec.factorRange).toEqual([2, 5]);
      }
    });

    it('multiplication_1_10 caps factors at [2,10]', () => {
      for (const spec of MATH_MULTIPLICATION_1_10_PACK.items) {
        expect(spec.factorRange).toEqual([2, 10]);
      }
    });

    it('pattern sequence pack has themes and progression templates', () => {
      const themes = getPatternThemes(MATH_PATTERN_SEQUENCES_PACK.items);
      const templates = getPatternTemplates(MATH_PATTERN_SEQUENCES_PACK.items);
      expect(themes).toHaveLength(5);
      expect(themes.every((theme) => theme.symbols.length === 4)).toBe(true);
      expect(templates.map((template) => template.id).sort()).toEqual([
        'repeat_aab',
        'repeat_aabb',
        'repeat_aabc',
        'repeat_ab',
        'repeat_abc',
        'repeat_abcd',
      ]);
      expect(getPatternTemplatesForLevel(MATH_PATTERN_SEQUENCES_PACK.items, 1, false)).toHaveLength(
        2,
      );
      expect(getPatternTemplatesForLevel(MATH_PATTERN_SEQUENCES_PACK.items, 6, true)).toHaveLength(
        4,
      );
    });

    it('unit conversion pack groups supported measurement categories', () => {
      const byCategory = getUnitConversionsByCategory(MATH_UNIT_CONVERSIONS_PACK.items);
      expect(byCategory.length.map((item) => item.from)).toEqual(['m', 'km', 'cm']);
      expect(byCategory.mass.map((item) => item.from)).toEqual(['kg', 't']);
      expect(byCategory.volume.map((item) => item.from)).toEqual(['l', 'l']);
      expect(MATH_UNIT_CONVERSIONS_PACK.items.every((item) => item.factor > 1)).toBe(true);
    });

    it('compare number pack defines staged comparison difficulty', () => {
      const level1 = getCompareNumberStage(MATH_COMPARE_NUMBERS_PACK.items, 1);
      const level4 = getCompareNumberStage(MATH_COMPARE_NUMBERS_PACK.items, 4);
      const level12 = getCompareNumberStage(MATH_COMPARE_NUMBERS_PACK.items, 12);

      expect(level1.symbolOptions).toEqual(['left', 'right']);
      expect(level1.equalChance).toBe(0);
      expect(level4.symbolOptions).toEqual(['left', 'right', 'equal']);
      expect(level4.showNumbers).toBe(true);
      expect(level12.maxValue).toBe(100);
    });

    it('time reading pack defines minute precision and option count stages', () => {
      const level1 = getTimeReadingStage(MATH_TIME_READING_PACK.items, 1);
      const level5 = getTimeReadingStage(MATH_TIME_READING_PACK.items, 5);
      const level7 = getTimeReadingStage(MATH_TIME_READING_PACK.items, 7);

      expect(level1).toMatchObject({ stepMinutes: 30, optionCount: 3 });
      expect(level5).toMatchObject({ stepMinutes: 10, optionCount: 4 });
      expect(level7).toMatchObject({ stepMinutes: 5, optionCount: 6 });
      expect(MATH_TIME_READING_PACK.items.every((item) => 60 % item.stepMinutes === 0)).toBe(true);
    });
  });

  describe('geometry shapes pack shape', () => {
    const checkpointQuestions = getShapeDashCheckpointQuestions(MATH_GEOMETRY_SHAPES_PACK.items);
    const gateQuestions = getShapeDashGateQuestions(MATH_GEOMETRY_SHAPES_PACK.items);

    it('binds to the geometry skill and registers on import', () => {
      expect(MATH_GEOMETRY_SHAPES_PACK.skillId).toBe(MATH_GEOMETRY_SHAPES_SKILL.id);
      expect(skillRegistry.has(MATH_GEOMETRY_SHAPES_SKILL.id)).toBe(true);
      expect(contentPackRegistry.has(MATH_GEOMETRY_SHAPES_PACK.id)).toBe(true);
    });

    it('contains checkpoint and gate content for Shape Dash', () => {
      expect(checkpointQuestions.length).toBeGreaterThan(20);
      expect(gateQuestions.length).toBeGreaterThanOrEqual(5);
    });

    it('keeps every checkpoint correct index inside both locale option arrays', () => {
      for (const question of checkpointQuestions) {
        expect(question.options.et[question.correctIndex]).toBeDefined();
        expect(question.options.en[question.correctIndex]).toBeDefined();
      }
    });

    it('has labels for every gate shape in both locales', () => {
      for (const question of gateQuestions) {
        expect(getShapeDashShapeLabel(question.correctShape, 'et')).not.toBe('');
        expect(getShapeDashShapeLabel(question.correctShape, 'en')).not.toBe('');
      }
    });
  });

  describe('shape shift puzzle pack shape', () => {
    it('binds to the geometry skill and registers on import', () => {
      expect(SHAPE_SHIFT_PUZZLES_PACK.skillId).toBe(MATH_GEOMETRY_SHAPES_SKILL.id);
      expect(contentPackRegistry.has(SHAPE_SHIFT_PUZZLES_PACK.id)).toBe(true);
    });

    it('covers every Shape Shift difficulty tier', () => {
      const difficulties = new Set(
        SHAPE_SHIFT_PUZZLES_PACK.items.map((puzzle) => puzzle.difficulty),
      );
      expect(difficulties.has('easy')).toBe(true);
      expect(difficulties.has('medium')).toBe(true);
      expect(difficulties.has('hard')).toBe(true);
    });

    it('keeps every puzzle id unique and every puzzle non-empty', () => {
      const ids = SHAPE_SHIFT_PUZZLES_PACK.items.map((puzzle) => puzzle.id);
      expect(new Set(ids).size).toBe(ids.length);

      for (const puzzle of SHAPE_SHIFT_PUZZLES_PACK.items) {
        expect(puzzle.pieces.length).toBeGreaterThan(0);
      }
    });
  });
});
