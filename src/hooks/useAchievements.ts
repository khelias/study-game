import { useCallback } from 'react';
import { checkAchievements } from '../engine/achievements';
import type { Stats } from '../types/stats';
import type { Achievement } from '../types/achievement';

export function useAchievements() {
  const checkForNewAchievements = useCallback(
    (stats: Stats, unlockedAchievements: string[]): Achievement[] => {
      return checkAchievements(stats, unlockedAchievements);
    },
    [],
  );

  return {
    checkForNewAchievements,
  };
}
