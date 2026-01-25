import { describe, it, expect, beforeEach } from 'vitest';
import { useGameStore } from '../gameStore';
import { PROFILES } from '../../games/data';

describe('gameStore', () => {
  beforeEach(() => {
    // Reset store to initial state
    useGameStore.setState({
      profile: Object.keys(PROFILES)[0],
      levels: {},
      stats: {
        gamesPlayed: 0,
        correctAnswers: 0,
        wrongAnswers: 0,
        totalScore: 0,
        maxStreak: 0,
        currentStreak: 0,
        maxLevels: {},
        gamesByType: {},
        totalTimePlayed: 0,
        lastPlayed: null,
        collectedStars: 0
      },
      unlockedAchievements: [],
      soundEnabled: true,
      score: 0,
      collectedStars: 0,
      hasSeenTutorial: false,
    });
  });

  describe('Profile Management', () => {
    it('should set profile', () => {
      const { setProfile } = useGameStore.getState();
      setProfile('advanced');
      expect(useGameStore.getState().profile).toBe('advanced');
    });

    it('should not set invalid profile', () => {
      const { setProfile } = useGameStore.getState();
      const initialProfile = useGameStore.getState().profile;
      setProfile('invalid_profile');
      expect(useGameStore.getState().profile).toBe(initialProfile);
    });
  });

  describe('Answer Recording', () => {
    it('should record correct answer', () => {
      const { recordAnswer } = useGameStore.getState();
      const result = recordAnswer(true, 10);
      
      const state = useGameStore.getState();
      expect(state.stats.correctAnswers).toBe(1);
      expect(state.stats.wrongAnswers).toBe(0);
      expect(state.stats.totalScore).toBe(10);
      expect(state.stats.maxStreak).toBe(1);
    });

    it('should record wrong answer', () => {
      const { recordAnswer } = useGameStore.getState();
      recordAnswer(false);
      
      const state = useGameStore.getState();
      expect(state.stats.correctAnswers).toBe(0);
      expect(state.stats.wrongAnswers).toBe(1);
      expect(state.stats.currentStreak).toBe(0);
    });

    it('should track streak correctly', () => {
      const { recordAnswer } = useGameStore.getState();
      
      recordAnswer(true, 10);
      recordAnswer(true, 10);
      recordAnswer(true, 10);
      
      const state = useGameStore.getState();
      expect(state.stats.maxStreak).toBe(3);
      expect(state.stats.currentStreak).toBe(3);
    });

    it('should reset streak on wrong answer', () => {
      const { recordAnswer } = useGameStore.getState();
      
      recordAnswer(true, 10);
      recordAnswer(true, 10);
      recordAnswer(false);
      
      const state = useGameStore.getState();
      expect(state.stats.maxStreak).toBe(2);
      expect(state.stats.currentStreak).toBe(0);
    });
  });

  describe('Level Management', () => {
    it('should record level up', () => {
      const { recordLevelUp } = useGameStore.getState();
      const result = recordLevelUp('word_builder', 2);
      
      const state = useGameStore.getState();
      expect(state.levels[state.profile]['word_builder']).toBe(2);
      expect(state.stats.maxLevels['word_builder']).toBe(2);
    });

    it('should track max level correctly', () => {
      const { recordLevelUp } = useGameStore.getState();
      
      recordLevelUp('word_builder', 3);
      recordLevelUp('word_builder', 2); // Lower level shouldn't change max
      
      const state = useGameStore.getState();
      expect(state.stats.maxLevels['word_builder']).toBe(3);
    });
  });

  describe('Collected Stars', () => {
    it('should add collected stars', () => {
      const { addCollectedStars } = useGameStore.getState();
      addCollectedStars(5);
      
      const state = useGameStore.getState();
      expect(state.collectedStars).toBe(5);
      expect(state.stats.collectedStars).toBe(5);
    });

    it('should accumulate collected stars', () => {
      const { addCollectedStars } = useGameStore.getState();
      addCollectedStars(3);
      addCollectedStars(2);
      
      const state = useGameStore.getState();
      expect(state.collectedStars).toBe(5);
    });
  });

  describe('Sound Settings', () => {
    it('should toggle sound', () => {
      const { toggleSound } = useGameStore.getState();
      
      expect(useGameStore.getState().soundEnabled).toBe(true);
      toggleSound();
      expect(useGameStore.getState().soundEnabled).toBe(false);
      toggleSound();
      expect(useGameStore.getState().soundEnabled).toBe(true);
    });
  });

  describe('Score Management', () => {
    it('should set score', () => {
      const { setScore } = useGameStore.getState();
      setScore(100);
      expect(useGameStore.getState().score).toBe(100);
    });

    it('should add score', () => {
      const { addScore } = useGameStore.getState();
      addScore(10);
      addScore(20);
      expect(useGameStore.getState().score).toBe(30);
    });
  });

  describe('Achievement Management', () => {
    it('should unlock achievement', () => {
      const { unlockAchievement } = useGameStore.getState();
      unlockAchievement('first_game');
      
      expect(useGameStore.getState().unlockedAchievements).toContain('first_game');
    });

    it('should not duplicate achievements', () => {
      const { unlockAchievement } = useGameStore.getState();
      unlockAchievement('first_game');
      unlockAchievement('first_game');
      
      const achievements = useGameStore.getState().unlockedAchievements.filter(a => a === 'first_game');
      expect(achievements.length).toBe(1);
    });
  });

  describe('Tutorial', () => {
    it('should mark tutorial as seen', () => {
      const { markTutorialSeen } = useGameStore.getState();
      
      expect(useGameStore.getState().hasSeenTutorial).toBe(false);
      markTutorialSeen();
      expect(useGameStore.getState().hasSeenTutorial).toBe(true);
    });
  });
});
