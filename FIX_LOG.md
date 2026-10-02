# LAMS — Fix Pass v4 Comprehensive Implementation & Verification Log

**Platform**: Land Acquisition Monitoring System (LAMS)  
**Smart India Hackathon 2026**: Problem SIH26016  
**Nodal Authority**: Ministry of Rural Development, Department of Land Resources (DoLR)  
**Pass Version**: Fix Pass v4 (RBAC Completeness + Login Redesign + Dead/Duplicate Clean-Up)  
**Date**: September 29, 2026  
**Test Suite Status**: **25/25 Playwright Tests Passing (100% Pass Rate)**

---

## 1. Executive Summary

This pass systematically implements every requirement of Fix Pass v4 on top of the established Next.js 14 / TypeScript / Tailwind CSS architecture:

1. **RBAC Matrix Completeness (29 Rows across 7 Roles)**: Every cell defined in the canonical permission matrix is enforced end-to-end. Full access (`F`), Submission (`S`), View-only (`V`), and Approval (`A`) rights are strictly bound both on the client UI (ribbon, tabs, action buttons) and on the server via `middleware.ts` and route handlers (`/api/compensation`, `/api/possession`, `/api/rr`, `/api/documents`, `/api/admin`). Any attempt to access unauthorized paths (`—`) results in a server-side `403 Forbidden` response or redirect to `/unauthorized`.
2. **Login Screen Redesign**: The login screen (`src/app/login/page.tsx`) was rebuilt into a centered card with official LAMS identity, bilingual switch (English/हिन्दी), password reveal toggle, collapsible 1-click demo accounts accordion (defaulting closed), mock "Forgot Password" OTP flow (`123456`), self-registration link (`/register`), and 360px mobile responsiveness.
3. **Dead & Duplicate Buttons Cleaned**: All raw `alert(...)` calls and stubbed handlers were eliminated. Duplicate buttons were unified into single context-sensitive controls, and actions were wired to genuine handlers (live SHA-256 seal verification, real CSV export generation, simulated PFMS DBT payout with UTR dispatch, and geotagged evidence sync).

---

## 2. Complete 29-Row RBAC Matrix Implementation & Enforcement

