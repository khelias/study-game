import { defineConfig, devices } from '@playwright/test';

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:5173';
const webServerCommand = process.env.PLAYWRIGHT_WEB_SERVER_COMMAND ?? 'npm run dev';

/**
 * Playwright config for E2E smoke tests.
 *
 * Tests live in `e2e/` and run against a live Vite dev server that Playwright
 * boots automatically. On CI they serve as the safety net for UI refactors;
 * locally they can also be run interactively with `npm run test:e2e:ui`.
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? 'github' : [['html', { open: 'never' }]],
  use: {
    baseURL,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: webServerCommand,
    url: `${baseURL}/study/`,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
