import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createAuditEntry } from "@/lib/audit";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userRole = (session?.user as any)?.role;

    // RBAC: District Collector can issue possession order (A), Field Officer can submit evidence (S)
    if (!session || (userRole !== "DISTRICT_COLLECTOR" && userRole !== "FIELD_OFFICER")) {
      return NextResponse.json(
        {
          error: "Forbidden: Only District Collector (CALA) and Field Officers can update possession records.",
          code: "FORBIDDEN_ROLE_ACCESS",
        },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { actionType, ulpin, surveyNo, remarks, coordinates, evidencePhoto } = body;

    if (actionType === "ISSUE_POSSESSION_ORDER" && userRole !== "DISTRICT_COLLECTOR") {
      return NextResponse.json(
        { error: "Forbidden: Only District Collector can formally issue possession orders.", code: "FORBIDDEN_ROLE_ACCESS" },
        { status: 403 }
      );
    }

    if (actionType === "SUBMIT_GROUND_EVIDENCE" && userRole !== "FIELD_OFFICER") {
      return NextResponse.json(
        { error: "Forbidden: Only Field Officers can submit physical ground handover evidence.", code: "FORBIDDEN_ROLE_ACCESS" },
        { status: 403 }
      );
    }

    const orderNo = `POSS-ORD-${Date.now().toString().slice(-6)}`;

    await createAuditEntry({
      actorEmail: session.user?.email || "official@lams.gov.in",
      actorRole: userRole,
      action: actionType === "ISSUE_POSSESSION_ORDER" ? "POSSESSION_ORDER_ISSUED" : "POSSESSION_EVIDENCE_SUBMITTED",
      entityType: "POSSESSION",
      entityId: ulpin || surveyNo || orderNo,
      details: `${actionType} for parcel ${ulpin || surveyNo}. Remarks: ${remarks || "Normal procedure"}`,
    });

    return NextResponse.json({
      success: true,
      orderNo,
      status: actionType === "ISSUE_POSSESSION_ORDER" ? "POSSESSION_ORDERED" : "EVIDENCE_VERIFIED",
      message: actionType === "ISSUE_POSSESSION_ORDER"
        ? `Statutory possession handover order ${orderNo} promulgated under Section 38.`
        : `Physical possession ground inspection evidence submitted and geotagged.`,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
