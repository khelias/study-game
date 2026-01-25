import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '../../test/utils';
import { GameCard } from '../GameCard';
import { THEME } from '../../games/data';

// Mock the animation component
vi.mock('../EnhancedAnimations', () => ({
  FadeIn: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

describe('GameCard', () => {
  const mockGameConfig = {
    id: 'word_builder',
    title: 'SÕNAMEISTER',
    desc: 'Lao tähtedest sõna kokku',
    theme: THEME.orange,
    iconComponent: () => null,
    difficulty: 'easy',
  };

  it('should render game title and description', () => {
    render(
      <GameCard
        gameConfig={mockGameConfig}
        level={1}
        onClick={vi.fn()}
      />
    );
    
    expect(screen.getByText('SÕNAMEISTER')).toBeInTheDocument();
    expect(screen.getByText('Lao tähtedest sõna kokku')).toBeInTheDocument();
  });

  it('should call onClick when clicked', () => {
    const handleClick = vi.fn();
    
    render(
      <GameCard
        gameConfig={mockGameConfig}
        level={1}
        onClick={handleClick}
      />
    );
    
    const button = screen.getByRole('button');
    button.click();
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should be disabled when locked', () => {
    render(
      <GameCard
        gameConfig={mockGameConfig}
        level={1}
        onClick={vi.fn()}
        isLocked={true}
      />
    );
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('should not call onClick when locked', () => {
    const handleClick = vi.fn();
    
    render(
      <GameCard
        gameConfig={mockGameConfig}
        level={1}
        onClick={handleClick}
        isLocked={true}
      />
    );
    
    const button = screen.getByRole('button');
    button.click();
    
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('should display lock icon when locked', () => {
    render(
      <GameCard
        gameConfig={mockGameConfig}
        level={1}
        onClick={vi.fn()}
        isLocked={true}
      />
    );
    
    expect(screen.getByText('🔒')).toBeInTheDocument();
  });

  it('should display badge when provided', () => {
    render(
      <GameCard
        gameConfig={mockGameConfig}
        level={1}
        onClick={vi.fn()}
        badge="UUS!"
      />
    );
    
    expect(screen.getByText(/UUS!/)).toBeInTheDocument();
  });

  it('should display difficulty level', () => {
    render(
      <GameCard
        gameConfig={mockGameConfig}
        level={1}
        onClick={vi.fn()}
      />
    );
    
    expect(screen.getByText('⭐ Lihtne')).toBeInTheDocument();
  });

  it('should display medium difficulty', () => {
    const mediumConfig = {
      ...mockGameConfig,
      difficulty: 'medium',
    };
    
    render(
      <GameCard
        gameConfig={mediumConfig}
        level={1}
        onClick={vi.fn()}
      />
    );
    
    expect(screen.getByText('⭐⭐ Keskmine')).toBeInTheDocument();
  });

  it('should display hard difficulty', () => {
    const hardConfig = {
      ...mockGameConfig,
      difficulty: 'hard',
    };
    
    render(
      <GameCard
        gameConfig={hardConfig}
        level={1}
        onClick={vi.fn()}
      />
    );
    
    expect(screen.getByText('⭐⭐⭐ Raske')).toBeInTheDocument();
  });

  it('should display progress bar when progress provided', () => {
    const { container } = render(
      <GameCard
        gameConfig={mockGameConfig}
        level={1}
        onClick={vi.fn()}
        progress={{ current: 3, total: 5 }}
      />
    );
    
    // Progress bar should be rendered
    const progressBar = container.querySelector('.bg-gradient-to-r.from-yellow-400');
    expect(progressBar).toBeInTheDocument();
  });

  it('should have correct aria-label', () => {
    render(
      <GameCard
        gameConfig={mockGameConfig}
        level={3}
        onClick={vi.fn()}
      />
    );
    
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute(
      'aria-label',
      'SÕNAMEISTER - Lao tähtedest sõna kokku - Tase 3'
    );
  });

  it('should apply locked styles when isLocked is true', () => {
    const { container } = render(
      <GameCard
        gameConfig={mockGameConfig}
        level={1}
        onClick={vi.fn()}
        isLocked={true}
      />
    );
    
    const button = container.querySelector('button');
    expect(button?.className).toContain('opacity-50');
    expect(button?.className).toContain('cursor-not-allowed');
    expect(button?.className).toContain('grayscale');
  });

  it('should apply clickable styles when not locked', () => {
    const { container } = render(
      <GameCard
        gameConfig={mockGameConfig}
        level={1}
        onClick={vi.fn()}
        isLocked={false}
      />
    );
    
    const button = container.querySelector('button');
    expect(button?.className).toContain('cursor-pointer');
  });
});
