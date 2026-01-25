/**
 * English translations
 * Inglise keele tõlked
 */
export const en = {
  // Common
  common: {
    yes: 'Yes',
    no: 'No',
    ok: 'OK',
    cancel: 'Cancel',
    close: 'Close',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    back: 'Back',
    next: 'Next',
    previous: 'Previous',
    refresh: 'Refresh',
    loading: 'Loading...',
  },

  // Error messages
  errors: {
    somethingWentWrong: 'Something went wrong',
    gameError: 'An error occurred in the game. Try refreshing the page.',
    refreshPage: 'Refresh page',
    unknownGameType: 'Unknown game type',
    confirmReset: 'Are you sure you want to delete all progress?',
  },

  // Feedback messages
  feedback: {
    correct: [
      'CORRECT! 🌟',
      'GREAT! ⭐',
      'VERY GOOD! 🎉',
      'FANTASTIC! 🚀',
      'WONDERFUL! ✨',
      'GOOD JOB! 💪',
      'PERFECT! 🏆',
      'AMAZING! 🌈',
      'WOW! 🔥',
      'VERY GOOD! 🎊',
      'EASY FOR YOU! 💯',
      'PROFESSIONAL! 🎯',
    ],
    wrong: [
      'TRY AGAIN! 💪',
      "DON'T GIVE UP! 🌟",
      'YOU CAN DO IT! ⭐',
      'KEEP GOING! 🚀',
      "YOU'RE ON THE RIGHT TRACK! 🎯",
      'TRY MORE! 💡',
      'ALMOST! ✨',
      'VERY CLOSE! 🎉',
      'NEXT TIME! 🌈',
      "DON'T QUIT! 💪",
    ],
    streak: [
      '2 CORRECT IN A ROW! 🔥',
      '3 CORRECT IN A ROW! ⭐⭐',
      '4 CORRECT IN A ROW! 🌟🌟',
      '5 CORRECT IN A ROW! 🏆',
      '6 CORRECT IN A ROW! 💯',
      '7+ CORRECT IN A ROW! 🚀',
    ],
    levelUp: [
      'LEVEL UP! 🎊',
      'NEW LEVEL! 🌟',
      'PROGRESSING! ⭐',
      'GREAT! 🏆',
    ],
  },

  // Game categories
  categories: {
    language: {
      name: 'Language Games',
      description: 'Words, letters and sentences',
    },
    math: {
      name: 'Math',
      description: 'Calculations and measurements',
    },
    logic: {
      name: 'Logic',
      description: 'Patterns and programming',
    },
    memory: {
      name: 'Memory',
      description: 'Memory games',
    },
  },

  // Profiles
  profiles: {
    starter: {
      label: '5+',
      desc: 'Preschooler',
    },
    advanced: {
      label: '7+',
      desc: 'School child',
    },
  },

  // Menu
  menu: {
    title: 'Smart Games',
    selectProfile: 'Select profile',
    stats: 'Statistics',
    achievements: 'Achievements',
    tutorial: 'Tutorial',
    reset: 'Reset progress',
    sound: 'Sound',
    soundOn: 'Sound on',
    soundOff: 'Sound off',
    score: 'Score',
    stars: 'Stars',
  },

  // Game
  game: {
    hearts: 'Hearts',
    stars: 'Stars',
    score: 'Score',
    level: 'Level',
    hint: 'Hint',
    skip: 'Skip',
    submit: 'Submit',
    correct: 'Correct',
    wrong: 'Wrong',
    gameOver: 'Game Over',
    returnToMenu: 'Return to menu',
    levelUp: 'Level up!',
    newAchievement: 'New achievement!',
  },

  // Stats
  stats: {
    title: 'Statistics',
    gamesPlayed: 'Games played',
    accuracy: 'Accuracy',
    bestStreak: 'Best streak',
    highestLevel: 'Highest level',
    totalStars: 'Total stars',
    playTime: 'Play time',
    achievements: 'Achievements',
  },

  // Achievements
  achievements: {
    title: 'Achievements',
    unlocked: 'Unlocked',
    locked: 'Locked',
    progress: 'Progress',
  },

  // Menu specific
  menuSpecific: {
    subtitle: 'PRACTICE AND LEARN',
    starsLabel: 'stars',
    achievementsCount: 'achievements - click to see all',
    showAchievements: 'Show achievements',
    showStats: 'Show statistics',
    toggleSoundOn: 'Turn sound on',
    toggleSoundOff: 'Turn sound off',
    deleteProgress: 'Delete saved progress',
    showTutorial: 'Show tutorial',
    tutorial: 'Tutorial',
    starterDescription: '👶 Choose a game and practice reading and logic!',
    advancedDescription: '🧒 Choose a game and practice math and thinking!',
    gamesCount: 'games',
    starCollector: '⭐ Star Collector!',
    starMaster: '⭐⭐ Star Master!',
    starLegend: '✨ Star Legend!',
    newGame: 'NEW!',
    language: 'Language',
    selectLanguage: 'Select language',
  },

  // Tutorial
  tutorial: {
    welcome: {
      title: 'Welcome! 🎮',
      content: 'This is an educational game where you can practice reading, math and logic!',
    },
    selectAge: {
      title: 'Choose your age 🎯',
      content: 'Select your age group (5+ or 7+) in the menu to get appropriate tasks.',
    },
    selectGame: {
      title: 'Choose a game 🎲',
      content: 'Choose a game you want to play. Each game has its own theme and difficulty.',
    },
    answerCorrectly: {
      title: 'Answer correctly ⭐',
      content: 'Each correct answer gives you a star. When you collect 5 stars, you level up!',
    },
    beCareful: {
      title: 'Be careful ❤️',
      content: 'Each wrong answer takes away one heart. When hearts run out, the game ends.',
    },
    collectAchievements: {
      title: 'Collect achievements 🏅',
      content: 'Collect medals and track your statistics from the menu above!',
    },
    close: 'Close tutorial',
    back: 'Back',
    next: 'Next',
    startGame: 'Start game!',
  },

  // Game screen
  gameScreen: {
    returnToMenu: 'Return to menu',
    starProgress: {
      one: '1/5 stars! 🌟',
      two: '2/5 stars! ⭐⭐',
      three: '3/5 stars! ⭐⭐⭐',
      four: '4/5 stars! ⭐⭐⭐⭐',
      last: 'Last star! ⭐⭐⭐⭐⭐',
    },
    sentenceLogic: {
      selectCorrectPicture: 'Select the correct picture',
      scene: 'Scene',
      positions: {
        NEXT_TO: 'next to',
        ON: 'on',
        UNDER: 'under',
        IN_FRONT: 'in front of',
        BEHIND: 'behind',
        INSIDE: 'inside',
      },
    },
    wordBuilder: {
      preFilled: 'Hint: some letters are already in place!',
      useAllLetters: 'Use all correct letters',
      watchCase: 'Watch upper and lower case!',
    },
    hints: {
      wordBuilder: 'Hint: The word starts with letter',
      syllableBuilder: 'Hint: The word starts with syllable',
      balanceScale: 'Hint: Left side is',
      balanceScaleRight: 'right side is',
      pattern: 'Hint: Look at the pattern the train follows!',
      memoryMath: 'Hint: Flip the cards and find pairs!',
      sentenceLogic: 'Hint: Look where',
      sentenceLogicScene: 'is in the scene!',
      roboPath: 'Hint: Robot must reach the cell with green window!',
      timeMatch: 'Hint: Look at the clock hands!',
      unitConversion: 'Hint: Calculate!',
      default: 'Try again!',
    },
  },

  // Stats modal
  statsModal: {
    title: 'Statistics 📊',
    close: 'Close statistics',
    highestLevels: 'Highest levels',
  },

  // Progression
  progression: {
    startGame: 'Start this game!',
    doingGreat: 'You are doing great! Try a higher level.',
    maybeTooHard: 'Maybe the game is too hard? Try an easier level.',
    keepPracticing: 'Keep practicing!',
  },

  // Robo path game
  roboPath: {
    addCommandUp: 'Add command: up',
    addCommandDown: 'Add command: down',
    addCommandLeft: 'Add command: left',
    addCommandRight: 'Add command: right',
    removeCommand: 'Remove last command',
    runRobot: 'Run robot',
    addCommands: 'Add commands...',
  },

  // Level up modal
  levelUp: {
    level: 'LEVEL',
    greatWork: 'Great work! You are a true master. ⭐',
    nextLevel: 'NEXT LEVEL',
  },

  // Game names and descriptions
  games: {
    word_builder: {
      title: 'WORD MASTER',
      desc: 'Build a word from letters',
    },
    syllable_builder: {
      title: 'SYLLABLE MASTER',
      desc: 'Put syllables together into a word',
    },
    pattern: {
      title: 'PATTERN TRAIN',
      desc: 'Continue the pattern',
    },
    sentence_logic: {
      title: 'SENTENCE DETECTIVE',
      desc: 'Where is the object?',
    },
    memory_math: {
      title: 'MATH MEMORY',
      desc: 'Find the equation and answer',
    },
    robo_path: {
      title: 'ROBO PATH',
      desc: 'Program the robot',
    },
    letter_match: {
      title: 'LETTER DETECTIVE',
      desc: 'Find the correct letter',
    },
    unit_conversion: {
      title: 'UNITS',
      desc: 'Convert units',
    },
    balance_scale: {
      title: 'SCALES',
      desc: 'Balance the scales',
    },
    time_match: {
      title: 'CLOCK GAME',
      desc: 'Set the time',
    },
  },

  // Difficulty levels
  difficulty: {
    easy: '⭐ Easy',
    medium: '⭐⭐ Medium',
    hard: '⭐⭐⭐ Hard',
  },

  // Level label
  level: 'Level',
} as const;
