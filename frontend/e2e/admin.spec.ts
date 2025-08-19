import { test, expect } from "@playwright/test";
import { env, loginAs } from "./utils/auth";

const { baseURL, apiBase, adminEmail, adminPass } = env();

test("admin can create a project and open its detail", async ({ page }) => {
  await loginAs(page, adminEmail, adminPass, apiBase);

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

    await page.getByTestId("new-project-name").fill("E2E Project");
    await page
      .getByTestId("new-project-description")
      .fill("E2E project for E2E tests");
    await page.getByTestId("create-project-btn").click();

    await expect(projectLink).toBeVisible({ timeout: 5000 });
    await projectLink.click();
  }

  // On detail page
  await expect(page).toHaveURL(/\/projects\/\d+$/);
  await expect(page.getByTestId("tasks-section")).toBeVisible({ timeout: 5000 });
  await expect(page.getByTestId("milestones-section")).toBeVisible({ timeout: 5000 });
});

