/**
 * Hook for formatting text based on user profile
 * Koolieelik (starter) -> uppercase
 * Koolilaps (advanced) -> normal case (convert uppercase to title case)
 */
import { useGameStore } from '../stores/gameStore';
import type { ProfileType } from '../types/game';

/**
 * Converts uppercase text to title case (first letter uppercase, rest lowercase)
 */
const toTitleCase = (text: string): string => {
  return text
    .split(' ')
    .map((word) => {
      if (word.length === 0) return word;
      // Handle special words like "ON" which should stay uppercase in Estonian
      if (word === 'ON' || word === 'ON.') return word;
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ');
};

/**
 * Formats text based on profile:
 * - starter (koolieelik): uppercase
 * - advanced (koolilaps): normal case (convert uppercase to title case if needed)
 */
export const useProfileText = () => {
  const profile = useGameStore((state) => state.profile) as ProfileType;

  const formatText = (text: string): string => {
    if (!text) return text;
    if (profile === 'starter') {
      return text.toUpperCase();
    } else {
      // For advanced profile, if text is all uppercase, convert to title case
      // Otherwise, return as-is
      if (text === text.toUpperCase() && text !== text.toLowerCase()) {
        return toTitleCase(text);
      }
      return text;
    }
  };

  return { formatText, profile };
};
