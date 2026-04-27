import { useGameStore } from '../stores/gameStore';
import type { ProfileType } from '../types/game';

const DISPLAY_LOCALE = 'et-EE';
const PRESERVED_UPPERCASE = new Set(['OK']);

/**
 * Compatibility hook for legacy call sites. The visible UI no longer changes
 * copy based on the hidden starter/advanced generator profile.
 */
export const useProfileText = () => {
  const profile = useGameStore((state) => state.profile) as ProfileType;

  const formatText = (text: string): string => {
    if (!text) return text;
    if (PRESERVED_UPPERCASE.has(text)) return text;

    const upper = text.toLocaleUpperCase(DISPLAY_LOCALE);
    const lower = text.toLocaleLowerCase(DISPLAY_LOCALE);
    const hasCasedLetters = upper !== lower;
    if (hasCasedLetters && text === upper) {
      return lower.replace(
        /^([\s"'([{]*)(\p{L})/u,
        (_match, prefix: string, firstLetter: string) =>
          `${prefix}${firstLetter.toLocaleUpperCase(DISPLAY_LOCALE)}`,
      );
    }
    return text;
  };

  return { formatText, profile };
};
