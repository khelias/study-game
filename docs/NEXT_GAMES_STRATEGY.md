# Next Games Strategy: Analysis & Roadmap

This document provides a thorough analysis of Smart Games’ current lineup, gaps, and a prioritized roadmap. It incorporates:
- **Educational gaps** (memory, counting, sorting, rhyme, listening, shapes, money, etc.)
- **Adult profile mode** (new audience and difficulty tier)
- **Platformer / rhythm / reflex games** (Geometry Dash–style, “one more try” engagement)

---

## 1. Current State Summary

### 1.1 Categories & Games

| Category   | Description              | Games |
|-----------|---------------------------|--------|
| **Language** | Words, letters, sentences | Word Master, Word Cascade, Syllable Master, Sentence Detective, Letter Detective (5) |
| **Math**     | Calculations, measurements | Number Snake, Units, Number Compare, BattleLearn, Scales, Clock Game (6) |
| **Logic**    | Patterns, programming     | Pattern Train, Robo Path, Star Mapper, Shape Shift (4) |
| **Memory**   | Memory games              | Math Memory (1) |

**Total: 16 games.** Most are turn-based or level-by-level; one arcade-style (Word Cascade).

### 1.2 Profile System

- **ProfileType**: `'starter' | 'advanced'` (see `src/types/game.ts`).
- **Starter (5+)**: Preschooler, `levelStart: 1`, `difficultyOffset: 0`.
- **Advanced (7+)**: School child, `levelStart: 3`, `difficultyOffset: 2`.
- **Persistence**: `gameStore` persists `profile` and `levels[profile][gameId]`; each profile has its own progression.
- **Gating**: `GAME_CONFIG[].allowedProfiles` controls which profile(s) see each game (e.g. Scales & Clock Game are `['advanced']` only).

### 1.3 Game Mechanics Overview

- **Turn-based / quiz**: Word Master, Letter Detective, Sentence Detective, Number Compare, Units, Scales, Clock Game, BattleLearn, Pattern Train, Shape Shift, Star Mapper.
- **Real-time / arcade**: Word Cascade (letters falling), Number Snake (move & collect).
- **Sequencing / programming**: Robo Path.
- **Memory / matching**: Math Memory.

There is **no** dedicated reflex/rhythm/platformer game yet.

---

## 2. Gap Analysis

### 2.1 Educational Gaps (by category)

**Memory**
- Only one game (Math Memory). Missing: classic **picture/emoji pairs**, **sequence memory** (“repeat the order”), **“what was missing?”**.

**Math**
- No **pure counting** (“how many?” / count objects). BattleLearn has some; a short counting game would round out number sense for 5–6yo.
- No **money** game (coins, “how much?”). Optional but common in kids’ apps.
- **Geometry**: Shape Shift is spatial; no **“name the shape”** or **sides/corners** for early geometry.

**Language**
- No **rhyme / same sound** (phonics).
- No **listening-first** (“hear the word, choose the answer”) for literacy and accessibility.

**Logic**
- No **sorting / classification** (e.g. animals vs plants, by size/color).
- No **simple maze / pathfinding** (Robo Path is programming; a “get from A to B” maze is lighter).
- No **“which one is different?”** / visual discrimination (Letter Detective is letter-based; a visual version would add variety).

**New category (optional)**
- **Science / nature**: e.g. living vs non-living, seasons, simple facts. Optional; can be folded into Logic or a future category.

### 2.2 Engagement & Genre Gaps

**Platformer / rhythm / reflex (Geometry Dash–style)**
- **Why it matters**: High “one more try” engagement, clear difficulty curve, and satisfaction from execution (timing, reflexes). Fits “boring is a bug” and can attract older players and adults.
- **Fit in Smart Games**:
  - **Option A – Pure reflex**: Runner/platformer with obstacles; success = motor skills + persistence. No explicit curriculum; still “smart” via planning and pattern recognition.
  - **Option B – Hybrid**: Short reflex sections interrupted by micro-quizzes (e.g. “answer to open gate” or “dodge by choosing correct answer”). Keeps educational layer.
  - **Option C – Rhythm**: Hit notes to the beat; difficulty = speed and pattern complexity. Can be themed (e.g. syllables, counting beats).
