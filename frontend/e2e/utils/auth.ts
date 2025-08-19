import { Page, APIRequestContext, request } from '@playwright/test';
export function env() {
  return {
    apiBase: process.env.E2E_API_BASE || 'http://127.0.0.1:4000',
    baseURL: process.env.E2E_BASE_URL || 'http://127.0.0.1:3000',
    adminEmail: process.env.ADMIN_EMAIL || 'admin@example.com',
    adminPass: process.env.ADMIN_PASS || 'Admin123!',
    memberEmail: process.env.MEMBER_EMAIL || 'member@example.com',
    memberPass: process.env.MEMBER_PASS || 'Member123!'
  };
}
export async function loginAs(page: Page, email: string, password: string, apiBase: string) {
  const ctx: APIRequestContext = await request.newContext();
  const resp = await ctx.post(`${apiBase}/auth/login`, { data: { email, password } });
  if (!resp.ok()) throw new Error(`Login failed ${resp.status()} ${await resp.text()}`);
  const { token, user } = await resp.json();
  await page.addInitScript(([t, u]) => {
    localStorage.setItem('auth', JSON.stringify({ token: t, user: u }));
  }, [token, user]);
}
