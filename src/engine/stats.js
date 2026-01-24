// Statistika jälgimise süsteem
export const createStats = () => ({
  gamesPlayed: 0,
  correctAnswers: 0,
  wrongAnswers: 0,
  totalScore: 0,
  maxStreak: 0,
  currentStreak: 0,
  maxLevels: {},
  gamesByType: {},
  totalTimePlayed: 0, // sekundites
  lastPlayed: null,
  collectedStars: 0 // Kogutud tähed narratiivi jaoks
});

export const updateStats = (stats, update) => {
  return { ...stats, ...update };
};

export const recordGameStart = (stats, gameType) => {
  return updateStats(stats, {
    gamesPlayed: stats.gamesPlayed + 1,
    gamesByType: {
      ...stats.gamesByType,
      [gameType]: (stats.gamesByType[gameType] || 0) + 1
    },
    lastPlayed: Date.now()
  });
};

export const recordAnswer = (stats, isCorrect) => {
  const newStreak = isCorrect ? stats.currentStreak + 1 : 0;
  return updateStats(stats, {
    [isCorrect ? 'correctAnswers' : 'wrongAnswers']: 
      stats[isCorrect ? 'correctAnswers' : 'wrongAnswers'] + 1,
    currentStreak: newStreak,
    maxStreak: Math.max(stats.maxStreak, newStreak)
  });
};

export const recordLevelUp = (stats, gameType, newLevel) => {
  return updateStats(stats, {
    maxLevels: {
      ...stats.maxLevels,
      [gameType]: Math.max(stats.maxLevels[gameType] || 0, newLevel)
    }
  });
};

export const recordScore = (stats, points) => {
  return updateStats(stats, {
    totalScore: stats.totalScore + points
  });
};