The canonical permissions matrix is implemented in [`src/lib/permissions.ts`](file:///c:/Users/Aryan/Desktop/LAMS/src/lib/permissions.ts) and guarded at the edge by [`src/middleware.ts`](file:///c:/Users/Aryan/Desktop/LAMS/src/middleware.ts).

| Row # | Feature / Resource | Central Ministry (CM) | State Govt (SG) | District Collector (DC) | Requiring Body (RB) | Field Officer (FO) | Landowner (LO) | Admin (AD) | UI & Server Enforcement Mechanism |
|---|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|---|
| **1** | National Overview Dashboard | `V` | `—` | `—` | `—` | `—` | `—` | `—` | Route `/dashboard/central` restricted to CM; other roles redirected to `/unauthorized`. Ribbon link rendered solely for CM. |
| **2** | State Comparison Dashboard | `V` | `V` | `—` | `—` | `—` | `—` | `—` | Route `/dashboard/state` accessible to CM (all states) & SG (Maharashtra scoped); others blocked. |
| **3** | District Scrutiny Queue | `—` | `—` | `A` | `—` | `—` | `—` | `—` | Scrutiny tab on `/dashboard/collector` displays docket actions (Sanction / Return) strictly for DC. |
| **4** | GIS Interactive Workbench | `V` | `V` | `V` | `V` | `V` | `V` | `—` | Route `/gis` blocked for Admin. Operational roles access scoped layers (National/State/District/Project/Assigned/Own). |
| **5** | GIS Cadastral Measurement & Annotation | `—` | `—` | `S` | `—` | `—` | `—` | `—` | Interactive boundary polygon measurement and judicial annotation pins are rendered strictly if `userRole === 'DISTRICT_COLLECTOR'`. |
| **6** | New Land Acquisition Proposal | `—` | `—` | `—` | `S` | `—` | `—` | `—` | Proposal creation wizard on `/dashboard/requiring-body` restricted to Requiring Body (NHAI). |
| **7** | Gazette Notification Generation | `—` | `—` | `A` | `—` | `—` | `—` | `—` | Section 11/19 Gazette issuance button rendered strictly on Collector docket. |
| **8** | Joint Measurement Survey (JMS) Evidence | `—` | `—` | `A` | `—` | `S` | `—` | `—` | Field Officer submits GPS coordinates + photos; DC sanctions survey outcomes. |
| **9** | Section 15 Objection Filing | `—` | `—` | `A` | `—` | `—` | `S` | `—` | Landowner lodges objection in dossier (`/dashboard/citizen`); DC conducts hearing and issues statutory order. |
| **10** | Award Assessment / RFCTLARR Calculator | `V` | `V` | `F` | `V` | `—` | `V` | `—` | Route `/calculator` blocked for FO and Admin. Landowner view scoped strictly to own parcel. |
| **11** | Compensation PFMS DBT Disbursement | `—` | `—` | `A` | `—` | `—` | `—` | `—` | "Authorize PFMS DBT Payout" button and `/api/compensation` endpoint authorized solely for DC (`A`). |
| **12** | Possession Certificate & Order Issuance | `—` | `—` | `A` | `—` | `—` | `—` | `—` | `/api/possession` grants DC sole authority to issue Section 38/40 possession certificates. |
| **13** | Physical Handover Panchanama Verification | `—` | `—` | `A` | `—` | `S` | `—` | `—` | Field Officer logs geotagged boundary handover; DC confirms final entry in record of rights. |
| **14** | Rehabilitation & Resettlement (R&R) Tracker | `V` | `V` | `A` | `V` | `S` | `V` | `—` | `/rr` route: DC approves Second Schedule annuity/housing packages; FO logs physical site inspections. |
| **15** | Citizen Grievance Redressal Mechanism | `V` | `V` | `A` | `—` | `—` | `S` | `—` | Landowner submits grievance tickets; DC CALA appellate authority issues binding determinations. |
| **16** | Legal & High Court Litigation Monitor | `V` | `V` | `A` | `V` | `—` | `—` | `—` | Stay order logs and court counter-affidavit updates managed by DC with view access for CM/SG/RB. |
| **17** | Document Repository Browsing | `V` | `V` | `V` | `V` | `V` | `V` | `—` | `/documents` route strictly blocked for Admin (Row 17). Scoped to operational permissions. |
| **18** | Document Upload & Version Checksum | `—` | `—` | `S` | `S` | `S` | `S` | `—` | Upload button rendered solely for DC, RB, FO, and LO. Hidden for CM and SG (view-only). SHA-256 seal generated. |
| **19** | User Account Provisioning | `—` | `—` | `—` | `—` | `—` | `—` | `F` | `/admin?tab=users` restricted to Admin. Operational officers cannot provision accounts. |
| **20** | Role & Permission Matrix Editor | `—` | `—` | `—` | `—` | `—` | `—` | `F` | `/admin?tab=roles` displays master 29-row matrix with real-time audit trail. |
| **21** | External System Gateways (RoR/Bhu-Naksha) | `V` | `V` | `V` | `—` | `—` | `—` | `F` | `/integrations` restricted to CM, SG, DC, and Admin; blocked for RB, FO, and LO. |
| **22** | Notification & SMS Broadcast Templates | `—` | `—` | `—` | `—` | `—` | `—` | `F` | `/admin?tab=templates` provides Admin direct configuration of citizen SMS and official alerts. |
| **23** | System Audit Log (Immutable Trail) | `—` | `—` | `V` | `—` | `—` | `—` | `F` | `/audit` accessible to Admin (full logs) and DC (district-scoped logs). Blocked for other roles. |
| **24** | SLA Timers & Escalation Framework | `V` | `V` | `V` | `—` | `—` | `—` | `F` | Admin configures statutory SLA thresholds (Sec 15, JMS, Sec 25); leadership monitors timers. |
| **25** | Mobile Offline Field Survey Sync | `—` | `—` | `—` | `—` | `F` | `—` | `—` | `/dashboard/field?tab=capture` provides offline IndexedDB simulation and live synchronization. |
| **26** | Landowner Land Dossier (ULPIN / 7/12) | `—` | `—` | `V` | `—` | `V` | `V` | `—` | Scoped to individual holding. Landowner cannot view adjacent holdings or cross-project files. |
| **27** | MIS & Statutory Reports Export | `F` | `F` | `F` | `F` | `—` | `—` | `—` | `/reports` allows generation and client-side download of CSV/Excel/PDF dockets. |
| **28** | Master Data Reference (Multiplier / Circles) | `V` | `V` | `V` | `—` | `—` | `—` | `F` | `/admin?tab=master` houses statutory multipliers (Factor 1.5x, 100% Solatium, 12% Interest). |
| **29** | Zero Case Data Boundary for Administrator | `—` | `—` | `—` | `—` | `—` | `—` | `F` | Admin console enforces absolute separation of duties: Admin has zero access to individual land records or awards. |

---

## 3. Login Screen Redesign Specifications

The login interface (`src/app/login/page.tsx`) was revamped to provide a government-grade, friction-free authentication experience:

- **Visual Layout**:
  - Centered responsive card (`max-w-md`) with subtle border and elevation.
  - Official emblem (`🏛️`), bold **LAMS** wordmark, and Ministry subtitle (*Department of Land Resources • Ministry of Rural Development*).
  - Integrated bilingual toggle (English / हिन्दी) positioned directly inside the card header for immediate accessibility.
- **Form Controls & Validation**:
  - Unified input for official email or registered mobile phone with `name="email"` and `id="identifier"`.
  - Password input with toggle button (`Show password` / `Hide password`) switching input type dynamically between `password` and `text`.
  - Inline error feedback on invalid authentication attempts.
- **Collapsible Demo Accounts Accordion**:
  - Accordion panel titled `Demo Credentials (Click to expand)` that is **collapsed by default** to keep the screen uncluttered.
  - Expanding reveals quick 1-click login buttons for all 7 seeded personas with their official scopes and roles.
- **Mock "Forgot Password" Flow**:
  - Triggered via `Forgot password?` link opening an accessible modal.
  - **Step 1**: User inputs registered email or mobile number and clicks `Send Verification OTP`.
  - **Step 2**: Displays demo code notification (`123456`), accepts 6-digit OTP and new password (`At least 6 characters`).
  - **Step 3**: Validates OTP and updates password with instant success feedback.
- **Secondary Self-Registration Link**:
  - Clear navigation callout for citizens: `New Landowner? Register here` linking to `/register`.
- **Mobile Responsiveness**:
  - Tested and styled down to 360px viewport widths with responsive padding, touch targets (>44px), and typography.

---

## 4. Catalog of Dead & Duplicate Buttons Fixed

All buttons across the application were audited. Dead buttons using `alert(...)` or empty click listeners were removed or replaced with authentic client-side and API interactions:

| Screen / Component | Original Button / Trigger | Status / Issue | Fix Implemented |
|---|---|---|---|
| **Documents** (`documents/page.tsx`) | `Export Audit Trail (CSV)` | Was calling `alert(...)` | Replaced with dynamic CSV generator creating and downloading `LAMS_Document_Audit_Trail.csv` in the browser. |
| **Documents** (`documents/page.tsx`) | `Verify Checksum` | Dummy modal without crypto | Wired to Web Crypto API computing real SHA-256 hash against document bytes and displaying statutory NIC seal. |
| **Documents** (`documents/page.tsx`) | Duplicate "Download" icons | Redundant duplicate action in table | Unified into a single document card action triggering authentic simulated PDF file download. |
| **Citizen Portal** (`citizen/page.tsx`) | `Download Digital 7/12 Extract` | Was calling `alert(...)` | Generates official MahaBhulekh digitally signed PDF simulation with NIC e-Pramaan header. |
| **Citizen Portal** (`citizen/page.tsx`) | `Download Section 11 Gazette Notice` | Was calling `alert(...)` | Generates official Gazette Notification No. 248/2026 text file download. |
| **Field Officer** (`field/page.tsx`) | `Sync Geotagged Records` | Unwired button | Wired to background queue synchronizer updating pending survey tasks to `COMPLETED` and refreshing badge count. |
| **Requiring Body** (`requiring-body/page.tsx`) | `Download Approved Section 19 Gazette` | Was calling `alert(...)` | Generates Gazette notice file download and logs access in audit store. |
| **Compensation** (`calculator/page.tsx`) | `Authorize PFMS DBT Payout` | Missing judicial control | Wired to `/api/compensation` endpoint: marks parcel as `PAID`, records statutory UTR number, and updates state. |
| **R&R Tracker** (`rr/page.tsx`) | `Sanction R&R Entitlement Package` | Static status indicator | Wired to `/api/rr` endpoint: updates CALA sanction timestamp and issues disbursement token. |
| **GIS Explorer** (`gis/page.tsx`) | `Measure` and `Annotate` | Absent from collector UI | Added dedicated CALA toolbar for District Collector allowing boundary dimension calculation and judicial pins. |

---

## 5. Automated Verification & Test Results

The entire verification suite was executed against the running production build (`http://localhost:3000`):

```bash
npx playwright test tests/rbac-v4.spec.ts tests/role-verification.spec.ts tests/smoke.spec.ts
```

### Execution Output:
```
Running 25 tests using 1 worker

  ok  1 [chromium] › tests/rbac-v4.spec.ts:10:7 › LAMS Fix Pass v4 › 1. Login Screen Redesign: Layout, Visibility Toggle, Collapsible Demo Creds, and Forgot Password flow (1.2s)
  ok  2 [chromium] › tests/rbac-v4.spec.ts:67:7 › LAMS Fix Pass v4 › 2. RBAC Enforcement: System Administrator Zero-Case-Data and Restricted Routes (1.2s)
  ok  3 [chromium] › tests/rbac-v4.spec.ts:102:7 › LAMS Fix Pass v4 › 3. RBAC Enforcement: District Collector (CALA) Full Sanction Powers (1.4s)
  ok  4 [chromium] › tests/rbac-v4.spec.ts:128:7 › LAMS Fix Pass v4 › 4. RBAC Enforcement: Field Officer Zero KPI Tiles & Handover Evidence Powers (968ms)
  ok  5 [chromium] › tests/rbac-v4.spec.ts:153:7 › LAMS Fix Pass v4 › 5. RBAC Enforcement: Landowner Scoped Dossier, No Payout Powers (930ms)
  ok  6 [chromium] › tests/rbac-v4.spec.ts:173:7 › LAMS Fix Pass v4 › 6. RBAC Enforcement: State Officer Scoped View & No Document Upload (986ms)
  ok  7 [chromium] › tests/role-verification.spec.ts:17:7 › LAMS Role-Driven UI › 1. Central Ministry: Ribbon, 6 National KPI Tiles, State Comparison & Read-Only Scope (894ms)
  ok  8 [chromium] › tests/role-verification.spec.ts:54:7 › LAMS Role-Driven UI › 2. State Government: Ribbon, State-Scoped KPIs & District Comparison (930ms)
  ok  9 [chromium] › tests/role-verification.spec.ts:81:7 › LAMS Role-Driven UI › 3. District Collector: Ribbon, Scrutiny Queue, Case Workflow & Judicial Sanction (802ms)
  ok 10 [chromium] › tests/role-verification.spec.ts:107:7 › LAMS Role-Driven UI › 4. Requiring Body: Ribbon, My Projects, New Proposal Form & Document Checklist (1.0s)
  ok 11 [chromium] › tests/role-verification.spec.ts:133:7 › LAMS Role-Driven UI › 5. Field Officer: Ribbon, Assigned Tasks, Mobile Data Capture & Zero KPI Tiles (1.0s)
  ok 12 [chromium] › tests/role-verification.spec.ts:161:7 › LAMS Role-Driven UI › 6. Landowner: Ribbon, Own Dossier, Schedule I Timeline & Cross-Owner Access Guard (1.1s)
  ok 13 [chromium] › tests/role-verification.spec.ts:192:7 › LAMS Role-Driven UI › 7. Admin: Ribbon, System Health Stats Only & Zero Case Data (854ms)
  ok 14 [chromium] › tests/role-verification.spec.ts:228:7 › LAMS Role-Driven UI › 8. Security: Non-Admin calling Admin API /api/admin is rejected with 403 (640ms)
  ok 15 [chromium] › tests/role-verification.spec.ts:246:7 › LAMS Role-Driven UI › 9. Document Repository: Upload, Versioning, and Live SHA-256 Checksum (995ms)
  ok 16 [chromium] › tests/role-verification.spec.ts:262:7 › LAMS Role-Driven UI › 10. GIS Satellite Workbench: Real Esri tiles render at zoom 17-18 without blank tiles (5.0s)
  ok 17 [chromium] › tests/role-verification.spec.ts:287:7 › LAMS Role-Driven UI › 11. Bilingual Toggle: Seamless switch between English and Hindi across dashboards (1.4s)
  ok 18 [chromium] › tests/smoke.spec.ts:4:7 › LAMS Smoke Suite › 1. System Health API is operational and database connected (46ms)
  ok 19 [chromium] › tests/smoke.spec.ts:14:7 › LAMS Smoke Suite › 2. Gated Landing Page loads with v2 minimal aesthetic, Who it's for cards, and NO live data before login (419ms)
  ok 20 [chromium] › tests/smoke.spec.ts:45:7 › LAMS Smoke Suite › 3. Strict Route Guard redirects unauthenticated access to /login (453ms)
  ok 21 [chromium] › tests/smoke.spec.ts:67:7 › LAMS Smoke Suite › 4. Bilingual Language Toggle switches between English and Hindi seamlessly (497ms)
  ok 22 [chromium] › tests/smoke.spec.ts:79:7 › LAMS Smoke Suite › 5. Server-Side RBAC returns 401 for unauthenticated calls and 403 for unauthorized roles (32ms)
  ok 23 [chromium] › tests/smoke.spec.ts:93:7 › LAMS Smoke Suite › 6. District Collector logs in, sees demo banner inside app, and views renovated Collector Console (829ms)
  ok 24 [chromium] › tests/smoke.spec.ts:117:7 › LAMS Smoke Suite › 7. GIS Explorer displays Esri Satellite Basemap with Zoom 15-18 controls (936ms)
  ok 25 [chromium] › tests/smoke.spec.ts:139:7 › LAMS Smoke Suite › 8. Admin Console presents Centralized Role-Permission Matrix (822ms)

  25 passed (27.2s)
```

---

## 6. Verification Status

- [x] **29-row RBAC matrix complete**: Every cell aligned with `F`/`S`/`V`/`A`/`—` in UI and server guard.
- [x] **Zero dead buttons**: All raw `alert(...)` calls and stub handlers replaced with authentic functional behaviors.
- [x] **Login screen redesigned**: Centered card, language toggle, password visibility toggle, collapsible demo credentials, mock forgot password flow, mobile responsive at 360px.
- [x] **All tests passing**: 25 Playwright tests across 3 suites passing green with 0 errors.

---

## 7. PART 1 — Dataset Integration & Demultiplexing

### 7.1 Authoritative Multiplexed Schema Parsing
- **Schema Mapping**: `LAMS_full_dataset_legend.md` was created and used as the authoritative schema for demultiplexing `lams_full_dataset.csv` into 12 logical tables (`villages`, `owners`, `projects`, `parcels`, `litigation_cases`, `parcel_project_overlaps`, `project_stage_history`, `candidate_alignments`, `rr_families`, `grievances`, `documents`, `users_seed`).
- **Data Transformations**:
  - String booleans `"True"` / `"False"` cast to real JavaScript/database booleans (`is_delayed`, `vulnerable_sc_st`, `vulnerable_women_headed`, `entitlement_house`, `entitlement_employment`).
  - `geometry_geojson` parsed into native JSON objects.
  - Plaintext `Demo@123` hashed via bcrypt at seed time.
- **Idempotent Upsert Seeding**: `prisma/seed.cjs` / `prisma/seed.ts` upsert on primary keys, preventing row duplication:
  - 40 villages
  - 700 owners
  - 6 projects
  - 902 parcels
  - 20 litigation cases
  - 5 parcel-project overlaps
  - 37 stage histories
  - 2 candidate alignments
  - 180 R&R families
  - 30 grievances
  - 200 documents
  - 12 seeded users + legacy accounts
- **SLA & Timeline Anchor (2026-09-01)**:
  - `PRJ-003` (Narmadapuram–Raisen Rail Link) & `PRJ-005` (Sohagpur Industrial Corridor) marked as delayed (`isDelayed = true`, deadline `2026-08-10`).
  - `PRJ-002` (Begumganj–Silwani Highway Link) breaches in 3 days (`2026-09-04`).
  - All other projects have healthy future SLA deadlines.

---

## 8. PART 2 — Role-Specific Fixes

### 8.1 Citizen / Landowner
1. **Dynamic Owner Record Binding**:
   - `src/lib/auth.ts`: Passes `linkedId` from database user account into JWT and session.
   - `/api/citizen/data/route.ts`: Scopes fetched parcels, compensation details, documents, grievances, and R&R families to the authenticated citizen's `linkedId`.
   - Verified across all 5 seeded landowners with distinct data:
     - `landowner.own-0677@lams.test` (`OWN-0677`, Pramod Bhatt)
     - `landowner.own-0264@lams.test` (`OWN-0264`, Harish Ahirwar - Parcel `PCL-0121`)
     - `landowner.own-0483@lams.test` (`OWN-0483`, Shanti Korku)
     - `landowner.own-0636@lams.test` (`OWN-0636`, Lakshmi Patel - Parcels `PCL-0047`, `PCL-0869`)
     - `landowner.own-0546@lams.test` (`OWN-0546`, Vinod Patel - Parcel `PCL-0233`)
2. **Self-Registered Citizen Claim/Link Flow**:
   - `/api/citizen/claim/route.ts`: Allows unlinked citizens to search by survey number, ULPIN, or parcel ID and bind their account.
   - Clear "No matching land record found" empty/warning state displayed when search yields no record.

### 8.2 Field Revenue Officer
1. **"Capture GPS Now" Button**:
   - Calls browser `navigator.geolocation` API with high accuracy.
   - Falls back gracefully to a clearly labeled mock sensor reading in the Narmadapuram-Raisen corridor (`Lat 22.xxxxxx, Lon 77.xxxxxx, accuracy ±2.4m`).
   - Displays real-time confirmation inline: `"GPS captured — Lat 22.xxxxxx, Lon 77.xxxxxx, accuracy ±Xm, [timestamp]."`
   - Binds the captured GPS reading to the verification record.
2. **"Save Ground Verification" with Drag-and-Drop Photo Upload**:
   - Real drag-and-drop zone with multi-file support and click-to-browse.
   - Displays thumbnail previews with file names, sizes, and remove buttons before saving.
   - Visibly attaches photos to the saved record in the offline queue/history card.
3. **R&R Section — "Record Geotagged Field Evidence"**:
   - Added interactive modal in `src/app/rr/page.tsx` scoped to specific families in `rr_families.csv`.
   - Captures GPS coordinates, uploads resettlement/housing evidence photos, and updates family entitlement status via `/api/rr`.
4. **Field Documents Section — Full Land Context**:
   - `src/app/documents/page.tsx`: Displays full land context for each document:
     - Village name, Survey number, ULPIN, Masked landowner, Area (Ha), Land use, Project ID and Name.
   - "Export Dossier" / "Download Summary" generates full statutory text file containing complete land and project context.
5. **Fixed Broken "Upload Document" Control**:
   - Working drag-and-drop and click-to-browse file input accepting PDF, JPEG, and PNG.
   - File preview showing file name, size, category selector, project, and parcel binding.
   - Computes SHA-256 seal and stores in database via `/api/documents`.

### 8.3 Project Implementing / Requiring Body
1. **Ribbon Item Deduplication**:
   - Top navigation ribbon in `src/lib/permissions.ts` cleaned up to exactly 4 distinct items:
     1. My Projects (`/dashboard/requiring-body?tab=projects`)
     2. New Proposal (`/dashboard/requiring-body?tab=new-proposal`)
     3. Project Documents (`/documents`)
     4. GIS Map (own project only) (`/gis?scope=project`)
   - `getNavItemsForRole`: Strict deduplication by `href` and `label`.
   - In-page tabs in `src/app/dashboard/requiring-body/page.tsx`: Removed duplicate links to `/documents` and `/gis`.
2. **Richer Context in Project Documents**:
   - Displays project code, project name, associated parcels, villages, workflow stage (derived from `project_stage_history.csv`), upload date, and SHA-256 seal.
   - Exported dossier includes all project and land context.

### 8.4 GIS Interactive Workbench
1. **Dynamic Parcel Layer**:
   - Loads `parcels.geojson` (902 parcels) centered on Narmadapuram-Raisen corridor `[23.083, 78.190]`.
   - Status color-coding (`proposed`, `notified`, `objections`, `awarded`, `compensation_paid`, `possessed`, `disputed_litigation`).
   - Project filtering (`PRJ-001` through `PRJ-006`).
   - ULPIN and survey number search.
   - Active litigation flag (`is_litigation`) with red warning border and drawer notification.
   - Multi-project overlap flag (`is_multi_project_overlap`) with orange warning indicator.
   - Candidate alignments overlay from `candidate_alignments.geojson`.
