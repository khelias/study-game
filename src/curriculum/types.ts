/**
 * Curriculum context — Skill, ContentPack, ContentItem
 *
 * See ADR-0001 (bounded contexts) and ROADMAP Phase 1. The curriculum layer owns
 * what is being learned (skills) and the data instances behind each skill
 * (content packs). Mechanics in src/games/ consume packs via bindings — they do
 * not import content files directly.
 */

/** Locale code. Matches the frontend i18n locales (`src/i18n/locales/`). */
export type LocaleCode = 'et' | 'en';

/** Opaque-ish identifiers. Plain strings keep JSON-serializability. */
export type SkillId = string;
export type ContentPackId = string;

/**
 * Skill — *what* is being learned. Persona-agnostic; the same skill can be
 * practiced by a child (with a childlike UX register) or an adult (adult
 * register), and by multiple mechanics.
 */
export interface Skill {
  id: SkillId;
  /** Human-readable name per locale. Short; used in selection UI. */
  name: Record<LocaleCode, string>;
  /**
   * Taxonomy placement. `grade` refers to Estonian põhikooli ainekava for
   * school-age content; `level` is a coarse adult/practice grouping. Both
   * optional — a skill can be content-first and place itself later.
   */
  taxonomy: {
    subject: string; // e.g. "matemaatika", "loodusõpetus", "astronoomia"
    grade?: number; // 1..6 for primary school content
    level?: 'foundation' | 'intermediate' | 'advanced';
    topic?: string; // free-form slug for grouping
  };
  /** Skills recommended before this one. IDs of other skills. */
  prerequisites?: SkillId[];
}

/**
 * ContentPack — *the data instances* backing a skill.
 *
 * `items` is a pack-specific payload type. Each mechanic that consumes a pack
 * knows the expected shape (see `getPackItems(packId)` at the call site).
 * Packs are JSON-serializable so they can later move to a content CMS
 * (ROADMAP Phase 4) without shape churn.
 */
export interface ContentPack<TItem> {
  id: ContentPackId;
  skillId: SkillId;
  locale: LocaleCode;
  /** Semantic version; bump when items change in a way that affects gameplay. */
  version: string;
  /** Optional human-readable title for debugging / future admin UI. */
  title?: Record<LocaleCode, string>;
  items: readonly TItem[];
}

/** Shape of an unknown pack — used by the registry where item type is erased. */
export type AnyContentPack = ContentPack<unknown>;
