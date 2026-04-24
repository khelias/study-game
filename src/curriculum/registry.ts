/**
 * Curriculum registry — singletons for Skill and ContentPack.
 *
 * Packs and skills register themselves on import (see src/curriculum/index.ts).
 * Mechanics look up packs by id via `getContentPack` and cast the item type
 * they know to be correct — the item type is erased in the registry because
 * different packs carry different payloads.
 */

import type {
  AnyContentPack,
  ContentPack,
  ContentPackId,
  LocaleCode,
  Skill,
  SkillId,
} from './types';

class SkillRegistry {
  private skills = new Map<SkillId, Skill>();

  register(skill: Skill): void {
    if (this.skills.has(skill.id)) {
      console.warn(`[SkillRegistry] Skill "${skill.id}" already registered. Overwriting.`);
    }
    this.skills.set(skill.id, skill);
  }

  get(id: SkillId): Skill | undefined {
    return this.skills.get(id);
  }

  has(id: SkillId): boolean {
    return this.skills.has(id);
  }

  getAll(): Skill[] {
    return Array.from(this.skills.values());
  }

  clear(): void {
    this.skills.clear();
  }
}

class ContentPackRegistry {
  private packs = new Map<ContentPackId, AnyContentPack>();

  register<TItem>(pack: ContentPack<TItem>): void {
    if (this.packs.has(pack.id)) {
      console.warn(`[ContentPackRegistry] Pack "${pack.id}" already registered. Overwriting.`);
    }
    this.packs.set(pack.id, pack as AnyContentPack);
  }

  get(id: ContentPackId): AnyContentPack | undefined {
    return this.packs.get(id);
  }

  has(id: ContentPackId): boolean {
    return this.packs.has(id);
  }

  getAll(): AnyContentPack[] {
    return Array.from(this.packs.values());
  }

  getBySkill(skillId: SkillId): AnyContentPack[] {
    return this.getAll().filter((p) => p.skillId === skillId);
  }

  /**
   * Find the pack bound to a skill for a specific locale.
   * Use when a single skill has one pack per locale (e.g. syllabification:
   * same skill, Estonian and English content).
   */
  findBySkillAndLocale(skillId: SkillId, locale: LocaleCode): AnyContentPack | undefined {
    return this.getBySkill(skillId).find((p) => p.locale === locale);
  }

  clear(): void {
    this.packs.clear();
  }
}

export const skillRegistry = new SkillRegistry();
export const contentPackRegistry = new ContentPackRegistry();

/**
 * Retrieve a pack's items cast to the mechanic's expected item type.
 *
 * The caller guarantees type correctness — this is the same contract every
 * binding has today via its direct import of the right data file. The registry
 * only enforces existence.
 *
 * @throws if the pack is not registered.
 */
export function getPackItems<TItem>(id: ContentPackId): readonly TItem[] {
  const pack = contentPackRegistry.get(id);
  if (!pack) {
    throw new Error(`[curriculum] Content pack "${id}" is not registered`);
  }
  return pack.items as readonly TItem[];
}

/**
 * Retrieve pack items for a skill + locale combo. Falls back to any pack of the
 * skill if the locale match is missing (so new locales don't break mechanics
 * during content rollout).
 *
 * @throws if no pack is registered for the skill.
 */
export function getPackItemsForLocale<TItem>(
  skillId: SkillId,
  locale: LocaleCode,
): readonly TItem[] {
  const exact = contentPackRegistry.findBySkillAndLocale(skillId, locale);
  if (exact) return exact.items as readonly TItem[];
  const fallback = contentPackRegistry.getBySkill(skillId)[0];
  if (!fallback) {
    throw new Error(`[curriculum] No content pack registered for skill "${skillId}"`);
  }
  return fallback.items as readonly TItem[];
}
