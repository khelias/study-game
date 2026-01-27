/**
 * Translations for sentence_logic game objects and positions
 * Supports Estonian and English
 */

import type { SceneSubject, SceneAnchor } from '../types/game';

// English translations for Estonian object names
const OBJECT_TRANSLATIONS: Record<string, { en: string }> = {
  // Subjects
  'REBANE': { en: 'Fox' },
  'JÄNES': { en: 'Rabbit' },
  'KARU': { en: 'Bear' },
  'SIIL': { en: 'Hedgehog' },
  'ORAV': { en: 'Squirrel' },
  'HUNT': { en: 'Wolf' },
  'PÕDER': { en: 'Moose' },
  'KITS': { en: 'Goat' },
  'HIRV': { en: 'Deer' },
  'KONN': { en: 'Frog' },
  'RAKETT': { en: 'Rocket' },
  'UFO': { en: 'UFO' },
  'ASTRONAUT': { en: 'Astronaut' },
  'TÄHT': { en: 'Star' },
  'PLANEET': { en: 'Planet' },
  'KOMEET': { en: 'Comet' },
  'SATELLIIT': { en: 'Satellite' },
  'AUTO': { en: 'Car' },
  'BUSS': { en: 'Bus' },
  'PALL': { en: 'Ball' },
  'KASS': { en: 'Cat' },
  'KOER': { en: 'Dog' },
  'ROBOT': { en: 'Robot' },
  'PUSLE': { en: 'Puzzle' },
  'RAAMAT': { en: 'Book' },
  'LAPS': { en: 'Child' },
  'RATAS': { en: 'Bicycle' },
  'ÕHUPALL': { en: 'Balloon' },
  'KELK': { en: 'Sled' },
  'KREVETT': { en: 'Shrimp' },
  'KRABI': { en: 'Crab' },
  'KALLA': { en: 'Shell' },
  'ÕUN': { en: 'Apple' },
  'LEIB': { en: 'Bread' },
  'KÜPSIS': { en: 'Cookie' },
  'KOKK': { en: 'Chef' },
  'KARTUL': { en: 'Potato' },
  'TOMAT': { en: 'Tomato' },
  'MUNA': { en: 'Egg' },
  'ÕPILANE': { en: 'Student' },
  'ÕPETAJA': { en: 'Teacher' },
  'PLIIATS': { en: 'Pencil' },
  'KALKULAATOR': { en: 'Calculator' },
  'KUSTUTI': { en: 'Eraser' },
  'ÕPIK': { en: 'Textbook' },
  
  // Anchors
  'PUU': { en: 'Tree' },
  'KIVI': { en: 'Stone' },
  'PÕÕSAS': { en: 'Bush' },
  'SEEN': { en: 'Mushroom' },
  'KÄND': { en: 'Stump' },
  'JÕGI': { en: 'River' },
  'MAA': { en: 'Ground' },
  'KUU': { en: 'Moon' },
  'PÄIKE': { en: 'Sun' },
  'KARP': { en: 'Box' },
  'VOODI': { en: 'Bed' },
  'TOOL': { en: 'Chair' },
  'DIIVAN': { en: 'Sofa' },
  'KAPP': { en: 'Cupboard' },
  'RIIUL': { en: 'Shelf' },
  'AKEN': { en: 'Window' },
  'LAUD': { en: 'Table' },
  'TAHVEL': { en: 'Board' },
  'TABEL': { en: 'Chart' },
  'LILL': { en: 'Flower' },
  'TEKK': { en: 'Blanket' },
  'LIIV': { en: 'Sand' },
  'MERI': { en: 'Sea' },
  'PÄIKESEVARI': { en: 'Umbrella' },
  'PLIIT': { en: 'Stove' },
  'KÜLMIK': { en: 'Refrigerator' },
  'LAMP': { en: 'Lamp' },
  'FOOR': { en: 'Traffic Light' },
  'PUIESTEE': { en: 'Sidewalk' },
};

// Position translations
const POSITION_TRANSLATIONS: Record<string, { et: string; en: string }> = {
  'NEXT_TO': { et: 'kõrval', en: 'next to' },
  'ON': { et: 'kohal', en: 'on' },
  'UNDER': { et: 'all', en: 'under' },
  'IN_FRONT': { et: 'ees', en: 'in front of' },
  'BEHIND': { et: 'taga', en: 'behind' },
  'INSIDE': { et: 'sees', en: 'inside' },
};

// Get English form for anchor (simplified - no cases in English)
function getAnchorEnglishForm(anchor: SceneAnchor, _position: string): string {
  // For English, we use simple preposition structure
  // "next to the tree", "on the tree", "under the tree", etc.
  const baseName = OBJECT_TRANSLATIONS[anchor.n]?.en || anchor.n;
  return baseName.toLowerCase();
}

// Scene name translations  
const SCENE_NAME_TRANSLATIONS: Record<string, { et: string; en: string }> = {
  'Forest': { et: 'Mets', en: 'Forest' },
  'Space': { et: 'Kosmos', en: 'Space' },
  'Room': { et: 'Tuba', en: 'Room' },
  'School': { et: 'Kool', en: 'School' },
  'Park': { et: 'Park', en: 'Park' },
  'Beach': { et: 'Rand', en: 'Beach' },
  'Kitchen': { et: 'Köök', en: 'Kitchen' },
  'Street': { et: 'Tänav', en: 'Street' },
};

export function getSceneName(sceneName: string, locale: 'et' | 'en' = 'et'): string {
  const translation = SCENE_NAME_TRANSLATIONS[sceneName];
  if (!translation) return sceneName;
  return locale === 'en' ? translation.en : translation.et;
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
  locale: 'et' | 'en' = 'et'
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
