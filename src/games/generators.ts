import { ALPHABET, WORD_DB, WORD_DB_EN, SCENE_DB, PROFILES } from './data';
import { SYLLABLE_WORDS } from './syllableWords';
import { CONSTELLATIONS, getConstellationsForLevel } from './constellations';
import { getRandom, uid } from '../engine/rng';
import { getLocale } from '../i18n/index';
import { generateSentence, getSceneName } from './sentenceTranslations';
import { createMathSnakeProblem } from '../engine/mathSnake';
import type { 
  RngFunction, 
  ProfileType, 
  BalanceScaleProblem,
  WordBuilderProblem,
  WordCascadeProblem,
  PatternProblem,
  SentenceLogicProblem,
  MemoryMathProblem,
  RoboPathProblem,
  TimeMatchProblem,
  SyllableBuilderProblem,
  LetterMatchProblem,
  UnitConversionProblem,
  CompareSizesProblem,
  StarMapperProblem,
  Star,
  Constellation,
  GeneratorFunction,
  SceneAnchor,
  SceneSubject,
  LetterObject,
  PatternRuleId
} from '../types/game';

const profileMeta = (profileId: ProfileType) => PROFILES[profileId] || PROFILES.starter;

// Helper function to check if a word contains diacritical marks
function hasDiacritics(word: string): boolean {
  return /[ŠŽÕÄÖÜ]/i.test(word);
}

// Helper function to apply letter case based on level
function applyLetterCase(word: string, level: number, rng: RngFunction): string {
  // Level 1-3: All uppercase (KASS)
  if (level <= 3) {
    return word.toUpperCase();
  }
  // Level 4-6: Title case (Kass) to ease into lowercase
  if (level <= 6) {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  }
  // Level 7-9: All lowercase (kass)
  if (level <= 9) {
    return word.toLowerCase();
  }
  // Level 10+: Mixed case (KaSs, KoEr)
  return word.split('').map((char, idx) => {
    // First letter is always uppercase
    if (idx === 0) return char.toUpperCase();
    // Random case for other letters
    return rng() > 0.5 ? char.toUpperCase() : char.toLowerCase();
  }).join('');
}

// Helper function to add distractor letters
function addDistractorLetters(
  correctLetters: LetterObject[], 
  count: number, 
  language: string, 
  rng: RngFunction
): LetterObject[] {
  if (count === 0) return correctLetters;
  
  const distractors: LetterObject[] = [];
  const correctCharsRaw = correctLetters.map((l) => l.char);
  const hasUpper = correctCharsRaw.some((c) => c !== c.toLowerCase());
  const hasLower = correctCharsRaw.some((c) => c !== c.toUpperCase());
  const isTitleCase = correctCharsRaw.length > 0
    && correctCharsRaw[0] !== undefined
    && correctCharsRaw[0] === correctCharsRaw[0].toUpperCase()
    && correctCharsRaw.slice(1).every((c) => c === c.toLowerCase());
  const caseStyle: 'upper' | 'lower' | 'title' | 'mixed' = !hasLower
    ? 'upper'
    : !hasUpper
    ? 'lower'
    : isTitleCase
    ? 'title'
    : 'mixed';
  
  // Define visually and phonetically similar letters
  const similarLetters: Record<string, string[]> = language === 'en' ? {
    // English similar letters
    'A': ['E', 'O', 'H'],
    'B': ['D', 'P', 'R'],
    'C': ['G', 'O', 'Q'],
    'D': ['B', 'O', 'P'],
    'E': ['F', 'A', 'B'],
    'F': ['E', 'T', 'P'],
    'G': ['C', 'O', 'Q'],
    'H': ['N', 'K', 'A'],
    'I': ['L', 'J', 'T'],
    'J': ['I', 'L', 'T'],
    'K': ['H', 'R', 'X'],
    'L': ['I', 'T', 'J'],
    'M': ['N', 'W', 'H'],
    'N': ['M', 'H', 'R'],
    'O': ['Q', 'C', 'G'],
    'P': ['B', 'D', 'R'],
    'Q': ['O', 'C', 'G'],
    'R': ['P', 'B', 'K'],
    'S': ['Z', 'C', 'G'],
    'T': ['F', 'I', 'L'],
    'U': ['V', 'W', 'Y'],
    'V': ['U', 'Y', 'W'],
    'W': ['M', 'V', 'U'],
    'X': ['K', 'Y', 'Z'],
    'Y': ['V', 'U', 'T'],
    'Z': ['S', 'X', 'N']
  } : {
    // Estonian similar letters
    'A': ['Ä', 'E', 'O'],
    'Ä': ['A', 'E', 'Ö'],
    'E': ['A', 'Ä', 'I'],
    'I': ['E', 'L', 'J'],
    'O': ['Ö', 'A', 'Q'],
    'Ö': ['O', 'Ü', 'Õ'],
    'U': ['Ü', 'V', 'Y'],
    'Ü': ['U', 'Ö', 'Y'],
    'Õ': ['O', 'Ö', 'A'],
    'K': ['G', 'H', 'R'],
    'G': ['K', 'Q', 'C'],
    'P': ['B', 'R', 'D'],
    'B': ['P', 'D', 'R'],
    'T': ['D', 'L', 'F'],
    'D': ['T', 'B', 'P'],
    'S': ['Z', 'Š', 'C'],
    'Š': ['S', 'Z', 'Ž'],
    'Z': ['S', 'Ž', 'Š'],
    'Ž': ['Z', 'Š', 'S'],
    'L': ['I', 'T', 'J'],
    'R': ['K', 'P', 'N'],
    'M': ['N', 'W', 'H'],
    'N': ['M', 'R', 'H']
  };
  
  const correctChars = correctCharsRaw.map((c) => c.toUpperCase());
  const availableLetters = language === 'en' 
    ? 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
    : ALPHABET;
  
  for (let i = 0; i < count; i++) {
    let distractor: string = availableLetters[0] ?? 'A';
    
    // Try to find a visually/phonetically similar letter
    if (correctChars.length > 0 && rng() > 0.3) {
      const targetChar = correctChars[Math.floor(rng() * correctChars.length)];
      if (!targetChar) {
        // Fallback to random letter
        const randomLetter = availableLetters[Math.floor(rng() * availableLetters.length)];
        if (randomLetter) {
          distractor = randomLetter;
        }
      } else {
        const similar = similarLetters[targetChar] as string[] | undefined;
        if (similar && similar.length > 0) {
          distractor = similar[Math.floor(rng() * similar.length)] as string;
        } else {
          // Fallback to random letter
          const randomLetter = availableLetters[Math.floor(rng() * availableLetters.length)];
          if (randomLetter) {
            distractor = randomLetter;
          }
        }
      }
    } else {
      // Random letter from alphabet
      const randomLetter = availableLetters[Math.floor(rng() * availableLetters.length)];
      if (randomLetter) {
        distractor = randomLetter;
      }
    }
    
    // Ensure we don't add a letter that's already in the correct set
    let attempts = 0;
    while (distractor && correctChars.includes(distractor.toUpperCase()) && attempts < 20) {
      const newDistractor = availableLetters[Math.floor(rng() * availableLetters.length)];
      if (newDistractor) {
        distractor = newDistractor;
      }
      attempts++;
    }
    if (!distractor) {
      distractor = availableLetters[0] ?? 'A';
    }
    
    let displayChar = distractor;
    if (caseStyle === 'upper') {
      displayChar = distractor.toUpperCase();
    } else if (caseStyle === 'lower' || caseStyle === 'title') {
      displayChar = distractor.toLowerCase();
    } else {
      displayChar = rng() > 0.5 ? distractor.toUpperCase() : distractor.toLowerCase();
    }

    distractors.push({
      char: displayChar,
      id: `distractor-${i}-${uid(rng)}`
    });
  }
  
  return [...correctLetters, ...distractors];
}

