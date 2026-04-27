# Roadmap

**Status:** Draft, 2026-04-23. Living document — revise as reality informs the plan.

This roadmap turns the project from a **polished front-end showcase** into an **architecture reference project with a real product behind it**: a learning platform usable by both children (Estonian curriculum, grades 1–6) and adults (general knowledge, languages, refresher content), unified by a single persona-agnostic domain model.

The document is organized as:

1. **Vision & positioning** — the north star.
2. **Current state** — honest inventory of what exists today.
3. **Target domain model** — bounded contexts the work converges toward.
4. **Phases 0–6** — sequential, each with scope, non-goals, and exit criteria.
5. **Open decisions** — questions to resolve before certain phases start.

---

## 1. Vision & positioning

Two goals carried together:

- **Product goal.** A learning platform where the same engine serves a 7-year-old practicing multiplication tables and an adult practicing Estonian river names. One app, one account model, two UX registers.
- **Reference goal.** A codebase that demonstrates, at a level an enterprise architect would accept, the decoupling of four concerns that commercial ed-tech routinely conflates:
  - **Skill** (what is being learned — e.g. multiplication 1–10, Estonian vocabulary A1)
  - **Mechanic** (how the player interacts — Math Snake, Balance Scale, Word Master)
  - **Content** (the data instances — which words, which facts, which problems)
  - **Meta-progression** (the collection / economy layer — theme unlocks, wallet, achievements)

Today all four are welded together inside the `games/` folder. The roadmap's backbone is separating them cleanly, then building real concerns (sync, auth, observability, content CMS) on top.

**What this is not:**

- Not a competitor to Duolingo, Lingvist, or Lumosity on scale.
- Not a SaaS with growth targets. The differentiator is **Estonian cultural and curricular content** plus **family + self-use bridge** — niche by design.
- Not an excuse to ship a hobby app with enterprise scaffolding. Every architectural layer must justify its existence against a real user concern. If it doesn't, it doesn't ship.

---

## 2. Current state

### What is solid

- Pure engine layer (`src/engine/`): `rng.ts`, `adaptiveDifficulty.ts`, `progression.ts`, `achievements.ts`, `stats.ts` — deterministic, testable, UI-independent. 76% coverage.
- Declarative game registry — 18 games registered via `src/games/registrations.ts`, `src/games/registry.ts`. Extension pattern proven.
- TypeScript strict mode (`noUncheckedIndexedAccess`, no implicit `any`), ESLint with `no-explicit-any`, Prettier enforced in CI, colocated `__tests__/` throughout.
- State split: persistent `gameStore` + session `playSessionStore` in `src/stores/`.
- Persistence adapter pattern already scaffolded (`src/services/persistence/`: `apiAdapter.ts` + `localStorageAdapter.ts` behind `persistenceService.ts`).
- i18n scaffolding live (`src/i18n/locales/{et,en}.ts`).
- Monetization scaffolding live (`src/monetization/` — feature flags, tiers, hooks, no active gates).
- CI/CD: GitHub Actions quality gate (lint / typecheck / format-check / unit / E2E / build) plus self-hosted-runner deploy → `games.khe.ee/study/`. See `.github/workflows/ci.yml` + `deploy.yml`.
- Playwright E2E safety net: four smoke scenarios covering menu load, profile switching, game navigation, balance-scale answer → stats.
- Gameplay screen refactored into container + pure view + modal host (`src/features/gameplay/GameScreen.tsx` + `GameScreenView.tsx` + `GameScreenModalHost.tsx`) with heavy side-effect orchestration extracted into named hooks (`useMathSnakeMovement`, `useGameScreenEffects`, `useUnlockedAchievementCopies`).
- ADRs recorded: [ADR-0001](docs/adr/0001-bounded-contexts.md) (five bounded contexts), [ADR-0002](docs/adr/0002-learner-profile.md) (persona-agnostic learner identity).
- `ARCHITECTURE.md` documents current shape; supersession by ADRs is explicit where relevant.
- Curriculum context scaffolded (`src/curriculum/`) with `Skill`, `ContentPack<TItem>`, and singleton registries. 9 skills + 11 packs live: `astronomy.visible_constellations` (single-pack), `language.syllabification` (multi-locale: et + en), seven math skills (`addition_within_20`, `addition_within_100`, `subtraction_within_20`, `subtraction_within_100`, `multiplication_1_to_5`, `multiplication_1_to_10`, `geometry_shapes`), and Shape Dash / Shape Shift geometry content. Each snake math skill has one focused pack; `math_snake` engine (one mechanic) powers six bindings collapsed into one mechanic-level menu card ("NUMBRIMADU") via `MechanicCard` + `PackPickerModal`. `shape_dash` is bound to `MATH_GEOMETRY_SHAPES_PACK`; `shape_shift` is bound to `SHAPE_SHIFT_PUZZLES_PACK`; their generators own placement/shuffling/runtime state while the question/puzzle banks live in curriculum. `GameConfig` gained `mechanic?: string`; a parallel `MECHANICS` map (`MechanicConfig`) in `data.ts` defines mechanic-level display (title, theme, emoji). `MenuScreen` groups bindings sharing a mechanic into one card; tapping opens a pack picker listing the bindings with per-binding level/highscore/difficulty. `GameRegistryEntry` carries optional `skillIds` + `contentPackId`. Three lookup shapes exist: `getPackItems(id)` for single-pack, `getPackItemsForLocale(skillId, locale)` for multi-locale, and **spec-pool packs** for procedural content (math DSL). `GameConfig` also has optional `visualTheme` so bindings sharing a component can diverge visually (cosmic theme on multiplication variants).

