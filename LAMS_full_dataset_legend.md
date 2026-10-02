# LAMS Full Dataset Legend & Authoritative Schema

Authoritative schema reference for `lams_full_dataset.csv`.
`lams_full_dataset.csv` contains 12 separate logical entity types multiplexed into a single file via the `entity_type` column.

---

## 1. `village` (40 rows)
Represents revenue villages in the administrative hierarchy (State > District > Tehsil > Village).

| Column | CSV Column | Logical Type | Description |
|---|---|---|---|
| Village ID | `village_id` | String (Primary Key) | Unique village code (e.g. `VLG-001`) |
| Record ID | `record_id` | String | Same as `village_id` |
| Name | `name` | String | Name of the village |
| Tehsil | `tehsil` | String | Sub-district / Tehsil name (Itarsi, Sohagpur, Begumganj, Silwani) |
| District | `district` | String | District name (Narmadapuram, Raisen) |
| State | `state` | String | State name (Madhya Pradesh) |
| Latitude | `lat` | Float (Decimal Degrees) | Village center latitude coordinate |
| Longitude | `lon` | Float (Decimal Degrees) | Village center longitude coordinate |

---

## 2. `owner` (700 rows)
Represents synthetic landowners affected by land acquisition corridors.

| Column | CSV Column | Logical Type | Description |
|---|---|---|---|
| Owner ID | `owner_id` | String (Primary Key) | Unique owner identifier (e.g. `OWN-0001`) |
| Record ID | `record_id` | String | Same as `owner_id` |
| Name | `name` | String | Full name of the landowner |
| Gender | `gender` | String | Gender (`M`, `F`) |
| Masked Phone | `masked_phone` | String | Masked phone number (e.g. `93XXXXX656`) |
| Village ID | `village_id` | String (Foreign Key -> `village.village_id`) | Village of residence/origin |

---

## 3. `project` (6 rows)
Represents major infrastructure acquisition projects.

| Column | CSV Column | Logical Type | Description |
|---|---|---|---|
| Project ID | `project_id` | String (Primary Key) | Project identifier (e.g. `PRJ-001`) |
| Record ID | `record_id` | String | Same as `project_id` |
| Project Name | `name` | String | Name of the project |
| Project Type | `type` | String | Sector / type (Highway, Rail, Canal/Irrigation, Industrial Corridor, Transmission Line) |
| Districts | `districts` | String | Semicolon-delimited districts spanned (e.g. `Narmadapuram;Raisen`) |
| Current Stage | `current_stage` | String | Workflow stage (`proposal`, `scrutiny`, `sia_appraisal`, `preliminary_notification`, `objections`, `final_declaration`, `award`, `compensation`) |
| Start Date | `start_date` | String (ISO Date `YYYY-MM-DD`) | Date project acquisition commenced |
| Is Delayed | `is_delayed` | Boolean (`True` / `False`) | True if project has breached statutory SLA deadline |
| SLA Deadline | `current_stage_sla_deadline` | String (ISO Date `YYYY-MM-DD`) | Statutory SLA deadline for current stage |
| Total Parcels | `total_parcels` | Integer | Total number of parcels being acquired |

---

## 4. `parcel` (902 rows)
Represents cadastral land parcels subject to acquisition.

| Column | CSV Column | Logical Type | Description |
|---|---|---|---|
| Parcel ID | `parcel_id` | String (Primary Key) | Unique parcel code (e.g. `PCL-0001`) |
| Record ID | `record_id` | String | Same as `parcel_id` |
| ULPIN | `ulpin` | String (Unique) | Unique Land Parcel Identification Number (14 alphanumeric chars) |
| Survey Number | `survey_number` | String | Khasra / survey number (e.g. `908/7`) |
| Village ID | `village_id` | String (Foreign Key -> `village.village_id`) | Village where parcel is located |
| Village Name | `village_name` | String | Denormalized village name |
| District | `district` | String | District name |
| Tehsil | `tehsil` | String | Tehsil name |
| Owner ID | `owner_id` | String (Foreign Key -> `owner.owner_id`) | Registered landowner ID |
| Area (Ha) | `area_ha` | Float | Area in hectares (0.10 to 3.00 ha) |
| Land Use | `land_use` | String | Land category (`Agricultural`, `Residential`, `Barren`, `Mixed Use`) |
| Status | `status` | String | Acquisition status (`proposed`, `notified`, `objections`, `awarded`, `compensation_paid`, `possessed`, `disputed_litigation`) |
| Primary Project ID | `project_id` | String (Foreign Key -> `project.project_id`) | Project acquiring this parcel |
| Project Name | `project_name` | String | Denormalized project name |
| Centroid Latitude | `centroid_lat` | Float | Centroid latitude coordinate |
| Centroid Longitude | `centroid_lon` | Float | Centroid longitude coordinate |
| Geometry GeoJSON | `geometry_geojson` | JSON Object (GeoJSON Polygon) | Cadastral parcel boundary polygon in GeoJSON format |

