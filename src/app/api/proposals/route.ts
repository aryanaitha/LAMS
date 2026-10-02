import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createAuditEntry } from "@/lib/audit";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userRole = (session?.user as any)?.role;

    // Strict server-side RBAC enforcement
    if (!session || (userRole !== "REQUIRING_BODY" && userRole !== "ADMIN")) {
      return NextResponse.json(
        {
          error: "Forbidden: Only Requiring Body or System Administrator can submit land acquisition proposals.",
          code: "FORBIDDEN_ROLE_ACCESS",
        },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { name, sector, state, district, tehsils, targetAreaHa, budgetCr } = body;

    if (!name || !sector || !targetAreaHa) {
      return NextResponse.json(
        { error: "Mandatory project parameters missing." },
        { status: 400 }
      );
    }

    const code = `NH-2026-${Math.floor(100 + Math.random() * 900)}`;

    const newProject = await prisma.project.create({
      data: {
        id: code,
        code,
        name,
        sector: sector || "HIGHWAY",
        state: state || "Maharashtra",
        district: district || "Nashik",
        tehsils: tehsils || "Sinnar",
        status: "PROPOSAL",
        stage: "Proposal Submitted for Rule 4 Scrutiny",
        slaDeadline: new Date(Date.now() + 15 * 86400000),
        budgetCr: Number(budgetCr) || 100.0,
        targetAreaHa: Number(targetAreaHa) || 50.0,
        requiringBody: session.user?.name || "NHAI Western Region",
      },
    });

    await createAuditEntry({
      actorEmail: session.user?.email || "unknown@lams.gov.in",
      actorRole: userRole,
      action: "PROPOSAL_CREATED",
      entityType: "PROJECT",
      entityId: newProject.id,
      details: `Created new project proposal '${name}' (${code}) with target area ${targetAreaHa} Ha`,
    });

    return NextResponse.json({
      success: true,
      project: newProject,
    });
  } catch (error: any) {
    console.error("Proposal error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to submit proposal" },
      { status: 500 }
    );
  }
}
