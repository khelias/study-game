/**
 * Translations for sentence_logic game objects and positions
 * Supports Estonian and English
 */

import type { ContentPack, LocaleCode } from '../../types';
import { LANGUAGE_SPATIAL_SENTENCES_SKILL } from '../../skills/language';
import type { Difficulty, Scene, SceneSubject, SceneAnchor } from '../../../types/game';

export type SpatialSentenceFocus =
  | 'core_prepositions'
  | 'five_position_context'
  | 'inside_container_context';

export interface SpatialSentenceMetadata {
  difficulty: Difficulty;
  minLevel: number;
  maxLevel?: number;
  focus: SpatialSentenceFocus;
  learningOutcome: Record<LocaleCode, string>;
}

export type SpatialSentenceScene = Scene & SpatialSentenceMetadata & { id: string };

// English translations for Estonian object names
const OBJECT_TRANSLATIONS: Record<string, { en: string }> = {
  // Subjects
  REBANE: { en: 'Fox' },
  JÄNES: { en: 'Rabbit' },
  KARU: { en: 'Bear' },
  SIIL: { en: 'Hedgehog' },
  ORAV: { en: 'Squirrel' },
  HUNT: { en: 'Wolf' },
  PÕDER: { en: 'Moose' },
  KITS: { en: 'Goat' },
  HIRV: { en: 'Deer' },
  KONN: { en: 'Frog' },
  RAKETT: { en: 'Rocket' },
  UFO: { en: 'UFO' },
  ASTRONAUT: { en: 'Astronaut' },
  TÄHT: { en: 'Star' },
  PLANEET: { en: 'Planet' },
  KOMEET: { en: 'Comet' },
  SATELLIIT: { en: 'Satellite' },
  AUTO: { en: 'Car' },
  BUSS: { en: 'Bus' },
  PALL: { en: 'Ball' },
  KASS: { en: 'Cat' },
  KOER: { en: 'Dog' },
  ROBOT: { en: 'Robot' },
  PUSLE: { en: 'Puzzle' },
  RAAMAT: { en: 'Book' },
  RAAMATUD: { en: 'Books' },
  LAPS: { en: 'Child' },
  RATAS: { en: 'Bicycle' },
  ÕHUPALL: { en: 'Balloon' },
  KELK: { en: 'Sled' },
  KREVETT: { en: 'Shrimp' },
  KRABI: { en: 'Crab' },
  MERIKARP: { en: 'Shell' },
  ÕUN: { en: 'Apple' },
  LEIB: { en: 'Bread' },
  KÜPSIS: { en: 'Cookie' },
  KOKK: { en: 'Chef' },
  KARTUL: { en: 'Potato' },
  TOMAT: { en: 'Tomato' },
  MUNA: { en: 'Egg' },
  ÕPILANE: { en: 'Student' },
  ÕPETAJA: { en: 'Teacher' },
  PLIIATS: { en: 'Pencil' },
  KALKULAATOR: { en: 'Calculator' },
  KUSTUTI: { en: 'Eraser' },
  ÕPIK: { en: 'Textbook' },

  // Anchors
  PUU: { en: 'Tree' },
  KIVI: { en: 'Stone' },
  PÕÕSAS: { en: 'Bush' },
  SEEN: { en: 'Mushroom' },
  KÄND: { en: 'Stump' },
  JÕGI: { en: 'River' },
  MAA: { en: 'Ground' },
  KUU: { en: 'Moon' },
  PÄIKE: { en: 'Sun' },
  KARP: { en: 'Box' },
  VOODI: { en: 'Bed' },
  TOOL: { en: 'Chair' },
  DIIVAN: { en: 'Sofa' },
  KAPP: { en: 'Cupboard' },
  RIIUL: { en: 'Shelf' },
  AKEN: { en: 'Window' },
  LAUD: { en: 'Table' },
  TAHVEL: { en: 'Board' },
  TABEL: { en: 'Chart' },
  LILL: { en: 'Flower' },
  TEKK: { en: 'Blanket' },
  LIIV: { en: 'Sand' },
  MERI: { en: 'Sea' },
  PÄIKESEVARI: { en: 'Umbrella' },
  PLIIT: { en: 'Stove' },
  KÜLMIK: { en: 'Refrigerator' },
  LAMP: { en: 'Lamp' },
  FOOR: { en: 'Traffic Light' },
  PUIESTEE: { en: 'Sidewalk' },
};