- **Technical**: New category (e.g. **“Arcade”** or **“Reflex”**), real-time loop, collision/timing, possibly level editor or predefined levels. More engine work than a quiz-style game but reuses existing UI/audio/progression.

**Summary**
- **Educational**: Prioritize 1–2 memory games, 1 counting game, then sorting, rhyme/listening, shapes, money, maze, visual discrimination as capacity allows.
- **Engagement**: Add at least one **platformer/rhythm/reflex** game (flagship for “adult” and “one more try”); can start with a simple runner or rhythm prototype.

---

## 3. Adult Profile Mode

### 3.1 Goals

- **Audience**: Parents, teachers, older kids, or anyone wanting harder content and a less “child-only” feel.
- **Content**: Same or more games, with higher baseline difficulty and/or adult-only titles (e.g. platformer, harder logic).
- **UX**: Optional “adult” label (e.g. “Teen & Adult”), less juvenile copy; no need to change core pedagogy for existing games.

### 3.2 Design Options

| Aspect | Option 1 – Difficulty tier | Option 2 – Full separation |
|--------|----------------------------|-----------------------------|
| **Profile** | Add `ProfileType: 'adult'` | Same |
| **Level start** | e.g. `levelStart: 5`, `difficultyOffset: 4` (harder from first level) | Same, or per-game overrides |
| **Game visibility** | Most games `['starter','advanced','adult']`; some `['advanced','adult']` or `['adult']` only | Adult-only games (e.g. platformer) in `allowedProfiles: ['adult']` or `['advanced','adult']` |
| **Copy / UI** | Add `profiles.adult` in i18n (label “Teen & Adult” or “Adult”), same menu pattern | Same |
| **Progression** | Separate `levels['adult']` (already supported by `buildDefaultLevels()` and store) | Same |

**Recommendation**: Add **one new profile** `adult` with higher `levelStart` and `difficultyOffset`. New games (e.g. platformer) can be `['adult']` or `['advanced','adult']` initially; existing games can add `'adult'` to `allowedProfiles` so adults see the full catalog at harder default difficulty.

### 3.3 Implementation Checklist (Adult Profile)

- **Types**: `src/types/game.ts` – extend `ProfileType` to `'starter' | 'advanced' | 'adult'`.
- **Data**: `src/games/data.ts` – add `PROFILES.adult` (label, desc, levelStart, difficultyOffset, emoji); add `'adult'` to each `GAME_CONFIG[].allowedProfiles` where appropriate.
- **Store**: `src/stores/gameStore.ts` – `buildDefaultLevels()` already iterates `Object.keys(PROFILES)`; no change if PROFILES includes `adult`. Ensure migration or default `levels.adult` if loading old persisted state.
- **Generators**: Each generator that takes `profile: ProfileType` should handle `'adult'` (e.g. same as `'advanced'` but with `profileMeta('adult').difficultyOffset`). Prefer a small helper so “adult = advanced+” in one place where possible.
- **Menu**: `src/features/menu/MenuScreen.tsx` – profile selector already loops over `PROFILES`; third chip will appear. i18n: add `profiles.adult.label`, `profiles.adult.desc`, and any menu subtitle for adult.
- **Tests**: Update any hardcoded `ProfileType` or profile lists; add one smoke test that `levels['adult']` exists and a game with `allowedProfiles: ['adult']` is visible when profile is adult.

---

## 4. Prioritized Roadmap

### Phase 1 – Foundation (Adult profile + 1–2 educational fill-ins)

1. **Adult profile**
   - Add `adult` to `ProfileType`, `PROFILES`, and `allowedProfiles` for existing games.
   - Implement checklist in §3.3; verify progression and menu.

2. **One new memory game**
   - **Picture Pairs** (classic memory): match emoji/picture pairs. Reuses assets (e.g. WORD_DB emojis); new view + generator (grid, pairs, reveal state). Good for all profiles.

