import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

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

  // 2. Extract JWT token for all protected routes (e.g. /gis, /dashboard, /calculator, /admin, /reports, etc.)
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

  // 3. Strict Role-specific route boundaries based on PS scope
  const roleRestrictions: Record<string, string[]> = {
    "/dashboard/central": ["CENTRAL_MINISTRY"],
    "/dashboard/state": ["STATE_OFFICER", "CENTRAL_MINISTRY"],
    "/dashboard/collector": ["DISTRICT_COLLECTOR"],
    "/dashboard/requiring-body": ["REQUIRING_BODY"],
    "/dashboard/field": ["FIELD_OFFICER"],
    "/dashboard/citizen": ["LANDOWNER"],
    "/admin": ["ADMIN"],
    "/api/admin": ["ADMIN"],
    "/reports": ["CENTRAL_MINISTRY", "STATE_OFFICER", "DISTRICT_COLLECTOR", "REQUIRING_BODY", "ADMIN"],
    "/api/proposals": ["REQUIRING_BODY"],
    "/api/awards": ["DISTRICT_COLLECTOR"],
    "/api/field-surveys": ["FIELD_OFFICER"],
    "/api/grievances": ["LANDOWNER", "DISTRICT_COLLECTOR"],
  };

  for (const [routePrefix, allowedRoles] of Object.entries(roleRestrictions)) {
    if (pathname.startsWith(routePrefix)) {
      if (!allowedRoles.includes(role)) {
        if (isApi) {
          return NextResponse.json(
            {
              error: `Forbidden: Role '${role}' is not authorized to access this resource.`,
              code: "FORBIDDEN_ROLE_ACCESS",
              requiredRoles: allowedRoles,
            },
            { status: 403 }
          );
        }
        return NextResponse.redirect(new URL("/unauthorized", req.url));
      }
    }
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
