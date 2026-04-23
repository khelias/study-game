import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useShapeShiftGame } from '../useShapeShiftGame';
import { ShapeShiftProblem } from '../../../types/game';

// Mock dependencies
vi.mock('../../../engine/audio', () => ({
  playSound: vi.fn(),
}));

// Mock pure functions if needed, but they are logic so we might want to keep them real.
// However, boardPxToGridTopLeft is used inside handleDragEnd for board drops.

describe('useShapeShiftGame', () => {
  const mockProblem: ShapeShiftProblem = {
    type: 'shape_shift',
    uid: 'test-uid',
    mode: 'match',
    puzzle: {
      id: 'test-puzzle',
      nameEt: 'Test',
      nameEn: 'Test',
      category: 'shapes',
      difficulty: 'easy',
      gridSize: 10,
      pieces: [
        {
          id: 'p1',
          type: 'square',
          color: 'red',
          correctPosition: { x: 0, y: 0 },
          correctRotation: 0,
          size: 2,
        },
      ],
    },
    pieces: [
      {
        id: 'p1',
        type: 'square',
        color: 'red',
        correctPosition: { x: 0, y: 0 },
        correctRotation: 0,
        isDecoy: false,
        currentPosition: null,
        currentRotation: 0,
        size: 2,
      },
    ],
    showHints: true,
  };

  const mockOnAnswer = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with correct pieces state', () => {
    const { result } = renderHook(() => useShapeShiftGame(mockProblem, mockOnAnswer, true, 500));

    expect(result.current.pieces).toHaveLength(1);
    expect(result.current.pieces[0].currentPosition).toBeNull();
    expect(result.current.status).toBe('idle');
  });

  it('should handle start drag', () => {
    const { result } = renderHook(() => useShapeShiftGame(mockProblem, mockOnAnswer, true, 500));

    act(() => {
      result.current.handleStartDrag('p1', 100, 100, 0, 0);
    });

    expect(result.current.isDragging).toBe(true);
  });

  it('should rotate piece on tap (drag without move)', () => {
    const { result } = renderHook(() => useShapeShiftGame(mockProblem, mockOnAnswer, true, 500));

    act(() => {
      // Start drag
      result.current.handleStartDrag('p1', 100, 100, 0, 0);
    });

    act(() => {
      // End drag immediately (tap)
      result.current.handleDragEnd(100, 100, null, null);
    });

    expect(result.current.pieces[0].currentRotation).toBe(90); // 0 + 90
    expect(result.current.isDragging).toBe(false);
  });

  it('should place hint piece correctly', () => {
    const { result } = renderHook(() => useShapeShiftGame(mockProblem, mockOnAnswer, true, 500));

    act(() => {
      const placed = result.current.placeHintPiece();
      expect(placed).toBe(true);
    });

    expect(result.current.pieces[0].currentPosition).toEqual({ x: 0, y: 0 });
    // Should trigger completion logic if it was the last piece, but that involves timeouts
  });
});
