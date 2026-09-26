import { test } from "@playwright/test";
import path from "path";

test.describe("Capture LAMS UI Verification Screenshots", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test("Capture Key Verification Screens", async ({ page }) => {
    const screenshotDir = path.join(process.cwd(), "public", "screenshots");

    // 1. Landing Page (EN) - Finpay minimalist gated hero & 4 pillars
    await page.goto("/");
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(screenshotDir, "landing-en.png") });

    // 2. Landing Page (HI) - Bilingual toggle
    await page.click("button:has-text('हिन्दी')");
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(screenshotDir, "landing-hi.png") });

    // 3. Log In with Demo Credentials
    await page.goto("/login");
    await page.fill("input[name='email']", "collector.nashik@lams.gov.in");
    await page.fill("input[name='password']", "Demo@123");
    await page.click("button[type='submit']");
    await page.waitForURL(/.*\/dashboard\/collector/);

    // 4. Collector Console - Renovated clean light UI with 4 KPI tiles
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(screenshotDir, "collector-console.png") });

    // 5. GIS Explorer - Esri Satellite Basemap at Zoom 15 with cadastral parcels
    await page.goto("/gis");
    // Wait for Leaflet satellite tiles to render
    await page.waitForSelector(".leaflet-tile-loaded", { timeout: 15000 });
    await page.waitForTimeout(1500);
    await page.screenshot({ path: path.join(screenshotDir, "gis-workbench.png") });

    // 6. GIS Explorer - Zoom 18 Field Level Imagery
    const zoomFieldBtn = page.locator("button[title*='Zoom to Field Level']");
    if (await zoomFieldBtn.isVisible()) {
      await zoomFieldBtn.click();
      await page.waitForTimeout(1500);
      await page.screenshot({ path: path.join(screenshotDir, "gis-field-zoom18.png") });
    }

    // 7. Admin Console - Centralized Role-Permission Matrix
    await page.goto("/login");
    await page.fill("input[name='email']", "admin@lams.gov.in");
    await page.fill("input[name='password']", "Demo@123");
    await page.click("button[type='submit']");
    await page.waitForURL(/.*\/admin/);
    await page.waitForTimeout(500);
    const matrixTable = page.locator("table").first();
    await matrixTable.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(screenshotDir, "admin-matrix.png") });

    // 8. Calculator & Simulator
    await page.goto("/calculator");
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(screenshotDir, "calculator.png") });

    await page.goto("/gis/simulator");
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(screenshotDir, "simulator.png") });

    await page.goto("/audit");
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(screenshotDir, "audit-trail.png") });
  });
});