export const Generators: Record<string, GeneratorFunction> = {
  balance_scale: (level: number, rng: RngFunction = Math.random, profile: ProfileType = 'starter'): BalanceScaleProblem => {
    const meta = profileMeta(profile);
    // Improved progression: Level 1 = 4-7, Level 5 = 10-15, Level 10 = 15-22
    // Start easier
    const baseMin = 4;
    const baseMax = 7;
    const levelGrowth = Math.floor(level * 0.6); // Smoother growth
    const profileBoost = meta.difficultyOffset * 1.5; // Advanced profile +3 (not +4)
    const minSum = baseMin + levelGrowth + profileBoost;
    const maxSum = baseMax + Math.floor(level * 0.9) + profileBoost;
    const total = Math.floor(rng() * (maxSum - minSum + 1)) + minSum;
    
    const l1 = Math.floor(rng() * (total - 3)) + 2; 
    const l2 = total - l1;
    
    let r1 = Math.floor(rng() * (total - 3)) + 2; 
    if (r1 === l1 && level > 2) {
       r1 = Math.floor(rng() * (total - 3)) + 2;
    }
    const rHidden = total - r1; 
    
    const opts = new Set([rHidden]);
    let safety = 0; 
    while(opts.size < 3 && safety < 50) { 
      safety++; 
      const offset = Math.floor(rng() * 5) - 2; // -2 kuni +2
      const r = rHidden + offset;
      if(r > 0 && r !== rHidden) opts.add(r); 
    }
    while(opts.size < 3) opts.add(Math.floor(rng() * 10) + 1);

    return { 
      type: 'balance_scale', 
      display: { left: [l1, l2], right: [r1] }, 
      answer: rHidden, 
      options: Array.from(opts).sort((a,b)=>a-b), 
      uid: uid(rng) 
    };
  },
  
  word_builder: (level: number, rng: RngFunction = Math.random, profile: ProfileType = 'starter'): WordBuilderProblem => {
    const meta = profileMeta(profile);
    const locale = getLocale();
    
    // Word length selection based on level
    let len: number;
    if (level <= 2) len = 3;
    else if (level <= 4) len = 4;
    else if (level <= 7) len = 5;
    else if (level <= 9) len = 6;
    else len = 7;
    
    // Profile boost - advanced gets slightly longer words
    if (meta.difficultyOffset > 0) {
      len = Math.min(len + 1, 7);
    }
    
    // Select appropriate word database
    const wordDb = locale === 'en' ? WORD_DB_EN : WORD_DB;
    
    // Filter words by diacritics for levels 1-2 (Estonian only)
    let availableWords = wordDb[len] || wordDb[4] || [];
    if (locale !== 'en' && level <= 2) {
      // For levels 1-2, prefer words without diacritics
      const simpleWords = availableWords.filter(w => !hasDiacritics(w.w));
      if (simpleWords.length > 0) {
        availableWords = simpleWords;
      }
    }
    
    // Fallback if no words available
    if (!availableWords || availableWords.length === 0) {
      for (let i = len - 1; i >= 3 && (!availableWords || availableWords.length === 0); i--) {
        availableWords = wordDb[i] || [];
      }
      if (!availableWords || availableWords.length === 0) {
        availableWords = wordDb[4] || [];
      }
    }
    
    const wordObj = getRandom(availableWords, rng);
    if (!wordObj) {
      throw new Error('No word found for word_builder game');
    }
    
    // Apply letter case transformation based on level
    const displayWord = applyLetterCase(wordObj.w, level, rng);
    
    // Generate letter objects
    let letters: LetterObject[] = displayWord.split('').map((c, i) => ({ 
      char: c, 
      id: `char-${i}-${uid(rng)}` 
    }));
    
    // Add distractor letters based on level
    const distractorCount = level <= 2 ? 0 : level <= 4 ? 1 : level <= 7 ? 2 : 3;
    if (distractorCount > 0) {
      letters = addDistractorLetters(letters, distractorCount, locale, rng);
    }
    
    // Shuffle all letters
    const shuffled = [...letters].sort(() => rng() - 0.5);
    
    // Pre-filled positions for longer words
    let preFilledPositions: number[] | undefined;
    if (displayWord.length >= 6) {
      const preFillCount = displayWord.length >= 7 ? 2 : 1;
      preFilledPositions = [];
      // Fill first position
      if (preFillCount >= 1) {
        preFilledPositions.push(0);
      }
      // Fill last position for 7+ letter words
      if (preFillCount >= 2) {
        preFilledPositions.push(displayWord.length - 1);
      }
    }
    
    return { 
      type: 'word_builder', 
      target: displayWord, 
      emoji: wordObj.e, 
      shuffled,
      preFilledPositions,
      uid: uid(rng) 
    };
  },

  word_cascade: (level: number, rng: RngFunction = Math.random, _profile: ProfileType = 'starter'): WordCascadeProblem => {
    const locale = getLocale();
    const db = locale === 'en' ? WORD_DB_EN : WORD_DB;

    // Levels map to word lengths (start short, grow gradually)
    // Allow longer words at earlier levels to increase variety
    // Level 1-2: allow 3-4 letter words (was: only 3)
    // Level 3-4: allow 4-5 letter words (was: only 4)
    // Level 5+: normal progression
    let desiredLen: number;
    if (level <= 2) {
      // Level 1-2: prefer 3, but allow 4
      desiredLen = rng() < 0.7 ? 3 : 4;
    } else if (level <= 4) {
      // Level 3-4: prefer 4, but allow 5
      desiredLen = rng() < 0.7 ? 4 : 5;
    } else {
      // Level 5+: normal progression
      desiredLen = Math.max(3, Math.min(7, 3 + Math.floor(level / 2)));
    }
    
    const bucket = db[desiredLen] ?? db[desiredLen - 1] ?? db[desiredLen + 1] ?? db[3] ?? [];
    const chosen = bucket.length > 0 ? getRandom(bucket, rng) : { w: 'KASS', e: '🐱' };

    // Keep casing aligned with the existing word builder logic
    const target = applyLetterCase(chosen.w, level, rng);

    return {
      type: 'word_cascade',
      uid: uid(rng),
      target,
      emoji: chosen.e,
      columns: level < 6 ? 4 : 5,
    };
  },

  pattern: (level: number, rng: RngFunction = Math.random, profile: ProfileType = 'starter'): PatternProblem => {
    const THEMES = [ 
      ['🔴','🔵','🟢','🟡'], 
      ['🐶','🐱','🐸','🦁'], 
      ['🍎','🍌','🍇','🍉'], 
      ['⚽','🏀','🎾','🎱'],
      ['🚗','🚕','🚙','🚌']
    ];
    const items = getRandom(THEMES, rng);
    if (!items) {
      throw new Error('No theme found for pattern game');
    } 
    const pool = [...items].sort(() => rng() - 0.5); 
    const A = pool[0];
    const B = pool[1];
    const C = pool[2];
    const D = pool[3];
    if (!A || !B || !C || !D) {
      throw new Error('Not enough pattern items');
    }
    const meta = profileMeta(profile);
    const harder = meta.difficultyOffset > 0;

    type PatternTemplate = {
      id: PatternRuleId;
      cycle: number[];
      length: number;
    };

    const templates: Record<PatternRuleId, PatternTemplate> = {
      repeat_ab: { id: 'repeat_ab', cycle: [0, 1], length: 4 },
      repeat_abc: { id: 'repeat_abc', cycle: [0, 1, 2], length: 5 },
      repeat_abcd: { id: 'repeat_abcd', cycle: [0, 1, 2, 3], length: 6 },
      repeat_aab: { id: 'repeat_aab', cycle: [0, 0, 1], length: 5 },
      repeat_aabb: { id: 'repeat_aabb', cycle: [0, 0, 1, 1], length: 5 },
      repeat_aabc: { id: 'repeat_aabc', cycle: [0, 0, 1, 2], length: 6 },
    };

    const pickTemplates = (): PatternTemplate[] => {
      if (!harder) {
        if (level <= 2) {
          return [templates.repeat_ab, templates.repeat_aab];
        }
        if (level <= 4) {
          return [templates.repeat_ab, templates.repeat_aab, templates.repeat_abc];
        }
        return [templates.repeat_ab, templates.repeat_aab, templates.repeat_abc, templates.repeat_aabb];
      }

      if (level <= 2) {
        return [templates.repeat_ab, templates.repeat_abc];
      }
      if (level <= 4) {
        return [templates.repeat_aab, templates.repeat_abc, templates.repeat_aabb];
      }
      return [templates.repeat_abc, templates.repeat_aabb, templates.repeat_abcd, templates.repeat_aabc];
    };

    const templatePool = pickTemplates();
    const picked = getRandom(templatePool, rng);
    if (!picked) {
      throw new Error('No pattern template found');
    }

    const lengthBoost = Math.min(2, Math.floor(level / 4));
    const sequenceLength = Math.min(picked.length + lengthBoost, 6);
    const sequence = Array.from({ length: sequenceLength }, (_, index) => {
      const cycleIndex = picked.cycle[index % picked.cycle.length] ?? 0;
      return pool[cycleIndex] ?? A;
    });
    const nextIndex = picked.cycle[sequenceLength % picked.cycle.length] ?? 0;
    const answer = pool[nextIndex] ?? A;
    const patternCycle = picked.cycle.map((index) => pool[index] ?? A);

    // Ensure the correct answer is always among the choices
    const opts = new Set([answer]); 
    while(opts.size < 3) {
      const randomItem = getRandom(items, rng);
      if (randomItem && randomItem !== answer) opts.add(randomItem);
    }
    
    return { 
      type: 'pattern', 
      sequence, 
      answer, 
      options: Array.from(opts).sort(() => rng() - 0.5), 
      patternRule: picked.id,
      patternCycle,
      uid: uid(rng) 
    };
  },

  memory_math: (level: number, rng: RngFunction = Math.random, profile: ProfileType = 'starter'): MemoryMathProblem => {
    const meta = profileMeta(profile);
    const harder = meta.difficultyOffset > 0;
    // Improved card count progression - smoother
    const baseCards = harder ? 8 : 6;
    const cardGrowth = Math.floor(level / 2.5); // Smoother growth
    const cardCount = Math.min(baseCards + cardGrowth * 2, harder ? 14 : 12);
    // Improved maxSum progression - smoother
    const baseMax = harder ? 15 : 10;
    const sumGrowth = Math.floor(level * 2); // Slower growth
    const maxSum = Math.min(baseMax + sumGrowth, harder ? 35 : 25); 
    const pairs: Array<{ eq: string; ans: number }> = [];
    const cards: Array<{ id: string; content: string; matched?: boolean }> = [];
    
    while(pairs.length < cardCount / 2) { 
      const sum = Math.floor(rng() * (maxSum - 3)) + 3; 
      if (pairs.some(p => p.ans === sum)) continue;

      const a = Math.floor(rng() * (sum - 1)) + 1;
      const eq = `${a} + ${sum-a}`;
      const id = pairs.length; 
      const matchId = `pair-${id}`;
      pairs.push({ eq, ans: sum });
      cards.push({ id: `q-${id}`, content: eq, type: 'math', matchId } as MemoryMathProblem['cards'][0]);
      cards.push({ id: `a-${id}`, content: `${sum}`, type: 'answer', matchId } as MemoryMathProblem['cards'][0]);
    }
    return { type: 'memory_math', cards: cards.sort(() => rng() - 0.5), pairs, uid: uid(rng) };
  },

  math_snake: (level: number, rng: RngFunction = Math.random, profile: ProfileType = 'starter') => {
    return createMathSnakeProblem(level, rng, profile);
  },

  sentence_logic: (level: number, rng: RngFunction = Math.random, _profile: ProfileType = 'starter'): SentenceLogicProblem => {
    // 1. Select scene based on level progression
    const allScenes = Object.keys(SCENE_DB);
    const sceneKeys = level <= 2
      ? allScenes.filter(k => (SCENE_DB[k]?.positions?.length ?? 0) <= 4)
      : level <= 5
      ? allScenes.filter(k => (SCENE_DB[k]?.positions?.length ?? 0) <= 5)
      : allScenes;
    
    const sceneKey = getRandom(sceneKeys, rng);
    if (!sceneKey) throw new Error('No scene found for sentence_logic game');
    
    const scene = SCENE_DB[sceneKey];
    if (!scene) throw new Error('Scene not found in SCENE_DB');
    
    // 2. Select objects
    const subject = getRandom(scene.subjects, rng);
    if (!subject) throw new Error('No subject found for sentence_logic game');
    
    const anchor = getRandom(scene.anchors, rng);
    if (!anchor) throw new Error('No anchor found for sentence_logic game');
    
    // 3. Select correct position
    const validPositions = scene.positions;
    const correctPos = getRandom(validPositions, rng);
    if (!correctPos) throw new Error('No position found for sentence_logic game');
    
    // 4. Generate wrong positions (same objects, different positions)
    const usedPositions = new Set([correctPos]);
    const wrongPositions: string[] = [];
    
    // Determine number of wrong options based on level
    const numWrongOptions = level >= 4 ? 3 : level >= 3 ? 2 : level >= 2 ? 2 : 1;
    
    for (let i = 0; i < numWrongOptions && wrongPositions.length < validPositions.length - 1; i++) {
      const available = validPositions.filter(p => !usedPositions.has(p));
      if (available.length === 0) break;
      
      const wrongPos = getRandom(available, rng);
      if (wrongPos) {
        wrongPositions.push(wrongPos);
        usedPositions.add(wrongPos);
      }
    }
    
    // 5. Build options array
    const options = [
      { id: 'correct', pos: correctPos, answer: true, subject, anchor, sceneKey, sceneName: scene.name, bg: scene.bg },
      ...wrongPositions.map((pos, idx) => ({
        id: `wrong-${idx}`,
        pos,
        answer: false,
        subject,
        anchor,
        sceneKey,
        sceneName: scene.name,
        bg: scene.bg
      }))
    ];
    
    // Shuffle options
    const shuffledOptions = [...options].sort(() => rng() - 0.5);
    
    // 6. Generate sentence in current language
    // Ensure locale is properly initialized (fallback to 'et' if window is not available)
    let locale: 'et' | 'en' = 'et';
    try {
      locale = getLocale();
      // Validate locale
      if (locale !== 'et' && locale !== 'en') {
        locale = 'et';
      }
    } catch (error) {
      console.warn('Error getting locale, defaulting to Estonian:', error);
      locale = 'et';
    }
    
    const sentence = generateSentence(subject, anchor, correctPos, locale);
    const isInside = correctPos === 'INSIDE';
    const translatedSceneName = getSceneName(scene.name, locale);
    
    // 7. Map to expected format
    const optionObjects = shuffledOptions.map(opt => ({
      text: opt.id === 'correct' ? 'correct' : opt.id,
      pos: opt.pos,
      answer: opt.answer,
      a: opt.anchor,
      s: opt.subject,
      bg: opt.bg,
      sceneName: translatedSceneName,
      id: opt.id
    })) as Array<string | { text: string; pos?: string; answer?: boolean; a?: SceneAnchor; s?: SceneSubject; bg?: string; sceneName?: string; id?: string }>;
    
    return {
      type: 'sentence_logic',
      scene: sceneKey,
      sceneName: translatedSceneName,
      subject,
      anchor,
      position: correctPos,
      caseType: isInside ? 'iness' : 'adess',
      sentence,
      display: sentence,
      options: optionObjects,
      answer: 'correct',
      uid: uid(rng)
    };
  },

  letter_match: (level: number, rng: RngFunction = Math.random, _profile: ProfileType = 'starter'): LetterMatchProblem => {
    // Select uppercase letter - this is what is shown
    const targetUpper = getRandom(ALPHABET, rng);
    if (!targetUpper) {
      throw new Error('No letter found for letter_match game');
    }
    const targetLower = targetUpper.toLowerCase();
    
    // Generate wrong choices - lowercase letters
    const opts = new Set([targetLower]);
    
    // Level 1-2: random lowercase letters
    // Level 3-4: similar lowercase letters
    // Level 5+: very similar lowercase letters
    const similarLetters = level >= 5 
      ? ALPHABET.filter(l => {
          // Find letters that are close in alphabet
          const targetIdx = ALPHABET.indexOf(targetUpper);
          return Math.abs(ALPHABET.indexOf(l) - targetIdx) <= 2 && l !== targetUpper;
        })
      : level >= 3
      ? ALPHABET.filter(l => {
          // Find letters that are close in alphabet (laiem)
          const targetIdx = ALPHABET.indexOf(targetUpper);
          return Math.abs(ALPHABET.indexOf(l) - targetIdx) <= 5 && l !== targetUpper;
        })
      : ALPHABET;
    
    // Level 3+ - show more choices (4 instead of 3)
    const optionCount = level >= 3 ? 4 : 3;
    while(opts.size < optionCount) { 
      const r = getRandom(similarLetters.length > 0 ? similarLetters : ALPHABET, rng); 
      if(r && r !== targetUpper) opts.add(r.toLowerCase()); 
    }
    
    // Find a word that contains the target letter (for emoji)
    let wordObj = null;
    for (const len of Object.keys(WORD_DB)) {
      const words = WORD_DB[parseInt(len)];
      if (words && words.length > 0) {
        wordObj = getRandom(words.filter(w => w.w.includes(targetUpper)), rng);
        if (wordObj) break;
      }
    }
    if (!wordObj) {
      wordObj = { w: targetUpper, e: '❓' };
    }
    
    return { 
      type: 'letter_match',
      word: wordObj.w,
      emoji: wordObj.e,
      display: targetUpper, // Show uppercase letter
      targetLetter: targetLower, // Correct answer is lowercase letter
      targetPosition: 0, // No longer needed, but kept for compatibility
      options: Array.from(opts).sort(() => rng() - 0.5), 
      answer: targetLower,
      uid: uid(rng) 
    };
  },

  robo_path: (level: number, rng: RngFunction = Math.random, profile: ProfileType = 'starter'): RoboPathProblem => {
    const meta = profileMeta(profile);
    const harder = meta.difficultyOffset > 0;
    
    // Improved grid size progression - scales better with levels
    // Starter: 3x3 (1-2), 4x4 (3-5), 5x5 (6-10), 6x6 (11-15), 7x7 (16+)
    // Advanced: 4x4 (1-2), 5x5 (3-5), 6x6 (6-10), 7x7 (11-15), 8x8 (16+)
    const baseGrid = harder ? 4 : 3;
    let gridGrowth = 0;
    if (level >= 16) gridGrowth = harder ? 4 : 4; // 8x8 advanced, 7x7 starter
    else if (level >= 11) gridGrowth = harder ? 3 : 3; // 7x7 both
    else if (level >= 6) gridGrowth = harder ? 2 : 2; // 6x6 both
    else if (level >= 3) gridGrowth = harder ? 1 : 1; // 5x5 both
    const gridSize = Math.min(baseGrid + gridGrowth, harder ? 8 : 7);
    
    // Improved obstacle count progression - more obstacles, better scaling
    // Level 1: 0-1, Level 2-3: 1-2, Level 4-5: 2-3, Level 6-8: 3-4, Level 9-12: 4-5, Level 13+: 5-7
    const baseObstacles = level === 1 
      ? (harder ? 1 : 0)
      : level <= 3
      ? 1 + Math.floor(level / 2)
      : level <= 5
      ? 2 + Math.floor((level - 3) / 2)
      : level <= 8
      ? 3 + Math.floor((level - 5) / 2)
      : level <= 12
      ? 4 + Math.floor((level - 8) / 2)
      : 5 + Math.floor((level - 12) / 3);
    
    const obstacleVariance = level <= 3 ? 1 : level <= 8 ? 1 : 2;
    const obstacleCount = Math.min(
      baseObstacles + (harder ? 1 : 0) + Math.floor(rng() * obstacleVariance),
      Math.max(5, Math.floor(gridSize * gridSize * 0.25)) // Max 25% of grid cells
    );
    
    const start = { x: 0, y: 0, dir: 'N' }; 
    const maxCells = gridSize * gridSize;
    const maxObstacles = Math.max(0, maxCells - 4); // Reserve space for start, goal, and path
    const cappedObstacleCount = Math.min(obstacleCount, maxObstacles);

    const directions: Array<[number, number]> = [[0, -1], [0, 1], [-1, 0], [1, 0]]; // UP, DOWN, LEFT, RIGHT

    const findShortestPath = (
      startPos: [number, number],
      endPos: [number, number],
      obstacleSet: Set<string>
    ): { length: number; path: Array<[number, number]> } | null => {
      const queue: Array<[number, number]> = [startPos];
      const visited = new Set<string>();
      const parent = new Map<string, string>();
      visited.add(`${startPos[0]},${startPos[1]}`);

      while (queue.length > 0) {
        const current = queue.shift();
        if (!current) break;
        const [x, y] = current;
        if (x === endPos[0] && y === endPos[1]) {
          const path: Array<[number, number]> = [];
          let key: string | undefined = `${x},${y}`;
          while (key) {
            const parts = key.split(',');
            const px = Number(parts[0]);
            const py = Number(parts[1]);
            if (!isNaN(px) && !isNaN(py)) {
              path.push([px, py]);
            }
            key = parent.get(key);
          }
          path.reverse();
          return { length: path.length - 1, path };
        }
        for (const [dx, dy] of directions) {
          const newX = x + dx;
          const newY = y + dy;
          const key = `${newX},${newY}`;
          if (
            newX >= 0 &&
            newX < gridSize &&
            newY >= 0 &&
            newY < gridSize &&
            !visited.has(key) &&
            !obstacleSet.has(key)
          ) {
            visited.add(key);
            parent.set(key, `${x},${y}`);
            queue.push([newX, newY]);
          }
        }
      }

      return null;
    };

    const hasFreeStartNeighbor = (obstacleSet: Set<string>): boolean => {
      return directions.some(([dx, dy]) => {
        const nx = start.x + dx;
        const ny = start.y + dy;
        if (nx < 0 || ny < 0 || nx >= gridSize || ny >= gridSize) return false;
        return !obstacleSet.has(`${nx},${ny}`);
      });
    };

    // Calculate minimum distance based on grid size (at least 50% of diagonal)
    const minDistance = Math.max(2, Math.ceil(Math.sqrt(gridSize * gridSize * 2) * 0.5));
    const maxDistance = Math.floor(Math.sqrt(gridSize * gridSize * 2) * 0.9); // Max 90% of diagonal

    let end = { x: 0, y: 0 }; 
    let obstacles: Array<{x: number; y: number}> = [];
    let optimalMoves = 0;
    let path: Array<[number, number]> = [];
    let safety = 0;

    while (safety < 100) {
      safety++;
      
      // Place goal with minimum distance requirement
      let attempts = 0;
      do { 
        end = { x: Math.floor(rng() * gridSize), y: Math.floor(rng() * gridSize) }; 
        attempts++; 
      } while (
        attempts < 60 && (
          Math.abs(end.x - start.x) + Math.abs(end.y - start.y) < minDistance ||
          Math.abs(end.x - start.x) + Math.abs(end.y - start.y) > maxDistance
        )
      );
      
      // Strategic obstacle placement
      obstacles = [];
      const obstacleSet = new Set<string>();
      
      // First, place obstacles strategically along potential paths
      // 1. Place some obstacles near the goal (makes it harder to reach)
      const goalObstacleCount = Math.floor(cappedObstacleCount * 0.4); // 40% near goal
      let goalObstacleAttempts = 0;
      while (obstacles.length < goalObstacleCount && goalObstacleAttempts < 50) {
        goalObstacleAttempts++;
        const angle = rng() * Math.PI * 2;
        const distance = 1 + rng() * 2; // 1-3 cells from goal
        const obsX = Math.round(end.x + Math.cos(angle) * distance);
        const obsY = Math.round(end.y + Math.sin(angle) * distance);
        
        if (
          obsX >= 0 && obsX < gridSize &&
          obsY >= 0 && obsY < gridSize &&
          obsX !== start.x && obsY !== start.y &&
          obsX !== end.x && obsY !== end.y &&
          !obstacleSet.has(`${obsX},${obsY}`)
        ) {
          obstacles.push({ x: obsX, y: obsY });
          obstacleSet.add(`${obsX},${obsY}`);
        }
      }
      
      // 2. Place obstacles to create interesting detours (not blocking completely, but forcing longer paths)
      const detourObstacleCount = Math.floor(cappedObstacleCount * 0.4); // 40% for detours
      let detourAttempts = 0;
      while (obstacles.length < goalObstacleCount + detourObstacleCount && detourAttempts < 80) {
        detourAttempts++;
        // Place obstacles in the "middle zone" between start and goal
        const midX = Math.floor((start.x + end.x) / 2);
        const midY = Math.floor((start.y + end.y) / 2);
        const offsetX = Math.floor((rng() - 0.5) * (gridSize * 0.6));
        const offsetY = Math.floor((rng() - 0.5) * (gridSize * 0.6));
        const obsX = Math.max(0, Math.min(gridSize - 1, midX + offsetX));
        const obsY = Math.max(0, Math.min(gridSize - 1, midY + offsetY));
        
        if (
          obsX !== start.x && obsY !== start.y &&
          obsX !== end.x && obsY !== end.y &&
          !obstacleSet.has(`${obsX},${obsY}`)
        ) {
          obstacles.push({ x: obsX, y: obsY });
          obstacleSet.add(`${obsX},${obsY}`);
        }
      }
      
      // 3. Fill remaining obstacles randomly (but not too close to start)
      let randomAttempts = 0;
      while (obstacles.length < cappedObstacleCount && randomAttempts < 100) {
        randomAttempts++;
        const obs = { x: Math.floor(rng() * gridSize), y: Math.floor(rng() * gridSize) }; 
        const distFromStart = Math.abs(obs.x - start.x) + Math.abs(obs.y - start.y);
        const isStart = obs.x === start.x && obs.y === start.y;
        const isEnd = obs.x === end.x && obs.y === end.y;
        const exists = obstacleSet.has(`${obs.x},${obs.y}`);
        
        // Don't place obstacles too close to start (at least 2 cells away)
        if (!isStart && !isEnd && !exists && distFromStart >= 2) {
          obstacles.push(obs);
          obstacleSet.add(`${obs.x},${obs.y}`);
        }
      }

      // Verify path exists and has reasonable complexity
      const pathResult = findShortestPath([start.x, start.y], [end.x, end.y], obstacleSet);
      if (!pathResult) {
        continue;
      }
      if (!hasFreeStartNeighbor(obstacleSet)) {
        continue;
      }
      
      // Ensure path has minimum complexity (at least 30% longer than direct distance)
      const directDistance = Math.abs(end.x - start.x) + Math.abs(end.y - start.y);
      const pathComplexity = pathResult.length / Math.max(1, directDistance);
      if (pathComplexity < 1.3 && level > 2) {
        // Path is too simple, try again
        continue;
      }

      optimalMoves = pathResult.length;
      path = pathResult.path;
      break;
    }

    // Fallback if we couldn't generate a good puzzle
    if (path.length === 0) {
      obstacles = [];
      const fallbackPath = findShortestPath([start.x, start.y], [end.x, end.y], new Set());
      if (fallbackPath) {
        optimalMoves = fallbackPath.length;
        path = fallbackPath.path;
      } else {
        optimalMoves = Math.abs(end.x - start.x) + Math.abs(end.y - start.y);
      }
    }

    const coalIndex = Math.min(
      Math.max(1, Math.floor(path.length / 2)),
      Math.max(1, path.length - 2)
    );
    const coalPos = path.length >= 3 ? path[coalIndex] : null;
    
    // Build grid
    const grid: number[][] = Array.from({ length: gridSize }, () => Array(gridSize).fill(0) as number[]);
    for (const obs of obstacles) {
      const row = grid[obs.y];
      if (row) {
        row[obs.x] = 1;
      }
    }
    
    // Generate correct path (simplified - just store instructions)
    const correctPath: string[] = [];
    const optionCommands = ['UP', 'DOWN', 'LEFT', 'RIGHT', 'FORWARD', 'TURN_LEFT', 'TURN_RIGHT'];
    
    // Calculate max commands based on optimal path + buffer for mistakes
    const commandBuffer = level <= 3 ? 2 : level <= 8 ? 3 : 4;
    const maxCommands = Math.max(optimalMoves + commandBuffer, Math.floor(gridSize * 1.2));
    
    return { 
      type: 'robo_path',
      grid,
      gridSize,
      start: [start.x, start.y],
      goal: [end.x, end.y],
      obstacles: obstacles.map(o => [o.x, o.y] as [number, number]),
      correctPath,
      options: optionCommands,
      maxCommands,
      optimalMoves,
      coal: coalPos ? [coalPos[0], coalPos[1]] : undefined,
      uid: uid(rng) 
    };
  },

  syllable_builder: (level: number, rng: RngFunction = Math.random, profile: ProfileType = 'starter'): SyllableBuilderProblem => {
    const locale = getLocale();
    const words = SYLLABLE_WORDS[locale] ?? SYLLABLE_WORDS.et;
    // Filter by level - higher levels have longer words
    const meta = profileMeta(profile);
    // Smoother progression: Level 1-2 = 2 syllables, Level 3-5 = 3 syllables, Level 6+ = 3-4 syllables
    const targetParts = level <= 2 ? 2 : level <= 5 ? 3 : level <= 7 ? 3 : 4;
    const isAdvanced = meta.difficultyOffset > 0;
    const minParts = isAdvanced
      ? Math.max(2, targetParts - (level > 3 ? 1 : 0))
      : 2;
    const maxParts = isAdvanced ? targetParts + 1 : targetParts;
    let filtered = words.filter(item => {
      const partsCount = item.syllables.length;
      return partsCount >= minParts && partsCount <= maxParts;
    });
    if (filtered.length === 0) {
      const smallestDiff = Math.min(...words.map(item => Math.abs(item.syllables.length - targetParts)));
      filtered = words.filter(item => Math.abs(item.syllables.length - targetParts) === smallestDiff);
    }
    const wordObj = getRandom(filtered, rng);
    if (!wordObj) {
      throw new Error('No word found for syllable_builder game');
    }
    const syllables = wordObj.syllables;
    const shuffled = syllables.map((text, i) => ({ 
      text, 
      id: `syl-${i}-${uid(rng)}` 
    })).sort(() => rng() - 0.5);
    
    return { 
      type: 'syllable_builder', 
      target: syllables.join(''),
      emoji: wordObj.emoji,
      syllables,
      shuffled,
      uid: uid(rng) 
    };
  },

  time_match: (level: number, rng: RngFunction = Math.random, _profile: ProfileType = 'advanced'): TimeMatchProblem => {
    // Smoother step progression
    const step = level <= 2 ? 30 : level <= 4 ? 15 : level <= 6 ? 10 : 5; // minute step
    const hour24 = Math.floor(rng() * 24);
    const minute = Math.floor(rng() * (60/step)) * step;
    const toLabel = (h24: number, m: number) => `${h24.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}`;
    const correct = toLabel(hour24, minute);
    const opts = new Set([correct]);
    while(opts.size < 3) {
      const delta = (Math.floor(rng()*3)+1) * step;
      const sign = rng() > 0.5 ? 1 : -1;
      const m2 = (minute + sign * delta + 60) % 60;
      const h2 = (hour24 + (minute + sign * delta < 0 ? -1 : 0) + 24) % 24;
      opts.add(toLabel(h2, m2));
    }
    return { 
      type: 'time_match',
      hours: hour24,
      minutes: minute,
      display: { hour: hour24 % 12 || 12, minute },
      answer: correct,
      options: Array.from(opts).sort(() => rng() - 0.5),
      uid: uid(rng)
    };
  },

  unit_conversion: (level: number, rng: RngFunction = Math.random, profile: ProfileType = 'starter'): UnitConversionProblem => {
    const meta = profileMeta(profile);
    const harder = meta.difficultyOffset > 0;

    // Unit conversion definitions
    const conversions = {
      length: [
        { from: 'm', to: 'cm', factor: 100, emoji: '📏' },
        { from: 'km', to: 'm', factor: 1000, emoji: '📐' },
        { from: 'cm', to: 'mm', factor: 10, emoji: '📏' }
      ],
      mass: [
        { from: 'kg', to: 'g', factor: 1000, emoji: '⚖️' },
        { from: 't', to: 'kg', factor: 1000, emoji: '🏋️' }
      ],
      volume: [
        { from: 'l', to: 'ml', factor: 1000, emoji: '🧪' },
        { from: 'l', to: 'dl', factor: 10, emoji: '🥛' }
      ]
    };

    let selectedConversion;
    let value: number;
    let unitType: 'length' | 'mass' | 'volume';

    if (harder) {
      // Advanced profile (levels 1-15)
      if (level <= 3) {
        // Levels 1-3: Basic conversions (m↔cm, kg↔g, l↔ml), numbers 10-50
        const basicTypes: Array<'length' | 'mass' | 'volume'> = ['length', 'mass', 'volume'];
        unitType = getRandom(basicTypes, rng) || 'length';
        const availableConversions = unitType === 'length' 
          ? [conversions.length[0]] 
          : unitType === 'mass' 
          ? [conversions.mass[0]] 
          : [conversions.volume[0]];
        selectedConversion = getRandom(availableConversions, rng);
        value = Math.floor(rng() * 41) + 10; // 10-50
      } else if (level <= 7) {
        // Levels 4-7: Add km↔m, t↔kg, numbers 50-100
        const types: Array<'length' | 'mass' | 'volume'> = ['length', 'mass', 'volume'];
        unitType = getRandom(types, rng) || 'length';
        selectedConversion = getRandom(conversions[unitType], rng);
        value = Math.floor(rng() * 51) + 50; // 50-100
      } else if (level <= 10) {
        // Levels 8-10: All units, numbers 100-500
        const types: Array<'length' | 'mass' | 'volume'> = ['length', 'mass', 'volume'];
        unitType = getRandom(types, rng) || 'length';
        selectedConversion = getRandom(conversions[unitType], rng);
        value = Math.floor(rng() * 401) + 100; // 100-500
      } else {
        // Levels 11-15: Complex, numbers up to 1000
        const types: Array<'length' | 'mass' | 'volume'> = ['length', 'mass', 'volume'];
        unitType = getRandom(types, rng) || 'length';
        selectedConversion = getRandom(conversions[unitType], rng);
        value = Math.floor(rng() * 901) + 100; // 100-1000
      }
    } else {
      // Starter profile (levels 1-10)
      if (level <= 3) {
        // Levels 1-3: Only m↔cm, kg↔g, numbers 1-5
        const basicTypes: Array<'length' | 'mass'> = ['length', 'mass'];
        unitType = getRandom(basicTypes, rng) || 'length';
        selectedConversion = unitType === 'length' 
          ? conversions.length[0] 
          : conversions.mass[0];
        value = Math.floor(rng() * 5) + 1; // 1-5
      } else if (level <= 6) {
        // Levels 4-6: Add l↔ml, numbers 1-10
        const types: Array<'length' | 'mass' | 'volume'> = ['length', 'mass', 'volume'];
        unitType = getRandom(types, rng) || 'length';
        const availableConversions = unitType === 'length' 
          ? [conversions.length[0]] 
          : unitType === 'mass' 
          ? [conversions.mass[0]] 
          : [conversions.volume[0]];
        selectedConversion = getRandom(availableConversions, rng);
        value = Math.floor(rng() * 10) + 1; // 1-10
      } else {
        // Levels 7-10: All basic units, numbers 1-20
        const types: Array<'length' | 'mass' | 'volume'> = ['length', 'mass', 'volume'];
        unitType = getRandom(types, rng) || 'length';
        const availableConversions = unitType === 'length' 
          ? [conversions.length[0]] 
          : unitType === 'mass' 
          ? [conversions.mass[0]] 
          : conversions.volume;
        selectedConversion = getRandom(availableConversions, rng);
        value = Math.floor(rng() * 20) + 1; // 1-20
      }
    }
    
    if (!selectedConversion) {
      throw new Error('No conversion found for unit_conversion game');
    }

    const correctAnswer = value * selectedConversion.factor;

    // Generate wrong answers with pedagogically appropriate variations
    const wrongAnswers = [
      Math.floor(correctAnswer * 0.1), // ÷10 (common mistake)
      Math.floor(correctAnswer * 0.5), // half
      Math.floor(correctAnswer * 1.1), // +10%
      Math.floor(correctAnswer * 0.9), // -10%
      Math.floor(correctAnswer * 1.5), // +50%
      Math.floor(correctAnswer / selectedConversion.factor) // original value without conversion
    ].filter(a => a !== correctAnswer && a > 0);
    
    // Only add ×10 if the result won't be too large (pedagogically confusing)
    if (correctAnswer < 10000) {
      wrongAnswers.push(Math.floor(correctAnswer * 10));
    }

    // Select 3 unique wrong answers
    const uniqueWrong = [...new Set(wrongAnswers)].sort(() => rng() - 0.5).slice(0, 3);
    
    // If we don't have enough unique wrong answers, generate more (with safety limit)
    let attempts = 0;
    while (uniqueWrong.length < 3 && attempts < 20) {
      attempts++;
      const offset = Math.floor(rng() * correctAnswer * 0.3) + 1;
      const wrong = rng() > 0.5 ? correctAnswer + offset : correctAnswer - offset;
      if (wrong > 0 && wrong !== correctAnswer && !uniqueWrong.includes(wrong)) {
        uniqueWrong.push(wrong);
      }
    }

    const options = [correctAnswer, ...uniqueWrong.slice(0, 3)].sort(() => rng() - 0.5);

    return {
      type: 'unit_conversion',
      value,
      fromUnit: selectedConversion.from,
      toUnit: selectedConversion.to,
      category: unitType,
      answer: correctAnswer,
      options,
      uid: uid(rng)
    };
  },

  compare_sizes: (level: number, rng: RngFunction = Math.random, profile: ProfileType = 'starter'): CompareSizesProblem => {
    const meta = profileMeta(profile);
    const effectiveLevel = level + meta.difficultyOffset;
    
    // Constants for visual representation
    const MAX_DICE_VALUE = 6;
    
    // REDESIGNED Level progression - More challenging and balanced:
    // 1: Dice (1-6) with symbols - concrete visual + symbol practice
    // 2-3: Dice (1-6) with symbols, introduce equality
    // 4-5: Dice + Numbers (1-12, double dice) with all symbols
    // 6-7: Numbers (1-20) with closer values and all symbols
    // 8-9: Mixed: dice/numbers (1-30) with smaller gaps
    // 10+: Numbers (1-50+) with very close values
    
    const showSymbols = true; // Always show symbols - this is the focus!
    const useDice = effectiveLevel <= 5;
    const showNumbers = effectiveLevel >= 4;
    
    const maxValue = effectiveLevel <= 1 ? MAX_DICE_VALUE 
                   : effectiveLevel <= 3 ? MAX_DICE_VALUE
                   : effectiveLevel <= 5 ? MAX_DICE_VALUE * 2 // double dice
                   : effectiveLevel <= 7 ? 20
                   : effectiveLevel <= 9 ? 30
                   : effectiveLevel <= 11 ? 50
                   : 100;
    
    // Difficulty affects how close the values are - more challenging gaps
    const minDifference = effectiveLevel <= 1 ? 2 
                        : effectiveLevel <= 3 ? 1
                        : effectiveLevel <= 5 ? 1
                        : effectiveLevel <= 7 ? 1
                        : 1;
    
    // Equal appears from level 2+ (effectiveLevel > 1)
    const equalChance = effectiveLevel <= 1 ? 0
                      : effectiveLevel <= 3 ? 0.2  // 20% chance at level 2-3
                      : effectiveLevel <= 5 ? 0.25 // 25% chance
                      : effectiveLevel <= 7 ? 0.3  // 30% chance
                      : 0.35;  // 35% chance at higher levels
    
    let leftValue: number;
    let rightValue: number;
    let answer: 'left' | 'right' | 'equal';
    
    if (rng() < equalChance) {
      // Equal case
      leftValue = Math.floor(rng() * maxValue) + 1;
      rightValue = leftValue;
      answer = 'equal';
    } else {
      // Different values - use smaller gaps for more challenge
      leftValue = Math.floor(rng() * maxValue) + 1;
      
      // Ensure minimum difference but prefer smaller gaps at higher levels
      let rightValue_temp: number;
      let attempts = 0;
      const MAX_DIFFICULTY_GAP = 5;
      const maxGap = effectiveLevel <= 3 ? maxValue : Math.min(MAX_DIFFICULTY_GAP, Math.floor(maxValue / 4));
      const RANDOM_VALUE_CHANCE = 0.3;  // 30% chance for any value
      
      do {
        // At higher levels, prefer values close to leftValue for increased difficulty
        if (effectiveLevel >= 6 && rng() > RANDOM_VALUE_CHANCE) {
          // 70% chance to generate a nearby value
          const offset = Math.floor(rng() * maxGap) + minDifference;
          rightValue_temp = rng() > 0.5 ? leftValue + offset : leftValue - offset;
          // Clamp to valid range
          rightValue_temp = Math.max(1, Math.min(maxValue, rightValue_temp));
        } else {
          // 30% chance for any value (or always at lower levels)
          rightValue_temp = Math.floor(rng() * maxValue) + 1;
        }
        attempts++;
      } while (Math.abs(leftValue - rightValue_temp) < minDifference && attempts < 20);
      
      rightValue = rightValue_temp;
      answer = leftValue > rightValue ? 'left' : 'right';
    }
    
    // Determine representation mode - prefer visual at higher levels without numbers
    let representationMode: 'dice' | 'number' | 'mixed' = 'number';
    const DICE_MODE_PROBABILITY = 0.6;  // 60% dice, 40% numbers
    
    if (useDice && !showNumbers) {
      // Pure dice mode (levels 1-3)
      representationMode = 'dice';
    } else if (useDice && showNumbers) {
      // Dice with numbers (levels 4-5)
      representationMode = 'dice';
    } else if (effectiveLevel >= 6 && effectiveLevel <= 9 && leftValue <= 12 && rightValue <= 12) {
      // At levels 6-9, use dice for smaller numbers (more visual challenge)
      representationMode = rng() > (1 - DICE_MODE_PROBABILITY) ? 'dice' : 'number';
    }
    
    // Create visual representations
    const leftVisual = representationMode === 'dice' ? '🎲'.repeat(Math.min(leftValue, MAX_DICE_VALUE)) : '';
    const rightVisual = representationMode === 'dice' ? '🎲'.repeat(Math.min(rightValue, MAX_DICE_VALUE)) : '';
    
    // Create display strings
    const leftDisplay = showNumbers || representationMode === 'number' ? String(leftValue) : leftVisual;
    const rightDisplay = showNumbers || representationMode === 'number' ? String(rightValue) : rightVisual;
    
    // ALWAYS provide symbol options (>, <, =) based on level
    const options: Array<'left' | 'right' | 'equal'> = effectiveLevel <= 1 
      ? ['left', 'right'] // Only > and < at level 1
      : ['left', 'right', 'equal']; // Add = from level 2+
    
    return {
      type: 'compare_sizes',
      leftItem: {
        value: leftValue,
        display: leftDisplay,
        visual: leftVisual
      },
      rightItem: {
        value: rightValue,
        display: rightDisplay,
        visual: rightVisual
      },
      answer,
      options,
      showNumbers: showNumbers || representationMode === 'number',
      showSymbols,
      uid: uid(rng)
    };
  },

  star_mapper: (level: number, rng: RngFunction = Math.random, profile: ProfileType = 'starter'): StarMapperProblem => {
    const profileInfo = profileMeta(profile);
    const effectiveLevel = level + profileInfo.difficultyOffset;

    // Select difficulty based on level
    const difficulty = effectiveLevel <= 3 ? 'easy' 
      : effectiveLevel <= 6 ? 'medium' 
      : 'hard';

    // Select mode based on level
    const mode = effectiveLevel <= 3 ? 'trace' 
      : effectiveLevel <= 6 ? 'build' 
      : effectiveLevel <= 10 ? 'identify' 
      : 'expert';

    // Get constellation pool (includes easier difficulties to avoid repetition, e.g. hard = all 13)
    const pool = getConstellationsForLevel(difficulty);
    const constellation = getRandom(pool, rng);

    // Generate distractor stars for expert mode
    const distractorStars: Star[] = mode === 'expert' 
      ? generateDistractorStars(constellation, rng, effectiveLevel)
      : [];

    // Generate options for identify mode
    const options = mode === 'identify'
      ? generateIdentifyOptions(constellation, rng)
      : undefined;

    return {
      type: 'star_mapper',
      uid: uid(rng),
      mode,
      constellation,
      distractorStars,
      showGuide: mode === 'trace',
      options,
      correctAnswer: constellation.id,
      playerLines: [],
    };
  }
};

