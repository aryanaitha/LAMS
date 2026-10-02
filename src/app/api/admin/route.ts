import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json(
      { error: "Unauthorized: Authentication required", code: "UNAUTHORIZED" },
      { status: 401 }
    );
  }

  const role = (session.user as any)?.role;

  if (role !== "ADMIN") {
    return NextResponse.json(
      {
        error: `Forbidden: Role '${role}' is not authorized to access Admin-only resources.`,
        code: "FORBIDDEN_ROLE_ACCESS",
      },
      { status: 403 }
    );
  }

  return NextResponse.json({
    status: "success",
    service: "LAMS National Administration API",
    systemStats: {
      activeUsers: 9,
      slaTimersActive: 14,
      auditLedgerBlocks: 42,
      databaseHealth: "HEALTHY",
      memoryUsage: "128MB",
      uptimeHours: 98.4,
    },
    message: "Admin management statistics retrieved successfully.",
  });
}
