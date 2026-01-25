/**
 * Custom hooks for game state management
 */
import { useState, useCallback, useRef } from 'react';
import type { GameSession } from '../types/stats';

type StateUpdater<T> = Partial<T> | ((prev: T) => T);

/**
 * Custom hook for managing game state with synchronous access
 * @param initialState - Initial state object
 * @returns Tuple of [state, updateState, getState]
 */
export const useGameState = <T extends Record<string, unknown>>(
  initialState: T = {} as T
): [T, (updater: StateUpdater<T>) => void, () => T] => {
  const [state, setState] = useState<T>(initialState);
  const stateRef = useRef<T>(state);
  stateRef.current = state;

  // Thread-safe state update
  const updateState = useCallback((updater: StateUpdater<T>) => {
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

/**
 * Hook for managing game session state
 * @returns Object with session state and control functions
 */
export const useGameSession = (): {
  session: GameSession;
  startSession: (gameType: string) => void;
  recordAnswer: (isCorrect: boolean) => void;
  endSession: () => GameSession & { duration: number };
} => {
  const [session, setSession] = useState<GameSession>({
    startTime: null,
    gameType: null,
    problemsSolved: 0,
    correctAnswers: 0,
    wrongAnswers: 0,
    currentStreak: 0,
    maxStreak: 0,
  });

  const startSession = useCallback((gameType: string) => {
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

  const recordAnswer = useCallback((isCorrect: boolean) => {
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
