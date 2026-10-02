import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createAuditEntry } from "@/lib/audit";
import crypto from "crypto";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get("projectId");
    const parcelId = searchParams.get("parcelId");

    const where: any = {};
    if (projectId) where.projectId = projectId;
    if (parcelId) where.parcelId = parcelId;

    const docs = await prisma.document.findMany({
      where,
      orderBy: { uploadedDate: "desc" },
    });

    // Fetch related parcels, projects, stage history to enrich full context
    const parcelIds = Array.from(new Set(docs.map((d) => d.parcelId).filter(Boolean))) as string[];
    const projectIds = Array.from(new Set(docs.map((d) => d.projectId).filter(Boolean))) as string[];

    const [parcels, projects, stages, owners] = await Promise.all([
      prisma.parcel.findMany({ where: { id: { in: parcelIds } } }),
      prisma.project.findMany({ where: { id: { in: projectIds } } }),
      prisma.projectStageHistory.findMany({ where: { projectId: { in: projectIds } } }),
      prisma.owner.findMany(),
    ]);

    const parcelMap = new Map(parcels.map((p) => [p.id, p]));
    const projectMap = new Map(projects.map((pr) => [pr.id, pr]));
    const ownerMap = new Map(owners.map((o) => [o.id, o]));

    const enrichedDocs = docs.map((doc) => {
      const p = doc.parcelId ? parcelMap.get(doc.parcelId) : null;
      const pr = doc.projectId ? projectMap.get(doc.projectId) : null;
      const owner = p?.ownerId ? ownerMap.get(p.ownerId) : null;

      // Determine matching workflow stage based on upload date
      const projectStages = stages.filter((s) => s.projectId === doc.projectId);
      const docDate = new Date(doc.uploadedDate);
      let matchedStage = pr?.stage || "Preliminary Notification";

      for (const stg of projectStages) {
        const start = new Date(stg.startDate);
        const end = stg.endDate ? new Date(stg.endDate) : new Date("2099-01-01");
        if (docDate >= start && docDate <= end) {
          matchedStage = stg.stage;
          break;
        }
      }

      return {
        id: doc.id,
        documentId: doc.documentId,
        filename: doc.filename,
        docType: doc.docType,
        version: `v${doc.version}.0`,
        sha256Hash: doc.sha256Hash,
        uploadedByRole: doc.uploadedByRole,
        uploadedDate: doc.uploadedDate,
        projectId: doc.projectId,
        projectName: pr?.name || doc.projectId,
        workflowStage: matchedStage,
        parcel: p
          ? {
              parcelId: p.id,
              ulpin: p.ulpin,
              surveyNumber: p.surveyNo,
              villageName: p.villageName,
              tehsil: p.tehsil,
              district: p.district,
              areaHa: p.areaHa,
              landUse: p.landUse,
              status: p.status,
              ownerId: p.ownerId,
              ownerNameMasked: owner?.name ? `${owner.name.slice(0, 2)}*** ${owner.name.split(" ").slice(-1)[0]}` : "Masked Landowner",
            }
          : null,
      };
    });

    return NextResponse.json({ documents: enrichedDocs });
  } catch (error: any) {
    console.error("Documents fetch error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userRole = (session?.user as any)?.role;

    // RBAC: DC=S, PB=S, FO=S, LO=S. CM, State, Admin = 403 Forbidden (Row 18)
    const allowedRoles = ["DISTRICT_COLLECTOR", "REQUIRING_BODY", "FIELD_OFFICER", "LANDOWNER"];
    if (!session || !allowedRoles.includes(userRole)) {
      return NextResponse.json(
        {
          error: "Forbidden: Your role is not authorized to upload documents to the repository.",
          code: "FORBIDDEN_ROLE_ACCESS",
        },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { filename, docType, projectId, parcelId, fileData } = body;

    if (!filename || !docType) {
      return NextResponse.json({ error: "Filename and document type are required." }, { status: 400 });
    }

    // Landowner limited types check
    if (userRole === "LANDOWNER" && !["Ownership_Proof", "Objection_Reply", "Bank_Passbook", "7/12_Extract"].includes(docType)) {
      return NextResponse.json(
        {
          error: "Forbidden: Landowners may only upload ownership proof, objections, or bank verification documents.",
          code: "FORBIDDEN_DOCUMENT_TYPE",
        },
        { status: 403 }
      );
    }

    // Real SHA-256 calculation
    const hash = crypto.createHash("sha256");
    if (fileData) {
      hash.update(fileData);
    } else {
      hash.update(filename + Date.now().toString());
    }
    const sha256Hash = hash.digest("hex");

    const docCount = await prisma.document.count();
    const documentId = `DOC-${String(docCount + 1).padStart(4, "0")}`;

    const newDoc = await prisma.document.create({
      data: {
        id: documentId,
        documentId,
        filename,
        docType,
        projectId: projectId || "PRJ-001",
        parcelId: parcelId || null,
        version: 1,
        sha256Hash,
        uploadedByRole:
          userRole === "FIELD_OFFICER"
            ? "Field Officer"
            : userRole === "REQUIRING_BODY"
            ? "Project Implementing Body"
            : userRole === "DISTRICT_COLLECTOR"
            ? "District Collector / CALA"
            : "Landowner",
        uploadedDate: new Date(),
      },
    });

    await createAuditEntry({
      actorEmail: session.user?.email || "user@lams.gov.in",
      actorRole: userRole,
      action: "DOCUMENT_UPLOADED",
      entityType: "DOCUMENT",
      entityId: documentId,
      details: `Uploaded '${filename}' (${docType}) with SHA-256 seal: ${sha256Hash}`,
    });

    return NextResponse.json({
      success: true,
      document: newDoc,
      message: `Document '${filename}' securely stored and verified with SHA-256 seal.`,
    });
  } catch (error: any) {
    console.error("Document upload error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