// Position translations
const POSITION_TRANSLATIONS: Record<string, { et: string; en: string }> = {
  NEXT_TO: { et: 'kõrval', en: 'next to' },
  ON: { et: 'kohal', en: 'on' },
  UNDER: { et: 'all', en: 'under' },
  IN_FRONT: { et: 'ees', en: 'in front of' },
  BEHIND: { et: 'taga', en: 'behind' },
  INSIDE: { et: 'sees', en: 'inside' },
};

// Get English form for anchor (simplified - no cases in English)
function getAnchorEnglishForm(anchor: SceneAnchor, _position: string): string {
  // For English, we use simple preposition structure
  // "next to the tree", "on the tree", "under the tree", etc.
  const baseName = OBJECT_TRANSLATIONS[anchor.n]?.en || anchor.n;
  return baseName.toLowerCase();
}

// Scene name translations - map English keys to localized names
const SCENE_NAME_TRANSLATIONS: Record<string, { et: string }> = {
  Forest: { et: 'Mets' },
  Space: { et: 'Kosmos' },
  Room: { et: 'Tuba' },
  School: { et: 'Kool' },
  Park: { et: 'Park' },
  Beach: { et: 'Rand' },
  Kitchen: { et: 'Köök' },
  Street: { et: 'Tänav' },
};

/**
 * Get localized scene name
 *
 * This function translates scene names from English keys to the target locale.
 * The English keys (e.g., 'Forest', 'Kitchen') serve as both the base identifier
 * and the English translation. For Estonian, it looks up the translation.
 *
 * @param sceneKey - English scene key (e.g., 'Forest', 'Kitchen', 'Space')
 * @param locale - Target locale: 'et' for Estonian, 'en' for English (default: 'et')
 * @returns Localized scene name - returns the English key for 'en' locale,
 *          or the Estonian translation for 'et' locale
 *
 * @example
 * getSceneName('Forest', 'en') // Returns: 'Forest'
 * getSceneName('Forest', 'et') // Returns: 'Mets'
 * getSceneName('Kitchen', 'en') // Returns: 'Kitchen'
 * getSceneName('Kitchen', 'et') // Returns: 'Köök'
 */
export function getSceneName(sceneKey: string, locale: 'et' | 'en' = 'et'): string {
  if (locale === 'en') {
    // For English, the key itself is the name
    return sceneKey;
  }
  // For Estonian, look up the translation
  const translation = SCENE_NAME_TRANSLATIONS[sceneKey];
  return translation ? translation.et : sceneKey;
}

// Get subject English name
function getSubjectEnglishName(subject: SceneSubject): string {
  return OBJECT_TRANSLATIONS[subject.n]?.en || subject.n;
}

// Generate sentence based on language
export function generateSentence(
  subject: SceneSubject,
  anchor: SceneAnchor,
  position: string,
  locale: 'et' | 'en' = 'et',
): string {
  if (locale === 'en') {
    const subjectName = getSubjectEnglishName(subject);
    const anchorName = getAnchorEnglishForm(anchor, position);
    const positionText = POSITION_TRANSLATIONS[position]?.en || position.toLowerCase();

    // English sentence structure: "Subject is position the anchor."
    // e.g., "Rocket is in front of the planet."
    return `${subjectName} is ${positionText} the ${anchorName}.`;
  } else {
    // Estonian sentence structure
    const isInside = position === 'INSIDE';
    const anchorForm = isInside ? anchor.iness : anchor.genitive;
    const positionText = POSITION_TRANSLATIONS[position]?.et || position.toLowerCase();
    return `${subject.n} ON ${anchorForm} ${positionText}.`;
  }
}

