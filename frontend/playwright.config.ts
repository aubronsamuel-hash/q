// frontend/playwright.config.ts
import { defineConfig } from '@playwright/test';
import fs from 'fs';

function resolveChromiumPath(): string | undefined {
  const candidates = [
    process.env.PW_CHROMIUM_PATH,
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
    '/usr/bin/google-chrome',
    '/snap/bin/chromium',
  ].filter(Boolean) as string[];
  for (const p of candidates) {
    try {
      if (p && fs.existsSync(p)) return p;
    } catch {
      // ignore errors when checking paths
    }
  }
  return undefined;
}

const executablePath = resolveChromiumPath();

export default defineConfig({
  testDir: 'e2e',
  timeout: 30000,
  retries: 1,
  reporter: 'list',
  workers: 1,
  use: {
    baseURL: process.env.E2E_BASE_URL || 'http://127.0.0.1:3000',
    headless: true,
    ...(executablePath ? { executablePath } : {}),
  },
  projects: [
    { name: 'chromium', use: { browserName: 'chromium' } },
  ],
});
