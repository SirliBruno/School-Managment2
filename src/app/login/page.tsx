"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { DEMO_ACCOUNTS, ROLE_DEFINITIONS } from "@/lib/auth/rbac";
import type { UserRole } from "@/types/security";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Alert } from "@/components/ui/Alert";
import { Checkbox } from "@/components/ui/Checkbox";
import {
  ShieldCheck,
  Lock,
  User,
  Eye,
  EyeOff,
  Building2,
  Sparkles,
  ArrowRight,
} from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get("returnUrl") || "/dashboard";

  const { login, isLoading: isAuthLoading } = useAuth();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Quick login handler for demo accounts
  const handleDemoSelect = async (role: UserRole) => {
    const demo = DEMO_ACCOUNTS[role];
    setIdentifier(demo.credentials.identifier);
    setPassword(demo.credentials.password);
    setErrorMessage(null);
    setIsSubmitting(true);

    const res = await login({
      identifier: demo.credentials.identifier,
      password: demo.credentials.password,
      rememberMe: true,
    });

    setIsSubmitting(false);
    if (res.success) {
      router.push(returnUrl);
    } else {
      setErrorMessage(res.error || "فشل تسجيل الدخول للحساب التجريبي");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const trimmedIdentifier = identifier.trim();
    if (!trimmedIdentifier) {
      setErrorMessage("يرجى إدخال اسم المستخدم أو البريد الإلكتروني الإداري");
      return;
    }

    if (!password) {
      setErrorMessage("يرجى إدخال كلمة المرور");
      return;
    }

    setIsSubmitting(true);
    const result = await login({
      identifier: trimmedIdentifier,
      password,
      rememberMe,
    });
    setIsSubmitting(false);

    if (result.success) {
      router.push(returnUrl);
    } else {
      setErrorMessage(result.error || "فشل تسجيل الدخول. يرجى التحقق من صحة البيانات.");
    }
  };

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-teal-950 flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8 font-cairo selection:bg-teal-500 selection:text-white"
    >
      {/* Background Decorative Accents */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-20">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-teal-500 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-emerald-500 blur-3xl" />
      </div>

      <div className="relative w-full max-w-lg">
        {/* Institutional Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-teal-500/10 border border-teal-500/30 text-teal-400 mb-4 shadow-inner">
            <Building2 className="w-8 h-8" />
          </div>
          <span className="block text-xs font-bold tracking-widest text-teal-400 mb-1">
            المملكة العربية السعودية • وزارة التعليم
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            منصة الغياب والمساءلات الإدارية
          </h1>
          <p className="text-sm text-slate-400 mt-2 font-medium">
            النظام الموحد لتوثيق الحضور وإصدار الإجراءات والمساءلات المدرسية
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100">
          <div className="flex items-center justify-between pb-5 mb-5 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-bold text-slate-900">تسجيل الدخول الإداري</h2>
              <p className="text-xs text-slate-500">أدخلي بيانات اعتماد الحساب المدرسي المعتمد</p>
            </div>
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>

          {errorMessage && (
            <div className="mb-5">
              <Alert
                variant="danger"
                title="خطأ في تسجيل الدخول"
                description={errorMessage}
                dismissible
                onDismiss={() => setErrorMessage(null)}
              />
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                label="اسم المستخدم أو البريد الإداري"
                id="identifier"
                type="text"
                placeholder="مثال: vice@school.edu.sa"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                disabled={isSubmitting || isAuthLoading}
                leftIcon={<User className="w-4 h-4" />}
                required
              />
            </div>

            <div>
              <div className="relative">
                <Input
                  label="كلمة المرور"
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isSubmitting || isAuthLoading}
                  leftIcon={<Lock className="w-4 h-4" />}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-8 text-slate-400 hover:text-slate-600 transition-colors"
                  aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <Checkbox
                id="rememberMe"
                label="تذكر جلسة العمل على هذا المتصفح"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full h-12 text-base font-bold shadow-lg shadow-teal-700/20"
              isLoading={isSubmitting || isAuthLoading}
              disabled={isSubmitting || isAuthLoading}
            >
              <span>دخول إلى لوحة التحكم</span>
              <ArrowRight className="w-4 h-4 rotate-180 mr-1.5" />
            </Button>
          </form>

          {/* Quick Demo Switcher Section */}
          <div className="mt-8 pt-6 border-t border-slate-100">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span className="text-xs font-bold text-slate-700">
                تسجيل سريع لحسابات الأدوار الإدارية (للتجربة والتقييم):
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {(["vice_principal", "principal", "auditor"] as UserRole[]).map((role) => {
                const def = ROLE_DEFINITIONS[role];
                return (
                  <button
                    key={role}
                    type="button"
                    onClick={() => handleDemoSelect(role)}
                    disabled={isSubmitting || isAuthLoading}
                    className="flex flex-col items-center justify-center p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-teal-50/60 hover:border-teal-300 transition-all text-center group disabled:opacity-60"
                  >
                    <span className="text-xs font-bold text-slate-900 group-hover:text-teal-900 transition-colors">
                      {role === "vice_principal" && "وكيلة المدرسة"}
                      {role === "principal" && "مديرة المدرسة"}
                      {role === "auditor" && "مدققة المتابعة"}
                    </span>
                    <span className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">
                      {role === "vice_principal" && "تسجيل ومساءلات"}
                      {role === "principal" && "اعتماد شامل"}
                      {role === "auditor" && "سجل التدقيق"}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Security & Compliance Footer */}
        <div className="text-center mt-6 text-xs text-slate-400 leading-relaxed">
          <p>
            نظام إداري رسمي محمي ومشفر • يحظر الدخول لغير المصرح لهن وفق ضوابط الأمن السيبراني.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-900 flex items-center justify-center text-teal-400 font-cairo">
          جاري تحميل صفحة الدخول...
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
