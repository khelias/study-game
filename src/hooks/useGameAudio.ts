import { useCallback } from 'react';
import { playSound } from '../engine/audio';

export function useGameAudio(soundEnabled: boolean) {
  const playCorrect = useCallback(() => {
    // Win sound is played when completing a level (5 stars)
    // For individual correct answers, we use 'click' sound
    playSound('click', soundEnabled);
  }, [soundEnabled]);

  const playWrong = useCallback(() => {
    // No dedicated wrong sound, silence is used
    // playSound('wrong', soundEnabled);
  }, [soundEnabled]);

  const playWin = useCallback(() => {
    playSound('win', soundEnabled);
  }, [soundEnabled]);

  const playClick = useCallback(() => {
    playSound('click', soundEnabled);
  }, [soundEnabled]);

  return {
    playCorrect,
    playWrong,
    playWin,
    playClick,
  };
}