export const SCENE_DB = {
  forest: {
    bg: 'bg-gradient-to-b from-green-200 to-green-300',
    name: 'Forest',
    subjects: [
      { n: 'REBANE', e: '🦊' },
      { n: 'JÄNES', e: '🐰' },
      { n: 'KARU', e: '🐻' },
      { n: 'SIIL', e: '🦔' },
      { n: 'ORAV', e: '🐿️' },
      { n: 'HUNT', e: '🐺' },
      { n: 'PÕDER', e: '🫎' },
      { n: 'KITS', e: '🐐' },
      { n: 'HIRV', e: '🦌' },
      { n: 'KONN', e: '🐸' },
    ],
    anchors: [
      { n: 'PUU', adess: 'PUUL', iness: 'PUUS', genitive: 'PUU', e: '🌳' },
      { n: 'KIVI', adess: 'KIVIL', iness: 'KIVIS', genitive: 'KIVI', e: '🪨' },
      { n: 'LEHT', adess: 'LEHEL', iness: 'LEHES', genitive: 'LEHE', e: '🍃' },
      { n: 'SEEN', adess: 'SEENEL', iness: 'SEENES', genitive: 'SEENE', e: '🍄' },
      { n: 'KÄND', adess: 'KÄNNUL', iness: 'KÄNNUS', genitive: 'KÄNNU', e: '🪵' },
      { n: 'JÕGI', adess: 'JÕEL', iness: 'JÕES', genitive: 'JÕE', e: '🏞️' },
    ],
    positions: ['IN_FRONT', 'BEHIND', 'NEXT_TO', 'ON', 'UNDER'],
  },
  space: {
    bg: 'bg-gradient-to-b from-slate-800 via-purple-900 to-slate-900',
    name: 'Space',
    subjects: [
      { n: 'RAKETT', e: '🚀' },
      { n: 'UFO', e: '🛸' },
      { n: 'ASTRONAUT', e: '👨‍🚀' },
      { n: 'TÄHT', e: '⭐' },
      { n: 'PLANEET', e: '🪐' },
      { n: 'KOMEET', e: '☄️' },
      { n: 'SATELLIIT', e: '🛰️' },
    ],
    anchors: [
      { n: 'MAA', adess: 'MAAL', iness: 'MAAS', genitive: 'MAA', e: '🌍' },
      { n: 'KUU', adess: 'KUUL', iness: 'KUUS', genitive: 'KUU', e: '🌙' },
      { n: 'PÄIKE', adess: 'PÄIKESEL', iness: 'PÄIKESES', genitive: 'PÄIKESE', e: '☀️' },
      { n: 'PLANEET', adess: 'PLANEEDIL', iness: 'PLANEEDIS', genitive: 'PLANEEDI', e: '🪐' },
    ],
    positions: ['ON', 'UNDER', 'NEXT_TO', 'IN_FRONT'],
  },
  room: {
    bg: 'bg-gradient-to-b from-orange-50 to-yellow-50',
    name: 'Room',
    subjects: [
      { n: 'AUTO', e: '🚗' },
      { n: 'PALL', e: '⚽' },
      { n: 'KARU', e: '🧸' },
      { n: 'KASS', e: '🐱' },
      { n: 'KOER', e: '🐶' },
      { n: 'ROBOT', e: '🤖' },
      { n: 'PUSLE', e: '🧩' },
      { n: 'RAAMAT', e: '📖' },
    ],
    anchors: [
      { n: 'KARP', adess: 'KARBIL', iness: 'KARBIS', genitive: 'KARBI', e: '📦' },
      { n: 'VOODI', adess: 'VOODIL', iness: 'VOODIS', genitive: 'VOODI', e: '🛏️' },
      { n: 'TOOL', adess: 'TOOLIL', iness: 'TOOLIS', genitive: 'TOOLI', e: '🪑' },
      { n: 'DIIVAN', adess: 'DIIVANIL', iness: 'DIIVANIS', genitive: 'DIIVANI', e: '🛋️' },
      { n: 'KAPP', adess: 'KAPIL', iness: 'KAPIS', genitive: 'KAPI', e: '📦' },
      { n: 'AKEN', adess: 'AKNAL', iness: 'AKNAS', genitive: 'AKNA', e: '🪟' },
      { n: 'RIIUL', adess: 'RIIULIL', iness: 'RIIULIS', genitive: 'RIIULI', e: '🗄️' },
    ],
    positions: ['INSIDE', 'ON', 'UNDER', 'NEXT_TO', 'IN_FRONT', 'BEHIND'],
  },
  school: {
    bg: 'bg-gradient-to-b from-blue-100 to-blue-200',
    name: 'School',
    subjects: [
      { n: 'ÕPILANE', e: '👨‍🎓' },
      { n: 'ÕPETAJA', e: '🧑‍🏫' },
      { n: 'RAAMAT', e: '📖' },
      { n: 'PLIIATS', e: '✏️' },
      { n: 'NUMBRID', e: '🔢' },
      { n: 'LUUD', e: '🧹' },
      { n: 'ÕPIK', e: '📘' },
    ],
    anchors: [
      { n: 'AKEN', adess: 'AKNAL', iness: 'AKNAS', genitive: 'AKNA', e: '🪟' },
      { n: 'TAHVEL', adess: 'TAHVLIL', iness: 'TAHVLIS', genitive: 'TAHVLI', e: '📺' },
      { n: 'TABEL', adess: 'TABELIL', iness: 'TABELIS', genitive: 'TABELI', e: '📋' },
      { n: 'KAPP', adess: 'KAPIL', iness: 'KAPIS', genitive: 'KAPI', e: '📦' },
      { n: 'TOOL', adess: 'TOOLIL', iness: 'TOOLIS', genitive: 'TOOLI', e: '🪑' },
      { n: 'RIIUL', adess: 'RIIULIL', iness: 'RIIULIS', genitive: 'RIIULI', e: '🗄️' },
    ],
    positions: ['ON', 'UNDER', 'NEXT_TO', 'IN_FRONT', 'BEHIND', 'INSIDE'],
  },
  park: {
    bg: 'bg-gradient-to-b from-emerald-100 to-emerald-200',
    name: 'Park',
    subjects: [
      { n: 'LAPS', e: '🧒' },
      { n: 'KOER', e: '🐶' },
      { n: 'PALL', e: '⚽' },
      { n: 'RATAS', e: '🚲' },
      { n: 'ÕHUPALL', e: '🎈' },
      { n: 'KELK', e: '🛷' },
      { n: 'JÄNES', e: '🐰' },
    ],
    anchors: [
      { n: 'TOOL', adess: 'TOOLIL', iness: 'TOOLIS', genitive: 'TOOLI', e: '🪑' },
      { n: 'PUU', adess: 'PUUL', iness: 'PUUS', genitive: 'PUU', e: '🌳' },
      { n: 'LILL', adess: 'LILLEL', iness: 'LILLES', genitive: 'LILLE', e: '🌸' },
      { n: 'VOODI', adess: 'VOODIL', iness: 'VOODIS', genitive: 'VOODI', e: '🛌' },
      { n: 'KIVI', adess: 'KIVIL', iness: 'KIVIS', genitive: 'KIVI', e: '🪨' },
      { n: 'KÄND', adess: 'KÄNNUL', iness: 'KÄNNUS', genitive: 'KÄNNU', e: '🪵' },
    ],
    positions: ['ON', 'UNDER', 'NEXT_TO', 'IN_FRONT', 'BEHIND', 'INSIDE'],
  },
  beach: {
    bg: 'bg-gradient-to-b from-cyan-200 to-blue-300',
    name: 'Beach',
    subjects: [
      { n: 'LAPS', e: '🧒' },
      { n: 'PALL', e: '⚽' },
      { n: 'MERIKARP', e: '🐚' },
      { n: 'ÕHUPALL', e: '🎈' },
      { n: 'KREVETT', e: '🦐' },
      { n: 'KRABI', e: '🦀' },
    ],
    anchors: [
      { n: 'RAND', adess: 'RANNAL', iness: 'RANNAS', genitive: 'RANNA', e: '🏖️' },
      { n: 'MERI', adess: 'MEREL', iness: 'MERES', genitive: 'MERE', e: '🌊' },
      { n: 'KIVI', adess: 'KIVIL', iness: 'KIVIS', genitive: 'KIVI', e: '🪨' },
      {
        n: 'PÄIKESEVARI',
        adess: 'PÄIKESEVARJUL',
        iness: 'PÄIKESEVARJUS',
        genitive: 'PÄIKESEVARJU',
        e: '⛱️',
      },
    ],
    positions: ['ON', 'UNDER', 'NEXT_TO', 'IN_FRONT', 'INSIDE'],
  },
  kitchen: {
    bg: 'bg-gradient-to-b from-yellow-50 to-orange-50',
    name: 'Kitchen',
    subjects: [
      { n: 'ÕUN', e: '🍎' },
      { n: 'LEIB', e: '🥖' },
      { n: 'KÜPSIS', e: '🍪' },
      { n: 'KOKK', e: '👨‍🍳' },
      { n: 'KARTUL', e: '🥔' },
      { n: 'TOMAT', e: '🍅' },
      { n: 'MUNA', e: '🥚' },
    ],
    anchors: [
      { n: 'AKEN', adess: 'AKNAL', iness: 'AKNAS', genitive: 'AKNA', e: '🪟' },
      { n: 'PLIIT', adess: 'PLIIDIL', iness: 'PLIIDIS', genitive: 'PLIIDI', e: '🍳' },
      { n: 'KAPP', adess: 'KAPIL', iness: 'KAPIS', genitive: 'KAPI', e: '📦' },
      { n: 'KÜLMIK', adess: 'KÜLMIKUL', iness: 'KÜLMIKUS', genitive: 'KÜLMIKU', e: '❄️' },
      { n: 'RIIUL', adess: 'RIIULIL', iness: 'RIIULIS', genitive: 'RIIULI', e: '🗄️' },
      { n: 'KARP', adess: 'KARBIL', iness: 'KARBIS', genitive: 'KARBI', e: '📦' },
    ],
    positions: ['ON', 'UNDER', 'NEXT_TO', 'IN_FRONT', 'BEHIND', 'INSIDE'],
  },
  street: {
    bg: 'bg-gradient-to-b from-gray-200 to-gray-300',
    name: 'Street',
    subjects: [
      { n: 'AUTO', e: '🚗' },
      { n: 'BUSS', e: '🚌' },
      { n: 'RATAS', e: '🚲' },
      { n: 'LAPS', e: '🧒' },
      { n: 'KOER', e: '🐶' },
      { n: 'PALL', e: '⚽' },
    ],
    anchors: [
      { n: 'MAA', adess: 'MAAL', iness: 'MAAS', genitive: 'MAA', e: '🛣️' },
      { n: 'KIVI', adess: 'KIVIL', iness: 'KIVIS', genitive: 'KIVI', e: '🪨' },
      { n: 'LAMP', adess: 'LAMBIL', iness: 'LAMBIS', genitive: 'LAMBI', e: '💡' },
      { n: 'FOOR', adess: 'FOORIL', iness: 'FOORIS', genitive: 'FOORI', e: '🚦' },
    ],
    positions: ['ON', 'UNDER', 'NEXT_TO', 'IN_FRONT', 'BEHIND'],
  },
} satisfies Record<string, Scene>;

