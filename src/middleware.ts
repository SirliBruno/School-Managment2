import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import type { UserRole } from "@/types/security";

// Routes that require authentication
const PROTECTED_PREFIXES = [
  "/dashboard",
  "/teachers",
  "/procedures",
  "/archive",
  "/settings",
  "/audit",
];

// Role-restricted routes
const ROLE_RESTRICTIONS: Record<string, UserRole[]> = {
  "/audit": ["principal", "auditor"],
  "/settings/security": ["principal"],
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Read auth session from cookies
  const authToken = request.cookies.get("auth_token")?.value;
  const userRole = request.cookies.get("auth_role")?.value as UserRole | undefined;

  const isAuthenticated = !!authToken;
  const isProtectedPath = PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix));
  const isLoginPage = pathname === "/login";

  // 1. If trying to access protected route while unauthenticated
  if (isProtectedPath && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("returnUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 2. If logged in and trying to access /login, redirect to /dashboard
  if (isLoginPage && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // 3. Check role restrictions for specific paths
  if (isAuthenticated && userRole) {
    for (const [routePrefix, allowedRoles] of Object.entries(ROLE_RESTRICTIONS)) {
      if (pathname.startsWith(routePrefix) && !allowedRoles.includes(userRole)) {
        const unauthorizedUrl = new URL("/unauthorized", request.url);
        unauthorizedUrl.searchParams.set("requiredRole", allowedRoles.join(","));
        unauthorizedUrl.searchParams.set("currentRole", userRole);
        return NextResponse.redirect(unauthorizedUrl);
      }
    }
  }

  // 4. Attach standard security headers
  const response = NextResponse.next();
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("X-XSS-Protection", "1; mode=block");

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt
     * - public folder files
     * - api routes (handled individually by apiGuard)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|api/).*)",
  ],
};