/**
 * Helper function to generate distractor stars for expert mode
 * 
 * Creates dim background stars that are not part of the constellation
 * to increase difficulty. Number of distractors increases with level.
 * 
 * @param constellation - The target constellation (unused, for future positioning logic)
 * @param rng - Random number generator for consistent results
 * @param level - Player level (determines number of distractors: level/3, max 3)
 * @returns Array of distractor stars with magnitude 4-6 (dimmer than constellation stars)
 */
function generateDistractorStars(constellation: Constellation, rng: RngFunction, level: number): Star[] {
  const numDistractors = Math.min(3, Math.floor(level / 3)); // 1-3 distractor stars
  const distractors: Star[] = [];
  
  for (let i = 0; i < numDistractors; i++) {
    distractors.push({
      id: `distractor_${i}`,
      x: rng() * 100,
      y: rng() * 100,
      magnitude: 4 + rng() * 2, // Dim stars (magnitude 4-6)
    });
  }
  
  return distractors;
}

/**
 * Helper function to generate identify mode options
 * Returns 4 constellation IDs: 1 correct + 3 wrong options
 */
function generateIdentifyOptions(correct: Constellation, rng: RngFunction): string[] {
  // Get wrong options from other constellations
  const allConstellations = CONSTELLATIONS.filter((c: Constellation) => c.id !== correct.id);
  
  // Fisher-Yates shuffle
  const shuffled = [...allConstellations];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  
  // Pick 3 wrong options
  const options: string[] = [correct.id];
  for (let i = 0; i < Math.min(3, shuffled.length); i++) {
    options.push(shuffled[i].id);
  }
  
  // Ensure we have 4 options - if not enough constellations, repeat some
  while (options.length < 4 && allConstellations.length > 0) {
    options.push(getRandom(allConstellations, rng).id);
  }
  
  // Fisher-Yates shuffle final options
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }
  
  return options;
}
