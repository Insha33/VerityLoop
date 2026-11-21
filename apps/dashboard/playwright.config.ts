import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  use: { baseURL: 'http://localhost:3001', trace: 'retain-on-failure' },
  // Starts the dev server when nothing is listening on 3001; reuses a running one locally.
  webServer: { command: 'npm run dev', url: 'http://localhost:3001', reuseExistingServer: !process.env.CI, timeout: 120_000 },
  // Two viewports cover both layouts (sidebar vs drawer navigation). Logic is unit-tested in tests/unit.
  projects: [
    { name: 'desktop', use: { viewport: { width: 1440, height: 1024 } } },
    { name: 'mobile', use: { viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true } },
  ],
});
