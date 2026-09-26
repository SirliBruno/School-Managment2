/**
 * Authentication, Roles, Permissions, and Security Types
 */

export type UserRole = "vice_principal" | "principal" | "auditor";

export type PermissionKey =
  | "teachers.view"
  | "teachers.create"
  | "teachers.update"
  | "teachers.archive"
  | "absence.create"
  | "absence.review"
  | "absence.approve"
  | "delay_notice.create"
  | "deduction.create"
  | "deduction.approve"
  | "archive.manage"
  | "audit.view";

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  roleTitle: string;
  schoolName: string;
  permissions: PermissionKey[];
  avatarUrl?: string;
  lastLoginAt?: string;
}

export type AuditAction =
  | "auth.login"
  | "auth.logout"
  | "record.create"
  | "record.update"
  | "record.delete"
  | "record.archive"
  | "record.restore"
  | "inquiry.approve"
  | "inquiry.reject"
  | "decision.issue";

export interface AuditLogEntry {
  id: string;
  userId: string;
  userName?: string;
  userRole?: UserRole;
  action: AuditAction;
  entity: "teacher" | "absence" | "delay" | "inquiry" | "deduction" | "auth" | "system";
  entityId?: string;
  timestamp: string;
  ipAddress?: string;
  metadata?: Record<string, unknown>;
}

export interface LoginCredentials {
  identifier: string; // username or email
  password: string;
  rememberMe?: boolean;
}

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
