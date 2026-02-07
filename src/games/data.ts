import type { Theme, Category, GameConfig, WordObject, Scene, ProfileType } from '../types/game';
import type { Profile } from '../types/profile';

export const APP_KEY = 'smart_adv_v45_pro';

export const THEME: Record<string, Theme> = {
  orange: { bg: 'bg-orange-50', border: 'border-orange-500', text: 'text-orange-600', iconBg: 'bg-orange-100', accent: 'bg-orange-500' },
  purple: { bg: 'bg-purple-50', border: 'border-purple-500', text: 'text-purple-600', iconBg: 'bg-purple-100', accent: 'bg-purple-500' },
  green:  { bg: 'bg-green-50',  border: 'border-green-500',  text: 'text-green-600',  iconBg: 'bg-green-100', accent: 'bg-green-500' },
  blue:   { bg: 'bg-blue-50',   border: 'border-blue-500',   text: 'text-blue-600',   iconBg: 'bg-blue-100', accent: 'bg-blue-500' },
  pink:   { bg: 'bg-pink-50',   border: 'border-pink-500',   text: 'text-pink-600',   iconBg: 'bg-pink-100', accent: 'bg-pink-500' },
  teal:   { bg: 'bg-teal-50',   border: 'border-teal-500',   text: 'text-teal-600',   iconBg: 'bg-teal-100', accent: 'bg-teal-500' },
  indigo: { bg: 'bg-indigo-50', border: 'border-indigo-500', text: 'text-indigo-600', iconBg: 'bg-indigo-100', accent: 'bg-indigo-500' },
};

export const CATEGORIES: Record<string, Category> = {
  language: { 
    id: 'language', 
    name: 'Language Games', 
    emoji: '🔤',
    description: 'Words, letters and sentences',
    color: 'orange'
  },
  math: { 
    id: 'math', 
    name: 'Math', 
    emoji: '🔢',
    description: 'Calculations and measurements',
    color: 'purple'
  },
  logic: { 
    id: 'logic', 
    name: 'Logic', 
    emoji: '🧩',
    description: 'Patterns and programming',
    color: 'teal'
  },
  memory: { 
    id: 'memory', 
    name: 'Memory', 
    emoji: '🧠',
    description: 'Memory games',
    color: 'blue'
  }
};

