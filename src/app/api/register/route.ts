import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { createAuditEntry } from "@/lib/audit";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, password, otp, captchaAnswer, captchaToken } = body;

    // 1. Mandatory fields
    if (!name || !email || !phone || !password) {
      return NextResponse.json(
        { error: "All profile fields are mandatory." },
        { status: 400 }
      );
    }

    // 2. Validate Mock OTP
    if (otp !== "123456") {
      return NextResponse.json(
        { error: "Invalid OTP. For demonstration, please enter 123456." },
        { status: 400 }
      );
    }

    // 3. Simple Captcha validation
    if (!captchaAnswer || parseInt(captchaAnswer, 10) !== parseInt(captchaToken, 10)) {
      return NextResponse.json(
        { error: "Security captcha answer is incorrect." },
        { status: 400 }
      );
    }

    // 4. Check existing user
    const existing = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (existing) {
      return NextResponse.json(
        { error: "An account with this email address already exists." },
        { status: 409 }
      );
    }

    // 5. Hash password and create citizen user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase().trim(),
        phone,
        password: hashedPassword,
        role: "LANDOWNER",
        status: "ACTIVE",
        department: "Citizen / Landowner",
        jurisdiction: "Self-Registered",
      },
    });

    // 6. Audit Trail record
    await createAuditEntry({
      actorEmail: newUser.email,
      actorRole: "LANDOWNER",
      action: "CITIZEN_SELF_REGISTERED",
      entityType: "USER",
      entityId: newUser.id,
      details: `New citizen user ${name} registered with phone ${phone}`,
    });

    return NextResponse.json({
      success: true,
      message: "Account created successfully. You can now login.",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to complete registration." },
      { status: 500 }
    );
  }
}
