import React from "react";
import { Inbox } from "lucide-react";
import { cn } from "@/utils/cn";

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      dir="rtl"
      className={cn(
        "flex flex-col items-center justify-center p-8 text-center bg-white rounded-2xl border border-dashed border-slate-300",
        className
      )}
    >
      <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 mb-4">
        {icon || <Inbox className="w-7 h-7" />}
      </div>
      <h4 className="text-base font-bold text-slate-900 mb-1">{title}</h4>
      {description && (
        <p className="text-xs text-slate-500 max-w-sm mb-5 leading-relaxed">{description}</p>
      )}
      {action && <div>{action}</div>}
    </div>
  );
}
