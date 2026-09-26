import React from "react";
import { Check, Clock, AlertCircle } from "lucide-react";
import { cn } from "@/utils/cn";

export interface TimelineItem {
  id: string;
  title: string;
  timestamp: string;
  description?: string;
  status: "completed" | "current" | "pending" | "error";
  badgeText?: string;
}

export interface TimelineProps {
  items: TimelineItem[];
  className?: string;
}

export function Timeline({ items, className }: TimelineProps) {
  const getIcon = (status: TimelineItem["status"]) => {
    switch (status) {
      case "completed":
        return <Check className="w-3.5 h-3.5 text-white stroke-[3]" />;
      case "current":
        return <Clock className="w-3.5 h-3.5 text-teal-600 animate-pulse" />;
      case "error":
        return <AlertCircle className="w-3.5 h-3.5 text-white" />;
      case "pending":
      default:
        return <div className="w-2 h-2 rounded-full bg-slate-300" />;
    }
  };

  const getIndicatorStyles = (status: TimelineItem["status"]) => {
    switch (status) {
      case "completed":
        return "bg-emerald-600 border-emerald-600";
      case "current":
        return "bg-teal-50 border-teal-600 ring-4 ring-teal-100";
      case "error":
        return "bg-rose-600 border-rose-600";
      case "pending":
      default:
        return "bg-white border-slate-300";
    }
  };

  return (
    <div className={cn("relative", className)} dir="rtl">
      <div className="space-y-6 relative before:absolute before:inset-0 before:right-[15px] before:w-0.5 before:bg-slate-200">
        {items.map((item) => (
          <div key={item.id} className="relative flex items-start gap-4 group">
            {/* Step Node */}
            <div
              className={cn(
                "relative z-10 w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 transition-all",
                getIndicatorStyles(item.status)
              )}
            >
              {getIcon(item.status)}
            </div>

            {/* Content */}
            <div className="flex-1 pt-1 text-right">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <h4
                  className={cn(
                    "text-xs md:text-sm font-bold",
                    item.status === "current" ? "text-teal-700" : "text-slate-900"
                  )}
                >
                  {item.title}
                </h4>
                <time className="text-[11px] text-slate-400 font-medium">{item.timestamp}</time>
              </div>

              {item.description && (
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{item.description}</p>
              )}

              {item.badgeText && (
                <span className="inline-block mt-2 px-2 py-0.5 text-[10px] font-bold rounded-md bg-slate-100 text-slate-600">
                  {item.badgeText}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
