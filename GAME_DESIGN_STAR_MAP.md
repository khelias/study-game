# Star Map – Design Review & How to Make It Better

## What Was Wrong

1. **Identify mode was broken**  
   The question “Which constellation is this?” showed only **dots** (stars), no connecting lines. Recognizing a constellation from a scatter of points is almost impossible.  
   **Fix (done):** In identify mode we now draw the constellation **shape** (solid lines) so the W of Cassiopeia, the Plough, etc. are recognizable.

2. **Repetition**  
   Same constellation could appear often; “hard” had only one (Draco).  
   **Fix (already in place):** Constellation pool is broadened by level (easy/medium/hard use 7 / 12 / 13 constellations) and the engine avoids repeating the same constellation in the recent-problem buffer.

3. **Duplicate feedback**  
   In-view “Complete!” / “Great job!” plus global toast.  
   **Fix (already in place):** Removed in-view completion text; only the global toast is used.

4. **UI**  
   Labels could be white-on-white; selection ring could escape the playable area.  
   **Fix (already in place):** Dark text for contrast; SVG clipped so the selection marker stays inside.

---

## How to Make It Better (Further Ideas)

### 1. Pedagogy & “Why it matters”

- **Folk names in the task**  
  e.g. “Connect the stars to form **the Plough** (Suur Vanker)” so the name is tied to the shape.
- **One-line fact after correct**  
  e.g. “You can see the Plough all year in Estonia!” or “Polaris is the North Star.” Use `starMapper.constellations.*.desc` or add short `factEt` / `factEn` in constellation data.
- **Optional “Find the star” warm-up**  
  e.g. “Tap Polaris” or “Tap the brightest star” before trace/build so kids learn one famous star per constellation.

### 2. Modes & Pacing

- **Rigid mode-by-level** (trace 1–3, build 4–6, identify 7–10, expert 11+) can feel repetitive. Options:
  - **Rotate modes earlier:** e.g. mix trace and build from level 1, add identify by level 5.
  - **Single primary mode:** e.g. “Trace then name” in one problem (trace the shape → then choose its name from 2–3 options) so every round has both doing and recognizing.
- **Identify as “name the shape”**  
  Now that the shape is visible (lines + stars), identify mode is a proper “match shape to name” task. You could add a short instruction: “Look at the shape. Which constellation is it?”

### 3. Juice & Feel

- **Constellation reveal on complete**  
  When the last correct line is drawn, briefly highlight the full shape (e.g. lines glow or draw in with a short animation) before calling `onAnswer(true)`.
- **Per-line feedback (optional)**  
  When the player draws a line that is part of the solution, subtle positive cue (e.g. small sound or line color shift) without revealing the full solution; wrong line could stay neutral or very soft “try another” so it stays forgiving.
- **Star field atmosphere**  
  Slightly larger touch targets for stars, or a soft pulse on the “next suggested” star in trace mode (e.g. one star gently highlighted to suggest the next connection).

### 4. Simplify If Needed

- **Two core activities**  
  (1) **Connect** (trace / build / expert) and (2) **Name** (identify). If four modes feel scattered, merge into e.g. “Connect the stars” (trace/build/expert) and “Which constellation?” (identify), and alternate or choose by level.
- **Fewer modes, clearer goals**  
  e.g. “Trace” (with guide) and “Build” (no guide) plus “Identify” (see shape, pick name). Expert can be “Build with extra distractors” instead of a separate label.

### 5. Content & Variety

- **Season / visibility**  
  Constellation data already has `season`. Optionally filter or weight by “visible now” (e.g. circumpolar + current season) so the sky feels relevant.
- **Short descriptions in UI**  
  Use existing `starMapper.constellations.*.desc` in a tooltip or one line under the name after a correct answer.

---

## Summary

- **Critical fix:** Identify mode now shows the constellation **shape** (lines + stars), so “Which constellation is this?” is answerable.
- **Already improved:** Repetition, duplicate popups, and UI contrast/clipping.
- **Next steps to make it better:** Use folk names and one-line facts, soften mode pacing, add a bit of juice (reveal on complete, optional per-line feedback), and optionally simplify to “Connect” + “Name” with clearer instructions.
