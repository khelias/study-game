# Word Database Analysis

## Overview
Comprehensive analysis of all words in `src/games/data.ts` for:
- Estonian spelling/grammar correctness
- Emoji-word matching clarity (for 6-8yo kids)
- Age appropriateness
- Duplicates and inconsistencies
- Missing high-frequency words

---

## Estonian Words (BASE_WORDS) - Analysis

### ✅ GOOD - Clear matches, correct Estonian

**Nature & Weather:**
- `PUU` 🌳 (tree) - Perfect
- `LILL` 🌸 (flower) - Perfect
- `LEHT` 🍃 (leaf) - Perfect
- `METS` 🌲 (forest) - Perfect
- `JÕGI` 🏞️ (river) - Perfect
- `MERI` 🌊 (sea) - Perfect
- `KIVI` 🪨 (stone) - Perfect
- `PILV` ☁️ (cloud) - Perfect
- `PÄIKE` ☀️ (sun) - Perfect
- `KUU` 🌙 (moon) - Perfect
- `TÄHT` ⭐ (star) - Perfect
- `LUMI` ❄️ (snow) - Perfect
- `JÄÄ` 🧊 (ice) - Perfect
- `TUUL` 🌬️ (wind) - Perfect
- `VIKERKAAR` 🌈 (rainbow) - Perfect
- `MARI` 🫐 (berry) - Good
- `SEEN` 🍄 (mushroom) - Good
- `ROHI` 🌱 (grass) - Good
- `VIHM` 🌧️ (rain) - Good

**Animals:**
- `KOER` 🐶 (dog) - Perfect
- `KASS` 🐱 (cat) - Perfect
- `HIIR` 🐭 (mouse) - Perfect
- `JÄNES` 🐰 (rabbit) - Perfect
- `REBANE` 🦊 (fox) - Perfect
- `KARU` 🐻 (bear) - Perfect
- `LÕVI` 🦁 (lion) - Perfect
- `TIIGER` 🐯 (tiger) - Perfect
- `PANDA` 🐼 (panda) - Perfect
- `ELEVANT` 🐘 (elephant) - Perfect
- `HOBUNE` 🐎 (horse) - Perfect
- `LAMMAS` 🐑 (sheep) - Perfect
- `KITS` 🐐 (goat) - Perfect
- `LEHM` 🐄 (cow) - Perfect
- `PART` 🦆 (duck) - Perfect
- `PINGVIIN` 🐧 (penguin) - Perfect
- `KONN` 🐸 (frog) - Perfect
- `KALA` 🐟 (fish) - Perfect
- `HAI` 🦈 (shark) - Perfect
- `KANA` 🐔 (chicken) - Good
- `KROKODILL` 🐊 (crocodile) - Good
- `KILPKONN` 🐢 (turtle) - Good
- `HAMSTER` 🐹 (hamster) - Good
- `KAAMEL` 🐫 (camel) - Good
- `HIRV` 🦌 (deer) - Good
- `PÕDER` 🫎 (elk/moose) - Good

**Food:**
- `SAI` 🍞 (white bread) - Good
- `LEIB` 🥖 (bread) - Good
- `JUUST` 🧀 (cheese) - Perfect
- `PIIM` 🥛 (milk) - Perfect
- `MUNA` 🥚 (egg) - Perfect
- `KARTUL` 🥔 (potato) - Perfect
- `PORGAND` 🥕 (carrot) - Perfect
- `TOMAT` 🍅 (tomato) - Perfect
- `KURK` 🥒 (cucumber) - Perfect
- `KIRSS` 🍒 (cherry) - Perfect
- `ÕUN` 🍎 (apple) - Perfect
- `PLOOM` 🍑 (plum) - Perfect
- `MAASIKAS` 🍓 (strawberry) - Perfect
- `SIDRUN` 🍋 (lemon) - Perfect
- `BANAAN` 🍌 (banana) - Perfect
- `APELSIN` 🍊 (orange) - Perfect
- `PIRN` 🍐 (pear) - Perfect
- `VÕI` 🧈 (butter) - Perfect
- `SUPP` 🍲 (soup) - Good
- `SALAT` 🥗 (salad) - Good
- `PRAAD` 🍖 (roast) - Good

