// Achievement süsteem - saavutused ja medalid
export const ACHIEVEMENTS = {
  first_game: {
    id: 'first_game',
    title: 'Esimene samm',
    desc: 'Mängi oma esimest mängu',
    icon: '🎮',
    check: (stats) => stats.gamesPlayed >= 1
  },
  perfect_5: {
    id: 'perfect_5',
    title: 'Täiuslik seeria',
    desc: 'Vastasid 5 ülesannet järjest õigesti',
    icon: '⭐',
    check: (stats) => stats.maxStreak >= 5
  },
  word_master: {
    id: 'word_master',
    title: 'Sõnameister',
    desc: 'Lõpeta SÕNAMEISTER tase 5',
    icon: '📝',
    check: (stats) => stats.maxLevels?.word_builder >= 5
  },
  math_whiz: {
    id: 'math_whiz',
    title: 'Matemaatikameister',
    desc: 'Lõpeta MATEMAATIKA MÄLU tase 5',
    icon: '🧮',
    check: (stats) => stats.maxLevels?.memory_math >= 5
  },
  pattern_pro: {
    id: 'pattern_pro',
    title: 'Mustriprofi',
    desc: 'Lõpeta MUSTRI-RONG tase 5',
    icon: '🚂',
    check: (stats) => stats.maxLevels?.pattern >= 5
  },
  score_100: {
    id: 'score_100',
    title: '100-punkter',
    desc: 'Kogu 100 punkti',
    icon: '💯',
    check: (stats) => stats.totalScore >= 100
  },
  score_500: {
    id: 'score_500',
    title: '500-punkter',
    desc: 'Kogu 500 punkti',
    icon: '🏆',
    check: (stats) => stats.totalScore >= 500
  },
  persistent: {
    id: 'persistent',
    title: 'Püsivus',
    desc: 'Mängi 10 mängu järjest',
    icon: '💪',
    check: (stats) => stats.gamesPlayed >= 10
  },
  all_games: {
    id: 'all_games',
    title: 'Kõik mängud',
    desc: 'Proovi kõiki mängutüüpe',
    icon: '🎯',
    check: (stats) => {
      const allTypes = ['word_builder', 'memory_math', 'sentence_logic', 'balance_scale', 
                       'letter_match', 'pattern', 'robo_path', 'syllable_builder', 'time_match'];
      return allTypes.every(type => (stats.gamesByType?.[type] || 0) > 0);
    }
  },
  star_collector_50: {
    id: 'star_collector_50',
    title: 'Tähtede koguja',
    desc: 'Kogu 50 tähte',
    icon: '⭐',
    check: (stats) => (stats.collectedStars || 0) >= 50
  },
  star_collector_100: {
    id: 'star_collector_100',
    title: 'Tähtede meister',
    desc: 'Kogu 100 tähte',
    icon: '🌟',
    check: (stats) => (stats.collectedStars || 0) >= 100
  },
  star_collector_250: {
    id: 'star_collector_250',
    title: 'Tähtede legenda',
    desc: 'Kogu 250 tähte',
    icon: '✨',
    check: (stats) => (stats.collectedStars || 0) >= 250
  }
};

export const checkAchievements = (stats, unlocked) => {
  const newUnlocks = [];
  Object.values(ACHIEVEMENTS).forEach(achievement => {
    if (!unlocked.includes(achievement.id) && achievement.check(stats)) {
      newUnlocks.push(achievement);
    }
  });
  return newUnlocks;
};
