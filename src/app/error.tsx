"use client";

import { useEffect } from "react";
import { AlertOctagon, RotateCcw } from "lucide-react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("App error:", error);
  }, [error]);

  return (
    <div
      dir="rtl"
      className="min-h-screen flex items-center justify-center p-6 bg-slate-50 text-slate-900 font-cairo"
    >
      <div className="w-full max-w-md p-8 bg-white border border-rose-100 rounded-3xl shadow-sm text-center">
        <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
          <AlertOctagon className="w-9 h-9" />
        </div>
        <span className="inline-block px-3 py-1 mb-3 text-xs font-bold rounded-full bg-rose-100 text-rose-700">
          خطأ خادم 500
        </span>
        <h1 className="text-2xl font-black text-slate-900 mb-2">
          تعذر معالجة الطلب
        </h1>
        <p className="text-sm text-slate-500 mb-6 leading-relaxed">
          حدث خطأ أثناء معالجة البيانات الإدارية. يرجى إعادة المحاولة أو التواصل مع الدعم الفني.
        </p>
        <button
          type="button"
          onClick={() => reset()}
          className="inline-flex items-center justify-center gap-2 w-full px-5 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm transition-colors shadow-sm"
        >
          <RotateCcw className="w-4 h-4" />
          <span>إعادة المحاولة</span>
        </button>
      </div>
    </div>
  );
}
