import { test, expect } from '@playwright/test';
import { loginAs, getEnv } from './utils/auth';

const { apiBase } = getEnv();
const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
const adminPass = process.env.ADMIN_PASS || 'Admin123!';

test('admin refreshes project detail and sees totals', async ({ page }) => {
  await loginAs(page, { email: adminEmail, password: adminPass, apiBase });

  await page.getByRole('link', { name: 'E2E Project' }).click();

  const totalsText = await page.locator('p', { hasText: 'Total Hours' }).textContent();
  const match = /Total Hours: (\d+(?:\.\d+)?) \| Total Cost: (\d+(?:\.\d+)?)/.exec(totalsText || '');
  const initialHours = match ? parseFloat(match[1]) : 0;
  const initialCost = match ? parseFloat(match[2]) : 0;

  await page.reload();

  const totalsText2 = await page.locator('p', { hasText: 'Total Hours' }).textContent();
  const match2 = /Total Hours: (\d+(?:\.\d+)?) \| Total Cost: (\d+(?:\.\d+)?)/.exec(totalsText2 || '');
  const refreshedHours = match2 ? parseFloat(match2[1]) : 0;
  const refreshedCost = match2 ? parseFloat(match2[2]) : 0;

  expect(refreshedHours).toBeGreaterThanOrEqual(initialHours);
  expect(refreshedCost).toBeGreaterThanOrEqual(initialCost);
});
