/**
 * Estonian translations
 * Eesti keele tõlked
 */
export const et = {
  // Common
  common: {
    yes: 'Jah',
    no: 'Ei',
    ok: 'OK',
    cancel: 'Tühista',
    close: 'Sulge',
    save: 'Salvesta',
    delete: 'Kustuta',
    edit: 'Muuda',
    back: 'Tagasi',
    next: 'Järgmine',
    previous: 'Eelmine',
    refresh: 'Värskenda',
    loading: 'Laadimine...',
  },

  // Error messages
  errors: {
    somethingWentWrong: 'Midagi läks valesti',
    gameError: 'Mängus tekkis viga. Proovi lehte värskendada.',
    refreshPage: 'Värskenda lehte',
    unknownGameType: 'Tundmatu mängutüüp',
    confirmReset: 'Kas oled kindel, et soovid kogu progressi kustutada?',
  },

  // Feedback messages
  feedback: {
    correct: [
      'ÕIGE! 🌟',
      'SUUREPÄRANE! ⭐',
      'VÄGA HEA! 🎉',
      'FANTASTILINE! 🚀',
      'IMELISELT! ✨',
      'TUBLI! 💪',
      'TÄIUSLIK! 🏆',
      'HÄMMASTAV! 🌈',
      'WOW! 🔥',
      'VÄGA TUBLI! 🎊',
      'SULLE LIHTNE! 💯',
      'PROFESSIONAALNE! 🎯',
    ],
    wrong: [
      'PROOVI UUESTI! 💪',
      'ÄRA ANNA ALLA! 🌟',
      'SAAD SEDA! ⭐',
      'JÄTKA! 🚀',
      'LÄHED ÕIGELE TEEDELE! 🎯',
      'PROOVI VEEL! 💡',
      'PEAAEGU! ✨',
      'VÄGA LÄHEDAL! 🎉',
      'JÄRGMINE KORD! 🌈',
      'ÄRA LOOBU! 💪',
    ],
    streak: [
      '2 ÕIGET JÄRJEST! 🔥',
      '3 ÕIGET JÄRJEST! ⭐⭐',
      '4 ÕIGET JÄRJEST! 🌟🌟',
      '5 ÕIGET JÄRJEST! 🏆',
      '6 ÕIGET JÄRJEST! 💯',
      '7+ ÕIGET JÄRJEST! 🚀',
    ],
    levelUp: [
      'TASE TÕUSIS! 🎊',
      'UUS TASE! 🌟',
      'EDENED! ⭐',
      'SUUREPÄRANE! 🏆',
    ],
  },

  // Game categories
  categories: {
    language: {
      name: 'Keele mängud',
      description: 'Sõnad, tähed ja laused',
    },
    math: {
      name: 'Matemaatika',
      description: 'Arvutamine ja mõõtmine',
    },
    logic: {
      name: 'Loogika',
      description: 'Mustrid ja programmeerimine',
    },
    memory: {
      name: 'Mälu',
      description: 'Mälumängud',
    },
  },

  // Profiles
  profiles: {
    starter: {
      label: '5+',
      desc: 'Koolieelik',
    },
    advanced: {
      label: '7+',
      desc: 'Koolilaps',
    },
  },

  // Menu
  menu: {
    title: 'Tarkade Mängud',
    selectProfile: 'Vali profiil',
    stats: 'Statistika',
    achievements: 'Saavutused',
    tutorial: 'Õpetus',
    reset: 'Kustuta progress',
    sound: 'Heli',
    soundOn: 'Heli sisse',
    soundOff: 'Heli välja',
    score: 'Skoor',
    stars: 'Tähed',
  },

  // Game
  game: {
    hearts: 'Südamed',
    stars: 'Tähed',
    score: 'Skoor',
    level: 'Tase',
    hint: 'Vihje',
    skip: 'Jäta vahele',
    submit: 'Esita',
    correct: 'Õige',
    wrong: 'Vale',
    gameOver: 'Mäng läbi',
    returnToMenu: 'Tagasi menüüsse',
    levelUp: 'Tase tõusis!',
    newAchievement: 'Uus saavutus!',
  },

  // Stats
  stats: {
    title: 'Statistika',
    gamesPlayed: 'Mängitud mänge',
    accuracy: 'Täpsus',
    bestStreak: 'Parim seeria',
    highestLevel: 'Kõrgeim tase',
    totalStars: 'Kogutud tähed',
    playTime: 'Mänguaeg',
    achievements: 'Saavutused',
  },

  // Achievements
  achievements: {
    title: 'Saavutused',
    unlocked: 'Avatud',
    locked: 'Lukustatud',
    progress: 'Progress',
  },
} as const;

export type TranslationKey = typeof et;
