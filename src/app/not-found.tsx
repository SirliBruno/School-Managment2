import Link from "next/link";
import { FileQuestion, ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <div
      dir="rtl"
      className="min-h-screen flex items-center justify-center p-6 bg-slate-50 text-slate-900 font-cairo"
    >
      <div className="w-full max-w-md p-8 bg-white border border-slate-200 rounded-3xl shadow-sm text-center">
        <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
          <FileQuestion className="w-9 h-9" />
        </div>
        <span className="inline-block px-3 py-1 mb-3 text-xs font-bold rounded-full bg-slate-100 text-slate-600">
          خطأ 404
        </span>
        <h1 className="text-2xl font-black text-slate-900 mb-2">
          الصفحة المطلوبة غير موجودة
        </h1>
        <p className="text-sm text-slate-500 mb-6 leading-relaxed">
          عذراً، الرابط الذي تحاول الوصول إليه غير موجود أو تم نقله ضمن التحديثات الإدارية.
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