---

## 5. `litigation_case` (20 rows)
Represents court cases and judicial litigation affecting parcels.

| Column | CSV Column | Logical Type | Description |
|---|---|---|---|
| Case Number | `case_number` | String (Primary Key) | Statutory docket number (e.g. `LAQ-8021/2025`) |
| Record ID | `record_id` | String | Same as `case_number` |
| Parcel ID | `parcel_id` | String (Foreign Key -> `parcel.parcel_id`) | Disputed parcel ID |
| Case Type | `case_type` | String | Nature of dispute (e.g. `Notification validity challenge`, `Compensation quantum dispute`, `Boundary demarcation dispute`, `Succession dispute`, `Title/ownership dispute`) |
| Filed Date | `filed_date` | String (ISO Date `YYYY-MM-DD`) | Date case was registered in court |
| Court | `court` | String | Judicial forum (e.g. `MP High Court (Jabalpur Bench)`, `District Court, Raisen`, `District Court, Narmadapuram`) |
| Status | `status` | String | Case status (`stayed`, `hearing_scheduled`, `pending`) |

---

## 6. `parcel_project_overlap` (5 rows)
Represents parcels whose boundaries intersect multiple project alignments.

| Column | CSV Column | Logical Type | Description |
|---|---|---|---|
| Record ID | `record_id` | String (Primary Key) | Overlap identifier (e.g. `OVL-001`) |
| Parcel ID | `parcel_id` | String (Foreign Key -> `parcel.parcel_id`) | Overlapping parcel ID |
| Primary Project ID | `primary_project_id` | String (Foreign Key -> `project.project_id`) | Primary acquiring project |
| Overlapping Project ID | `overlapping_project_id` | String (Foreign Key -> `project.project_id`) | Secondary intersecting project |
| Note | `note` | String | Explanatory note regarding overlap intersection |

---

## 7. `project_stage_history` (37 rows)
Tracks statutory milestone progression and stage history for projects under RFCTLARR.

| Column | CSV Column | Logical Type | Description |
|---|---|---|---|
| Record ID | `record_id` | String (Primary Key) | Stage record ID (e.g. `STG-001`) |
| Project ID | `project_id` | String (Foreign Key -> `project.project_id`) | Associated project |
| Stage | `stage` | String | Acquisition stage (`proposal`, `scrutiny`, `sia_appraisal`, `preliminary_notification`, `objections`, `final_declaration`, `award`, `compensation`) |
| Start Date | `start_date` | String (ISO Date `YYYY-MM-DD`) | Date stage commenced |
| End Date | `end_date` | String (ISO Date `YYYY-MM-DD`, Nullable) | Date stage finished (null if in progress) |
| Status | `status` | String | Stage status (`completed`, `in_progress`) |
| SLA Days | `sla_days` | Integer | Statutory SLA allotted days (e.g. 30, 45) |

---

## 8. `candidate_alignment` (2 rows)
Represents alternative spatial route alignments for infrastructure projects.

| Column | CSV Column | Logical Type | Description |
|---|---|---|---|
| Alignment ID | `alignment_id` | String (Primary Key) | Alignment identifier (e.g. `ALN-1`) |
| Record ID | `record_id` | String | Same as `alignment_id` |
| Project ID | `project_id` | String (Foreign Key -> `project.project_id`) | Associated project (e.g. `PRJ-001`) |
| Label | `label` | String | Alignment label / description |
| Geometry GeoJSON | `geometry_geojson` | JSON Object (GeoJSON LineString) | Spatial geometry line of alignment |

---

## 9. `rr_family` (180 rows)
Represents Rehabilitation and Resettlement (R&R) entitlements and family records under Schedule II.

