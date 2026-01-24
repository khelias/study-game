// Custom hook mängu state'i haldamiseks - parem state management
import { useState, useCallback, useRef } from 'react';

export const useGameState = (initialState = {}) => {
  const [state, setState] = useState(initialState);
  const stateRef = useRef(state);
  stateRef.current = state;

  // Thread-safe state update
  const updateState = useCallback((updater) => {
    setState(prev => {
      const next = typeof updater === 'function' ? updater(prev) : { ...prev, ...updater };
      stateRef.current = next;
      return next;
    });
  }, []);

  // Get current state synchronously
  const getState = useCallback(() => stateRef.current, []);

  return [state, updateState, getState];
};

// Hook mängu sessiooni haldamiseks
export const useGameSession = () => {
  const [session, setSession] = useState({
    startTime: null,
    gameType: null,
    problemsSolved: 0,
    correctAnswers: 0,
    wrongAnswers: 0,
    currentStreak: 0,
    maxStreak: 0,
  });

  const startSession = useCallback((gameType) => {
    setSession({
      startTime: Date.now(),
      gameType,
      problemsSolved: 0,
      correctAnswers: 0,
      wrongAnswers: 0,
      currentStreak: 0,
      maxStreak: 0,
    });
  }, []);

  const recordAnswer = useCallback((isCorrect) => {
    setSession(prev => {
      const newStreak = isCorrect ? prev.currentStreak + 1 : 0;
      return {
        ...prev,
        problemsSolved: prev.problemsSolved + 1,
        correctAnswers: prev.correctAnswers + (isCorrect ? 1 : 0),
        wrongAnswers: prev.wrongAnswers + (isCorrect ? 0 : 1),
        currentStreak: newStreak,
        maxStreak: Math.max(prev.maxStreak, newStreak),
      };
    });
  }, []);

  const endSession = useCallback(() => {
    const duration = session.startTime ? Date.now() - session.startTime : 0;
    return {
      ...session,
      duration,
    };
  }, [session]);

  return {
    session,
    startSession,
    recordAnswer,
    endSession,
  };
};
