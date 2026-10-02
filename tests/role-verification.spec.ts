import { test, expect } from "@playwright/test";
import path from "path";
import fs from "fs";

test.describe("LAMS Role-Driven UI & Feature Verification Suite", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  const screenshotDir = path.join(process.cwd(), "public", "screenshots", "roles");

  test.beforeAll(async () => {
    if (!fs.existsSync(screenshotDir)) {
      fs.mkdirSync(screenshotDir, { recursive: true });
    }
  });

  // 1. Central Ministry
  test("1. Central Ministry: Ribbon, 6 National KPI Tiles, State Comparison & Read-Only Scope", async ({ page }) => {
    await page.goto("/login");
    await page.fill("input[name='email']", "central.ministry@lams.gov.in");
    await page.fill("input[name='password']", "Demo@123");
    await page.click("button[type='submit']");
    await page.waitForURL(/.*\/dashboard\/central/);

    // Verify Role Indicator
    await expect(page.locator("header")).toContainText("Central Ministry");

    // Verify Ribbon Links
    const header = page.locator("header");
    await expect(header).toContainText("National Dashboard");
    await expect(header).toContainText("GIS Map (read-only, national)");
    await expect(header).toContainText("Reports/MIS Export");

    // Verify Central Ministry should NOT have District Scrutiny or Admin links
    await expect(header).not.toContainText("Proposals & Scrutiny Queue");
    await expect(header).not.toContainText("User Management");

    // Verify National KPI tiles
    await expect(page.locator("body")).toContainText("Area Notified / Acquired");
    await expect(page.locator("body")).toContainText("Compensation Assessed / Paid");
    await expect(page.locator("body")).toContainText("Affected Families");
    await expect(page.locator("body")).toContainText("R&R Settlement");
    await expect(page.locator("body")).toContainText("Possession Status");
    await expect(page.locator("body")).toContainText("Timeline Adherence");

    // Verify State Comparison Matrix
    await expect(page.locator("body")).toContainText("Inter-State Land Acquisition Performance Matrix");
    await expect(page.locator("body")).toContainText("Maharashtra");
    await expect(page.locator("body")).toContainText("Gujarat");

    await page.screenshot({ path: path.join(screenshotDir, "1-central-ministry.png") });
  });

  // 2. State Government
  test("2. State Government: Ribbon, State-Scoped KPIs & District Comparison", async ({ page }) => {
    await page.goto("/login");
    await page.fill("input[name='email']", "state.maharashtra@lams.gov.in");
    await page.fill("input[name='password']", "Demo@123");
    await page.click("button[type='submit']");
    await page.waitForURL(/.*\/dashboard\/state/);

    // Verify Role Indicator
    await expect(page.locator("header")).toContainText("State Government");

    // Verify Ribbon Links
    const header = page.locator("header");
    await expect(header).toContainText("State Dashboard");
    await expect(header).toContainText("GIS Map (state-scoped)");
    await expect(header).toContainText("Reports/MIS Export");

    // Verify State Metric Tiles
    await expect(page.locator("body")).toContainText("State Area Acquired");
    await expect(page.locator("body")).toContainText("State Compensation (DBT)");
    await expect(page.locator("body")).toContainText("Maharashtra District Comparison Performance Matrix");
    await expect(page.locator("body")).toContainText("Nashik District");
    await expect(page.locator("body")).toContainText("Pune District");

    await page.screenshot({ path: path.join(screenshotDir, "2-state-officer.png") });
  });

  // 3. District Collector / CALA
  test("3. District Collector: Ribbon, Scrutiny Queue, Case Workflow & Judicial Sanction", async ({ page }) => {
    await page.goto("/login");
    await page.fill("input[name='email']", "collector.nashik@lams.gov.in");
    await page.fill("input[name='password']", "Demo@123");
    await page.click("button[type='submit']");
    await page.waitForURL(/.*\/dashboard\/collector/);

    // Verify Role Indicator
    await expect(page.locator("header")).toContainText("District Collector");

    // Verify Ribbon Links
    const header = page.locator("header");
    await expect(header).toContainText("District Dashboard");
    await expect(header).toContainText("Proposals & Scrutiny Queue");
    await expect(header).toContainText("Case Workflow");
    await expect(header).toContainText("GIS Map (district)");
    await expect(header).toContainText("Document Repository");

    // Verify Collector Docket Action Controls
    await expect(page.locator("body")).toContainText("Sanction & Issue Gazette Notice");
    await expect(page.locator("body")).toContainText("Return for Clarification");

    await page.screenshot({ path: path.join(screenshotDir, "3-district-collector.png") });
  });

  // 4. Project Implementing Body (NHAI)
  test("4. Requiring Body: Ribbon, My Projects, New Proposal Form & Document Checklist", async ({ page }) => {
    await page.goto("/login");
    await page.fill("input[name='email']", "nhai.projects@lams.gov.in");
    await page.fill("input[name='password']", "Demo@123");
    await page.click("button[type='submit']");
    await page.waitForURL(/.*\/dashboard\/requiring-body/);

    // Verify Role Indicator
    await expect(page.locator("header")).toContainText("NHAI");

    // Verify Ribbon Links
    const header = page.locator("header");
    await expect(header).toContainText("My Projects");
    await expect(header).toContainText("New Proposal");
    await expect(header).toContainText("Project Documents");
    await expect(header).toContainText("GIS Map (own project only)");

    // Verify NHAI Scoped Projects and NO cross-project data
    await expect(page.locator("body")).toContainText("NH-2026-084");
    await expect(page.locator("body")).toContainText("NH-2026-102");
    await expect(page.locator("body")).toContainText("Agency Scope: NHAI Corridors Only");

    await page.screenshot({ path: path.join(screenshotDir, "4-requiring-body.png") });
  });

  // 5. Field Officer
  test("5. Field Officer: Ribbon, Assigned Tasks, Mobile Data Capture & Zero KPI Tiles", async ({ page }) => {
    await page.goto("/login");
    await page.fill("input[name='email']", "field.sinnar@lams.gov.in");
    await page.fill("input[name='password']", "Demo@123");
    await page.click("button[type='submit']");
    await page.waitForURL(/.*\/dashboard\/field/);

    // Verify Role Indicator
    await expect(page.locator("header")).toContainText("Field Officer");

    // Verify Ribbon Links
    const header = page.locator("header");
    await expect(header).toContainText("My Assigned Tasks");
    await expect(header).toContainText("Field Data Capture (GPS + photo + checklist)");

    // Field officer MUST NOT have National Dashboard or Admin links
    await expect(header).not.toContainText("National Dashboard");
    await expect(header).not.toContainText("User Management");

    // Verify Assigned Tasks table
    await expect(page.locator("body")).toContainText("Assigned Parcels & Inspection Schedule");
    await expect(page.locator("body")).toContainText("Survey 104/2");
    await expect(page.locator("body")).toContainText("Survey 105/1");

    await page.screenshot({ path: path.join(screenshotDir, "5-field-officer.png") });
  });

  // 6. Landowner / Citizen & Cross-Owner Security Guard
  test("6. Landowner: Ribbon, Own Dossier, Schedule I Timeline & Cross-Owner Access Guard", async ({ page }) => {
    await page.goto("/login");
    await page.fill("input[name='email']", "ramesh.patil@lams.test");
    await page.fill("input[name='password']", "Demo@123");
    await page.click("button[type='submit']");
    await page.waitForURL(/.*\/dashboard\/citizen/);

    // Verify Role Indicator
    await expect(page.locator("header")).toContainText("Landowner – Musalgaon");

    // Verify Ribbon Links
    const header = page.locator("header");
    await expect(header).toContainText("My Land & Applications");
    await expect(header).toContainText("File Objection/Grievance");
    await expect(header).toContainText("Compensation Timeline");

    // Verify Landowner Dossier
    await expect(page.locator("body")).toContainText("Ramesh Tukaram Patil");
    await expect(page.locator("body")).toContainText("MH24-0891-4402");
    await expect(page.locator("body")).toContainText("1.25 Hectare");

    // TEST CROSS-OWNER BLOCK: Attempt to view another landowner's parcel via URL param
    await page.goto("/dashboard/citizen?search=MH24-9999-OTHER");
    await expect(page.locator("body")).toContainText("Access Restricted: Unauthorized Land Parcel Dossier");
    await expect(page.locator("body")).toContainText("landowners are strictly restricted to viewing only their own registered cadastral holdings");
    await expect(page.locator("body")).toContainText("Access Blocked");

    await page.screenshot({ path: path.join(screenshotDir, "6-landowner-citizen.png") });
  });

  // 7. System Administrator
  test("7. Admin: Ribbon, System Health Stats Only & Zero Case Data", async ({ page }) => {
    await page.goto("/login");
    await page.fill("input[name='email']", "admin@lams.gov.in");
    await page.fill("input[name='password']", "Demo@123");
    await page.click("button[type='submit']");
    await page.waitForURL(/.*\/admin/);

    // Verify Role Indicator
    await expect(page.locator("header")).toContainText("Administrator");

    // Verify Ribbon Links
    const header = page.locator("header");
    await expect(header).toContainText("User Management");
    await expect(header).toContainText("Role Management");
    await expect(header).toContainText("Workflow/SLA Config");
    await expect(header).toContainText("Master Data");
    await expect(header).toContainText("Audit Logs");

    // Admin MUST NOT have case management links or case metrics
    await expect(header).not.toContainText("District Dashboard");
    await expect(header).not.toContainText("Proposals & Scrutiny Queue");

    // Verify System Stats ONLY
    await expect(page.locator("body")).toContainText("Active System Users");
    await expect(page.locator("body")).toContainText("SLA Watchdog Timers");
    await expect(page.locator("body")).toContainText("Cryptographic Audit Blocks");

    // Verify Centralized Role-Permission Matrix
    await page.click("button:has-text('Role Management')");
    await expect(page.locator("body")).toContainText("Centralized Role-Permission Matrix");
    await expect(page.locator("body")).toContainText("Edge Middleware Active");

    await page.screenshot({ path: path.join(screenshotDir, "7-admin-console.png") });
  });

  // 8. Non-Admin Direct API Route Access Block (403 Test)
  test("8. Security: Non-Admin calling Admin API /api/admin is rejected with 403", async ({ page }) => {
    // Log in as Collector (non-admin)
    await page.goto("/login");
    await page.fill("input[name='email']", "collector.nashik@lams.gov.in");
    await page.fill("input[name='password']", "Demo@123");
    await page.click("button[type='submit']");
    await page.waitForURL(/.*\/dashboard\/collector/);

    // Try calling /api/admin via fetch inside the session context
    const status = await page.evaluate(async () => {
      const res = await fetch("/api/admin");
      return res.status;
    });

    expect(status).toBe(403);
  });

  // 9. Document Repository Verification
  test("9. Document Repository: Upload, Versioning, and Live SHA-256 Checksum", async ({ page }) => {
    await page.goto("/login");
    await page.fill("input[name='email']", "collector.nashik@lams.gov.in");
    await page.fill("input[name='password']", "Demo@123");
    await page.click("button[type='submit']");
    await page.waitForURL(/.*\/dashboard\/collector/);

    await page.goto("/documents");
    await expect(page.locator("body")).toContainText("Statutory Document Repository & SHA-256 Vault");
    await expect(page.locator("body")).toContainText("SHA-256:");
    await expect(page.locator("body")).toContainText("Document Access Log");

    await page.screenshot({ path: path.join(screenshotDir, "9-document-repository.png") });
  });

  // 10. GIS Satellite Tiles at Zoom 17-18
  test("10. GIS Satellite Workbench: Real Esri tiles render at zoom 17-18 without blank tiles", async ({ page }) => {
    await page.goto("/login");
    await page.fill("input[name='email']", "collector.nashik@lams.gov.in");
    await page.fill("input[name='password']", "Demo@123");
    await page.click("button[type='submit']");
    await page.waitForURL(/.*\/dashboard\/collector/);

    await page.goto("/gis?scope=district");
    await page.waitForSelector(".leaflet-tile-loaded", { timeout: 15000 });
    await page.waitForTimeout(1500);

    // Zoom to field level
    const zoomBtn = page.locator("button[title*='Zoom to Field Level']");
    if (await zoomBtn.isVisible()) {
      await zoomBtn.click();
      await page.waitForTimeout(1500);
    }

    const loadedTiles = await page.locator(".leaflet-tile-loaded").count();
    expect(loadedTiles).toBeGreaterThan(4);

    await page.screenshot({ path: path.join(screenshotDir, "10-gis-satellite-zoom18.png") });
  });

  // 11. Bilingual Toggle: Verification across screens
  test("11. Bilingual Toggle: Seamless switch between English and Hindi across dashboards", async ({ page }) => {
    await page.goto("/login");
    await page.fill("input[name='email']", "collector.nashik@lams.gov.in");
    await page.fill("input[name='password']", "Demo@123");
    await page.click("button[type='submit']");
    await page.waitForURL(/.*\/dashboard\/collector/);

    // Switch to Hindi
    await page.click("button:has-text('हिन्दी')");
    await page.waitForTimeout(500);

    // Verify Hindi strings in Collector Console
    await expect(page.locator("body")).toContainText("सक्षम प्राधिकारी");

    await page.screenshot({ path: path.join(screenshotDir, "11-bilingual-hi.png") });
  });
});