**Home & Items:**
- `KODU` 🏡 (home) - Perfect
- `LAMP` 💡 (lamp) - Perfect
- `UKS` 🚪 (door) - Perfect
- `RAAMAT` 📖 (book) - Perfect
- `PLIIATS` ✏️ (pencil) - Perfect
- `VÄRV` 🎨 (paint) - Good
- `KÄÄRID` ✂️ (scissors) - Perfect
- `ARVUTI` 💻 (computer) - Perfect
- `TELEFON` 📱 (phone) - Perfect
- `EKRAAN` 🖥️ (screen) - Perfect
- `PRILLID` 👓 (glasses) - Perfect
- `KINDAD` 🧤 (gloves) - Perfect
- `MÜTS` 🧢 (cap) - Perfect
- `KELL` ⌚ (watch/clock) - Good (could be clearer)
- `PUSLE` 🧩 (puzzle) - Perfect
- `KLOTSID` 🧱 (blocks) - Perfect
- `LUSIKAS` 🥄 (spoon) - Perfect
- `NUGA` 🔪 (knife) - Perfect
- `AKEN` 🪟 (window) - Perfect
- `RIIUL` 📚 (shelf) - Perfect

**Transport:**
- `AUTO` 🚗 (car) - Perfect
- `BUSS` 🚌 (bus) - Perfect
- `TRAMM` 🚊 (tram) - Perfect
- `RONG` 🚆 (train) - Perfect
- `LAEV` ⛵ (ship) - Perfect
- `LENNUK` ✈️ (airplane) - Perfect
- `RATAS` 🚲 (bicycle) - Perfect

**People:**
- `EMA` 👩 (mother) - Perfect
- `ISA` 👨 (father) - Perfect
- `LAPS` 🧒 (child) - Perfect
- `ÕDE` 👧 (sister) - Good
- `VEND` 👦 (brother) - Good
- `VANAEMA` 👵 (grandmother) - Good
- `VANAISA` 👴 (grandfather) - Good

**Sports:**
- `PALL` ⚽ (ball) - Perfect
- `KORV` 🏀 (basketball) - Good
- `TENNIS` 🎾 (tennis) - Good
- `UISK` ⛸️ (skates) - Good
- `KELK` 🛷 (sled) - Good

**Colors:**
- `PUNANE` 🔴 (red) - Perfect
- `SININE` 🔵 (blue) - Perfect
- `ROHELINE` 🟢 (green) - Perfect
- `KOLLANE` 🟡 (yellow) - Perfect
- `VALGE` ⚪ (white) - Perfect
- `MUST` ⚫ (black) - Perfect
- `LILLA` 🟣 (purple) - Perfect
- `ORANŽ` 🟠 (orange) - Perfect

**Body Parts:**
- `PEA` 👤 (head) - Good (emoji is generic person, not ideal)
- `KÄSI` ✋ (hand) - Perfect
- `JALG` 🦵 (leg) - Perfect
- `SILM` 👁️ (eye) - Perfect
- `KÕRV` 👂 (ear) - Perfect
- `NINA` 👃 (nose) - Perfect
- `SUU` 👄 (mouth) - Perfect

---

### ⚠️ ISSUES FOUND

#### 1. Emoji Mismatches / Unclear for Kids

**Nature:**
- `PÕÕSAS` 🌿 (bush/shrub) - Emoji is generic plant, not clearly a bush
- `MÄGI` ⛰️ (mountain) - Good match
- `JÄRV` 🏝️ (lake) - Emoji is island, not lake! Should be 🌊 or 🏞️
- `LIIV` 🏖️ (sand) - Emoji is beach, not just sand (could confuse)
- `ÄIKE` 🌩️ (thunder) - Good match
- `LUMESADU` ❄️ (snowfall) - Same emoji as `LUMI`, could be clearer
- `TUISK` 🌨️ (blizzard) - Good match

**Animals:**
- `SEBRA` 🦓 (zebra) - Correct but uncommon word for Estonian kids
- `KAELKIRJAK` 🦒 (giraffe) - Correct but very long word
- `DRAAKON` 🐉 (dragon) - Good match
- `ÄMBLIK` 🕷️ (spider) - Good match
- `SIIL` 🦔 (hedgehog) - Good match
- `TIGU` 🐌 (snail) - Good match
- `HANI` 🪿 (goose) - Good match
- `KALKUN` 🦃 (turkey) - Good match
- `KAAMEL` 🐫 (camel) - Good match

