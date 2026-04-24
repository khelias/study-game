/**
 * Content pack: full multiplication table 1–10.
 * 3. klass target — factors 2 through 10, products 4..100.
 * Uses valueRange override so distractor spread generation has realistic
 * neighborhood (default level scaling caps at 50; products reach 100).
 */

import type { ContentPack } from '../../types';
import type { ArithmeticSpec } from './types';
import { MATH_MULTIPLICATION_1_TO_10_SKILL } from '../../skills/math';

const SPECS: readonly ArithmeticSpec[] = [
  { op: 'mul_result', factorRange: [2, 10], valueRange: [4, 100] },
  { op: 'mul_missing', factorRange: [2, 10], valueRange: [4, 100], unlockLevel: 3 },
];

export const MATH_MULTIPLICATION_1_10_PACK: ContentPack<ArithmeticSpec> = {
  id: 'math.multiplication_1_10',
  skillId: MATH_MULTIPLICATION_1_TO_10_SKILL.id,
  locale: 'et',
  version: '1.0.0',
  title: { et: 'Korrutustabel 1–10', en: 'Multiplication 1–10' },
  items: SPECS,
};
