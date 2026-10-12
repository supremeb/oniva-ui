import { defineConfig, devices } from '@playwright/test';

// Serves the built docs with `vite preview` and tests the production bundle.
// BASE_PATH (default '/') mirrors the docs vite `base`; E2E_REUSE_BUILD=1 skips rebuilding apps/docs/dist
// so CI's second run (at /oniva-ui/) reuses the build from the first step... but note the base is baked
// into dist at build time, so a reused build must have been built with the same BASE_PATH.
const PORT = 4173;
const rawBase = process.env.BASE_PATH || '/';
const base = `/${rawBase.replace(/^\/+|\/+$/g, '')}/`.replace('//', '/');
const reuse = !!process.env.E2E_REUSE_BUILD;

const preview = `npm exec -w @oniva-ui/docs -- vite preview --base ${base} --port ${PORT} --strictPort`;
const build = `BASE_PATH=${base} npm run build -w @oniva-ui/docs`;

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI
    ? [['github'], ['html', { open: 'never', outputFolder: 'playwright-report' }]]
    : 'list',
  outputDir: 'test-results',
  use: {
    baseURL: `http://localhost:${PORT}${base}`,
    trace: 'on-first-retry',
  },
  // PW_CHANNEL=chromium uses the full Chromium build instead of the headless shell.
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], channel: process.env.PW_CHANNEL || undefined },
    },
  ],
  webServer: {
    command: reuse ? preview : `${build} && ${preview}`,
    url: `http://localhost:${PORT}${base}`,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
