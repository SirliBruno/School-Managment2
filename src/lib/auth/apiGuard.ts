import { NextRequest, NextResponse } from "next/server";
import type { AuthUser, PermissionKey, UserRole } from "@/types/security";
import { DEMO_ACCOUNTS, hasPermission, hasRole } from "./rbac";

export interface GuardOptions {
  requiredRole?: UserRole | UserRole[];
  requiredPermission?: PermissionKey;
}

export type AuthenticatedRouteHandler = (
  req: NextRequest,
  context: { params?: Record<string, string | string[]> },
  authUser: AuthUser
) => Promise<NextResponse | Response> | NextResponse | Response;

/**
 * Resolves current user from request cookies or Authorization header
 */
export function getAuthenticatedUserFromRequest(req: NextRequest): AuthUser | null {
  const authRole = req.cookies.get("auth_role")?.value as UserRole | undefined;
  const authToken = req.cookies.get("auth_token")?.value;

  // Also support Authorization header
  const authHeader = req.headers.get("authorization");
  let bearerRole: UserRole | undefined;
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.replace("Bearer ", "");
    if (token in DEMO_ACCOUNTS) {
      bearerRole = token as UserRole;
    }
  }

  const role = authRole || bearerRole;
  if (!role || (!authToken && !bearerRole)) {
    return null;
  }

  const demoUser = DEMO_ACCOUNTS[role]?.user;
  return demoUser || null;
}

/**
 * API route wrapper enforcing authentication and role/permission checks
 */
export function withAuth(
  handler: AuthenticatedRouteHandler,
  options?: GuardOptions
) {
  return async (
    req: NextRequest,
    context: { params?: Record<string, string | string[]> } = {}
  ): Promise<NextResponse | Response> => {
    const user = getAuthenticatedUserFromRequest(req);

    if (!user) {
      return NextResponse.json(
        {
          error: "جلسة العمل غير صالحة أو منتهية. يرجى تسجيل الدخول.",
          code: "UNAUTHORIZED",
        },
        { status: 401 }
      );
    }

    if (options?.requiredRole && !hasRole(user, options.requiredRole)) {
      return NextResponse.json(
        {
          error: "ليس لديك الرتبة الإدارية المطلوبة للوصول إلى هذه الواجهة.",
          code: "FORBIDDEN_ROLE",
          requiredRole: options.requiredRole,
          currentRole: user.role,
        },
        { status: 403 }
      );
    }

    if (options?.requiredPermission && !hasPermission(user, options.requiredPermission)) {
      return NextResponse.json(
        {
          error: "ليس لديك الصلاحية الإدارية الكافية لتنفيذ هذا الإجراء.",
          code: "FORBIDDEN_PERMISSION",
          requiredPermission: options.requiredPermission,
        },
        { status: 403 }
      );
    }

    return handler(req, context, user);
  };
}
