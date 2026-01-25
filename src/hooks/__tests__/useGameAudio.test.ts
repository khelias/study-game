import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useGameAudio } from '../useGameAudio';

// Mock the audio module
vi.mock('../../engine/audio', () => ({
  playSound: vi.fn(),
}));

import { playSound } from '../../engine/audio';

describe('useGameAudio', () => {
  it('should play correct sound when enabled', () => {
    const { result } = renderHook(() => useGameAudio(true));
    
    act(() => {
      result.current.playCorrect();
    });
    
    expect(playSound).toHaveBeenCalledWith('click', true);
  });

  it('should play win sound when enabled', () => {
    const { result } = renderHook(() => useGameAudio(true));
    
    act(() => {
      result.current.playWin();
    });
    
    expect(playSound).toHaveBeenCalledWith('win', true);
  });

  it('should play click sound when enabled', () => {
    const { result } = renderHook(() => useGameAudio(true));
    
    act(() => {
      result.current.playClick();
    });
    
    expect(playSound).toHaveBeenCalledWith('click', true);
  });

  it('should not play sounds when disabled', () => {
    const { result } = renderHook(() => useGameAudio(false));
    
    vi.clearAllMocks();
    
    act(() => {
      result.current.playCorrect();
      result.current.playWin();
      result.current.playClick();
    });
    
    expect(playSound).toHaveBeenCalledWith('click', false);
    expect(playSound).toHaveBeenCalledWith('win', false);
  });
});