export const GAME_CONFIG: Record<string, GameConfig> = {
  // 5+ games - simpler, visual (7 games - added letter_match)
  word_builder:    { id: 'word_builder', title: 'WORD MASTER', theme: THEME.orange!, icon: 'FileText', desc: 'Build a word from letters', allowedProfiles: ['starter', 'advanced'], difficulty: 'easy', category: 'language' },
  word_cascade:    { id: 'word_cascade', title: 'WORD CASCADE', theme: THEME.pink!, icon: 'Layers', desc: 'Catch letters and build words fast', allowedProfiles: ['starter'], difficulty: 'medium', category: 'language' },
  syllable_builder:{ id: 'syllable_builder', title: 'SYLLABLE MASTER', theme: THEME.orange!, icon: 'Layers', desc: 'Put syllables together into a word', allowedProfiles: ['starter'], difficulty: 'easy', category: 'language' },
  pattern:         { id: 'pattern', title: 'PATTERN TRAIN', theme: THEME.teal!, icon: 'TrainFront', desc: 'Continue the pattern', allowedProfiles: ['starter'], difficulty: 'easy', category: 'logic' },
  sentence_logic:  { id: 'sentence_logic', title: 'SENTENCE DETECTIVE', theme: THEME.green!, icon: 'BookOpen', desc: 'Where is the object?', allowedProfiles: ['starter'], difficulty: 'medium', category: 'language' },
  memory_math:     { id: 'memory_math', title: 'MATH MEMORY', theme: THEME.green!, icon: 'Brain', desc: 'Find the equation and answer', allowedProfiles: ['starter'], difficulty: 'medium', category: 'math' },
  robo_path:       { id: 'robo_path', title: 'ROBO PATH', theme: THEME.indigo!, icon: 'Bot', desc: 'Program the robot', allowedProfiles: ['starter'], difficulty: 'medium', category: 'logic' },
  math_snake:      { id: 'math_snake', title: 'NUMBER SNAKE', theme: THEME.purple!, icon: 'Gamepad2', desc: 'Move and collect apples', allowedProfiles: ['starter'], difficulty: 'medium', category: 'math' },
  letter_match:    { id: 'letter_match', title: 'LETTER DETECTIVE', theme: THEME.pink!, icon: 'Search', desc: 'Find the correct letter', allowedProfiles: ['starter'], difficulty: 'easy', category: 'language' },
  unit_conversion: { id: 'unit_conversion', title: 'UNITS', theme: THEME.blue!, icon: 'Ruler', desc: 'Convert units', allowedProfiles: ['starter'], difficulty: 'medium', category: 'math' },
  compare_sizes:   { id: 'compare_sizes', title: 'NUMBER COMPARE', theme: THEME.indigo!, icon: 'Hash', desc: 'Compare numbers', allowedProfiles: ['starter', 'advanced'], difficulty: 'easy', category: 'math' },
  star_mapper:     { id: 'star_mapper', title: 'STAR MAPPER', theme: THEME.indigo!, icon: 'Star', desc: 'Learn the constellations', allowedProfiles: ['starter', 'advanced'], difficulty: 'medium', category: 'logic' },
  shape_shift:     { id: 'shape_shift', title: 'SHAPE SHIFT', theme: THEME.teal!, icon: 'Shapes', desc: 'Build shapes from pieces', allowedProfiles: ['starter', 'advanced'], difficulty: 'easy', category: 'logic' },
  battlelearn:     { id: 'battlelearn', title: 'BATTLELEARN', theme: THEME.blue!, icon: 'Anchor', desc: 'Answer and sink ships', allowedProfiles: ['starter'], difficulty: 'medium', category: 'math', levelUpStrategy: 'onGameWin' },
  
  // 8+ games - harder, logical (7 games - added letter_match_adv)
  balance_scale:   { id: 'balance_scale', title: 'SCALES', theme: THEME.blue!, icon: 'Scale', desc: 'Balance the scales', allowedProfiles: ['advanced'], difficulty: 'hard', category: 'math' },
  time_match:      { id: 'time_match', title: 'CLOCK GAME', theme: THEME.blue!, icon: 'Clock3', desc: 'Set the time', allowedProfiles: ['advanced'], difficulty: 'hard', category: 'math' },
  memory_math_adv: { id: 'memory_math', title: 'MATH MEMORY', theme: THEME.green!, icon: 'Brain', desc: 'Find the equation and answer', allowedProfiles: ['advanced'], difficulty: 'hard', category: 'math' },
  robo_path_adv:   { id: 'robo_path', title: 'ROBO PATH', theme: THEME.indigo!, icon: 'Bot', desc: 'Program the robot', allowedProfiles: ['advanced'], difficulty: 'hard', category: 'logic' },
  math_snake_adv:  { id: 'math_snake', title: 'NUMBER SNAKE', theme: THEME.purple!, icon: 'Gamepad2', desc: 'Move and collect apples', allowedProfiles: ['advanced'], difficulty: 'hard', category: 'math' },
  sentence_logic_adv: { id: 'sentence_logic', title: 'SENTENCE DETECTIVE', theme: THEME.green!, icon: 'BookOpen', desc: 'Where is the object?', allowedProfiles: ['advanced'], difficulty: 'hard', category: 'language' },
  pattern_adv:      { id: 'pattern', title: 'PATTERN TRAIN', theme: THEME.teal!, icon: 'TrainFront', desc: 'Continue the pattern', allowedProfiles: ['advanced'], difficulty: 'hard', category: 'logic' },
  letter_match_adv: { id: 'letter_match', title: 'LETTER DETECTIVE', theme: THEME.pink!, icon: 'Search', desc: 'Find the correct letter', allowedProfiles: ['advanced'], difficulty: 'hard', category: 'language' },
  unit_conversion_adv: { id: 'unit_conversion', title: 'UNITS', theme: THEME.blue!, icon: 'Ruler', desc: 'Convert units', allowedProfiles: ['advanced'], difficulty: 'hard', category: 'math' },
  word_cascade_adv: { id: 'word_cascade', title: 'WORD CASCADE', theme: THEME.pink!, icon: 'Layers', desc: 'Catch letters and build words fast', allowedProfiles: ['advanced'], difficulty: 'hard', category: 'language' },
  battlelearn_adv: { id: 'battlelearn_adv', title: 'BATTLELEARN', theme: THEME.blue!, icon: 'Anchor', desc: 'Master coordinates and arithmetic', allowedProfiles: ['advanced'], difficulty: 'hard', category: 'math', levelUpStrategy: 'onGameWin' },
};

// Profiles are extensible with difficulty offset
export const PROFILES: Record<ProfileType, Profile> = {
  starter:  { id: 'starter', label: '5+', desc: 'Preschooler', levelStart: 1, difficultyOffset: 0, emoji: '👧' },
  advanced: { id: 'advanced', label: '7+', desc: 'School child', levelStart: 3, difficultyOffset: 2, emoji: '🧒' }
};

export const ICONS: Record<string, string> = {
  Type: 'Type',
  Brain: 'Brain',
  BookOpen: 'BookOpen',
  Scale: 'Scale',
  GraduationCap: 'GraduationCap',
  TrainFront: 'TrainFront',
  Bot: 'Bot',
  Clock3: 'Clock3',
  Ruler: 'Ruler',
  Gamepad2: 'Gamepad2',
  Hash: 'Hash',
  FileText: 'FileText',
  Layers: 'Layers',
  Search: 'Search',
  Star: 'Star',
  Shapes: 'Shapes',
  Target: 'Target',
};

