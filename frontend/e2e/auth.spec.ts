import { test, expect } from '@playwright/test';
import { env } from './utils/auth';

const { apiBase, adminEmail, adminPass, memberEmail, memberPass } = env();

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
