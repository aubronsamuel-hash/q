import { test, expect } from '@playwright/test';
import { getEnv } from './utils/auth';

const { apiBase } = getEnv();
const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
const adminPass = process.env.ADMIN_PASS || 'Admin123!';
const memberEmail = process.env.MEMBER_EMAIL || 'member@example.com';
const memberPass = process.env.MEMBER_PASS || 'Member123!';

test('unauthenticated redirect', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.removeItem('auth');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  });
  await page.goto('/projects');
  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();
});
