export const APP_KEY = 'smart_adv_v45_pro';

export const THEME = {
  orange: { bg: 'bg-orange-50', border: 'border-orange-500', text: 'text-orange-600', iconBg: 'bg-orange-100', accent: 'bg-orange-500' },
  purple: { bg: 'bg-purple-50', border: 'border-purple-500', text: 'text-purple-600', iconBg: 'bg-purple-100', accent: 'bg-purple-500' },
  green:  { bg: 'bg-green-50',  border: 'border-green-500',  text: 'text-green-600',  iconBg: 'bg-green-100', accent: 'bg-green-500' },
  blue:   { bg: 'bg-blue-50',   border: 'border-blue-500',   text: 'text-blue-600',   iconBg: 'bg-blue-100', accent: 'bg-blue-500' },
  pink:   { bg: 'bg-pink-50',   border: 'border-pink-500',   text: 'text-pink-600',   iconBg: 'bg-pink-100', accent: 'bg-pink-500' },
  teal:   { bg: 'bg-teal-50',   border: 'border-teal-500',   text: 'text-teal-600',   iconBg: 'bg-teal-100', accent: 'bg-teal-500' },
  indigo: { bg: 'bg-indigo-50', border: 'border-indigo-500', text: 'text-indigo-600', iconBg: 'bg-indigo-100', accent: 'bg-indigo-500' },
};

export const GAME_CONFIG = {
  // 5+ mängud - lihtsamad, visuaalsed (7 mängu - lisatud letter_match)
  word_builder:    { id: 'word_builder', title: 'SÕNAMEISTER', theme: THEME.orange, icon: 'Type', desc: 'Lao tähtedest sõna', allowedProfiles: ['starter'], difficulty: 'easy' },
  syllable_builder:{ id: 'syllable_builder', title: 'SILBIMEISTER', theme: THEME.orange, icon: 'Type', desc: 'Pane silbid sõnaks', allowedProfiles: ['starter'], difficulty: 'easy' },
  pattern:         { id: 'pattern', title: 'MUSTRI-RONG', theme: THEME.teal, icon: 'TrainFront', desc: 'Jätka mustrit', allowedProfiles: ['starter'], difficulty: 'easy' },
  sentence_logic:  { id: 'sentence_logic', title: 'LAUSE-DETEKTIIV', theme: THEME.green, icon: 'BookOpen', desc: 'Kus asub ese?', allowedProfiles: ['starter'], difficulty: 'medium' },
  memory_math:     { id: 'memory_math', title: 'MATEMAATIKA MÄLU', theme: THEME.purple, icon: 'Brain', desc: 'Leia tehe ja vastus', allowedProfiles: ['starter'], difficulty: 'medium' },
  robo_path:       { id: 'robo_path', title: 'ROBO-RADA', theme: THEME.indigo, icon: 'Bot', desc: 'Programmeerirobot', allowedProfiles: ['starter'], difficulty: 'medium' },
  letter_match:    { id: 'letter_match', title: 'TÄHE-DETEKTIIV', theme: THEME.pink, icon: 'Type', desc: 'Leia õige täht', allowedProfiles: ['starter'], difficulty: 'easy' },
  
  // 8+ mängud - raskemad, loogilised (7 mängu - lisatud letter_match_adv)
  balance_scale:   { id: 'balance_scale', title: 'KAALUD', theme: THEME.blue, icon: 'Scale', desc: 'Tasakaalusta kaalud', allowedProfiles: ['advanced'], difficulty: 'hard' },
  time_match:      { id: 'time_match', title: 'KELLAMÄNG', theme: THEME.blue, icon: 'Clock3', desc: 'Leia kellaaeg', allowedProfiles: ['advanced'], difficulty: 'hard' },
  memory_math_adv: { id: 'memory_math', title: 'MATEMAATIKA MÄLU', theme: THEME.purple, icon: 'Brain', desc: 'Leia tehe ja vastus', allowedProfiles: ['advanced'], difficulty: 'hard' },
  robo_path_adv:   { id: 'robo_path', title: 'ROBO-RADA', theme: THEME.indigo, icon: 'Bot', desc: 'Programmeerirobot', allowedProfiles: ['advanced'], difficulty: 'hard' },
  sentence_logic_adv: { id: 'sentence_logic', title: 'LAUSE-DETEKTIIV', theme: THEME.green, icon: 'BookOpen', desc: 'Kus asub ese?', allowedProfiles: ['advanced'], difficulty: 'hard' },
  pattern_adv:      { id: 'pattern', title: 'MUSTRI-RONG', theme: THEME.teal, icon: 'TrainFront', desc: 'Jätka mustrit', allowedProfiles: ['advanced'], difficulty: 'hard' },
  letter_match_adv: { id: 'letter_match', title: 'TÄHE-DETEKTIIV', theme: THEME.pink, icon: 'Type', desc: 'Leia õige täht', allowedProfiles: ['advanced'], difficulty: 'medium' },
};

