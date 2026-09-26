import React from "react";
import { AlertOctagon } from "lucide-react";
import { cn } from "@/utils/cn";
import { Card, CardContent } from "./Card";

export interface ErrorScreenProps {
  title?: string;
  description?: string;
  errorCode?: string;
  actions?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

export function ErrorScreen({
  title = "تعذر إتمام الإجراء الإداري",
  description = "حدث خطأ أثناء معالجة الطلب في النظام. يرجى التحقق من الاتصال وإعادة المحاولة.",
  errorCode,
  actions,
  children,
  className,
}: ErrorScreenProps) {
  return (
    <Card className={cn("max-w-xl mx-auto text-center border-rose-100", className)}>
      <CardContent className="p-8 sm:p-10" dir="rtl">
        <div className="w-16 h-16 rounded-3xl bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center mx-auto mb-5 shadow-xs">
          <AlertOctagon className="w-9 h-9" />
        </div>

        <h3 className="text-lg md:text-xl font-black text-slate-900 mb-2">{title}</h3>
        <p className="text-xs md:text-sm text-slate-500 leading-relaxed max-w-md mx-auto mb-6">
          {description}
        </p>

        {errorCode && (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-rose-50 border border-rose-200 text-xs font-mono font-bold text-rose-700 mb-6">
            <span>رمز الخطأ:</span>
            <span>{errorCode}</span>
          </div>
        )}

        {children && <div className="mb-6">{children}</div>}

        {actions && (
          <div className="flex items-center justify-center gap-3 flex-wrap">
            {actions}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
