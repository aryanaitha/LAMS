import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userEmail = session.user.email?.toLowerCase().trim();
    const userRole = (session.user as any).role;

    // Only landowners / citizens access their own dossier
    if (userRole !== "LANDOWNER") {
      return NextResponse.json({ error: "Forbidden: Landowner role required" }, { status: 403 });
    }

    const user = await prisma.user.findUnique({
      where: { email: userEmail },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const linkedOwnerId = user.linkedId;

    if (!linkedOwnerId) {
      return NextResponse.json({
        claimed: false,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
        },
        owner: null,
        parcels: [],
        rrFamilies: [],
        grievances: [],
        documents: [],
      });
    }

    // Retrieve exact owner from database
    const owner = await prisma.owner.findUnique({
      where: { id: linkedOwnerId },
    });

    // Retrieve all parcels belonging to this exact owner
    const parcels = await prisma.parcel.findMany({
      where: { ownerId: linkedOwnerId },
    });

    const parcelIds = parcels.map((p) => p.id);
    const parcelUlpins = parcels.map((p) => p.ulpin);

    // Retrieve R&R families for this owner or their parcels
    const rrFamilies = await prisma.rrFamily.findMany({
      where: {
        OR: [
          { ownerId: linkedOwnerId },
          { parcelId: { in: parcelIds } },
        ],
      },
    });

    // Retrieve grievances filed by or for this owner
    const grievances = await prisma.grievance.findMany({
      where: {
        OR: [
          { ownerId: linkedOwnerId },
          { parcelId: { in: parcelIds } },
          { parcelUlpin: { in: parcelUlpins } },
        ],
      },
    });

    // Retrieve documents associated with this owner's parcels
    const documents = await prisma.document.findMany({
      where: {
        parcelId: { in: parcelIds },
      },
    });

    return NextResponse.json({
      claimed: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        linkedId: user.linkedId,
      },
      owner,
      parcels,
      rrFamilies,
      grievances,
      documents,
    });
  } catch (error: any) {
    console.error("Citizen data API error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
