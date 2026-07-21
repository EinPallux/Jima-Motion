import { test, expect, type Page } from "@playwright/test";

// Phase 3 Studio integration: the whole no-account loop through the real UI —
// gallery → edit → export → and survive a reload. Runs against the SPA served
// by the Vite dev server.

test.use({ viewport: { width: 1300, height: 850 } });

async function openEditor(page: Page) {
  await page.goto("/studio");
  await page.getByRole("heading", { name: "Pick a template" }).waitFor({ timeout: 30000 });
  await page.getByRole("button", { name: /Kinetic Headline/ }).first().click();
  await page.locator("canvas").first().waitFor({ timeout: 30000 });
}

test("gallery → editor → live edit", async ({ page }) => {
  await openEditor(page);
  const headline = page.getByLabel("Headline");
  await expect(headline).toHaveValue("Say it with motion.");
  await headline.fill("Free forever.");
  await expect(headline).toHaveValue("Free forever.");
  // Aspect switch keeps the editor working.
  await page.getByRole("radio", { name: "9:16" }).click();
  await expect(page.locator("canvas").first()).toBeVisible();
});

test("palette preset fills the color fields", async ({ page }) => {
  await openEditor(page);
  await page.getByRole("tab", { name: "Style" }).click();
  await page.getByRole("button", { name: /White on orange/ }).click();
  // Background field should now hold the palette's background color.
  await expect(page.getByLabel("Hex color").first()).toHaveValue(/#FF4D1C/i);
});

test("export produces a downloadable file through the modal", async ({ page }) => {
  await openEditor(page);
  await page.getByRole("button", { name: /Export ▸/ }).click();
  const dialog = page.getByRole("dialog", { name: "Export" });
  await dialog.waitFor();
  // Use the GIF path — fast and always available — to validate the modal
  // configure → rendering → done flow (engine encoders are covered by
  // export.smoke.spec.ts). 480p keeps software rendering quick.
  await page.getByRole("button", { name: /^GIF/ }).click();
  await page.getByRole("button", { name: /^Export GIF/ }).click();
  await expect(page.getByText(/Saved/)).toBeVisible({ timeout: 45000 });
  const download = page.getByRole("link", { name: /Download again/ });
  await expect(download).toBeVisible();
  await expect(download).toHaveAttribute("download", /^jima-kinetic-headline-.*\.gif$/);
});

test("edits survive a reload (autosave + restore)", async ({ page }) => {
  await openEditor(page);
  await page.getByLabel("Headline").fill("Persisted!");
  await page.waitForTimeout(800); // let autosave (500ms debounce) flush
  await page.reload();
  await page.locator("canvas").first().waitFor({ timeout: 30000 });
  await expect(page.getByLabel("Headline")).toHaveValue("Persisted!");
});
