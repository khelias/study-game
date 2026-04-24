/**
 * Curriculum context public API.
 *
 * Importing this module as a side effect (or via `registerAll`) registers every
 * known skill and content pack into the runtime registries. Mechanics should
 * import this once at bootstrap (e.g. from `src/games/registrations.ts`) so
 * that `getPackItems(...)` resolves without order-of-import surprises.
 */

import { contentPackRegistry, skillRegistry } from './registry';
import { ASTRONOMY_VISIBLE_CONSTELLATIONS_SKILL } from './skills/astronomy';
import { ASTRONOMY_VISIBLE_FROM_ESTONIA_PACK } from './packs/astronomy/visibleFromEstonia';
import { LANGUAGE_SYLLABIFICATION_SKILL } from './skills/language';
import { LANGUAGE_SYLLABIFICATION_ET_PACK } from './packs/language/syllables_et';
import { LANGUAGE_SYLLABIFICATION_EN_PACK } from './packs/language/syllables_en';
import {
  MATH_ADDITION_WITHIN_20_SKILL,
  MATH_ADDITION_WITHIN_100_SKILL,
  MATH_SUBTRACTION_WITHIN_20_SKILL,
  MATH_SUBTRACTION_WITHIN_100_SKILL,
  MATH_MULTIPLICATION_1_TO_5_SKILL,
  MATH_MULTIPLICATION_1_TO_10_SKILL,
} from './skills/math';
import { MATH_ADDITION_WITHIN_20_PACK } from './packs/math/addition_within_20';
import { MATH_ADDITION_WITHIN_100_PACK } from './packs/math/addition_within_100';
import { MATH_SUBTRACTION_WITHIN_20_PACK } from './packs/math/subtraction_within_20';
import { MATH_SUBTRACTION_WITHIN_100_PACK } from './packs/math/subtraction_within_100';
import { MATH_MULTIPLICATION_1_5_PACK } from './packs/math/multiplication_1_5';
import { MATH_MULTIPLICATION_1_10_PACK } from './packs/math/multiplication_1_10';

let registered = false;

export function registerAll(): void {
  if (registered) return;
  // Astronomy
  skillRegistry.register(ASTRONOMY_VISIBLE_CONSTELLATIONS_SKILL);
  contentPackRegistry.register(ASTRONOMY_VISIBLE_FROM_ESTONIA_PACK);
  // Language (one skill, locale-scoped packs)
  skillRegistry.register(LANGUAGE_SYLLABIFICATION_SKILL);
  contentPackRegistry.register(LANGUAGE_SYLLABIFICATION_ET_PACK);
  contentPackRegistry.register(LANGUAGE_SYLLABIFICATION_EN_PACK);
  // Math (one skill per focused pack; math_snake mechanic binds to each separately)
  skillRegistry.register(MATH_ADDITION_WITHIN_20_SKILL);
  skillRegistry.register(MATH_ADDITION_WITHIN_100_SKILL);
  skillRegistry.register(MATH_SUBTRACTION_WITHIN_20_SKILL);
  skillRegistry.register(MATH_SUBTRACTION_WITHIN_100_SKILL);
  skillRegistry.register(MATH_MULTIPLICATION_1_TO_5_SKILL);
  skillRegistry.register(MATH_MULTIPLICATION_1_TO_10_SKILL);
  contentPackRegistry.register(MATH_ADDITION_WITHIN_20_PACK);
  contentPackRegistry.register(MATH_ADDITION_WITHIN_100_PACK);
  contentPackRegistry.register(MATH_SUBTRACTION_WITHIN_20_PACK);
  contentPackRegistry.register(MATH_SUBTRACTION_WITHIN_100_PACK);
  contentPackRegistry.register(MATH_MULTIPLICATION_1_5_PACK);
  contentPackRegistry.register(MATH_MULTIPLICATION_1_10_PACK);
  registered = true;
}

// Side-effect registration on import.
registerAll();

export {
  contentPackRegistry,
  skillRegistry,
  getPackItems,
  getPackItemsForLocale,
} from './registry';
export type {
  Skill,
  SkillId,
  ContentPack,
  ContentPackId,
  AnyContentPack,
  LocaleCode,
} from './types';
