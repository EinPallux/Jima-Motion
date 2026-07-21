import { test, expect } from "@playwright/test";

test.use({ viewport: { width: 1300, height: 900 } });

test("landing renders and the primary CTA opens the Studio", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /Motion graphics for social media/ })).toBeVisible();
  // Nav CTA → Studio
  await page.getByRole("link", { name: "Open the Studio" }).first().click();
  await expect(page).toHaveURL(/\/studio$/);
  await expect(page.getByRole("heading", { name: "Pick a template" })).toBeVisible({ timeout: 20000 });
});

test("gallery cards deep-link into a template", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("heading", { name: "Templates for every post" }).waitFor({ timeout: 20000 });
  // Scope to the static gallery grid (the marquee rail is animated).
  await page.locator("#templates").getByRole("link", { name: /Glow Promo/ }).first().click();
  await expect(page).toHaveURL(/\/studio\?t=glow-promo/);
  await expect(page.locator("canvas").first()).toBeVisible({ timeout: 20000 });
});

test("FAQ accordion expands", async ({ page }) => {
  await page.goto("/");
  const q = page.getByRole("button", { name: /Do I need an account\?/ });
  await q.scrollIntoViewIfNeeded();
  await q.click();
  await expect(page.getByText(/There's no login to create/)).toBeVisible();
});
