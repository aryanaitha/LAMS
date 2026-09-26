import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Check DB connectivity
    const userCount = await prisma.user.count();
    const projectCount = await prisma.project.count();
    const parcelCount = await prisma.parcel.count();

    return NextResponse.json({
      status: "healthy",
      service: "LAMS National Platform",
      timestamp: new Date().toISOString(),
      database: "connected",
      counts: {
        users: userCount,
        projects: projectCount,
        parcels: parcelCount,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        status: "degraded",
        service: "LAMS National Platform",
        timestamp: new Date().toISOString(),
        database: "error",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
