import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { canAccessRoute, getDefaultDashboardPath } from "@/lib/permissions";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1. Strictly define public paths (no internal data or dashboards before login)
  const isPublicRoute =
    pathname === "/" ||
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/unauthorized" ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/api/health") ||
    pathname.startsWith("/api/register");

  if (isPublicRoute) {
    return NextResponse.next();
  }

  // 2. Extract JWT token for all protected routes
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET || "lams-super-secure-production-ready-jwt-secret-2026",
  });

  const isApi = pathname.startsWith("/api/");

  if (!token) {
    if (isApi) {
      return NextResponse.json(
        { error: "Unauthorized: Authentication required", code: "UNAUTHORIZED" },
        { status: 401 }
      );
    }
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const role = (token as any).role as string;

  // 3. Strict Role-specific route boundaries driven by single source of truth (permissions.ts)
  const allowed = canAccessRoute(role, pathname);

  if (!allowed) {
    if (isApi) {
      return NextResponse.json(
        {
          error: `Forbidden: Role '${role}' is not authorized to access '${pathname}'.`,
          code: "FORBIDDEN_ROLE_ACCESS",
        },
        { status: 403 }
      );
    }
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico
     * - static files with extensions (e.g. .svg, .png, .jpg, .css, .js)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};
