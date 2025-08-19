import { defineConfig } from '@playwright/test';
export default defineConfig({
  timeout: 30000,
  retries: 1,
  reporter: 'list',
  use: {
    baseURL: process.env.E2E_BASE_URL || 'http://127.0.0.1:3000',
    headless: true
  },
  projects: [
    { name: 'chromium', use: { browserName: 'chromium' } }
  ],
  workers: 1
});
