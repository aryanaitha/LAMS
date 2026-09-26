# Land Acquisition Monitoring System (LAMS) — Engineering Assumptions & Specifications (v2)

## 1. Prototype & Regulatory Context
- **Problem Statement**: SIH26016 (Smart India Hackathon 2026), Ministry of Rural Development, Department of Land Resources (DoLR).
- **Scope**: Production-grade functional prototype with deterministic synthetic data aligned to the official SIH26016 Problem Statement.
- **Demonstration Banner**: A persistent banner *"Demo data – prototype, not an official government system"* is displayed **strictly inside the authenticated application**, and **never on the public landing page**.
- **Statutory Framework**:
  - Right to Fair Compensation and Transparency in Land Acquisition, Rehabilitation and Resettlement Act, 2013 (RFCTLARR Act 2013).
  - National Highways Act, 1956 (Section 3A/3D preliminary and final declarations).
  - First Schedule formula parameters: 100% mandatory solatium, rural multiplier (1.00–2.00× based on distance), and 12% p.a. additional statutory interest.

---

## 2. Roles & Permissions Table (Verbatim from Official Specification)

| Role | Represents | Purpose in the system | Can view | Can create / edit | Can approve | Cannot do |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Central Ministry** | MoRD / Dept. of Land Resources | National oversight & policy | All states/districts/projects, national dashboards & MIS reports (read-only) | Nothing case-level | Nothing case-level | Cannot edit any case, project, or parcel record |
| **State Government** | State nodal department | State-level coordination & oversight | All districts/projects within its state | State-level remarks/comments only | Cross-district escalations within state | Cannot act on cases outside its state |
| **District Collector / CALA** | Competent Authority for Land Acquisition | Runs the actual acquisition process for its district | All projects/parcels in its district | Notifications, awards, possession records, R&R records | Scrutiny sign-off, notification issuance, award declaration | Cannot act outside its district; cannot manage other users |
| **Project Implementing / Requiring Body** | The agency needing the land (highway/rail/canal/etc.) | Initiates and tracks its own project | Only its own project(s) | Proposal submission, project documents, alignment data | Nothing (submits for approval only) | Cannot approve its own proposal; cannot see other projects' internal data |
| **Field Officer** | Ground survey/verification staff | Ground-truthing and evidence capture | Parcels/tasks assigned to them | GPS-tagged photos, survey/possession/R&R checklists | Nothing | Cannot change stage/status directly — submissions go for CALA approval |
| **Landowner / Citizen** | Affected person | Track own case, raise concerns | Only their own parcel(s)/application(s) | Objections/grievances | Nothing | Cannot see other owners' data or any dashboard/report |
| **Admin** | System administrator | Configuration, not case decisions | All users, roles, workflow/SLA config, audit logs | Users, roles, master data, SLA config | User/role provisioning only | Cannot edit case data (proposals, awards, compensation, possession) |

### Access Control Enforcement:
- **Server-Side Enforcement**: Enforced via Next.js Edge Middleware (`src/middleware.ts`). Unauthenticated access to any protected route redirects to `/login`. API calls by under-permissioned roles return HTTP 403 Forbidden.
- **Client-Side Permission Guard**: `<Can permission="..." />` component (`src/lib/permissions.ts`) ensures UI components render only when the active role is authorized.
- **Self-Registration**: Exists **only** for Landowner / Citizen (`/register`) with mock OTP `123456`, captcha, and password. All other institutional roles are provisioned by the Administrator via `/admin`.

---

## 3. Geographic Target Region & Spatial Geometry
- **Corridor**: Sinnar Rural Agricultural Corridor (Nashik District, Maharashtra, India).
  - Centroid: `19.8512° N, 74.0041° E` (Sinnar).
  - Default Basemap: Esri World Imagery (`maxNativeZoom: 18`, `maxZoom: 19`).
  - Alternate Basemap: OpenStreetMap standard tiles.
  - Reference Overlays: Esri World Boundaries & Places MapServer overlay.
  - Native Imagery Coverage: Real satellite imagery verified at zoom levels 15–18 displaying visible agricultural fields, trees, and rural structures.
- **Cadastral Overlays**: Synthetic parcel boundaries matching real agricultural plot geometry (0.1 to 3.0 ha) with 14-digit ULPIN standard numbers (`MH24-xxxx-xxxx`).
- **Progressive Detail**:
  - Zoom < 14: Regional overview & project alignment centerline.
  - Zoom 14–16: Cadastral parcel polygons color-coded by acquisition stage.
  - Zoom 17–18: High-resolution plot-level view with survey number inspection tooltips.

---

## 4. Scope Alignment & Trimmed Features (v2)

| Feature | Status | Notes |
| :--- | :--- | :--- |
| **Alignment What-If Simulator** | **Removed** | Excluded from official MVP scope. |
| **ULPIN Multi-Project Overlap** | **Folded in** | Displayed as a visual badge on parcel inspection, not a separate module. |
| **Data Quality Validator** | **Removed** | Excluded from MVP. |
| **Bottleneck Heatmap** | **Removed** | Replaced by explainable rule-based delay indicators. |
| **Interactive Calculator Playground** | **Simplified** | Replaced with plain Schedule I Compensation Assessment & Disbursement Record. |
| **Tamper-Evident Hash Chain Verifier** | **Simplified** | Retained as standard audit log with per-document SHA-256 hash. |
| **Time Machine Fast-Forward** | **Removed** | SLA timers operate from real seeded timeline dates. |
| **Offline PWA with Sync Queue** | **Demoted to Optional** | Shipped as fully mobile-responsive field officer verification checklist. |
| **OpenAPI Contract Explorer** | **Removed** | Replaced with simple simulated adapter status dashboard. |

---

## 5. Seeded Credentials Reference

All accounts share the standard evaluation password: `Demo@123`

| Role | Email | Assigned Scope |
| :--- | :--- | :--- |
| **Central Ministry** | `central.ministry@lams.gov.in` | National Overview (Read-Only) |
| **State Government** | `state.maharashtra@lams.gov.in` | Maharashtra State Jurisdiction |
| **District Collector / CALA** | `collector.nashik@lams.gov.in` | Nashik District (Competent Authority) |
| **Project Implementing Body** | `nhai.projects@lams.gov.in` | NHAI Western Corridor Projects |
| **Field Revenue Officer** | `field.sinnar@lams.gov.in` | Sinnar Tehsil Field Verification |
| **Landowner / Citizen** | `ramesh.patil@lams.test` | Survey No. 104/2 (ULPIN: MH24-0891-4402) |
| **System Administrator** | `admin@lams.gov.in` | Role Provisioning & SLA Configuration |
