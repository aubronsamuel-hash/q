import { defineConfig } from '@playwright/test';
import fs from 'fs';

function resolveBrowserPath(): string {
  const candidates = [
    process.env.PW_CHROMIUM_PATH,
    '/usr/bin/google-chrome-stable',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
    '/snap/bin/chromium'
  ].filter(Boolean) as string[];
  for (const p of candidates) { try { if (fs.existsSync(p)) return p; } catch {} }
  throw new Error('No system Chrome/Chromium found. Set PW_CHROMIUM_PATH to a valid executable.');
}

const executablePath = resolveBrowserPath();

export default defineConfig({
  testDir: 'e2e',
  timeout: 30000,
  retries: 1,
  reporter: 'list',
  workers: 1,
  use: {
    baseURL: process.env.E2E_BASE_URL || 'http://127.0.0.1:3000',
    headless: true,
    launchOptions: { executablePath }
  },
  projects: [{ name: 'chromium', use: { browserName: 'chromium' } }]
});