**Food:**
- `PITSA` 🍕 (pizza) - Good
- `BURGER` 🍔 (burger) - Good
- `LIHA` 🥩 (meat) - Good
- `ARBUUS` 🍉 (watermelon) - Good
- `MARJAD` 🍇 (grapes/berries) - Good (plural form)
- `PÄHKEL` 🌰 (nut) - Good
- `KOMPVEK` 🍬 (candy) - Good
- `JÄÄTIS` 🍦 (ice cream) - Good
- `KÜPSIS` 🍪 (cookie) - Good
- `KOOK` 🍰 (cake) - Good
- `MESI` 🍯 (honey) - Good
- `KOHV` ☕ (coffee) - Good (but coffee for 6-8yo?)
- `TEE` 🫖 (tea) - Good
- `VIINAMARI` 🍇 (grape) - Duplicate of `MARJAD` concept
- `ANANASS` 🍍 (pineapple) - Good
- `MANGO` 🥭 (mango) - Good
- `KOOKOS` 🥥 (coconut) - Good
- `KREVETT` 🦐 (shrimp) - Good
- `KRABI` 🦀 (crab) - Good

**Home & Items:**
- `VOODI` 🛌 (bed) - Good
- `LAUD` 🪑 (table) - Emoji is chair, not table! Should be different emoji
- `TOOL` 🪑 (chair) - Good (but same emoji as `LAUD`)
- `KARDIN` 🪟 (curtain) - Emoji is window, not curtain
- `KAPP` 📦 (cabinet/closet) - Emoji is box, not cabinet
- `KOHVER` 🧳 (suitcase) - Good
- `STOPP` ⏱️ (stopwatch) - Good
- `ÕHUPALL` 🎈 (balloon) - Good
- `PÕRAND` 🪵 (floor) - Emoji is log/wood, not floor
- `LAGI` 🏠 (ceiling) - Emoji is house, not ceiling
- `SEIN` 🧱 (wall) - Good
- `KÖÖK` 🍳 (kitchen) - Emoji is frying pan, not kitchen
- `VANNITUBA` 🛁 (bathroom) - Emoji is bathtub, good
- `MAGAMISTUBA` 🛏️ (bedroom) - Emoji is bed, good
- `KIRJUTUSLAUD` 🪑 (desk) - Emoji is chair, not desk
- `TELEVISIOON` 📺 (TV) - Good
- `PADI` 🛏️ (pillow) - Emoji is bed, not pillow
- `TEKK` 🛌 (blanket) - Emoji is bed, not blanket

**Transport:**
- `PAAT` 🛶 (boat) - Good
- `KOPTER` 🚁 (helicopter) - Good
- `RULA` 🛹 (skateboard) - Good
- `MOPEED` 🛵 (moped) - Good
- `MOTORRATAS` 🏍️ (motorcycle) - Good
- `VEOK` 🚚 (truck) - Good
- `TROLLIBUSS` 🚎 (trolleybus) - Good

**People & Emotions:**
- `SÕBER` 🤝 (friend) - Emoji is handshake, not friend
- `ÕPETAJA` 🧑‍🏫 (teacher) - Good
- `ARST` 🧑‍⚕️ (doctor) - Good
- `POLITSEI` 👮 (police) - Good
- `PÄÄSTJA` 🧑‍🚒 (rescuer/firefighter) - Good
- `KOKK` 👨‍🍳 (cook) - Good
- `MUUSIK` 🎵 (musician) - Emoji is music note, not musician
- `TANTS` 💃 (dance) - Emoji is dancer, good
- `RÕÕM` 😄 (joy) - Good
- `KURBUS` 😢 (sadness) - Good
- `ÜLLATUS` 😮 (surprise) - Good
- `UNI` 😴 (sleep) - Good
- `ÕPETUS` 📚 (teaching/lesson) - Emoji is books, could be clearer
- `ÕPILANE` 👨‍🎓 (student) - Good

