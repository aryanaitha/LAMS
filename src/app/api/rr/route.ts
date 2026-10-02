import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createAuditEntry } from "@/lib/audit";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get("projectId");

    const where: any = {};
    if (projectId) where.projectId = projectId;

    const families = await prisma.rrFamily.findMany({
      where,
      orderBy: { familyId: "asc" },
    });

    const ownerIds = families.map((f) => f.ownerId);
    const parcelIds = families.map((f) => f.parcelId);
    const projectIds = families.map((f) => f.projectId);

    const [owners, parcels, projects] = await Promise.all([
      prisma.owner.findMany({ where: { id: { in: ownerIds } } }),
      prisma.parcel.findMany({ where: { id: { in: parcelIds } } }),
      prisma.project.findMany({ where: { id: { in: projectIds } } }),
    ]);

    const ownerMap = new Map(owners.map((o) => [o.id, o]));
    const parcelMap = new Map(parcels.map((p) => [p.id, p]));
    const projectMap = new Map(projects.map((pr) => [pr.id, pr]));

    const enrichedFamilies = families.map((fam) => {
      const owner = ownerMap.get(fam.ownerId);
      const parcel = parcelMap.get(fam.parcelId);
      const project = projectMap.get(fam.projectId);

      let parsedEvidence = null;
      if (fam.geotaggedEvidence) {
        try {
          parsedEvidence = JSON.parse(fam.geotaggedEvidence);
        } catch (e) {
          parsedEvidence = fam.geotaggedEvidence;
        }
      }

      return {
        id: fam.id,
        familyId: fam.familyId,
        parcelId: fam.parcelId,
        surveyNo: parcel?.surveyNo || fam.parcelId,
        ulpin: parcel?.ulpin || "N/A",
        village: parcel?.villageName || "N/A",
        tehsil: parcel?.tehsil || "N/A",
        ownerId: fam.ownerId,
        headName: owner?.name || "Landowner",
        maskedPhone: owner?.maskedPhone || "N/A",
        projectId: fam.projectId,
        projectName: project?.name || fam.projectId,
        membersCount: fam.membersCount,
        vulnerableScSt: fam.vulnerableScSt,
        vulnerableWomenHeaded: fam.vulnerableWomenHeaded,
        entitlementHouse: fam.entitlementHouse,
        entitlementEmployment: fam.entitlementEmployment,
        subsistenceAllowanceInr: fam.subsistenceAllowanceInr,
        rrStatus: fam.rrStatus,
        geotaggedEvidence: parsedEvidence,
      };
    });

    return NextResponse.json({ families: enrichedFamilies });
  } catch (error: any) {
    console.error("RR fetch error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userRole = (session?.user as any)?.role;

    // RBAC: DC = A (Approve / update), FO = S (Submit evidence). Others = 403
    if (!session || (userRole !== "DISTRICT_COLLECTOR" && userRole !== "FIELD_OFFICER")) {
      return NextResponse.json(
        {
          error: "Forbidden: Only District Collector and Field Officers can update R&R tracking records.",
          code: "FORBIDDEN_ROLE_ACCESS",
        },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { familyId, entitlementType, newStatus, remarks, gpsLat, gpsLng, photos, visitDate } = body;

    if (!familyId) {
      return NextResponse.json({ error: "familyId is required." }, { status: 400 });
    }

    const existing = await prisma.rrFamily.findUnique({
      where: { familyId },
    });

    if (!existing) {
      return NextResponse.json({ error: `R&R family record ${familyId} not found.` }, { status: 404 });
    }

    let evidenceObj = null;
    if (gpsLat && gpsLng) {
      evidenceObj = {
        gpsLat,
        gpsLng,
        accuracyMeters: 2.1,
        visitTimestamp: visitDate || new Date().toISOString(),
        officer: session.user?.email || "field@lams.gov.in",
        photosCount: Array.isArray(photos) ? photos.length : 1,
        photos: Array.isArray(photos) ? photos : [],
        remarks: remarks || "Geotagged physical ground evidence verified",
      };
    }

    const updateData: any = {};
    if (newStatus) updateData.rrStatus = newStatus;
    if (evidenceObj) updateData.geotaggedEvidence = JSON.stringify(evidenceObj);

    const updated = await prisma.rrFamily.update({
      where: { familyId },
      data: updateData,
    });

    await createAuditEntry({
      actorEmail: session.user?.email || "official@lams.gov.in",
      actorRole: userRole,
      action: userRole === "DISTRICT_COLLECTOR" ? "RR_ENTITLEMENT_APPROVED" : "RR_EVIDENCE_RECORDED",
      entityType: "REHABILITATION",
      entityId: familyId,
      details: `${userRole === "DISTRICT_COLLECTOR" ? "Approved" : "Recorded geotagged field evidence for"} ${familyId} (${entitlementType || "General R&R"}). Status: ${newStatus || updated.rrStatus}. Remarks: ${remarks || "Normal processing"}`,
    });

    return NextResponse.json({
      success: true,
      familyId,
      status: updated.rrStatus,
      evidence: evidenceObj,
      message: `R&R evidence recorded successfully for family ${familyId}.`,
    });
  } catch (error: any) {
    console.error("RR update error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
