import Link from "next/link";
import { ShieldAlert, ArrowRight } from "lucide-react";

export default function UnauthorizedPage() {
  return (
    <div
      dir="rtl"
      className="min-h-screen flex items-center justify-center p-6 bg-slate-50 text-slate-900 font-cairo"
    >
      <div className="w-full max-w-md p-8 bg-white border border-slate-200 rounded-3xl shadow-sm text-center">
        <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
          <ShieldAlert className="w-9 h-9" />
        </div>
        <span className="inline-block px-3 py-1 mb-3 text-xs font-bold rounded-full bg-rose-100 text-rose-700">
          غير مصرح 403
        </span>
        <h1 className="text-2xl font-black text-slate-900 mb-2">
          لا تملك صلاحية الوصول
        </h1>
        <p className="text-sm text-slate-500 mb-6 leading-relaxed">
          يتطلب هذا القسم الإداري صلاحيات مديرة المدرسة أو مسؤولة المتابعة الإدارية.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 w-full px-5 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm transition-colors shadow-sm"
        >
          <span>العودة للرئيسية</span>
          <ArrowRight className="w-4 h-4 rotate-180" />
        </Link>
      </div>
    </div>
  );
}
