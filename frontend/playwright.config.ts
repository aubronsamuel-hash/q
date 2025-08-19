import { defineConfig } from '@playwright/test';
const execPath =
  process.env.PW_CHROMIUM_PATH ||
  '/usr/bin/chromium' ||
  '/usr/bin/chromium-browser' ||
  '/usr/bin/google-chrome';

export default defineConfig({
  testDir: 'e2e',
  timeout: 30000,
  retries: 1,
  reporter: 'list',
  workers: 1,
  use: {
    baseURL: process.env.E2E_BASE_URL || 'http://127.0.0.1:3000',
    headless: true,
    launchOptions: { executablePath: execPath }
  },
  projects: [{ name: 'chromium', use: { browserName: 'chromium' } }]
});