**Sports:**
- `MALE` ♟️ (chess) - Emoji is pawn, good
- `KAARDID` 🃏 (cards) - Good
- `MAADLUS` 🤼 (wrestling) - Good
- `VIBU` 🏹 (bow) - Good
- `JALGPALL` ⚽ (football/soccer) - Duplicate of `PALL`
- `KORVPALL` 🏀 (basketball) - Duplicate of `KORV`
- `VÕRKPALL` 🏐 (volleyball) - Good
- `JÕUSAAL` 🏋️ (gym) - Good
- `JOOKSMINE` 🏃 (running) - Good
- `UJUMINE` 🏊 (swimming) - Good

**School:**
- `KOOL` 🏫 (school) - Good
- `KLASS` 🏫 (class) - Same emoji as `KOOL`, could be different
- `KIRJUTUS` ✍️ (writing) - Good
- `NUMBRID` 🔢 (numbers) - Good
- `TÄHED` 🔤 (letters) - Good
- `ÕPIK` 📘 (textbook) - Good
- `MUUSIKA` 🎼 (music) - Good

#### 2. Estonian Grammar/Spelling Issues

**Potential Issues:**
- `LIIIVAL` / `LIIIVAS` (line 346) - Should be `LIIVAL` / `LIIVAS` (one I, not three)
- `KALLA` 🐚 (line 342) - This means "to call" or "shell" - likely should be `KARP` (shell) or `MERIKARBID` (seashells)
- `ORAV` 🐿️ (line 258) - Correct (squirrel), but not in BASE_WORDS, only in SCENE_DB
- `HUNT` 🐺 (line 258) - Correct (wolf), but not in BASE_WORDS, only in SCENE_DB
- `ROBOT` 🤖 (line 290) - Correct, but not in BASE_WORDS, only in SCENE_DB

#### 3. Age Appropriateness Concerns

**Too Complex for 6-8yo:**
- `VIKERKAAR` (rainbow) - 9 letters, very long
- `KAELKIRJAK` (giraffe) - 10 letters, very long
- `KIRJUTUSLAUD` (desk) - 12 letters, very long
- `TELEVISIOON` (TV) - 12 letters, very long
- `TROLLIBUSS` (trolleybus) - 10 letters, complex word
- `MOTORRATAS` (motorcycle) - 11 letters, complex word
- `VANNITUBA` (bathroom) - 9 letters
- `MAGAMISTUBA` (bedroom) - 11 letters
- `PÄIKESEVARI` (beach umbrella) - 11 letters (in SCENE_DB)
- `KALKULAATOR` (calculator) - 11 letters (in SCENE_DB)
- `KUSTUTI` (eraser) - 8 letters, but fine

**Questionable Content:**
- `KOHV` ☕ (coffee) - Not typically for 6-8yo
- `KURBUS` 😢 (sadness) - Abstract emotion, might be okay
- `ÜLLATUS` 😮 (surprise) - Abstract emotion, might be okay

#### 4. Duplicates / Redundancies

- `PALL` ⚽ and `JALGPALL` ⚽ - Same emoji, redundant
- `KORV` 🏀 and `KORVPALL` 🏀 - Same emoji, redundant
- `MARJAD` 🍇 and `VIINAMARI` 🍇 - Both grapes, redundant
- `LAUD` 🪑 and `TOOL` 🪑 - Same emoji (chair), confusing
- `KOOL` 🏫 and `KLASS` 🏫 - Same emoji, could be different
- `PÄIKE` ☀️ appears twice (line 105 and 198) - Duplicate entry
- `PILV` ☁️ appears twice (line 104 and 198) - Duplicate entry

#### 5. Missing High-Frequency Words

**Common words that should be included:**
- `ÕUNA` (apple - genitive, but `ÕUN` exists)
- `MAGUS` (sweet)
- `SOOLANE` (salty) - too long
- `VESI` 💧 (water) - **MISSING!**
- `ÕHK` (air) - abstract
- `TEGELANE` (character) - too long
- `MÄNG` (game) - **MISSING!**
- `MÄNGUASI` (toy) - too long
- `NUKU` (doll) - **MISSING!**
- `AUTO` exists, good
- `LENNUK` exists, good
- `RONG` exists, good

---

## English Words (BASE_WORDS_EN) - Analysis

### ✅ GOOD - Clear matches

