// Mängu progressiooni süsteem - parem raskusaste ja progressioon
import { PROFILES } from '../games/data';

/**
 * Arvuta optimaalne raskusaste mängutüübi ja profiili jaoks
 */
export const calculateOptimalDifficulty = (gameType, level, profile) => {
  const profileData = PROFILES[profile] || PROFILES.starter;
  const baseLevel = profileData.levelStart || 1;
  const difficultyOffset = profileData.difficultyOffset || 0;
  
  // Sujuvam progressioon - vähem järske hüppeid
  const effectiveLevel = Math.max(1, level + difficultyOffset);
  
  return {
    effectiveLevel,
    baseLevel,
    difficultyOffset,
    // Tagastab raskusaste parameetrid
    isEasy: effectiveLevel <= 2,
    isMedium: effectiveLevel > 2 && effectiveLevel <= 5,
    isHard: effectiveLevel > 5,
  };
};

/**
 * Arvuta järgmise taseme raskusaste
 */
export const getNextLevelDifficulty = (currentLevel, performance) => {
  // Kui jõudlus on hea (>80% täpsus), suurenda raskust kiiremini
  // Kui jõudlus on halb (<50% täpsus), suurenda raskust aeglasemalt
  const { accuracy, averageTime } = performance;
  
  let levelIncrease = 1;
  
  if (accuracy > 0.8 && averageTime < 5000) {
    // Hea jõudlus - suurenda raskust
    levelIncrease = 1.5;
  } else if (accuracy < 0.5 || averageTime > 15000) {
    // Halb jõudlus - suurenda raskust aeglasemalt
    levelIncrease = 0.5;
  }
  
  return Math.max(1, Math.floor(currentLevel + levelIncrease));
};

/**
 * Arvuta mängu progressiooni soovitus
 */
export const getProgressionRecommendation = (stats, gameType) => {
  const gameStats = stats.gamesByType?.[gameType] || 0;
  const maxLevel = stats.maxLevels?.[gameType] || 1;
  const accuracy = stats.correctAnswers / (stats.correctAnswers + stats.wrongAnswers) || 0;
  
  if (gameStats === 0) {
    return {
      message: 'Alusta seda mängu!',
      action: 'start',
      priority: 'high'
    };
  }
  
  if (accuracy > 0.8 && maxLevel < 5) {
    return {
      message: 'Sul läheb väga hästi! Proovi kõrgemat taset.',
      action: 'level_up',
      priority: 'medium'
    };
  }
  
  if (accuracy < 0.5 && maxLevel > 3) {
    return {
      message: 'Võib-olla on mäng liiga raske? Proovi lihtsamat taset.',
      action: 'level_down',
      priority: 'low'
    };
  }
  
  return {
    message: 'Jätka harjutamist!',
    action: 'continue',
    priority: 'low'
  };
};

/**
 * Arvuta mängu edukuse skoor
 */
export const calculateGameSuccessScore = (stats, gameType) => {
  const gameStats = stats.gamesByType?.[gameType] || 0;
  const maxLevel = stats.maxLevels?.[gameType] || 1;
  const accuracy = stats.correctAnswers / (stats.correctAnswers + stats.wrongAnswers) || 0;
  
  // Skoor 0-100
  const levelScore = Math.min(100, maxLevel * 10);
  const accuracyScore = accuracy * 50;
  const gamesPlayedScore = Math.min(30, gameStats * 2);
  
  return Math.round(levelScore + accuracyScore + gamesPlayedScore);
};
