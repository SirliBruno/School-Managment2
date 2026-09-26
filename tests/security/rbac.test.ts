import { describe, it, expect } from "vitest";
import {
  ROLE_PERMISSIONS,
  ROLE_DEFINITIONS,
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  hasRole,
  DEMO_ACCOUNTS,
} from "@/lib/auth/rbac";
import type { AuthUser } from "@/types/security";

describe("RBAC & Permissions System", () => {
  const viceUser = DEMO_ACCOUNTS.vice_principal.user;
  const principalUser = DEMO_ACCOUNTS.principal.user;
  const auditorUser = DEMO_ACCOUNTS.auditor.user;

  it("should have correct roles defined", () => {
    expect(ROLE_DEFINITIONS.vice_principal.title).toContain("وكيلة");
    expect(ROLE_DEFINITIONS.principal.title).toContain("مديرة");
    expect(ROLE_DEFINITIONS.auditor.title).toContain("مدققة");
  });

  it("should enforce distinct permissions between roles", () => {
    // Vice Principal has operational creation permissions
    expect(ROLE_PERMISSIONS.vice_principal).toContain("teachers.create");
    expect(ROLE_PERMISSIONS.vice_principal).toContain("absence.create");
    expect(ROLE_PERMISSIONS.vice_principal).toContain("deduction.create");
    // But cannot approve or view audit logs
    expect(ROLE_PERMISSIONS.vice_principal).not.toContain("absence.approve");
    expect(ROLE_PERMISSIONS.vice_principal).not.toContain("deduction.approve");
    expect(ROLE_PERMISSIONS.vice_principal).not.toContain("audit.view");

    // Principal has executive approval permissions and audit view
    expect(ROLE_PERMISSIONS.principal).toContain("absence.approve");
    expect(ROLE_PERMISSIONS.principal).toContain("deduction.approve");
    expect(ROLE_PERMISSIONS.principal).toContain("archive.manage");
    expect(ROLE_PERMISSIONS.principal).toContain("audit.view");

    // Auditor has read-only and audit view permissions
    expect(ROLE_PERMISSIONS.auditor).toContain("teachers.view");
    expect(ROLE_PERMISSIONS.auditor).toContain("audit.view");
    expect(ROLE_PERMISSIONS.auditor).not.toContain("teachers.create");
    expect(ROLE_PERMISSIONS.auditor).not.toContain("absence.create");
    expect(ROLE_PERMISSIONS.auditor).not.toContain("deduction.create");
  });

  it("should correctly check hasPermission", () => {
    expect(hasPermission(viceUser, "absence.create")).toBe(true);
    expect(hasPermission(viceUser, "absence.approve")).toBe(false);
    expect(hasPermission(principalUser, "absence.approve")).toBe(true);
    expect(hasPermission(auditorUser, "audit.view")).toBe(true);
    expect(hasPermission(null, "teachers.view")).toBe(false);
  });

  it("should correctly check hasAnyPermission", () => {
    expect(hasAnyPermission(viceUser, ["absence.approve", "absence.create"])).toBe(true);
    expect(hasAnyPermission(viceUser, ["absence.approve", "deduction.approve"])).toBe(false);
    expect(hasAnyPermission(null, ["teachers.view"])).toBe(false);
  });

  it("should correctly check hasAllPermissions", () => {
    expect(hasAllPermissions(principalUser, ["absence.create", "absence.approve"])).toBe(true);
    expect(hasAllPermissions(viceUser, ["absence.create", "absence.approve"])).toBe(false);
  });

  it("should correctly check hasRole", () => {
    expect(hasRole(viceUser, "vice_principal")).toBe(true);
    expect(hasRole(viceUser, ["principal", "auditor"])).toBe(false);
    expect(hasRole(principalUser, ["principal", "auditor"])).toBe(true);
    expect(hasRole(null, "principal")).toBe(false);
  });
});
