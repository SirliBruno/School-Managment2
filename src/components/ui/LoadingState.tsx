import React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/utils/cn";

export interface LoadingStateProps {
  message?: string;
  className?: string;
}

export function LoadingState({
  message = "جاري تحميل البيانات الإدارية...",
  className,
}: LoadingStateProps) {
  return (
    <div
      dir="rtl"
      className={cn(
        "flex flex-col items-center justify-center p-12 text-center bg-white rounded-2xl border border-slate-200 shadow-sm",
        className
      )}
    >
      <div className="w-12 h-12 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-600 mb-4">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
      <p className="text-sm font-semibold text-slate-700">{message}</p>
      <span className="text-xs text-slate-400 mt-1">يرجى الانتظار لحظات</span>
    </div>
  );
}
