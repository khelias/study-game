import { describe, it, expect, beforeEach } from 'vitest';
import { usePlaySessionStore } from '../playSessionStore';

describe('playSessionStore', () => {
  beforeEach(() => {
    // Reset store to initial state
    usePlaySessionStore.getState().resetSessionState();
  });

  describe('Game Initialization', () => {
    it('should start game correctly', () => {
      const { startGame } = usePlaySessionStore.getState();
      startGame('word_builder');
      
      const state = usePlaySessionStore.getState();
      expect(state.gameType).toBe('word_builder');
      expect(state.gameState).toBe('playing');
      expect(state.hearts).toBe(3);
      expect(state.stars).toBe(0);
      expect(state.currentStreak).toBe(0);
      expect(state.gameStartTime).toBeTruthy();
    });

    it('should reset adaptive difficulty on game start', () => {
      const { startGame } = usePlaySessionStore.getState();
      startGame('word_builder');
      
      const state = usePlaySessionStore.getState();
      expect(state.adaptiveDifficulty.recentAccuracy).toEqual([]);
      expect(state.adaptiveDifficulty.consecutiveCorrect).toBe(0);
    });
  });

  describe('Game State Management', () => {
    it('should return to menu', () => {
      const { startGame, returnToMenu } = usePlaySessionStore.getState();
      
      startGame('word_builder');
      returnToMenu();
      
      const state = usePlaySessionStore.getState();
      expect(state.gameState).toBe('menu');
      expect(state.gameType).toBeNull();
      expect(state.problem).toBeNull();
    });

    it('should end game', () => {
      const { startGame, endGame } = usePlaySessionStore.getState();
      
      startGame('word_builder');
      endGame();
      
      expect(usePlaySessionStore.getState().gameState).toBe('game_over');
    });
  });

  describe('Stars and Hearts', () => {
    it('should increment stars', () => {
      const { incrementStars } = usePlaySessionStore.getState();
      
      const stars1 = incrementStars();
      const stars2 = incrementStars();
      
      expect(stars1).toBe(1);
      expect(stars2).toBe(2);
      expect(usePlaySessionStore.getState().stars).toBe(2);
    });

    it('should decrement hearts', () => {
      const { decrementHearts } = usePlaySessionStore.getState();
      
      const hearts1 = decrementHearts();
      const hearts2 = decrementHearts();
      
      expect(hearts1).toBe(2);
      expect(hearts2).toBe(1);
      expect(usePlaySessionStore.getState().hearts).toBe(1);
    });
  });

  describe('Level Up Modal', () => {
    it('should show and dismiss level up modal', () => {
      const { showLevelUpModal, dismissLevelUpModal } = usePlaySessionStore.getState();
      
      showLevelUpModal();
      expect(usePlaySessionStore.getState().showLevelUp).toBe(true);
      
      dismissLevelUpModal();
      expect(usePlaySessionStore.getState().showLevelUp).toBe(false);
      expect(usePlaySessionStore.getState().stars).toBe(0);
    });
  });

  describe('Feedback System', () => {
    it('should set feedback message', () => {
      const { setFeedbackMessage } = usePlaySessionStore.getState();
      
      setFeedbackMessage('Great job!', 'correct');
      
      const state = usePlaySessionStore.getState();
      expect(state.feedbackMessage).toBe('Great job!');
      expect(state.feedbackType).toBe('correct');
    });

    it('should show and hide hint', () => {
      const { setShowHint } = usePlaySessionStore.getState();
      
      setShowHint(true);
      expect(usePlaySessionStore.getState().showHint).toBe(true);
      
      setShowHint(false);
      expect(usePlaySessionStore.getState().showHint).toBe(false);
    });
  });

  describe('Answer Submission', () => {
    it('should update streak on correct answer', () => {
      const { submitAnswer } = usePlaySessionStore.getState();
      
      submitAnswer(true);
      submitAnswer(true);
      
      expect(usePlaySessionStore.getState().currentStreak).toBe(2);
    });

    it('should reset streak on wrong answer', () => {
      const { submitAnswer } = usePlaySessionStore.getState();
      
      submitAnswer(true);
      submitAnswer(true);
      submitAnswer(false);
      
      expect(usePlaySessionStore.getState().currentStreak).toBe(0);
    });
  });

  describe('Visual Effects', () => {
    it('should manage confetti state', () => {
      const { setConfetti, setEnhancedConfetti } = usePlaySessionStore.getState();
      
      setConfetti(true);
      expect(usePlaySessionStore.getState().confetti).toBe(true);
      
      setEnhancedConfetti(true);
      expect(usePlaySessionStore.getState().enhancedConfetti).toBe(true);
    });

    it('should manage particle effects', () => {
      const { setParticleActive } = usePlaySessionStore.getState();
      
      setParticleActive(true);
      expect(usePlaySessionStore.getState().particleActive).toBe(true);
      
      setParticleActive(false);
      expect(usePlaySessionStore.getState().particleActive).toBe(false);
    });
  });

  describe('Background Color', () => {
    it('should set background class', () => {
      const { setBgClass } = usePlaySessionStore.getState();
      
      setBgClass('bg-green-50');
      expect(usePlaySessionStore.getState().bgClass).toBe('bg-green-50');
      
      setBgClass('bg-red-50');
      expect(usePlaySessionStore.getState().bgClass).toBe('bg-red-50');
    });
  });

  describe('Score Management', () => {
    it('should set score', () => {
      const { setScore } = usePlaySessionStore.getState();
      
      setScore(50);
      expect(usePlaySessionStore.getState().score).toBe(50);
    });

    it('should add score', () => {
      const { addScore } = usePlaySessionStore.getState();
      
      addScore(10);
      addScore(20);
      
      expect(usePlaySessionStore.getState().score).toBe(30);
    });
  });
});