export const ALPHABET: string[] = 'ABCDEFGHIJKLMNOPRSŠZŽTUVÕÄÖÜ'.split('');

// Based on emojis; Estonian words for language learning games, mostly <=7 letters
const BASE_WORDS: WordObject[] = [
  // nature and weather
  { w: 'PUU', e: '🌳' }, { w: 'LILL', e: '🌸' }, { w: 'LEHT', e: '🍃' },
  { w: 'METS', e: '🌲' }, { w: 'MÄGI', e: '⛰️' }, { w: 'JÕGI', e: '🏞️' }, { w: 'LOODUS', e: '🏞️' },
  { w: 'MERI', e: '🌊' }, { w: 'RAND', e: '🏖️' }, { w: 'KIVI', e: '🪨' }, { w: 'PILV', e: '☁️' },
  { w: 'PÄIKE', e: '☀️' }, { w: 'KUU', e: '🌙' }, { w: 'TÄHT', e: '⭐' }, { w: 'ÄIKE', e: '🌩️' },
  { w: 'LUMI', e: '❄️' }, { w: 'JÄÄ', e: '🧊' }, { w: 'TUUL', e: '🌬️' }, { w: 'VIKERKAAR', e: '🌈' },
  { w: 'VESI', e: '💧' },

  // animals
  { w: 'KOER', e: '🐶' }, { w: 'KASS', e: '🐱' }, { w: 'HIIR', e: '🐭' }, { w: 'JÄNES', e: '🐰' },
  { w: 'KUKK', e: '🐓' }, // rooster
  { w: 'REBANE', e: '🦊' }, { w: 'KARU', e: '🐻' }, { w: 'SEBRA', e: '🦓' }, { w: 'LÕVI', e: '🦁' },
  { w: 'TIIGER', e: '🐯' }, { w: 'PANDA', e: '🐼' }, { w: 'ELEVANT', e: '🐘' }, { w: 'KAELKIRJAK', e: '🦒' },
  { w: 'HOBUNE', e: '🐎' }, { w: 'LAMMAS', e: '🐑' }, { w: 'KITS', e: '🐐' }, { w: 'LEHM', e: '🐄' },
  { w: 'PÕRSAS', e: '🐖' }, { w: 'PART', e: '🦆' }, { w: 'HANI', e: '🪿' }, { w: 'PINGVIIN', e: '🐧' },
  { w: 'KONN', e: '🐸' }, { w: 'KALA', e: '🐟' }, { w: 'HAI', e: '🦈' }, { w: 'DRAAKON', e: '🐉' },
  { w: 'ÄMBLIK', e: '🕷️' }, { w: 'SIIL', e: '🦔' }, { w: 'TIGU', e: '🐌' },
  { w: 'LIND', e: '🐦' }, // bird
  { w: 'ÖÖKULL', e: '🦉' }, // owl
  { w: 'MADU', e: '🐍' }, // snake
  { w: 'PAPAGOI', e: '🦜' }, // parrot

  // food and drinks
  { w: 'SAI', e: '🍞' }, { w: 'LEIB', e: '🥖' }, { w: 'JUUST', e: '🧀' }, { w: 'PIIM', e: '🥛' },
  { w: 'ÕIS', e: '🌸' }, // flower - 3 letters
  { w: 'PITSA', e: '🍕' }, { w: 'BURGER', e: '🍔' }, { w: 'LIHA', e: '🥩' }, { w: 'MUNA', e: '🥚' },
  { w: 'KARTUL', e: '🥔' }, { w: 'PORGAND', e: '🥕' }, { w: 'TOMAT', e: '🍅' }, { w: 'KURK', e: '🥒' },
  { w: 'KIRSS', e: '🍒' }, { w: 'ÕUN', e: '🍎' }, { w: 'PLOOM', e: '🍑' }, { w: 'MAASIKAS', e: '🍓' },
  { w: 'ARBUUS', e: '🍉' }, { w: 'SIDRUN', e: '🍋' }, { w: 'VIINAMARI', e: '🍇' }, { w: 'PÄHKEL', e: '🌰' },
  { w: 'KOMM', e: '🍬' }, { w: 'JÄÄTIS', e: '🍦' }, { w: 'KÜPSIS', e: '🍪' }, { w: 'KOOK', e: '🍰' },
  { w: 'MESI', e: '🍯' }, { w: 'KOHV', e: '☕' }, { w: 'TEE', e: '🫖' },
  { w: 'KAPSAS', e: '🥬' }, // cabbage
  { w: 'KAKAO', e: '☕' }, // cocoa
  { w: 'ŠOKOLAAD', e: '🍫' }, // chocolate
  { w: 'PIPAR', e: '🌶️' }, // pepper
  { w: 'SOOL', e: '🧂' }, // salt
  { w: 'SUHKUR', e: '🍬' }, // sugar

  // home and items
  { w: 'KODU', e: '🏡' }, { w: 'VOODI', e: '🛌' }, { w: 'TALDRIK', e: '🍽️' },
  { w: 'TOOL', e: '🪑' }, { w: 'LAMP', e: '💡' }, { w: 'UKS', e: '🚪' },
  { w: 'KAPP', e: '🗄️' }, { w: 'RAAMAT', e: '📖' }, { w: 'PLIIATS', e: '✏️' }, { w: 'VÄRV', e: '🎨' },
  { w: 'KÄÄRID', e: '✂️' }, { w: 'ARVUTI', e: '💻' }, { w: 'TELEFON', e: '📱' }, { w: 'EKRAAN', e: '🖥️' },
  { w: 'KOHVER', e: '🧳' }, { w: 'PRILLID', e: '👓' }, { w: 'KINDAD', e: '🧤' }, { w: 'MÜTS', e: '🧢' },
  { w: 'KELL', e: '⌚' }, { w: 'STOPP', e: '⏱️' }, { w: 'ÕHUPALL', e: '🎈' }, { w: 'PUSLE', e: '🧩' },
  { w: 'KLOTSID', e: '🧱' }, { w: 'LUSIKAS', e: '🥄' }, { w: 'NUGA', e: '🔪' },
  { w: 'KORK', e: '🍾' }, // cork/bottle cap
  { w: 'KÄRU', e: '🛒' }, // cart
  { w: 'KÜÜNAL', e: '🕯️' }, // candle
  { w: 'TÕRU', e: '🌰' }, // pine cone


  // transport
  { w: 'AUTO', e: '🚗' }, { w: 'BUSS', e: '🚌' }, { w: 'TRAMM', e: '🚊' }, { w: 'RONG', e: '🚆' },
  { w: 'LAEV', e: '⛵' }, { w: 'PAAT', e: '🛶' }, { w: 'LENNUK', e: '✈️' }, { w: 'KOPTER', e: '🚁' },
  { w: 'RATAS', e: '🚲' }, { w: 'RULA', e: '🛹' },

  // people and emotions
  { w: 'EMA', e: '👩' }, { w: 'ISA', e: '👨' }, { w: 'LAPS', e: '🧒' }, { w: 'SÕBER', e: '👫' },
  { w: 'ÕPETAJA', e: '🧑‍🏫' }, { w: 'ARST', e: '🧑‍⚕️' }, { w: 'POLITSEI', e: '👮' }, { w: 'PÄÄSTJA', e: '🧑‍🚒' },
  { w: 'KOKK', e: '👨‍🍳' }, { w: 'MUUSIK', e: '🎤' }, { w: 'TANTS', e: '💃' }, { w: 'RÕÕM', e: '😄' },
  { w: 'KURBUS', e: '😢' }, { w: 'ÜLLATUS', e: '😮' }, { w: 'UNI', e: '😴' },

  // sports and games
  { w: 'PALL', e: '⚽' }, { w: 'KORV', e: '🏀' }, { w: 'TENNIS', e: '🎾' }, { w: 'GOLF', e: '⛳' },
  { w: 'MALE', e: '♟️' }, { w: 'KAARDID', e: '🃏' }, { w: 'UISK', e: '⛸️' }, { w: 'KELK', e: '🛷' },
  { w: 'MAADLUS', e: '🤼' }, { w: 'VIBU', e: '🏹' },

  // school and learning
  { w: 'KOOL', e: '🏫' }, { w: 'KLASS', e: '🏫' }, { w: 'KIRJUTUS', e: '✍️' }, { w: 'NUMBRID', e: '🔢' },
  { w: 'TÄHED', e: '🔤' }, { w: 'ÕPIK', e: '📘' }, { w: 'MUUSIKA', e: '🎼' },
  
  // added words - more variations
  // nature (added)
  { w: 'MARI', e: '🫐' }, { w: 'SEEN', e: '🍄' }, { w: 'ROHI', e: '🌱' },
  { w: 'PÕDER', e: '🫎' }, { w: 'HIRV', e: '🦌' },
  
  // animals (added)
  { w: 'KANA', e: '🐔' }, { w: 'KALKUN', e: '🦃' }, { w: 'KROKODILL', e: '🐊' },
  { w: 'KILPKONN', e: '🐢' }, { w: 'HAMSTER', e: '🐹' }, { w: 'KAAMEL', e: '🐫' },
  
  // food (added)
  { w: 'BANAAN', e: '🍌' }, { w: 'APELSIN', e: '🍊' }, { w: 'ANANASS', e: '🍍' },
  { w: 'MANGO', e: '🥭' }, { w: 'KOOKOS', e: '🥥' }, { w: 'PIRN', e: '🍐' }, { w: 'VÕI', e: '🧈' },
  { w: 'SUPP', e: '🍲' }, { w: 'SALAT', e: '🥗' },
  { w: 'KREVETT', e: '🦐' }, { w: 'KRABI', e: '🦀' },
  
  // home (added)
  { w: 'AKEN', e: '🪟' }, { w: 'PALK', e: '🪵' }, { w: 'PIRN', e: '💡' }, { w: 'SEIN', e: '🧱' },
  { w: 'PANN', e: '🍳' }, { w: 'VANN', e: '🛁' },
  { w: 'RIIUL', e: '📚' }, { w: 'TELEVIISOR', e: '📺' },
  
  // transportation (added)
  { w: 'MOPEED', e: '🛵' }, { w: 'MOTORRATAS', e: '🏍️' }, { w: 'VEOK', e: '🚚' },
  { w: 'TROLLIBUSS', e: '🚎' },
  
  // people (added)
  { w: 'TÜDRUK', e: '👧' }, { w: 'POISS', e: '👦' }, { w: 'VANAEMA', e: '👵' }, { w: 'VANAISA', e: '👴' },
  { w: 'RAAMATUD', e: '📚' }, { w: 'ÕPILANE', e: '👨‍🎓' },
  
  // sports (added) - keeping specific terms for variety
  { w: 'VÕRKPALL', e: '🏐' },
  { w: 'JÕUSAAL', e: '🏋️' }, { w: 'JOOKSMINE', e: '🏃' }, { w: 'UJUMINE', e: '🏊' },
  
  // colors and shapes
  { w: 'PUNANE', e: '🔴' }, { w: 'SININE', e: '🔵' }, { w: 'ROHELINE', e: '🟢' }, { w: 'KOLLANE', e: '🟡' },
  { w: 'VALGE', e: '⚪' }, { w: 'MUST', e: '⚫' }, { w: 'LILLA', e: '🟣' }, { w: 'ORANŽ', e: '🟠' },
  
  // body parts
  { w: 'AJU', e: '🧠' }, { w: 'KÄSI', e: '✋' }, { w: 'JALG', e: '🦵' }, { w: 'SILM', e: '👁️' },
  { w: 'KÕRV', e: '👂' }, { w: 'NINA', e: '👃' }, { w: 'SUU', e: '👄' },
  
  // natural phenomena
  { w: 'VIHM', e: '🌧️' }, { w: 'LUMESADU', e: '🌨️' },
  
  // games and toys
  { w: 'MÄNG', e: '🎮' }, { w: 'NUKK', e: '🪆' },
  
  // animals from scenes (add to main list)
  { w: 'ORAV', e: '🐿️' }, { w: 'HUNT', e: '🐺' }, { w: 'ROBOT', e: '🤖' }
];

