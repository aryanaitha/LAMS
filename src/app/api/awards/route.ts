import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createAuditEntry } from "@/lib/audit";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userRole = (session?.user as any)?.role;

    if (!session || (userRole !== "DISTRICT_COLLECTOR" && userRole !== "ADMIN")) {
      return NextResponse.json(
        {
          error: "Forbidden: Only District Collector / CALA is authorized to pass Section 23/30 Statutory Awards.",
          code: "FORBIDDEN_ROLE_ACCESS",
        },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { parcelUlpin, awardedAmount, remarks } = body;

    const updatedParcel = await prisma.parcel.update({
      where: { ulpin: parcelUlpin },
      data: {
        status: "AWARDED",
        calculatedCompensation: Number(awardedAmount),
      },
    });

    await createAuditEntry({
      actorEmail: session.user?.email || "collector@lams.gov.in",
      actorRole: userRole,
      action: "AWARD_SANCTIONED",
      entityType: "PARCEL",
      entityId: parcelUlpin,
      details: `Sanctioned statutory award of ₹${awardedAmount} for ULPIN ${parcelUlpin}. Remarks: ${remarks || 'Approved'}`,
    });

    return NextResponse.json({
      success: true,
      parcel: updatedParcel,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
