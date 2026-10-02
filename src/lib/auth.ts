import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 8 * 60 * 60, // 8 hours session timeout
  },
  providers: [
    CredentialsProvider({
      name: "Government Single Sign-On / Credentials",
      credentials: {
        email: { label: "Official Email / Mobile", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please enter both email and password.");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email.toLowerCase().trim() },
        });

        if (!user) {
          throw new Error("No registered account found with this email.");
        }

        if (user.status === "DISABLED") {
          throw new Error("This account has been disabled. Please contact the administrator.");
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
        if (!isPasswordValid) {
          throw new Error("Invalid credentials provided.");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          department: user.department || "",
          jurisdiction: user.jurisdiction || "",
          linkedId: user.linkedId || null,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        token.department = (user as any).department;
        token.jurisdiction = (user as any).jurisdiction;
        token.linkedId = (user as any).linkedId;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
        (session.user as any).department = token.department;
        (session.user as any).jurisdiction = token.jurisdiction;
        (session.user as any).linkedId = token.linkedId;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET || "lams-super-secure-production-ready-jwt-secret-2026",
};
