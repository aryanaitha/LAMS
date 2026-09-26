# LAMS — 3-Minute Demonstration Script (SIH26016 v2)

An exact 3-minute walkthrough for reviewers and evaluators demonstrating the **Land Acquisition Monitoring System (LAMS)**.

---

## 1. 0:00 – 0:30: Gated Landing Page & Secure Authentication
1. **Public Marketing Landing Page (`/`)**:
   - Highlight the **gated design**: spacious editorial layout, one-line mission statement, 4 conceptual "Who it's for" cards, and statutory About section.
   - Point out that **zero live data, project tables, or maps** are exposed before authentication.
   - Note the sticky minimal top bar: wordmark, About, Login, Register.
2. **Login Portal (`/login`)**:
   - Click **"Login to Platform"** → view pre-seeded demo credentials for all 7 administrative tiers.
   - Select **District Collector / CALA** (`collector.nashik@lams.gov.in` / `Demo@123`) and sign in.
   - Notice the persistent demo banner appears **only inside the authenticated app**.

---

## 2. 0:30 – 1:15: Proposal-to-Award Walkthrough (Collector Console)
1. **Collector Operations Console (`/dashboard/collector`)**:
   - Point out the 4 focused KPI cards: *Active Projects (4)*, *Parcels Under Acquisition (854)*, *Disbursed Amount (₹284.5 Cr)*, *Pending Objections (18)*.
   - Select **Docket CASE-2026-084** (Section 11 Preliminary Notification Approval).
   - Review statutory compliance checklist (SIA Report accepted, MahaBhulekh 7/12 cross-checked, 100% Solatium verified).
   - Click **"Sanction & Issue Gazette Notice"** → observe instant confirmation and statutory record progression.

---

## 3. 1:15 – 1:50: GIS Map with Real Satellite Imagery & Parcel Click
1. **GIS Explorer (`/gis`)**:
   - View the full-bleed map canvas over the **Sinnar Rural Agricultural Corridor** in Nashik, Maharashtra.
   - Point out **real Esri World Imagery satellite tiles** with high-contrast road, field, and building resolution.
   - Click the **Crosshair (Zoom 18)** button to verify field-level imagery beneath the parcel boundaries with zero blank/grey tiles.
2. **Parcel Inspection Drawer**:
   - Click on parcel **Survey No. 104/2** (ULPIN: `MH24-0891-4402`, Owner: Ramesh Tukaram Patil).
   - View the slide-in drawer showing 1.25 Ha area, Schedule I valuation (₹1,32,50,000), and acquisition stage.
   - Toggle **Layers & Filters** to demonstrate corridor alignment and RFCTLARR stage filtering.

---

## 4. 1:50 – 2:20: Statutory SLA Alerts & Delay Indicators
1. **Statutory SLA Clocks**:
   - Point out rule-based statutory countdown timers in the docket queue:
     - `4d SLA Left` (Normal high priority)
     - `SLA Breached 12d` (Urgent escalation for Samruddhi Feeder corridor)
   - Show how automated statutory timelines prevent Section 11 notices from lapsing after 12 months.

---

## 5. 2:20 – 2:45: Bilingual Hindi Toggle & Citizen Portal
1. **Instant Language Toggle**:
   - In the top bar, click **"हिन्दी"**: observe instant bilingual transition of the entire interface.
2. **Landowner Portal (`/dashboard/citizen`)**:
   - Switch role to **Landowner / Citizen** (`ramesh.patil@lams.test`).
   - Observe that the citizen sees **only their own parcel** (Survey 104/2) and cannot access other landowners' data or administrative consoles.
   - Show the 6-stage milestone tracker and PFMS Aadhaar DBT linkage.
   - Click **"आपत्ति दर्ज करें (File Section 15 Objection)"** to submit a grievance for tree/well valuation.

---

## 6. 2:45 – 3:00: MIS Report & PDF Export
1. **Reports & Analytics (`/reports`)**:
   - Switch role to **Central Ministry** (`central.ministry@lams.gov.in`).
   - Click **"Download Briefing PDF"** to generate an executive memorandum for ministerial decision support.
   - Click **"Export Excel"** for comprehensive MIS parcel records.
2. **Conclusion**:
   - LAMS provides an end-to-end, minimal, and fully compliant digital land acquisition platform for the Ministry of Rural Development.
