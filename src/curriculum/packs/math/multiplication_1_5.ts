/**
 * Content pack: multiplication facts with factors 1–5.
 *
 * Foundation pack for Estonian põhikool 2. klass. Narrow, focused drill set:
 * the only operations are `mul_result` (always) and `mul_missing` (from level
 * 3), both capped at factor range [2, 5]. 16 unique products (2×2=4 through
 * 5×5=25). The `factorRange` override prevents the engine's level-scaling
 * from spilling into factors >5 at higher levels.
 */

import type { ContentPack } from '../../types';
import type { ArithmeticSpec } from './types';
import { MATH_MULTIPLICATION_1_TO_5_SKILL } from '../../skills/math';

const SPECS: readonly ArithmeticSpec[] = [
  { op: 'mul_result', factorRange: [2, 5] },
  { op: 'mul_missing', unlockLevel: 3, factorRange: [2, 5] },
];

export const MATH_MULTIPLICATION_1_5_PACK: ContentPack<ArithmeticSpec> = {
  id: 'math.multiplication_1_5',
  skillId: MATH_MULTIPLICATION_1_TO_5_SKILL.id,
  locale: 'et',
  version: '1.0.0',
  title: {
    et: 'Korrutustabel 1–5',
    en: 'Multiplication 1–5',
  },
  items: SPECS,
};