| Column | CSV Column | Logical Type | Description |
|---|---|---|---|
| Family ID | `family_id` | String (Primary Key) | R&R family identifier (e.g. `RRF-0001`) |
| Record ID | `record_id` | String | Same as `family_id` |
| Parcel ID | `parcel_id` | String (Foreign Key -> `parcel.parcel_id`) | Affected parcel ID |
| Owner ID | `owner_id` | String (Foreign Key -> `owner.owner_id`) | Family head / owner ID |
| Project ID | `project_id` | String (Foreign Key -> `project.project_id`) | Acquiring project |
| Members Count | `members_count` | Integer | Total count of family members |
| Vulnerable SC/ST | `vulnerable_sc_st` | Boolean (`True` / `False`) | True if belonging to Scheduled Caste / Scheduled Tribe |
| Vulnerable Women Headed | `vulnerable_women_headed` | Boolean (`True` / `False`) | True if female-headed household |
| House Entitlement | `entitlement_house` | Boolean (`True` / `False`) | True if entitled to constructed housing unit |
| Employment Entitlement | `entitlement_employment` | Boolean (`True` / `False`) | True if entitled to mandatory employment / annuity option |
| Subsistence Allowance | `subsistence_allowance_inr` | Integer (INR Currency) | One-time subsistence grant in INR (e.g. 36000, 42000, 50000) |
| R&R Status | `rr_status` | String | Status (`pending`, `in_progress`, `completed`) |

---

## 10. `grievance` (30 rows)
Represents objections and citizen grievances filed by landowners under Section 15.

| Column | CSV Column | Logical Type | Description |
|---|---|---|---|
| Grievance ID | `grievance_id` | String (Primary Key) | Grievance ticket identifier (e.g. `GRV-001`) |
| Record ID | `record_id` | String | Same as `grievance_id` |
| Parcel ID | `parcel_id` | String (Foreign Key -> `parcel.parcel_id`) | Associated parcel ID |
| Owner ID | `owner_id` | String (Foreign Key -> `owner.owner_id`) | Complainant owner ID |
| Project ID | `project_id` | String (Foreign Key -> `project.project_id`) | Acquiring project ID |
| Type | `type` | String | Grievance category (`Ownership/title dispute`, `Boundary/survey discrepancy`, `Compensation amount dispute`, `R&R entitlement not honoured`, `Delay in possession`, `Notice not received`) |
| Filed Date | `filed_date` | String (ISO Date `YYYY-MM-DD`) | Date grievance was lodged |
| Status | `status` | String | Resolution status (`open`, `under_review`, `resolved`) |

---

## 11. `document` (200 rows)
Represents official land acquisition dossiers and statutory certificates.

| Column | CSV Column | Logical Type | Description |
|---|---|---|---|
| Document ID | `document_id` | String (Primary Key) | Document identifier (e.g. `DOC-0001`) |
| Record ID | `record_id` | String | Same as `document_id` |
| Parcel ID | `parcel_id` | String (Foreign Key -> `parcel.parcel_id`) | Associated parcel |
| Project ID | `project_id` | String (Foreign Key -> `project.project_id`) | Associated project |
| Document Type | `doc_type` | String | Statutory category (`Possession_Certificate`, `Objection_Reply`, `Preliminary_Notification`, `Award_Order`, `Ownership_Proof`, `Compensation_Statement`, `Survey_Report`) |
| Filename | `filename` | String | Filename on storage (e.g. `Possession_Certificate_PCL-0132_v1.pdf`) |
| Version | `version` | Integer | Version number (e.g. `1`, `2`) |
| SHA-256 Hash | `sha256_hash` | String (64 hex characters) | Cryptographic SHA-256 checksum seal |
| Uploaded By Role | `uploaded_by_role` | String | Uploader role (`Landowner`, `District Collector / CALA`, `Field Officer`, `Project Implementing Body`) |
| Uploaded Date | `uploaded_date` | String (ISO Date `YYYY-MM-DD`) | Date document was uploaded |

---

## 12. `user` (12 rows)
Represents system user accounts and roles.

| Column | CSV Column | Logical Type | Description |
|---|---|---|---|
| Record ID | `record_id` | String | Unique record identifier (e.g. `ministry.demo@lams.test`) |
| Email | `email` | String (Primary Key / Unique) | Account email address |
| Role | `role` | String | User role (`Central Ministry`, `State Government`, `District Collector / CALA`, `Project Implementing Body`, `Field Officer`, `Admin`, `Landowner / Citizen`) |
| Password | `password` | String (Hashed at seed time) | Plaintext `Demo@123` in CSV; MUST be hashed (bcrypt/argon2) at seed time |
| Linked ID | `linked_id` | String (Nullable) | Associated jurisdiction or entity ID: State for State Govt, District for DC & FO, Project for Requiring Body, Owner ID (`OWN-xxxx`) for Citizen accounts |
