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

  // Accessibility
  accessibility: {
    skipToContent: 'Jäta vahele navigatsioon',
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

  // Notification labels
  notifications: {
    correctTitle: 'Õige!',
    wrongTitle: 'Proovi uuesti!',
    streakSuffix: 'õiget järjest!',
    hintTitle: 'Vihje',
    tipTitle: 'Näpunäide',
    infoTitle: 'Info',
    achievementTitle: 'Saavutus!',
    levelUpTitle: 'Tase tõusis!',
    closeTip: 'Sulge näpunäide',
    closeHint: 'Sulge vihje',
    closeAchievement: 'Sulge saavutus',
    closeLevelUp: 'Sulge taseme tõus',
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
    settings: 'Seaded',
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
    scoreMessage: 'Said {score} punkti!',
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
    streakSuffix: 'järjestikust õiget',
    perGame: 'mängu kohta',
    noGamesPlayed: 'Pole veel mängutüüpe mängitud',
    mostPlayedGames: 'Kõige rohkem mängitud mängud',
    gamesLabel: 'mängu',
  },

  // Learning progress
  learningProgress: {
    title: 'Õppimise edenemine',
    scoreLabel: 'Õppimise skoor',
    stages: {
      master: 'Meister',
      advanced: 'Edasijõudnud',
      practicing: 'Harjutab',
      beginner: 'Algaja',
    },
    metrics: {
      accuracy: 'Täpsus',
      level: 'Tase',
      games: 'Mängud',
    },
    encouragement: {
      high: '🎉 Väga tubli! Sa oled tõeline meister!',
      low: '💪 Harjuta edasi! Iga samm loeb!',
    },
    skillOverviewTitle: 'Oskuste ülevaade',
    skills: {
      reading: 'Lugemine',
      math: 'Matemaatika',
      logic: 'Loogika',
    },
    skillSummary: '{games} mängu • Tase {level}',
  },

  // Achievements
  achievements: {
    title: 'Saavutused',
    unlocked: 'Avatud',
    locked: 'Lukustatud',
    progress: 'Progress',
    modalTitle: 'Saavutused 🏅',
    collectedLabel: 'saavutust kogutud',
    items: {
      first_game: {
        title: 'Esimene samm',
        desc: 'Mängi oma esimest mängu',
      },
      perfect_5: {
        title: 'Täiuslik seeria',
        desc: 'Vastasid 5 ülesannet järjest õigesti',
      },
      word_master: {
        title: 'Sõnameister',
        desc: 'Lõpeta SÕNAMEISTER tase 5',
      },
      math_whiz: {
        title: 'Matemaatikameister',
        desc: 'Lõpeta MATEMAATIKA MÄLU tase 5',
      },
      pattern_pro: {
        title: 'Mustriprofi',
        desc: 'Lõpeta MUSTRI-RONG tase 5',
      },
      score_100: {
        title: '100-punkter',
        desc: 'Kogu 100 punkti',
      },
      score_500: {
        title: '500-punkter',
        desc: 'Kogu 500 punkti',
      },
      persistent: {
        title: 'Püsivus',
        desc: 'Mängi 10 mängu',
      },
      all_games: {
        title: 'Kõik mängud',
        desc: 'Proovi kõiki mängutüüpe',
      },
      star_collector_50: {
        title: 'Tähtede koguja',
        desc: 'Kogu 50 tähte',
      },
      star_collector_100: {
        title: 'Tähtede meister',
        desc: 'Kogu 100 tähte',
      },
      star_collector_250: {
        title: 'Tähtede legenda',
        desc: 'Kogu 250 tähte',
      },
    },
  },

  // Menu specific
  menuSpecific: {
    subtitle: 'HARJUTA JA ÕPI',
    starsLabel: 'tähte',
    achievementsCount: 'saavutust - kliki, et näha kõiki',
    showAchievements: 'Näita saavutusi',
    showStats: 'Näita statistikat',
    toggleSoundOn: 'Lülita heli sisse',
    toggleSoundOff: 'Lülita heli välja',
    deleteProgress: 'Kustuta salvestatud progress',
    showTutorial: 'Näita juhendit',
    tutorial: 'Juhend',
    starterDescription: '👶 Vali mäng ja harjuta lugemist ja loogikat!',
    advancedDescription: '🧒 Vali mäng ja harjuta matemaatikat ja mõtlemist!',
    gamesCount: 'mängu',
    starCollector: '⭐ Tähtede koguja!',
    starMaster: '⭐⭐ Tähtede meister!',
    starLegend: '✨ Tähtede legenda!',
    newGame: 'UUS!',
    language: 'Keel',
    selectLanguage: 'Vali keel',
  },

  // Tutorial
  tutorial: {
    welcome: {
      title: 'Tere tulemast! 🎮',
      content: 'See on õppemäng, kus saad harjutada lugemist, matemaatikat ja loogikat!',
    },
    selectAge: {
      title: 'Vali oma vanus 🎯',
      content: 'Vali menüüs oma vanusegrupp (5+ või 7+), et saada sobivad ülesanded.',
    },
    selectGame: {
      title: 'Vali mäng 🎲',
      content: 'Vali mäng, mida soovid mängida. Igal mängul on oma teema ja raskusaste.',
    },
    answerCorrectly: {
      title: 'Vasta õigesti ⭐',
      content: 'Iga õige vastus annab sulle tähe. Kui kogud 5 tähte, tõused taseme võrra!',
    },
    beCareful: {
      title: 'Ole ettevaatlik ❤️',
      content: 'Iga vale vastus võtab ühe südame ära. Kui südamed otsa saavad, mäng lõppeb.',
    },
    collectAchievements: {
      title: 'Kogu saavutusi 🏅',
      content: 'Kogu medaleid ja jälgi oma statistikat menüü ülevalt!',
    },
    close: 'Sulge juhend',
    back: 'Tagasi',
    next: 'Järgmine',
    startGame: 'Alusta mängu!',
  },

  // Game screen
  gameScreen: {
    returnToMenu: 'Tagasi menüüsse',
    starProgress: {
      one: '1/5 tähte! 🌟',
      two: '2/5 tähte! ⭐⭐',
      three: '3/5 tähte! ⭐⭐⭐',
      four: '4/5 tähte! ⭐⭐⭐⭐',
      last: 'Viimane täht! ⭐⭐⭐⭐⭐',
    },
    sentenceLogic: {
      selectCorrectPicture: 'Vali õige pilt',
      scene: 'Stseen',
      positions: {
        NEXT_TO: 'kõrval',
        ON: 'kohal',
        UNDER: 'all',
        IN_FRONT: 'ees',
        BEHIND: 'taga',
        INSIDE: 'sees',
      },
    },
    syllableBuilder: {
      instruction: 'PANE SILBID ÕIGESSE JÄRJEKORDA, ET SAADA SÕNA',
      correct: 'ÕIGE:',
    },
    wordBuilder: {
      preFilled: 'Vihje: mõned tähed on juba õiges kohas!',
      useAllLetters: 'Kasuta kõiki õigeid tähti',
      watchCase: 'Pane tähele suuri ja väikeseid tähti!',
    },
    pattern: {
      tagline: 'Mustri-rong',
      instruction: 'Jätka mustrit',
      subInstruction: 'Puuduta järgmist vagunit',
      feedbackTitle: 'Peaaegu!',
      feedbackReason: 'Muster kordub {pattern}. Järgmine peab olema {answer}.',
      feedbackChoiceLabel: 'Valisid',
      patternLabel: 'Muster',
    },
    memoryMath: {
      pairsLabel: 'Paarid',
    },
    timeMatch: {
      selectCorrectTime: 'Vali õige kellaaeg',
      correctTimeIs: 'Õige aeg on',
    },
    hints: {
      wordBuilder: 'Sõna algab tähega',
      syllableBuilder: 'Sõna algab silbiga',
      balanceScale: 'Vasak pool on',
      balanceScaleRight: 'parem pool on',
      pattern: 'Vaata, mis mustrit järgib rong!',
      memoryMath: 'Pööra kaardid ümber ja leia paarid!',
      sentenceLogic: 'Vaata, kus asub',
      sentenceLogicScene: 'stseenis!',
      roboPath: 'Robot peab jõudma rohelise aknaga lahtrisse!',
      timeMatch: 'Vaata kella osuteid!',
      unitConversion: 'Arvuta ümber!',
      default: 'Proovi veel!',
    },
    hintButton: {
      show: 'Näita vihjet',
      used: 'Vihje on juba kasutatud',
    },
    tipButton: {
      show: 'Ava näpunäide',
      unavailable: 'Näpunäide pole veel saadaval',
    },
    tips: {
      word_builder: [
        'Proovi mõelda, mis sõna võiks emoji järgi olla!',
        'Vaata esimest tähte - see aitab alustada!',
        'Mõtle, millised tähed sobivad kokku!',
      ],
      syllable_builder: [
        'Silbid on sõna osad - proovi neid kokku panna!',
        'Vaata, kuidas silbid kokku sobivad!',
        'Mõtle, kuidas sõna kõlab, kui loed seda!',
      ],
      pattern: [
        'Vaata, mis mustrit järgib rong!',
        'Mõtle, mis järgmisena peaks tulema!',
        'Vaata, kuidas emojid korduvad!',
      ],
      sentence_logic: [
        'Loe lauset hoolikalt läbi!',
        'Vaata, kus objektid stseenis asuvad!',
        'Mõtle, mis on loogiline!',
      ],
      memory_math: [
        'Pööra kaardid ümber ja leia paarid!',
        'Mõtle, mis arvud kokku annavad tehte vastuse!',
        'Proovi meelde jätta, kus mis kaart on!',
      ],
      balance_scale: [
        'Arvuta, kui palju on vasakul pool!',
        'Mõtle, mis arv tasakaalustab kaalud!',
        'Vaata, kui palju on paremal pool!',
      ],
      robo_path: [
        'Mõtle, kuidas robot peab liikuma!',
        'Vaata, kus on takistused!',
        'Proovi sammhaaval!',
      ],
      time_match: [
        'Vaata kella osuteid!',
        'Mõtle, mis kellaaeg on näidatud!',
        'Tund on suurem number, minut väiksem!',
      ],
      letter_match: [
        'Vaata suurt tähte ja leia väike!',
        'Mõtle, mis täht sobib!',
        'Suur ja väike täht on sama!',
      ],
      unit_conversion: [
        'Loe küsimust hoolikalt!',
        'Mõtle ühikute vahekordadele!',
        'Kontrolli vastust väikese näitega!',
      ],
    },
  },

  // Stats modal
  statsModal: {
    title: 'Statistika 📊',
    close: 'Sulge statistika',
    highestLevels: 'Kõrgeimad tasemed',
  },

  // Progression
  progression: {
    startGame: 'Alusta seda mängu!',
    doingGreat: 'Sul läheb väga hästi! Proovi kõrgemat taset.',
    maybeTooHard: 'Võib-olla on mäng liiga raske? Proovi lihtsamat taset.',
    keepPracticing: 'Jätka harjutamist!',
  },

  // Progression card
  progressionCard: {
    recommendation: 'Soovitus',
    successScore: 'Edu skoor',
    currentLevel: 'Praegune tase',
    nextLevel: 'Järgmine',
    starsCollectedLabel: '{current} / {total} tähte kogutud',
  },

  // Robo path game
  roboPath: {
    addCommandUp: 'Lisa käsk: üles',
    addCommandDown: 'Lisa käsk: alla',
    addCommandLeft: 'Lisa käsk: vasakule',
    addCommandRight: 'Lisa käsk: paremale',
    removeCommand: 'Eemalda viimane käsk',
    runRobot: 'Käivita robot',
    addCommands: 'Lisa käsud...',
    max: 'MAX',
    distanceToGoal: 'Kaugus eesmärgini:',
    steps: 'sammu',
    showNumbers: 'Näita numbreid',
    hideNumbers: 'Peida numbrid',
    hint: '💡 Vihje',
    hint1: 'Proovi liikuda eesmärgi suunas!',
    hint2: 'Vältimaks kive, proovi teist teed!',
    hint3: 'Vaata optimaalset teed (poolläbipaistev nool näitab)',
    crashWithStone: '❌ Oih! Robot põrkas kiviga kokku!',
    needMoreCommands: '❌ Robot vajab rohkem käske eesmärgi saavutamiseks!',
    reachedGoal: '✅ Tubli! Robot jõudis eesmärgini!',
    programming: 'Programmeerimine on järjestikuste käskude andmine',
    avoidObstacles: 'Takistused (kivid) tuleb ümber käia',
    excellent: 'Suurepärane! ⭐⭐⭐',
    good: 'Tubli! ⭐⭐',
    solved: 'Lahendatud! ⭐',
    youUsed: 'Sul kulus',
    commands: 'käsku',
    optimalIs: 'optimaalne on',
    time: 'Aeg:',
    bestTime: 'Parim:',
    earnedXP: 'Teenitud XP:',
    tryAgainFor3Stars: 'Proovi uuesti, et saada 3 tärni!',
    tryAgainPrompt: 'Kas proovid uuesti, et saada kõik tärnid?',
    tryAgainButton: 'Proovi uuesti',
    nextButton: 'Edasi',
    stars: 'Tärnid:',
  },

  // Unit conversion game
  unitConversion: {
    question: 'Mitu {to} on {value} {from}?',
    units: {
      m: 'meetrit',
      km: 'kilomeetrit',
      cm: 'sentimeetrit',
      mm: 'millimeetrit',
      kg: 'kilogrammi',
      g: 'grammi',
      t: 'tonni',
      l: 'liitrit',
      ml: 'milliliitrit',
      dl: 'detsiliitrit',
    },
  },

  // Level up modal
  levelUp: {
    level: 'TASE',
    greatWork: 'Suurepärane töö! Oled tõeline meister. ⭐',
    nextLevel: 'JÄRGMINE TASE',
  },

  // Game names and descriptions
  games: {
    word_builder: {
      title: 'SÕNAMEISTER',
      desc: 'Lao tähtedest sõna kokku',
    },
    syllable_builder: {
      title: 'SILBIMEISTER',
      desc: 'Pane silbid sõnaks kokku',
    },
    pattern: {
      title: 'MUSTRI-RONG',
      desc: 'Jätka mustrit',
    },
    sentence_logic: {
      title: 'LAUSE-DETEKTIIV',
      desc: 'Kus asub ese?',
    },
    memory_math: {
      title: 'MATEMAATIKA MÄLU',
      desc: 'Leia tehe ja vastus',
    },
    robo_path: {
      title: 'ROBO-RADA',
      desc: 'Programmeerirobot',
    },
    letter_match: {
      title: 'TÄHE-DETEKTIIV',
      desc: 'Leia õige täht',
    },
    unit_conversion: {
      title: 'MÕÕTÜHIKUD',
      desc: 'Muunda ühikuid',
    },
    balance_scale: {
      title: 'KAALUD',
      desc: 'Tasakaalusta kaalud',
    },
    time_match: {
      title: 'KELLAMÄNG',
      desc: 'Määra kellaaeg',
    },
  },

  // Difficulty levels
  difficulty: {
    easy: '⭐ Lihtne',
    medium: '⭐⭐ Keskmine',
    hard: '⭐⭐⭐ Raske',
  },

  // Level label
  level: 'Tase',
} as const;

export type TranslationKey = typeof et;
