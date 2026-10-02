import { test, expect } from '@playwright/test';

test.describe('LAMS Fix Pass v4 — RBAC Matrix & Login Verification Suite', () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test.beforeEach(async ({ context }) => {
    await context.clearCookies();
  });

  test('1. Login Screen Redesign: Layout, Visibility Toggle, Collapsible Demo Creds, and Forgot Password flow', async ({ page }) => {
    await page.goto('/login');

    // Centered card, title, tagline
    await expect(page.locator('main').getByRole('heading', { name: 'LAMS Login' })).toBeVisible();
    await expect(page.locator('main')).toContainText('Land Acquisition Monitoring System');
    await expect(page.locator('main')).toContainText('Ministry of Rural Development');

    // Language toggle on login card
    const langToggleHi = page.locator('main').locator('button[aria-label="हिंदी में बदलें"]');
    await expect(langToggleHi).toBeVisible();
    await langToggleHi.click();
    await expect(page.locator('main')).toContainText('भू-अर्जन निगरानी प्रणाली');
    await page.locator('main').locator('button[aria-label="Switch to English"]').click();

    // Password show/hide toggle
    const passwordInput = page.locator('input#password');
    await expect(passwordInput).toHaveAttribute('type', 'password');
    const togglePasswordBtn = page.locator('button[aria-label="Show password"]');
    await expect(togglePasswordBtn).toBeVisible();
    await togglePasswordBtn.click();
    await expect(passwordInput).toHaveAttribute('type', 'text');
    await page.locator('button[aria-label="Hide password"]').click();
    await expect(passwordInput).toHaveAttribute('type', 'password');

    // Collapsible Demo Credentials accordion
    const demoBtn = page.locator('button', { hasText: 'Demo Credentials (Click to expand)' });
    await expect(demoBtn).toBeVisible();
    await demoBtn.click();
    
    // Check that District Collector demo button exists
    const fillDcBtn = page.locator('button', { hasText: 'collector.nashik@lams.gov.in' });
    await expect(fillDcBtn).toBeVisible();

    // Forgot password flow
    const forgotBtn = page.locator('button', { hasText: 'Forgot password?' });
    await expect(forgotBtn).toBeVisible();
    await forgotBtn.click();

    // Modal opens
    await expect(page.locator('h2', { hasText: 'Reset Password' })).toBeVisible();
    // Step 1: Fill email & Send OTP
    await page.locator('input[placeholder="name@lams.gov.in or 9822142109"]').fill('collector.nashik@lams.gov.in');
    await page.locator('button', { hasText: 'Send Verification OTP' }).click();
    // Step 2: OTP screen
    await expect(page.locator('text=Demo OTP:')).toBeVisible();
    await page.locator('input[placeholder="123456"]').fill('123456');
    await page.locator('input[placeholder="At least 6 characters"]').fill('NewSecretPass123!');
    await page.locator('button', { hasText: 'Verify OTP & Reset Password' }).click();
    // Success feedback
    await expect(page.locator('text=Password reset successfully! You can now log in with your new password.')).toBeVisible();

    // Verify registration link
    const registerLink = page.locator('main').locator('a[href="/register"]');
    await expect(registerLink).toBeVisible();
  });

  test('2. RBAC Enforcement: System Administrator Zero-Case-Data and Restricted Routes', async ({ page }) => {
    // Login as Admin
    await page.goto('/login');
    await page.fill("input[name='email']", 'admin@lams.gov.in');
    await page.fill("input[name='password']", 'Demo@123');
    await page.click("button[type='submit']");
    await page.waitForURL(/.*\/admin/);

    // Verify ribbon contains User Management & Audit Logs
    const header = page.locator('header');
    await expect(header.locator('text=User Management')).toBeVisible();
    await expect(header.locator('text=Audit Logs')).toBeVisible();
    await expect(header.locator('text=GIS Explorer')).not.toBeVisible();
    await expect(header.locator('text=Compensation')).not.toBeVisible();
    await expect(header.locator('text=Documents')).not.toBeVisible();

    // Verify Notification Templates tab in Admin Console (Row 22)
    const templatesTab = page.locator('button', { hasText: 'Notification Templates' });
    await expect(templatesTab).toBeVisible();
    await templatesTab.click();
    await expect(page.locator('text=Statutory Notification & SMS Templates')).toBeVisible();

    // Directly navigating to /gis should redirect to unauthorized
    await page.goto('/gis');
    await expect(page).toHaveURL(/.*\/unauthorized/);

    // Directly navigating to /calculator should redirect to unauthorized
    await page.goto('/calculator');
    await expect(page).toHaveURL(/.*\/unauthorized/);

    // Directly navigating to /documents should redirect to unauthorized
    await page.goto('/documents');
    await expect(page).toHaveURL(/.*\/unauthorized/);
  });

  test('3. RBAC Enforcement: District Collector (CALA) Full Sanction Powers', async ({ page }) => {
    // Login as District Collector
    await page.goto('/login');
    await page.fill("input[name='email']", 'collector.nashik@lams.gov.in');
    await page.fill("input[name='password']", 'Demo@123');
    await page.click("button[type='submit']");
    await page.waitForURL(/.*\/dashboard\/collector/);

    // Check GIS tools for DC (Cadastral Measurement & Judicial Annotation)
    await page.goto('/gis');
    await expect(page.locator('button[title="CALA Judicial Annotation & Marking"]')).toBeVisible();
    await expect(page.locator('button[title="CALA Cadastral Boundary & Perimeter Measurement"]')).toBeVisible();

    // Check Compensation page for DC: PFMS DBT Payout button exists
    await page.goto('/calculator');
    await expect(page.locator('text=Authorize PFMS DBT Payout')).toBeVisible();

    // Check R&R Tracker for DC: CALA Grant Approval button exists
    await page.goto('/rr');
    await expect(page.locator('text=Sanction R&R Entitlement Package').first()).toBeVisible();

    // Check Documents page: DC has upload permissions
    await page.goto('/documents');
    await expect(page.locator('button', { hasText: 'Upload Document' })).toBeVisible();
  });

  test('4. RBAC Enforcement: Field Officer Zero KPI Tiles & Handover Evidence Powers', async ({ page }) => {
    // Login as Field Officer
    await page.goto('/login');
    await page.fill("input[name='email']", 'field.sinnar@lams.gov.in');
    await page.fill("input[name='password']", 'Demo@123');
    await page.click("button[type='submit']");
    await page.waitForURL(/.*\/dashboard\/field/);

    // Ensure zero national/state KPI summary tiles
    await expect(page.locator('text=National Acquisition Coverage')).not.toBeVisible();
    await expect(page.locator('text=Pending CALA Approvals')).not.toBeVisible();

    // Field officer has Mobile Data Capture & Handover verification
    await expect(page.locator('body')).toContainText('Assigned Parcels & Inspection Schedule');
    await expect(page.locator('body')).toContainText('Survey 104/2');

    // Field Officer navigating to /calculator should redirect to unauthorized
    await page.goto('/calculator');
    await expect(page).toHaveURL(/.*\/unauthorized/);

    // Field Officer on /gis does not see CALA Annotation tools
    await page.goto('/gis');
    await expect(page.locator('button[title="CALA Judicial Annotation & Marking"]')).not.toBeVisible();
  });

  test('5. RBAC Enforcement: Landowner Scoped Dossier, No Payout Powers', async ({ page }) => {
    // Login as Landowner
    await page.goto('/login');
    await page.fill("input[name='email']", 'ramesh.patil@lams.test');
    await page.fill("input[name='password']", 'Demo@123');
    await page.click("button[type='submit']");
    await page.waitForURL(/.*\/dashboard\/citizen/);

    // Dossier view for Ramesh Patil
    await expect(page.locator('body')).toContainText('Ramesh Tukaram Patil');

    // Check Compensation page: Landowner can view own breakdown but CANNOT authorize payouts
    await page.goto('/calculator');
    await expect(page.locator('text=Authorize PFMS DBT Payout')).not.toBeVisible();

    // Check GIS page: Landowner does not see CALA tools
    await page.goto('/gis');
    await expect(page.locator('button[title="CALA Judicial Annotation & Marking"]')).not.toBeVisible();
  });

  test('6. RBAC Enforcement: State Officer Scoped View & No Document Upload', async ({ page }) => {
    // Login as State Officer
    await page.goto('/login');
    await page.fill("input[name='email']", 'state.maharashtra@lams.gov.in');
    await page.fill("input[name='password']", 'Demo@123');
    await page.click("button[type='submit']");
    await page.waitForURL(/.*\/dashboard\/state/);

    // Documents page: State Officer can view documents, but has NO Upload Document button
    await page.goto('/documents');
    await expect(page.locator('button', { hasText: 'Upload Document' })).not.toBeVisible();

    // Audit page: State Officer is not allowed, redirects to unauthorized
    await page.goto('/audit');
    await expect(page).toHaveURL(/.*\/unauthorized/);
  });
});
