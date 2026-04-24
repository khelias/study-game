/**
 * Content pack: subtraction facts within 20.
 * 1. klass foundation — differences in range [4..20], result + both missing variants.
 */

import type { ContentPack } from '../../types';
import type { ArithmeticSpec } from './types';
import { MATH_SUBTRACTION_WITHIN_20_SKILL } from '../../skills/math';

const SPECS: readonly ArithmeticSpec[] = [
  { op: 'sub_result', valueRange: [4, 20] },
  { op: 'sub_missing_minuend', valueRange: [4, 20] },
  { op: 'sub_missing_subtrahend', valueRange: [5, 20] },
];

export const MATH_SUBTRACTION_WITHIN_20_PACK: ContentPack<ArithmeticSpec> = {
  id: 'math.subtraction_within_20',
  skillId: MATH_SUBTRACTION_WITHIN_20_SKILL.id,
  locale: 'et',
  version: '1.0.0',
  title: { et: 'Lahutamine kuni 20', en: 'Subtraction within 20' },
  items: SPECS,
};
