import type { Page } from '@playwright/test';

/**
 * Programmatically log in a user by calling the backend and seeding localStorage.
 */
export async function loginAs(
  page: Page,
  { email, password, apiBase }: { email: string; password: string; apiBase: string }
) {
  const res = await page.request.post(`${apiBase}/auth/login`, {
    data: { email, password },
  });
  const { token, user } = await res.json();

  await page.addInitScript(({ token, user }) => {
    // Set auth object and individual keys used by the app
    localStorage.setItem('auth', JSON.stringify({ token, user }));
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  }, { token, user });

  await page.goto('/projects');

  return { token, user };
}

/**
 * Reads API base URL for tests.
 */
export function getEnv() {
  const apiBase = process.env.E2E_API_BASE || 'http://localhost:4000';
  return { apiBase };
}