type SpatialSentenceSceneId = keyof typeof SCENE_DB;

const SCENE_METADATA: Record<SpatialSentenceSceneId, SpatialSentenceMetadata> = {
  forest: {
    difficulty: 'medium',
    minLevel: 3,
    focus: 'five_position_context',
    learningOutcome: {
      et: 'Asukohalaused viie põhisuhtega loodusstseenis',
      en: 'Spatial sentences with five core relations in a nature scene',
    },
  },
  space: {
    difficulty: 'easy',
    minLevel: 1,
    focus: 'core_prepositions',
    learningOutcome: {
      et: 'Esimesed asukohasuhted: kohal, all, kõrval ja ees',
      en: 'First spatial relations: on, under, next to, and in front',
    },
  },
  room: {
    difficulty: 'hard',
    minLevel: 6,
    focus: 'inside_container_context',
    learningOutcome: {
      et: 'Toa asjad ja sees-suhe segatud asukohalausetes',
      en: 'Room objects and inside relations in mixed spatial sentences',
    },
  },
  school: {
    difficulty: 'hard',
    minLevel: 6,
    focus: 'inside_container_context',
    learningOutcome: {
      et: 'Koolistseen sees-suhte ja kuue valikuga',
      en: 'School scene with inside relations and six possible positions',
    },
  },
  park: {
    difficulty: 'hard',
    minLevel: 6,
    focus: 'inside_container_context',
    learningOutcome: {
      et: 'Pargistseen tuttavate esemete ja sees-suhtega',
      en: 'Park scene with familiar objects and inside relations',
    },
  },
  beach: {
    difficulty: 'medium',
    minLevel: 3,
    focus: 'five_position_context',
    learningOutcome: {
      et: 'Rannastseen viie asukohavalikuga',
      en: 'Beach scene with five spatial choices',
    },
  },
  kitchen: {
    difficulty: 'hard',
    minLevel: 6,
    focus: 'inside_container_context',
    learningOutcome: {
      et: 'Köögistseen mahutite ja sees-suhtega',
      en: 'Kitchen scene with containers and inside relations',
    },
  },
  street: {
    difficulty: 'medium',
    minLevel: 3,
    focus: 'five_position_context',
    learningOutcome: {
      et: 'Tänavastseen ees/taga/kõrval suhete kordamiseks',
      en: 'Street scene for reviewing in front, behind, and next to',
    },
  },
};

export function getSpatialSentenceScenesForLevel(
  items: readonly SpatialSentenceScene[],
  level = 1,
): SpatialSentenceScene[] {
  const scenes = items.filter(
    (scene) => level >= scene.minLevel && (scene.maxLevel === undefined || level <= scene.maxLevel),
  );
  if (scenes.length === 0) {
    throw new Error(`No spatial sentence scenes found for level ${level}`);
  }
  return scenes;
}

export const LANGUAGE_SPATIAL_SENTENCES_PACK: ContentPack<SpatialSentenceScene> = {
  id: 'language.spatial_sentences.scene_pack',
  skillId: LANGUAGE_SPATIAL_SENTENCES_SKILL.id,
  locale: 'et',
  version: '1.1.0',
  title: { et: 'Asukohalausete stseenid', en: 'Spatial sentence scenes' },
  items: (Object.entries(SCENE_DB) as Array<[SpatialSentenceSceneId, Scene]>).map(
    ([id, scene]) => ({
      id,
      ...scene,
      ...SCENE_METADATA[id],
    }),
  ),
};
