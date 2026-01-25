import { ALPHABET, WORD_DB, SCENE_DB, PROFILES } from './data';
import { getRandom, uid } from '../engine/rng';
import type { 
  RngFunction, 
  ProfileType, 
  BalanceScaleProblem,
  WordBuilderProblem,
  PatternProblem,
  SentenceLogicProblem,
  MemoryMathProblem,
  RoboPathProblem,
  TimeMatchProblem,
  SyllableBuilderProblem,
  LetterMatchProblem,
  UnitConversionProblem,
  GeneratorFunction
} from '../types/game';

const profileMeta = (profileId: ProfileType) => PROFILES[profileId] || PROFILES.starter;

export const Generators: Record<string, GeneratorFunction> = {
  balance_scale: (level: number, rng: RngFunction = Math.random, profile: ProfileType = 'starter'): BalanceScaleProblem => {
    const meta = profileMeta(profile);
    // Parandatud progressioon: Level 1 = 4-7, Level 5 = 10-15, Level 10 = 15-22
    // Alustame lihtsamalt
    const baseMin = 4;
    const baseMax = 7;
    const levelGrowth = Math.floor(level * 0.6); // Sujuvam kasv
    const profileBoost = meta.difficultyOffset * 1.5; // Advanced profiil +3 (mitte +4)
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
      let offset = Math.floor(rng() * 5) - 2; // -2 kuni +2
      let r = rHidden + offset;
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
    // Parandatud progressioon: Level 1-2 = 3 tähte, Level 3-4 = 4 tähte, Level 5-7 = 5 tähte, Level 8+ = 6-7 tähte
    // Advanced profiil alustab veidi pikemate sõnadega
    const baseLen = meta.difficultyOffset > 0 ? 4 : 3;
    const levelGrowth = Math.floor((level - 1) / 2.5); // Sujuvam kasv
    let len = Math.min(baseLen + levelGrowth, 7);
    if (len < 3) len = 3; 
    
    // Eelista sõnu, mida pole hiljuti kasutatud (parem variatsioon)
    let list = WORD_DB[len] || WORD_DB[4];
    if (!list || list.length === 0) {
      // Fallback - otsi lähimat pikkust
      for (let i = len - 1; i >= 3 && (!list || list.length === 0); i--) {
        list = WORD_DB[i];
      }
      if (!list || list.length === 0) list = WORD_DB[4] || [];
    }
    
    const wordObj = getRandom(list, rng);
    if (!wordObj) {
      throw new Error('No word found for word_builder game');
    } 
    
    const letters = wordObj.w.split('').map((c, i) => ({ 
      char: c, 
      id: `char-${i}-${uid(rng)}` 
    }));
    
    // Parem segamine - tagame, et sõna on tõesti segatud
    let shuffled; 
    let attempts = 0;
    do { 
      shuffled = [...letters].sort(() => rng() - 0.5); 
      attempts++;
    } while (attempts < 10 && shuffled.length > 1 && shuffled.map(l => l.char).join('') === wordObj.w);
    
    return { type: 'word_builder', target: wordObj.w, emoji: wordObj.e, shuffled, uid: uid(rng) };
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
    if (!A || !B || !C) {
      throw new Error('Not enough pattern items');
    }
    const meta = profileMeta(profile);
    const harder = meta.difficultyOffset > 0;
    
    let seq: string[] = [];
    let ans = '';
    // Sujuvam progressioon leveli järgi - parandatud loogika
    if (harder) {
      // Advanced profiil - raskemad mustrid
      if (level <= 2) { 
        seq = [A, B, A, B, A]; 
        ans = B; // Järgmine peaks olema B (A, B, A, B, A, B)
      } 
      else if (level <= 4) { 
        seq = [A, B, A, C, A, B]; 
        ans = C; // Järgmine peaks olema C (A, B, A, C, A, B, C)
      } 
      else if (level <= 6) { 
        seq = [A, B, C, A, B, C]; 
        ans = A; // Järgmine peaks olema A (A, B, C, A, B, C, A)
      } 
      else { 
        seq = [A, B, B, C, A, B]; 
        ans = C; // Järgmine peaks olema C (A, B, B, C, A, B, C)
      }
    } else {
      // Starter profiil - lihtsamad mustrid
      if (level <= 2) { 
        seq = [A, B, A, B]; 
        ans = A; // Järgmine peaks olema A (A, B, A, B, A)
      } 
      else if (level <= 4) { 
        seq = [A, A, B, A, A]; 
        ans = B; // Järgmine peaks olema B (A, A, B, A, A, B)
      } 
      else if (level <= 6) { 
        seq = [A, B, C, A, B]; 
        ans = C; // Järgmine peaks olema C (A, B, C, A, B, C)
      } 
      else { 
        seq = [A, B, B, A, B]; 
        ans = B; // Järgmine peaks olema B (A, B, B, A, B, B)
      }
    }

    // Tagame, et õige vastus on alati valikute seas
    const opts = new Set([ans]); 
    while(opts.size < 3) {
      const randomItem = getRandom(items, rng);
      if (randomItem && randomItem !== ans) opts.add(randomItem);
    }
    
    return { 
      type: 'pattern', 
      sequence: seq, 
      answer: ans, 
      options: Array.from(opts).sort(() => rng() - 0.5), 
      uid: uid(rng) 
    };
  },

  memory_math: (level: number, rng: RngFunction = Math.random, profile: ProfileType = 'starter'): MemoryMathProblem => {
    const meta = profileMeta(profile);
    const harder = meta.difficultyOffset > 0;
    // Parandatud card count progressioon - sujuvam
    const baseCards = harder ? 8 : 6;
    const cardGrowth = Math.floor(level / 2.5); // Sujuvam kasv
    const cardCount = Math.min(baseCards + cardGrowth * 2, harder ? 14 : 12);
    // Parandatud maxSum progressioon - sujuvam
    const baseMax = harder ? 15 : 10;
    const sumGrowth = Math.floor(level * 2); // Aeglasem kasv
    const maxSum = Math.min(baseMax + sumGrowth, harder ? 35 : 25); 
    const pairs: Array<{ eq: string; ans: number }> = [];
    const cards: Array<{ id: string; content: string; matched?: boolean }> = [];
    
    while(pairs.length < cardCount / 2) { 
      const sum = Math.floor(rng() * (maxSum - 3)) + 3; 
      if (pairs.some(p => p.ans === sum)) continue;

      const a = Math.floor(rng() * (sum - 1)) + 1;
      const eq = `${a} + ${sum-a}`;
      const id = pairs.length; 
      pairs.push({ eq, ans: sum });
      cards.push({ id: `q-${id}`, content: eq });
      cards.push({ id: `a-${id}`, content: `${sum}` });
    }
    return { type: 'memory_math', cards: cards.sort(() => rng() - 0.5), pairs, uid: uid(rng) };
  },

  sentence_logic: (level: number, rng: RngFunction = Math.random, _profile: ProfileType = 'starter'): SentenceLogicProblem => {
    const allScenes = Object.keys(SCENE_DB);
    
    // Progressioon: Level 1-2 = lihtsamad stseenid (3-4 positsiooni), Level 3-5 = keskmised (4-5), Level 6+ = kõik
    const sceneKeys = level <= 2
      ? allScenes.filter(k => {
          const scene = SCENE_DB[k];
          return scene && scene.positions && scene.positions.length <= 4;
        }) // Lihtsamad: forest, space
      : level <= 5
      ? allScenes.filter(k => {
          const scene = SCENE_DB[k];
          return scene && scene.positions && scene.positions.length <= 5;
        }) // Keskmised: room, park, beach
      : allScenes; // Kõik stseenid
    
    const sceneKey = getRandom(sceneKeys, rng) || getRandom(allScenes, rng);
    if (!sceneKey) {
      throw new Error('No scene found for sentence_logic game');
    }
    const scene = SCENE_DB[sceneKey];
    if (!scene) {
      throw new Error('Scene not found in SCENE_DB');
    }
    
    // Vali subject ja anchor, mis loogiliselt sobivad kokku
    const subject = getRandom(scene.subjects, rng);
    if (!subject) {
      throw new Error('No subject found for sentence_logic game');
    }
    const anchor = getRandom(scene.anchors, rng);
    if (!anchor) {
      throw new Error('No anchor found for sentence_logic game');
    }
    const validPositions = scene.positions;
    const correctPos = getRandom(validPositions, rng);
    if (!correctPos) {
      throw new Error('No position found for sentence_logic game');
    }
    
    const correctOption = { 
      id: 'correct', 
      scene: sceneKey, 
      sceneName: scene.name,
      bg: scene.bg, 
      s: subject, 
      a: anchor, 
      pos: correctPos 
    };
    
    // Genereeri valeid valikuid - SELGEMALT ERINEVAD, ANCHOR ALATI NÄHTAV
    const wrongOptions = [];
    
    // Vale 1: Erinev objekt + erinev positsioon
    // Level 1-2: sama anchor (et oleks lihtsam ja anchor nähtav)
    // Level 3+: erinev anchor (raskem)
    const subjectPool1 = scene.subjects.filter(s => s.n !== subject.n && s.e !== subject.e);
    const wrongSubject1 = getRandom(subjectPool1.length > 0 ? subjectPool1 : scene.subjects.filter(s => s.n !== subject.n), rng);
    let wrongPos1 = getRandom(validPositions, rng);
    if (!wrongPos1) wrongPos1 = correctPos;
    let attempts = 0;
    while (wrongPos1 === correctPos && validPositions.length > 1 && attempts < 10) {
      wrongPos1 = getRandom(validPositions, rng);
      attempts++;
    }
    // Madalamatel tasemetel sama anchor (selgem), kõrgematel erinev
    const anchorPool1 = scene.anchors.filter(a => a.n !== anchor.n);
    const wrongAnchor1 = (level >= 3 && anchorPool1.length > 0 
      ? getRandom(anchorPool1, rng) 
      : null) || anchor; // Level 1-2: sama anchor
    
    wrongOptions.push({ 
      id: 'wrong1', 
      scene: sceneKey, 
      sceneName: scene.name,
      bg: scene.bg, 
      s: wrongSubject1 || subject, 
      a: wrongAnchor1, 
      pos: wrongPos1 
    });
    
    // Vale 2: Erinev objekt + õige positsioon, aga erinev anchor (Level 3+)
    if (level >= 3) {
      const subjectPool2 = scene.subjects.filter(s => s.n !== subject.n && s.e !== subject.e);
      const wrongSubject2 = getRandom(subjectPool2.length > 0 ? subjectPool2 : scene.subjects.filter(s => s.n !== subject.n), rng);
      const anchorPool2 = scene.anchors.filter(a => a.n !== anchor.n);
      const wrongAnchor2 = (anchorPool2.length > 0 ? getRandom(anchorPool2, rng) : null) || anchor;
      
      wrongOptions.push({ 
        id: 'wrong2', 
        scene: sceneKey, 
        sceneName: scene.name,
        bg: scene.bg, 
        s: wrongSubject2 || subject, 
        a: wrongAnchor2, 
        pos: correctPos 
      });
    }
    
    // Vale 3: Õige objekt, aga erinev anchor + erinev positsioon (Level 5+)
    if (level >= 5) {
      const anchorPool3 = scene.anchors.filter(a => a.n !== anchor.n);
      const wrongAnchor3 = (anchorPool3.length > 0 ? getRandom(anchorPool3, rng) : null) || anchor;
      let wrongPos3 = getRandom(validPositions, rng);
      if (!wrongPos3) wrongPos3 = correctPos;
      attempts = 0;
      while ((wrongPos3 === correctPos || wrongPos3 === wrongPos1) && validPositions.length > 2 && attempts < 10) {
        wrongPos3 = getRandom(validPositions, rng);
        attempts++;
      }
      
      wrongOptions.push({ 
        id: 'wrong3', 
        scene: sceneKey, 
        sceneName: scene.name,
        bg: scene.bg, 
        s: subject, 
        a: wrongAnchor3, 
        pos: wrongPos3 
      });
    }
    
    // Level 7+ - lisa neljas valik (veel raskem)
    const options = level >= 7 && wrongOptions.length >= 3
      ? [
          correctOption,
          ...wrongOptions,
          // Vale 4: Täiesti erinev objekt + erinev anchor + erinev positsioon
          (() => {
            const subjectPool4 = scene.subjects.filter(s => s.n !== subject.n && s.e !== subject.e);
            const wrongSubject4 = getRandom(subjectPool4.length > 0 ? subjectPool4 : scene.subjects.filter(s => s.n !== subject.n), rng);
            const anchorPool4 = scene.anchors.filter(a => a.n !== anchor.n);
            const wrongAnchor4 = (anchorPool4.length > 0 ? getRandom(anchorPool4, rng) : null) || anchor;
            let wrongPos4 = getRandom(validPositions, rng);
            if (!wrongPos4) wrongPos4 = correctPos;
            attempts = 0;
            while ((wrongPos4 === correctPos || wrongPos4 === wrongPos1) && validPositions.length > 2 && attempts < 10) {
              wrongPos4 = getRandom(validPositions, rng);
              attempts++;
            }
            return {
              id: 'wrong4',
              scene: sceneKey,
              sceneName: scene.name,
              bg: scene.bg,
              s: wrongSubject4 || subject,
              a: wrongAnchor4,
              pos: wrongPos4
            };
          })()
        ]
      : [correctOption, ...wrongOptions];
    
    // TAGAME, et õige vastus on alati valikute seas
    const hasCorrect = options.some(opt => opt.id === 'correct');
    if (!hasCorrect) {
      // Kui õige vastus puudub, asenda esimene vale valik õige vastusega
      if (options.length > 0) {
        options[0] = correctOption;
      } else {
        options.push(correctOption);
      }
    }
    
    // TAGAME, et kõik valikud on loogilised (sisaldavad nii subjecti kui anchorit)
    const validatedOptions = options.map(opt => {
      if (!opt.s || !opt.a) {
        // Kui puudub, kasuta õigeid väärtusi
        return {
          ...opt,
          s: opt.s || subject,
          a: opt.a || anchor
        };
      }
      return opt;
    });
    
    const caseType: 'adess' | 'iness' = correctPos === 'SEES' ? 'iness' : 'adess';
    const sentence = `${subject.n} ON ${caseType === 'iness' ? anchor.iness : anchor.adess} ${correctPos}.`;
    
    // Map options to strings for the SentenceLogicProblem
    const optionStrings = validatedOptions.map((_opt, i) => `option-${i}`);
    
    return { 
      type: 'sentence_logic', 
      scene: sceneKey,
      subject,
      anchor,
      position: correctPos,
      caseType,
      sentence,
      options: optionStrings, 
      answer: 'correct',
      uid: uid(rng) 
    };
  },

  letter_match: (level: number, rng: RngFunction = Math.random, _profile: ProfileType = 'starter'): LetterMatchProblem => {
    // Kõrgematel tasemetel kasuta sarnasemaid tähti (raskem)
    const target = getRandom(ALPHABET, rng);
    if (!target) {
      throw new Error('No letter found for letter_match game');
    }
    const opts = new Set([target]);
    
    // Level 1-2: suvalised tähed
    // Level 3-4: sarnased tähed (näiteks A, Ä, E)
    // Level 5+: väga sarnased tähed
    const similarLetters = level >= 5 
      ? ALPHABET.filter(l => {
          // Leia tähed, mis on tähestikus lähedal
          const targetIdx = ALPHABET.indexOf(target);
          return Math.abs(ALPHABET.indexOf(l) - targetIdx) <= 2 && l !== target;
        })
      : level >= 3
      ? ALPHABET.filter(l => {
          // Leia tähed, mis on tähestikus lähedal (laiem)
          const targetIdx = ALPHABET.indexOf(target);
          return Math.abs(ALPHABET.indexOf(l) - targetIdx) <= 5 && l !== target;
        })
      : ALPHABET;
    
    // Level 3+ - näita rohkem valikuid (4 asemel 3)
    const optionCount = level >= 3 ? 4 : 3;
    while(opts.size < optionCount) { 
      const r = getRandom(similarLetters.length > 0 ? similarLetters : ALPHABET, rng); 
      if(r && r !== target) opts.add(r); 
    }
    
    // Find a word that contains the target letter
    let wordObj = null;
    for (const len of Object.keys(WORD_DB)) {
      const words = WORD_DB[parseInt(len)];
      if (words && words.length > 0) {
        wordObj = getRandom(words.filter(w => w.w.includes(target)), rng);
        if (wordObj) break;
      }
    }
    if (!wordObj) {
      wordObj = { w: target, e: '❓' };
    }
    
    const targetPosition = wordObj.w.indexOf(target);
    
    return { 
      type: 'letter_match',
      word: wordObj.w,
      emoji: wordObj.e,
      targetLetter: target,
      targetPosition,
      options: Array.from(opts).map(l => l.toLowerCase()).sort(() => rng() - 0.5), 
      uid: uid(rng) 
    };
  },

  robo_path: (level: number, rng: RngFunction = Math.random, profile: ProfileType = 'starter'): RoboPathProblem => {
    const meta = profileMeta(profile);
    const harder = meta.difficultyOffset > 0;
    // Sujuvam grid size progressioon
    const baseGrid = harder ? 4 : 3;
    const gridGrowth = level >= 4 ? 1 : 0; // Level 4+ = +1 grid size
    const gridSize = Math.min(baseGrid + gridGrowth, 5);
    
    // Parandatud obstacle count progressioon - advanced profiilil alati vähemalt 1 takistus
    const baseObstacles = level === 1 ? 0 : Math.floor((level - 1) / 2); // Iga 2 level = +1 takistus
    const minObstacles = harder ? Math.max(1, Math.floor(level / 2)) : 0; // Advanced: vähemalt 1, level 2+ = vähemalt 2, jne
    const obstacleCount = Math.min(Math.max(baseObstacles, minObstacles) + (harder ? 1 : 0), 5);
    
    const start = {x:0,y:0, dir:'N'}; 
    let end = {x:0,y:0}; 
    const obstacles: Array<{x: number; y: number}> = []; 
    let safety = 0;
    
    do { 
      end = { x: Math.floor(rng() * gridSize), y: Math.floor(rng() * gridSize) }; 
      safety++; 
    } while ((Math.abs(end.x - start.x) + Math.abs(end.y - start.y) < 2) && safety < 20);
    
    safety = 0; 
    while (obstacles.length < obstacleCount && safety < 80) { 
      const obs = { x: Math.floor(rng() * gridSize), y: Math.floor(rng() * gridSize) }; 
      const isStart = obs.x === start.x && obs.y === start.y;
      const isEnd = obs.x === end.x && obs.y === end.y;
      const exists = obstacles.some(o => o.x === obs.x && o.y === obs.y);
      if (!isStart && !isEnd && !exists) obstacles.push(obs); 
      safety++; 
    }
    // Build grid
    const grid: number[][] = Array(gridSize).fill(0).map(() => Array(gridSize).fill(0));
    for (const obs of obstacles) {
      const row = grid[obs.y];
      if (row) {
        row[obs.x] = 1;
      }
    }
    
    // Generate correct path (simplified - just store instructions)
    const correctPath: string[] = [];
    const optionCommands = ['UP', 'DOWN', 'LEFT', 'RIGHT', 'FORWARD', 'TURN_LEFT', 'TURN_RIGHT'];
    
    return { 
      type: 'robo_path',
      grid,
      start: [start.x, start.y],
      goal: [end.x, end.y],
      obstacles: obstacles.map(o => [o.x, o.y] as [number, number]),
      correctPath,
      options: optionCommands,
      uid: uid(rng) 
    };
  },

  syllable_builder: (level: number, rng: RngFunction = Math.random, profile: ProfileType = 'starter'): SyllableBuilderProblem => {
    const words = [
      // 2 silpi - õigesti silbitatud eesti keeles
      { w: 'AU-TO', hint: '🚗', parts: 2 },
      { w: 'KA-LA', hint: '🐟', parts: 2 },
      { w: 'KO-ER', hint: '🐶', parts: 2 },
      { w: 'KA-RU', hint: '🐻', parts: 2 },
      { w: 'LU-MI', hint: '❄️', parts: 2 },
      { w: 'MA-JA', hint: '🏠', parts: 2 },
      { w: 'HE-LI', hint: '🔔', parts: 2 },
      { w: 'MA-RI', hint: '🍓', parts: 2 },
      { w: 'KO-DU', hint: '🏡', parts: 2 },
      { w: 'JÕ-GI', hint: '🏞️', parts: 2 },
      { w: 'ME-RI', hint: '🌊', parts: 2 },
      { w: 'E-MA', hint: '👩', parts: 2 },
      { w: 'I-SA', hint: '👨', parts: 2 },
      { w: 'JÄ-NES', hint: '🐰', parts: 2 },
      { w: 'RA-MAT', hint: '📖', parts: 2 },
      { w: 'RO-BOT', hint: '🤖', parts: 2 },
      { w: 'POR-GAND', hint: '🥕', parts: 2 },
      { w: 'KAR-TUL', hint: '🥔', parts: 2 },
      { w: 'TO-MAT', hint: '🍅', parts: 2 },
      { w: 'JÄÄ-TIS', hint: '🍦', parts: 2 },
      { w: 'KÜP-SIS', hint: '🍪', parts: 2 },
      { w: 'KOMP-VEK', hint: '🍬', parts: 2 },
      { w: 'LEN-NUK', hint: '✈️', parts: 2 },
      { w: 'KO-PTER', hint: '🚁', parts: 2 },
      { w: 'PÕR-SAS', hint: '🐖', parts: 2 },
      { w: 'LAM-MAS', hint: '🐑', parts: 2 },
      { w: 'HO-BU-NE', hint: '🐎', parts: 3 },
      { w: 'LEH-ME', hint: '🐄', parts: 2 },
      { w: 'KON-NI', hint: '🐸', parts: 2 },
      { w: 'SII-LI', hint: '🦔', parts: 2 },
      { w: 'TI-GU', hint: '🐌', parts: 2 },
      { w: 'KIR-SI', hint: '🍒', parts: 2 },
      { w: 'PLOOM', hint: '🍑', parts: 1 },
      { w: 'MAA-SIK', hint: '🍓', parts: 2 },
      { w: 'SID-RUN', hint: '🍋', parts: 2 },
      { w: 'PÄH-KEL', hint: '🌰', parts: 2 },
      { w: 'JUUST', hint: '🧀', parts: 1 },
      { w: 'PI-TSA', hint: '🍕', parts: 2 },
      { w: 'BUR-GER', hint: '🍔', parts: 2 },
      { w: 'KUR-GI', hint: '🥒', parts: 2 },
      { w: 'AR-BUUS', hint: '🍉', parts: 2 },
      { w: 'TOO-LI', hint: '🪑', parts: 2 },
      { w: 'LAM-PI', hint: '💡', parts: 2 },
      { w: 'UK-SE', hint: '🚪', parts: 2 },
      { w: 'KAP-PI', hint: '📦', parts: 2 },
      { w: 'PLII-ATS', hint: '✏️', parts: 2 },
      { w: 'AR-VU-TI', hint: '💻', parts: 2 },
      { w: 'TE-LE-FON', hint: '📱', parts: 2 },
      { w: 'EK-RAAN', hint: '🖥️', parts: 2 },
      { w: 'KOH-VE-RI', hint: '🧳', parts: 2 },
      { w: 'PRIL-LID', hint: '👓', parts: 2 },
      { w: 'KIN-DAD', hint: '🧤', parts: 2 },
      { w: 'MÜT-SI', hint: '🧢', parts: 2 },
      { w: 'KELL', hint: '⌚', parts: 1 },
      { w: 'PUS-LI', hint: '🧩', parts: 2 },
      { w: 'KLOT-SID', hint: '🧱', parts: 2 },
      { w: 'LU-SI-KAS', hint: '🥄', parts: 3 },
      { w: 'NU-GA', hint: '🔪', parts: 2 },
      { w: 'BUSS-I', hint: '🚌', parts: 2 },
      { w: 'TRAM-MI', hint: '🚊', parts: 2 },
      { w: 'RON-GI', hint: '🚆', parts: 2 },
      { w: 'LAE-VI', hint: '⛵', parts: 2 },
      { w: 'PAA-TI', hint: '🛶', parts: 2 },
      { w: 'RA-TAS', hint: '🚲', parts: 2 },
      { w: 'RU-LA', hint: '🛹', parts: 2 },
      { w: 'SÕ-BRA', hint: '🤝', parts: 2 },
      { w: 'AR-STI', hint: '🧑‍⚕️', parts: 2 },
      { w: 'KOK-KI', hint: '👨‍🍳', parts: 2 },
      { w: 'RÕÕ-MU', hint: '😄', parts: 2 },
      { w: 'KUR-BUS', hint: '😢', parts: 2 },
      { w: 'ÜLLA-TUS', hint: '😮', parts: 2 },
      { w: 'U-NI', hint: '😴', parts: 2 },
      { w: 'KOR-VI', hint: '🏀', parts: 2 },
      { w: 'TEN-NIS', hint: '🎾', parts: 2 },
      { w: 'GOL-FI', hint: '⛳', parts: 2 },
      { w: 'UIS-KU', hint: '⛸️', parts: 2 },
      { w: 'KEL-GI', hint: '🛷', parts: 2 },
      { w: 'VIB-U', hint: '🏹', parts: 2 },
      { w: 'KLAS-SI', hint: '🏫', parts: 2 },
      { w: 'ÕPI-KU', hint: '📘', parts: 2 },
      { w: 'MUUSI-KA', hint: '🎼', parts: 2 },
      
      // 3 silpi - õigesti silbitatud
      { w: 'LI-MO-NAAD', hint: '🥤', parts: 3 },
      { w: 'PO-LIT-SEI', hint: '👮', parts: 3 },
      { w: 'LU-ME-IN-GEL', hint: '❄️', parts: 4 },
      { w: 'MA-RA-TON', hint: '🏃', parts: 3 },
      { w: 'TE-LE-FON', hint: '📱', parts: 3 },
      { w: 'AR-VU-TI', hint: '💻', parts: 3 },
      { w: 'ÕPI-LA-NE', hint: '👨‍🎓', parts: 3 },
      { w: 'ÕPE-TA-JA', hint: '🧑‍🏫', parts: 3 },
      { w: 'E-LE-VANT', hint: '🐘', parts: 3 },
      { w: 'KI-RAHV', hint: '🦒', parts: 2 },
      { w: 'PING-VIIN', hint: '🐧', parts: 3 },
      { w: 'KRO-KO-DILL', hint: '🐊', parts: 3 },
      { w: 'KILP-KONN', hint: '🐢', parts: 3 },
      { w: 'RE-BA-NE', hint: '🦊', parts: 3 },
      { w: 'SE-BRA', hint: '🦓', parts: 3 },
      { w: 'LÕ-VI', hint: '🦁', parts: 3 },
      { w: 'TII-GER', hint: '🐯', parts: 3 },
      { w: 'PAN-DA', hint: '🐼', parts: 3 },
      { w: 'KI-RAH-VI', hint: '🦒', parts: 3 },
      { w: 'PING-VIIN', hint: '🐧', parts: 3 },
      { w: 'ÄMB-LIK', hint: '🕷️', parts: 3 },
      { w: 'DRAA-KON', hint: '🐉', parts: 3 },
      { w: 'BUR-GER', hint: '🍔', parts: 3 },
      { w: 'KAR-TU-LI', hint: '🥔', parts: 3 },
      { w: 'POR-GAND', hint: '🥕', parts: 2 },
      { w: 'MAA-SI-KAS', hint: '🍓', parts: 3 },
      { w: 'AR-BUUS', hint: '🍉', parts: 2 },
      { w: 'SID-RUN', hint: '🍋', parts: 2 },
      { w: 'KOMP-VEK', hint: '🍬', parts: 2 },
      { w: 'JÄÄ-TIS', hint: '🍦', parts: 2 },
      { w: 'KÜP-SIS', hint: '🍪', parts: 2 },
      { w: 'KOOK', hint: '🍰', parts: 1 },
      { w: 'ME-SI', hint: '🍯', parts: 3 },
      { w: 'KOH-VI', hint: '☕', parts: 3 },
      { w: 'TE-E', hint: '🫖', parts: 3 },
      { w: 'VOODI', hint: '🛌', parts: 2 },
      { w: 'KÖÖK', hint: '🍳', parts: 1 },
      { w: 'DII-VAN', hint: '🛋️', parts: 2 },
      { w: 'KÄÄ-RID', hint: '✂️', parts: 2 },
      { w: 'PRIL-LID', hint: '👓', parts: 2 },
      { w: 'KIN-DAD', hint: '🧤', parts: 2 },
      { w: 'KLOT-SID', hint: '🧱', parts: 2 },
      { w: 'LU-SI-KAS', hint: '🥄', parts: 3 },
      { w: 'NU-GA', hint: '🔪', parts: 3 },
      { w: 'LEN-NUK', hint: '✈️', parts: 2 },
      { w: 'KOP-TER', hint: '🚁', parts: 2 },
      { w: 'MO-PEED', hint: '🛵', parts: 2 },
      { w: 'VEOK', hint: '🚚', parts: 1 },
      { w: 'TROL-LI-BUSS', hint: '🚎', parts: 3 },
      { w: 'VANA-EMA', hint: '👵', parts: 3 },
      { w: 'VANA-ISA', hint: '👴', parts: 3 },
      { w: 'PÄÄST-JA', hint: '🧑‍🚒', parts: 3 },
      { w: 'MAAD-LUS', hint: '🤼', parts: 3 },
      { w: 'JALG-PALL', hint: '⚽', parts: 3 },
      { w: 'KORV-PALL', hint: '🏀', parts: 3 },
      { w: 'VÕRK-PALL', hint: '🏐', parts: 3 },
      { w: 'JÕU-SAAL', hint: '🏋️', parts: 3 },
      { w: 'JOOKS-MINE', hint: '🏃', parts: 3 },
      { w: 'UJU-MINE', hint: '🏊', parts: 3 },
      { w: 'PU-NA-NE', hint: '🔴', parts: 3 },
      { w: 'SI-NI-NE', hint: '🔵', parts: 3 },
      { w: 'RO-HE-LI-NE', hint: '🟢', parts: 4 },
      { w: 'KOL-LA-NE', hint: '🟡', parts: 3 },
      { w: 'VAL-GE', hint: '⚪', parts: 2 },
      { w: 'LIL-LA', hint: '🟣', parts: 2 },
      { w: 'O-RANŽ', hint: '🟠', parts: 2 },
      { w: 'PE-A', hint: '👤', parts: 2 },
      { w: 'KÄ-SI', hint: '✋', parts: 2 },
      { w: 'JAL-GA', hint: '🦵', parts: 2 },
      { w: 'SIL-MA', hint: '👁️', parts: 2 },
      { w: 'KÕR-VA', hint: '👂', parts: 2 },
      { w: 'NI-NA', hint: '👃', parts: 2 },
      { w: 'SU-U', hint: '👄', parts: 2 },
      { w: 'VIH-MA', hint: '🌧️', parts: 2 },
      { w: 'LU-ME-SA-DU', hint: '❄️', parts: 4 },
      { w: 'TUI-SKU', hint: '🌨️', parts: 2 },
      { w: 'PÄI-KE', hint: '☀️', parts: 2 },
      { w: 'PIL-VE', hint: '☁️', parts: 2 },
      { w: 'VIH-MA-VAR-JU', hint: '🌦️', parts: 4 },
      
      // 4 silpi
      { w: 'HE-LI-KOP-TER', hint: '🚁', parts: 4 },
      { w: 'TE-LE-VI-SI-OON', hint: '📺', parts: 5 },
      { w: 'MA-GA-MIS-TU-BA', hint: '🛏️', parts: 5 },
      { w: 'KIR-JU-TUS-LAUD', hint: '🪑', parts: 4 },
      { w: 'VII-NA-MA-RI', hint: '🍇', parts: 4 },
      { w: 'A-NA-NASS', hint: '🍍', parts: 3 },
      { w: 'MO-TOOR-RA-TAS', hint: '🏍️', parts: 4 },
      { w: 'VAN-NI-TU-BA', hint: '🛁', parts: 4 },
    ];
    // Filtreeri leveli järgi - kõrgematel tasemetel pikemad sõnad
    const meta = profileMeta(profile);
    // Sujuvam progressioon: Level 1-2 = 2 silpi, Level 3-5 = 3 silpi, Level 6+ = 3-4 silpi
    const targetParts = level <= 2 ? 2 : level <= 5 ? 3 : level <= 7 ? 3 : 4;
    const filtered = words.filter(item => {
      const partsCount = item.parts || item.w.split('-').length;
      if (meta.difficultyOffset > 0) {
        // Advanced profiil - võib olla veidi raskem
        return partsCount >= Math.max(2, targetParts - (level <= 3 ? 0 : 1));
      }
      return partsCount <= targetParts;
    });
    const wordObj = getRandom(filtered, rng);
    if (!wordObj) {
      throw new Error('No word found for syllable_builder game');
    }
    const syllables = wordObj.w.split('-');
    const shuffled = syllables.map((text, i) => ({ 
      text, 
      id: `syl-${i}-${uid(rng)}` 
    })).sort(() => rng() - 0.5);
    
    return { 
      type: 'syllable_builder', 
      target: syllables.join(''),
      emoji: wordObj.hint,
      syllables,
      shuffled,
      uid: uid(rng) 
    };
  },

  time_match: (level: number, rng: RngFunction = Math.random, _profile: ProfileType = 'advanced'): TimeMatchProblem => {
    // Sujuvam step progressioon
    const step = level <= 2 ? 30 : level <= 4 ? 15 : level <= 6 ? 10 : 5; // minute step
    const hour24 = Math.floor(rng() * 24);
    const minute = Math.floor(rng() * (60/step)) * step;
    const toLabel = (h24: number, m: number) => `${h24.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}`;
    const correct = toLabel(hour24, minute);
    const opts = new Set([correct]);
    while(opts.size < 3) {
      const delta = (Math.floor(rng()*3)+1) * step;
      const sign = rng() > 0.5 ? 1 : -1;
      let m2 = (minute + sign * delta + 60) % 60;
      let h2 = (hour24 + (minute + sign * delta < 0 ? -1 : 0) + 24) % 24;
      opts.add(toLabel(h2, m2));
    }
    return { 
      type: 'time_match',
      hours: hour24,
      minutes: minute,
      display: `${(hour24 % 12 || 12).toString().padStart(2,'0')}:${minute.toString().padStart(2,'0')}`,
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
        { from: 'm', to: 'cm', factor: 100, emoji: '📏', name: 'meetrit', toName: 'sentimeetrit' },
        { from: 'km', to: 'm', factor: 1000, emoji: '📐', name: 'kilomeetrit', toName: 'meetrit' },
        { from: 'cm', to: 'mm', factor: 10, emoji: '📏', name: 'sentimeetrit', toName: 'millimeetrit' }
      ],
      mass: [
        { from: 'kg', to: 'g', factor: 1000, emoji: '⚖️', name: 'kilogrammi', toName: 'grammi' },
        { from: 't', to: 'kg', factor: 1000, emoji: '🏋️', name: 'tonni', toName: 'kilogrammi' }
      ],
      volume: [
        { from: 'l', to: 'ml', factor: 1000, emoji: '🧪', name: 'liitrit', toName: 'milliliitrit' },
        { from: 'l', to: 'dl', factor: 10, emoji: '🥛', name: 'liitrit', toName: 'detsiliitrit' }
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

    const question = `Mitu ${selectedConversion.toName} on ${value} ${selectedConversion.name}?`;

    return {
      type: 'unit_conversion',
      value,
      fromUnit: selectedConversion.from,
      toUnit: selectedConversion.to,
      category: unitType,
      question,
      answer: correctAnswer,
      options,
      uid: uid(rng)
    };
  }
};