export const WORD_DB: Record<number, WordObject[]> = BASE_WORDS.reduce<Record<number, WordObject[]>>((acc, item) => {
  const len = item.w.length;
  if (!acc[len]) acc[len] = [];
  acc[len].push(item);
  return acc;
}, {});

// English word database for word builder game
const BASE_WORDS_EN: WordObject[] = [
  // 3-letter words - animals, nature, food
  { w: 'CAT', e: '🐱' }, { w: 'DOG', e: '🐶' }, { w: 'BAT', e: '🦇' }, { w: 'BEE', e: '🐝' },
  { w: 'FOX', e: '🦊' }, { w: 'PIG', e: '🐷' }, { w: 'COW', e: '🐄' }, { w: 'OWL', e: '🦉' },
  { w: 'ANT', e: '🐜' }, { w: 'SUN', e: '☀️' }, { w: 'SEA', e: '🌊' },
  { w: 'ICE', e: '🧊' }, { w: 'EGG', e: '🥚' }, { w: 'PIE', e: '🥧' }, { w: 'TEA', e: '☕' },
  
  // 4-letter words - animals, nature, food, objects
  { w: 'BIRD', e: '🐦' }, { w: 'FISH', e: '🐟' }, { w: 'LION', e: '🦁' }, { w: 'BEAR', e: '🐻' },
  { w: 'FROG', e: '🐸' }, { w: 'DUCK', e: '🦆' }, { w: 'CRAB', e: '🦀' }, { w: 'DEER', e: '🦌' },
  { w: 'GOAT', e: '🐐' }, { w: 'TREE', e: '🌳' }, { w: 'LEAF', e: '🍃' }, { w: 'ROSE', e: '🌹' },
  { w: 'SNOW', e: '❄️' }, { w: 'RAIN', e: '🌧️' }, { w: 'MOON', e: '🌙' }, { w: 'STAR', e: '⭐' },
  { w: 'CAKE', e: '🍰' }, { w: 'MILK', e: '🥛' }, { w: 'PEAR', e: '🍐' }, { w: 'CORN', e: '🌽' },
  { w: 'BALL', e: '⚽' }, { w: 'BOOK', e: '📖' }, { w: 'LAMP', e: '💡' }, { w: 'DOOR', e: '🚪' },
  
  // 5-letter words - animals, nature, food, objects
  { w: 'APPLE', e: '🍎' }, { w: 'BREAD', e: '🍞' }, { w: 'PIZZA', e: '🍕' }, { w: 'LEMON', e: '🍋' },
  { w: 'GRAPE', e: '🍇' }, { w: 'PEACH', e: '🍑' }, { w: 'WATER', e: '💧' }, { w: 'HONEY', e: '🍯' },
  { w: 'HORSE', e: '🐴' }, { w: 'MOUSE', e: '🐭' }, { w: 'WHALE', e: '🐋' }, { w: 'SHARK', e: '🦈' },
  { w: 'SNAKE', e: '🐍' }, { w: 'SHEEP', e: '🐑' }, { w: 'TIGER', e: '🐯' }, { w: 'ZEBRA', e: '🦓' },
  { w: 'CLOUD', e: '☁️' }, { w: 'RIVER', e: '🏞️' }, { w: 'PLANT', e: '🌱' },
  { w: 'CHAIR', e: '🪑' }, { w: 'HOUSE', e: '🏡' }, { w: 'CLOCK', e: '🕐' },
  
  // 6-letter words
  { w: 'BANANA', e: '🍌' }, { w: 'ORANGE', e: '🍊' }, { w: 'CARROT', e: '🥕' }, { w: 'POTATO', e: '🥔' },
  { w: 'BURGER', e: '🍔' }, { w: 'COOKIE', e: '🍪' }, { w: 'CHEESE', e: '🧀' }, { w: 'BUTTER', e: '🧈' },
  { w: 'RABBIT', e: '🐰' }, { w: 'TURTLE', e: '🐢' }, { w: 'MONKEY', e: '🐵' }, { w: 'PIGEON', e: '🕊️' },
  { w: 'SPIDER', e: '🕷️' }, { w: 'DRAGON', e: '🐉' }, { w: 'FLOWER', e: '🌸' }, { w: 'GARDEN', e: '🌻' },
  { w: 'SNOW', e: '❄️' }, { w: 'SPRING', e: '🌱' }, { w: 'PENCIL', e: '✏️' },
  { w: 'WATER', e: '💧' },
  
  // 7-letter words
  { w: 'CHICKEN', e: '🐔' }, { w: 'DOLPHIN', e: '🐬' }, { w: 'GIRAFFE', e: '🦒' }, { w: 'PENGUIN', e: '🐧' },
  { w: 'OCTOPUS', e: '🐙' }, { w: 'RAINBOW', e: '🌈' }, { w: 'COCONUT', e: '🥥' }, { w: 'CABBAGE', e: '🥬' },
  { w: 'PUMPKIN', e: '🎃' }, { w: 'AVOCADO', e: '🥑' }, { w: 'PRETZEL', e: '🥨' }
];