// Profiilid on laiendatavad raskuse nihkega
export const PROFILES = {
  starter:  { id: 'starter', label: '5+', desc: 'Koolieelik', levelStart: 1, difficultyOffset: 0, emoji: '👧' },
  advanced: { id: 'advanced', label: 'Alates 1. klass', desc: 'Kool', levelStart: 3, difficultyOffset: 2, emoji: '🧒' }
};

export const ICONS = {
  Type: 'Type',
  Brain: 'Brain',
  BookOpen: 'BookOpen',
  Scale: 'Scale',
  GraduationCap: 'GraduationCap',
  TrainFront: 'TrainFront',
  Bot: 'Bot',
  Clock3: 'Clock3'
};

export const ALPHABET = 'ABCDEFGHIJKLMNOPRSŠZŽTUVÕÄÖÜ'.split('');

// Lähtume emojodest; ainult eestikeelsed sõnad, valdavalt <=7 tähte
const BASE_WORDS = [
  // loodus ja ilm
  { w: 'PUU', e: '🌳' }, { w: 'PÕÕSAS', e: '🌿' }, { w: 'LILL', e: '🌸' }, { w: 'LEHT', e: '🍃' },
  { w: 'METS', e: '🌲' }, { w: 'MÄGI', e: '⛰️' }, { w: 'JÕGI', e: '🏞️' }, { w: 'JÄRV', e: '🏝️' },
  { w: 'MERI', e: '🌊' }, { w: 'LIIV', e: '🏖️' }, { w: 'KIVI', e: '🪨' }, { w: 'PILV', e: '☁️' },
  { w: 'PÄIKE', e: '☀️' }, { w: 'KUU', e: '🌙' }, { w: 'TÄHT', e: '⭐' }, { w: 'ÄIKE', e: '🌩️' },
  { w: 'LUMI', e: '❄️' }, { w: 'JÄÄ', e: '🧊' }, { w: 'TUUL', e: '🌬️' }, { w: 'VIKERKAAR', e: '🌈' },

  // loomad
  { w: 'KOER', e: '🐶' }, { w: 'KASS', e: '🐱' }, { w: 'HIIR', e: '🐭' }, { w: 'JÄNES', e: '🐰' },
  { w: 'REBANE', e: '🦊' }, { w: 'KARU', e: '🐻' }, { w: 'SEBRA', e: '🦓' }, { w: 'LÕVI', e: '🦁' },
  { w: 'TIIGER', e: '🐯' }, { w: 'PANDA', e: '🐼' }, { w: 'ELEVANT', e: '🐘' }, { w: 'KIRAHV', e: '🦒' },
  { w: 'HOBUNE', e: '🐎' }, { w: 'LAMMAS', e: '🐑' }, { w: 'KITS', e: '🐐' }, { w: 'LEHM', e: '🐄' },
  { w: 'PÕRSAS', e: '🐖' }, { w: 'PART', e: '🦆' }, { w: 'HANI', e: '🪿' }, { w: 'PINGVIIN', e: '🐧' },
  { w: 'KONN', e: '🐸' }, { w: 'KALA', e: '🐟' }, { w: 'HAI', e: '🦈' }, { w: 'DRAAKON', e: '🐉' },
  { w: 'ÄMBLIK', e: '🕷️' }, { w: 'SIIL', e: '🦔' }, { w: 'TIGU', e: '🐌' },

  // toit ja joogid
  { w: 'SAI', e: '🍞' }, { w: 'LEIB', e: '🥖' }, { w: 'JUUST', e: '🧀' }, { w: 'PIIM', e: '🥛' },
  { w: 'PITSA', e: '🍕' }, { w: 'BURGER', e: '🍔' }, { w: 'LIHA', e: '🥩' }, { w: 'MUNA', e: '🥚' },
  { w: 'KARTUL', e: '🥔' }, { w: 'PORGAND', e: '🥕' }, { w: 'TOMAT', e: '🍅' }, { w: 'KURK', e: '🥒' },
  { w: 'KIRSS', e: '🍒' }, { w: 'ÕUN', e: '🍎' }, { w: 'PLOOM', e: '🍑' }, { w: 'MAASIKAS', e: '🍓' },
  { w: 'ARBUUS', e: '🍉' }, { w: 'SIDRUN', e: '🍋' }, { w: 'MARJAD', e: '🍇' }, { w: 'PÄHKEL', e: '🌰' },
  { w: 'KOMPVEK', e: '🍬' }, { w: 'JÄÄTIS', e: '🍦' }, { w: 'KÜPSIS', e: '🍪' }, { w: 'KOOK', e: '🍰' },
  { w: 'MESI', e: '🍯' }, { w: 'KOHV', e: '☕' }, { w: 'TEE', e: '🫖' },

  // kodu ja esemed
  { w: 'KODU', e: '🏡' }, { w: 'TUBA', e: '🛏️' }, { w: 'VOODI', e: '🛌' }, { w: 'LAUD', e: '🪑' },
  { w: 'TOOL', e: '🪑' }, { w: 'LAMP', e: '💡' }, { w: 'KARDIN', e: '🪟' }, { w: 'UKS', e: '🚪' },
  { w: 'KAPP', e: '📦' }, { w: 'RAAMAT', e: '📖' }, { w: 'PLIIATS', e: '✏️' }, { w: 'VÄRV', e: '🎨' },
  { w: 'KÄÄRID', e: '✂️' }, { w: 'ARVUTI', e: '💻' }, { w: 'TELEFON', e: '📱' }, { w: 'EKRAAN', e: '🖥️' },
  { w: 'KOHVER', e: '🧳' }, { w: 'PRILLID', e: '👓' }, { w: 'KINDAD', e: '🧤' }, { w: 'MÜTS', e: '🧢' },
  { w: 'KELL', e: '⌚' }, { w: 'STOPP', e: '⏱️' }, { w: 'ÕHUPALL', e: '🎈' }, { w: 'PUSLE', e: '🧩' },
  { w: 'KLOTSID', e: '🧱' }, { w: 'LUSIKAS', e: '🥄' }, { w: 'NUGA', e: '🔪' },

  // transport
  { w: 'AUTO', e: '🚗' }, { w: 'BUSS', e: '🚌' }, { w: 'TRAMM', e: '🚊' }, { w: 'RONG', e: '🚆' },
  { w: 'LAEV', e: '⛵' }, { w: 'PAAT', e: '🛶' }, { w: 'LENNUK', e: '✈️' }, { w: 'KOPTER', e: '🚁' },
  { w: 'RATAS', e: '🚲' }, { w: 'RULA', e: '🛹' },

  // inimesed ja tunded
  { w: 'EMA', e: '👩' }, { w: 'ISA', e: '👨' }, { w: 'LAPS', e: '🧒' }, { w: 'SÕBER', e: '🤝' },
  { w: 'ÕPETAJA', e: '🧑‍🏫' }, { w: 'ARST', e: '🧑‍⚕️' }, { w: 'POLITSEI', e: '👮' }, { w: 'PÄÄSTJA', e: '🧑‍🚒' },
  { w: 'KOKK', e: '👨‍🍳' }, { w: 'MUUSIK', e: '🎵' }, { w: 'TANTS', e: '💃' }, { w: 'RÕÕM', e: '😄' },
  { w: 'KURBUS', e: '😢' }, { w: 'ÜLLATUS', e: '😮' }, { w: 'UNI', e: '😴' },

  // sport ja mängud
  { w: 'PALL', e: '⚽' }, { w: 'KORV', e: '🏀' }, { w: 'TENNIS', e: '🎾' }, { w: 'GOLF', e: '⛳' },
  { w: 'MALE', e: '♟️' }, { w: 'KAARDID', e: '🃏' }, { w: 'UISK', e: '⛸️' }, { w: 'KELK', e: '🛷' },
  { w: 'MAADLUS', e: '🤼' }, { w: 'VIBU', e: '🏹' },

  // kool ja õpe
  { w: 'KOOL', e: '🏫' }, { w: 'KLASS', e: '🏫' }, { w: 'KIRJUTUS', e: '✍️' }, { w: 'NUMBRID', e: '🔢' },
  { w: 'TÄHED', e: '🔤' }, { w: 'ÕPIK', e: '📘' }, { w: 'MUUSIKA', e: '🎼' },
  
  // lisatud sõnad - rohkem variatsioone
  // loodus (lisatud)
  { w: 'MARI', e: '🫐' }, { w: 'SEEN', e: '🍄' }, { w: 'ROHI', e: '🌱' },
  { w: 'PÕDER', e: '🫎' }, { w: 'HIRV', e: '🦌' },
  
  // loomad (lisatud)
  { w: 'KANA', e: '🐔' }, { w: 'KALKUN', e: '🦃' }, { w: 'KROKODILL', e: '🐊' },
  { w: 'KILPKONN', e: '🐢' }, { w: 'HAMSTER', e: '🐹' }, { w: 'KAAMEL', e: '🐫' },
  
  // toit (lisatud)
  { w: 'BANAAN', e: '🍌' }, { w: 'APELSIN', e: '🍊' }, { w: 'VIINAMARI', e: '🍇' }, { w: 'ANANASS', e: '🍍' },
  { w: 'MANGO', e: '🥭' }, { w: 'KOKOS', e: '🥥' }, { w: 'PIRN', e: '🍐' }, { w: 'VÕI', e: '🧈' },
  { w: 'SUPP', e: '🍲' }, { w: 'SALAT', e: '🥗' }, { w: 'PRAAD', e: '🍖' },
  { w: 'KREVETT', e: '🦐' }, { w: 'KRABI', e: '🦀' },
  
  // kodu (lisatud)
  { w: 'AKEN', e: '🪟' }, { w: 'PÕRAND', e: '🪵' }, { w: 'LAGI', e: '🏠' }, { w: 'SEIN', e: '🧱' },
  { w: 'KÖÖK', e: '🍳' }, { w: 'VANNITUBA', e: '🛁' }, { w: 'MAGAMISTUBA', e: '🛏️' },
  { w: 'RIIUL', e: '📚' }, { w: 'KIRJUTUSLAUD', e: '🪑' }, { w: 'TELEVISIOON', e: '📺' },
  { w: 'PADJ', e: '🛏️' }, { w: 'TEKK', e: '🛌' },
  
  // transport (lisatud)
  { w: 'MOPEED', e: '🛵' }, { w: 'MOTORRATAS', e: '🏍️' }, { w: 'VEOK', e: '🚚' },
  { w: 'TROLLIBUSS', e: '🚎' },
  
  // inimesed (lisatud)
  { w: 'ÕDE', e: '👧' }, { w: 'VEND', e: '👦' }, { w: 'VANAEMA', e: '👵' }, { w: 'VANAISA', e: '👴' },
  { w: 'ÕPETUS', e: '📚' }, { w: 'ÕPILANE', e: '👨‍🎓' },
  
  // sport (lisatud)
  { w: 'JALGPALL', e: '⚽' }, { w: 'KORVPALL', e: '🏀' }, { w: 'VÕRKPALL', e: '🏐' },
  { w: 'JÕUSAAL', e: '🏋️' }, { w: 'JOOKSMINE', e: '🏃' }, { w: 'UJUMINE', e: '🏊' },
  
  // värvid ja kujundid
  { w: 'PUNANE', e: '🔴' }, { w: 'SININE', e: '🔵' }, { w: 'ROHELINE', e: '🟢' }, { w: 'KOLLANE', e: '🟡' },
  { w: 'VALGE', e: '⚪' }, { w: 'MUST', e: '⚫' }, { w: 'LILLA', e: '🟣' }, { w: 'ORANŽ', e: '🟠' },
  
  // kehaosad
  { w: 'PEA', e: '👤' }, { w: 'KÄSI', e: '✋' }, { w: 'JALG', e: '🦵' }, { w: 'SILM', e: '👁️' },
  { w: 'KÕRV', e: '👂' }, { w: 'NINA', e: '👃' }, { w: 'SUU', e: '👄' },
  
  // loodusnähtused
  { w: 'VIHM', e: '🌧️' }, { w: 'LUMESADU', e: '❄️' }, { w: 'TUISK', e: '🌨️' },
  { w: 'PÄIKE', e: '☀️' }, { w: 'PILVED', e: '☁️' }, { w: 'VIHMAVARJUD', e: '🌦️' }
];

