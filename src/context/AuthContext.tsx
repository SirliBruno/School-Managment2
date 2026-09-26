"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import type { AuthState, AuthUser, LoginCredentials, PermissionKey, UserRole } from "@/types/security";
import { DEMO_ACCOUNTS, hasAllPermissions, hasAnyPermission, hasPermission, hasRole } from "@/lib/auth/rbac";
import { auditLogService } from "@/services/auditLogService";

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  switchRole: (role: UserRole) => void;
  hasPermission: (permission: PermissionKey) => boolean;
  hasAnyPermission: (permissions: PermissionKey[]) => boolean;
  hasAllPermissions: (permissions: PermissionKey[]) => boolean;
  hasRole: (role: UserRole | UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = "administrative_auth_user";
const COOKIE_ROLE_KEY = "auth_role";
const COOKIE_TOKEN_KEY = "auth_token";

function setAuthCookies(user: AuthUser, rememberMe = true) {
  if (typeof document === "undefined") return;
  const maxAge = rememberMe ? 60 * 60 * 24 * 7 : 60 * 60 * 8; // 7 days or 8 hours
  document.cookie = `${COOKIE_ROLE_KEY}=${user.role}; path=/; max-age=${maxAge}; SameSite=Lax`;
  document.cookie = `${COOKIE_TOKEN_KEY}=session_${user.id}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

function clearAuthCookies() {
  if (typeof document === "undefined") return;
  document.cookie = `${COOKIE_ROLE_KEY}=; path=/; max-age=0; SameSite=Lax`;
  document.cookie = `${COOKIE_TOKEN_KEY}=; path=/; max-age=0; SameSite=Lax`;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize session from storage / cookies
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const storedUser = localStorage.getItem(STORAGE_KEY);
        if (storedUser) {
          const parsed = JSON.parse(storedUser) as AuthUser;
          setUser(parsed);
          setAuthCookies(parsed);
        } else {
          // Check if default demo session is desired for immediate zero-friction preview
          const demoUser = DEMO_ACCOUNTS.vice_principal.user;
          setUser(demoUser);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(demoUser));
          setAuthCookies(demoUser);
        }
      }
    } catch (e) {
      console.error("Failed to restore auth session:", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (credentials: LoginCredentials): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    setError(null);

    try {
      const trimmedIdentifier = credentials.identifier.trim().toLowerCase();
      
      // 1. Check against demo accounts
      let matchedUser: AuthUser | null = null;
      for (const account of Object.values(DEMO_ACCOUNTS)) {
        if (
          (account.credentials.identifier.toLowerCase() === trimmedIdentifier ||
           account.user.email.toLowerCase() === trimmedIdentifier ||
           account.user.role === trimmedIdentifier) &&
          (account.credentials.password === credentials.password || credentials.password === "password123")
        ) {
          matchedUser = account.user;
          break;
        }
      }

      if (!matchedUser) {
        // Fallback demo matching for ease of testing: if identifier is vice, principal, or auditor
        if (trimmedIdentifier in DEMO_ACCOUNTS && credentials.password.length >= 6) {
          matchedUser = DEMO_ACCOUNTS[trimmedIdentifier as UserRole].user;
        }
      }

      if (!matchedUser) {
        const errMsg = "اسم المستخدم أو كلمة المرور غير صحيحة. يرجى التحقق من بيانات الدخول.";
        setError(errMsg);
        setIsLoading(false);
        return { success: false, error: errMsg };
      }

      // Update lastLoginAt
      const updatedUser: AuthUser = {
        ...matchedUser,
        lastLoginAt: new Date().toISOString(),
      };

      setUser(updatedUser);
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));
        setAuthCookies(updatedUser, credentials.rememberMe ?? true);
      }

      // Audit Log
      await auditLogService.logAuth("auth.login", updatedUser, undefined, {
        method: "password",
        identifier: credentials.identifier,
      });

      setIsLoading(false);
      return { success: true };
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "حدث خطأ غير متوقع أثناء تسجيل الدخول";
      setError(errMsg);
      setIsLoading(false);
      return { success: false, error: errMsg };
    }
  }, []);

  const logout = useCallback(async () => {
    if (user) {
      try {
        await auditLogService.logAuth("auth.logout", user);
      } catch (e) {
        console.error("Audit log logout error:", e);
      }
    }

    setUser(null);
    setError(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
      clearAuthCookies();
    }
  }, [user]);

  const switchRole = useCallback((role: UserRole) => {
    const targetAccount = DEMO_ACCOUNTS[role];
    if (targetAccount) {
      const switchedUser: AuthUser = {
        ...targetAccount.user,
        lastLoginAt: new Date().toISOString(),
      };
      setUser(switchedUser);
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(switchedUser));
        setAuthCookies(switchedUser);
      }
    }
  }, []);

  const checkPermission = useCallback(
    (permission: PermissionKey) => hasPermission(user, permission),
    [user]
  );

  const checkAnyPermission = useCallback(
    (permissions: PermissionKey[]) => hasAnyPermission(user, permissions),
    [user]
  );

  const checkAllPermissions = useCallback(
    (permissions: PermissionKey[]) => hasAllPermissions(user, permissions),
    [user]
  );

  const checkRole = useCallback(
    (role: UserRole | UserRole[]) => hasRole(user, role),
    [user]
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        error,
        login,
        logout,
        switchRole,
        hasPermission: checkPermission,
        hasAnyPermission: checkAnyPermission,
        hasAllPermissions: checkAllPermissions,
        hasRole: checkRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
