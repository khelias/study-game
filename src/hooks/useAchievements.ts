import { useCallback } from 'react';
import { checkAchievements } from '../engine/achievements';
import type { Stats } from '../types/stats';

interface AchievementData {
  id: string;
  title: string;
  desc: string;
  icon: string;
}

export function useAchievements() {
  const checkForNewAchievements = useCallback((stats: Stats, unlockedAchievements: string[]): AchievementData[] => {
    return checkAchievements(stats, unlockedAchievements);
  }, []);

  return {
    checkForNewAchievements,
  };
}
