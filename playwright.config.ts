import { defineConfig, devices } from '@playwright/test';

// Builds the docs site, serves it with `vite preview`, and tests the production bundle.
// The library is consumed from source by the docs, so no separate library build is required here.
const PORT = 4173;

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: `http://localhost:${PORT}/`,
    trace: 'on-first-retry',
  },
  // PW_CHANNEL=chromium uses the full Chromium build instead of the headless shell (handy on locked-down machines).
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], channel: process.env.PW_CHANNEL || undefined },
    },
  ],
  webServer: {
    command: 'npm run build -w @oniva-ui/docs && npm run preview -w @oniva-ui/docs',
    url: `http://localhost:${PORT}/`,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
