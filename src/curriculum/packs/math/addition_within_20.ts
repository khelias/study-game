/**
 * Content pack: addition facts within 20.
 * 1. klass foundation — sums 4..20, both "a + b = ?" and missing-addend variants.
 */

import type { ContentPack } from '../../types';
import type { ArithmeticSpec } from './types';
import { MATH_ADDITION_WITHIN_20_SKILL } from '../../skills/math';

const SPECS: readonly ArithmeticSpec[] = [
  { op: 'add_result', valueRange: [4, 20] },
  { op: 'add_missing', valueRange: [4, 20] },
];

export const MATH_ADDITION_WITHIN_20_PACK: ContentPack<ArithmeticSpec> = {
  id: 'math.addition_within_20',
  skillId: MATH_ADDITION_WITHIN_20_SKILL.id,
  locale: 'et',
  version: '1.0.0',
  title: { et: 'Liitmine kuni 20', en: 'Addition within 20' },
  items: SPECS,
};
