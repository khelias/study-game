import { ALPHABET, WORD_DB, SCENE_DB, PROFILES } from './data';
import { getRandom, uid } from '../engine/rng';

const profileMeta = (profileId) => PROFILES[profileId] || PROFILES.starter;

export const Generators = {
  balance_scale: (level, rng = Math.random, profile = 'starter') => {
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
  
  word_builder: (level, rng = Math.random, profile = 'starter') => {
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

  pattern: (level, rng = Math.random, profile = 'starter') => {
    const THEMES = [ 
      ['🔴','🔵','🟢','🟡'], 
      ['🐶','🐱','🐸','🦁'], 
      ['🍎','🍌','🍇','🍉'], 
      ['⚽','🏀','🎾','🎱'],
      ['🚗','🚕','🚙','🚌']
    ];
    const items = getRandom(THEMES, rng); 
    const pool = [...items].sort(() => rng() - 0.5); 
    const [A, B, C] = pool;
    const meta = profileMeta(profile);
    const harder = meta.difficultyOffset > 0;
    
    let seq = [], ans = '';
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
      if (randomItem !== ans) opts.add(randomItem);
    }
    
    return { 
      type: 'pattern', 
      sequence: seq, 
      answer: ans, 
      options: Array.from(opts).sort(() => rng() - 0.5), 
      uid: uid(rng) 
    };
  },

  memory_math: (level, rng = Math.random, profile = 'starter') => {
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
    const pairs = []; 
    
    while(pairs.length < cardCount) { 
      const sum = Math.floor(rng() * (maxSum - 3)) + 3; 
      const a = Math.floor(rng() * (sum - 1)) + 1; 
      if (pairs.some(p => p.matchId === sum)) continue;

      const id = pairs.length; 
      pairs.push({ id: `q-${id}`, content: `${a} + ${sum-a}`, matchId: sum, type: 'math', flipped: false, solved: false }); 
      pairs.push({ id: `a-${id}`, content: `${sum}`, matchId: sum, type: 'answer', flipped: false, solved: false }); 
    }
    return { type: 'memory_math', cards: pairs.sort(() => rng() - 0.5), uid: uid(rng) };
  },

  sentence_logic: (level, rng = Math.random, profile = 'starter') => {
    const meta = profileMeta(profile);
    const allScenes = Object.keys(SCENE_DB);
    
    // Progressioon: Level 1-2 = lihtsamad stseenid (3-4 positsiooni), Level 3-5 = keskmised (4-5), Level 6+ = kõik
    const sceneKeys = level <= 2
      ? allScenes.filter(k => SCENE_DB[k].positions.length <= 4) // Lihtsamad: forest, space
      : level <= 5
      ? allScenes.filter(k => SCENE_DB[k].positions.length <= 5) // Keskmised: room, park, beach
      : allScenes; // Kõik stseenid
    
    const sceneKey = getRandom(sceneKeys, rng) || getRandom(allScenes, rng); 
    const scene = SCENE_DB[sceneKey];
    
    // Vali subject ja anchor, mis loogiliselt sobivad kokku
    const subject = getRandom(scene.subjects, rng) || {n:'?', e:'❓'}; 
    const anchor = getRandom(scene.anchors, rng) || {n:'?', e:'📦'};
    const validPositions = scene.positions;
    const correctPos = getRandom(validPositions, rng);
    
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
    let attempts = 0;
    while (wrongPos1 === correctPos && validPositions.length > 1 && attempts < 10) {
      wrongPos1 = getRandom(validPositions, rng);
      attempts++;
    }
    // Madalamatel tasemetel sama anchor (selgem), kõrgematel erinev
    const anchorPool1 = scene.anchors.filter(a => a.n !== anchor.n);
    const wrongAnchor1 = level >= 3 && anchorPool1.length > 0 
      ? getRandom(anchorPool1, rng) 
      : anchor; // Level 1-2: sama anchor
    
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
      const wrongAnchor2 = anchorPool2.length > 0 ? getRandom(anchorPool2, rng) : anchor;
      
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
      const wrongAnchor3 = anchorPool3.length > 0 ? getRandom(anchorPool3, rng) : anchor;
      let wrongPos3 = getRandom(validPositions, rng);
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
            const wrongAnchor4 = anchorPool4.length > 0 ? getRandom(anchorPool4, rng) : anchor;
            let wrongPos4 = getRandom(validPositions, rng);
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
    
    return { 
      type: 'sentence_logic', 
      display: `${subject.n} ON ${anchor.n} ${correctPos}.`, 
      answer: 'correct', 
      options: validatedOptions.sort(() => rng() - 0.5), 
      sceneName: scene.name,
      uid: uid(rng) 
    };
  },

  letter_match: (level, rng = Math.random, profile = 'starter') => {
    // Kõrgematel tasemetel kasuta sarnasemaid tähti (raskem)
    const target = getRandom(ALPHABET, rng);
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
      if(r !== target) opts.add(r); 
    }
    return { 
      type: 'letter_match', 
      display: target, 
      answer: target.toLowerCase(), 
      options: Array.from(opts).map(l => l.toLowerCase()).sort(() => rng() - 0.5), 
      uid: uid(rng) 
    };
  },

  robo_path: (level, rng = Math.random, profile = 'starter') => {
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
    const obstacles = []; 
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
    const controlMode = harder ? 'turtle' : 'arrow'; // turtle: TURN/MOVE, arrow: direct
    const maxCommands = harder ? 12 : 10;

    return { type: 'robo_path', gridSize, start, end, obstacles, controlMode, maxCommands, uid: uid(rng) };
  },

  syllable_builder: (level, rng = Math.random, profile = 'starter') => {
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
      { w: 'HOBU-NE', hint: '🐎', parts: 2 },
      { w: 'LEH-ME', hint: '🐄', parts: 2 },
      { w: 'KON-NI', hint: '🐸', parts: 2 },
      { w: 'SII-LI', hint: '🦔', parts: 2 },
      { w: 'TI-GU', hint: '🐌', parts: 2 },
      { w: 'KIR-SI', hint: '🍒', parts: 2 },
      { w: 'PLO-MI', hint: '🍑', parts: 2 },
      { w: 'MAA-SIK', hint: '🍓', parts: 2 },
      { w: 'SID-RUN', hint: '🍋', parts: 2 },
      { w: 'PÄH-KEL', hint: '🌰', parts: 2 },
      { w: 'JU-US-TI', hint: '🧀', parts: 2 },
      { w: 'PI-TSA', hint: '🍕', parts: 2 },
      { w: 'BUR-GER', hint: '🍔', parts: 2 },
      { w: 'KUR-GI', hint: '🥒', parts: 2 },
      { w: 'AR-BUUS', hint: '🍉', parts: 2 },
      { w: 'TOO-LI', hint: '🪑', parts: 2 },
      { w: 'LAM-PI', hint: '💡', parts: 2 },
      { w: 'UK-SE', hint: '🚪', parts: 2 },
      { w: 'KAP-PI', hint: '📦', parts: 2 },
      { w: 'PLIIA-TSI', hint: '✏️', parts: 2 },
      { w: 'AR-VU-TI', hint: '💻', parts: 2 },
      { w: 'TE-LE-FON', hint: '📱', parts: 2 },
      { w: 'EK-RAA-NI', hint: '🖥️', parts: 2 },
      { w: 'KOH-VE-RI', hint: '🧳', parts: 2 },
      { w: 'PRIL-LID', hint: '👓', parts: 2 },
      { w: 'KIN-DAD', hint: '🧤', parts: 2 },
      { w: 'MÜT-SI', hint: '🧢', parts: 2 },
      { w: 'KE-L-LI', hint: '⌚', parts: 2 },
      { w: 'PUS-LI', hint: '🧩', parts: 2 },
      { w: 'KLOT-SID', hint: '🧱', parts: 2 },
      { w: 'LUSI-KAS', hint: '🥄', parts: 2 },
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
      { w: 'LU-ME-INGEL', hint: '❄️', parts: 3 },
      { w: 'MA-RA-TON', hint: '🏃', parts: 3 },
      { w: 'TE-LE-FON', hint: '📱', parts: 3 },
      { w: 'AR-VU-TI', hint: '💻', parts: 3 },
      { w: 'ÕPI-LA-NE', hint: '👨‍🎓', parts: 3 },
      { w: 'ÕPE-TA-JA', hint: '🧑‍🏫', parts: 3 },
      { w: 'ELE-VANT', hint: '🐘', parts: 3 },
      { w: 'KIR-AHV', hint: '🦒', parts: 3 },
      { w: 'PING-VIIN', hint: '🐧', parts: 3 },
      { w: 'KRO-KO-DILL', hint: '🐊', parts: 3 },
      { w: 'KILP-KONN', hint: '🐢', parts: 3 },
      { w: 'RE-BA-NE', hint: '🦊', parts: 3 },
      { w: 'SE-BRA', hint: '🦓', parts: 3 },
      { w: 'LÕ-VI', hint: '🦁', parts: 3 },
      { w: 'TII-GER', hint: '🐯', parts: 3 },
      { w: 'PAN-DA', hint: '🐼', parts: 3 },
      { w: 'KIRAH-VI', hint: '🦒', parts: 3 },
      { w: 'PING-VIIN', hint: '🐧', parts: 3 },
      { w: 'ÄMB-LIK', hint: '🕷️', parts: 3 },
      { w: 'DRAA-KON', hint: '🐉', parts: 3 },
      { w: 'BUR-GER', hint: '🍔', parts: 3 },
      { w: 'KAR-TU-LI', hint: '🥔', parts: 3 },
      { w: 'POR-GAN-DI', hint: '🥕', parts: 3 },
      { w: 'MAAS-I-KU', hint: '🍓', parts: 3 },
      { w: 'ARBUU-SI', hint: '🍉', parts: 3 },
      { w: 'SIDRU-NI', hint: '🍋', parts: 3 },
      { w: 'KOMP-VE-KI', hint: '🍬', parts: 3 },
      { w: 'JÄÄTI-SI', hint: '🍦', parts: 3 },
      { w: 'KÜPSI-SI', hint: '🍪', parts: 3 },
      { w: 'KOO-GI', hint: '🍰', parts: 3 },
      { w: 'ME-SI', hint: '🍯', parts: 3 },
      { w: 'KOH-VI', hint: '☕', parts: 3 },
      { w: 'TE-E', hint: '🫖', parts: 3 },
      { w: 'VOO-DI', hint: '🛌', parts: 2 },
      { w: 'KÖÖ-GI', hint: '🍳', parts: 2 },
      { w: 'DII-VA-NI', hint: '🛋️', parts: 3 },
      { w: 'KÄÄRI-DI', hint: '✂️', parts: 3 },
      { w: 'PRILLI-DI', hint: '👓', parts: 3 },
      { w: 'KINDA-DI', hint: '🧤', parts: 3 },
      { w: 'KLOTSI-DI', hint: '🧱', parts: 3 },
      { w: 'LUSIKA-SI', hint: '🥄', parts: 3 },
      { w: 'NU-GA', hint: '🔪', parts: 3 },
      { w: 'LEN-NU-KI', hint: '✈️', parts: 3 },
      { w: 'KOP-TE-RI', hint: '🚁', parts: 3 },
      { w: 'MO-PEED', hint: '🛵', parts: 2 },
      { w: 'VEO-GI', hint: '🚚', parts: 2 },
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
      { w: 'VIH-MA-VAR-JUD', hint: '🌦️', parts: 4 },
      
      // 4 silpi
      { w: 'HE-LI-KOP-TER', hint: '🚁', parts: 4 },
      { w: 'TE-LE-VI-SIOON', hint: '📺', parts: 4 },
      { w: 'MAG-A-MIS-TU-BA', hint: '🛏️', parts: 4 },
      { w: 'KIR-JU-TUS-LAUD', hint: '🪑', parts: 4 },
      { w: 'VI-NA-MA-RI', hint: '🍇', parts: 4 },
      { w: 'A-NAN-ASS', hint: '🍍', parts: 4 },
      { w: 'MO-TO-RRA-TAS', hint: '🏍️', parts: 4 },
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
    const wordObj = getRandom(filtered, rng) || words[0];
    const parts = wordObj.w.split('-');
    const shuffled = [...parts].sort(() => rng() - 0.5);
    return { 
      type: 'syllable_builder', 
      target: parts.join(''), 
      parts,
      shuffled,
      hint: wordObj.hint,
      uid: uid(rng) 
    };
  },

  time_match: (level, rng = Math.random, profile = 'advanced') => {
    const meta = profileMeta(profile);
    const harder = meta.difficultyOffset > 0;
    // Sujuvam step progressioon
    const step = level <= 2 ? 30 : level <= 4 ? 15 : level <= 6 ? 10 : 5; // minute step
    const hour24 = Math.floor(rng() * 24);
    const minute = Math.floor(rng() * (60/step)) * step;
    const toLabel = (h24, m) => `${h24.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}`;
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
      display: { hour: hour24 % 12, minute },
      answer: correct,
      options: Array.from(opts).sort(() => rng() - 0.5),
      uid: uid(rng)
    };
  }
};