Most English words are well-matched. Notable good ones:
- All 3-4 letter words are excellent
- 5-7 letter words are mostly good

### ⚠️ ISSUES

**Emoji Mismatches:**
- `SKY` 🌤️ (sky) - Emoji is partly cloudy, not just sky
- `WATER` 💧 (water) - Good
- `OCEAN` 🌊 (ocean) - Same emoji as `SEA`, redundant
- `RIVER` 🏞️ (river) - Good
- `WINTER` ❄️ (winter) - Same emoji as `SNOW`, could be different
- `SUMMER` ☀️ (summer) - Same emoji as `SUN`, could be different
- `SPRING` 🌱 (spring) - Good

**Missing Common Words:**
- `BIRD` exists ✅
- `FISH` exists ✅
- `DOG` exists ✅
- `CAT` exists ✅
- `CAR` - Missing (only `HOUSE` for transport)
- `TREE` exists ✅
- `FLOWER` exists ✅

---

## Scene Database (SCENE_DB) - Analysis

### Issues Found:

1. **Beach scene:**
   - `KALLA` 🐚 - Should be `KARP` (shell) or `MERIKARP` (seashell)

2. **Missing subjects in BASE_WORDS:**
   - `ORAV` 🐿️ (squirrel) - Only in forest scene, not in BASE_WORDS
   - `HUNT` 🐺 (wolf) - Only in forest scene, not in BASE_WORDS
   - `ROBOT` 🤖 - Only in room scene, not in BASE_WORDS

3. **Long words in scenes:**
   - `PÄIKESEVARI` (beach umbrella) - 11 letters, very long
   - `KALKULAATOR` (calculator) - 11 letters, very long

---

## Summary of Critical Issues

### HIGH PRIORITY FIXES:

1. **Emoji Mismatches:**
   - `JÄRV` 🏝️ → Should be 🌊 or 🏞️ (island vs lake)
   - `LAUD` 🪑 → Should be different emoji (table, not chair)
   - `KARDIN` 🪟 → Should be curtain emoji (if exists)
   - `KAPP` 📦 → Should be cabinet/closet emoji
   - `PÕRAND` 🪵 → Should be floor emoji (if exists)
   - `LAGI` 🏠 → Should be ceiling emoji (if exists)
   - `KÖÖK` 🍳 → Should be kitchen emoji (if exists)
   - `KIRJUTUSLAUD` 🪑 → Should be desk emoji
   - `PADI` 🛏️ → Should be pillow emoji
   - `TEKK` 🛌 → Should be blanket emoji
   - `SÕBER` 🤝 → Should be friend emoji (if exists)
   - `MUUSIK` 🎵 → Should be musician emoji
   - `KALLA` 🐚 → Should be `KARP` or `MERIKARP`

2. **Spelling Errors:**
   - `LIIIVAL` / `LIIIVAS` → Should be `LIIVAL` / `LIIVAS` (one I)

3. **Duplicates:**
   - Remove duplicate `PÄIKE` and `PILV` entries
   - Consider consolidating `PALL`/`JALGPALL` and `KORV`/`KORVPALL`

4. **Too Long for Age Group:**
   - Consider removing or gating: `VIKERKAAR`, `KAELKIRJAK`, `KIRJUTUSLAUD`, `TELEVISIOON`, `TROLLIBUSS`, `MOTORRATAS`, `MAGAMISTUBA`, `VANNITUBA`

5. **Missing High-Frequency Words:**
   - Add: `VESI` 💧 (water)
   - Add: `MÄNG` 🎮 (game)
   - Add: `NUKU` 🪆 (doll)
   - Add: `ÕUNA` 🍎 (apple - genitive form, or keep `ÕUN`)

---

## Recommendations

1. **Create separate word lists by game type:**
   - `WORD_CASCADE_DB` - Shorter, simpler words (3-6 letters max)
   - `WORD_BUILDER_DB` - Can include longer words (3-7 letters)
   - Keep shared words in `BASE_WORDS` for other games

2. **Fix emoji mismatches** - Prioritize words that appear frequently

3. **Remove or gate very long words** for starter profile

4. **Add missing common words** like `VESI`, `MÄNG`, `NUKU`

5. **Fix spelling errors** in scene database

6. **Consolidate duplicates** to reduce confusion
