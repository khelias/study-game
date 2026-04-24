/**
 * Content pack: addition facts within 100.
 * 3. klass intermediate — sums 10..100, both variants.
 */

import type { ContentPack } from '../../types';
import type { ArithmeticSpec } from './types';
import { MATH_ADDITION_WITHIN_100_SKILL } from '../../skills/math';

const SPECS: readonly ArithmeticSpec[] = [
  { op: 'add_result', valueRange: [10, 100] },
  { op: 'add_missing', valueRange: [10, 100] },
];

export const MATH_ADDITION_WITHIN_100_PACK: ContentPack<ArithmeticSpec> = {
  id: 'math.addition_within_100',
  skillId: MATH_ADDITION_WITHIN_100_SKILL.id,
  locale: 'et',
  version: '1.0.0',
  title: { et: 'Liitmine kuni 100', en: 'Addition within 100' },
  items: SPECS,
};
