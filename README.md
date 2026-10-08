# Land Acquisition Monitoring System (LAMS) 🏛️

**A Real-Time National Platform for End-to-End Digital Monitoring & Spatial Decision Support of Land Acquisition**

> **Smart India Hackathon 2026** • Problem Statement: **SIH26016**  
> **Ministry of Rural Development (MoRD)** • **Department of Land Resources (DoLR)**, Government of India  
> *Notice: High-fidelity prototype with synthetic demonstration data.*

---

## 🎯 Project Overview

LAMS digitizes and unifies the end-to-end statutory land acquisition workflow under the **Right to Fair Compensation and Transparency in Land Acquisition, Rehabilitation and Resettlement Act, 2013 (RFCTLARR Act 2013)**.

Designed to eliminate inter-departmental latency, curb project cost overruns, and guarantee transparent, equitable rehabilitation, LAMS links high-resolution satellite remote sensing with cadastral parcel registries, statutory timeline tracking, and direct benefit compensation disbursements.


---

## 🚀 Key Highlights & Capabilities (v2 Architecture)

1. **Gated Public Landing Page**:
   - Clean, government-grade marketing portal explaining platform mission and statutory scope.
   - Conceptual *"Who It's For"* cards (Central/State, Collectors, Requiring Bodies, Landowners).
   - Zero live case data, metrics, or interactive maps exposed prior to authentication.
   - Persistent *"Demo Data - Prototype"* banner renders strictly inside authenticated sessions.

2. **High-Accuracy GIS Workbench**:
   - Real **Esri World Imagery (Satellite)** default basemap + OpenStreetMap alternate with separate label overlays.
   - Seamless zoom from levels 14 through 19 with zero blank/grey tiles.
   - ~920 cadastral parcel boundaries fitted to agricultural fields along the Sinnar–Niphad highway corridor in Nashik District, Maharashtra (~19.85°N, 74.00°E).
   - Dynamic parcel lifecycle styling: Proposed, Notified (Sec 11), Objections (Sec 15), Awarded (Sec 23), Compensation Paid, Possessed, and Litigation.

3. **Strict Server-Side 7-Role RBAC**:
   - Hardened middleware and API security returning HTTP 401/403 for unauthorized route and data access.
   - 7 distinct roles: Central Ministry, State Government, District Collector (CALA), Requiring Body (NHAI), Field Revenue Officer, Landowner/Citizen, and Admin.
   - Read-only Centralized Role-Permission Matrix console.
   - Role boundaries enforced: System Administrator cannot modify legal case data.

4. **Statutory RFCTLARR Section Workflow**:
   - Proposal submission & technical scrutiny (Sec 4).
   - Preliminary notification issuance (Sec 11) with automated SLA countdowns.
   - Objections & hearing management (Sec 15).
   - Declaration of acquisition (Sec 19).
   - Summary awards & possession orders (Sec 23/38).

5. **Schedule I Compensation & DBT Disbursement Record**:
   - Statutory calculation based on RFCTLARR First Schedule: Base Market Value × Rural Multiplier (1.25x–2.0x) + 100% Solatium + 12% p.a. Additional Interest.
   - PFMS / DBT payment status tracking (Disbursed, Pending, In-Escrow).

6. **Citizen Self-Registration & Portal**:
   - Aadhaar/Mobile self-registration with simulated OTP verification (`123456`).
   - Claim tracking, parcel objection lodgement, and compensation statement download.

7. **Mobile-Responsive Field Survey View**:
   - Field officer interface for geo-tagged parcel inspections, boundary verifications, and ground photography records.

8. **Tamper-Evident SHA-256 Audit Trail**:
   - Cryptographic hash-chaining across all statutory stage transitions and award dockets.

9. **Bilingual Support (English / हिन्दी)**:
   - Instant language switching across all navigation, KPI metrics, forms, and alerts without page reload.

10. **Executive MIS Reports & One-Click PDF Export**:
    - Project progress summaries, state-wise heatmaps, delay risk scores, and printable statutory dockets.

---

## 🔑 Demonstration Role Accounts

All seeded accounts use password: **`Demo@123`**

| Role | Email | Statutory Jurisdiction & Scope |
| :--- | :--- | :--- |
| **Central Ministry** | `central.ministry@lams.gov.in` | National Overview (DoLR / MoRD), Policy & Cross-State MIS |
| **State Government** | `state.maharashtra@lams.gov.in` | State Revenue Dept (Maharashtra), District Oversight |
| **District Collector (CALA)** | `collector.nashik@lams.gov.in` | Nashik District, Judicial Scrutiny, Awards & Possession |
| **Requiring Body (NHAI)** | `nhai.projects@lams.gov.in` | Project Proponent, Section 4 Proposals & DPR Uploads |
| **Field Revenue Officer** | `field.sinnar@lams.gov.in` | Sinnar Tehsil, Ground Inspections & Geo-tagging |
| **Landowner / Citizen** | `ramesh.patil@lams.test` | Musalgaon (Survey No. 104/2), Claim Tracking & Objections |
| **System Administrator** | `admin@lams.gov.in` | User Provisioning, RBAC Matrix & Tamper Logs (No case edits) |

---

## 🛠️ Quick Start (Local Setup)

The application runs instantly with **SQLite + Prisma** (no external database server required):

```bash
# 1. Clone the repository
git clone https://github.com/your-org/lams.git
cd LAMS

# 2. Install dependencies
npm install --legacy-peer-deps

# 3. Initialize database schema & seed demonstration data
npx prisma db push
npx ts-node prisma/seed.ts

# 4. Start the production build or dev server
npm run build
npm start
# or for local development:
# npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🐳 Docker Deployment

To launch the platform with Docker Compose (includes automated container orchestration and PostgreSQL support):

```bash
docker-compose up -d --build
```

Access the application at [http://localhost:3000](http://localhost:3000).

Health check endpoint:
```bash
curl http://localhost:3000/api/health
```

---

## ☁️ Cloud Deployment (Vercel + Serverless PostgreSQL)

1. Push code to your Git repository.
2. Provision a free PostgreSQL database on [Neon.tech](https://neon.tech) or [Supabase](https://supabase.com).
3. In `prisma/schema.prisma`, change `provider = "sqlite"` to `provider = "postgresql"`.
4. Configure environment variables in Vercel:
   - `DATABASE_URL`: Your serverless PostgreSQL connection string
   - `NEXTAUTH_SECRET`: A secure 32+ character random string
   - `NEXTAUTH_URL`: Your production domain (e.g., `https://lams.vercel.app`)
5. Deploy repository on Vercel.

---

## 🧪 Automated Testing

LAMS includes a comprehensive automated test suite using Playwright:

```bash
# Run smoke tests verifying RBAC, GIS, and core workflows
npx playwright test tests/smoke.spec.ts

# Generate end-to-end visual verification screenshots
npx playwright test tests/screenshots.spec.ts
```

All 8 smoke test assertions run and pass cleanly.

---

## 📋 Documentation Reference

- **[DEMO_SCRIPT.md](DEMO_SCRIPT.md)**: Exact 3-minute hackathon evaluation script with timestamps and click-through steps.
- **[ASSUMPTIONS.md](ASSUMPTIONS.md)**: Product decisions, statutory RFCTLARR assumptions, and verbatim Roles & Permissions table.

---

## 📄 License & Compliance

Developed for **Smart India Hackathon 2026** (Problem Statement SIH26016).  
Complies with **GIGW 3.0** accessibility guidelines and statutory mandates of the **RFCTLARR Act, 2013**.
