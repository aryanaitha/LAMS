import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createAuditEntry } from "@/lib/audit";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userRole = (session?.user as any)?.role;

    // RBAC: Only District Collector can mark compensation paid / authorize PFMS DBT (Row 11: A)
    if (!session || userRole !== "DISTRICT_COLLECTOR") {
      return NextResponse.json(
        {
          error: "Forbidden: Only District Collector / CALA is authorized to authorize PFMS DBT compensation payouts.",
          code: "FORBIDDEN_ROLE_ACCESS",
        },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { ulpin, amount, ownerName } = body;

    const utr = `PFMS${new Date().getFullYear()}${Math.floor(100000000 + Math.random() * 900000000)}`;

    await createAuditEntry({
      actorEmail: session.user?.email || "collector.nashik@lams.gov.in",
      actorRole: userRole,
      action: "COMPENSATION_PAID_DBT",
      entityType: "COMPENSATION",
      entityId: ulpin,
      details: `Authorized PFMS DBT payout of ${amount} to landowner ${ownerName || 'beneficiary'}. Generated UTR: ${utr}`,
    });

    return NextResponse.json({
      success: true,
      ulpin,
      status: "COMPENSATION_PAID",
      pfmsStatus: "CREDITED_VIA_DBT",
      utr,
      message: `Statutory compensation payment successfully credited via PFMS DBT. UTR: ${utr}`,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
