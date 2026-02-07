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
    continue: 'Continue',
    levelUp: 'Level up!',
    newAchievement: 'New achievement!',
    noHeartsLeft: 'No hearts left! Visit the shop to get more.',
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
      battlelearn_first_win: {
        title: 'First Fleet Sunk',
        desc: 'Win your first BattleLearn game',
      },
      battlelearn_captain: {
        title: 'BattleLearn Captain',
        desc: 'Reach BattleLearn level 5',
      },
      battlelearn_admiral: {
        title: 'BattleLearn Admiral',
        desc: 'Reach BattleLearn level 10',
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
      wrongLetter: 'Wrong letter',
      triesLeft: '{count} tries left',
      outOfTries: 'Out of tries',
      greatJob: 'Great job!',
      tutorial: 'Tap the falling letters to build the word. Letters that hit the red barrier add strikes!',
      starPickup: 'Star pickup',
      heartPickup: 'Heart pickup',
      shieldPickup: 'Shield pickup',
      pickupHint: 'Tap stars, hearts and shields to get bonuses!',
      tapGlowingLetter: 'Tap the glowing letter below!',
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
      oClock: '{hour} o’clock',
      halfPast: 'half past {hour}',
      quarterPast: 'quarter past {hour}',
      quarterTo: 'quarter to {hour}',
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
        'Pattern Train',
        'Finish the pattern',
        'Tap the next car',
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
        'Choose the right symbol: < (less than), = (equal) or > (greater than)',
        'Look at both sides carefully!',
        'Count or compare the sizes!',
        'Think which one is bigger!',
      ],
      shape_shift: [
        'Drag shapes to match the image',
        'Tap a shape to rotate it 90°',
        'Try different combinations!',
        'Think how shapes fit together',
      ],
      star_mapper: [
        'Tap stars to connect them',
        'Follow the shape and create the constellation',
        'Use "Undo" button if you make a mistake',
        'Try connecting stars in sequence',
      ],
      word_cascade: [
        'Tap the falling letters to build the word. Letters that hit the red barrier add strikes!',
        'Tap letters in order to spell the word. Watch for the letter you need next!',
        'Tap stars, hearts and shields to get bonuses! Stars give ⭐, hearts give ❤️, shields remove a strike.',
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
    getMoreHearts: 'Get More Hearts',
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
    hint: {
      genericCost: 'Hint ({cost}⭐)',
    },
    word_builder: {
      title: 'WORD MASTER',
      desc: 'Build a word from letters',
      hintRevealNextCost: 'Reveal next letter ({cost}⭐)',
      hintEliminateCost: 'Remove one wrong letter ({cost}⭐)',
    },
    word_cascade: {
      title: 'WORD CASCADE',
      desc: 'Catch letters and build words fast',
      hintRevealNextCost: 'Reveal next letter ({cost}⭐)',
    },
    syllable_builder: {
      title: 'SYLLABLE MASTER',
      desc: 'Put syllables together into a word',
    },
    pattern: {
      title: 'PATTERN TRAIN',
      desc: 'Continue the pattern',
      hintEliminateCost: 'Remove one wrong ({cost}⭐)',
    },
    sentence_logic: {
      title: 'SENTENCE DETECTIVE',
      desc: 'Where is the object?',
    },
    memory_math: {
      title: 'MATH MEMORY',
      desc: 'Find the equation and answer',
      hintRevealPairCost: 'Reveal one pair ({cost}⭐)',
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
      hintEliminateCost: 'Remove one wrong ({cost}⭐)',
    },
    balance_scale: {
      title: 'SCALES',
      desc: 'Balance the scales',
      hintEliminateCost: 'Remove one wrong ({cost}⭐)',
      chooseWeight: 'Which weight balances the scale?',
    },
    time_match: {
      title: 'CLOCK GAME',
      desc: 'Set the time',
      hintEliminateCost: 'Remove one wrong time ({cost}⭐)',
    },
    math_snake: {
      title: 'NUMBER SNAKE',
      desc: 'Feed the snake with equations',
      hintEliminateCost: 'Remove one wrong ({cost}⭐)',
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
      hintEliminateCost: 'Remove one wrong ({cost}⭐)',
    },
    shape_shift: {
      title: 'SHAPE SHIFT',
      desc: 'Build shapes from pieces',
      instructions: {
        match: 'Drag pieces to the correct spots',
        rotate: 'Tap to rotate, drag to place',
        build: 'Build the shape from pieces',
        expert: 'One piece is extra!',
      },
      tapToRotate: 'Tap to rotate',
      dragToPlace: 'Drag to place',
      dragHint: 'Drag a shape to the board to start',
      hintOutline: 'Show outline (1⭐)',
      hintPlacePiece: 'Place one piece (2⭐)',
      hintOutlineCost: 'Show outline ({cost}⭐)',
      hintPlacePieceCost: 'Place one piece ({cost}⭐)',
      hintOutlineUsed: 'Outline used',
      hintPlacePieceUsed: 'Place one used',
      hintOutlineDescription: 'See where all pieces go',
      hintPlacePieceDescription: 'Put one piece in place for you',
      hintText: 'Drag shapes to match the picture. Tap to rotate. Use the hint buttons below for extra help!',
      rotateButton: 'Rotate 90°',
      orUse: 'or use',
      piecesRemaining: 'Pieces left',
      complete: 'Excellent! 🎉',
      tryAgain: 'Not quite – try again',
      categories: {
        shapes: 'Shapes',
        animals: 'Animals',
        objects: 'Objects',
        letters: 'Letters',
        abstract: 'Abstract',
      },
      puzzleNames: {
        simple_square: 'Square',
        simple_house: 'House',
        simple_tree: 'Tree',
        simple_diamond: 'Diamond',
        ice_cream: 'Ice Cream',
        cat_face: 'Cat',
        fish: 'Fish',
        boat: 'Boat',
        arrow_right: 'Arrow',
        mushroom: 'Mushroom',
        butterfly: 'Butterfly',
        rocket: 'Rocket',
        bird: 'Bird',
        heart: 'Heart',
        star: 'Star',
        castle: 'Castle',
      },
    },
    star_mapper: {
      title: 'STAR MAPPER',
      desc: 'Learn the constellations',
    },
    battlelearn: {
      title: 'BATTLELEARN',
      desc: 'Answer and sink ships',
      hintRevealEmptyCost: 'Reveal one empty cell ({cost}⭐)',
      hintRevealCost: 'Reveal one ship position ({cost}⭐)',
    },
    battlelearn_adv: {
      title: 'BATTLELEARN',
      desc: 'Master coordinates and arithmetic',
      hintRevealEmptyCost: 'Reveal one empty cell ({cost}⭐)',
      hintRevealCost: 'Reveal one ship position ({cost}⭐)',
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
    formLabel: 'Form',
    undo: 'Undo',
    tryAgain: 'Not quite – try again',
    linesRemaining: 'Lines remaining: {count}',
    complete: 'Excellent! 🌟',
    hintGuideCost: 'Show guide ({cost}⭐)',
    hintConnectCost: 'Connect one line ({cost}⭐)',
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
      auriga: { name: 'Auriga', desc: 'Charioteer with bright Capella' },
      andromeda: { name: 'Andromeda', desc: 'Chain of stars pointing to the galaxy' },
      corona_borealis: { name: 'Corona Borealis', desc: 'Northern Crown semicircle' },
    },
    seasons: {
      circumpolar: 'Year-round',
      winter: 'Winter',
      spring: 'Spring',
      summer: 'Summer',
      autumn: 'Autumn',
    },
  },

  // BattleLearn game
  battlelearn: {
    title: 'BATTLELEARN',
    titleAdv: 'BATTLELEARN',
    desc: 'Answer questions to earn shots and sink ships',
    descAdv: 'Master coordinates and arithmetic to sink the fleet',
    instructions: 'Shoot first! Hit to continue, miss to answer a question.',
    shotReady: 'Shot Ready!',
    clickToShoot: 'Click a cell to shoot!',
    answerToEarnShot: 'Answer to earn a shot',
    answerToContinue: 'Answer the question to continue shooting:',
    shipsRemaining: 'Ships',
    hit: '💥 Hit!',
    miss: '💦 Miss! Answer to continue.',
    shipSunk: '🎯 Ship sunk!',
    victory: 'Victory!',
    allShipsSunk: 'All ships sunk!',
    alreadyShot: 'Already shot here!',
    coordinateQuestion: 'Coordinate question',
    navigationQuestion: 'Navigation task',
    fleetMath: 'Fleet mathematics',
    questions: {
      // Counting questions
      countShips: 'How many ships?',
      countObjects: 'How many {item}?',
      // Arithmetic questions
      simpleAddition: '{a} ships + {b} ships = ?',
      simpleSubtraction: '{a} ships - {b} ships = ?',
      ammunition: '{total} torpedoes - {fired} fired = ?',
      missingNumber: '{a} + ? = {result}',
      missingNumberSub: '{a} - ? = {result}',
      // Comparison questions
      greaterThan: 'Which is greater: {a} or {b}?',
      lessThan: 'Which is less: {a} or {b}?',
      // Coordinate questions
      navigate: 'Position {start}, move {moves} right',
      navigateLeft: 'Position {start}, move {moves} left',
      navigateUp: 'Position {start}, move {moves} up',
      navigateDown: 'Position {start}, move {moves} down',
      // Pattern questions
      patternNext: 'Signal pattern: {pattern}, __',
      sequenceNext: 'Next number: {sequence}, __',
      // Word problems
      wordProblem1: 'Captain saw {a} ships in morning and {b} in evening. Total?',
      wordProblem2: 'Ship had {total} sailors. {left} departed. How many remain?',
      wordProblem3: 'Each ship has {perShip} cannons. {ships} ships total?',
      // Time-based
      timeProblem: 'Journey started at {start}:00 and lasted {duration} hours. When did it end?',
      // Money counting
      coinProblem: 'You have {count} coins worth {value}€. Total?',
      // Multi-step
      twoStep: '{a} ships arrived and {b} left. Initially there were {initial}. Now?',
      // Logic puzzles
      logicPuzzle: 'If {a} > {b} and {b} > {c}, then {a} ? {c}',
      // Area/perimeter
      areaProblem: 'Ship is {width} × {height} squares. Area?',
      perimeterProblem: 'Dock is {width} × {height} squares. Perimeter?',
      // Direction sequences
      directionSequence: 'Move {dir1}, then {dir2}. What direction?',
      // Advanced coordinate
      multiMove: 'Start at {start}, move {right} right, {up} up. New coordinate?',
      // Vector addition
      vectorAdd: 'Ship moves {right1} right and {up1} up, then {right2} right and {up2} up. Total steps?',
      // Distance
      distance: 'Ship at {coord1}, target at {coord2}. Distance?',
      // Multiplication
      fleetMultiply: '{ships} destroyers × {cannons} cannons = ?',
      // Formation problems
      formationCount: 'Ships in rows: {row1}, {row2}, {row3}. Total?',
      // Strategic positioning
      strategicPos: 'Best attack position in range {x1}-{x2}, {y1}-{y2}. Center point?',
    },
  },

  // Level label
  level: 'Level',
} as const;
