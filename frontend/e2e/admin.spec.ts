import { test, expect } from "@playwright/test";

// Util: read credentials and environment
const adminEmail = process.env.ADMIN_EMAIL || "admin@example.com";
const adminPass = process.env.ADMIN_PASS || "Admin123!";
const apiBase = process.env.E2E_API_BASE || "http://127.0.0.1:4000";
const baseURL = process.env.E2E_BASE_URL || "http://127.0.0.1:3000";

// Login via API to seed localStorage
async function loginAs(page, email: string, password: string) {
  const resp = await page.request.post(`${apiBase}/auth/login`, {
    data: { email, password },
  });
  if (!resp.ok()) {
    throw new Error(
      `Login failed for ${email}: ${resp.status()} ${await resp.text()}`
    );
  }
  const { token, user } = await resp.json();
  await page.addInitScript(([t, u]) => {
    localStorage.setItem("auth", JSON.stringify({ token: t, user: u }));
  }, [token, user]);
}

test("admin can create a project and open its detail", async ({ page }) => {
  await loginAs(page, adminEmail, adminPass);

  // Navigate to project list
  await page.goto(`${baseURL}/projects`, { waitUntil: "networkidle" });

  // If project exists already, open it; otherwise create it
  const projectLink = page.getByRole("link", { name: "E2E Project" });
  if (await projectLink.isVisible().catch(() => false)) {
    await projectLink.click();
  } else {
    await page.waitForSelector("text=Projects", { timeout: 5000 });
    const createHeading = page.getByRole("heading", { name: "Create Project" });
    await expect(createHeading).toBeVisible({ timeout: 5000 });

    await page.getByPlaceholder("Name").fill("E2E Project");
    await page
      .getByPlaceholder("Description")
      .fill("E2E project for E2E tests");
    await page.getByRole("button", { name: "Create" }).click();

    await expect(projectLink).toBeVisible({ timeout: 5000 });
    await projectLink.click();
  }

  // On detail page
  await expect(page).toHaveURL(/\/projects\/\d+$/);
  await expect(
    page.getByRole("heading", { name: "Tasks" })
  ).toBeVisible({ timeout: 5000 });
  await expect(
    page.getByRole("heading", { name: "Milestones" })
  ).toBeVisible({ timeout: 5000 });
});