export const WORD_DB_EN: Record<number, WordObject[]> = BASE_WORDS_EN.reduce<Record<number, WordObject[]>>((acc, item) => {
  const len = item.w.length;
  if (!acc[len]) acc[len] = [];
  acc[len].push(item);
  return acc;
}, {});

export const SCENE_DB: Record<string, Scene> = {
  forest: { 
    bg: 'bg-gradient-to-b from-green-200 to-green-300', 
    name: 'Forest',
    subjects: [
      {n:'REBANE', e:'🦊'}, {n:'JÄNES', e:'🐰'}, {n:'KARU', e:'🐻'}, {n:'SIIL', e:'🦔'}, 
      {n:'ORAV', e:'🐿️'}, {n:'HUNT', e:'🐺'}, {n:'PÕDER', e:'🫎'}, {n:'KITS', e:'🐐'},
      {n:'HIRV', e:'🦌'}, {n:'KONN', e:'🐸'}
    ], 
    anchors: [
      {n:'PUU', adess:'PUUL', iness:'PUUS', genitive:'PUU', e:'🌳'}, 
      {n:'KIVI', adess:'KIVIL', iness:'KIVIS', genitive:'KIVI', e:'🪨'}, 
      {n:'LEHT', adess:'LEHEL', iness:'LEHES', genitive:'LEHE', e:'🍃'}, 
      {n:'SEEN', adess:'SEENEL', iness:'SEENES', genitive:'SEENE', e:'🍄'}, 
      {n:'KÄND', adess:'KÄNNUL', iness:'KÄNNUS', genitive:'KÄNNU', e:'🪵'}, 
      {n:'JÕGI', adess:'JÕEL', iness:'JÕES', genitive:'JÕE', e:'🏞️'}
    ], 
    positions: ['IN_FRONT', 'BEHIND', 'NEXT_TO', 'ON', 'UNDER'] 
  },
  space: { 
    bg: 'bg-gradient-to-b from-slate-800 via-purple-900 to-slate-900', 
    name: 'Space',
    subjects: [
      {n:'RAKETT', e:'🚀'}, {n:'UFO', e:'🛸'}, {n:'ASTRONAUT', e:'👨‍🚀'}, {n:'TÄHT', e:'⭐'},
      {n:'PLANEET', e:'🪐'}, {n:'KOMEET', e:'☄️'}, {n:'SATELLIIT', e:'🛰️'}
    ], 
    anchors: [
      {n:'MAA', adess:'MAAL', iness:'MAAS', genitive:'MAA', e:'🌍'}, 
      {n:'KUU', adess:'KUUL', iness:'KUUS', genitive:'KUU', e:'🌙'}, 
      {n:'PÄIKE', adess:'PÄIKESEL', iness:'PÄIKESES', genitive:'PÄIKESE', e:'☀️'}, 
      {n:'PLANEET', adess:'PLANEEDIL', iness:'PLANEEDIS', genitive:'PLANEEDI', e:'🪐'}
    ], 
    positions: ['ON', 'UNDER', 'NEXT_TO', 'IN_FRONT'] 
  },
  room: { 
    bg: 'bg-gradient-to-b from-orange-50 to-yellow-50', 
    name: 'Room',
    subjects: [
      {n:'AUTO', e:'🚗'}, {n:'PALL', e:'⚽'}, {n:'KARU', e:'🧸'}, {n:'KASS', e:'🐱'}, 
      {n:'KOER', e:'🐶'}, {n:'ROBOT', e:'🤖'}, {n:'PUSLE', e:'🧩'}, {n:'RAAMAT', e:'📖'}
    ], 
    anchors: [
      {n:'KARP', adess:'KARBIL', iness:'KARBIS', genitive:'KARBI', e:'📦'}, 
      {n:'VOODI', adess:'VOODIL', iness:'VOODIS', genitive:'VOODI', e:'🛏️'}, 
      {n:'TOOL', adess:'TOOLIL', iness:'TOOLIS', genitive:'TOOLI', e:'🪑'}, 
      {n:'DIIVAN', adess:'DIIVANIL', iness:'DIIVANIS', genitive:'DIIVANI', e:'🛋️'}, 
      {n:'KAPP', adess:'KAPIL', iness:'KAPIS', genitive:'KAPI', e:'📦'}, 
      {n:'AKEN', adess:'AKNAL', iness:'AKNAS', genitive:'AKNA', e:'🪟'}, 
      {n:'RIIUL', adess:'RIIULIL', iness:'RIIULIS', genitive:'RIIULI', e:'📚'}
    ], 
    positions: ['INSIDE', 'ON', 'UNDER', 'NEXT_TO', 'IN_FRONT', 'BEHIND'] 
  },
  school: {
    bg: 'bg-gradient-to-b from-blue-100 to-blue-200',
    name: 'School',
    subjects: [
      {n:'ÕPILANE', e:'👨‍🎓'}, {n:'ÕPETAJA', e:'🧑‍🏫'}, {n:'RAAMAT', e:'📖'}, {n:'PLIIATS', e:'✏️'},
      {n:'NUMBRID', e:'🔢'}, {n:'LUUD', e:'🧹'}, {n:'ÕPIK', e:'📘'}
    ],
    anchors: [
      {n:'AKEN', adess:'AKNAL', iness:'AKNAS', genitive:'AKNA', e:'🪟'}, 
      {n:'TAHVEL', adess:'TAHVLIL', iness:'TAHVLIS', genitive:'TAHVLI', e:'📺'}, 
      {n:'TABEL', adess:'TABELIL', iness:'TABELIS', genitive:'TABELI', e:'📋'}, 
      {n:'KAPP', adess:'KAPIL', iness:'KAPIS', genitive:'KAPI', e:'📦'},
      {n:'TOOL', adess:'TOOLIL', iness:'TOOLIS', genitive:'TOOLI', e:'🪑'}, 
      {n:'RIIUL', adess:'RIIULIL', iness:'RIIULIS', genitive:'RIIULI', e:'📚'}
    ],
    positions: ['ON', 'UNDER', 'NEXT_TO', 'IN_FRONT', 'BEHIND', 'INSIDE']
  },
  park: {
    bg: 'bg-gradient-to-b from-emerald-100 to-emerald-200',
    name: 'Park',
    subjects: [
      {n:'LAPS', e:'🧒'}, {n:'KOER', e:'🐶'}, {n:'PALL', e:'⚽'}, {n:'RATAS', e:'🚲'},
      {n:'ÕHUPALL', e:'🎈'}, {n:'KELK', e:'🛷'}, {n:'JÄNES', e:'🐰'}
    ],
    anchors: [
      {n:'TOOL', adess:'TOOLIL', iness:'TOOLIS', genitive:'TOOLI', e:'🪑'}, 
      {n:'PUU', adess:'PUUL', iness:'PUUS', genitive:'PUU', e:'🌳'}, 
      {n:'LILL', adess:'LILLEL', iness:'LILLES', genitive:'LILLE', e:'🌸'}, 
      {n:'VOODI', adess:'VOODIL', iness:'VOODIS', genitive:'VOODI', e:'🛌'},
      {n:'KIVI', adess:'KIVIL', iness:'KIVIS', genitive:'KIVI', e:'🪨'}, 
      {n:'KÄND', adess:'KÄNNUL', iness:'KÄNNUS', genitive:'KÄNNU', e:'🪵'}
    ],
    positions: ['ON', 'UNDER', 'NEXT_TO', 'IN_FRONT', 'BEHIND', 'INSIDE']
  },
  beach: {
    bg: 'bg-gradient-to-b from-cyan-200 to-blue-300',
    name: 'Beach',
    subjects: [
      {n:'LAPS', e:'🧒'}, {n:'PALL', e:'⚽'}, {n:'KARP', e:'🐚'}, {n:'ÕHUPALL', e:'🎈'},
      {n:'KREVETT', e:'🦐'}, {n:'KRABI', e:'🦀'}
    ],
    anchors: [
      {n:'RAND', adess:'RANNAL', iness:'RANNAS', genitive:'RANNA', e:'🏖️'}, 
      {n:'MERI', adess:'MEREL', iness:'MERES', genitive:'MERE', e:'🌊'}, 
      {n:'KIVI', adess:'KIVIL', iness:'KIVIS', genitive:'KIVI', e:'🪨'},
      {n:'PÄIKESEVARI', adess:'PÄIKESEVARJU', iness:'PÄIKESEVARJU', genitive:'PÄIKESEVARJU', e:'⛱️'}
    ],
    positions: ['ON', 'UNDER', 'NEXT_TO', 'IN_FRONT', 'INSIDE']
  },
  kitchen: {
    bg: 'bg-gradient-to-b from-yellow-50 to-orange-50',
    name: 'Kitchen',
    subjects: [
      {n:'ÕUN', e:'🍎'}, {n:'LEIB', e:'🥖'}, {n:'KÜPSIS', e:'🍪'}, {n:'KOKK', e:'👨‍🍳'},
      {n:'KARTUL', e:'🥔'}, {n:'TOMAT', e:'🍅'}, {n:'MUNA', e:'🥚'}
    ],
    anchors: [
      {n:'AKEN', adess:'AKNAL', iness:'AKNAS', genitive:'AKNA', e:'🪟'}, 
      {n:'PLIIT', adess:'PLIIDIL', iness:'PLIIDIS', genitive:'PLIIDI', e:'🍳'}, 
      {n:'KAPP', adess:'KAPIL', iness:'KAPIS', genitive:'KAPI', e:'📦'}, 
      {n:'KÜLMIK', adess:'KÜLMIKUL', iness:'KÜLMIKUS', genitive:'KÜLMIKU', e:'❄️'},
      {n:'RIIUL', adess:'RIIULIL', iness:'RIIULIS', genitive:'RIIULI', e:'📚'}, 
      {n:'KARP', adess:'KARBIL', iness:'KARBIS', genitive:'KARBI', e:'📦'}
    ],
    positions: ['ON', 'UNDER', 'NEXT_TO', 'IN_FRONT', 'BEHIND', 'INSIDE']
  },
  street: {
    bg: 'bg-gradient-to-b from-gray-200 to-gray-300',
    name: 'Street',
    subjects: [
      {n:'AUTO', e:'🚗'}, {n:'BUSS', e:'🚌'}, {n:'RATAS', e:'🚲'}, {n:'LAPS', e:'🧒'},
      {n:'KOER', e:'🐶'}, {n:'PALL', e:'⚽'}
    ],
    anchors: [
      {n:'MAA', adess:'MAAL', iness:'MAAS', genitive:'MAA', e:'🛣️'}, 
      {n:'KIVI', adess:'KIVIL', iness:'KIVIS', genitive:'KIVI', e:'🪨'}, 
      {n:'LAMP', adess:'LAMBIL', iness:'LAMBIS', genitive:'LAMBI', e:'💡'}, 
      {n:'FOOR', adess:'FOORIL', iness:'FOORIS', genitive:'FOORI', e:'🚦'}
    ],
    positions: ['ON', 'UNDER', 'NEXT_TO', 'IN_FRONT', 'BEHIND']
  }
};
