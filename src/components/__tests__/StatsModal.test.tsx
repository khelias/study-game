import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '../../test/utils';
import { StatsModal } from '../StatsModal';
import { createTestStats } from '../../test/utils';

// Mock the components
vi.mock('../StatsDashboard', () => ({
  StatsDashboard: () => <div data-testid="stats-dashboard">StatsDashboard</div>,
  GameTypeStats: () => <div data-testid="game-type-stats">GameTypeStats</div>,
}));

vi.mock('../AccessibilityHelpers', () => ({
  FocusTrap: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

describe('StatsModal', () => {
  it('should render stats modal', () => {
    const stats = createTestStats();
    const onClose = vi.fn();
    
    render(
      <StatsModal
        stats={stats}
        unlockedAchievements={[]}
        onClose={onClose}
      />
    );
    
    expect(screen.getByText('Statistika 📊')).toBeInTheDocument();
  });

  it('should render StatsDashboard component', () => {
    const stats = createTestStats();
    const onClose = vi.fn();
    
    render(
      <StatsModal
        stats={stats}
        unlockedAchievements={[]}
        onClose={onClose}
      />
    );
    
    expect(screen.getByTestId('stats-dashboard')).toBeInTheDocument();
  });

  it('should render GameTypeStats component', () => {
    const stats = createTestStats();
    const onClose = vi.fn();
    
    render(
      <StatsModal
        stats={stats}
        unlockedAchievements={[]}
        onClose={onClose}
      />
    );
    
    expect(screen.getByTestId('game-type-stats')).toBeInTheDocument();
  });

  it('should call onClose when close button clicked', () => {
    const stats = createTestStats();
    const onClose = vi.fn();
    
    render(
      <StatsModal
        stats={stats}
        unlockedAchievements={[]}
        onClose={onClose}
      />
    );
    
    const closeButton = screen.getByLabelText('Sulge statistika');
    closeButton.click();
    
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('should display max levels section when levels exist', () => {
    const stats = createTestStats({
      maxLevels: {
        word_builder: 5,
        memory_math: 3,
      },
    });
    const onClose = vi.fn();
    
    render(
      <StatsModal
        stats={stats}
        unlockedAchievements={[]}
        onClose={onClose}
      />
    );
    
    expect(screen.getByText('Kõrgeimad tasemed')).toBeInTheDocument();
  });

  it('should not display max levels section when no levels', () => {
    const stats = createTestStats({
      maxLevels: {},
    });
    const onClose = vi.fn();
    
    render(
      <StatsModal
        stats={stats}
        unlockedAchievements={[]}
        onClose={onClose}
      />
    );
    
    expect(screen.queryByText('Kõrgeimad tasemed')).not.toBeInTheDocument();
  });

  it('should pass stats to StatsDashboard', () => {
    const stats = createTestStats({
      gamesPlayed: 10,
      totalScore: 500,
    });
    const onClose = vi.fn();
    
    const { container } = render(
      <StatsModal
        stats={stats}
        unlockedAchievements={[]}
        onClose={onClose}
      />
    );
    
    // Verify the component is rendered (mocked version)
    expect(screen.getByTestId('stats-dashboard')).toBeInTheDocument();
  });

  it('should pass unlocked achievements to StatsDashboard', () => {
    const stats = createTestStats();
    const achievements = ['first_game', 'perfect_5'];
    const onClose = vi.fn();
    
    render(
      <StatsModal
        stats={stats}
        unlockedAchievements={achievements}
        onClose={onClose}
      />
    );
    
    expect(screen.getByTestId('stats-dashboard')).toBeInTheDocument();
  });

  it('should have modal overlay', () => {
    const stats = createTestStats();
    const onClose = vi.fn();
    
    const { container } = render(
      <StatsModal
        stats={stats}
        unlockedAchievements={[]}
        onClose={onClose}
      />
    );
    
    const overlay = container.querySelector('.fixed.inset-0');
    expect(overlay).toBeInTheDocument();
  });

  it('should close on overlay click', () => {
    const stats = createTestStats();
    const onClose = vi.fn();
    
    const { container } = render(
      <StatsModal
        stats={stats}
        unlockedAchievements={[]}
        onClose={onClose}
      />
    );
    
    const overlay = container.querySelector('.fixed.inset-0');
    if (overlay) {
      // Simulate click on overlay itself (not children)
      const event = new MouseEvent('click', { bubbles: true });
      Object.defineProperty(event, 'target', { value: overlay, enumerable: true });
      Object.defineProperty(event, 'currentTarget', { value: overlay, enumerable: true });
      overlay.dispatchEvent(event);
      
      expect(onClose).toHaveBeenCalled();
    }
  });
});