3. **One counting or sorting game**
   - **Counting**: “How many X?” with 1–10 (or 1–20 for advanced/adult). Simple generator + StandardGameView-style or custom view.
   - **Sorting**: “Put in the right group” (e.g. animals vs plants, by color). One game, clear pedagogy.

**Outcome**: Adult mode live; Memory category has 2 games; Math or Logic gains one strong new mechanic.

### Phase 2 – Platformer / rhythm (flagship for engagement)

4. **One reflex/platformer or rhythm game**
   - **Scope**: Minimal viable product (e.g. single lane runner with obstacles, or simple rhythm “hit on beat”).
   - **Category**: New category **“Arcade”** (or “Reflex”) in `CATEGORIES` and `data.ts`.
   - **Profile**: Start as `['advanced', 'adult']` or `['adult']` only; can open to advanced later.
   - **Mechanics**: Real-time loop, input (tap/key), collision or timing scoring. Optional: link to curriculum (e.g. “answer to pass” gates) in a later iteration.
   - **Progression**: Levels or “endless” with difficulty ramping; reuse stars/hearts and level-up strategy where it fits.

**Outcome**: One Geometry Dash–like or rhythm game in the catalog; different engagement profile and strong hook for adult mode.

### Phase 3 – Broaden educational + optional second arcade

5. **More educational**
   - Second memory variant (sequence or “what was missing?”).
   - Rhyme or listening-first language game.
   - “Name the shape” or sides/corners (geometry).
   - Money game (optional).
   - Sorting (if not done in Phase 1).

6. **Optional**
   - Second arcade game (e.g. rhythm if first was runner, or vice versa).
   - Visual “which is different?” game.
   - Simple maze (pathfinding).

---

## 5. Platformer / Rhythm – Design Notes

### 5.1 Why Geometry Dash–style fits

- **Clear failure/success**: One mistake → restart (or life lost). Easy to understand.
- **Difficulty curve**: Levels or speed increase; “one more try” loop.
- **Low reading load**: Can be icon/pattern-based; good for accessibility and quick sessions.
- **Replayability**: Same level, improve time or consistency; optional leaderboards later.

### 5.2 Possible implementations (by effort)

| Idea | Type | Educational link | Effort |
|------|------|------------------|--------|
| **Obstacle runner** | Platformer/reflex | Optional: “answer to open gate” | Medium (collision, levels) |
| **Rhythm taps** | Rhythm | Syllables per beat, or counting beats | Medium (beat detection, patterns) |
| **Endless dodge** | Reflex | None | Lower (single lane, spawn obstacles) |
| **Pattern runner** | Reflex + pattern | “Jump when shape matches” (reuse Pattern Train logic) | Medium |

### 5.3 Technical alignment with current stack

- **Engine**: New module under `src/engine/` for collision/timing/beat (pure logic; testable).
- **State**: `playSessionStore` for run state; `gameStore` for level/unlocks and stars.
- **Views**: New view component(s); reuse `GameHeader`, audio, and Framer Motion for juice.
- **Levels**: Start with a few hand-authored levels or a simple procedural generator; level format in `src/games/` (e.g. `platformerLevels.ts` or similar).

---

## 6. Summary Table: What to Focus On Next

| Priority | Item | Rationale |
|----------|------|-----------|
| 1 | **Adult profile** | Unlocks new audience and justifies harder/arcade content; small, contained change. |
| 2 | **One new memory game** (e.g. Picture Pairs) | Balances Memory category; reuses assets; clear pedagogy. |
| 3 | **One counting or sorting game** | Fills math/logic gap; good for 5+ and 7+. |
| 4 | **One platformer/rhythm/reflex game** | Differentiation, “one more try” engagement, flagship for adult mode. |
| 5 | **Rhyme or listening game** | Strengthens language; accessibility. |
| 6 | **More memory variants, shape name, money, maze** | As capacity allows; round out catalog. |

---

## 7. Document History

- **Created**: 2025-02 – Strategy and roadmap for next games, adult profile, and platformer/rhythm direction.