### What is debt

- **`Profile` is difficulty-tiered, not persona-typed.** `src/types/profile.ts` models an age/level bracket (`levelStart`, `difficultyOffset`, emoji). ADR-0002 defines the target `LearnerProfile` shape but the code has not migrated — this is Phase 1 work.
- **Skill ≡ Mechanic ≡ Content welding.** Remaining content files are still tied to specific games: `shapeShiftGrid.ts`, `sentenceTranslations.ts`, plus several inline generator branches in `src/games/generators.ts` (constellations migrated in Slice 1, syllables in Slice 2, math_snake's equation pool in Slice 3, Shape Dash geometry in Slice 5, Shape Shift puzzles in Slice 6 — see §7). Three pack shapes now proven: static single-pack, multi-locale, procedural DSL. Adding a new math skill (e.g. `math.division_facts` or `math.multiplication_6_10`) is already a pack + one binding, zero engine change — `math_snake` is the first mechanic to fully reach Phase 1's "one mechanic, many skills" end-state.
- **No server.** `apiAdapter.ts` is a TODO stub. No user identity beyond localStorage. No cross-device sync. No shared content distribution.
- **No observability.** `src/utils/errorHandler.ts` comment: _"In production, you could send errors to error tracking service"_.
- **No collection / economy layer.** Stars exist as an earned counter; there is no spending target, no inventory, no unlock catalog, no theme application system.
- **Monetization scaffolding has never been exercised.** Feature flags are defined, nothing gates on them. Plumbing without a fixture.

---

## 3. Target domain model

Five bounded contexts. Each should own its types, tests, and (eventually) server tables. No cross-context imports except via explicit, narrow interfaces.

```
┌─────────────────────────────────────────────────────────────────┐
│                        Learner Context                          │
│  LearnerProfile   —  id, displayName, ageHint?, persona,        │
│                      skillMastery[], preferences                │
│  SkillMastery     —  skillId, level, lastPlayed, rollingStats   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Curriculum Context                          │
│  Skill            —  id, name, taxonomy (grade/level/subject),  │
│                      prerequisites[], compatibleMechanics[]     │
│  ContentPack      —  id, skillId, locale, version, items[]      │
│  ContentItem      —  skill-specific payload (e.g. {a:7,b:8,op}) │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Gameplay Context                           │
│  GameMechanic     —  id, supportedSkillTypes[], view component  │
│  PlaySession      —  profileId, mechanicId, skillId, contentRef,│
│                      startedAt, events[], outcome               │
│  AdaptiveEngine   —  (skillMastery, sessionEvents) → difficulty │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Meta-progression Context                     │
│  Wallet           —  stars, (future: gems, subscription credit) │
│  Inventory        —  ownedThemeIds[], ownedCosmeticIds[]        │
│  UnlockCatalog    —  themes, cosmetics, with price + rarity     │
│  Achievement      —  (unchanged from today)                     │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Entitlement Context                         │
│  Tier             —  free | premium | family                    │
│  FeatureFlag      —  (existing monetization/ scaffolding)       │
│  Paywall          —  rule → allow | block | deferred            │
└─────────────────────────────────────────────────────────────────┘
```

Key point: a `Game` is no longer a primary entity. What the registry registers is a **binding** — `{ mechanic, compatibleSkills, defaultContentPack }`. The same Math Snake mechanic serves multiplication for a second-grader and percentages for an adult, purely by swapping skill + content.

---

## 4. Phases

Each phase is **self-contained**: stopping after any of them leaves the project in a better state than before. No phase depends on a later phase.

### Phase 0 — Foundation & debt paydown

**Goal.** Put the project in a shape where Phase 1's refactor is safe.

**Scope.**

- Decompose `GameScreen.tsx` into `GameScreenContainer` (state wiring) + `GameScreenView` (pure props) + one modal-host component. Target <200 LOC per file.
- Add explicit `typecheck` npm script (`tsc --noEmit`), run in CI before build.
- Add Prettier, enforce via ESLint plugin; single pass over repo.
- Create `docs/adr/` directory. Write **ADR-0001: Bounded contexts of the learning platform** (the diagram in §3 above, the reasoning behind it, alternatives rejected).
- Write **ADR-0002: Persona-agnostic learner model** — deprecate age-tier `Profile` in favor of `LearnerProfile` with optional `ageHint` and persona-driven UX register.
- Add Playwright (or Cypress) with three E2E flows: pick a profile, play one round of a representative game, earn stars. These become the refactor safety net.

**Non-goals.**

- No domain-model code changes yet. Only ADRs and safety net.
- No backend work.

**Done when.**

- CI runs `lint`, `typecheck`, `test`, `e2e`, `build` — all green.
- ADR-0001 and ADR-0002 merged.
- `GameScreen.tsx` split and passing all tests at the new structure.

**Estimate.** 1–2 weeks calendar (evening work).

---

### Phase 1 — Skill × Mechanic × Content decoupling

**Goal.** Introduce the `Skill` and `ContentPack` entities; migrate existing games so that content is data, not code.

**Scope.**

- Define types for `Skill`, `ContentPack`, `ContentItem` in a new `src/curriculum/` directory.
- Migrate existing inline content (`constellations.ts`, `puzzles.ts`, `syllableWords.ts`, `shapeShiftGrid.ts`, `sentenceTranslations.ts`, `generators.ts`) into ContentPacks, versioned, locale-tagged.
- Introduce `LearnerProfile` and `SkillMastery` types. Adaptive difficulty in `engine/adaptiveDifficulty.ts` re-reads from `SkillMastery`, not from the old difficulty-tier profile.
- `registrations.ts` entries become bindings: each game declares `{ mechanic, skillIds[], defaultContentPackId }`. Runtime picks the pack.
- Update `ARCHITECTURE.md` section _Game Data_ to describe the new model. Leave a migration note pointing to ADR-0001.
- Tests: every `Skill` must have at least one golden-path test asserting that its content flows into at least one mechanic without error.

**Non-goals.**

- No backend. Content packs ship as JSON files imported at build time.
- No new games. No adult content yet. No theme collection yet.
- No account system — `LearnerProfile` stays in localStorage.

**Done when.**

- Adding a new skill (e.g. `multiplication_1_10`) to the platform is a data-only change: create a ContentPack JSON, reference it in one registration binding. No engine or component code touched.
- All 18 existing games still playable, still passing their tests.
- Coverage on engine holds or improves.

**Risks.**

- Scope creep. The temptation will be to "finally fix" unrelated code while touching every file. Resist — that's Phase 0's job.
- Migration loss. A mistranslation from the old data shape to `ContentPack` breaks a game silently. Mitigated by the E2E tests added in Phase 0.

**Estimate.** 3–4 weeks calendar.

---

### Phase 2 — Backend, auth, sync

**Goal.** Server-backed learner profiles with cross-device sync; the `apiAdapter.ts` stub becomes real.

**Scope.**

- **Stack decision required** (see §5 — Open decisions). Default recommendation: backend in Java/Spring Boot with Postgres — matches the author's day-job expertise and gives the reference project its "real" spine. Alternative: Node/TS for single-language stack.
- Server modeling only the Learner, Curriculum (read-only from packs), and Gameplay contexts at this stage. Meta-progression stays local until Phase 3.
- Auth: magic-link email + JWT session. Token refresh on session start. No passwords; no social login in MVP. OIDC provider (Keycloak / Authentik / Zitadel) deferred unless we need SSO.
- Sync model: last-write-wins per field, server clock authoritative. Offline writes queue in `localStorageAdapter` and flush on reconnect. `persistenceService.ts` already hides this.
- Deploy: Dockerized, added to khe-homelab `services/apps/games/` stack. Postgres as a container, not shared with Nextcloud/Immich (isolation). Exposed via NPM + Cloudflare Tunnel at `study.khe.ee` (or `study-api.khe.ee` for the API specifically).
- Observability baseline: structured logs via OpenTelemetry log exporter, `/actuator/health` (or equivalent) wired into Uptime Kuma.

**Non-goals.**

- No real-time multiplayer.
- No CRDT / fancy conflict resolution. Last-write-wins is explicitly sufficient for a single-player learning game.
- No content CMS. Content packs still ship in the client bundle at this stage.

**Done when.**

- A learner profile created on one device is visible on a second device within seconds of login.
- Losing the backend (deliberately stopped) leaves the app playable offline; reconnection syncs.
- Server exposes a typed OpenAPI (or equivalent) contract versioned in the repo.
- New service in khe-homelab is monitored (Uptime Kuma + autoheal healthcheck) and backed up (`backup.sh`).

**Risks.**

- Auth infrastructure is the rabbit hole. Pick magic-link, enforce the scope, ship.
- The Postgres schema for `SkillMastery` with rolling stats can grow unbounded. Cap rolling windows; plan for archival early.

**Estimate.** 3–4 weeks calendar.

---

### Phase 3 — Collection & economy (themes)

**Goal.** Deliver the meta-progression the product vision depends on: earn stars, unlock themes, apply them to the app.

**Scope.**

- New bounded context: `src/meta/` with `Wallet`, `Inventory`, `UnlockCatalog`, `ThemeCatalog`.
- Theme application layer: a ThemeProvider that swaps CSS custom properties (color palette, background art reference, optional particle/decoration slot). Themes are data, not code.
- Asset pipeline: themes bundled as assets in `public/themes/<theme-id>/` for MVP. CDN + dynamic loading only if bundle size becomes a real problem.
- Shop UX: a gated screen where a learner spends stars on themes. Introduce rarity and cost tiers, not for monetization yet but to make collection meaningful.
- Launch with 6–8 themes: 3 "kid" aesthetics (e.g. meri, metsaloomad, kosmos), 3 "adult" aesthetics (e.g. puhas minimalism, kohvi-sooja, skandinaavia), 2 seasonal or unlock-only.
- Server-side: `Inventory` syncs via Phase 2 backend. `Wallet` is authoritative server-side to prevent trivial tampering.

**Non-goals.**

- No real payment. Themes are earned, not bought with money, until Phase 6.
- No user-generated themes.
- No theme trading or social features.

**Done when.**

- A learner can earn, spend, own, and apply themes. Inventory persists and syncs.
- Theme changes are instant and don't require a reload.
- Adding a theme is a content change (JSON + asset drop), not a code change.

**Estimate.** 2–3 weeks calendar.

---

### Phase 4 — Content CMS & curriculum alignment

**Goal.** Decouple content authorship from release cadence; align core skill packs to the Estonian national curriculum (põhikooli ainekava) for grades 1–6.

**Scope.**

- Server-side content storage — packs versioned, profiles pin a pack version, upgrade is explicit. Built-in editor UI is a stretch; JSON-schema-validated files served from the backend are sufficient to start.
- Taxonomy: map every `Skill` to one or more curriculum nodes (subject → grade → topic → subtopic). Schema documented, not invented per pack.
- Delivery: packs fetched over HTTP with caching, not bundled in the client. Offline mode keeps last-fetched pack available.
- Migration: the packs shipped in Phase 1 are the seed content for Phase 4's server-side catalog.
- New skill coverage target: at least one complete pack per mandatory primary-school subject area (matemaatika, eesti keel, loodusõpetus, inimeseõpetus) at grade 1–3 level, pilot only.

**Non-goals.**

- No external authoring tool integration (Contentful, Strapi etc.) — out of scope for a homelab reference.
- No school-facing admin (teachers, classrooms, reports) — that's a separate product.
- No AI-generated content at this stage (Phase 6+ stretch).

**Done when.**

- Releasing new content (new skill or new pack version) is a server-side change only; clients pick it up on next session start.
- At least one curriculum-aligned pack per target subject, peer-reviewed against the ainekava document.

**Estimate.** 3–4 weeks calendar.

---

### Phase 5 — Adult UX register & content

**Goal.** Activate the platform's second persona. Adult users are first-class citizens of the same codebase, not a parallel app.

**Scope.**

- Second UX register (theme + typography + motion scale), chosen by persona on profile creation. Mechanics identical; chrome different.
- Adult-targeted content packs: Eesti jõed, Eesti ajalugu (tähtsamad sündmused), grammatika (käänded, pöörded), vanasõnad, üldteadmised. Start small — two or three well-crafted packs beat ten shallow ones.
- Content selection UI for adults: no "choose a game" menu; instead "what do you want to practice today?" — entry point is the `Skill`, mechanic is the engine's call.
- Session cadence for adults: shorter, sharper, spaced-repetition-flavored — longer intervals between the same skill, smaller sessions. Implementation is a parameter of `AdaptiveEngine`, not a new engine.

**Non-goals.**

- No separate product brand. Same app, same domain.
- No corporate / tööandja features (dashboards, team leaderboards). Consumer-first.

**Done when.**

- A freshly created adult profile completes a meaningful first session in under 3 minutes, with no UI text that reads as infantilizing.
- At least three adult-targeted content packs live.

**Estimate.** 3–4 weeks calendar.

---

### Phase 6 — Production hardening & paywall reality

**Goal.** Make the project genuinely production-grade. Activate the monetization scaffolding in a form that is showcase-truthful, not performative.

**Scope.**

- **Observability.** OpenTelemetry end-to-end (frontend → backend → database), metrics exported to a local Prometheus, traces to a local Tempo/Jaeger, logs to Loki. Dashboards in the existing Grafana. If there is no existing Grafana, installing one is part of this phase.
- **Error tracking.** Self-hosted GlitchTip or similar. Route frontend + backend errors.
- **Paywall activation.** Pick one feature flag from `monetization/config.ts` to actually gate (e.g. `multiple_profiles` or `export_data`). Implement the gate end-to-end with a mock payment flow (no real Stripe charge). Document the full path in an ADR.
- **Rate limiting + abuse protection.** Per-profile session caps, per-IP request rate limiting at the reverse proxy.
- **Backup story.** Postgres logical dump nightly into the existing `backup.sh` tarball. Restore-from-backup tested at least once.
- **Performance budget.** Documented budget for first paint and time-to-playable. Monitored.
- **Public architecture page.** A public `/architecture` route on the site rendering the ADRs and a live system diagram. This is where the project stops being "a game" and starts being "a reference project with a game in front of it".

**Done when.**

- An outage of the Postgres container is caught by Uptime Kuma and announced to Telegram within minutes.
- A frontend runtime exception in production shows up in the error tracker with source maps and user context (pseudonymous).
- The paywall blocks what it says it blocks; the mock payment flow correctly toggles the feature.
- The project can be shown to an interviewer as a reference project and survive scrutiny.

**Estimate.** 3–5 weeks calendar.

---

## 5. Open decisions

These must be resolved before the phase that depends on them. Each will become an ADR.

- **Backend language & framework.** Java/Spring Boot vs. Node/TypeScript vs. Kotlin/Ktor. Decision needed before Phase 2 kickoff. Trade-off: Java matches author's expertise and enterprise-reference credibility; TS removes the context-switch tax and shares types with the frontend.
- **Auth provider.** Magic-link homegrown vs. Keycloak vs. Authentik vs. Zitadel. Decision needed before Phase 2 kickoff. Trade-off: homegrown is 500 lines and fine for MVP, but an external IdP is the more credible reference choice.
- **Content source of truth.** JSON-in-git vs. Postgres-as-CMS vs. a headless CMS (Strapi, Directus). Decision needed before Phase 4. Trade-off: JSON-in-git is version-controlled and diffable but needs a release cycle; Postgres-as-CMS decouples content from deploys.
- **Monetization realism.** Payment-less mock forever, or wire real Stripe in test mode, or real billing with a single €1 tier. Decision needed before Phase 6. Showcase truthfulness vs. operational complexity.
- **Estonian curriculum taxonomy source.** Riigi Teataja ainekava PDFs scraped, HITSA API if one exists, or a custom in-repo taxonomy file peer-reviewed against the PDF. Decision needed before Phase 4.

---

## 6. What this roadmap deliberately excludes

Named so they don't creep in quietly:

- Multiplayer / versus modes.
- Teacher / classroom / school-facing features.
- Parental dashboards as a first-class surface (a read-only "progress summary" is fine; a full parental control panel is a different product).
- Native mobile apps. PWA only.
- AI-generated educational content. The adventure-engine's `proxy/` patterns could eventually be borrowed, but only as an authoring assist, not as runtime content generation.
- Social features (leaderboards, friends, sharing).
- Cross-platform save (e.g. import from Duolingo).

---

## 7. Change log

- **2026-04-23** — Initial draft. Five bounded contexts and six phases proposed. Awaiting decision on backend stack and auth provider before Phase 2.
- **2026-04-23** — Phase 0 landed. ADR-0001 + ADR-0002 written; Prettier + typecheck tooling added; CI quality gate (`ci.yml`) wired; Playwright E2E safety net (four scenarios) shipped; `GameScreen.tsx` decomposed into container + view + modal host with three new named hooks. §2 "What is solid / debt" updated to match. Docs cleanup: deleted obsolete `GAME_UI_REDESIGN.md`, `BATTLELEARN_COMPARISON.md`, `NEXT_GAMES_STRATEGY.md`, `shape-dash-collision-analysis.md`; moved `QUICK_START_GUIDE.md` → `docs/shared-components.md`.
- **2026-04-24** — Phase 1 Slice 1 landed: curriculum context + first content-pack migration. New `src/curriculum/` with `Skill`, `ContentPack<TItem>`, `skillRegistry`, `contentPackRegistry`, `getPackItems()`. Constellations migrated from `src/games/constellations.ts` into `ASTRONOMY_VISIBLE_FROM_ESTONIA_PACK` bound to the `astronomy.visible_constellations` skill. `star_mapper` generator + `StarMapperView` now resolve constellations via the pack registry. `GameRegistryEntry` gained optional `skillIds` + `contentPackId`; the `star_mapper` binding is the first to populate them. 12 new unit tests for the curriculum layer; all 370 unit tests + 4 E2E smoke tests + prod build green.
- **2026-04-24** — Phase 1 Slice 2 landed: syllabification migration surfaces the multi-locale pack pattern. New skill `language.syllabification` bound to two locale-scoped packs (`LANGUAGE_SYLLABIFICATION_ET_PACK`, `LANGUAGE_SYLLABIFICATION_EN_PACK`) under the same skill. Registry gained `findBySkillAndLocale(skillId, locale)` and `getPackItemsForLocale<T>(skillId, locale)` with a "any pack for the skill" fallback for new-locale rollout. `syllable_builder` generator now resolves its word list through `getPackItemsForLocale` using the current `getLocale()`. 7 new unit tests (377 total), lint + E2E + prod build green.
- **2026-04-24** — Phase 1 Slice 3 landed: math_snake migration + first "one mechanic, many skills" binding + v2 cosmic theme. `ArithmeticSpec` DSL (op + optional `unlockLevel`/`factorRange`/`valueRange` overrides) added to `src/types/game.ts`. `math_snake` engine's hard-coded level-gated `generateEquation` refactored to consume a pack spec-pool. New `GameConfig.visualTheme` field lets bindings sharing a component diverge visually.
- **2026-04-24** — Phase 1 Slice 3b landed: snake family expanded + legacy removed + critical routing bugs fixed. The "backward-compat" `math_snake` registration (and its mixed-basics pack) was removed — it was added in 3a on an assumption the user never stated. Replaced with 6 focused snake cards, one per math skill: `addition_snake` (within 20, green), `addition_big_snake` (within 100, teal), `subtraction_snake` (within 20, orange), `subtraction_big_snake` (within 100, pink), `multiplication_snake` (×1–5, cosmic indigo), `multiplication_big_snake` (×1–10, cosmic purple). Engine gained `isSnakeGameType(gameType)` helper + `sub_missing_minuend` range bounds scaled by pack `valueRange` (prev: hardcoded `Math.min(15, …)` / `Math.min(20, …)` caps prevented a "within 100" pack from producing realistic facts). Audit found TWO critical gameType-routing bugs (`useMathSnakeMovement` + `useAnswerHandler`/`answerHandler`) that hardcoded `=== 'math_snake'` — all new snake games would have been broken (no movement, wrong score routing). Fixed by switching to the suffix helper throughout. 4 new pack tests + 2 regression fixes (tests reference the suffix-match rather than literal `math_snake`). All 387 unit tests + 4 E2E + prod build green. See ARCHITECTURE.md §"Snake mechanic audit" for open v2 improvement opportunities (mastery tracking, theme-aware snake colors, session summary screen, wraparound-fairness, menu-crowding).
- **2026-04-25** — Phase 1 Slice 4: mechanic-level menu grouping. `GameConfig` gained `mechanic?: string`; new `MechanicConfig` interface + `MECHANICS` map in `data.ts` (first entry: `math_snake`). All 6 snake bindings declare `mechanic: 'math_snake'`. `MenuScreen` groups bindings sharing a mechanic into one `MechanicCard`; tapping opens `PackPickerModal` listing the bindings with per-binding level/highscore/difficulty. Reduces math category from 6 cards to 1; pattern extends to any future multi-binding mechanic. i18n strings: `mechanics.math_snake`, `menuSpecific.choosePack`, `menuSpecific.packCount_*` (et + en). Pre-stages Phase 5 adult UX ("entry point is the Skill, mechanic is the engine's call") — same binding data, different `groupBy`. 389 unit + build + lint + prettier green.
- **2026-04-25** — Phase 1 Slice 3c landed: snake medium-severity audit follow-up. Five snake mechanic improvements shipped together as one slice because they share the same code surface (engine + view + answer hook + session store): (1) **Growth model** — math apple no longer grows the snake on consumption (`moveMathSnake`); only `resolveMathSnakeAnswer` grows it (+2 correct, 0 wrong). No more "farming" length by guessing. (2) **Walls kill** — `wrapPosition` removed; out-of-bounds returns `collision: true`. (3) **Streak-based grid expansion** — every 5 correct math answers grow the grid by 1 (cap at 10×10) via `expandSnakeGrid` invoked from `useAnswerHandler`. New constants `SNAKE_MIN_GRID_SIZE`, `SNAKE_MAX_GRID_SIZE`, `SNAKE_STREAK_MILESTONE`. (4) **Theme-aware palette** — `VisualTheme.snakePalette: 'emerald' | 'teal' | 'orange' | 'pink' | 'indigo' | 'purple'` drives the head, body, tail, glow ring, `+N` text via the `SNAKE_PALETTES` token table; each of six bindings picks its family. (5) **End-of-session summary** — new `SnakeSessionSummary` component on `GameOverScreen` shows max length, accuracy, best streak, and top-3 hardest facts (most wrong attempts). Per-fact tracking lives in `playSessionStore.snakeSessionStats.factHistory` — mini-precursor to the Phase 1 mastery tracker. Bonus: `+N` overlay now reflects actual length delta (`+1` apple, `+2` correct answer; was hardcoded `+1`). 2 new engine tests (wall collision + `expandSnakeGrid` cap) plus an updated math-apple growth test — 389 unit + 4 E2E + prod build + lint + prettier all green.
- **2026-04-27** — Phase 1 Slice 5 landed: Shape Dash geometry moved into curriculum. New `math.geometry_shapes` skill + `MATH_GEOMETRY_SHAPES_PACK` hold checkpoint questions, shape-gate prompts, localized options, and shape labels; `shape_dash` registration now declares `skillIds` + `contentPackId`. `Generators.shape_dash` now resolves the pack via `getPackItems()` and owns only run generation, obstacle placement, shuffling, and gate placement. While adding generator tests, a gate-placement regression surfaced: the old 200px gate-distance rule exceeded normal obstacle gaps, so some deterministic runs generated zero shape gates. The gate buffer is now 110px and covered by a generator regression test.
- **2026-04-27** — Phase 1 Slice 6 landed: Shape Shift puzzle data moved into curriculum. `src/games/puzzles.ts` became `src/curriculum/packs/geometry/shapeShiftPuzzles.ts` with `SHAPE_SHIFT_PUZZLES_PACK` bound to the existing `math.geometry_shapes` skill. `shape_shift` registration now declares `skillIds` + `contentPackId`; `Generators.shape_shift` resolves puzzles via `getPackItems()` and keeps only mode selection, recent-puzzle avoidance, piece initialization, decoy generation, and shuffling. Added pack-shape, registry, and generator tests for the binding.
