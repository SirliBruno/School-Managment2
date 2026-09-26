import type { AuthUser, PermissionKey, UserRole } from "@/types/security";

/**
 * Role Definitions and Arabic Metadata
 */
export const ROLE_DEFINITIONS: Record<
  UserRole,
  {
    role: UserRole;
    title: string;
    description: string;
    badgeVariant: "default" | "success" | "warning" | "info";
  }
> = {
  vice_principal: {
    role: "vice_principal",
    title: "وكيلة المدرسة للشؤون التعليمية والمدرسية",
    description: "تسجيل الغياب والتأخر اليومي، إصدار إشعارات المساءلة ورفع التوصيات الإدارية.",
    badgeVariant: "info",
  },
  principal: {
    role: "principal",
    title: "مديرة المدرسة",
    description: "الاعتماد النهائي لمساءلات الغياب وقرارات الحسم وإدارة الصلاحيات والأرشيف.",
    badgeVariant: "success",
  },
  auditor: {
    role: "auditor",
    title: "مدققة المتابعة الإدارية ونظام التدقيق",
    description: "الاطلاع الشامل على السجلات وسجل التدقيق الأمني (Audit Log) دون صلاحيات تعديل.",
    badgeVariant: "warning",
  },
};

/**
 * Granular Role-to-Permissions Mapping
 */
export const ROLE_PERMISSIONS: Record<UserRole, PermissionKey[]> = {
  vice_principal: [
    "teachers.view",
    "teachers.create",
    "teachers.update",
    "absence.create",
    "absence.review",
    "delay_notice.create",
    "deduction.create",
  ],
  principal: [
    "teachers.view",
    "teachers.create",
    "teachers.update",
    "teachers.archive",
    "absence.create",
    "absence.review",
    "absence.approve",
    "delay_notice.create",
    "deduction.create",
    "deduction.approve",
    "archive.manage",
    "audit.view",
  ],
  auditor: [
    "teachers.view",
    "absence.review",
    "audit.view",
  ],
};

/**
 * Permission Arabic Titles and Groupings
 */
export const PERMISSION_DESCRIPTIONS: Record<PermissionKey, { title: string; category: string }> = {
  "teachers.view": { title: "عرض سجلات وبيانات المعلمات", category: "المعلمات" },
  "teachers.create": { title: "إضافة معلمات جديدات", category: "المعلمات" },
  "teachers.update": { title: "تعديل وتحديث بيانات المعلمات", category: "المعلمات" },
  "teachers.archive": { title: "أرشفة أو إلغاء تنشيط معلمة", category: "المعلمات" },
  "absence.create": { title: "تسجيل حالات الغياب اليومي", category: "الغياب" },
  "absence.review": { title: "مراجعة كشوفات الغياب", category: "الغياب" },
  "absence.approve": { title: "اعتماد مبررات الغياب والمساءلات", category: "الغياب" },
  "delay_notice.create": { title: "إصدار وحساب إشعارات التأخر", category: "التأخر" },
  "deduction.create": { title: "إعداد مسودة قرارات الحسم المالي", category: "الحسم" },
  "deduction.approve": { title: "الاعتماد النهائي لقرارات الحسم والرفع", category: "الحسم" },
  "archive.manage": { title: "إدارة واسترجاع السجلات المؤرشفة", category: "الأرشيف" },
  "audit.view": { title: "الاطلاع على سجل العمليات والتدقيق الأمني", category: "الأمان" },
};

/**
 * RBAC Helper Functions
 */

export function getRolePermissions(role: UserRole): PermissionKey[] {
  return ROLE_PERMISSIONS[role] || [];
}

export function hasPermission(user: AuthUser | null | undefined, permission: PermissionKey): boolean {
  if (!user) return false;
  return user.permissions.includes(permission);
}

export function hasAnyPermission(user: AuthUser | null | undefined, permissions: PermissionKey[]): boolean {
  if (!user || permissions.length === 0) return false;
  return permissions.some((perm) => user.permissions.includes(perm));
}

export function hasAllPermissions(user: AuthUser | null | undefined, permissions: PermissionKey[]): boolean {
  if (!user) return false;
  return permissions.every((perm) => user.permissions.includes(perm));
}

export function hasRole(user: AuthUser | null | undefined, roles: UserRole | UserRole[]): boolean {
  if (!user) return false;
  const roleArray = Array.isArray(roles) ? roles : [roles];
  return roleArray.includes(user.role);
}

/**
 * Demo Users / Standard Mock Accounts for Rapid Administrative Testing
 */
export const DEMO_ACCOUNTS: Record<
  UserRole,
  {
    credentials: { identifier: string; password: string };
    user: AuthUser;
  }
> = {
  vice_principal: {
    credentials: {
      identifier: "vice@school.edu.sa",
      password: "password123",
    },
    user: {
      id: "usr_vice_01",
      email: "vice@school.edu.sa",
      fullName: "أ. حصة بنت عبدالعزيز السديري",
      role: "vice_principal",
      roleTitle: ROLE_DEFINITIONS.vice_principal.title,
      schoolName: "الثانوية العشرون بالرياض",
      permissions: ROLE_PERMISSIONS.vice_principal,
      avatarUrl: undefined,
      lastLoginAt: new Date().toISOString(),
    },
  },
  principal: {
    credentials: {
      identifier: "principal@school.edu.sa",
      password: "password123",
    },
    user: {
      id: "usr_principal_01",
      email: "principal@school.edu.sa",
      fullName: "أ. نورة بنت محمد القحطاني",
      role: "principal",
      roleTitle: ROLE_DEFINITIONS.principal.title,
      schoolName: "الثانوية العشرون بالرياض",
      permissions: ROLE_PERMISSIONS.principal,
      avatarUrl: undefined,
      lastLoginAt: new Date().toISOString(),
    },
  },
  auditor: {
    credentials: {
      identifier: "auditor@school.edu.sa",
      password: "password123",
    },
    user: {
      id: "usr_auditor_01",
      email: "auditor@school.edu.sa",
      fullName: "أ. سارة بنت خالد الشمري",
      role: "auditor",
      roleTitle: ROLE_DEFINITIONS.auditor.title,
      schoolName: "مكتب الإشراف والتدقيق الإداري",
      permissions: ROLE_PERMISSIONS.auditor,
      avatarUrl: undefined,
      lastLoginAt: new Date().toISOString(),
    },
  },
};
