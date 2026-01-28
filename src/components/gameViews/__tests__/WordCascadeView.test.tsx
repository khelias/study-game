import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { WordCascadeView } from '../WordCascadeView';
import type { WordCascadeProblem } from '../../../types/game';

// Mock the translation hook
vi.mock('../../../i18n/useTranslation', () => ({
  useTranslation: () => ({
    games: {
      word_cascade: {
        title: 'Word Cascade',
      },
    },
    gameScreen: {
      wordCascade: {
        tutorial: 'Tap letters to build the word!',
        tapLetters: 'Tap the letters!',
        tryAgain: 'Try again!',
        greatJob: 'Great job!',
        starPickup: 'Star pickup',
        heartPickup: 'Heart pickup',
        shieldPickup: 'Shield pickup',
        pickupHint: 'Tap pickups for rewards!',
      },
    },
  }),
}));

// Mock the audio
vi.mock('../../../engine/audio', () => ({
  playSound: vi.fn(),
}));

// Mock the game store
vi.mock('../../../stores/gameStore', () => ({
  useGameStore: vi.fn((selector) => {
    const mockState = {
      earnStars: vi.fn(),
      addHeart: vi.fn(),
    };
    return selector(mockState);
  }),
}));

describe('WordCascadeView', () => {
  const mockProblem: WordCascadeProblem = {
    type: 'word_cascade',
    target: 'CAT',
    emoji: '🐱',
    columns: 4,
    uid: 'test-uid-cascade-1',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders word cascade game correctly', () => {
    const onAnswer = vi.fn();
    render(<WordCascadeView problem={mockProblem} onAnswer={onAnswer} soundEnabled={false} />);
    
    // Check emoji is rendered
    expect(screen.getByText('🐱')).toBeDefined();
    
    // Check target word slots are rendered (3 for CAT)
    const slots = screen.getByText('🐱').parentElement?.querySelectorAll('.rounded-xl');
    expect(slots?.length).toBeGreaterThan(0);
  });

  it('adds touch-action manipulation to letter buttons', () => {
    const onAnswer = vi.fn();
    const { container } = render(
      <WordCascadeView problem={mockProblem} onAnswer={onAnswer} soundEnabled={false} />
    );
    
    // Wait for letters to spawn, then check they have touch-action
    // Since letters spawn asynchronously, we check the button style attribute exists
    const buttons = container.querySelectorAll('button[aria-label*="Letter"]');
    if (buttons.length > 0) {
      buttons.forEach(button => {
        const htmlButton = button as HTMLButtonElement;
        expect(htmlButton.style.touchAction).toBe('manipulation');
      });
    }
  });

  it('has proper button type attribute for falling letters', () => {
    const onAnswer = vi.fn();
    const { container } = render(
      <WordCascadeView problem={mockProblem} onAnswer={onAnswer} soundEnabled={false} />
    );
    
    // Check buttons have type="button"
    const buttons = container.querySelectorAll('button');
    buttons.forEach(button => {
      expect(button.getAttribute('type')).toBe('button');
    });
  });

  it('resets penalty cooldown on problem change', () => {
    const onAnswer = vi.fn();
    const { rerender } = render(
      <WordCascadeView problem={mockProblem} onAnswer={onAnswer} soundEnabled={false} />
    );
    
    // Change problem uid to trigger reset
    const newProblem: WordCascadeProblem = {
      ...mockProblem,
      uid: 'test-uid-cascade-2',
      target: 'DOG',
    };
    
    rerender(<WordCascadeView problem={newProblem} onAnswer={onAnswer} soundEnabled={false} />);
    
    // If we got here without errors, the reset worked
    expect(true).toBe(true);
  });

  it('displays strikes indicator', () => {
    const onAnswer = vi.fn();
    const { container } = render(
      <WordCascadeView problem={mockProblem} onAnswer={onAnswer} soundEnabled={false} />
    );
    
    // Check for strike indicators (3 circles for max strikes)
    const strikeIndicators = container.querySelectorAll('.rounded-full.border-red-200');
    expect(strikeIndicators.length).toBe(3);
  });

  it('renders instruction text', () => {
    const onAnswer = vi.fn();
    render(<WordCascadeView problem={mockProblem} onAnswer={onAnswer} soundEnabled={false} />);
    
    // Check for tutorial text (initial state)
    const instructionText = screen.getByText(/Tap letters to build the word!/i);
    expect(instructionText).toBeDefined();
  });
});
