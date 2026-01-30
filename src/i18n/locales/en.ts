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
    confirm: 'Confirm',
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

  // Accessibility
  accessibility: {
    skipToContent: 'Skip to main content',
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

  // Notification labels
  notifications: {
    correctTitle: 'Correct!',
    wrongTitle: 'Try again!',
    streakSuffix: 'correct in a row!',
    hintTitle: 'Hint',
    tipTitle: 'Tip',
    infoTitle: 'Notice',
    achievementTitle: 'Achievement!',
    levelUpTitle: 'Level up!',
    closeTip: 'Close tip',
    closeHint: 'Close hint',
    closeAchievement: 'Close achievement',
    closeLevelUp: 'Close level up',
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
    settings: 'Settings',
    reset: 'Reset progress',
    sound: 'Sound',
    soundOn: 'Sound on',
    soundOff: 'Sound off',
    score: 'Score',
    stars: 'Stars',
    featured: 'Featured',
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
    scoreMessage: 'You scored {score} points!',
    returnToMenu: 'Return to menu',
    retry: 'Try Again',
    levelUp: 'Level up!',
    newAchievement: 'New achievement!',
    highScore: 'High Score',
    newRecord: 'New Record!',
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
    streakSuffix: 'correct in a row',
    perGame: 'per game',
    noGamesPlayed: 'No game types played yet',
    mostPlayedGames: 'Most played games',
    gamesLabel: 'games',
  },

  // Learning progress
  learningProgress: {
    title: 'Learning Progress',
    scoreLabel: 'Learning score',
    stages: {
      master: 'Master',
      advanced: 'Advanced',
      practicing: 'Practicing',
      beginner: 'Beginner',
    },
    metrics: {
      accuracy: 'Accuracy',
      level: 'Level',
      games: 'Games',
    },
    encouragement: {
      high: '🎉 Great job! You are a true master!',
      low: '💪 Keep practicing! Every step counts!',
    },
    skillOverviewTitle: 'Skills overview',
    skills: {
      reading: 'Reading',
      math: 'Math',
      logic: 'Logic',
    },
    skillSummary: '{games} games • Level {level}',
  },

  // Achievements
  achievements: {
    title: 'Achievements',
    unlocked: 'Unlocked',
    locked: 'Locked',
    progress: 'Progress',
    modalTitle: 'Achievements 🏅',
    collectedLabel: 'achievements collected',
    items: {
      first_game: {
        title: 'First Step',
        desc: 'Play your first game',
      },
      perfect_5: {
        title: 'Perfect Streak',
        desc: 'Answer 5 tasks in a row',
      },
      word_master: {
        title: 'Word Master',
        desc: 'Reach WORD MASTER level 5',
      },
      math_whiz: {
        title: 'Math Whiz',
        desc: 'Reach MATH MEMORY level 5',
      },
      pattern_pro: {
        title: 'Pattern Pro',
        desc: 'Reach PATTERN TRAIN level 5',
      },
      score_100: {
        title: '100 Points',
        desc: 'Collect 100 points',
      },
      score_500: {
        title: '500 Points',
        desc: 'Collect 500 points',
      },
      persistent: {
        title: 'Persistent',
        desc: 'Play 10 games',
      },
      all_games: {
        title: 'All Games',
        desc: 'Try every game type',
      },
      star_collector_50: {
        title: 'Star Collector',
        desc: 'Collect 50 stars',
      },
      star_collector_100: {
        title: 'Star Master',
        desc: 'Collect 100 stars',
      },
      star_collector_250: {
        title: 'Star Legend',
        desc: 'Collect 250 stars',
      },
      snake_master: {
        title: 'Snake Master',
        desc: 'Reach NUMBER SNAKE level 5',
      },
      snake_growth_20: {
        title: 'Long Snake',
        desc: 'Grow snake to at least 20 length',
      },
      snake_growth_30: {
        title: 'Very Long Snake',
        desc: 'Grow snake to at least 30 length',
      },
      snake_growth_max: {
        title: 'Maximum Snake',
        desc: 'Grow snake to maximum length (49)',
      },
      syllable_master: {
        title: 'Syllable Master',
        desc: 'Reach SYLLABLE MASTER level 5',
      },
      sentence_detective: {
        title: 'Sentence Detective',
        desc: 'Reach SENTENCE DETECTIVE level 5',
      },
      robo_master: {
        title: 'Robo Master',
        desc: 'Reach ROBO PATH level 5',
      },
      letter_detective: {
        title: 'Letter Detective',
        desc: 'Reach LETTER DETECTIVE level 5',
      },
      unit_master: {
        title: 'Unit Master',
        desc: 'Reach UNITS level 5',
      },
      compare_master: {
        title: 'Compare Master',
        desc: 'Reach NUMBER COMPARE level 5',
      },
      scale_master: {
        title: 'Scale Master',
        desc: 'Reach SCALES level 5',
      },
      clock_master: {
        title: 'Clock Master',
        desc: 'Reach CLOCK GAME level 5',
      },
      cascade_master: {
        title: 'Cascade Master',
        desc: 'Reach WORD CASCADE level 5',
      },
      cascade_perfect_10: {
        title: 'Cascade Champion',
        desc: 'Complete 10 Word Cascade games',
      },
    },
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
      title: 'Welcome!',
      content: 'This is an educational game where you can practice reading, math and logic!',
    },
    selectAge: {
      title: 'Choose your age',
      content: 'Select your age group (5+ or 7+) in the menu to get appropriate tasks.',
    },
    selectGame: {
      title: 'Choose a game',
      content: 'Choose a game you want to play. Each game has its own theme and difficulty.',
    },
    answerCorrectly: {
      title: 'Answer correctly',
      content: 'Answer correctly to progress! When you demonstrate mastery (correct answers + good accuracy), you automatically level up and earn stars!',
    },
    beCareful: {
      title: 'Be careful',
      content: 'Each wrong answer costs one heart. Hearts are global - they persist across games. When hearts run out, you can buy more with stars!',
    },
    collectAchievements: {
      title: 'Collect achievements',
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
    syllableBuilder: {
      instruction: 'PUT THE SYLLABLES IN ORDER TO MAKE A WORD',
      correct: 'CORRECT:',
    },
    wordBuilder: {
      preFilled: 'Hint: some letters are already in place!',
      useAllLetters: 'Use all correct letters',
      watchCase: 'Watch upper and lower case!',
    },
    wordCascade: {
      tapLetters: 'Tap letters to build the word',
      tryAgain: 'Try again!',
      greatJob: 'Great job!',
      tutorial: 'Tap the falling letters to build the word. Letters that hit the red barrier add strikes!',
      starPickup: 'Star pickup',
      heartPickup: 'Heart pickup',
      shieldPickup: 'Shield pickup',
      pickupHint: 'Tap stars, hearts and shields to get bonuses!',
    },
    pattern: {
      tagline: 'Pattern Train',
      instruction: 'Finish the pattern',
      subInstruction: 'Tap the next car',
      feedbackTitle: 'Not quite',
      feedbackReason: 'The pattern repeats {pattern}. Next should be {answer}.',
      feedbackChoiceLabel: 'You chose',
      patternLabel: 'Pattern',
    },
    memoryMath: {
      pairsLabel: 'Pairs',
    },
    timeMatch: {
      selectCorrectTime: 'Choose the correct time',
      correctTimeIs: 'Correct time is',
    },
    mathSnake: {
      tagline: 'Number Snake',
      instruction: 'Move with the arrow keys and eat apples. The math apple gives a bonus.',
      solveLabel: 'Solve',
      chooseApple: 'Eat apples. The math apple gives +1 or -2 length.',
      keyboardHint: 'Use arrow keys or WASD to move.',
      lengthLabel: 'Length',
      nextMathLabel: 'Math in',
    },
    selectLevel: 'Select Level',
    currentLevel: 'Current level',
    selectNewLevel: 'Select new level',
    game: 'Game',
    hints: {
      wordBuilder: 'The word starts with letter',
      syllableBuilder: 'The word starts with syllable',
      balanceScale: 'Left side is',
      balanceScaleRight: 'right side is',
      pattern: 'Look at the pattern the train follows!',
      memoryMath: 'Flip the cards and find pairs!',
      sentenceLogic: 'Look where',
      sentenceLogicScene: 'is in the scene!',
      roboPath: 'Robot must reach the cell with green window!',
      mathSnake: 'Eat apples and watch for the math apple!',
      timeMatch: 'Look at the clock hands!',
      unitConversion: 'Calculate!',
      compare_sizes: 'Compare the sizes carefully!',
      default: 'Try again!',
    },
    hintButton: {
      show: 'Show hint',
      used: 'Hint already used',
    },
    tipButton: {
      show: 'Open tip',
      unavailable: 'Tip not available yet',
    },
    tips: {
      word_builder: [
        'Try to guess the word from the emoji!',
        'Look at the first letter — it helps you start!',
        'Think about which letters go together!',
      ],
      syllable_builder: [
        'Syllables are parts of a word — put them together!',
        'See how the syllables fit together!',
        'Say the word out loud as you build it!',
      ],
      pattern: [
        'Look at the pattern the train follows!',
        'Think what should come next!',
        'Notice how the emojis repeat!',
      ],
      sentence_logic: [
        'Read the sentence carefully!',
        'Look where the objects are in the scene!',
        'Think what is logical!',
      ],
      memory_math: [
        'Flip the cards and find pairs!',
        'Think which numbers make the equation!',
        'Try to remember where each card is!',
      ],
      balance_scale: [
        'Add up what is on the left!',
        'Think which number balances the scales!',
        'Check how much is on the right!',
      ],
      robo_path: [
        'Think how the robot should move!',
        'Look where the obstacles are!',
        'Try it step by step!',
      ],
      math_snake: [
        'Move calmly and avoid the walls!',
        'Math apples can grow or shrink the snake!',
        'Plan your path before you move!',
      ],
      time_match: [
        'Look at the clock hands!',
        'Think what time is shown!',
        'Hour is the bigger number, minute the smaller one!',
      ],
      letter_match: [
        'Look at the uppercase letter and find the lowercase!',
        'Think which letter fits!',
        'Uppercase and lowercase are the same letter!',
      ],
      unit_conversion: [
        'Read the question carefully!',
        'Think about how the units relate!',
        'Use a small example to check your answer!',
      ],
      compare_sizes: [
        'Look at both sides carefully!',
        'Count or compare the sizes!',
        'Think which one is bigger!',
      ],
    },
  },

  // Stats modal
  statsModal: {
    title: 'Statistics 📊',
    close: 'Close statistics',
    highestLevels: 'Highest levels',
  },

  // Shop
  shop: {
    title: 'Shop',
    yourStars: 'Your Stars',
    yourHearts: 'Your Hearts',
    buyHearts: 'Buy Hearts',
    buyHeartsDescription: 'Buy hearts with stars to keep playing!',
    buy1Heart: 'Buy 1 Heart',
    buyHeartsCount: 'Buy {count} Hearts',
    cost: 'Cost',
    price: 'Price',
    free: 'FREE',
    maxHearts: 'Maximum hearts reached',
    notEnoughStars: 'Not enough stars',
    buyStars: 'Buy Stars',
    buyStarsDescription: 'Buy stars to get more hearts and unlock special features!',
    buy50Stars: 'Buy 50 Stars',
    noHeartsToPlay: 'You have no hearts to play!',
    buyHeartsToContinue: 'Buy hearts to continue playing.',
  },

  // Progression
  progression: {
    startGame: 'Start this game!',
    doingGreat: 'You are doing great! Try a higher level.',
    maybeTooHard: 'Maybe the game is too hard? Try an easier level.',
    keepPracticing: 'Keep practicing!',
  },

  // Progression card
  progressionCard: {
    recommendation: 'Recommendation',
    successScore: 'Success score',
    currentLevel: 'Current level',
    selectLevel: 'Select Level',
    selectNewLevel: 'Select new level',
    game: 'Game',
    nextLevel: 'Next',
    starsCollectedLabel: '{current} / {total} stars collected',
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
    max: 'MAX',
    distanceToGoal: 'Distance to goal:',
    steps: 'steps',
    showNumbers: 'Show numbers',
    hideNumbers: 'Hide numbers',
    hint: '💡 Hint',
    hint1: 'Try moving towards the goal!',
    hint2: 'To avoid stones, try a different path!',
    hint3: 'See the optimal path (translucent arrow shows)',
    crashWithStone: '❌ Oops! Robot crashed into a stone!',
    needMoreCommands: '❌ Robot needs more commands to reach the goal!',
    reachedGoal: '✅ Great! Robot reached the goal!',
    programming: 'Programming is giving sequential commands',
    avoidObstacles: 'Obstacles (stones) must be avoided',
    excellent: 'Excellent! ⭐⭐⭐',
    good: 'Great! ⭐⭐',
    solved: 'Solved! ⭐',
    youUsed: 'You used',
    commands: 'commands',
    optimalIs: 'optimal is',
    time: 'Time:',
    bestTime: 'Best:',
    earnedXP: 'Earned XP:',
    tryAgainFor3Stars: 'Try again to get 3 stars!',
    tryAgainPrompt: 'Try again to get all the stars?',
    tryAgainButton: 'Try again',
    nextButton: 'Next',
    continueButton: 'Continue',
    greatJob: 'Great job!',
    tryAgainForBetter: 'Try again for a better solution?',
    stars: 'Stars:',
    legendStart: 'Start',
    legendObstacle: 'Blocked',
    legendGoal: 'Goal',
    legendHint: 'Hint',
  },

  // Unit conversion game
  unitConversion: {
    question: 'How many {to} are in {value} {from}?',
    units: {
      m: 'meters',
      km: 'kilometers',
      cm: 'centimeters',
      mm: 'millimeters',
      kg: 'kilograms',
      g: 'grams',
      t: 'tons',
      l: 'liters',
      ml: 'milliliters',
      dl: 'deciliters',
    },
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
    word_cascade: {
      title: 'WORD CASCADE',
      desc: 'Catch letters and build words fast',
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
    math_snake: {
      title: 'NUMBER SNAKE',
      desc: 'Feed the snake with equations',
    },
    compare_sizes: {
      title: 'NUMBER COMPARE',
      desc: 'Compare numbers',
      instruction: 'Which symbol is correct?',
      symbolInstruction: 'Choose the correct comparison symbol',
      selectSymbol: 'Select symbol',
      leftBigger: 'Left is bigger',
      rightBigger: 'Right is bigger',
      equal: 'They are equal',
      leftItem: 'Left number',
      rightItem: 'Right number',
    },
    star_mapper: {
      title: 'STAR MAPPER',
      desc: 'Learn the constellations',
    },
  },

  // Difficulty levels
  difficulty: {
    easy: '⭐ Easy',
    medium: '⭐⭐ Medium',
    hard: '⭐⭐⭐ Hard',
  },

  // Star Mapper game
  starMapper: {
    title: 'STAR MAPPER',
    desc: 'Learn the constellations',
    instructions: {
      trace: 'Connect the stars following the guide',
      build: 'Connect the stars from memory',
      identify: 'Which constellation is this?',
      expert: 'Find and connect the correct stars',
    },
    hint: 'Hint',
    linesRemaining: 'Lines remaining: {count}',
    complete: 'Excellent! 🌟',
    constellations: {
      ursa_major: { name: 'Big Dipper', folk: 'The Plough', desc: 'Most famous northern constellation' },
      ursa_minor: { name: 'Little Dipper', folk: 'Little Bear', desc: 'Home of the North Star' },
      cassiopeia: { name: 'Cassiopeia', desc: 'The W-shaped queen' },
      orion: { name: 'Orion', folk: 'The Hunter', desc: 'Winter hunter with three belt stars' },
      cygnus: { name: 'Cygnus', desc: 'The Northern Cross' },
      leo: { name: 'Leo', desc: 'The spring lion' },
      lyra: { name: 'Lyra', desc: 'Home of the star Vega' },
      aquila: { name: 'Aquila', desc: 'Home of the star Altair' },
      pegasus: { name: 'Pegasus', desc: 'The Great Square of autumn' },
      draco: { name: 'Draco', desc: 'The winding dragon' },
      cepheus: { name: 'Cepheus', desc: 'The king of the north' },
      taurus: { name: 'Taurus', desc: 'Winter bull with Aldebaran' },
      gemini: { name: 'Gemini', desc: 'Castor and Pollux twins' },
    },
    seasons: {
      circumpolar: 'Year-round',
      winter: 'Winter',
      spring: 'Spring', 
      summer: 'Summer',
      autumn: 'Autumn',
    },
  },

  // Level label
  level: 'Level',
} as const;
