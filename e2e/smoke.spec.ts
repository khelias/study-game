import { test, expect } from '@playwright/test';

/**
 * Phase 0 safety-net smoke tests.
 *
 * Three flows that exercise the shell without leaning on deep game logic,
 * so they survive content changes (curriculum migration, theme swaps) and
 * catch regressions from the bigger structural refactors planned in
 * ROADMAP.md (GameScreen decomposition, Skill × Mechanic × Content
 * decoupling, backend sync).
 *
 * The tests target the default Estonian locale because that's what a
 * freshly loaded app renders. If a future change moves to English-default
 * or adds a locale picker on first load, update selectors here.
 */

const GAME_STORE_KEY = 'smart_adv_v45_pro';

/**
 * Pre-seed `hasSeenTutorial: true` so the first-run welcome modal never
 * opens. Without this, the modal's backdrop intercepts every click.
 * Zustand's persist middleware merges this partial state with defaults
 * on rehydrate, so we don't need to list every field.
 */
test.beforeEach(async ({ page }) => {
  await page.addInitScript((storeKey: string) => {
    window.localStorage.setItem(
      storeKey,
      JSON.stringify({ state: { hasSeenTutorial: true }, version: 0 }),
    );
  }, GAME_STORE_KEY);
});

test.describe('smart games — smoke', () => {
  test('menu loads with profile switcher and at least one game card', async ({ page }) => {
    await page.goto('/study/');

    // Profile switcher: both age tiers render as buttons with '5+' / '7+' labels.
    await expect(page.getByRole('button', { name: /5\+/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /7\+/ })).toBeVisible();

    // At least one favourited game card is visible. 'word_cascade' ships in
    // DEFAULT_FAVOURITE_GAME_IDS (gameStore.ts) and renders as 'SÕNAKOSK' in
    // Estonian. If the default favourites list changes, pick another stable
    // title here.
    await expect(page.getByRole('button', { name: /SÕNAKOSK/i }).first()).toBeVisible();
  });

  test('profile selection visually toggles active tier', async ({ page }) => {
    await page.goto('/study/');

    const advancedBtn = page.getByRole('button', { name: /7\+/ });
    await advancedBtn.click();

    // Active tier receives a gradient class (Tailwind).
    await expect(advancedBtn).toHaveClass(/from-purple-500/);
  });

  test('clicking a game card navigates to game route and shows game UI', async ({ page }) => {
    await page.goto('/study/');

    await page
      .getByRole('button', { name: /SÕNAKOSK/i })
      .first()
      .click();

    // Route changed to /games/<slug>.
    await expect(page).toHaveURL(/\/study\/games\/[a-z_-]+/);

    // A game-screen chrome element is present (level badge has a stable aria-label).
    await expect(page.getByRole('button', { name: /change level/i })).toBeVisible();
  });
});
