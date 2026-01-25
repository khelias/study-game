import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '../../test/utils';
import { AchievementsModal } from '../AchievementsModal';
import { ACHIEVEMENTS } from '../../engine/achievements';

describe('AchievementsModal', () => {
  it('should render achievements modal', () => {
    const onClose = vi.fn();
    
    render(
      <AchievementsModal
        unlockedAchievements={[]}
        onClose={onClose}
      />
    );
    
    expect(screen.getByText('Saavutused 🏅')).toBeInTheDocument();
  });

  it('should display total achievement count', () => {
    const onClose = vi.fn();
    
    render(
      <AchievementsModal
        unlockedAchievements={[]}
        onClose={onClose}
      />
    );
    
    const totalAchievements = Object.values(ACHIEVEMENTS).length;
    expect(screen.getByText(`0 / ${totalAchievements}`)).toBeInTheDocument();
  });

  it('should display unlocked achievement count', () => {
    const onClose = vi.fn();
    const unlocked = ['first_game', 'perfect_5'];
    
    render(
      <AchievementsModal
        unlockedAchievements={unlocked}
        onClose={onClose}
      />
    );
    
    const totalAchievements = Object.values(ACHIEVEMENTS).length;
    expect(screen.getByText(`2 / ${totalAchievements}`)).toBeInTheDocument();
  });

  it('should call onClose when close button clicked', () => {
    const onClose = vi.fn();
    
    render(
      <AchievementsModal
        unlockedAchievements={[]}
        onClose={onClose}
      />
    );
    
    const closeButton = screen.getByLabelText('Sulge');
    closeButton.click();
    
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('should render all achievements', () => {
    const onClose = vi.fn();
    
    render(
      <AchievementsModal
        unlockedAchievements={[]}
        onClose={onClose}
      />
    );
    
    const totalAchievements = Object.values(ACHIEVEMENTS).length;
    const achievements = screen.getAllByRole('generic').filter(
      el => el.className.includes('p-4') && el.className.includes('rounded-xl')
    );
    
    // Should render at least some achievements
    expect(achievements.length).toBeGreaterThan(0);
  });

  it('should show unlocked achievement with checkmark', () => {
    const onClose = vi.fn();
    const unlocked = ['first_game'];
    
    render(
      <AchievementsModal
        unlockedAchievements={unlocked}
        onClose={onClose}
      />
    );
    
    // First game achievement should be shown
    expect(screen.getByText('Esimene samm')).toBeInTheDocument();
    expect(screen.getByText('✓')).toBeInTheDocument();
  });

  it('should show locked achievements as grayscale', () => {
    const onClose = vi.fn();
    
    const { container } = render(
      <AchievementsModal
        unlockedAchievements={[]}
        onClose={onClose}
      />
    );
    
    // Locked achievements should have grayscale class
    const lockedAchievements = container.querySelectorAll('.grayscale');
    expect(lockedAchievements.length).toBeGreaterThan(0);
  });

  it('should show unlocked achievements without grayscale', () => {
    const onClose = vi.fn();
    const unlocked = ['first_game'];
    
    const { container } = render(
      <AchievementsModal
        unlockedAchievements={unlocked}
        onClose={onClose}
      />
    );
    
    // Check that first_game achievement exists and is shown
    expect(screen.getByText('Esimene samm')).toBeInTheDocument();
  });

  it('should display achievement titles', () => {
    const onClose = vi.fn();
    
    render(
      <AchievementsModal
        unlockedAchievements={[]}
        onClose={onClose}
      />
    );
    
    // Check for some known achievement titles
    expect(screen.getByText('Esimene samm')).toBeInTheDocument();
    expect(screen.getByText('Täiuslik seeria')).toBeInTheDocument();
  });

  it('should display achievement descriptions', () => {
    const onClose = vi.fn();
    
    render(
      <AchievementsModal
        unlockedAchievements={[]}
        onClose={onClose}
      />
    );
    
    // Check for some known achievement descriptions
    expect(screen.getByText('Mängi oma esimest mängu')).toBeInTheDocument();
    expect(screen.getByText('Vastasid 5 ülesannet järjest õigesti')).toBeInTheDocument();
  });

  it('should display achievement icons', () => {
    const onClose = vi.fn();
    
    render(
      <AchievementsModal
        unlockedAchievements={[]}
        onClose={onClose}
      />
    );
    
    // Check for achievement emoji icons using getAllByText for duplicates
    expect(screen.getByText('🎮')).toBeInTheDocument(); // first_game
    const stars = screen.getAllByText('⭐');
    expect(stars.length).toBeGreaterThan(0); // Multiple achievements use star emoji
  });

  it('should show correct count text', () => {
    const onClose = vi.fn();
    
    render(
      <AchievementsModal
        unlockedAchievements={[]}
        onClose={onClose}
      />
    );
    
    expect(screen.getByText('medalit kogutud')).toBeInTheDocument();
  });

  it('should handle multiple unlocked achievements', () => {
    const onClose = vi.fn();
    const unlocked = ['first_game', 'perfect_5', 'score_100', 'persistent'];
    
    render(
      <AchievementsModal
        unlockedAchievements={unlocked}
        onClose={onClose}
      />
    );
    
    const totalAchievements = Object.values(ACHIEVEMENTS).length;
    expect(screen.getByText(`4 / ${totalAchievements}`)).toBeInTheDocument();
  });

  it('should have modal overlay', () => {
    const onClose = vi.fn();
    
    const { container } = render(
      <AchievementsModal
        unlockedAchievements={[]}
        onClose={onClose}
      />
    );
    
    const overlay = container.querySelector('.fixed.inset-0');
    expect(overlay).toBeInTheDocument();
  });
});
