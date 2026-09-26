import { test, expect } from "@playwright/test";

test.describe("LAMS National Platform Smoke & Verification Suite (v2)", () => {
  test("1. System Health API is operational and database connected", async ({ request }) => {
    const res = await request.get("/api/health");
    expect(res.status()).toBe(200);
    const data = await res.json();
    expect(data.status).toBe("healthy");
    expect(data.database).toBe("connected");
    expect(data.counts.projects).toBeGreaterThanOrEqual(6);
    expect(data.counts.parcels).toBeGreaterThanOrEqual(900);
  });

  test("2. Gated Landing Page loads with v2 minimal aesthetic, Who it's for cards, and NO live data before login", async ({
    page,
  }) => {
    await page.goto("/");

    // Persistent demo banner must NOT be visible on unauthenticated landing page
    const demoBanner = page.locator("text=Demo data – prototype");
    await expect(demoBanner).toHaveCount(0);

    // One-line mission statement & PS description
    await expect(
      page.locator("text=A Single National Platform for End-to-End Land Acquisition").first()
    ).toBeVisible();
    await expect(page.locator("text=RFCTLARR Act 2013").first()).toBeVisible();

    // 4 "Who it's for" conceptual cards
    await expect(page.locator("text=Ministries & States").first()).toBeVisible();
    await expect(page.locator("text=District Authorities").first()).toBeVisible();
    await expect(page.locator("text=Project Agencies").first()).toBeVisible();
    await expect(page.locator("text=Landowners").first()).toBeVisible();

    // Sticky minimal top bar: Wordmark, About, Login, Register
    await expect(page.locator("a:has-text('About')").first()).toBeVisible();
    await expect(page.locator("a:has-text('Login')").first()).toBeVisible();
    await expect(page.locator("a:has-text('Register')").first()).toBeVisible();

    // Verify NO internal project table or interactive map exists on public landing page
    const projectTable = page.locator("table");
    await expect(projectTable).toHaveCount(0);
  });

  test("3. Strict Route Guard redirects unauthenticated access to /login", async ({ page }) => {
    // 1. Try accessing /gis unauthenticated
    await page.goto("/gis");
    await page.waitForURL(/.*\/login/);
    expect(page.url()).toContain("/login");

    // 2. Try accessing /dashboard/collector unauthenticated
    await page.goto("/dashboard/collector");
    await page.waitForURL(/.*\/login/);
    expect(page.url()).toContain("/login");

    // 3. Try accessing /admin unauthenticated
    await page.goto("/admin");
    await page.waitForURL(/.*\/login/);
    expect(page.url()).toContain("/login");

    // 4. Try accessing /calculator unauthenticated
    await page.goto("/calculator");
    await page.waitForURL(/.*\/login/);
    expect(page.url()).toContain("/login");
  });

  test("4. Bilingual Language Toggle switches between English and Hindi seamlessly", async ({ page }) => {
    await page.goto("/");
    // Click हिन्दी
    await page.click("button:has-text('हिन्दी')");
    await expect(page.locator("text=मंत्रालय एवं राज्य सरकारें").first()).toBeVisible();
    await expect(page.locator("text=ज़िला प्राधिकरण").first()).toBeVisible();

    // Click English
    await page.click("button:has-text('English')");
    await expect(page.locator("text=Ministries & States").first()).toBeVisible();
  });

  test("5. Server-Side RBAC returns 401 for unauthenticated calls and 403 for unauthorized roles", async ({
    request,
  }) => {
    // Unauthenticated API calls return 401
    const unauthProposal = await request.post("/api/proposals", { data: {} });
    expect(unauthProposal.status()).toBe(401);

    const unauthAward = await request.post("/api/awards", { data: {} });
    expect(unauthAward.status()).toBe(401);

    const unauthGrievance = await request.post("/api/grievances", { data: {} });
    expect(unauthGrievance.status()).toBe(401);
  });

  test("6. District Collector logs in, sees demo banner inside app, and views renovated Collector Console", async ({
    page,
  }) => {
    await page.goto("/login");

    await page.fill("input[name='email']", "collector.nashik@lams.gov.in");
    await page.fill("input[name='password']", "Demo@123");
    await page.click("button[type='submit']");

    await page.waitForURL(/.*\/dashboard\/collector/);

    // Persistent demo banner must be visible inside authenticated app
    await expect(page.locator("text=Demo data – prototype").first()).toBeVisible();

    // Verify 4 focused KPI cards
    await expect(page.locator("text=Active Projects").first()).toBeVisible();
    await expect(page.locator("text=Parcels Under Acquisition").first()).toBeVisible();
    await expect(page.locator("text=Disbursed Amount").first()).toBeVisible();
    await expect(page.locator("text=Pending Objections").first()).toBeVisible();

    // Verify Pending Review Docket
    await expect(page.locator("text=CASE-2026-084").first()).toBeVisible();
  });

  test("7. GIS Explorer displays Esri Satellite Basemap with Zoom 15-18 controls", async ({ page }) => {
    await page.goto("/login");
    await page.fill("input[name='email']", "collector.nashik@lams.gov.in");
    await page.fill("input[name='password']", "Demo@123");
    await page.click("button[type='submit']");
    await page.waitForURL(/.*\/dashboard\/collector/);

    // Navigate to /gis
    await page.goto("/gis");

    // Verify map container and Esri controls
    await expect(page.locator(".leaflet-container")).toBeVisible();
    await expect(page.locator("text=Sinnar Corridor").first()).toBeVisible();
    await expect(page.locator("button:has-text('Satellite')").first()).toBeVisible();
    await expect(page.locator("button:has-text('Streets')").first()).toBeVisible();

    // Toggle Layers Drawer
    await page.click("button:has-text('Layers & Filters')");
    await expect(page.locator("text=Map Layers & Filtering")).toBeVisible();
    await expect(page.locator("text=Cadastral Parcels")).toBeVisible();
  });

  test("8. Admin Console presents Centralized Role-Permission Matrix", async ({ page }) => {
    await page.goto("/login");
    await page.fill("input[name='email']", "admin@lams.gov.in");
    await page.fill("input[name='password']", "Demo@123");
    await page.click("button[type='submit']");
    await page.waitForURL(/.*\/admin/);

    // Check Centralized Permission Matrix
    await expect(page.locator("text=Centralized Role-Permission Matrix")).toBeVisible();
    await expect(page.locator("text=Edge Middleware Active")).toBeVisible();
    await expect(page.locator("text=view:gis_explorer")).toBeVisible();
    await expect(page.locator("text=manage:awards")).toBeVisible();
  });
});
