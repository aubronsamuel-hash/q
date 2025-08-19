import { test, expect } from '@playwright/test';
import { loginAs, getEnv } from './utils/auth';

const { apiBase } = getEnv();
const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
const adminPass = process.env.ADMIN_PASS || 'Admin123!';

test('admin can create a project and open its detail', async ({ page }) => {
  await loginAs(page, { email: adminEmail, password: adminPass, apiBase });

  const existing = page.getByRole('link', { name: 'E2E Project' });
  if (await existing.count()) {
    // Cleanup not implemented in UI; proceed with existing project
  } else {
    await page.fill('input[placeholder="Project name"]', 'E2E Project');
    await page.click('text=Create');
    await expect(page.getByRole('link', { name: 'E2E Project' })).toBeVisible();
  }

  await page.getByRole('link', { name: 'E2E Project' }).click();
  await expect(page.getByRole('heading', { name: 'E2E Project' })).toBeVisible();
  await expect(page.getByText('Tasks')).toBeVisible();
  await expect(page.getByText('Milestones')).toBeVisible();
});
