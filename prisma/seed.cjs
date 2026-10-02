const { PrismaClient } = require('@prisma/client');
const { readLamsFullDataset } = require('../src/lib/datasetReader.cjs');
const bcrypt = require('../node_modules/.pnpm/bcryptjs@2.4.3/node_modules/bcryptjs');
const path = require('path');

const prisma = new PrismaClient();
const ANCHOR_TODAY = new Date("2026-09-01T00:00:00.000Z");

async function main() {
  console.log("Starting idempotent seed with LAMS full dataset...");

  const csvPath = path.resolve(process.cwd(), "lams_full_dataset.csv");
  console.log(`Loading dataset from: ${csvPath}`);

  const dataset = readLamsFullDataset(csvPath, (plaintext) => {
    return bcrypt.hashSync(plaintext, 10);
  });

  console.log(`Loaded dataset:
    - ${dataset.villages.length} villages
    - ${dataset.owners.length} owners
    - ${dataset.projects.length} projects
    - ${dataset.parcels.length} parcels
    - ${dataset.litigation_cases.length} litigation cases
    - ${dataset.parcel_project_overlaps.length} parcel project overlaps
    - ${dataset.project_stage_history.length} project stage history entries
    - ${dataset.candidate_alignments.length} candidate alignments
    - ${dataset.rr_families.length} R&R families
    - ${dataset.grievances.length} grievances
    - ${dataset.documents.length} documents
    - ${dataset.users.length} users
  `);

  // 1. System Config
  await prisma.systemConfig.upsert({
    where: { id: "default" },
    update: {
      simulatedDateOffsetDays: 0,
      slaProposalScrutinyDays: 15,
      slaSiaAppraisalDays: 60,
      slaObjectionHearingDays: 60,
      slaAwardEnquiryDays: 90,
      solatiumPercentage: 100.0,
      ruralMultiplier: 1.5,
      additionalInterestRate: 12.0,
    },
    create: {
      id: "default",
      simulatedDateOffsetDays: 0,
      slaProposalScrutinyDays: 15,
      slaSiaAppraisalDays: 60,
      slaObjectionHearingDays: 60,
      slaAwardEnquiryDays: 90,
      solatiumPercentage: 100.0,
      ruralMultiplier: 1.5,
      additionalInterestRate: 12.0,
    },
  });

  // 2. Villages
  console.log("Upserting villages...");
  for (const v of dataset.villages) {
    await prisma.village.upsert({
      where: { id: v.village_id },
      update: {
        name: v.name,
        tehsil: v.tehsil,
        district: v.district,
        state: v.state,
        lat: v.lat,
        lng: v.lon,
      },
      create: {
        id: v.village_id,
        name: v.name,
        tehsil: v.tehsil,
        district: v.district,
        state: v.state,
        lat: v.lat,
        lng: v.lon,
      },
    });
  }

  // 3. Owners
  console.log("Upserting owners...");
  for (const o of dataset.owners) {
    await prisma.owner.upsert({
      where: { id: o.owner_id },
      update: {
        name: o.name,
        gender: o.gender,
        maskedPhone: o.masked_phone,
        villageId: o.village_id,
      },
      create: {
        id: o.owner_id,
        name: o.name,
        gender: o.gender,
        maskedPhone: o.masked_phone,
        villageId: o.village_id,
      },
    });
  }

  // 4. Projects
  console.log("Upserting projects...");
  for (const p of dataset.projects) {
    const slaDeadline = new Date(p.current_stage_sla_deadline + "T00:00:00.000Z");
    const startDate = p.start_date ? new Date(p.start_date + "T00:00:00.000Z") : ANCHOR_TODAY;
    const isDelayed = p.is_delayed;

    await prisma.project.upsert({
      where: { code: p.project_id },
      update: {
        name: p.name,
        sector: p.type,
        state: "Madhya Pradesh",
        district: p.districts,
        tehsils: p.districts,
        status: p.current_stage,
        stage: p.current_stage,
        slaDeadline,
        isDelayed,
        totalParcels: p.total_parcels,
        startDate,
      },
      create: {
        id: p.project_id,
        code: p.project_id,
        name: p.name,
        sector: p.type,
        state: "Madhya Pradesh",
        district: p.districts,
        tehsils: p.districts,
        status: p.current_stage,
        stage: p.current_stage,
        slaDeadline,
        isDelayed,
        totalParcels: p.total_parcels,
        startDate,
      },
    });
  }

  // 5. Litigation Cases map
  const litMap = new Map();
  console.log("Upserting litigation cases...");
  for (const lit of dataset.litigation_cases) {
    litMap.set(lit.parcel_id, lit);
    await prisma.litigationCase.upsert({
      where: { caseNumber: lit.case_number },
      update: {
        parcelId: lit.parcel_id,
        caseType: lit.case_type,
        court: lit.court,
        filedDate: lit.filed_date ? new Date(lit.filed_date + "T00:00:00.000Z") : null,
        status: lit.status,
      },
      create: {
        id: lit.case_number,
        caseNumber: lit.case_number,
        parcelId: lit.parcel_id,
        caseType: lit.case_type,
        court: lit.court,
        filedDate: lit.filed_date ? new Date(lit.filed_date + "T00:00:00.000Z") : null,
        status: lit.status,
      },
    });
  }

  // 6. Parcel Project Overlaps map
  const overlapMap = new Map();
  console.log("Upserting parcel project overlaps...");
  for (const ovl of dataset.parcel_project_overlaps) {
    overlapMap.set(ovl.parcel_id, ovl);
    await prisma.parcelProjectOverlap.upsert({
      where: { id: ovl.record_id },
      update: {
        parcelId: ovl.parcel_id,
        primaryProjectId: ovl.primary_project_id,
        overlappingProjectId: ovl.overlapping_project_id,
        note: ovl.note,
      },
      create: {
        id: ovl.record_id,
        parcelId: ovl.parcel_id,
        primaryProjectId: ovl.primary_project_id,
        overlappingProjectId: ovl.overlapping_project_id,
        note: ovl.note,
      },
    });
  }

  // 7. Parcels
  console.log("Upserting parcels...");
  for (const pcl of dataset.parcels) {
    const isLitigation = litMap.has(pcl.parcel_id);
    const lit = litMap.get(pcl.parcel_id);
    const isMultiProjectOverlap = overlapMap.has(pcl.parcel_id);
    const ovl = overlapMap.get(pcl.parcel_id);

    const geometryStr = typeof pcl.geometry_geojson === "string" 
      ? pcl.geometry_geojson 
      : JSON.stringify(pcl.geometry_geojson);

    await prisma.parcel.upsert({
      where: { ulpin: pcl.ulpin },
      update: {
        surveyNo: pcl.survey_number,
        villageId: pcl.village_id,
        villageName: pcl.village_name,
        district: pcl.district,
        tehsil: pcl.tehsil,
        areaHa: pcl.area_ha,
        landUse: pcl.land_use,
        status: pcl.status,
        geometry: geometryStr,
        centerLat: pcl.centroid_lat,
        centerLng: pcl.centroid_lon,
        ownerId: pcl.owner_id,
        projectId: pcl.project_id,
        projectName: pcl.project_name,
        isLitigation,
        litigationCaseNumber: lit ? lit.case_number : null,
        litigationCaseType: lit ? lit.case_type : null,
        litigationCourt: lit ? lit.court : null,
        litigationStatus: lit ? lit.status : null,
        isMultiProjectOverlap,
        overlappingProjectId: ovl ? ovl.overlapping_project_id : null,
        overlapNote: ovl ? ovl.note : null,
      },
      create: {
        id: pcl.parcel_id,
        ulpin: pcl.ulpin,
        surveyNo: pcl.survey_number,
        villageId: pcl.village_id,
        villageName: pcl.village_name,
        district: pcl.district,
        tehsil: pcl.tehsil,
        areaHa: pcl.area_ha,
        landUse: pcl.land_use,
        status: pcl.status,
        geometry: geometryStr,
        centerLat: pcl.centroid_lat,
        centerLng: pcl.centroid_lon,
        ownerId: pcl.owner_id,
        projectId: pcl.project_id,
        projectName: pcl.project_name,
        isLitigation,
        litigationCaseNumber: lit ? lit.case_number : null,
        litigationCaseType: lit ? lit.case_type : null,
        litigationCourt: lit ? lit.court : null,
        litigationStatus: lit ? lit.status : null,
        isMultiProjectOverlap,
        overlappingProjectId: ovl ? ovl.overlapping_project_id : null,
        overlapNote: ovl ? ovl.note : null,
      },
    });
  }

  // 8. Project Stage History
  console.log("Upserting project stage history...");
  for (const stg of dataset.project_stage_history) {
    await prisma.projectStageHistory.upsert({
      where: { id: stg.record_id },
      update: {
        projectId: stg.project_id,
        stage: stg.stage,
        startDate: new Date(stg.start_date + "T00:00:00.000Z"),
        endDate: stg.end_date ? new Date(stg.end_date + "T00:00:00.000Z") : null,
        status: stg.status,
        slaDays: stg.sla_days,
      },
      create: {
        id: stg.record_id,
        projectId: stg.project_id,
        stage: stg.stage,
        startDate: new Date(stg.start_date + "T00:00:00.000Z"),
        endDate: stg.end_date ? new Date(stg.end_date + "T00:00:00.000Z") : null,
        status: stg.status,
        slaDays: stg.sla_days,
      },
    });
  }

  // 9. Candidate Alignments
  console.log("Upserting candidate alignments...");
  for (const aln of dataset.candidate_alignments) {
    const geomStr = typeof aln.geometry_geojson === "string" 
      ? aln.geometry_geojson 
      : JSON.stringify(aln.geometry_geojson);

    await prisma.candidateAlignment.upsert({
      where: { alignmentId: aln.alignment_id },
      update: {
        projectId: aln.project_id,
        name: aln.label,
        label: aln.label,
        lineGeometry: geomStr,
      },
      create: {
        id: aln.alignment_id,
        alignmentId: aln.alignment_id,
        projectId: aln.project_id,
        name: aln.label,
        label: aln.label,
        lineGeometry: geomStr,
        bufferWidthMeters: 100,
        recommendationScore: 85,
        recommendationReasons: "Optimized corridor routing with minimal forest footprint",
      },
    });
  }

  // 10. R&R Families
  console.log("Upserting R&R families...");
  for (const rrf of dataset.rr_families) {
    await prisma.rrFamily.upsert({
      where: { familyId: rrf.family_id },
      update: {
        parcelId: rrf.parcel_id,
        ownerId: rrf.owner_id,
        projectId: rrf.project_id,
        membersCount: rrf.members_count,
        vulnerableScSt: rrf.vulnerable_sc_st,
        vulnerableWomenHeaded: rrf.vulnerable_women_headed,
        entitlementHouse: rrf.entitlement_house,
        entitlementEmployment: rrf.entitlement_employment,
        subsistenceAllowanceInr: rrf.subsistence_allowance_inr,
        rrStatus: rrf.rr_status,
      },
      create: {
        id: rrf.family_id,
        familyId: rrf.family_id,
        parcelId: rrf.parcel_id,
        ownerId: rrf.owner_id,
        projectId: rrf.project_id,
        membersCount: rrf.members_count,
        vulnerableScSt: rrf.vulnerable_sc_st,
        vulnerableWomenHeaded: rrf.vulnerable_women_headed,
        entitlementHouse: rrf.entitlement_house,
        entitlementEmployment: rrf.entitlement_employment,
        subsistenceAllowanceInr: rrf.subsistence_allowance_inr,
        rrStatus: rrf.rr_status,
      },
    });
  }

  // 11. Grievances
  console.log("Upserting grievances...");
  for (const grv of dataset.grievances) {
    await prisma.grievance.upsert({
      where: { trackingNo: grv.grievance_id },
      update: {
        parcelId: grv.parcel_id,
        ownerId: grv.owner_id,
        projectId: grv.project_id,
        category: grv.type,
        status: grv.status,
        filedAt: grv.filed_date ? new Date(grv.filed_date + "T00:00:00.000Z") : new Date(),
      },
      create: {
        id: grv.grievance_id,
        trackingNo: grv.grievance_id,
        parcelId: grv.parcel_id,
        ownerId: grv.owner_id,
        projectId: grv.project_id,
        category: grv.type,
        applicantName: "Landowner Applicant",
        applicantPhone: "98XXXXX000",
        description: `${grv.type} filed for Parcel ${grv.parcel_id}`,
        status: grv.status,
        filedAt: grv.filed_date ? new Date(grv.filed_date + "T00:00:00.000Z") : new Date(),
      },
    });
  }

  // 12. Documents
  console.log("Upserting documents...");
  for (const doc of dataset.documents) {
    await prisma.document.upsert({
      where: { documentId: doc.document_id },
      update: {
        parcelId: doc.parcel_id,
        projectId: doc.project_id,
        docType: doc.doc_type,
        filename: doc.filename,
        version: doc.version,
        sha256Hash: doc.sha256_hash,
        uploadedByRole: doc.uploaded_by_role,
        uploadedDate: doc.uploaded_date ? new Date(doc.uploaded_date + "T00:00:00.000Z") : new Date(),
      },
      create: {
        id: doc.document_id,
        documentId: doc.document_id,
        parcelId: doc.parcel_id,
        projectId: doc.project_id,
        docType: doc.doc_type,
        filename: doc.filename,
        version: doc.version,
        sha256Hash: doc.sha256_hash,
        uploadedByRole: doc.uploaded_by_role,
        uploadedDate: doc.uploaded_date ? new Date(doc.uploaded_date + "T00:00:00.000Z") : new Date(),
      },
    });
  }

  // 13. Users
  console.log("Upserting users...");
  const roleCodeMap = {
    "Central Ministry": "CENTRAL_MINISTRY",
    "State Government": "STATE_OFFICER",
    "District Collector / CALA": "DISTRICT_COLLECTOR",
    "Project Implementing Body": "REQUIRING_BODY",
    "Field Officer": "FIELD_OFFICER",
    "Landowner / Citizen": "LANDOWNER",
    "Admin": "ADMIN",
  };

  for (const u of dataset.users) {
    const roleCode = roleCodeMap[u.role] || "LANDOWNER";
    const name = u.email.split("@")[0].replace(/[._-]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

    await prisma.user.upsert({
      where: { email: u.email.toLowerCase().trim() },
      update: {
        password: u.password,
        role: roleCode,
        linkedId: u.linked_id,
        status: "ACTIVE",
      },
      create: {
        email: u.email.toLowerCase().trim(),
        name,
        password: u.password,
        role: roleCode,
        linkedId: u.linked_id,
        status: "ACTIVE",
        department: u.role,
        jurisdiction: u.linked_id || "National",
      },
    });
  }

  // Also maintain backward-compatible demo accounts
  const defaultAccounts = [
    { email: "central.ministry@lams.gov.in", name: "Dr. Arvind Subramanian", role: "CENTRAL_MINISTRY" },
    { email: "state.maharashtra@lams.gov.in", name: "Smt. Manisha Verma, IAS", role: "STATE_OFFICER" },
    { email: "collector.nashik@lams.gov.in", name: "Shri Jalaj Sharma, IAS", role: "DISTRICT_COLLECTOR" },
    { email: "nhai.projects@lams.gov.in", name: "Rajeev Agrawal", role: "REQUIRING_BODY" },
    { email: "field.sinnar@lams.gov.in", name: "Santosh Kulkarni", role: "FIELD_OFFICER" },
    { email: "ramesh.patil@lams.test", name: "Ramesh Tukaram Patil", role: "LANDOWNER" },
    { email: "admin@lams.gov.in", name: "Administrator", role: "ADMIN" },
  ];

  const defaultHash = bcrypt.hashSync("Demo@123", 10);
  for (const def of defaultAccounts) {
    await prisma.user.upsert({
      where: { email: def.email },
      update: {
        password: defaultHash,
        role: def.role,
      },
      create: {
        email: def.email,
        name: def.name,
        password: defaultHash,
        role: def.role,
        status: "ACTIVE",
      },
    });
  }

  console.log("Seeding completed successfully and idempotently!");
}

main()
  .catch((e) => {
    console.error("Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
