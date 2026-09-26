"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ShieldAlert, ArrowRight, UserCheck, RefreshCw } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { ROLE_DEFINITIONS } from "@/lib/auth/rbac";
import type { UserRole } from "@/types/security";

function UnauthorizedContent() {
  const searchParams = useSearchParams();
  const { user, switchRole } = useAuth();

  const currentRole = (searchParams.get("currentRole") as UserRole) || user?.role;
  const requiredRole = searchParams.get("requiredRole");

  return (
    <div
      dir="rtl"
      className="min-h-screen flex items-center justify-center p-6 bg-slate-50 text-slate-900 font-cairo"
    >
      <div className="w-full max-w-md p-8 bg-white border border-slate-200 rounded-3xl shadow-sm text-center">
        <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shadow-inner">
          <ShieldAlert className="w-9 h-9" />
        </div>

        <span className="inline-block px-3 py-1 mb-3 text-xs font-bold rounded-full bg-rose-100 text-rose-700">
          غير مصرح بالوصول (403 Forbidden)
        </span>

        <h1 className="text-2xl font-black text-slate-900 mb-2">
          صلاحياتك الحالية لا تسمح بهذا الإجراء
        </h1>

        <p className="text-sm text-slate-500 mb-6 leading-relaxed">
          يتطلب هذا القسم الإداري صلاحيات ومستوى وصول أعلى من المسند لحسابك الحالي.
        </p>

        {currentRole && (
          <div className="mb-6 p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-right">
            <div className="flex items-center gap-2 mb-1 text-xs text-slate-500 font-semibold">
              <UserCheck className="w-3.5 h-3.5 text-teal-600" />
              <span>الحساب النشط حالياً:</span>
            </div>
            <div className="text-sm font-bold text-slate-800">
              {user?.fullName || "مستخدم إداري"}
            </div>
            <div className="text-xs text-teal-700 font-medium">
              الرتبة: {ROLE_DEFINITIONS[currentRole]?.title || currentRole}
            </div>
          </div>
        )}

        {/* Quick Role Switcher for Demo testing */}
        <div className="mb-6 pt-4 border-t border-slate-100 text-right">
          <span className="block text-xs font-bold text-slate-700 mb-2 flex items-center gap-1.5">
            <RefreshCw className="w-3.5 h-3.5 text-teal-600" />
            <span>تبديل الرتبة الإدارية (لأغراض المراجعة):</span>
          </span>
          <div className="grid grid-cols-3 gap-2">
            {(["vice_principal", "principal", "auditor"] as UserRole[]).map((r) => (
              <button
                key={r}
                onClick={() => switchRole(r)}
                className={`py-2 px-1 text-xs font-bold rounded-xl border transition-colors ${
                  currentRole === r
                    ? "bg-teal-600 text-white border-teal-600"
                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                }`}
              >
                {r === "vice_principal" && "وكيلة"}
                {r === "principal" && "مديرة"}
                {r === "auditor" && "مدققة"}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2.5">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 w-full px-5 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm transition-colors shadow-sm"
          >
            <span>العودة إلى لوحة التحكم</span>
            <ArrowRight className="w-4 h-4 rotate-180" />
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center justify-center gap-2 w-full px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors"
          >
            <span>تسجيل الدخول بحساب آخر</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function UnauthorizedPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center text-teal-800 font-cairo">
          جاري التحميل...
        </div>
      }
    >
      <UnauthorizedContent />
    </Suspense>
  );
}

