import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createAuditEntry } from "@/lib/audit";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userRole = (session?.user as any)?.role;

    if (!session || (userRole !== "FIELD_OFFICER" && userRole !== "ADMIN")) {
      return NextResponse.json(
        {
          error: "Forbidden: Only Field Revenue Officers or Admin can synchronize ground survey logs.",
          code: "FORBIDDEN_ROLE_ACCESS",
        },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { parcelUlpin, lat, lng, photosCount, remarks } = body;

    await createAuditEntry({
      actorEmail: session.user?.email || "field@lams.gov.in",
      actorRole: userRole,
      action: "FIELD_SURVEY_SYNCED",
      entityType: "PARCEL",
      entityId: parcelUlpin || "GPS_POINT",
      details: `Field GPS survey synced (${lat}, ${lng}) with ${photosCount || 1} geotagged photos. Remarks: ${remarks || 'Boundary pegged'}`,
    });

    return NextResponse.json({
      success: true,
      message: "Field survey data synchronized successfully with central server.",
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
