import React from "react";
import { CheckCircle2 } from "lucide-react";
import { cn } from "@/utils/cn";
import { Card, CardContent } from "./Card";

export interface SuccessScreenProps {
  title: string;
  description: string;
  referenceNumber?: string;
  actions?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

export function SuccessScreen({
  title,
  description,
  referenceNumber,
  actions,
  children,
  className,
}: SuccessScreenProps) {
  return (
    <Card className={cn("max-w-xl mx-auto text-center border-emerald-100", className)}>
      <CardContent className="p-8 sm:p-10" dir="rtl">
        <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto mb-5 shadow-xs">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        <h3 className="text-lg md:text-xl font-black text-slate-900 mb-2">{title}</h3>
        <p className="text-xs md:text-sm text-slate-500 leading-relaxed max-w-md mx-auto mb-6">
          {description}
        </p>

        {referenceNumber && (
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono font-bold text-slate-700 mb-6 select-all">
            <span className="text-slate-400 font-sans font-normal text-[11px]">رقم القيد الإداري:</span>
            <span>{referenceNumber}</span>
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
