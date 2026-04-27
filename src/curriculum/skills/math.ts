import type { Skill } from '../types';

// Every math-snake card is a focused skill. One pack per skill, one binding
// per pack — no "mixed" catch-all.

export const MATH_ADDITION_WITHIN_20_SKILL: Skill = {
  id: 'math.addition_within_20',
  name: { et: 'Liitmine kuni 20', en: 'Addition within 20' },
  taxonomy: {
    subject: 'matemaatika',
    grade: 1,
    level: 'foundation',
    topic: 'math.addition.within_20',
  },
};

export const MATH_ADDITION_WITHIN_100_SKILL: Skill = {
  id: 'math.addition_within_100',
  name: { et: 'Liitmine kuni 100', en: 'Addition within 100' },
  taxonomy: {
    subject: 'matemaatika',
    grade: 3,
    level: 'intermediate',
    topic: 'math.addition.within_100',
  },
  prerequisites: ['math.addition_within_20'],
};

export const MATH_SUBTRACTION_WITHIN_20_SKILL: Skill = {
  id: 'math.subtraction_within_20',
  name: { et: 'Lahutamine kuni 20', en: 'Subtraction within 20' },
  taxonomy: {
    subject: 'matemaatika',
    grade: 1,
    level: 'foundation',
    topic: 'math.subtraction.within_20',
  },
  prerequisites: ['math.addition_within_20'],
};

export const MATH_SUBTRACTION_WITHIN_100_SKILL: Skill = {
  id: 'math.subtraction_within_100',
  name: { et: 'Lahutamine kuni 100', en: 'Subtraction within 100' },
  taxonomy: {
    subject: 'matemaatika',
    grade: 3,
    level: 'intermediate',
    topic: 'math.subtraction.within_100',
  },
  prerequisites: ['math.subtraction_within_20'],
};

/**
 * Multiplication facts 1–5: 2. klass foundation. Factors 2 through 5,
 * 16 unique products — the canonical set Estonian põhikool ainekava expects
 * mastered by the end of grade 2.
 */
export const MATH_MULTIPLICATION_1_TO_5_SKILL: Skill = {
  id: 'math.multiplication_1_to_5',
  name: { et: 'Korrutustabel 1–5', en: 'Multiplication 1–5' },
  taxonomy: {
    subject: 'matemaatika',
    grade: 2,
    level: 'foundation',
    topic: 'math.multiplication.small_factors',
  },
};

/**
 * Full multiplication table 1–10: grade 3 target. Factors 2 through 10,
 * 81 unique products covering the full põhikool 3. klass curriculum goal.
 */
export const MATH_MULTIPLICATION_1_TO_10_SKILL: Skill = {
  id: 'math.multiplication_1_to_10',
  name: { et: 'Korrutustabel 1–10', en: 'Multiplication 1–10' },
  taxonomy: {
    subject: 'matemaatika',
    grade: 3,
    level: 'intermediate',
    topic: 'math.multiplication.full_table',
  },
  prerequisites: ['math.multiplication_1_to_5'],
};

export const MATH_GEOMETRY_SHAPES_SKILL: Skill = {
  id: 'math.geometry_shapes',
  name: { et: 'Geomeetrilised kujundid', en: 'Geometry shapes' },
  taxonomy: {
    subject: 'matemaatika',
    grade: 1,
    level: 'foundation',
    topic: 'math.geometry.shapes',
  },
};

export const MATH_PATTERN_SEQUENCES_SKILL: Skill = {
  id: 'math.pattern_sequences',
  name: { et: 'Mustrijadad', en: 'Pattern sequences' },
  taxonomy: {
    subject: 'matemaatika',
    grade: 1,
    level: 'foundation',
    topic: 'math.patterns.sequences',
  },
};

export const MATH_UNIT_CONVERSIONS_SKILL: Skill = {
  id: 'math.unit_conversions',
  name: { et: 'Ühikute teisendamine', en: 'Unit conversions' },
  taxonomy: {
    subject: 'matemaatika',
    grade: 3,
    level: 'foundation',
    topic: 'math.measurement.unit_conversions',
  },
};

export const MATH_COMPARE_NUMBERS_SKILL: Skill = {
  id: 'math.compare_numbers',
  name: { et: 'Arvude võrdlemine', en: 'Comparing numbers' },
  taxonomy: {
    subject: 'matemaatika',
    grade: 1,
    level: 'foundation',
    topic: 'math.numbers.comparison',
  },
};
