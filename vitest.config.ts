import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: ['./src/test/setup.ts'],
    // Vitest replaces (not merges) default excludes when this is set, so restate
    // the defaults with glob prefixes; bare "node_modules/" does not match nested paths.
    exclude: ['**/node_modules/**', '**/dist/**', '**/e2e/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: [
        'src/engine/**/*.{ts,tsx}',
        'src/stores/**/*.{ts,tsx}',
        'src/games/**/*.{ts,tsx}',
        'src/curriculum/**/*.{ts,tsx}',
        'src/services/persistence/**/*.{ts,tsx}',
      ],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/__tests__/**',
        '**/*.config.js',
        '**/*.config.ts',
        '**/main.jsx',
        'dist/',
      ],
      thresholds: {
        lines: 70,
        functions: 70,
        branches: 80,
        statements: 70,
        'src/engine/**': {
          lines: 70,
          functions: 85,
          branches: 80,
          statements: 70,
        },
        'src/stores/**': {
          lines: 60,
          functions: 60,
          branches: 85,
          statements: 60,
        },
        'src/games/**': {
          lines: 70,
          functions: 55,
          branches: 80,
          statements: 70,
        },
        'src/curriculum/**': {
          lines: 90,
          functions: 75,
          branches: 80,
          statements: 90,
        },
        'src/services/persistence/**': {
          lines: 80,
          functions: 85,
          branches: 70,
          statements: 80,
        },
      },
    },
  },
});
