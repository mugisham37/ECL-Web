/**
 * Headed visual E2E: /runs/new → upload → validate → confirm → compute → success
 * Run: node scripts/visual-run-e2e.mjs
 */
import { chromium } from "playwright";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TEST_DIR = path.resolve(__dirname, "../../ECL-Server/test_data");
const BASE = "http://localhost:3000";
const EMAIL = "compute-test@test.com";
const PASS = "TestPass123!";

const FILES = {
  pd: [
    path.join(TEST_DIR, "PD_2025_Jan_Feb.xlsx"),
    path.join(TEST_DIR, "PD_2025_Mar_Apr.xlsx"),
  ],
  lgd: path.join(TEST_DIR, "LGD_2025_03.xlsx"),
  ead: path.join(TEST_DIR, "EAD_2025_03.xlsx"),
};

async function waitForEnabled(page, name, timeout = 120_000) {
  const btn = page.getByRole("button", { name });
  await btn.waitFor({ state: "visible", timeout });
  for (let i = 0; i < timeout / 500; i++) {
    if (await btn.isEnabled()) return btn;
    await page.waitForTimeout(500);
  }
  throw new Error(`Button "${name}" never enabled`);
}

async function main() {
  const browser = await chromium.launch({ headless: false, slowMo: 400 });
  const context = await browser.newContext({ viewport: { width: 1400, height: 900 } });
  const page = await context.newPage();

  console.log("→ Sign in");
  await page.goto(`${BASE}/sign-in`, { waitUntil: "networkidle" });
  await page.getByRole("textbox", { name: "Email" }).fill(EMAIL);
  await page.getByRole("textbox", { name: "Password" }).fill(PASS);
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.waitForURL(/\/(dashboard|runs)/, { timeout: 30_000 });

  console.log("→ New run wizard");
  await page.goto(`${BASE}/runs/new`, { waitUntil: "networkidle" });
  await page.getByRole("heading", { name: "Upload your monthly files" }).waitFor();

  // Wait until draft run is created (upload zones enabled)
  await page.waitForFunction(
    () => !document.body.textContent?.includes("Preparing run"),
    { timeout: 30_000 },
  );

  console.log("→ Upload PD / LGD / EAD");
  const inputs = page.locator('input[type="file"]');
  await inputs.nth(0).setInputFiles(FILES.pd);
  await page.waitForTimeout(1500);
  await inputs.nth(1).setInputFiles(FILES.lgd);
  await page.waitForTimeout(1500);
  await inputs.nth(2).setInputFiles(FILES.ead);

  // Wait for all three upload pills to show OK
  await page.waitForFunction(
    () => {
      const pills = document.querySelectorAll(".upload-zone");
      if (pills.length < 3) return false;
      return [...pills].every((z) => z.textContent?.includes(".xlsx"));
    },
    { timeout: 120_000 },
  );
  console.log("→ Uploads complete");

  const continueBtn = await waitForEnabled(page, "Continue to validation");
  await continueBtn.click();

  console.log("→ Validate");
  await page.getByRole("heading", { name: /Validat/i }).waitFor({ timeout: 30_000 });
  await page.waitForFunction(
    () => !document.body.textContent?.includes("Validating"),
    { timeout: 120_000 },
  );
  const continueAfterValidate = await waitForEnabled(page, "Continue");
  await continueAfterValidate.click();

  console.log("→ Confirm");
  await page.getByRole("heading", { name: /Confirm|Review/i }).waitFor({ timeout: 15_000 });
  const startBtn = await waitForEnabled(page, "Start computation");
  await startBtn.click();

  console.log("→ Compute (watch progress ring)");
  await page.getByRole("heading", { name: "Computing your ECL" }).waitFor({ timeout: 15_000 });

  // Wait for success screen
  await page.waitForFunction(
    () =>
      document.body.textContent?.includes("Run complete") ||
      document.body.textContent?.includes("ECL computed") ||
      document.body.textContent?.includes("View run"),
    { timeout: 180_000 },
  );

  console.log("✓ SUCCESS — leaving browser open 15s so you can review");
  await page.waitForTimeout(15_000);
  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
