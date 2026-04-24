/**
 * Content pack: subtraction facts within 100.
 * 3. klass intermediate — full result + missing variants up to 100.
 */

import type { ContentPack } from '../../types';
import type { ArithmeticSpec } from './types';
import { MATH_SUBTRACTION_WITHIN_100_SKILL } from '../../skills/math';

const SPECS: readonly ArithmeticSpec[] = [
  { op: 'sub_result', valueRange: [10, 100] },
  { op: 'sub_missing_minuend', valueRange: [10, 100] },
  { op: 'sub_missing_subtrahend', valueRange: [10, 100] },
];

export const MATH_SUBTRACTION_WITHIN_100_PACK: ContentPack<ArithmeticSpec> = {
  id: 'math.subtraction_within_100',
  skillId: MATH_SUBTRACTION_WITHIN_100_SKILL.id,
  locale: 'et',
  version: '1.0.0',
  title: { et: 'Lahutamine kuni 100', en: 'Subtraction within 100' },
  items: SPECS,
};
