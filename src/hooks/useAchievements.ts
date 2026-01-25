import { useCallback } from 'react';
import { checkAchievements } from '../engine/achievements';

interface AchievementData {
  id: string;
  title: string;
  desc: string;
  icon: string;
}

export function useAchievements() {
  const checkForNewAchievements = useCallback((stats: any, unlockedAchievements: string[]): AchievementData[] => {
    return checkAchievements(stats, unlockedAchievements);
  }, []);

  return {
    checkForNewAchievements,
  };
}
