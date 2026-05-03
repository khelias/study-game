# Smart Games

Learning platform built around the idea that a single engine can serve both a 7-year-old practicing multiplication and an adult practicing Estonian river names — one codebase, one account model, two UX registers. Today the catalog is 18 small games in Estonian curriculum areas (reading, math, logic, memory) with adaptive difficulty. The next milestones are decoupling skill/mechanic/content, adding a backend, and activating an adult UX register. See [`ROADMAP.md`](./ROADMAP.md) for phases and scope; see [`ARCHITECTURE.md`](./ARCHITECTURE.md) for current structure; see [`docs/adr/`](./docs/adr/) for the bounded-context and learner-profile decisions that supersede parts of the older architecture as they land.

Live at [games.khe.ee/study/](https://games.khe.ee/study/).

## Contents

- [Games](#games)
- [Running locally](#running-locally)
- [Testing & quality gates](#testing--quality-gates)
- [Deployment](#deployment)
- [Internationalization](#internationalization)
- [Further reading](#further-reading)

## Games

The platform ships 18 games across four categories. Each game is registered declaratively in `src/games/registrations.ts`; mechanic + content + skill are currently coupled in `src/games/` (Phase 1 work splits them — see ROADMAP §4).

| Category     | Games                                                                             |
| ------------ | --------------------------------------------------------------------------------- |
| **Language** | Word Master, Word Cascade, Syllable Master, Sentence Detective, Letter Detective  |
| **Math**     | Math Snake, Unit Conversion, Size Compare, Balance Scale, Clock Game, BattleLearn |
| **Logic**    | Pattern Train, Robo Path, Star Mapper, Shape Shift, Shape Dash                    |
| **Memory**   | Math Memory, Picture Pairs                                                        |

Game visibility per profile is controlled by `GAME_CONFIG[].allowedProfiles` in `src/games/data.ts`. Two profiles ship today: `starter` (ages 5+) and `advanced` (1st grade+). An `adult` persona is the target of ROADMAP Phase 5 and ADR-0002 — the current age-tier `Profile` model is deprecated-in-design but not yet migrated in code.

### Adaptive difficulty

The engine nudges effective level based on recent accuracy and response time, not raw level selection:

- **Harder:** accuracy > 80% **and** ≥ 3 consecutive correct → effective level rises.
- **Easier:** accuracy < 50% **or** ≥ 3 consecutive wrong → effective level falls.

Currently per-profile-per-game. ADR-0002 retargets this to per-skill via `SkillMastery` in Phase 1.

### Progression & economy

- **Levels** are performance-earned, never purchased. Level-up requires correct answers + 80%+ accuracy; requirements scale (5 → 7 → 10 → 12 → 15+).
- **Stars** are awarded on level-up (1–3 base, scaled by level up to 2.5×, plus perfect-clear bonus). They are spent on hearts (10 stars = 1 heart, max 5).
- **Hearts** are a global resource; wrong answers cost one; zero hearts ends the session.
- **Achievements** are cosmetic unlocks tracked in `src/engine/achievements.ts`.

All state persists in LocalStorage via `gameStore`, which uses an explicit
Zustand persist version and migrates legacy payloads for stars, hearts, levels,
and favourite games. Per-session state (problem, score, level progress,
notifications) lives in `playSessionStore`. Neither syncs across devices yet —
Phase 2 work.

## Running locally

Requires **Node.js 24+** and **npm**.

```bash
git clone <your-fork-url>
cd khe-study
npm install
npm run dev       # http://localhost:5173
```

Production build:

```bash
npm run build     # output: dist/
npm run preview   # serve dist/ locally
```

## Testing & quality gates

The quality gate is enforced in [`.github/workflows/ci.yml`](.github/workflows/ci.yml): lint, dead-code check, typecheck, format check, unit tests with core coverage thresholds, build, and a separate Playwright E2E job. Every commit to `main` must pass all of these.

| Command                 | Purpose                                                                     |
| ----------------------- | --------------------------------------------------------------------------- |
| `npm run lint`          | ESLint 9 + typescript-eslint                                                |
| `npm run lint:dead`     | Knip unused file/dependency check with intentional scaffolding allowlist    |
| `npm run typecheck`     | `tsc --noEmit` (strict mode, `noUncheckedIndexedAccess`, no implicit `any`) |
| `npm run format:check`  | Prettier check (run `npm run format` to write)                              |
| `npm run test`          | Vitest in watch mode                                                        |
| `npm run test:run`      | Vitest once                                                                 |
| `npm run test:coverage` | Vitest with V8 coverage, used in CI for core engine/state/data services     |
| `npm run test:e2e`      | Playwright E2E (headless Chromium)                                          |
| `npm run test:e2e:ui`   | Playwright interactive UI mode                                              |
| `npm run build`         | Vite production build                                                       |

Current state: 25 unit test files, 392 tests on the latest stable Vitest major. Coverage thresholds are baseline floors for `src/engine`, `src/stores`, `src/games`, `src/curriculum`, and `src/services/persistence`; broad UI shells are covered by focused component tests and Playwright instead of the global unit coverage percentage. Playwright smoke suite covers menu load, profile switching, game navigation, and a balance-scale round including the answer → stats recording path. The E2E suite is the refactor safety net required by ROADMAP Phase 0.

## Deployment

GitHub Actions deploys `main` to `games.khe.ee/study/` via a self-hosted runner on the homelab VM ([`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)): build on the runner, then `cp -r dist/* /srv/data/games/study/` into the directory the khe-homelab nginx container already serves. No runtime server component today. Backend + sync is ROADMAP Phase 2.

## Internationalization

Two locales ship: Estonian (default) and English. See [`src/i18n/README.md`](src/i18n/README.md) for the type-safe translation system. All user-facing strings go through `useTranslation`; direct literals in JSX are a lint-adjacent smell.

## Further reading

- [`ROADMAP.md`](./ROADMAP.md) — living product & technical roadmap (phases, non-goals, open decisions).
- [`ARCHITECTURE.md`](./ARCHITECTURE.md) — current code structure; bounded-context target in [`docs/adr/0001-bounded-contexts.md`](docs/adr/0001-bounded-contexts.md).
- [`docs/adr/`](./docs/adr/) — Architecture Decision Records.
- [`docs/shared-components.md`](./docs/shared-components.md) — cookbook for `GameProblemModal` and `GameStatsBar`.
- [`src/i18n/README.md`](src/i18n/README.md), [`src/monetization/README.md`](src/monetization/README.md) — module-level docs.
