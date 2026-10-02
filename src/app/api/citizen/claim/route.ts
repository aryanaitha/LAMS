import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createAuditEntry } from "@/lib/audit";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userEmail = session.user.email?.toLowerCase().trim();
    const userRole = (session.user as any).role;

    if (userRole !== "LANDOWNER") {
      return NextResponse.json({ error: "Forbidden: Landowner role required" }, { status: 403 });
    }

    const body = await req.json();
    const query = (body.query || "").trim();

    if (!query) {
      return NextResponse.json({ error: "Search query cannot be empty" }, { status: 400 });
    }

    // Search by survey_number, ULPIN, or Application / Parcel ID
    const matchingParcels = await prisma.parcel.findMany({
      where: {
        OR: [
          { ulpin: { equals: query } },
          { ulpin: { equals: query.toUpperCase() } },
          { surveyNo: { equals: query } },
          { id: { equals: query } },
          { id: { equals: query.toUpperCase() } },
        ],
      },
    });

    if (matchingParcels.length === 0) {
      return NextResponse.json({
        found: false,
        message: "No matching record found in the state acquisition dataset.",
      });
    }

    const matchedParcel = matchingParcels[0];
    const ownerId = matchedParcel.ownerId;

    if (!ownerId) {
      return NextResponse.json({
        found: false,
        message: "Parcel found but has no registered owner identifier to link.",
      });
    }

    const owner = await prisma.owner.findUnique({
      where: { id: ownerId },
    });

    // If request has confirmLink = true, persist link in user record
    if (body.confirmLink) {
      const updatedUser = await prisma.user.update({
        where: { email: userEmail },
        data: {
          linkedId: ownerId,
          name: owner ? owner.name : session.user.name || "Landowner",
          jurisdiction: `${matchedParcel.villageName}, ${matchedParcel.tehsil}`,
        },
      });

      await createAuditEntry({
        actorEmail: userEmail || "",
        actorRole: "LANDOWNER",
        action: "LANDOWNER_CLAIM_LINKED",
        entityType: "OWNER",
        entityId: ownerId,
        details: `Citizen ${userEmail} successfully linked account to Owner ${ownerId} via ULPIN/Survey ${query}`,
      });

      return NextResponse.json({
        found: true,
        linked: true,
        owner,
        parcel: matchedParcel,
        user: {
          id: updatedUser.id,
          name: updatedUser.name,
          email: updatedUser.email,
          linkedId: updatedUser.linkedId,
        },
      });
    }

    return NextResponse.json({
      found: true,
      linked: false,
      owner,
      parcel: matchedParcel,
      message: `Matching record found: Owner ${owner?.name || ownerId}, Survey ${matchedParcel.surveyNo}, Village ${matchedParcel.villageName}.`,
    });
  } catch (error: any) {
    console.error("Citizen claim API error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
