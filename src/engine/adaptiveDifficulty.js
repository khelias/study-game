// Adaptiivne raskusaste süsteem - kohandab raskust vastavalt mängija jõudlusele
export const createAdaptiveDifficulty = () => ({
  // Mängija jõudlusmõõdikud
  recentAccuracy: [], // Viimased 10 vastust (true/false)
  averageResponseTime: [], // Viimased 10 vastuse aega (ms)
  consecutiveCorrect: 0, // Järjestikused õiged vastused
  consecutiveWrong: 0, // Järjestikused valed vastused
  
  // Raskusaste parameetrid
  difficultyMultiplier: 1.0, // 0.5 (lihtne) kuni 2.0 (raske)
  levelAdjustment: 0, // -2 kuni +2 leveli kohandus
});

export const updateAdaptiveDifficulty = (adaptive, isCorrect, responseTime = null) => {
  const updated = { ...adaptive };
  
  // Uuenda viimaseid vastuseid
  updated.recentAccuracy = [...updated.recentAccuracy, isCorrect].slice(-10);
  if (responseTime !== null) {
    updated.averageResponseTime = [...updated.averageResponseTime, responseTime].slice(-10);
  }
  
  // Uuenda järjestikuste vastuste loendurit
  if (isCorrect) {
    updated.consecutiveCorrect += 1;
    updated.consecutiveWrong = 0;
  } else {
    updated.consecutiveWrong += 1;
    updated.consecutiveCorrect = 0;
  }
  
  // Arvuta täpsus
  const accuracy = updated.recentAccuracy.length > 0
    ? updated.recentAccuracy.filter(a => a).length / updated.recentAccuracy.length
    : 0.5;
  
  // Arvuta keskmine vastuse aeg (kui on andmeid)
  const avgResponseTime = updated.averageResponseTime.length > 0
    ? updated.averageResponseTime.reduce((a, b) => a + b, 0) / updated.averageResponseTime.length
    : null;
  
  // Adaptiivne raskusaste loogika
  // Kui täpsus > 80% ja on 3+ järjestikust õiget vastust -> suurenda raskust
  if (accuracy > 0.8 && updated.consecutiveCorrect >= 3) {
    updated.difficultyMultiplier = Math.min(updated.difficultyMultiplier + 0.1, 2.0);
    updated.levelAdjustment = Math.min(updated.levelAdjustment + 0.5, 2);
  }
  // Kui täpsus < 50% või on 3+ järjestikust vale vastust -> vähenda raskust
  else if (accuracy < 0.5 || updated.consecutiveWrong >= 3) {
    updated.difficultyMultiplier = Math.max(updated.difficultyMultiplier - 0.1, 0.5);
    updated.levelAdjustment = Math.max(updated.levelAdjustment - 0.5, -2);
  }
  // Kui vastab liiga kiiresti (võib-olla juhuslikult) -> suurenda raskust
  else if (avgResponseTime !== null && avgResponseTime < 1000 && accuracy > 0.7) {
    updated.difficultyMultiplier = Math.min(updated.difficultyMultiplier + 0.05, 2.0);
  }
  
  return updated;
};

// Arvuta efektne level adaptiivse raskusastega
export const getEffectiveLevel = (baseLevel, adaptive) => {
  const adjusted = Math.max(1, Math.round(baseLevel + adaptive.levelAdjustment));
  return adjusted;
};

// Arvuta raskusaste mängutüübi jaoks
export const getDifficultyForGame = (gameType, baseLevel, adaptive, profile) => {
  const effectiveLevel = getEffectiveLevel(baseLevel, adaptive);
  const multiplier = adaptive.difficultyMultiplier;
  
  return {
    effectiveLevel,
    multiplier,
    // Tagastab raskusaste parameetrid, mida saab kasutada ülesannete genereerimisel
    isHarder: multiplier > 1.2,
    isEasier: multiplier < 0.8,
  };
};
