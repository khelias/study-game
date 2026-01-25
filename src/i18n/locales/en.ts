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
} as const;
