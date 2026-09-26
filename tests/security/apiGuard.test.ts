import { describe, it, expect } from "vitest";
import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/auth/apiGuard";

describe("API Security Guard (withAuth)", () => {
  it("should return 401 when request has no authentication", async () => {
    const handler = withAuth(async () => {
      return NextResponse.json({ ok: true }, { status: 200 });
    });

    const req = new NextRequest("http://localhost:3000/api/records");
    const response = await handler(req, {});
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.code).toBe("UNAUTHORIZED");
  });

  it("should return 403 when user lacks required role", async () => {
    const handler = withAuth(
      async () => {
        return NextResponse.json({ ok: true }, { status: 200 });
      },
      { requiredRole: "principal" }
    );

    const req = new NextRequest("http://localhost:3000/api/decisions", {
      headers: {
        authorization: "Bearer vice_principal",
        cookie: "auth_token=tok123; auth_role=vice_principal",
      },
    });

    const response = await handler(req, {});
    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data.code).toBe("FORBIDDEN_ROLE");
  });

  it("should allow request when user has authorized role and pass authUser", async () => {
    let capturedUser: any = null;
    const handler = withAuth(
      async (req, ctx, user) => {
        capturedUser = user;
        return NextResponse.json({ ok: true }, { status: 200 });
      },
      { requiredRole: ["principal", "vice_principal"] }
    );

    const req = new NextRequest("http://localhost:3000/api/teachers", {
      headers: {
        authorization: "Bearer vice_principal",
        cookie: "auth_token=tok123; auth_role=vice_principal",
      },
    });

    const response = await handler(req, {});
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.ok).toBe(true);
    expect(capturedUser).not.toBeNull();
    expect(capturedUser.role).toBe("vice_principal");
  });
});
