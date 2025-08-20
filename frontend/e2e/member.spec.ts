import { test, expect } from '@playwright/test';
import { env, loginAs } from './utils/auth';

const { apiBase, baseURL, adminEmail, adminPass, memberEmail, memberPass } = env();

test('member changes task status and logs time', async ({ page }) => {
  // Ensure required task exists and is assigned to member
  const adminLogin = await page.request.post(`${apiBase}/auth/login`, {
    data: { email: adminEmail, password: adminPass },
  });
  const { token: adminToken } = await adminLogin.json();

  const memberLogin = await page.request.post(`${apiBase}/auth/login`, {
    data: { email: memberEmail, password: memberPass },
  });
  const { user: memberUser } = await memberLogin.json();

  const projectsRes = await page.request.get(`${apiBase}/projects`, {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  const projects = await projectsRes.json();
  const project = projects.find((p: any) => p.name === 'E2E Project');
  if (project) {
    const detailRes = await page.request.get(`${apiBase}/projects/${project.id}`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const detail = await detailRes.json();
    let task = detail.Tasks?.find((t: any) => t.assignedUserId === memberUser.id);
    if (!task) {
      await page.request.post(`${apiBase}/projects/${project.id}/tasks`, {
        headers: {
          Authorization: `Bearer ${adminToken}`,
          'Content-Type': 'application/json',
        },
        data: { title: 'E2E Task', assignedUserId: memberUser.id },
      });
    }
  }

  await loginAs(page, memberEmail, memberPass, apiBase);

  await page.goto(`${baseURL}/projects`);
  await page.getByRole('link', { name: 'E2E Project' }).click();
  const taskItem = page.locator('li', { hasText: 'E2E Task' }).first();

  await taskItem.getByRole('button', { name: 'In Progress' }).click();
  await expect(taskItem).toContainText('in_progress');

  await taskItem.getByPlaceholder('Hours').fill('2.5');
  await taskItem.locator('input[type="date"]').fill('2024-01-01');
  await taskItem.getByRole('button', { name: 'Log' }).click();

  await taskItem.getByRole('button', { name: 'Done' }).click();
  await expect(taskItem).toContainText('done');
});
