import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createAuditEntry } from "@/lib/audit";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userRole = (session?.user as any)?.role;

    if (!session || (userRole !== "LANDOWNER" && userRole !== "ADMIN")) {
      return NextResponse.json(
        {
          error: "Forbidden: Only Landowners/Citizens or Admin can file statutory objections under Section 15.",
          code: "FORBIDDEN_ROLE_ACCESS",
        },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { parcelUlpin, surveyNo, category, description } = body;

    const trackingNo = `GRV-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const grievance = await prisma.grievance.create({
      data: {
        id: trackingNo,
        trackingNo,
        parcelUlpin: parcelUlpin || "MH24-0891-4402",
        surveyNo: surveyNo || "104/2",
        applicantName: session.user?.name || "Citizen Applicant",
        applicantPhone: (session.user as any)?.phone || "+91 98221 42109",
        category: category || "COMPENSATION_AMOUNT",
        description: description || "Statutory objection filed under Section 15",
        status: "PENDING",
      },
    });

    await createAuditEntry({
      actorEmail: session.user?.email || "citizen@lams.test",
      actorRole: userRole,
      action: "GRIEVANCE_FILED",
      entityType: "GRIEVANCE",
      entityId: trackingNo,
      details: `Filed Section 15 objection '${category}' on Survey No ${surveyNo || '104/2'}`,
    });

    return NextResponse.json({
      success: true,
      trackingNo,
      grievance,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