export const WORD_DB = BASE_WORDS.reduce((acc, item) => {
  const len = item.w.length;
  if (!acc[len]) acc[len] = [];
  acc[len].push(item);
  return acc;
}, {});

export const SCENE_DB = {
  forest: { 
    bg: 'bg-gradient-to-b from-green-200 to-green-300', 
    name: 'Mets',
    subjects: [
      {n:'REBANE', e:'🦊'}, {n:'JÄNES', e:'🐰'}, {n:'KARU', e:'🐻'}, {n:'SIIL', e:'🦔'}, 
      {n:'ORAV', e:'🐿️'}, {n:'HUNT', e:'🐺'}, {n:'PÕDER', e:'🫎'}, {n:'KITS', e:'🐐'},
      {n:'HIRV', e:'🦌'}, {n:'KONN', e:'🐸'}
    ], 
    anchors: [
      {n:'PUU', e:'🌳'}, {n:'KIVI', e:'🪨'}, {n:'PÕÕSA', e:'🌿'}, {n:'SEENE', e:'🍄'}, 
      {n:'KÄNNU', e:'🪵'}, {n:'JÕE', e:'🏞️'}, {n:'KIVI', e:'🪨'}
    ], 
    positions: ['EES', 'TAGA', 'KÕRVAL', 'PEAL', 'ALL'] 
  },
  space: { 
    bg: 'bg-gradient-to-b from-slate-800 via-purple-900 to-slate-900', 
    name: 'Kosmos',
    subjects: [
      {n:'RAKETT', e:'🚀'}, {n:'UFO', e:'🛸'}, {n:'ASTRONAUT', e:'👨‍🚀'}, {n:'TÄHT', e:'⭐'},
      {n:'PLANEET', e:'🪐'}, {n:'KOMEET', e:'☄️'}, {n:'SATELLIIT', e:'🛰️'}
    ], 
    anchors: [
      {n:'MAA', e:'🌍'}, {n:'KUU', e:'🌙'}, {n:'PÄIKESE', e:'☀️'}, {n:'PLANEEDI', e:'🪐'}
    ], 
    positions: ['PEAL', 'ALL', 'KÕRVAL', 'EES'] 
  },
  room: { 
    bg: 'bg-gradient-to-b from-orange-50 to-yellow-50', 
    name: 'Tuba',
    subjects: [
      {n:'AUTO', e:'🚗'}, {n:'PALL', e:'⚽'}, {n:'KARU', e:'🧸'}, {n:'KASS', e:'🐱'}, 
      {n:'KOER', e:'🐶'}, {n:'ROBOT', e:'🤖'}, {n:'PUSLE', e:'🧩'}, {n:'RAAMAT', e:'📖'}
    ], 
    anchors: [
      {n:'KARBI', e:'📦'}, {n:'VOODI', e:'🛏️'}, {n:'TOOLI', e:'🪑'}, {n:'DIIVANI', e:'🛋️'}, 
      {n:'KAPI', e:'🚪'}, {n:'LAUA', e:'🪑'}, {n:'RIIULI', e:'📚'}
    ], 
    positions: ['SEES', 'PEAL', 'ALL', 'KÕRVAL', 'EES', 'TAGA'] 
  },
  school: {
    bg: 'bg-gradient-to-b from-blue-100 to-blue-200',
    name: 'Kool',
    subjects: [
      {n:'ÕPILANE', e:'👨‍🎓'}, {n:'ÕPETAJA', e:'🧑‍🏫'}, {n:'RAAMAT', e:'📖'}, {n:'PLIIATS', e:'✏️'},
      {n:'KALKULAATOR', e:'🔢'}, {n:'KUSTUTI', e:'🧹'}, {n:'ÕPIK', e:'📘'}
    ],
    anchors: [
      {n:'LAUA', e:'🪑'}, {n:'TABLETI', e:'📺'}, {n:'TABELI', e:'📋'}, {n:'KAPI', e:'🚪'},
      {n:'TOOLI', e:'🪑'}, {n:'RIIULI', e:'📚'}
    ],
    positions: ['PEAL', 'ALL', 'KÕRVAL', 'EES', 'TAGA', 'SEES']
  },
  park: {
    bg: 'bg-gradient-to-b from-emerald-100 to-emerald-200',
    name: 'Park',
    subjects: [
      {n:'LAPS', e:'🧒'}, {n:'KOER', e:'🐶'}, {n:'PALL', e:'⚽'}, {n:'RATAS', e:'🚲'},
      {n:'ÕHUPALL', e:'🎈'}, {n:'KELK', e:'🛷'}, {n:'JÄNES', e:'🐰'}
    ],
    anchors: [
      {n:'TOOLI', e:'🪑'}, {n:'PUU', e:'🌳'}, {n:'LILLE', e:'🌸'}, {n:'TEKI', e:'🛌'},
      {n:'KIVI', e:'🪨'}, {n:'KÄNNU', e:'🪵'}
    ],
    positions: ['PEAL', 'ALL', 'KÕRVAL', 'EES', 'TAGA', 'SEES']
  },
  beach: {
    bg: 'bg-gradient-to-b from-cyan-200 to-blue-300',
    name: 'Rannas',
    subjects: [
      {n:'LAPS', e:'🧒'}, {n:'PALL', e:'⚽'}, {n:'KALLA', e:'🐚'}, {n:'ÕHUPALL', e:'🎈'},
      {n:'KREVETT', e:'🦐'}, {n:'KRABI', e:'🦀'}
    ],
    anchors: [
      {n:'LIIVA', e:'🏖️'}, {n:'MERE', e:'🌊'}, {n:'KIVI', e:'🪨'},
      {n:'PARASOLI', e:'⛱️'}
    ],
    positions: ['PEAL', 'ALL', 'KÕRVAL', 'EES', 'SEES']
  },
  kitchen: {
    bg: 'bg-gradient-to-b from-yellow-50 to-orange-50',
    name: 'Köök',
    subjects: [
      {n:'ÕUN', e:'🍎'}, {n:'LEIB', e:'🥖'}, {n:'KÜPSIS', e:'🍪'}, {n:'KOKK', e:'👨‍🍳'},
      {n:'KARTUL', e:'🥔'}, {n:'TOMAT', e:'🍅'}, {n:'MUNA', e:'🥚'}
    ],
    anchors: [
      {n:'LAUA', e:'🪑'}, {n:'PLAADI', e:'🍳'}, {n:'KAPI', e:'🚪'}, {n:'KÜLMUTI', e:'❄️'},
      {n:'RIIULI', e:'📚'}, {n:'KARBI', e:'📦'}
    ],
    positions: ['PEAL', 'ALL', 'KÕRVAL', 'EES', 'TAGA', 'SEES']
  },
  street: {
    bg: 'bg-gradient-to-b from-gray-200 to-gray-300',
    name: 'Tänav',
    subjects: [
      {n:'AUTO', e:'🚗'}, {n:'BUSS', e:'🚌'}, {n:'RATAS', e:'🚲'}, {n:'LAPS', e:'🧒'},
      {n:'KOER', e:'🐶'}, {n:'PALL', e:'⚽'}
    ],
    anchors: [
      {n:'MAA', e:'🛣️'}, {n:'KIVI', e:'🪨'}, {n:'PUIESTEE', e:'🌳'}, {n:'FOOR', e:'🚦'},
      {n:'KIVI', e:'🪨'}
    ],
    positions: ['PEAL', 'ALL', 'KÕRVAL', 'EES', 'TAGA']
  }
};
